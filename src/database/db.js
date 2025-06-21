import db from '../models/index.js';

// Connect to sequelize
const connectToDb = async() => {
try {
 // sequelize.sync({ alter: true }); // or { force: true } for development only
  await db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}
}

export default connectToDb;