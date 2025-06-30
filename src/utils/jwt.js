import jwt from 'jsonwebtoken';
import { getEnvironmentalVariable } from '../config/envConfig.js';
// Import the User model    

// Function to generate a JWT token for a user
// The user object should contain at least the id, email, and user_type (role)
export const generateJwt = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
// Generate a JWT token with a short expiration time
  // The token will expire in 15 minutes
  return jwt.sign(payload, getEnvironmentalVariable('JWT_SECRET'), {
    expiresIn: '15m', 
  });
};
