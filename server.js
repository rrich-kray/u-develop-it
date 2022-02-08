
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

db.query('SELECT * FROM candidates', (err, rows) => { // row is the database query response. If there are no errors in the SQL query, then the err value is null
    console.log(rows)
})

// Default response for any other request (Not Found)
// This route must be last, or else it will override all other routes
app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`Server successfully launched on port ${PORT}!`)
})