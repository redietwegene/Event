import React from 'react';

const About = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="w-1/3 bg-gray-800 flex flex-col justify-center items-center">
        <div className="text-white text-4xl font-bold mb-4">About Us</div>
        <p className="text-white text-lg">Learn more about our mission and values.</p>
      </div>
      <div className="w-2/3 flex flex-col justify-center items-center">
        <div className="w-1/2">
          <div className="mb-6">
            <h2 className="text-gray-700 text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 text-lg">
              Our mission is to provide the best event management platform for organizers and participants.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-gray-700 text-2xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-700 text-lg">
              We value integrity, innovation, and inclusivity. We strive to create a platform that is accessible and beneficial to all users.
            </p>
          </div>
          <div className="mb-6">
            <h2 className="text-gray-700 text-2xl font-bold mb-4">Our Team</h2>
            <p className="text-gray-700 text-lg">
              Our team is composed of dedicated professionals who are passionate about event management and technology.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;