const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
    try {
        const { category, featured, search, page = 1, limit = 20 } = req.query;
        
        let query = supabase
            .from('products')
            .select('*, categories(name)')
            .eq('is_active', true);

        if (category) {
            query = query.eq('category_id', category);
        }
        if (featured) {
            query = query.eq('is_featured', true);
        }
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;
        
        const { data: products, error } = await query
            .range(from, to)
            .order('created_at', { ascending: false });

        if (error) throw error;

        for (let product of products) {
            const { data: images } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', product.id)
                .order('sort_order');
            product.images = images || [];
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('is_active', true)
            .eq('is_featured', true)
            .limit(12);

        if (error) throw error;

        for (let product of products) {
            const { data: images } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', product.id)
                .order('sort_order');
            product.images = images || [];
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .eq('slug', req.params.slug)
            .eq('is_active', true);

        if (error) throw error;
        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = products[0];
        
        const { data: images } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', product.id)
            .order('sort_order');
        product.images = images || [];

        const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', product.category_id)
            .neq('id', product.id)
            .eq('is_active', true)
            .limit(4);
        
        for (let rel of related || []) {
            const { data: images } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', rel.id)
                .order('sort_order')
                .limit(1);
            rel.images = images || [];
        }
        
        product.related_products = related || [];

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
