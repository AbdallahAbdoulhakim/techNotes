import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/usersController.js";

import verifyJWT from "../middleware/verifyJWT.js";

const router = express.Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

router.get("/:id", getUser);

export default router;
