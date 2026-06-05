import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const PasswardInput = ({ onChange, value, placeHolder }) => {
  const [showPassword, setShowpassword] = useState(false);
  return (
    <div className="w-full text-sm  bg-transparent rounded  px-5 py-3 mb-4 border-[1.5px]  outline-none text-black">
      <input
        onChange={onChange}
        value={value}
        type={showPassword ? "text" : "password"}
        placeholder={placeHolder || "Password"}
        className="outline-none w-[93%] "
      />
      <button
        type="button"
        className="w-[5%]"
        onClick={() => {
          setShowpassword(!showPassword);
        }}
      >
        {showPassword ? (
          <FaEye className="text-primary text-xl" />
        ) : (
          <FaEyeSlash className="text-secondary text-xl" />
        )}
      </button>
    </div>
  );
};

export default PasswardInput;
