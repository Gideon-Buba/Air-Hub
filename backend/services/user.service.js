const { query } = require("../config/db");

module.exports = class {
  static async getUserByEmail(email) {
    const getUserQuery = `SELECT * FROM users WHERE email = ?`;
    const result = await query(getUserQuery, [email]);

    // Check if user exists
    if (result.length === 0) {
      return null;
    }

    // Compare passwords
    return result.at(0) || null;
  }
};
