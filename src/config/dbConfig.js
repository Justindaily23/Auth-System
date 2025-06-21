import Sequelize from 'sequelize';
import { getEnvironmentalVariable } from './envConfig.js';

const DB_HOST = getEnvironmentalVariable('DB_HOST');
const port = getEnvironmentalVariable('DB_PORT');
const DB_NAME = getEnvironmentalVariable('DB_NAME');
const DB_PASSWORD = getEnvironmentalVariable("DB_PASSWORD");
const DB_USER = getEnvironmentalVariable('DB_USER');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: port,
  dialect: 'postgres',
});

export default sequelize;
