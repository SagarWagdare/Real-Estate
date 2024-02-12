import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Swiper,SwiperSlide} from "swiper/react" ;
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle'
const Listing = () => {
    SwiperCore.use([Navigation])
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [listingError, setListingError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      await axios
        .get(`/api/listing/get/${params.listingId}`)
        .then((res) => {
          setListing(res?.data);
          setLoading(false);
          setListingError(false)
        })
        .catch((err) => {
          setListingError(true);
          setLoading(false);
        });
    };
    fetchListing();
  }, []);

  return <main>
     {loading && <p className="text-center flex justify-center items-center my-7 text-2xl">Loading...</p>}
     {listingError && <p className="text-center flex justify-center items-center my-7 text-2xl">Something went wrong!</p>}
{
    listing && !loading && !listingError && (
       <>
       <Swiper navigation>
{
    listing.imageUrls.map((url)=>(
        <SwiperSlide key={url}>
<div className="h-[550px] " style={{background:`url(${url}) center no-repeat`,backgroundSize: 'cover'}}>

</div>
        </SwiperSlide>
    ))
}


       </Swiper>
       
       </>
    )
}

  </main>;
};

export default Listing;
