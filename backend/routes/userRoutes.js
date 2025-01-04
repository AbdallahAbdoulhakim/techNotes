import express from "express";
import { createUser } from "../controllers/usersController.js";

const router = express.Router();

// router.route("/").get().post().patch().delete();

router.post("/create", createUser);

export default router;
