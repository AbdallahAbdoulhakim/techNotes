import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

const router = express.Router();

router
  .route("/")
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

router.get("/:id", getUser);

export default router;
