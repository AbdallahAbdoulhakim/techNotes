import express from "express";
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
} from "../controllers/notesController.js";

import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

router.get("/:ticket", getNote);

export default router;
