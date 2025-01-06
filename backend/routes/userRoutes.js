import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

// router.route("/").get().post().patch().delete();

router.get("/all", getUsers);
router.get("/:id", getUser);
router.post("/create", createUser);
router.patch("/:id/update", updateUser);
router.delete("/:id/delete", deleteUser);

export default router;
