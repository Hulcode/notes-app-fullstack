import React from "react";
import ProfileInfo from "./profileInfo";
import SearchBar from "./searchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utilts/axiosInstance";

function Navbar({ userInfo, handleSearch, getNotes }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (searchQuery == "" && typeof getNotes === "function") {
      // ✅ guarded
      getNotes();
    }
  }, [searchQuery]);

  async function onLogout() {
    const res = await axiosInstance.post("/logout");
    navigate("/login");
  }

  return (
    <div className="px-6 py-2 flex items-center justify-between drop-shadow bg-white">
      <h2 className="text-xl font-semibold py-2 text-black">Notes</h2>
      {handleSearch && (
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          handleSearch={() => handleSearch(searchQuery)}
          onClearSearch={() => setSearchQuery("")}
        />
      )}
      {userInfo && <ProfileInfo onLogout={onLogout} userInfo={userInfo} />}
    </div>
  );
}

export default Navbar;
