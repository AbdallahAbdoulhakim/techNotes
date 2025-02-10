import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

import userModel from "../models/userModel.js";
import { roles } from "../models/userModel.js";

const accessTokenExpire = "15m";
const refreshTokenExpire = "7d";

// @desc Login
// @route POST /auth
// @access Public
export const login = expressAsyncHandler(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(404);
      throw new Error(`Username and password are required!`);
    }

    const foundUser = await userModel.findOne({ username });

    if (!foundUser || !foundUser.active) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles.map((role) =>
            Object.entries(roles).reduce(
              (prev, curr) => (curr[1] === role ? curr[0] : prev),
              ""
            )
          ),
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: accessTokenExpire,
      }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: refreshTokenExpire,
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public - becasue access token has expired
export const refresh = expressAsyncHandler(async (req, res, next) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const refreshToken = cookies.jwt;

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      expressAsyncHandler(async (err, decoded) => {
        if (err) {
          res.status(403);
          res.json({ success: false, error: "Unauthorized" });
        }

        const foundUser = await userModel.findOne({
          username: decoded?.username,
        });

        if (!foundUser) {
          res.status(401);
          res.json({ success: false, error: "Unauthorized" });
        }

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: foundUser.roles.map((role) =>
                Object.entries(roles).reduce(
                  (prev, curr) => (curr[1] === role ? curr[0] : prev),
                  ""
                )
              ),
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: accessTokenExpire,
          }
        );

        res.json({ accessToken });
      })
    );
  } catch (error) {
    next(error);
  }
});

// @desc Logout
// @route GET /auth/logout
// @access Public - just to clear cookie if exists
export const logout = expressAsyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Cookie cleared" });
});
