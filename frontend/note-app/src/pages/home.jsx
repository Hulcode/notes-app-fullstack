import Navbar from "../components/navbar";
import NoteCard from "../components/noteCard";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";
import AddEditNotes from "../components/addEditNotes";
import Toast from "../components/toast";
import Modal from "react-modal";
import axiosInstance from "../utilts/axiosInstance";
import { useNavigate } from "react-router-dom";
import EmptyNots from "../components/emptyNots";
import emptyImage from "../assets/addnote.jpg";
// Set app element (do this once, perhaps in main.jsx or App.jsx)
// Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();
  const [openAddEditDialog, setOpenAddEditDialog] = useState({
    isOpen: false,
    type: "add", // "add" or "edit"
    data: null,
  });
  const [openToast, setOpenToast] = useState({
    isOpen: false,
    type: "",
    message: "",
    success: false,
  });
  const [notes, setNotes] = useState([]); // You'll need actual note data
  const [userInfo, setUserInfo] = useState(null); // You'll need actual note data
  function handleOpenToast(type, message, success) {
    setOpenToast({
      isOpen: true,
      type: type,
      message: message,
      success: success,
    });
  }
  const handleEditNote = (note) => {
    setOpenAddEditDialog({
      isOpen: true,
      type: "edit",
      data: note,
      handleOpenToast,
    });
  };
  const handleDeleteNote = async (id) => {
    try {
      const res = await axiosInstance.delete(`/delete-note/${id}`);
      if (res.data && !res.data.error) {
        getNotes(); // ✅ refresh notes list
        handleOpenToast("delete", "Deleted sucessfully!", true);
      }
    } catch (err) {
      console.error("Delete note error:", err.message);

      handleOpenToast("delete", "Failed to delete note", false);
    }
  };

  const handlePinNoteChange = async (note) => {
    try {
      const res = await axiosInstance.put(`/update-pinned/${note._id}`, {
        isPinned: !note.isPinned, // ✅ toggle the current value
      });
      if (res.data && !res.data.error) {
        handleOpenToast("update", "Note updated!", true);
        getNotes();
      }
    } catch (err) {
      console.error("Change pin error:", err.message);

      handleOpenToast("update", "Failed to updated note!", false);
    }
  };

  const handleCloseModal = () => {
    setOpenAddEditDialog({ isOpen: false, type: "add", data: null });
  };
  const handleCloseToast = () => {
    setOpenToast({ ...openToast, isOpen: false });
  };
  async function getUserInfo() {
    try {
      const res = await axiosInstance.get("/get-user");
      if (!res.data.error) {
        setUserInfo(res.data.user);
      }
    } catch (err) {
      navigate("/login");
      console.log(err.message);
    }
  }

  async function getNotes() {
    try {
      const res = await axiosInstance.get("/all-notes");
      if (!res.data.error) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleSearch(searchTerm) {
    try {
      const res = await axiosInstance.post("/search-notes", {
        searchTerm: searchTerm,
      });
      if (!res.data.error) {
        setNotes(res.data.notes);
      }
    } catch (err) {
      console.log(err.message);
    }
  }
  // ✅ Call it when component mounts
  useEffect(() => {
    getUserInfo();
    getNotes();
  }, []);
  return (
    <div>
      <Navbar
        userInfo={userInfo}
        handleSearch={handleSearch}
        getNotes={getNotes}
      />
      <div className="container mx-auto px-4">
        {notes.length !== 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                date={note.createdOn}
                content={note.content}
                tags={note.tags}
                isPinned={note.isPinned}
                onEdit={() => handleEditNote(note)}
                onDelete={() => {
                  handleDeleteNote(note._id);
                }}
                onPinNote={() => {
                  handlePinNoteChange(note);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyNots
            src={emptyImage}
            message="        Start creating your first note! Click the 'Add' button to jot down
        your thoughts, ideas, and reminders. Let's get started!"
          />
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          setOpenAddEditDialog({
            isOpen: true,
            type: "add",
            data: null,
            handleOpenToast,
          })
        }
        className="text-2xl text-white h-14 w-14 rounded-2xl bg-primary hover:bg-blue-800 fixed right-5 bottom-5 flex justify-center items-center shadow-lg transition-all hover:scale-105"
      >
        <FaPlus />
      </button>

      <Modal
        isOpen={openAddEditDialog.isOpen}
        onRequestClose={handleCloseModal}
        style={{
          content: {
            maxWidth: "50%",
            margin: "auto",
            height: "fit-content",
            borderRadius: "12px",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <AddEditNotes
          type={openAddEditDialog.type}
          noteData={openAddEditDialog.data}
          onClose={handleCloseModal}
          getNotes={getNotes}
          handleOpenToast={handleOpenToast} // ✅
        />
      </Modal>

      {openToast.isOpen && (
        <Toast
          message={openToast.message}
          type={openToast.type}
          onClose={handleCloseToast}
          success={openToast.success} // ✅
        />
      )}
    </div>
  );
};

export default Home;
