import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form action="" className="flex justify-center flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="user-image"
          className="w-24 h-24 rounded-full object-cover self-center"
        />
        <input
          type="text"
          id="username"
          className="border p-3 rounded-lg"
          placeholder="username"
        />
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          placeholder="email"
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="
        password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 font-semibold">Delete account</span>
        <span className="text-red-700 font-semibold">Log out</span>
      </div>
    </div>
  );
};

export default Profile;
