

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token;
  

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.header("Authorization")?.startsWith("Bearer ")) {
    token = req.header("Authorization").split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided, please login"));
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?.id) {
      return next(new ApiError(401, "Invalid token payload,  please login"));
    }

    const user = await User.findById(decodedToken.id).select("-password -refreshToken");
    if (!user) {
      return next(new ApiError(401, "User not found  , please login again"));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Access token expired"));
    } else if (error.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid access token........"));
    }

    return next(new ApiError(401, error.message || "Token verification failed"));
  }
});

// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import {User} from '../models/user.model.js';

// // Middleware to protect routes
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith('Bearer')) {
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }

//   try {
//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     if (!req.user) {
//       res.status(401);
//       throw new Error('User not found');
//     }
//     next();
//   } catch (error) {
//     res.status(401);
//     throw new Error('Not authorized, token failed');
//   }
// });
