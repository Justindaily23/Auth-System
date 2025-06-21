import dotenv from 'dotenv';

dotenv.config();

// Function to get environment variables or throw an error if missing
export const getEnvironmentalVariable = (key) => {
  const value = process.env[key];

  if (value === undefined || value === '') {
    throw new Error(`Environmental variable: ${key} is missing`);
  }
  return value;
};
