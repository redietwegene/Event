import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base_url } from '../auth/service/auth/apiend';
import AuthService from '../auth/service/auth/auth';


const fetchEvents = async () => {
  const response = await axios.get(`${base_url}/events`);
  return response.data;
};

const Event = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState('');

  const { data: events, error, isError, isLoading } = useQuery({
    queryKey: 'events',
    queryFn: fetchEvents,
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId) => {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found');
      }
      await axios.delete(`${base_url}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries('events');
    },
    onError: (error) => {
      console.error('Error deleting event:', error);
      setErrorMessage('Failed to delete event. Please try again.');
    },
  });

  const handleDeleteEvent = (eventId) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-center w-screen items-center">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Event List</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <ul>
          {events.map(event => (
            <li key={event.id} className="mb-4">
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p>{event.description}</p>
                <p>{event.location}</p>
                <p>{new Date(event.date_time).toLocaleString()}</p>
                <p>{event.is_public ? 'Public' : 'Private'}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => handleEditEvent(event.id)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
      <div>  
        <Link to="/createEvent"> CREATE EVENT</Link>
      </div>
    </div>
  );
};

export default Event;