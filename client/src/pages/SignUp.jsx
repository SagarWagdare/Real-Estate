import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import OAuth from "../components/OAuth";
const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/auth/signup", formData)
      .then((res) => {
        setLoading(false);
        navigate("/sign-in");
      })
      .catch((err) => {
        setError(err?.response?.data?.message);
        setLoading(false);
      });
  };
  console.log(formData);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign Up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit} method="POST">
          <div>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="name"
                onChange={handleChange}
                required
                className="outline-none p-2 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="p-2 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between"></div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="p-2 block w-full rounded-md  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {/* <div className="text-sm text-end p-2">
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </a>
          </div> */}
          </div>
          <div className="text-sm pt-1 flex gap-1">
            <p>Already have an account?</p>
            <Link to="/sign-in" className="text-blue-800 font-semibold">
              Sign in
            </Link>
          </div>
          <div>
          <span className="text-red-600 ">{error}</span>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? "Loading..." : "Sign up"}
            </button>
          </div>
          
         <OAuth/>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
