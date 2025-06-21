import jwt from 'jsonwebtoken';
import { getEnvironmentalVariable } from '../config/envConfig.js';


export const generateAccessToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role
    },
getEnvironmentalVariable('ACCESS_TOKEN_SECRET'),
{expiresIn: '15m'})
};

export const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user.id
    },
getEnvironmentalVariable('JWT_REFRESH_SECRET'),
{expiresIn: '1d'})
};