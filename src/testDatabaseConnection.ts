import dotenv from 'dotenv';
import sequelize from './models/database';

// Ensure environment variables are loaded at the beginning
dotenv.config();

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testDatabaseConnection();