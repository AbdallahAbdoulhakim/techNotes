import userModel, { roles } from "../models/userModel.js";
import noteModel from "../models/noteModel.js";

import { verifyParams, validateArrayEnum } from "../utils/verify.js";

import expressAsyncHandler from "express-async-handler";

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

    const newUser = await userModel.create({ ...body });

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
