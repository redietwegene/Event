import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { base_url } from '../auth/service/auth/apiend';
import AuthService from '../auth/service/auth/auth';

const fetchAllReservations = async () => {
  const token = AuthService.getToken();
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get(`${base_url}/all-rsvps`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const AllReservations = () => {
  const { data: rsvps, error, isError, isLoading } = useQuery({
    queryKey: ['allReservations'], // Ensure queryKey is an array
    queryFn: fetchAllReservations,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Reservations</h2>
      <ul>
        {rsvps && rsvps.length > 0 ? (
          rsvps.map(rsvp => (
            <li key={rsvp.id} className="mb-4">
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <h3 className="text-xl font-bold">{rsvp.event?.title}</h3>
                <p>{rsvp.event?.description}</p>
                <p>{rsvp.event?.location}</p>
                <p>{new Date(rsvp.event?.date_time).toLocaleString()}</p>
                <p>User: {rsvp.user?.name}</p>
                <p>Email: {rsvp.user?.email}</p>
              </div>
            </li>
          ))
        ) : (
          <li>No reservations found.</li>
        )}
      </ul>
    </div>
  );
};

export default AllReservations;