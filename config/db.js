const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

// Function to set up MySQL connection
function setUpConnection() {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD || 'password'
        });

        db.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL database:', err);
                reject(err);
                return;
            }
            console.log('Connected to MySQL database');
            resolve(db);
        });

        db.on('error', (err) => {
            console.error('MySQL connection error:', err);
            reject(err);
        });
    });
}

// Function to create database if it doesn't exist
function createDatabaseIfNotExists(db) {
    return new Promise((resolve, reject) => {
        db.query("CREATE DATABASE IF NOT EXISTS " + process.env.DB_NAME, (err) => {
            if (err) {
                console.error('Error creating database:', err);
                reject(err);
                return;
            }
            console.log('Database created successfully');
            resolve();
        });
    });
}

// Set up MySQL connection and initialize database
async function initializeDatabase() {
    try {
        const db = await setUpConnection();
        await createDatabaseIfNotExists(db);
        return db;
    } catch (err) {
        throw new Error('Failed to initialize database: ' + err.message);
    }
}

// Export the initialized database connection
module.exports = initializeDatabase();
