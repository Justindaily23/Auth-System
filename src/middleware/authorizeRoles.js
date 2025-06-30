import { ForbiddenException } from "../utils/error.definitions.js";

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
// Check if the user is authenticated
    if (!req.user || !req.user.role) {
        throw new ForbiddenException('Forbidden: No user role found');
    }

    // Check if the user's role is included in the allowed role
    if (!roles.includes(req.user.role)) {
        throw new ForbiddenException(`Forbidden: User role is not authorized to access this resource`);
    }
// If the user has the required role, proceed to the next middleware
    next();
  };
}