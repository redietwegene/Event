# filepath: /c:/Users/hp/Event/Backend/app/models/model.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class RoleEnum(str, enum.Enum):
    organizer = "organizer"
    participant = "participant"
    
    
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(Enum(RoleEnum), default=RoleEnum.participant)
    name = Column(String)
    profile_picture = Column(String, nullable=True)
    bio = Column(String, nullable=True)

    events = relationship("Event", back_populates="organizer")
    

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    location = Column(String)
    date_time = Column(DateTime)
    is_public = Column(Boolean, default=True)
    
    organizer_id = Column(Integer, ForeignKey("users.id"))
    organizer = relationship("User", back_populates="events")

class RSVP(Base):
    __tablename__ = "rsvps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    
    user = relationship("User")
    event = relationship("Event")
    
    
    
    
   