export const adminManagerMiddleware = (req, res, next) => {
  try {
    const roles = req?.roles;

    if (!roles.some((role) => ["Admin", "Manager"].includes(role))) {
      res.status(403);
      throw new Error(
        "Unauthorized : User is not allowed to access this resource"
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
