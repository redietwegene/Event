import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { base_url } from "./service/auth/apiend";
import pic from "../../assets/search.png";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedpassword, setConfirmedPassword] = useState("");
  const [role, setRole] = useState("participant");
  const [showPassword, setShowpassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglevisibility = () => {
    setShowpassword(!showPassword);
  };

  const signupMutation = useMutation({
    mutationFn: async ({ name, email, password, role }) => {
      const response = await axios.post(`${base_url}/register`, {
        name,
        email,
        password,
        role,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data);
      navigate('/login');
    },
    onError: (error) => {
      console.error("Signup error:", error);
    },
  });

  const handleSignup = () => {
    if (password !== confirmedpassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    signupMutation.mutate({ name, email, password, role });
  };

  return (
    <div className="flex flex-col justify-center w-screen items-center">
      <div className="flex justify-center gap-4">
        <p className="font-poppins text-30 font-semibold pt-3">Join Us Today!</p>
      </div>
      <div className="flex justify-center gap-2 py-2 w-[31%] border rounded-lg focus:outline-none focus:border-gray-500 mb-3">
        <img src={pic} alt="google logo" className="w-6" />
        <p className="text-customColor-2 font-bold">Sign up with Google</p>
      </div>
      <div className="flex items-center w-[31%] mb-2">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="px-4 text-gray-700">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <div className="w-[31%]">
        <div className="flex w-full gap-3">
          <div className="w-full">
            <label className="block text-customColor-1 text-[11pt] font-medium">Name</label>
            <input
              className="w-[11rem] p-2 pl-2 placeholder:text-[11pt] border rounded-lg focus:outline-none focus:border-gray-500 mb-3"
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full">
          <label className="block text-customColor-1 text-[11pt] font-medium">Email Address</label>
          <input
            className="placeholder:text-[11pt] w-full p-2 pl-2 border rounded-lg focus:outline-none focus:border-gray-500"
            type="text"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full">
          <label className="block text-[11pt] text-customColor-1 font-medium">Password</label>
          <div className="relative">
            <input
              className="p-2 w-full placeholder:text-[11pt] pl-2 border rounded-lg mb-3"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-3 -translate-x-7 text-gray-500"
              onClick={togglevisibility}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </button>
          </div>
        </div>
        <div className="w-full">
          <label className="block text-[11pt] text-customColor-1 font-medium">Confirm Password</label>
          <div className="relative">
            <input
              className="p-2 w-full pl-2 border rounded-lg w-96"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={confirmedpassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-3 -translate-x-7 text-gray-500"
              onClick={togglevisibility}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </button>
          </div>
          <div>
            {errorMessage && (
              <p className="text-red-500 font-bold mb-3">{errorMessage}</p>
            )}
          </div>
        </div>
        <div className="w-full">
          <label className="block text-[11pt] text-customColor-1 font-medium">Role</label>
          <select
            className="p-2 w-full placeholder:text-[11pt] pl-2 border rounded-lg mb-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="participant">Participant</option>
            <option value="organizer">Organizer</option>
          </select>
        </div>
        <div className="mb-6">
          <button
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
            onClick={handleSignup}
          >
            Signup
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <p className="text-gray-500">Already have an account?</p>
          <Link to="/login" className="text-customColor-0">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;