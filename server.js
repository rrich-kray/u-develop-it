const inputCheck = require('./utils/inputCheck') 
const mysql = require('mysql2')
const express = require('express')
const db = require('./db/connection')
const apiRoutes = require('./routes/apiRoutes')

const app = express()
const PORT = 3001 || process.env.PORT
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', apiRoutes)

// connect to database
// const db = mysql.createConnection(
//     {
//         host: 'localhost',
//         // Your MySQL username
//         user: 'root',
//         // Your MySQL password
//         password: 'password',
//         database: 'election'
//     },
//     console.log('connected to the election database')
// )

app.get('/', (req, res) => {
    res.json({
        message: 'Hello world!'
    })
})

// Default response for any other request (Not Found)
// This route must be last, or else it will override all other routes
app.use((req, res) => {
    res.status(404).end()
})

db.connect(err => {
    if (err) throw err
    console.log('Database connected.')
    app.listen(PORT, () => {
        console.log(`Server successfully launched on port ${PORT}!`)
    })
})