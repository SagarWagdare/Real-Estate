import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // const navigate = useNavigate();
  const [file, setFile] = useState(undefined);
  const [showListingsError, setShowListingsError] = useState(false);
  console.log("👉 ~ Profile ~ showListingsError⭐", showListingsError);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userlistings, setUserListings] = useState([]);
  console.log("👉 ~ Profile ~ userlistings⭐", userlistings);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("upload is" + progress + "percent done");
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            avatar: downloadURL,
          });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());
    await axios
      .post(`/api/user/update/${currentUser?._id}`, formData)
      .then((res) => {
        dispatch(updateUserSuccess(res?.data));
        setUpdateSuccess(true);
      })
      .catch((err) => {
        console.log(err);
        dispatch(updateUserFailure(err?.message));
      });
  };

  const handleDeleteUser = async () => {
    dispatch(deleteUserStart());
    await axios
      .delete(`/api/user/delete/${currentUser._id}`)
      .then((res) => {
        console.log(res);
        dispatch(deleteUserSuccess(res));
      })
      .catch((err) => {
        dispatch(deleteUserFailure(err.message));
      });
  };

  const handleSignOut = async () => {
    dispatch(deleteUserStart());
    await axios
      .get("/api/auth/signout")
      .then((res) => {
        console.log(res);
        dispatch(deleteUserSuccess(res));
      })
      .catch((err) => {
        console.log(err), dispatch(deleteUserFailure(err?.message));
      });
  };

  const handleShowListings = async () => {
    try {
      await axios
        .get(`/api/user/listings/${currentUser._id}`)
        .then((res) => {
          console.log(res);
          setUserListings(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      setShowListingsError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form
        action=""
        className="flex justify-center flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData?.avatar || currentUser.avatar}
          alt="user-image"
          className="w-24 h-24 rounded-full object-cover self-center hover:opacity-80 hover:border hover:border-blue-500  cursor-pointer "
        />
        <p className="text-center text-sm font-semibold">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less than 2 mb)
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span>{`uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="username"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.username}
          onChange={handleChange}
          placeholder="username"
        />
        <input
          type="email"
          id="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
          placeholder="email"
        />
        <input
          type="password"
          id="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white text-center p-3 rounded-lg uppercase"
        >
          create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Delete account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-600 text-sm text-center font-semibold">
        {error ? error : ""}
      </p>
      <p className="text-green-600 text-sm text-center font-semibold">
        {updateSuccess ? "user is updated successfully!" : ""}
      </p>
      <button className="text-green-700 w-full" onClick={handleShowListings}>
        Show listings
      </button>
      {showListingsError && (
        <p className="text-sm text-red-700 mt-5">Error Showing Listings</p>
      )}

      {userlistings && userlistings.length > 0 ? (
        <div>
          <h1 className="text-center mt-5 text-2xl font-semibold">Your Listings</h1>
          {userlistings.map((listings) => (
            <div
              key={listings._id}
              className="flex justify-between items-center p-3 gap-4"
            >
              <Link to={`/listings/${listings._id}`}>
                <img
                  className="w-16 h-16 object-contain "
                  src={listings?.imageUrls[0]}
                  alt="listing-image"
                />
              </Link>
              <Link
                className="font-semibold text-slate-700 flex-1 hover:underline truncate"
                to={`/listings/${listings._id}`}
              >
                <p>{listings?.name}</p>
              </Link>
              <div className="flex flex-col items-center font-semibold">
                <button className="text-red-700 uppercase">Delete</button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))}
        </div>
      ):<div>
        No listing found</div>}
    </div>
  );
};

export default Profile;
