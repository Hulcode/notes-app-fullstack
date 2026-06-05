import React from "react";
import { MdPushPin } from "react-icons/md";
import { MdDelete, MdCreate } from "react-icons/md";
import { formatDate } from "../utilts/helper";
const NoteCard = ({
  title,
  date,
  content,
  tags = [],
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="font-bold">{title?.slice(0, 60)}</h6>
          <span className="text-sm text-slate-500">{formatDate(date)} </span>
        </div>
        <MdPushPin
          onClick={onPinNote}
          className={` ${isPinned ? "!text-primary" : "text-slate-300"} icon-btn !text-2xl`}
        ></MdPushPin>
      </div>
      <p className="text-sm text-slate-700 mt-2">{content?.slice(0, 100)}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center justify-between mt-2">
          {tags.map((tag) => {
            return (
              <span
                className="text-sm text-slate-500 m-1 rounded-md p-1 bg-gray-300"
                key={tag}
              >
                #{tag?.slice(0, 60)}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-primary"
            onClick={onEdit}
          ></MdCreate>{" "}
          <MdDelete
            className="icon-btn hover:!text-red-600"
            onClick={onDelete}
          ></MdDelete>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
