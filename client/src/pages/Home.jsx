import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import ListingItem from "../components/ListingItems"
import "swiper/css/bundle";
const Home = () => {
  SwiperCore.use([Navigation]);
  SwiperCore.use([Autoplay]);

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        await axios.get(`/api/listing/get?offer=true&limit=4`).then((res) => {
          setOfferListings(res?.data);
          fetchRentListings();
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        await axios.get(`/api/listing/get?type=rent&limit=4`).then((res) => {
          setRentListings(res?.data);
          fetchSaleListings();
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListings = async () => {
      try {
        await axios.get(`/api/listing/get?type=sale&limit=4`).then((res) => {
          setSaleListings(res?.data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 pt-20 pb-10 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-800 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-600">perfect </span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-lg">
          Sagar Estate will help you find your home fast, easy and comfortable.{" "}
          <br />
          Our expert support are always available.
        </div>
        <Link className=" text-blue-700 font-semibold hover:underline">
          Let&apos;s get started...
        </Link>
      </div>
      {offerListings && offerListings.length > 0 && (
        <Swiper
          navigation
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {offerListings.map((listItem) => (
            <SwiperSlide key={listItem._id}>
              <div
                className="sm:h-[520px] h-[300px] object-contain "
                style={{
                  background: `url(${listItem.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && <div>
          <div className="flex  flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-700">Recent Offers</h2>
            <Link className="my-2 font-semibold text-blue-800 hover:underline" to={`/search?offer=true`}>Show more offers</Link></div>
            <div className=" flex flex-wrap gap-4">
              {offerListings.map((listItem)=>(
                <ListingItem key={listItem._id} listItem={listItem} />
              ))}
            </div>
            </div>}
        {rentListings && rentListings.length > 0 && <div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-700">Recent places for rent</h2>
            <Link className="my-2 font-semibold text-blue-800 hover:underline" to={`/search?type=rent`}>Show more places for rent</Link></div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listItem)=>(
                <ListingItem key={listItem._id} listItem={listItem} />
              ))}
            </div>
            </div>}
        {saleListings && saleListings.length > 0 && <div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-slate-700">Recent places for sale</h2>
            <Link className="my-2 font-semibold text-blue-900 hover:underline" to={`/search?type=sale`}>Show more places for sale</Link></div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listItem)=>(
                <ListingItem key={listItem._id} listItem={listItem} />
              ))}
            </div>
            </div>}
      </div>
    </>
  );
};

export default Home;
