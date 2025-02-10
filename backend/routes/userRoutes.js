import express from "express";
import { adminManagerMiddleware } from "../middleware/authMiddlewares.js";

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
router.use(adminManagerMiddleware);

router
  .route("/")
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

router.get("/:id", getUser);

export default router;
