import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // NEW: confirm the user still actually exists in the DB
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      return next(new Error("User no longer exists"));
    }

    req.user = { id: user._id.toString() }; // safe, confirmed-real user
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, token invalid or expired"));
  }
};