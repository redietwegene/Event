import React from 'react'
import pic from '../assets/pic.jpg'

const Landingpage = () => {
  return (
    <>
      <div className="relative w-full h-screen overflow-hidden">
        <img
          src={pic}
          alt="home"
          className=" absolute top-0 left-0 w-full h-full object-cover blur-sm"
        />
        <div className="relative z-10 flex  flex-row items-center justify-center h-full">
         
               <h1 className=" text-white  text-4xl font-sans ">Welcome to Qene Events</h1>
        
               <p className='text-blue-400 '>Effortlessly create, manage, and promote events. Organize public or private
               events, track participants, and keep everything streamlined in one place.</p>

         
       
        </div>
      </div>
    </>
  )
}

export default Landingpage