import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  function keyDownHandle(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }
  return (
    <div className="bg-slate-100 w-80 px-4 rounded-md flex items-center ">
      <input
        type="text"
        placeholder="Search Note"
        className=" py-[11px] outline-none  text-sm  w-full bg-transparent"
        onChange={onChange}
        value={value}
        onKeyDown={keyDownHandle}
      ></input>{" "}
      {value && (
        <IoMdClose
          className="cursor-pointer text-lg text-gray-500 hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="cursor-pointer  text-gray-500 hover:text-black "
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
