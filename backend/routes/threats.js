const express = require('express');
const router = express.Router();
const { pool } = require('../db.js');
const { PythonShell } = require('python-shell');
const path = require('path');


router.get('/', async (req, res) => {
  try {
    console.log("Query:", req.query);  // <-- add this
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let baseQuery = 'SELECT * FROM threats';
    let countQuery = 'SELECT COUNT(*) FROM threats';
    let conditions = [];
    let values = [];

    if (category) {
      values.push(category);
      conditions.push(`threat_category = $${values.length}`);
    }
    if (search) {
      values.push(`%${search}%`);
      conditions.push(`cleaned_threat_description ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
      countQuery += ' WHERE ' + conditions.join(' AND ');
    }

    baseQuery += ` ORDER BY id LIMIT ${limit} OFFSET ${offset}`;
    console.log("SQL:", baseQuery, values);

    const [result, countResult] = await Promise.all([
      pool.query(baseQuery, values),
      pool.query(countQuery, values)
    ]);

    res.json({
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      threats: result.rows
    });
  } catch (err) {
    console.error("Error in /api/threats:", err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/stats', async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM threats');
    const byCategory = await pool.query('SELECT threat_category, COUNT(*) FROM threats GROUP BY threat_category');
    const bySeverity = await pool.query('SELECT severity_score, COUNT(*) FROM threats GROUP BY severity_score');

    res.json({
      total: parseInt(total.rows[0].count),
      byCategory: byCategory.rows,
      bySeverity: bySeverity.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM threats WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Threat not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/analyze', async (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description required' });
    }

    try {
        let pyshell = new PythonShell(path.join(__dirname, '../ml/predict.py'), {
            mode: 'json',
            args: [description]
        });

        pyshell.on('message', function (message) {
            
            res.json(message);
        });

        pyshell.end(function (err) {
            if (err) throw err;
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
