import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { base_url } from "./service/auth/apiend";
import AuthService from "./service/auth/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await axios.post(`${base_url}/login`, {
        email,
        password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const { access_token,user } = data;
      AuthService.setToken(access_token,user.role, true); // Store only the token in localStorage
      navigate("/home");
    },
    onError: (error) => {
      console.log("Login error:", error);
    },
  });

  const handleLogin = () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="w-1/3 bg-gray-800 flex flex-col justify-center items-center">
        <div className="text-white text-4xl font-bold mb-4">Event</div>
        <p className="text-white text-lg">Welcome back! Please login to your account.</p>
      </div>
      <div className="w-2/3 flex flex-col justify-center items-center">
        <div className="w-1/2">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={toggleVisibility}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-800">
              Forgot password?
            </Link>
          </div>
          <div className="mb-6">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Don't have an account?</p>
            <Link to="/signup" className="text-sm text-gray-800 hover:text-gray-700">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;