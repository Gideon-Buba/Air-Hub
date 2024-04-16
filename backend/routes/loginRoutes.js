const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Db connection module
const db = require("../config/db");


const query = (queryString, params = []) => new Promise((resolve, reject) => {
        db().then(connection => {
            connection.query(queryString, params, (err, result) => {
                if (err) {
                    console.error('Error executing query: ' + err.stack);
                    return reject(err);
                }
                return resolve(result);
            });
        });
    });


router.post("/", verifyToken, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve user from the database based on email
        const getUserQuery = `SELECT * FROM users WHERE email = ?`;
        const result = await query(getUserQuery, [email]);

        // Check if user exists
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }


        // Compare passwords
        const [user] = result;
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const { password: _password, ...userData } = user

        // User authenticated successfully
        res.status(200).json({ message: 'Login successful', user: userData });

        const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: accessToken });
    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
