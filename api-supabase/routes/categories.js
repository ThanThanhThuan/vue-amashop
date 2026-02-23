const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true })
            .order('name', { ascending: true });

        if (error) throw error;
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:slug', async (req, res) => {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', req.params.slug)
            .eq('is_active', true);

        if (error) throw error;
        if (!categories || categories.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(categories[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
