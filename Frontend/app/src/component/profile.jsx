import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { base_url } from './auth/service/auth/apiend';
import AuthService from './auth/service/auth/auth';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({
    name: '',
    email: '',
    profile_picture: '',
    bio: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${base_url}/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setErrorMessage('Failed to fetch user profile. Please try again.');
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profile_picture: file });
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('name', user.name);
      formData.append('email', user.email);
      formData.append('bio', user.bio);
      if (user.profile_picture instanceof File) {
        formData.append('profile_picture', user.profile_picture);
      }

      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found');
      }

      await axios.put(`${base_url}/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const defaultAvatar = 'https://via.placeholder.com/150'; // URL for the default avatar image

  return (
    <div className="flex flex-col justify-center w-screen items-center">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          {isEditing ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="file"
                  name="profile_picture"
                  onChange={handleProfilePictureChange}
                />
                {user.profile_picture && !(user.profile_picture instanceof File) && (
                  <img src={`/${user.profile_picture}`} alt="Profile" className="mt-4 w-32 h-32 rounded-full" />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Bio</label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  name="bio"
                  value={user.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p>{user.email}</p>
              <img
                src={user.profile_picture ? `/${user.profile_picture}` : defaultAvatar}
                alt="Profile"
                className="mt-4 w-32 h-32 rounded-full"
              />
              <p>{user.bio}</p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;