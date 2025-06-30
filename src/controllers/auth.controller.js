import { 
    loginUserService, 
    refreshAccessTokenService, 
    registerUserService, 
    logoutUserService, 
    logoutAllSessionsService 
} from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import { forgotPasswordService, resetPasswordService } from '../services/auth.service.js';

// Register user logic
export const registerUser = asyncHandler(async(req, res) =>{

    const data = req.body;

    // call register user service and use the logic to create newUser
    const user = await registerUserService(data);

    res.status(201).json({
        success: true,
        message: 'Registration sucessful',
        ...user
    })

})


// Login user logic
export const loginUser = asyncHandler( async( req, res ) => {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const data = req.body;
    const user = await loginUserService(data, userAgent);

    return res.status(200).json({
        success: true,
        message: 'Login successful',
        ...user
    })
})

export const refreshAccessToken = asyncHandler( async( req, res) => {
    // Get the refresh token from request body
    const data = req.body;
    const user = await refreshAccessTokenService(data);


    return res.status(200).json({
        success: true,
        message: 'Access token created successfully.',
        ...user
    })
});


export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body || {};

  // Secure values
  const userAgent = req.headers['user-agent'] || 'unknown';
  const userId = req.user?.id; // make sure this route is JWT protected

  const result = await logoutUserService(refreshToken, userAgent, userId);

  return res.status(200).json({
    success: true,
    ...result,
  });
});

export const logoutAllSessions = asyncHandler(async (req, res) => {
    // Get the user id from the req body
  const userId = req.user.id; 

  // Call the logout all session service
  const result = await logoutAllSessionsService(userId);

  return res.status(200).json({
    success: true,
    ...result,
  });
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Initiate password reset process by emailing a reset link
 * @access Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Call the forgot password service
  const result = await forgotPasswordService(email);

  return res.status(200).json({
    success: true,
    ...result,
  });
}); 


export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  // Call the reset password service (not implemented in this snippet)
  const result = await resetPasswordService(token, newPassword);
  if (!result) {
    return res.status(400).json({
      success: false,
      message: 'Password reset failed. Invalid token or password.',
    });
  } 
  // Assuming resetPasswordService returns a success message or similar
  return res.status(200).json({
    success: true,
    message: 'Password reset successful',
    // ...result,
  });
})