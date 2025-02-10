import express from "express";
import {
  createNote,
  updateNote,
  getNote,
  deleteNote,
  getNotes,
} from "../controllers/notesController.js";

import verifyJWT from "../middleware/verifyJWT.js";
import { adminManagerMiddleware } from "../middleware/authMiddlewares.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(adminManagerMiddleware, deleteNote);

router.get("/:ticket", getNote);

export default router;
