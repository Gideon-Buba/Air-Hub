module.exports = (connection) => {

    return new Promise((resolve, reject) => {
        const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS airhub";

        // Create database query
        connection.query(createDatabaseQuery, (err, result) => {
            if (err) {
                console.error('Error creating database: ' + err.stack);
                return reject(err);
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
                    return reject(err);
                }
                console.log('Table created or already exists:', result);

                return resolve();
            });
        }); 
    });
};