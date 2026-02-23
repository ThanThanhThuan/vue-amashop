const express = require('express');
const router = express.Router();
const supabase = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email);

        if (existing && existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data, error } = await supabase
            .from('users')
            .insert([{ 
                name, 
                email, 
                password: hashedPassword, 
                is_admin: false 
            }])
            .select();

        if (error) throw error;

        const user = data[0];
        const token = jwt.sign(
            { id: user.id, email, is_admin: false },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'User registered successfully', token, user: { id: user.id, name: user.email, email: user.email, is_admin: false } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);

        if (error) throw error;
        if (!users || users.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const user = users[0];
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, is_admin: user.is_admin },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, is_admin: user.is_admin } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/me', auth, async (req, res) => {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, is_admin')
            .eq('id', req.user.id);

        if (error) throw error;
        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
