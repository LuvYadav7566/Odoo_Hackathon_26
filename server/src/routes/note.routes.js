const express = require("express");
const { listNotes, createNote, updateNote, deleteNote } = require("../controllers/note.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);
router.get("/:tripId", listNotes);
router.post("/", createNote);
router.route("/:id").put(updateNote).delete(deleteNote);

module.exports = router;

