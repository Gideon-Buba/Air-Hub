const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "airhub",
});

let existingConnection = null;

/**
 * Creates a connection to MySQL,
 * further invocation returns the existing connection
 * @returns mysql.Connection
 */

module.exports.connection = async () => {
  return (
    existingConnection ||
    new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          console.error("Error connecting to MySQL server: " + err.stack);
          return reject(err);
        }
        existingConnection = connection;
        resolve(connection);
      });
    })
  );
};

module.exports.query = (queryString, params = []) =>
  new Promise((resolve, reject) => {
    existingConnection.query(queryString, params, (err, result) => {
      if (err) {
        console.error("Error executing query: " + err.stack);
        return reject(err);
      }
      return resolve(result);
    });
  });
