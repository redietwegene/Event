import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from './auth/service/auth/auth'; // Import AuthService to check authentication status

const Navbar = () => {
  const isLoggedIn = AuthService.isAuthenticated(); // Check if the user is authenticated
  const userId = AuthService.getUserId(); // Get the user ID from the authentication service
  const navigate = useNavigate();
  const role = AuthService.getRole();
  
  console.log("User role:", role);
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-4xl font-bold pl-36">
          <h2>Events</h2>
        </div>
        <div>
          <ul className="flex space-x-8 pr-20">
            <li>
              <Link to="/home" className="text-white hover:text-gray-400">Home</Link>
            </li>
            <li>
                <div className="container mx-auto flex justify-between items-center">
       
        <div className="flex space-x-4">
          {role === 'organizer' ? (
            <>
              <Link to="/events" className="text-white"> Events</Link>
            </>
          ) : (
            <>
              <Link to="/eventlist" className="text-white"> Events</Link>
            </>
          )}
       
        </div>
      </div>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-gray-400">About</Link>
            </li>
            <li>
              <Link to="/contact" className="text-white hover:text-gray-400">Contact</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to={`/profile/${userId}`} className="text-white hover:text-gray-400">Profile</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-white hover:text-gray-400">Logout</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;