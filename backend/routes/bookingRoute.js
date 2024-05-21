const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("./loginRoutes");

// Get all bookings for the authenticated user
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query the database to fetch bookings for the authenticated user
        const getBookingsQuery = `SELECT * FROM bookings WHERE user_id = ?`;
        const bookings = await db.query(getBookingsQuery, [userId]);

        if (bookings.length === 0) {
            return res.status(404).json({ error: 'No bookings found' });
        }

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a new booking
router.post("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { date, time, details } = req.body;

        // Insert new booking into the database
        const createBookingQuery = `INSERT INTO bookings (user_id, date, time, details) VALUES (?, ?, ?, ?)`;
        await db.query(createBookingQuery, [userId, date, time, details]);

        return res.status(201).json({ message: 'Booking created successfully' });
    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an existing booking
router.put("/:bookingId", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;
        const { date, time, details } = req.body;

        // Update booking in the database
        const updateBookingQuery = `UPDATE bookings SET date = ?, time = ?, details = ? WHERE id = ? AND user_id = ?`;
        const result = await db.query(updateBookingQuery, [date, time, details, bookingId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found or not authorized' });
        }

        return res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error("Error updating booking:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an existing booking
router.delete("/:bookingId", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const bookingId = req.params.bookingId;

        // Delete booking from the database
        const deleteBookingQuery = `DELETE FROM bookings WHERE id = ? AND user_id = ?`;
        const result = await db.query(deleteBookingQuery, [bookingId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found or not authorized' });
        }

        return res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error("Error deleting booking:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
