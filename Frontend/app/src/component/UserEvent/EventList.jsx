import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../auth/service/auth/apiend';
import AuthService from '../auth/service/auth/auth';
import { Link, useNavigate } from 'react-router-dom';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${base_url}/events`);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to fetch events. Please try again.');
      }
    };

    fetchEvents();
  }, []);

  const handleReserve = async (eventId) => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(`${base_url}/rsvps`, { event_id: eventId }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      alert('Reservation successful');
      navigate('/rsvps');
    } catch (error) {
      console.error('Error reserving event:', error);
      setErrorMessage('Failed to reserve event. Please try again.');
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Event List</h2>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <ul>
        {events.map(event => (
          <li key={event.id} className="mb-4">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <p>{event.description}</p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleReserve(event.id)}
            >
              Reserve
            </button>
          </li>
        ))}
      </ul>
      <div>
        <Link to='/rsvps'>Reservation List</Link>
      </div>
    </div>
  );
};

export default EventList;