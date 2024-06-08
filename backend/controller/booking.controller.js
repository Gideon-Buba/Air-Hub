const BookingService = require("../services/booking.service");

module.exports = class {
  static async getBooking(req, res) {
    res.json({ bookings: await BookingService.getBooking(req.user.id) });
  }
};
