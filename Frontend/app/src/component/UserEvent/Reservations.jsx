import React from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base_url } from '../auth/service/auth/apiend';
import AuthService from '../auth/service/auth/auth';

const fetchReservations = async () => {
  const token = AuthService.getToken();
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${base_url}/rsvps`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

const cancelReservation = async (rsvpsId) => {
  const token = AuthService.getToken();
  if (!token) {
    throw new Error('No token found');
  }

  await axios.delete(`${base_url}/rsvps/${rsvpsId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

const ReservationList = () => {
  const queryClient = useQueryClient();

  const { data: rsvps, error, isLoading } = useQuery({
    queryKey: ['rsvps'],
    queryFn: fetchReservations
  });

  const mutation = useMutation({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries(['rsvps']);
    }
  });

  const handleCancel = (reservationId) => {
    mutation.mutate(reservationId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
      {mutation.isError && <p className="text-red-500 mb-4">Failed to cancel reservation. Please try again.</p>}
      <ul>
        {rsvps.map(reservation => (
          <li key={reservation.id} className="mb-4">
            <h3 className="text-xl font-bold">{reservation.event.title}</h3>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleCancel(reservation.id)}
            >
              Cancel Reservation
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationList;