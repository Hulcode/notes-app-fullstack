import React from "react";
import { firstLetter } from "../utilts/helper";
const ProfileInfo = ({ onLogout, userInfo }) => {
  return (
    <div className="flex items-center flex-row gap-3">
      <div className="uppercase font-semibold text-lg  h-12 w-12 flex items-center justify-center rounded-full text-slate-950 bg-slate-100">
        {userInfo && firstLetter(userInfo?.fullName)}
      </div>
      <div className="flex items-center flex-col">
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
        <button className="underline font-medium text-sm  " onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
