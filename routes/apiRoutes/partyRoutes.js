const express = require('express')
const router = express().router()
const db = require('../../db/connection')

// Get all parties

app.get('/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
})

app.get('/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }
        res.json({
            message: 'success',
            data: result
        })
    })
})

app.delete('/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`
    const params = [req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
            res.send(400).json({ error: err.message })
        } else if (!result.affectedRows) {
            res.json({
                message: 'Party not found'
            });
        } else {
            res.json({
                message: 'deleted',
                data: result.affectedRows,
                id: req.params.id
            })
        }
    })
})
 