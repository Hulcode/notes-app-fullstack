import { useEffect } from "react";
import { MdDelete, MdCreate } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
const Toast = ({ message, type, onClose, success }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // ✅ 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const Icon = () => {
    if (type === "delete") return <MdDelete className="text-red-500" />;
    if (type === "update") return <MdCreate className="text-blue-500" />;
    if (type === "add") return <FaPlus className="text-blue-500" />;
    return null;
  };

  return (
    <div
      className={`fixed top-16 right-3 
        bg-white 
      flex items-center gap-3 px-4 py-2 rounded shadow-2xl text-black
      ${
        success // ✅ valid Tailwind classes
          ? "border-l-4 border-green-500"
          : " border-l-4 border-red-500"
      }`}
    >
      <span className="h-7 w-7 rounded-full justify-center items-center flex  bg-slate-100">
        <Icon />
      </span>
      {/* ✅ called as component */}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
