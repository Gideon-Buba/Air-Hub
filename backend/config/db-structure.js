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
  const query = (queryString) =>
    new Promise((resolve, reject) => {
      connection.query(queryString, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
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
            bio TEXT,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(255) NOT NULL
        )`,

    reservations: `CREATE TABLE IF NOT EXISTS reservations (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            room_id INT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            price INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    rooms: `CREATE TABLE IF NOT EXISTS rooms (
            id INT PRIMARY KEY AUTO_INCREMENT,
            owner_id INT NOT NULL,
            home_type VARCHAR(255) NOT NULL,
            room_type VARCHAR(255) NOT NULL,
            occupants INT NOT NULL,
            total_bedrooms INT NOT NULL,
            total_bathrooms INT NOT NULL,
            address VARCHAR(255) NOT NULL,
            city VARCHAR(255) NOT NULL,
            FOREIGN KEY (owner_id) REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

    reviews: `CREATE TABLE IF NOT EXISTS reviews (
            id INT PRIMARY KEY AUTO_INCREMENT,
            reservation_id INT NOT NULL,
            rating INT,
            comment VARCHAR(255)
        )`,

    media: `CREATE TABLE IF NOT EXISTS media (
            id INT PRIMARY KEY AUTO_INCREMENT,
            model_id INT NOT NULL,
            file_name VARCHAR(255) NOT NULL
        )`,
    bookings: `CREATE TABLE IF NOT EXISTS bookings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          user_id INT NOT NULL,
          date DATE NOT NULL,
          time DATETIME NOT NULL,
          details VARCHAR(255) NOT NULL
    )`,
  };

  // Create database query
  await query(createDatabaseQuery);

  for (const [tableName, tableQuery] of Object.entries(createTables)) {
    await query(tableQuery).catch((err) => {
      console.error(`Error creating ${tableName} table: ` + err.stack);
    });
  }

  return true;
};
