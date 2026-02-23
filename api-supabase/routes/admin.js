const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { auth, admin } = require('../middleware/auth');

router.get('/dashboard', auth, admin, async (req, res) => {
    try {
        const { count: total_orders } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });

        const { count: total_products } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        const { count: total_users } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        const { data: revenueData } = await supabase
            .from('orders')
            .select('total')
            .neq('status', 'cancelled');
        
        const total_revenue = revenueData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        const { data: recent_orders } = await supabase
            .from('orders')
            .select('*, users(name)')
            .order('created_at', { ascending: false })
            .limit(10);

        res.json({
            stats: {
                orders: total_orders || 0,
                products: total_products || 0,
                users: total_users || 0,
                revenue: total_revenue
            },
            recent_orders
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categories', auth, admin, async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/categories', auth, admin, async (req, res) => {
    try {
        const { name, description, parent_id, is_active, sort_order } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        const { error } = await supabase
            .from('categories')
            .insert([{
                name,
                slug,
                description,
                parent_id: parent_id || null,
                is_active: is_active !== false,
                sort_order: sort_order || 0
            }]);

        if (error) throw error;
        res.json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/categories/:id', auth, admin, async (req, res) => {
    try {
        const { name, description, parent_id, is_active, sort_order } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        
        const { error } = await supabase
            .from('categories')
            .update({
                name,
                slug,
                description,
                parent_id: parent_id || null,
                is_active: is_active !== false,
                sort_order: sort_order || 0
            })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/categories/:id', auth, admin, async (req, res) => {
    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/products', auth, admin, async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/products', auth, admin, async (req, res) => {
    try {
        const { name, slug, short_description, description, regular_price, sale_price, sku, stock_quantity, category_id, is_active, is_featured } = req.body;
        
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                short_description,
                description,
                regular_price,
                sale_price: sale_price || null,
                sku,
                stock_quantity,
                category_id,
                is_active: is_active !== false,
                is_featured: is_featured || false
            }])
            .select();

        if (error) throw error;
        res.json({ message: 'Product created successfully', id: data[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/products/:id', auth, admin, async (req, res) => {
    try {
        const { name, slug, short_description, description, regular_price, sale_price, sku, stock_quantity, category_id, is_active, is_featured } = req.body;
        
        const { error } = await supabase
            .from('products')
            .update({
                name,
                slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
                short_description,
                description,
                regular_price,
                sale_price: sale_price || null,
                sku,
                stock_quantity,
                category_id,
                is_active: is_active !== false,
                is_featured: is_featured || false
            })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/products/:id', auth, admin, async (req, res) => {
    try {
        await supabase
            .from('product_images')
            .delete()
            .eq('product_id', req.params.id);
            
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/orders', auth, admin, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, users(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/orders/:id', auth, admin, async (req, res) => {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*, users(name)')
            .eq('id', req.params.id);

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

router.put('/orders/:id/status', auth, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', req.params.id);

        if (error) throw error;
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
