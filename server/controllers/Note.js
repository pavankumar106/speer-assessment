const Note = require("../models/Note");
const User = require("../models/User");

// Get all notes of a auth'd user
// method GET
// endpoint /api/notes
exports.getNotes = async (req, res) => {
  try {
    // user id
    const id = req.user.id;
    // find notes associated with the user
    const user = await User.findById(id).populate("notes");
    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found... ${id}`,
      });
    }
    // return res
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: user.notes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// get a note by id for auth'd user
// method GET
// endpoint /api/notes/:noteId

exports.getNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const user = await User.findById(userId).populate("notes");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const note = user.notes.find((n) => n.id === noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note(s) not found",
      });
    }
    // return res
    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// Create new note
// Method Post
// endpoint /api/notes/new
exports.createNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;
    // validate
    if (!title || !content) {
      return res.status(403).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // create new note
    const newNote = await Note.create({ title, content });
    // push new note to user Model
    user.notes.push(newNote);
    await newNote.save();
    await user.save();
    // return res
    return res.status(201).json({
      success: true,
      message: "Notes created.",
      newNote,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// Update note
// method PUT
// endpoint /api/update

exports.updateNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const { title, content } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.notes.includes(noteId)) {
      return res.status(403).json({
        success: false,
        error: "Access to the specified note is forbidden",
      });
    }
    // find note to update
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    // update
    if (title) note.title = title;
    if (content) note.content = content;

    await note.save();
    // return res
    return res.status(200).json({
      success: true,
      message: "Note updated",
      note,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// delete a note
// method delete
// endpoint /api/notes/:id

exports.deleteNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!user.notes.includes(noteId)) {
      return res.status(403).json({
        success: false,
        error: "Access to the specified note is forbidden",
      });
    }
    // Delete the note
    await Note.findOneAndDelete({ _id: noteId });
    // Remove the note reference from the user's notes array
    user.notes = user.notes.filter((n) => n._id !== noteId);
    await user.save();
    // return res
    res.status(200).json({
      success: true,
      message: "Note deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// share a note
// method Post
// endpoint /api/notes/:id/share
exports.shareNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.noteId;
    const { recipientEmail } = req.body;
    if (!noteId || !recipientEmail) {
      return res.status(403).json({
        success: false,
        message: "All fields are mandatory",
      });
    }
    const data = {
      user: userId,
      note: noteId,
      recipientEmail,
    };
    const user = await User.findById(userId).populate("notes");
    if (!user || !user.notes.find((note) => note._id.toString() === noteId)) {
      return res.status(404).json({
        success: false,
        message: "You do not have permission to share this note",
      });
    }
    // Find the recipient user by username
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found",
      });
    }
    // Check if the recipient has the note
    if (recipient.notes.includes(noteId)) {
      return res
        .status(400)
        .json({ error: "Recipient already has access to this note", data });
    }
    // Share the note
    recipient.notes.push(noteId);
    await recipient.save();
    res.status(200).json({
      success: true,
      message: "Note shared successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};

// search query
// endpoint /api/search?q=:query
exports.searchForNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = req.query.q;
    
    // Check if keyword is provided
    if (!query) {
      return res
        .status(400)
        .json({ message: "Keyword is required for searching" });
    }
    // Find the user and populate their notes
    const user = await User.findById(userId).populate({
      path: "notes",
      match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // return res
    res.status(200).json({ data: user.notes, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later...",
      error: error.message,
    });
  }
};
