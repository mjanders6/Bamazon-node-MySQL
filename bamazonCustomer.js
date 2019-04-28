require('dotenv').config()
const { createConnection } = require('mysql2')
const inquirer = require('inquirer')

const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.BAMAZON_SECRET,
    database: 'greatBay_DB'
})

