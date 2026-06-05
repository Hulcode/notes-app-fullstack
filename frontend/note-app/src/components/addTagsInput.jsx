import React from "react";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
const AddTagsInput = ({ tags, setTags }) => {
  const [tagVal, setTagVal] = useState("");
  function addHandler() {
    if (tagVal.trim()) {
      setTags([...tags, tagVal.trim()]);
      setTagVal("");
    }
  }
  function keyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addHandler();
    }
  }
  function removeHandler(tagToRemove) {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }
  return (
    <div className="flex mt-3 flex-col gap-2.5 ">
      <div className="my-2">
        {tags.map((tag) => {
          return (
            <span
              key={tag}
              className="py-1 px-2 bg-slate-200 rounded-md mr-1.5  mt-2 inline-block"
            >
              {tag}{" "}
              <button
                onClick={() => {
                  removeHandler(tag);
                }}
              >
                <IoMdClose className="mb-[-3px]" />
              </button>
            </span>
          );
        })}
      </div>
      <label htmlFor="" className="input-label">
        Tags
      </label>
      <div className="flex items-center  gap-4">
        <input
          className="outline-none text-sm mb-3 border-slate-300 border-2 text-slate-950 bg-transparent rounded p-2"
          type="text"
          placeholder="Add Tage"
          value={tagVal}
          onChange={(e) => setTagVal(e.target.value)}
          onKeyDown={(e) => {
            keyDown(e);
          }}
        />
        <button
          onClick={addHandler}
          className="hover:text-white mt-[-8px] hover:bg-blue-800 rounded h-7 w-7 flex items-center justify-center text-slate-950 outline-1"
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default AddTagsInput;
