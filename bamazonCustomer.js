require('dotenv').config()
const { createConnection } = require('mysql2')
const inquirer = require('inquirer')

// create connection 
const db = createConnection({
    host: process.env.BAMAZON_HOST,
    user: process.env.BAMAZON_USER,
    password: process.env.BAMAZON_SECRET,
    database: process.env.BAMAZON_DB
})

db.connect(e => {
    if (e) { console.log(e) } else {
        db.query(`SELECT * FROM products`, (error, results) => {
            if (error) { console.log(error) } else {
                // console.log(results)
                results.forEach((items) => {
                    let {item_id, product_name, department_name, price, stock_quantity} = items
                    console.log(`${item_id} ${product_name} $${price} each (${stock_quantity} left in stock)`)
                    // console.log(`
                    //     ID: ${items.item_id}
                    //     Name: ${items.product_name}
                    //     Dept. Name: ${items.department_name}
                    //     Price: $${items.price}
                    // `)
                })
                process.exit()
            }
        })
    }
})
