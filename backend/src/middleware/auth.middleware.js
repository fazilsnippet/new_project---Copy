import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT and check if the user is authenticated
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select("-refreshToken -password");
    if (!user) {
      throw new ApiError(401, "Unauthorized request: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized request: Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Unauthorized request: Invalid token");
    }
    throw new ApiError(401, error?.message || "Unauthorized request");
  }
});

// Middleware to check if the user has the 'admin' role
export const admin = (roles = []) => asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(403, "Access denied, user not authenticated");
  }

  if (roles.length && !roles.includes(req.user.role)) {
    throw new ApiError(403, "Access denied, insufficient privileges");
  }

  next();
});


