import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

const verifyJWT = expressAsyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(403);
        res.json({ success: false, error: "Forbidden" });
        return;
      }
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles;
      next();
    });
  } catch (error) {
    next(error);
  }
});

export default verifyJWT;
