const mysql = require('mysql');
require('dotenv').config({ path: "../env/.env" });

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'airhub'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL server: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL server!');

    const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS airhub";

    // Create database query
    connection.query(createDatabaseQuery, (err, result) => {
        if (err) {
            console.error('Error creating database: ' + err.stack);
            return;
        }
        console.log('Database created or already exists:', result);

        // Create table query
        const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255) NOT NULL
        )`;

        connection.query(createTableQuery, (err, result) => {
            if (err) {
                console.error('Error creating table: ' + err.stack);
                return;
            }
            console.log('Table created or already exists:', result);
        });

        connection.end();
    });
});
