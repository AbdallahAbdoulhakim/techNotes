import userModel, { roles } from "../models/userModel.js";
import noteModel from "../models/noteModel.js";

import {
  verifyParams,
  validateArrayEnum,
  verifyMongoId,
  verifyBoolean,
} from "../utils/verify.js";

import expressAsyncHandler from "express-async-handler";

// @desc Create new user
// @route POST /users
// @access Private
export const createUser = expressAsyncHandler(async (req, res, next) => {
  try {
    let body = req.body;
    verifyParams(res, body, ["username", "password"], ["roles", "active"]);

    if (body?.roles) {
      const normalizedRoles = validateArrayEnum(
        res,
        { roles: req.body.roles },
        roles
      );

      body = { ...body, roles: normalizedRoles };
    }

    if (body?.active) {
      verifyBoolean(res, { active: body.active });
    }

    const duplicate = await userModel.findOne({ username: body.username });

    if (duplicate) {
      res.status(409);
      throw new Error(
        `Conflict, user with username ${duplicate.username} already exists!`
      );
    }

    const newUser = await userModel.create({ ...body });

    if (!newUser) {
      res.status(400);
      throw new Error(`Invalid user data received!`);
    }

    res.status(201).json({
      success: true,
      data: {
        id: newUser._id,
        username: newUser.username,
        roles: newUser.roles.map((role) =>
          Object.entries(roles).reduce(
            (prev, curr) => (curr[1] === role ? curr[0] : prev),
            ""
          )
        ),
        active: newUser.active,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    verifyMongoId(res, { user: id });

    const foundUser = await userModel.findById(id);

    if (!foundUser) {
      res.status(404);
      throw new Error(`User Not Found!`);
    }

    res.status(200).json({
      success: true,
      data: {
        id: foundUser._id,
        username: foundUser.username,
        roles: foundUser.roles.map((role) =>
          Object.entries(roles).reduce(
            (prev, curr) => (curr[1] === role ? curr[0] : prev),
            ""
          )
        ),
        active: foundUser.active,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc Get all users
// @route GET /users
// @access Private
export const getUsers = expressAsyncHandler(async (req, res, next) => {
  try {
    const users = await userModel.find().select("-password -__v");
    res.status(200).json({
      success: true,
      data: users.map((user) => ({
        id: user._id,
        username: user.username,
        roles: user.roles.map((role) =>
          Object.entries(roles).reduce(
            (prev, curr) => (curr[1] === role ? curr[0] : prev),
            ""
          )
        ),
        active: user.active,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
export const updateUser = expressAsyncHandler(async (req, res, next) => {
  try {
    let body = req.body;

    verifyParams(
      res,
      body,
      ["id"],
      ["username", "password", "roles", "active"]
    );

    verifyMongoId(res, { user: body.id });

    const { id } = body;

    if (body?.roles) {
      const normalizedRoles = validateArrayEnum(
        res,
        { roles: req.body.roles },
        roles
      );

      body = { ...body, roles: normalizedRoles };
    }

    if (body?.active) {
      verifyBoolean(res, { active: body.active });
    }

    const duplicate = await userModel.findOne({ username: body.username });

    if (duplicate && duplicate?._id.toString() !== id) {
      res.status(409);
      throw new Error(
        `Conflict, user with username ${duplicate.username} already exists!`
      );
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { ...body },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404);
      throw new Error(`User Not Found!`);
    }

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        roles: updatedUser.roles.map((role) =>
          Object.entries(roles).reduce(
            (prev, curr) => (curr[1] === role ? curr[0] : prev),
            ""
          )
        ),
        active: updatedUser.active,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  try {
    verifyParams(res, req.body, [], [], ["id", "username"]);

    let userToDelete;

    if (req.body?.id) {
      verifyMongoId(res, { user: req.body.id });
      userToDelete = await userModel.findOne({ _id: req.body.id }).exec();
    }

    if (req.body?.username) {
      userToDelete = await userModel
        .findOne({ username: req.body.username })
        .exec();
    }

    if (!userToDelete) {
      res.status(404);
      throw new Error(`User Not Found!`);
    }

    const notes = await noteModel.find({ user: userToDelete });

    if (notes.length) {
      res.status(409);
      throw new Error(`User has assigned notes`);
    }

    await userToDelete.deleteOne();

    res.status(200).json({
      success: true,
      message: `User ${userToDelete.username} deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
});
