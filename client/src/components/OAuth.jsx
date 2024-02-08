import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { Provider, useDispatch } from "react-redux";
import axios from "axios";
import { signInSuccess } from "../redux/user/userSlice";
import {useNavigate} from "react-router-dom"
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provide = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth,provide)
      const userData = {
        name:result.user.displayName,
        email:result.user.email,
        photo:result.user.photoURL
      }
     await axios.post("/api/auth/google",userData).then((res)=>{
      dispatch(signInSuccess(res?.data))
      navigate("/")
     }).catch((err)=>{
      console.log(err)
     })
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex w-full items-center gap-1 justify-center rounded-md bg-white text-black px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      
      <FcGoogle />
      Continue with Google
    </button>
  );
};

export default OAuth;
