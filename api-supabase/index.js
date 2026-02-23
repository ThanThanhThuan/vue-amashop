const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AmaShop API (Supabase) is running' });
});

if (process.env.VERCEL === undefined) {
    app.listen(PORT, () => {
        console.log(`AmaShop API (Supabase) running on http://localhost:${PORT}`);
    });
}

module.exports = app;
