import { Op } from 'sequelize';
import { getEnvironmentalVariable } from "../config/envConfig.js";
import User  from "../models/user.model.js";
import { ConflictException, UnauthorizedException } from "../utils/error.definitions.js";
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from "../utils/token.utils.js";
import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/refreshToken.model.js';
import { addDays } from 'date-fns';

export const registerUserService = async(data)=>{

    // Get data from controller
    const {username, email, password } = data;

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
