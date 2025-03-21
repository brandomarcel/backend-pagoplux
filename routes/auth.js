const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar datos
        if (!username || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios' });

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'El usuario ya existe' });

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear nuevo usuario
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validar datos
        if (!username || !password) return res.status(400).json({ message: 'Todos los campos son obligatorios!' });

        // Buscar usuario
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrectos!' });

        // Comparar contraseñas
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Usuario o contraseña incorrectos!' });

        // Generar Token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
