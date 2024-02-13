import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"
import { useEffect, useState } from "react";
const Header = () => {
  const {currentUser} = useSelector((state)=>state.user)
  const [searchTerm,setSearchTerm] = useState('');
const navigate = useNavigate()
  const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
navigate(`/search?${searchQuery}`)

  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFormUrl = urlParams.get('searchTerm');
    if(searchTermFormUrl){
      setSearchTerm(searchTermFormUrl)
    }

  }, [location.search])
  
  return (
    <header className="flex bg-slate-200 shadow-md justify-between items-center  mx-auto p-3">
      <Link to="/">
        <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
          <span className="text-red-900">Sagar</span>
          <span className="text-red-950">Estate</span>
        </h1>
      </Link>
      <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
        <input
          type="text"
          name=""
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
          value={searchTerm}
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
        <button>

        <FaSearch className="text-slate-500" />

        </button>
      </form>
      <ul className="flex gap-4 cursor-pointer">
        <Link to="/">
          <li className="hidden sm:inline text-slate-700 hover:underline hover:text-black">
            Home
          </li>
        </Link>

        <Link to="/about">
          <li className="hidden sm:inline text-slate-700 hover:underline hover:text-black">
            About
          </li>
        </Link>
        <Link to="/profile">
        {currentUser?(
          <img src={currentUser?.avatar} className="w-7 h-7 rounded-full object-cover" alt="user-image" />
  
  ):(
    <li className="hidden sm:inline text-slate-700 hover:underline hover:text-black">
    Sign in
  </li>
  )}
         
        </Link>
      </ul>
    </header>
  );
};

export default Header;
