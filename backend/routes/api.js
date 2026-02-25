const express = require('express');
const router = express.Router();
const db = require('../database/db');

// GET /api/health - Check API status
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        database: 'connected'
    });
});

// GET /api/requests - Get all requests
router.get('/requests', async (req, res) => {
    try {
        const rows = await db.allAsync(
            'SELECT * FROM requests ORDER BY date DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/requests/:id - Get single request
router.get('/requests/:id', async (req, res) => {
    try {
        const row = await db.getAsync(
            'SELECT * FROM requests WHERE id = ?',
            [req.params.id]
        );
        
        if (!row) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/requests - Create new request
router.post('/requests', async (req, res) => {
    const { name, email, phone, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
        return res.status(400).json({ 
            error: 'Имя, email и телефон обязательны для заполнения' 
        });
    }
    
    const date = new Date().toISOString().split('T')[0];
    
    try {
        const result = await db.runAsync(
            'INSERT INTO requests (name, email, phone, message, date) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, message || '', date]
        );
        
        res.status(201).json({ 
            id: result.lastID,
            message: 'Заявка успешно создана'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/requests/:id - Update request status
router.put('/requests/:id', async (req, res) => {
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ error: 'Статус обязателен' });
    }
    
    try {
        const result = await db.runAsync(
            'UPDATE requests SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        
        res.json({ 
            message: 'Статус обновлен',
            changes: result.changes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/requests/:id - Delete request
router.delete('/requests/:id', async (req, res) => {
    try {
        const result = await db.runAsync(
            'DELETE FROM requests WHERE id = ?',
            [req.params.id]
        );
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        
        res.json({ 
            message: 'Заявка удалена',
            changes: result.changes
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/stats - Get statistics
router.get('/stats', async (req, res) => {
    try {
        const stats = await db.getAsync(`
            SELECT 
                COUNT(*) as total_requests,
                SUM(CASE WHEN status = 'Новая' THEN 1 ELSE 0 END) as new_requests,
                SUM(CASE WHEN status = 'В работе' THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = 'Обработано' THEN 1 ELSE 0 END) as completed
            FROM requests
        `);
        
        res.json({
            ...stats,
            total_requests: stats.total_requests || 0,
            new_requests: stats.new_requests || 0,
            in_progress: stats.in_progress || 0,
            completed: stats.completed || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/track - Track page view
router.post('/track', async (req, res) => {
    const { page, visitor } = req.body;
    
    try {
        await db.runAsync(
            'UPDATE stats SET page_views = page_views + 1, last_updated = datetime("now")'
        );
        
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;