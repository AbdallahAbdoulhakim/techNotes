import express from "express";
import dbConnect from "./config/dbConnect.js";
import path from "path";
import morgan from "morgan";
import { createWriteStream } from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";

import root from "./routes/root.js";
import errorHandler from "./middleware/errorHandler.js";

import dotenv from "dotenv";
dotenv.config();

const __dirname = import.meta.dirname;
const logFs = createWriteStream(path.join(__dirname, "logs", "access.log"));
const errFs = createWriteStream(path.join(__dirname, "logs", "error.log"));

const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "localhost";

const app = express();

dbConnect();

app.use(morgan("combined", { stream: logFs }));
app.use(
  morgan("combined", {
    stream: errFs,
    skip: (req, res) => res.statusCode < 400,
  })
);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use(express.static("public"));

app.use("/", root);

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

app.listen(PORT, SERVER_URL, () => {
  console.log(
    `Server is up at ${SERVER_URL} and is listening to PORT ${PORT}.`
  );
});
