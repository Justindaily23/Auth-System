// src/models/index.js (clean and modern)
import { Sequelize } from 'sequelize';
import config from '../config/config.cjs';
import User from './user.model.js';
import { RefreshToken } from './refreshToken.model.js';

const env = process.env.NODE_ENV || 'development';
// Get the database configuration object for the current environment (e.g., development, production, test)
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false,
});

// Initialize models before storing them in the db object
 User.init(sequelize);
 RefreshToken.initModel(sequelize);
// Create an empty object to hold all models and Sequelize instances
const db = {
  sequelize,
  Sequelize,
  User,
  RefreshToken,};

// Attach the Sequelize connection instance so it can be accessed elsewhere in the app (for querying, syncing, etc.)
//db.sequelize = sequelize;

// Attach the Sequelize class itself to access built-in types like Sequelize.STRING, Sequelize.INTEGER, etc.
//db.Sequelize = Sequelize;

// Register models


// Setup associations
if (User.associate) {
  User.associate(db);
}
if (RefreshToken.associate) {
  RefreshToken.associate(db);
} 

export default db;
