import React, { useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
const CreateListing = () => {
  const [files, setFiles] = useState([]);
  console.log("👉 ~ CreateListing ~ files⭐", files);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadFailure, setImageUploadFailure] = useState(false);
  const [uploading,setUploading] = useState(false);
  const [uploadError,setUploadError] = useState(false);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        setUploading(true)
        setUploadError(false)
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadFailure(false);
          setUploading(false)
        })
        .catch(() => {
          setImageUploadFailure("Image upload failed (2mb max per image)");
          setUploading(false)
        });
    } else {
      setImageUploadFailure("You can only upload 6 images per listing");
      setUploading(false)
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },

        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index)=>{
    setFormData({
      ...formData,
      imageUrls:formData.imageUrls.filter((_,i)=> i !== index) 
    })

  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="my-7 text-3xl text-center font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5 " />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5 " />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5 " />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5 " />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5 " />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bathroom"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-sm">($/Month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
              />
              <div className="flex flex-col items-center">
                <span>Discounted Price</span>
                <span className="text-sm">($/Month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover(max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              onChange={(e) => setFiles(e.target.files)}
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
             {uploading?'uploading...':"upload"} 
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div key={index} className="flex justify-between p-3 items-center">
                <img
                  src={urls}
                  alt="listing-image"
                  className="w-25 h-20 object-contain rounded-lg "
                />
                <button type="button" className="text-red-700 rounded-lg uppercase hover:opacity-75" onClick={()=>handleRemoveImage(index)}>Delete</button>
              </div>
            ))}
          <p className="text-red-700 text-sm font-semibold">
            {imageUploadFailure && imageUploadFailure}
          </p>
          <button className="p-3 rounded-lg hover:opacity-90 bg-slate-700 text-white">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
