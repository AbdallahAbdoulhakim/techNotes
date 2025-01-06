import userModel from "../models/userModel.js";
import noteModel from "../models/noteModel.js";
import expressAsyncHandler from "express-async-handler";
import {
  verifyMongoId,
  verifyParams,
  verifyNumericParams,
} from "../utils/verify.js";

export const createNote = expressAsyncHandler(async (req, res, next) => {
  try {
    verifyParams(
      res,
      req.body,
      ["title", "text"],
      ["completed"],
      ["user", "userId"]
    );

    let body = req.body;

    if (body?.user) {
      const foundUser = await userModel.findOne({ username: body.user });

      if (!foundUser) {
        res.status(404);
        throw new Error(
          `The user provided in the body parameter does not exist`
        );
      }

      body.user = foundUser;
    }

    if (body?.userId) {
      verifyMongoId({ userId: body.userId });
      const foundUser = await userModel.findById(body.userId);

      if (!foundUser) {
        res.status(404);
        throw new Error(
          `The user provided in the body parameter does not exist`
        );
      }

      body.user = foundUser;
    }

    const newNote = await (
      await noteModel.create({ ...body })
    ).populate("user");

    res.status(201).json({
      success: true,
      data: {
        ticket: newNote.ticket,
        title: newNote.title,
        text: newNote.text,
        user: {
          id: newNote.user._id,
          username: newNote.user.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export const updateNote = expressAsyncHandler(async (req, res, next) => {
  try {
    verifyNumericParams(res, req.params);
    const { ticket } = req.params;

    verifyParams(
      res,
      req.body,
      [],
      ["title", "text", "completed"],
      [],
      ["user", "userId"]
    );

    let body = req.body;

    if (body?.user) {
      const foundUser = await userModel.findOne({ username: body.user });

      if (!foundUser) {
        res.status(404);
        throw new Error(
          `The user provided in the body parameter does not exist`
        );
      }

      body.user = foundUser;
    }

    if (body?.userId) {
      verifyMongoId(res, { userId: body.userId });
      const foundUser = await userModel.findById(body.userId);

      if (!foundUser) {
        res.status(404);
        throw new Error(
          `The user provided in the body parameter does not exist`
        );
      }

      body.user = foundUser;
    }

    const updatedNote = await (
      await noteModel.findOneAndUpdate({ ticket }, { ...body }, { new: true })
    ).populate("user");

    if (!updatedNote) {
      res.status(404);
      throw new Error(`Note Not Found`);
    }

    res.status(200).json({
      success: true,
      data: {
        ticket: updatedNote.ticket,
        title: updatedNote.title,
        text: updatedNote.text,
        user: {
          id: updatedNote.user._id,
          username: updatedNote.user.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getNote = expressAsyncHandler(async (req, res, next) => {
  try {
    verifyNumericParams(res, req.params);

    const { ticket } = req.params;

    const foundNote = await (
      await noteModel.findOne({ ticket })
    ).populate("user");

    if (!foundNote) {
      res.status(404);
      throw new Error(`Note Not Found`);
    }

    res.status(200).json({
      success: true,
      data: {
        ticket: foundNote.ticket,
        title: foundNote.title,
        text: foundNote.text,
        user: {
          id: foundNote.user._id,
          username: foundNote.user.username,
        },
        createdAt: foundNote.createdAt,
        updatedAt: foundNote.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const deleteNote = expressAsyncHandler(async (req, res, next) => {
  try {
    verifyNumericParams(res, req.params);

    const { ticket } = req.params;

    const deletedNote = await (
      await noteModel.findOneAndDelete({ ticket })
    ).populate("user");

    if (!deletedNote) {
      res.status(404);
      throw new Error(`Note Not Found`);
    }

    res.status(200).json({
      success: true,
      data: {
        ticket: deletedNote.ticket,
        title: deletedNote.title,
        text: deletedNote.text,
        user: {
          id: deletedNote.user._id,
          username: deletedNote.user.username,
        },
        createdAt: deletedNote.createdAt,
        updatedAt: deletedNote.updatedAt,
      },
      message: `Note N°${deletedNote.ticket} deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
});

export const getNotes = expressAsyncHandler(async (req, res, next) => {
  try {
    const notes = await noteModel.find().populate("user");

    res.status(200).json({
      success: true,
      data: notes.map((note) => ({
        ticket: note.ticket,
        title: note.title,
        text: note.text,
        user: {
          id: note.user._id,
          username: note.user.username,
        },
      })),
    });
  } catch (error) {
    next(error);
  }
});
