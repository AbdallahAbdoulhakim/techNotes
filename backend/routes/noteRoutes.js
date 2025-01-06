import express from "express";
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
} from "../controllers/notesController.js";

const router = express.Router();

// router
//   .route("/")
//   .get("/all", getNotes)
//   .get("/:ticket", getNote)
//   .post("/create", createNote)
//   .patch("/:ticket/update", updateNote)
//   .delete("/:ticket/delete", deleteNote);

router.get("/all", getNotes);
router.get("/:ticket", getNote);
router.post("/create", createNote);
router.patch("/:ticket/update", updateNote);
router.delete("/:ticket/delete", deleteNote);

export default router;
