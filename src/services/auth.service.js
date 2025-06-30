import { Op } from 'sequelize';
import { getEnvironmentalVariable } from "../config/envConfig.js";
import User  from "../models/user.model.js";
import { ConflictException, UnauthorizedException } from "../utils/error.definitions.js";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/refreshToken.model.js';
import { addDays } from 'date-fns';
import crypto from 'crypto';

export const registerUserService = async(data)=>{

    // Get data from controller
    const {username, email, password, role } = data;

      // Check if user with email or username already exists
    const user = await User.findOne({where:{ [Op.or]: {email}}});

    if ( user ) {
        throw new ConflictException('User exist');
    }

      // Hash password
    const hashPassword = await bcrypt.hash(password, parseInt(getEnvironmentalVariable('SALT_ROUNDS')));

  // Create new user
    const newUser = await User.create({
        username,
        email,
        password: hashPassword,
        role: role || 'user;' // Default role is 'user'
    })

    const userPayload = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
};

    return userPayload;

}


// Login user and generate access token and refresh token
export const loginUserService = async ( data, userAgent ) => {
    
    const { email, password } = data;

      // Find user by email where the Op.or sets its uniqueness
    const user = await User.findOne({ where: {[Op.or]: { email }}});
    
    // Check if user exists by email
    if( !user ) throw new UnauthorizedException('User does not exist, please check credentials');

    // Compare password for validity
    const isMatch = await bcrypt.compare( password, user.password );

    if(!isMatch) throw new UnauthorizedException('User does not exist, please check credentials');

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

      // Save refresh token to RefreshToken table (multi-device support)
      await RefreshToken.create({
            token: refreshToken,
            userId: user.id,
            userAgent,
            expiresAt: addDays(new Date(), 7), // 1-day expiry
      });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
}

export const refreshAccessTokenService = async( data ) => {
    // Get the refresh token from request body
    const { refreshToken } = data;

    // Check if request token in request body
    if( !refreshToken ) throw new UnauthorizedException('Refresh token required' );

    // Veryify the refresh token against the one in the database
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, getEnvironmentalVariable('JWT_REFRESH_SECRET'));
     } catch (err) {
        throw new UnauthorizedException(err, 'Invalid or expired refresh token');
    }

      // Verify the token exists in DB
      const storedToken = await RefreshToken.findOne({ where: { token: refreshToken, userId: decoded.id}});
    
    if ( !storedToken ) {
        throw new UnauthorizedException('Refresh token not recognized or already used');
    }

      // Get the user
  const user = await User.findByPk(decoded.id);
  if (!user) throw new UnauthorizedException('User no longer exists');

    // Generate new access token
    const newAccessToken = generateAccessToken( user );

    return {
        accessToken: newAccessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
    }
    }
};


export const logoutUserService = async (refreshToken, userAgent, userId) => {
  if (!refreshToken) throw new UnauthorizedException('No active session. Already logged out');

  // Delete just the current session token
     const deleted = await RefreshToken.destroy({ where: { token: refreshToken, userId, userAgent}});

       if (!deleted) {
    // No token matched with this device and user — soft exit
    return { message: 'Session already invalidated or not found.' };
  }

  return { message: 'Logout successful' };
};

export const logoutAllSessionsService = async (userId) => {
  if (!userId) throw new UnauthorizedException('User not authenticated');

  await RefreshToken.destroy({
    where: { userId },
  });

  return { message: 'Logged out from all devices' };
};

/**
 * @service Forgot password service
 * @desc Initiates password reset by sending a reset link to the user's email
 * @access Public
 */
export const forgotPasswordService = async (email) => {

  // Validate email
  if (!email) throw new UnauthorizedException('Email is required');
  // Check if user exists
  const user = await User.findOne({ where: { email } });
  if (!user) throw new UnauthorizedException('User not found');

  // Generate a secure random reset token

  const rawToken = crypto.randomBytes(32).toString('hex');

  // Hash the token before storing (SHA-256)
  const hashToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  // set token and expiry in the user
  user.passwordResetToken = hashToken;
  user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour expiry
  await user.save();

  // Build the reset link
  const resetUrl = `${getEnvironmentalVariable('APP_URL')}/reset-password?token=${rawToken}`;

      // TODO: Send the email here using nodemailer — for now, Its ust logged to the console 
console.log(`[DEV ONLY] Send password reset link to ${user.email}: ${resetUrl}`);  
  // Here you would typically send the reset link via email
  // For example: `https://yourapp.com/reset-password?token=${resetToken}`

  return { message: 'Password reset link sent to your email' };  

}

/**
 * @service Reset password service
 * @desc Resets the user's password using a valid reset token
 * @access Public
 */
export const resetPasswordService = async (token, newPassword) => {
  // Validate input
  if (!token || !newPassword) throw new UnauthorizedException('Token and new password are required');

  // Hash the token before comparing
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with matching reset token and not expired
  const user = await User.findOne({
    where: {
      passwordResetToken: hashToken,
      passwordResetExpires: { [Op.gt]: new Date() }, // Check if not expired
    },
  });

  if (!user) throw new UnauthorizedException('Invalid or expired reset token');

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, parseInt(getEnvironmentalVariable('SALT_ROUNDS')));

  // Update user's password and clear reset token fields
  user.password = hashedPassword;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  return { message: 'Password has been successfully reset' };
}