import React, { useEffect, useState } from "react";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
const UpdateListing = () => {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 0,
    bathrooms: 0,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
    userRef: currentUser._id,
  });

  const [imageUploadFailure, setImageUploadFailure] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        setUploading(true);
        setUploadError(false);
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadFailure(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadFailure("Image upload failed (2mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadFailure("You can only upload 6 images per listing");
      setUploading(false);
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent")
      setFormData({
        ...formData,
        type: e.target.id,
      });

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrls.length < 1)
      return setError("You must upload at least one image");
    if (formData.regularPrice < formData.discountPrice)
      return setError("Discount Price must be lower than regular price");
    setLoading(true);

    await axios
      .post(`/api/listing/update/${params?.listingId}`, formData)
      .then((res) => {
        navigate(`/listing/${res?.data?._id}`);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        setError(err?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      await axios
        .get(`/api/listing/get/${listingId}`)
        .then((res) => {
          setFormData(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchListing();
  }, []);

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="my-7 text-3xl text-center font-semibold">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            id="description"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            id="address"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 "
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 "
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5 "
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 "
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 "
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                className="p-3 border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                className="p-3 border-gray-300 rounded-lg"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Regular Price</span>
                <span className="text-sm">($/Month)</span>
              </div>
            </div>
            {formData?.offer && (
              <div className="flex items-center gap-2 ">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  className="p-3 border-gray-300 rounded-lg"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <span>Discounted Price</span>
                  <span className="text-sm">($/Month)</span>
                </div>
              </div>
            )}
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
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((urls, index) => (
              <div
                key={index}
                className="flex justify-between p-3 items-center"
              >
                <img
                  src={urls}
                  alt="listing-image"
                  className="w-25 h-20 object-contain rounded-lg "
                />
                <button
                  type="button"
                  className="text-red-700 rounded-lg uppercase hover:opacity-75"
                  onClick={() => handleRemoveImage(index)}
                >
                  Delete
                </button>
              </div>
            ))}
          <p className="text-red-700 text-sm font-semibold">
            {imageUploadFailure && imageUploadFailure}
          </p>
          <button
            disabled={loading || uploading}
            className="p-3 rounded-lg hover:opacity-90 bg-slate-700 text-white disabled:opacity-40"
          >
            {loading ? "Updating..." : " Update Listing  "}
          </button>
          {error && (
            <span className="text-red-700 text-sm font-semibold">{error}</span>
          )}
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;