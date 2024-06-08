const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const UserService = require("../services/user.service");

const query = (queryString, params = []) =>
  new Promise((resolve, reject) => {
    db().then((connection) => {
      connection.query(queryString, params, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return reject(err);
        }
        return resolve(result);
      });
    });
  });

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from the database based on email
    const getUserQuery = `SELECT * FROM users WHERE email = ?`;
    const result = await query(getUserQuery, [email]);

    // Check if user exists
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const [user] = result;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const { password: _password, ...userData } = user;
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // User authenticated successfully
    return res.status(200).json({
      message: "Login successful",
      user: userData,
      accessToken: accessToken,
    });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

async function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]; // looking for a header called 'authorization'
  const condition = typeof bearerHeader !== "undefined";

  if (!condition) {
    return res.sendStatus(403);
  }

  const [, token] = bearerHeader.split(" "); // header is usually sent as 'Authorization: Bearer <token>'
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded || !decoded.email) {
    return res.sendStatus(403);
  }

  req.user = await UserService.getUserByEmail(decoded.email);

  if (!req.user) {
    return res.sendStatus(403);
  }

  return next();
}

module.exports = {
  router: router,
  verifyToken: verifyToken,
};
