import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js'; 
import { getEnvironmentalVariable} from '../config/envConfig.js';



const { User } = db;

// Load environment variables
const GOOGLE_CLIENT_ID = getEnvironmentalVariable('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = getEnvironmentalVariable('GOOGLE_CLIENT_SECRET');

/**
 * Configure the Google OAuth strategy for Passport.js.
 */
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback', // Redirect URL after authentication
},

// This function is called after successful authentication
async ( accessToken, refreshToken, profile, done) => {
  try {
    // Get user's google email
    const email = profile.emails?.[0]?.value;

    if (!email) {
      
// If no email is found in the profile, return an error
    return done(new Error('No email found in Google profile'), null);
  }

    // chech if user already exists in the database
    let user  = await User.findOne({ where: { email } });

    // If user does not exist, create a new user
    if (!user) {
      user = await User.create({
        email,
        username: profile.displayName || email.split('@')[0], // Use display name or email prefix as username
        // firstname: profile.name.givenName || '',
        // lastname: profile.name.familyName || '',
        // profile_picture: profile.photos[0]?.value || '',
        role: 'user', // Set user type to 'user'
        auth_provider: 'google',
      });
    }

    // Sucessfully authenticated, return the user object and pass user to next step
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}
));