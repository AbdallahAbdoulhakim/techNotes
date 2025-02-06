import express from "express";
import mongoose from "mongoose";

import dbConnect from "./config/dbConnect.js";
import path from "path";
import fs from "fs";

import http from "http";
import https from "https";

import cookieParser from "cookie-parser";
import cors from "cors";

import corsOptions from "./config/corsOptions.js";
import { logger, logEvents } from "./middleware/logger.js";

import root from "./routes/root.js";
import errorHandler from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import dotenv from "dotenv";
dotenv.config();

const __dirname = import.meta.dirname;

const PORT = process.env.PORT || 5000;
const HTTPS_PORT = process.env.HTTPS_PORT || 5443;

const SERVER_URL = process.env.SERVER_URL || "localhost";

const privateKey = fs.readFileSync(path.join(__dirname, "localhost-key.pem"));
const certificate = fs.readFileSync(path.join(__dirname, "localhost.pem"));

const credentials = { key: privateKey, cert: certificate };

const app = express();

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

console.log(process.env.NODE_ENV);

dbConnect();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));

app.use("/", root);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({
      success: false,
      message: `The resource requested at ${req.originalUrl} was not found!`,
    });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MONGO DB");
  httpServer.listen(PORT, SERVER_URL, () => {
    console.log(
      `Http Server is up at ${SERVER_URL} and is listening to PORT ${PORT}.`
    );
  });

  httpsServer.listen(HTTPS_PORT, SERVER_URL, () => {
    console.log(
      `Https Server is up at ${SERVER_URL} and is listening to PORT ${HTTPS_PORT}.`
    );
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.errno}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoError.log"
  );
});
