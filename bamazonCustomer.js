require('dotenv').config()
const { createConnection } = require('mysql2')
const inquirer = require('inquirer')

// create connection 
const db = createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.BAMAZON_SECRET,
    database: 'bamazon'
})

db.query(`SELECT * FROM products`, (error, results) => {
    if (error) { console.log(error) } else {
        // console.log(results)
        results.forEach((items) => {
            console.log(`
                Name: ${items.product_name}
                Dept. Name: ${items.department_name}
                Price: $${items.price}
            `)
        })

        process.exit()
    }
})