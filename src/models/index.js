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

// Create an empty object to hold all models and Sequelize instances
const db = {};

// Attach the Sequelize connection instance so it can be accessed elsewhere in the app (for querying, syncing, etc.)
db.sequelize = sequelize;

// Attach the Sequelize class itself to access built-in types like Sequelize.STRING, Sequelize.INTEGER, etc.
db.Sequelize = Sequelize;

// Register models
db.User = User.init(sequelize);

// Setup associations
if (User.associate) {
  User.associate(db);
}

RefreshToken.initModel(sequelize);
RefreshToken.associate(db);

db.RefreshToken = RefreshToken;
export default db;
