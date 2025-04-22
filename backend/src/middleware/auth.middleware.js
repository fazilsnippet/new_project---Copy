import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT and check if the user is authenticated
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("JWT token not found");
      throw new ApiError(401, "Unauthorized request: No token provided");
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

// import jwt from "jsonwebtoken";
// import { User } from "../models/user.model.js";
// import { Admin } from "../models/admin.model.js";
// import { asyncHandler } from "../utils/asyncHandler.js";

// // Middleware to verify JWT for both Admins & Users
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

//   if (!token) return res.status(401).json({ message: "No token provided." });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     let account;

//     if (decoded.role === "Admin" || decoded.role === "Super Admin" || decoded.role === "Moderator") {
//       account = await Admin.findById(decoded.id).select("-password");
//       req.admin = account; // Attach admin info
//     } else {
//       account = await User.findById(decoded.id).select("-password");
//       req.user = account; // Attach user info
//     }

//     if (!account || !account.isActive)
//       return res.status(403).json({ message: "Unauthorized or account inactive." });

//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid or expired token." });
//   }
// });

// // Middleware to check roles (For Both Admins & Users)
// export const authorizeRoles = (...allowedRoles) => {
//   return (req, res, next) => {
//     const role = req.admin?.role || req.user?.role;
//     if (!role || !allowedRoles.includes(role)) {
//       return res.status(403).json({ message: "Access denied. Insufficient role permissions." });
//     }
//     next();
//   };
// };

// // Middleware to check permissions (For Both Admins & Users)
// export const authorizePermissions = (...requiredPermissions) => {
//   return (req, res, next) => {
//     const permissions = req.admin?.permissions || req.user?.permissions;
//     if (!permissions) {
//       return res.status(403).json({ message: "Access denied. No permissions found." });
//     }

//     const hasPermission = requiredPermissions.every((permission) =>
//       permissions.includes(permission)
//     );

//     if (!hasPermission) {
//       return res.status(403).json({ message: "Access denied. Insufficient permissions." });
//     }

//     next();
//   };
// };
