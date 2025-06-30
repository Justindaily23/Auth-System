import passport from 'passport';
import "../auth/googleStrategy.js";
import User from '../models/user.model.js';


// Initialize Passport.js
passport.serializeUser((user, done) => {
  done(null, user.id);
}); 

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;