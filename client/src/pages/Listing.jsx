import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare, FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Autoplay } from "swiper/modules";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";
const Listing = () => {
  SwiperCore.use([Navigation]);
  SwiperCore.use([Autoplay]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [listingError, setListingError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      await axios
        .get(`/api/listing/get/${params.listingId}`)
        .then((res) => {
          setListing(res?.data);
          setLoading(false);
          setListingError(false);
        })
        .catch((err) => {
          setListingError(true);
          setLoading(false);
        });
    };
    fetchListing();
  }, []);

  return (
    <main>
      {loading && (
        <p className="text-center flex justify-center items-center my-7 text-2xl">
          Loading...
        </p>
      )}
      {listingError && (
        <p className="text-center flex justify-center items-center my-7 text-2xl">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !listingError && (
        <>
          <Swiper
            navigation
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="sm:h-[500px] h-[300px] object-contain "
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div>
            <FaShare
              className="w-12 rounded-full p-3 h-12  bg-white cursor-pointer hover:bg-slate-800 hover:text-white absolute top-[13%] z-10 right-[3%]"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p
              className="z-10 rounded-md bg-white text-black p-2
              fixed top-[20%] right-[8%]"
            >
              Link copied!
            </p>
          )}

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4 ">
            <p className="text-2xl font-semibold">
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && "/month"}
            </p>
            <p className="flex items-center text-slate-700 font-semibold">
              <FaLocationDot className="text-green-700" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-[200px] h-[40px] text-center rounded-lg text-white p-2">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-[200px] h-[40px] text-center rounded-lg text-white p-2">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <div>
              <span className="font-semibold">Description</span> -{" "}
              {listing.description}
            </div>
            <ul className="text-green-900 font-semibold flex items-center gap-4 flex-wrap">
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBed /> {listing.bedrooms} Beds
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaBath />
                {listing.bathrooms} Bath
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaParking />
                {listing.parking ? "Parking" : "No Parking"}
              </li>
              <li className="flex items-center gap-2 whitespace-nowrap">
                <FaChair />
                {listing.furnished ? "Full " : "Not "}
                Furnished
              </li>
            </ul>
            {currentUser && listing.userRef === currentUser._id && !contact &&(
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white p-3 rounded-lg uppercase"
              >
                Contact Landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};

export default Listing;
