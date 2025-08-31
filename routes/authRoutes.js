const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

// REGISTER
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Visi laukai yra privalomi' });
    }

    try {
        // patikrinam ar jau egzistuoja vartotojas
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Vartotojas su tokiu vardu arba el. paštu jau egzistuoja' });
        }

        // hash'inam slaptažodį
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // įrašom į DB
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
            [username, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Serverio klaida');
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Vardas ir slaptažodis yra privalomi' });
    }

    try {
        // randam vartotoją
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Neteisingas vartotojas arba slaptažodis' });
        }

        // tikrinam slaptažodį
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Neteisingas vartotojas arba slaptažodis' });
        }

        // generuojam JWT
        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Serverio klaida');
    }
});

module.exports = router;
