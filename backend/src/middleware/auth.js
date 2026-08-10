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

  // Verify token separately from DB lookup so errors are classified correctly
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    // Distinguish expired tokens from other verification errors
    if (err && err.name === "TokenExpiredError") {
      res.status(401);
      const e = new Error("Token expired");
      e.name = "TokenExpiredError";
      return next(e);
    }

    res.status(401);
    return next(new Error("Not authorized, token invalid"));
  }

  // Now fetch the user and handle DB/errors separately from verification
  try {
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401);
      return next(new Error("User no longer exists"));
    }

    req.user = { id: user._id.toString() };
    next();
  } catch (dbErr) {
    // This is a database error (e.g. connection issue) — surface as 500
    res.status(500);
    return next(dbErr);
  }
};