const express = require("express");
const router = express.Router();

const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  searchForNote,
} = require("../controllers/Note");
const { auth } = require("../middlewares/auth");

router.route("/notes").get(auth, getNotes);
router.route("/notes/:noteId").get(auth, getNote);
router.route("/notes/").post(auth, createNote);
router.route("/notes/:noteId").put(auth, updateNote);
router.route("/notes/:noteId").delete(auth, deleteNote);
router.route("/notes/:noteId/share").post(auth, shareNote);
router.route("/search").get(auth, searchForNote);

module.exports = router;
