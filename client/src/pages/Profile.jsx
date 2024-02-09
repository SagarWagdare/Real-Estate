import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form action="" className="flex justify-center flex-col gap-4">
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
          className="w-24 h-24 rounded-full object-cover self-center"
        />
       <p className="text-center text-sm font-semibold">
       {fileUploadError ?
  <span className="text-red-700">
    Error image upload (image must be less than 2 mb)
  </span> :
  (filePercentage > 0 && filePercentage < 100 ?
    <span>{`uploading ${filePercentage}%`}</span> :
    (filePercentage === 100 ?
      <span className="text-green-700">Image successfully uploaded!</span> :
      ''
    )
  )
}

       </p>
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
