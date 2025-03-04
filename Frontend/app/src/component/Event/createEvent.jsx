import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { base_url } from '../auth/service/auth/apiend';
import AuthService from '../auth/service/auth/auth';

const CreateEvent = () => {
  const navigate = useNavigate();
  // const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const createEventMutation = useMutation({
    mutationFn: async ({  title, description, location, dateTime, isPublic }) => {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.post(`${base_url}/events`, {
        title,
        description,
        location,
        date_time: dateTime,
        is_public: isPublic,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log('Event created successfully:', data);
      navigate('/events');
    },
    onError: (error) => {
      console.error('Event creation error:', error);
      setErrorMessage('Failed to create event. Please try again.');
    },
  });

  const handleCreateEvent = () => {
    if ( !title || !description || !location || !dateTime) {
      setErrorMessage('All fields are required.');
      return;
    }
    createEventMutation.mutate({  title, description, location, dateTime, isPublic });
  };

  return (
    <div className="flex flex-col justify-center w-screen items-center">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">Create Event</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div> */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter event location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Date and Time</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Public Event</label>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </div>
        <div className="mb-6">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;