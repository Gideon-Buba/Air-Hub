const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken } = require("./loginRoutes");

router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query the database to fetch user profile information based on the user ID
        const getUserQuery = `SELECT * FROM users WHERE id = ?`;
        const user = await db.query(getUserQuery, [userId]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = {
            id: user.id,
            email: user.email,
            // Add more profile fields as needed
        };

        return res.status(200).json({ profile: userProfile });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
