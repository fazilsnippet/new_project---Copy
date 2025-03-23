import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT and check if the user is authenticated
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("JWT token not found");
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select(
      "-refreshToken -password"
    );
    if (!user) {
      console.log("Decoded token does not match any user");
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

// Middleware to check if the user has the 'admin' role
export const admin = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(403, "Access denied, user not authenticated");
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied, insufficient privileges");
    }

    next();
  });


// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";


// // export const verifyJWT = asyncHandler(async (req, _, next) => {

// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   let token = req.headers.authorization; 
//   if (!token || !token.startsWith("Bearer ")) {
//     return res.status(403).json({ message: "Unauthorized, no token provided" });
//   }

//   try {
//     token = await token.split(" ")[1]; // Extract token after "Bearer "
//     const decoded =  jwt.verify(token, process.env.JWT_SECRET); // ✅ Verify Token

//     req.user = await User.findById(decoded.id).select("-password"); // Attach user to req
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Unauthorized, token invalid" });
//   }
// });


// // Middleware to check if the user has the 'admin' role
// export const admin = (roles = []) =>
//   asyncHandler(async (req, res, next) => {
//     if (!req.user) {
//       throw new ApiError(403, "Access denied, user not authenticated");
//     }

//     if (roles.length && !roles.includes(req.user.role)) {
//       throw new ApiError(403, "Access denied, insufficient privileges");
//     }

//     next();
//   });
