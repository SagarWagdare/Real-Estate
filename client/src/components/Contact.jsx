import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  console.log("👉 ~ Contact ~ message⭐", message);
  useEffect(() => {
    const fetchLandlord = async () => {
      await axios
        .get(`/api/user/${listing.userRef}`)
        .then((res) => {
          setLandlord(res?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>
            for
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            onChange={handleMessageChange}
            name="message"
            id="message"
            rows="2"
            placeholder="Enter your message here..."
            className="w-full border p-3"
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message} `}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
