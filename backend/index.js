require('dotenv').config();
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


app.use(express.json());

const dbConnection = require('./config/db');
const dbStructureCreator = require('./config/db-structure');


app.get('/users', async (req, res) => {
    const connection = await dbConnection();
    connection.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.error('Error fetching users:', err);
            res.status(500).json({ error: 'Failed to fetch users' });
        } else {
            res.json(result);
        }
    })
});



dbConnection().then(connection=> {
    return dbStructureCreator(connection);
}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});