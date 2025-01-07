import express from "express";
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
} from "../controllers/notesController.js";

const router = express.Router();

router
  .route("/")
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

router.get("/:ticket", getNote);

export default router;
