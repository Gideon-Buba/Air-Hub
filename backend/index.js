require('dotenv').config();
const express = require('express');
const app = express();


app.use(express.json());

const dbConnection = require('./config/db');
const dbStructureCreator = require('./config/db-structure');


app.get('/hello', async (req, res) => {
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
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
});