import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItems from "../components/ListingItems";

const Search = () => {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [listing, setListing] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        searchTerm: e.target.value,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";

      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListing = async () => {
      setLoading(true);
      setShowMore(false)
      const searchQuery = urlParams.toString();
      await axios
        .get(`/api/listing/get?${searchQuery}`)
        .then((res) => {
          setListing(res?.data);
          if (res?.data?.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    fetchListing();
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideBarData.searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("furnished", sideBarData.furnished);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfLIstings = listing.length;
    const urlParams = new URLSearchParams(location.search);
    const startIndex = numberOfLIstings;
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    await axios
      .get(`/api/listing/get?${searchQuery}`)
      .then((res) => {
        if (res?.data.length < 9) {
          setShowMore(false);
        }
        setListing([...listing, ...res?.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sideBarData.searchTerm}
              onChange={handleChange}
              placeholder="Search.."
              className="p-3 w-full rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
                className="w-5"
              />
              <span> Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                checked={sideBarData.offer === true}
                onChange={handleChange}
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                checked={sideBarData.parking === true}
                onChange={handleChange}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                checked={sideBarData.furnished === true}
                onChange={handleChange}
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div>
            <label className="font-semibold p-1">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-slate-700 text-white p-3 hover:opacity-95 rounded-lg"
          >
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 mt-5">
          Listing results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listing.length === 0 && (
            <p className="text-xl text-slate-700 ">No Listing found!</p>
          )}
          {loading && (
            <p className="text-center text-xl text-slate-700">Loading...</p>
          )}

          {!loading &&
            listing &&
            listing.map((listItem) => (
              <ListingItems key={listItem._id} listItem={listItem} />
            ))}

          {showMore && (
            <button
              className="text-green-700 hover:underline p-7"
              onClick={onShowMoreClick}
            >
              Show more...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
