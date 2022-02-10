const inputCheck = require('./utils/inputCheck') 
const mysql = require('mysql2')
const express = require('express')

const app = express()
const PORT = 3001 || process.env.PORT
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username
        user: 'root',
        // Your MySQL password
        password: 'password',
        database: 'election'
    },
    console.log('connected to the election database')
)

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world!'
    })
})

//create a candidate
// const sql = 'INSERT INTO candidates (id, first_name, last_name, industry_connected) VALUES (?,?,?,?)'
// const params = [11, 'Ronald', 'Firbank', 1]

// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log((result))
// })

app.get('/api/parties', (req, res) => {
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

app.get('/api/party/:id', (req, res) => {
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

app.delete('/api/party/:id', (req, res) => {
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
 
app.delete('/api/candidate/:id', (req, res) => {
    const sql = "DELETE FROM candidates WHERE id = ?"
    const params = [req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message })
            return;
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        }
    })
})

// Create a candidate
app.post('/api/candidate', ({ body }, res) => { // use object destructuring to pull data out of the req.body object
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUE (?,?,?)`
    const params = [body.first_name, body.last_name, body.industry_connected]
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }
        res.json({
            message: 'success',
            data: body
        })
    })
})


app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.id
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`

    const params = [req.params.id]
    
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return;
        }
        res.json({
            message: 'success',
            data: row
        })
    })
})

// get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                 AS party_name
                 FROM candidates
                 LEFT JOIN parties
                 ON candidates.party_id = parties.id`

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

app.put('/api/candidates/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id')
    if (errors) {
        res.status(400).json({ error: errors })
        return;
    }

    const sql = `UPDATE candidates SET party_id = ? WHERE id = ?`
    const params = [req.body.party_id, req.params.id]

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message })
        } else if (!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            })
        } else {
            res.json({
                message: 'Success',
                data: req.body,
                changes: result.affectedRows
            })
        }
    })
})

// db.query('SELECT * FROM candidates', (err, rows) => { // row is the database query response. If there are no errors in the SQL query, then the err value is null
//     console.log(rows)
// })

// Default response for any other request (Not Found)
// This route must be last, or else it will override all other routes
app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`Server successfully launched on port ${PORT}!`)
})