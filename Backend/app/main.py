from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import List, Optional
from models.model import User, Event, RSVP, Base, RoleEnum
from database import engine, get_db
import utility.jwt_auth as auth
from pydantic import BaseModel 
import jwt
import os


app = FastAPI()

# Enable CORS
origins = [
    "http://localhost:5173",  # Add your frontend URL here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic Schemas
class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: RoleEnum

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    profile_picture: Optional[str] = None
    bio: Optional[str] = None
    role: str

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_picture: Optional[str] = None
    bio: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    date_time: datetime = None
    is_public: bool = True

class EventUpdate(BaseModel):
    title: str
    description: str
    location: str
    date_time: datetime
    is_public: bool

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    date_time: str
    is_public: bool
    organizer_id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str
    

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        print(f"Token received: {token}")  # Log the token
        segments = token.split('.')
        if len(segments) != 3:
            print(f"Invalid token format: {token}")
            raise credentials_exception
        
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        print(f"Decoded payload: {payload}")  # Log the decoded payload
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            print("Invalid token: Missing user_id or role")
            raise credentials_exception
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            print("Invalid token: User not found")
            raise credentials_exception
        user.role = role  # Include the role in the user object
        print(f"Current user: {user}")  # Log user information
        return user
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print(f"Token validation error: {e}")
        raise credentials_exception

# Register user
@app.post("/register", response_model=TokenResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(email=user.email, password=hashed_password, name=user.name, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = auth.create_access_token(data={"sub": str(db_user.id), "role": db_user.role}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}
    

# Login user
@app.post("/login", response_model=TokenResponse)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = auth.create_access_token(data={"sub": str(db_user.id), "role": db_user.role}, expires_delta=timedelta(minutes=30))
    print(f"Logged-in user: ID={db_user.id}, Email={db_user.email}, Name={db_user.name}, Role={db_user.role}")
    return {"access_token": access_token, "token_type": "bearer", "user": db_user}

@app.post("/events", response_model=EventResponse)
def create_event(event: EventCreate, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        print(f"Token received: {token}")  # Log the token
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        print(f"Decoded payload: {payload}")  # Log the decoded payload
        user_id: str = payload.get("sub")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user is None or db_user.role != "organizer":
            raise HTTPException(status_code=403, detail="You do not have permission to create events")
        if event.date_time is None:
            event.date_time = datetime.utcnow()
        db_event = Event(**event.dict(), organizer_id=db_user.id)
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        db_event.date_time = db_event.date_time.isoformat()
        print(f"Event created by user: {db_user}")  # Log user information
        return db_event
    except jwt.ExpiredSignatureError:
        print("Token has expired")
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.PyJWTError as e:
        print(f"Token validation error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/events", response_model=List[EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    for event in events:
        event.date_time = event.date_time.isoformat()  # Convert datetime to string
    return events

@app.get("/events/{event_id}", response_model=EventResponse)
def get_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    db_event.date_time = db_event.date_time.isoformat()  # Convert datetime to string
    return db_event

# Update event (only for organizer)
@app.put("/events/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event: EventUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="You do not have permission to update events")
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    db_event.title = event.title
    db_event.description = event.description
    db_event.location = event.location
    db_event.date_time = event.date_time
    db_event.is_public = event.is_public
    db.commit()
    db.refresh(db_event)
    db_event.date_time = db_event.date_time.isoformat()  # Convert datetime to string
    return db_event

# Delete event (only for organizer)
@app.delete("/events/{event_id}", response_model=EventResponse)
def delete_event(event_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "organizer":
        raise HTTPException(status_code=403, detail="You do not have permission to delete events")
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    db_event.date_time = db_event.date_time.isoformat() 
    return db_event




















