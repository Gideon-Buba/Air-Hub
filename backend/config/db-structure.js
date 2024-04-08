/**
 * Creates Database structure
 * @param {object} connection 
 * @returns 
 */
module.exports = async (connection) => {

    /**
     * Runs a query and returns result, or throws error if encountered
     * @param {string} queryString query you want to run
     * @returns 
     */
    const query = (queryString) => new Promise((resolve, reject) => {
        connection.query(queryString, (err, result) => {
            if (err) {
                console.error('Error executing query: ' + err.stack);
                return reject(err);
            }
            return resolve(result);
        });
    });

    const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS airhub";

    /**
     * Key value structure for table creation queries
     */
    const createTables = {
        users: `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255) NOT NULL
        )`,
        
    };


    // Create database query
    await query(createDatabaseQuery);

    for(const [tableName, tableQuery] of Object.entries(createTables)) {
        await query(tableQuery).catch(err => {
            console.error(`Error creating ${tableName} table: ` + err.stack);
        });
    }

    return true;
};