const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'airhub'
});

let existingConnection = null;


module.exports = async () => {
    return existingConnection || new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('Error connecting to MySQL server: ' + err.stack);
                return reject(err);
            }
            existingConnection = connection;
            resolve(connection);
        });
        
    })
}