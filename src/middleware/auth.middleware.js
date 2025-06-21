import jwt from 'jsonwebtoken';
import { getEnvironmentalVariable } from '../config/envConfig.js';
import asyncHandler from '../utils/asyncHandler.js';
import { UnauthorizedException } from '../utils/error.definitions.js';


export const authMiddleware = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if ( !authHeader || !authHeader.startsWith( 'Bearer ' )) throw new UnauthorizedException('authorization token missing');

    const token = authHeader.split(' ')[1];
      try {
    const decoded = jwt.verify(token, getEnvironmentalVariable('ACCESS_TOKEN_SECRET'));
    req.user = decoded; // usually includes id, email, role
    next();
        } catch (err) {
    throw new UnauthorizedException(err,' Invalid or expired access token');
    }
})

