import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  // Check if the token is blacklisted
  const isBlacklisted = await tokenBlacklistModel.findOne({ token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Please try logging in again." });
  }
}
