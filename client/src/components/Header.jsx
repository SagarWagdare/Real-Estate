import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header className="flex bg-slate-200 shadow-md justify-between items-center  mx-auto p-3">
      <Link to="/">
        <h1 className="font-bold text-sm sm:text-2xl flex flex-wrap">
          <span className="text-red-900">Real</span>
          <span className="text-red-950">Estate</span>
        </h1>
      </Link>
      <form className="bg-slate-100 p-3 rounded-lg flex items-center">
        <input
          type="text"
          name=""
          placeholder="Search..."
          className="bg-transparent focus:outline-none w-24 sm:w-64"
        />
        <FaSearch className="text-slate-500" />
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

        <Link to="/sign-in">
          <li className="hidden sm:inline text-slate-700 hover:underline hover:text-black">
            Sign in
          </li>
        </Link>
      </ul>
    </header>
  );
};

export default Header;
