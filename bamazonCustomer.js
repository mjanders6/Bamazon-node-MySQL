require('dotenv').config()
const { createConnection } = require('mysql2')
const inquirer = require('inquirer')

let username 

// create connection 
const db = createConnection({
    host: process.env.BAMAZON_HOST,
    user: process.env.BAMAZON_USER,
    password: process.env.BAMAZON_SECRET,
    database: process.env.BAMAZON_DB
})

db.connect(e => {
    if (e) { console.log(e) } else {
        productView()
    }
})

let productView = _ => {
    db.query(`SELECT * FROM products`, (error, results) => {
        if (error) { console.log(error) } else {
            inquirer
            .prompt([
                    // {
                    //     name: 'username',
                    //     type: 'input',
                    //     message: 'What is your name'
                    // },
                    {
                        name: 'choice',
                        type: 'rawlist',
                        choices: function () {
                            let prodList = []
                            results.forEach((items) => {
                                let { item_id, product_name, department_name, price, stock_quantity } = items
                                prodList.push(`${item_id} ${product_name} $${price} each (${stock_quantity} left in stock)`)
                            })
                            return prodList
                        },
                        message: 'Choose something to buy'
                    },
                    {
                        name: 'qtyBuy',
                        type: 'input',
                        message: 'How many do you want to buy?'
                    }
                ]).then((answer) => {
                    console.log(answer)
                    // process.exit()
                    productView()
                })
            // let prodList = []
            // results.forEach((items) => {
            //     let { item_id, product_name, department_name, price, stock_quantity } = items
            //     prodList.push(`${item_id} ${product_name} $${price} each (${stock_quantity} left in stock)`)               
            // })
            // return prodList 

            // console.log(prodList)
        }
    })

}
