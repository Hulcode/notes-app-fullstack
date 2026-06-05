import React from "react";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import AddTagsInput from "./addTagsInput";
import { IoMdClose } from "react-icons/io";
import axiosInstance from "../utilts/axiosInstance";
const AddEditNotes = ({
  type,
  noteData,
  onClose,
  getNotes,
  handleOpenToast,
}) => {
  const [content, setContent] = useState(noteData?.content ?? "");
  const [title, setTitle] = useState(noteData?.title ?? "");
  const [tags, setTags] = useState(noteData?.tags ?? []);
  const [error, setError] = useState("");
  async function addHandler() {
    try {
      const res = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (res.data && !res.data.error) {
        handleOpenToast("add", "Note add!", true);
        getNotes();
        onClose(); // close modal
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note");
      handleOpenToast("add", "Failed to add note", false);
    }
  }
  async function updateHandler() {
    try {
      const res = await axiosInstance.put(`/update-note/${noteData._id}`, {
        title,
        content,
        tags,
      });

      if (res.data && !res.data.error) {
        getNotes();
        handleOpenToast("update", "Note updated!", true);
        onClose(); // close modal
      }
    } catch (err) {
      handleOpenToast("update", "Failed to updated note!", false);
      setError(err.response?.data?.message || "Failed to edit note");
    }
  }
  function inputsChecker() {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!content.trim()) {
      setError("Content is required");
      return false;
    }
    setError("");
    if (type == "add") {
      addHandler();
    } else if (type == "edit") {
      updateHandler();
    }
  }
  return (
    <>
      <div className="absolute top-4 right-4">
        <button className="text-xl text-slate-400" onClick={onClose}>
          {" "}
          <IoMdClose />
        </button>
      </div>
      <div>
        <div className="flex  flex-col gap-2.5">
          <label htmlFor="title" className="input-label">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            id="content"
            placeholder="title"
            className="outline-none  w-full text-slate-950 bg-slate-50 rounded p-2"
          />
        </div>
        <div className="flex mt-3 flex-col gap-2.5">
          <label htmlFor="content" className="input-label">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            name=""
            id="content"
            placeholder="Content"
            rows={10}
            type="text "
            className="outline-none text-sm w-full text-slate-950 bg-slate-50 rounded p-2"
          ></textarea>
        </div>
        <AddTagsInput tags={tags} setTags={setTags} />
        {error && <span className="text-red-500 text-sm">{error}</span>}

        <button
          onClick={() => {
            inputsChecker();
          }}
          type="button "
          className="w-full bg-primary text-white p-2 rounded"
        >
          {`${type == "add" ? "ADD" : "EDIT"}`}
        </button>
      </div>
    </>
  );
};

export default AddEditNotes;
