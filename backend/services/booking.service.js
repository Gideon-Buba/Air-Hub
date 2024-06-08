const { NotFoundException } = require("../config/http-error");
const db = require("../config/db");

module.exports = class {
  static async getBooking(userId) {
    // Query the database to fetch bookings for the authenticated user
    const getBookingsQuery = `SELECT * FROM bookings WHERE user_id = ?`;
    const bookings = await db.query(getBookingsQuery, [userId]);

    if (bookings.length === 0) {
      throw new NotFoundException("No bookings found");
    }

    return bookings;
  }
};
