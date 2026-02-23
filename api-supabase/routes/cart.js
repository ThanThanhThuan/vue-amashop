const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { auth } = require('../middleware/auth');

const getSessionId = (req) => req.headers['x-session-id'] || req.body.session_id || 'guest';

async function getUserIdFromToken(req) {
    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    try {
        const token = req.headers['authorization']?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id;
        }
    } catch (e) {}
    return null;
}

router.get('/', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const userId = await getUserIdFromToken(req);

        let query = supabase
            .from('carts')
            .select('*, products(name, regular_price, sale_price, slug)')
            .eq('session_id', sessionId);

        let items = [];
        
        if (userId) {
            const { data: userItems } = await supabase
                .from('carts')
                .select('*, products(name, regular_price, sale_price, slug)')
                .eq('user_id', userId);
            
            const { data: guestItems } = await query;
            
            items = [...(userItems || []), ...(guestItems || [])];
        } else {
            const { data } = await query;
            items = data || [];
        }

        for (let item of items) {
            const { data: images } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', item.product_id)
                .order('sort_order')
                .limit(1);
            
            if (images && images.length > 0) {
                item.products.image_url = images[0].image_url;
            }
            
            item.price = item.products?.sale_price || item.products?.regular_price;
            item.subtotal = item.price * item.quantity;
        }

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        res.json({ items, total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/count', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const userId = await getUserIdFromToken(req);

        let query = supabase
            .from('carts')
            .select('quantity', { count: 'exact' })
            .eq('session_id', sessionId);

        if (userId) {
            const { count: userCount } = await supabase
                .from('carts')
                .select('quantity', { count: 'exact' })
                .eq('user_id', userId);
            
            const { count: guestCount } = await query;
            
            return res.json({ count: (userCount || 0) + (guestCount || 0) });
        }

        const { count, error } = await query;
        if (error) throw error;
        
        res.json({ count: count || 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/add/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity = 1 } = req.body;
        const sessionId = getSessionId(req);
        const userId = await getUserIdFromToken(req);

        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId);

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (userId) {
            const { data: existing } = await supabase
                .from('carts')
                .select('*')
                .eq('product_id', productId)
                .eq('user_id', userId);

            if (existing && existing.length > 0) {
                await supabase
                    .from('carts')
                    .update({ quantity: existing[0].quantity + quantity })
                    .eq('id', existing[0].id);
            } else {
                await supabase
                    .from('carts')
                    .insert([{ 
                        product_id: productId, 
                        quantity, 
                        session_id: sessionId, 
                        user_id: userId 
                    }]);
            }
        } else {
            const { data: existing } = await supabase
                .from('carts')
                .select('*')
                .eq('product_id', productId)
                .eq('session_id', sessionId);

            if (existing && existing.length > 0) {
                await supabase
                    .from('carts')
                    .update({ quantity: existing[0].quantity + quantity })
                    .eq('id', existing[0].id);
            } else {
                await supabase
                    .from('carts')
                    .insert([{ 
                        product_id: productId, 
                        quantity, 
                        session_id: sessionId 
                    }]);
            }
        }

        res.json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const { quantity } = req.body;
        const { error } = await supabase
            .from('carts')
            .update({ quantity })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/remove/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('carts')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/clear', async (req, res) => {
    try {
        const sessionId = getSessionId(req);
        const userId = await getUserIdFromToken(req);

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

        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
