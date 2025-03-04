import React from 'react'
import './App.css'
import Navbar from './component/navbar'
import Home from './component/Home.jsx'
import About from './component/About.jsx'
import Contact from './component/contact'
import Login from './component/auth/login'
import Event from './component/Event/event'
import EditEvent from './component/Event/editEvent.jsx'
import CreateEvent from './component/Event/createEvent.jsx'
import Landingpage from './component/landingpage.jsx'
import Signup from './component/auth/signup.jsx'
import UserProfile from './component/profile.jsx'
import { Routes,Route} from 'react-router-dom'

function App() {


  return (
    <>
      <Navbar />
        
        <Routes>
          <Route path="/Login" element={ <Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path='/home' element={ <Home/>} />
          <Route path="/" element={<Landingpage/> } />
          <Route path ="/createEvent" element ={<CreateEvent/>}/>
          <Route path ="/contact" element ={<Contact/>}/>
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Event />} />
          <Route path="/edit-event/:eventId" element={<EditEvent />} />
          <Route path="/profile/:userId" element={<UserProfile />} />

        
         
         
        </Routes>
    
    </>
  )
}

export default App
