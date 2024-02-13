import React from "react";
import { Link } from "react-router-dom";
import {MdLocationOn} from "react-icons/md"
const ListingItems = ({ listItem }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]" >
      <Link to={`/listing/${listItem._id}`}>
        <img
          src={listItem.imageUrls[0] || 'https://th.bing.com/th/id/OIP.E-W9CBaS7OQCT-LeNOepwwHaEv?rs=1&pid=ImgDetMain'}
          alt="listing-cover"
          className="h-[320px] sm:h-[220px] w-full  object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="truncate text-lg font-semibold text-slate-700">{listItem.name}</p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700 w-4 h-4"/>
            <p className="text-slate-600 truncate text-sm line">{listItem.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-700">{listItem.description}</p>
          <p className='text-slate-500 mt-2 font-semibold '>
            $
            {listItem.offer
              ? listItem.discountPrice.toLocaleString('en-US')
              : listItem.regularPrice.toLocaleString('en-US')}
            {listItem.type === 'rent' && ' / month'}
          </p>
         <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-sm">{listItem.bedrooms > 1 ? `${listItem.bedrooms} beds`:`${listItem.bedrooms} bed`}</div>
            <div className="font-bold text-sm">{listItem.bathrooms > 1 ? `${listItem.bathrooms} baths`:`${listItem.bathrooms} bath`}</div>
            
         </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItems;
