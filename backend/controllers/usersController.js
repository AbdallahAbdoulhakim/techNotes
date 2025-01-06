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

    verifyMongoId(res, { id });

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

    if (!users) {
      res.status(404);
      throw new Error("No users Found!");
    }

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
    verifyMongoId(res, req.params);
    const { id } = req.params;

    let body = req.body;
    verifyParams(res, body, [], ["username", "password", "roles", "active"]);

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
    verifyMongoId(res, req.params);
    const { id } = req.params;

    const notes = await noteModel.find({ user: id });

    if (notes.length) {
      res.status(409);
      throw new Error(`User has assigned notes`);
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404);
      throw new Error(`User Not Found!`);
    }

    res.status(200).json({
      success: true,
      message: `User ${deletedUser.username} deleted successfully!`,
    });
  } catch (error) {
    next(error);
  }
});
