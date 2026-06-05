const User = require("../models/Users");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Note = require("../models/Notes");
//secons
const maxAge = 24 * 60 * 60 * 3;

function createToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
}
function errorHandler(err) {
  console.log(err.message, err.code);

  let errors = { fullName: "", email: "", password: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "Email already exists";
    return errors;
  }

  // validation errors
  if (err.message.includes("users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}
async function createAccountPost(req, res) {
  const { fullName, email, password } = req.body;
  try {
    const user = await User.create({ fullName, email, password });
    const token = createToken(user._id);

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      user: user,
      message: "regestration sucessfully",
      error: false,
      accessToken: token,
    });
  } catch (err) {
    const errors = errorHandler(err);
    res.status(400).json({ errors });
  }
}

async function loginAccountPost(req, res) {
  const { email, password } = req.body;
  const errors = { email: "", password: "" };
  if (!email || !password) {
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    return res.status(400).json({ errors });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.email = "Invalid email";
      return res.status(400).json({
        errors: errors,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errors.password = "Invalid password";
      return res.status(400).json({
        errors: errors,
      });
    }

    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({
      email: user.email,
      message: "Logged in successfully",
      error: false,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Invalid credentials",
    });
  }
}
function logoutPost(req, res) {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ message: "Logged out successfully" });
}
async function getUser(req, res) {
  const user = req.user;
  console.log(user);
  try {
    const isUser = await User.findOne({ _id: user.id }).select("-password");
    if (!isUser) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "User found successfully",
      user: isUser,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Invalid credentials",
    });
  }
}

async function addNotePost(req, res) {
  const { title, content, tags } = req.body;
  const { id } = req.user;
  if (!title || !content) {
    if (!title)
      return res
        .status(400)
        .json({ error: true, message: "Title is required" });
    if (!content)
      return res
        .status(400)
        .json({ error: true, message: "Content is required" });
  }

  try {
    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      userId: id,
    });

    return res
      .status(200)
      .json({ error: false, note, message: "note added succesfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: "server error" });
  }
}

async function updateNotePut(req, res) {
  const { id } = req.params;
  const { title, content, tags, isPinned } = req.body;
  const user = req.user;

  if (!title && !content && !tags && isPinned === undefined) {
    return res.status(400).json({ error: true, message: "No change provided" });
  }

  try {
    const note = await Note.findOne({ _id: id, userId: user.id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.isPinned = isPinned ?? note.isPinned;
    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
}
async function getAllNotes(req, res) {
  const { id } = req.user;

  try {
    const notes = await Note.find({ userId: id }).sort({
      isPinned: -1,
      createdOn: -1,
    });
    return res
      .status(200)
      .json({ error: false, notes, message: "Notes fetched successfully" });
  } catch (err) {
    console.error("Get all notes error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
}

async function deleteNoteDelete(req, res) {
  const { id } = req.params;
  const user = req.user;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userId: user.id }); // ✅ one query

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    return res.status(200).json({
      error: false,
      note,
      message: "Note deleted successfully",
    });
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
}

async function updatePinPut(req, res) {
  const { id } = req.params;
  const { isPinned } = req.body;
  const user = req.user;

  if (isPinned === undefined) {
    return res.status(400).json({ error: true, message: "No change provided" });
  }

  try {
    const note = await Note.findOne({ _id: id, userId: user.id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    note.isPinned = isPinned;
    await note.save();

    return res.status(200).json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
}

async function postSearchNotes(req, res) {
  const { searchTerm } = req.body;
  const user = req.user;

  if (searchTerm === "") {
    return res
      .status(400)
      .json({ error: true, message: "search term is reqaired" });
  }

  try {
    const notes = await Note.find({
      userId: user.id,
      $or: [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { content: { $regex: new RegExp(searchTerm, "i") } },
      ],
    });

    if (!notes) {
      return res.status(404).json({ error: true, message: "Notes not found" });
    }

    return res.status(200).json({
      error: false,
      notes,
      message: "notes searched successfully",
    });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ error: true, message: "Server error" });
  }
}
module.exports = {
  createAccountPost,
  loginAccountPost,
  addNotePost,
  updateNotePut,
  getAllNotes,
  deleteNoteDelete,
  updatePinPut,
  getUser,
  logoutPost,
  postSearchNotes,
};
