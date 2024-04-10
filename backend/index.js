require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

const dbConnection = require('./config/db');
const dbStructureCreator = require('./config/db-structure');

const signUpRoute = require('./routes/signUpRoute');

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api/signup', signUpRoute);



// app.get('/users', async (req, res) => {
//     const connection = await dbConnection();
//     connection.query("SELECT * FROM users", (err, result) => {
//         if (err) {
//             console.error('Error fetching users:', err);
//             res.status(500).json({ error: 'Failed to fetch users' });
//         } else {
//             res.json(result);
//         }
//     })
// });

// app.get('/users/:id', async (req, res) => {
//     const connection = await dbConnection();
//     connection.query(`SELECT * FROM users WHERE id=${req.params.id}`, (err, result) => {
//         if (err) {
//             console.error('Error fetching user:', err);
//             res.status(500).json({ error: 'Failed to fetch user' });
//         } else if (result.length === 0) {
//             res.status(404).json({ error: 'User not found' });
//         } else {
//             res.json(result[0]);
//         }
//     })
// })


dbConnection().then(connection=> {
    return dbStructureCreator(connection);
}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});