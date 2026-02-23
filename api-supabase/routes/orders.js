const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { auth } = require('../middleware/auth');

router.post('/', async (req, res) => {
    try {
        const { shipping_name, shipping_email, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, notes } = req.body;
        
        const sessionId = req.headers['x-session-id'] || req.body.session_id || 'guest';
        
        let userId = null;
        const jwt = require('jsonwebtoken');
        require('dotenv').config();
        
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (e) {}
        }

        let query = supabase
            .from('carts')
            .select('*, products(name, regular_price, sale_price)')
            .eq('session_id', sessionId);

        const { data: guestItems } = await query;

        let items = guestItems || [];
        
        if (userId) {
            const { data: userItems } = await supabase
                .from('carts')
                .select('*, products(name, regular_price, sale_price)')
                .eq('user_id', userId);
            
            items = [...items, ...(userItems || [])];
        }

        if (items.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        let subtotal = 0;
        for (let item of items) {
            const price = item.products?.sale_price || item.products?.regular_price;
            subtotal += price * item.quantity;
        }

        const orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 10).toUpperCase();

        const { data: orderResult, error: orderError } = await supabase
            .from('orders')
            .insert([{
                user_id: userId,
                order_number: orderNumber,
                status: 'pending',
                subtotal,
                tax: 0,
                shipping_cost: 0,
                total: subtotal,
                shipping_name,
                shipping_email,
                shipping_phone,
                shipping_address,
                shipping_city,
                shipping_state,
                shipping_zip,
                shipping_country,
                notes
            }])
            .select();

        if (orderError) throw orderError;

        for (let item of items) {
            const price = item.products?.sale_price || item.products?.regular_price;
            await supabase
                .from('order_items')
                .insert([{
                    order_id: orderResult[0].id,
                    product_id: item.product_id,
                    product_name: item.products?.name,
                    price,
                    quantity: item.quantity,
                    subtotal: price * item.quantity
                }]);
        }

        if (userId) {
            await supabase
                .from('carts')
                .delete()
                .eq('user_id', userId);
        }
        await supabase
            .from('carts')
            .delete()
            .eq('session_id', sessionId);

        res.json({ message: 'Order placed successfully', order_number: orderNumber, order_id: orderResult[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', req.params.id)
            .or(`user_id.eq.${req.user.id},admin.eq.true`);

        if (error) throw error;
        if (!orders || orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', req.params.id);
        
        orders[0].items = items;

        res.json(orders[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
