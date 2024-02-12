import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
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
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] "
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
              <p className="z-10 rounded-md bg-white text-black p-2
              fixed top-[20%] right-[8%]">Link copied!</p>
            )}
        </>
      )}
    </main>
  );
};

export default Listing;
// navigator.clipboard.writeText(window.location.href);
