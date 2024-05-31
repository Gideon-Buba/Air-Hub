const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Db connection module
const db = require("../config/db");

// POST signup route to db
router.post("/", async (req, res) => {
  try {
    const connection = await db();
    const { name, email, password, phone_number } = req.body;

    // password hashing function
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert query
    const createUserQuery = `
            INSERT INTO users (name, email, password, phone_number)
            VALUES (?, ?, ?, ?)
        `;

    await connection.query(createUserQuery, [
      name,
      email,
      hashedPassword,
      phone_number,
    ]);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
