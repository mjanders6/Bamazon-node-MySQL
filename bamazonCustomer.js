require('dotenv').config()
const { createConnection } = require('mysql2')
const { prompt } = require('inquirer')

let username
let shoppingCart = []

// create connection 
const db = createConnection({
    host: process.env.BAMAZON_HOST,
    user: process.env.BAMAZON_USER,
    password: process.env.BAMAZON_SECRET,
    database: process.env.BAMAZON_DB
})

async function prodView(column) {
    let response = await new Promise((resolve, reject) => {
        db.query(`SELECT ${column} FROM products`, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
    return response
}

// addToCart()
// show items in DB, select one to buy, add it to shopping cart, remove from products DB
// prompt to review cart, choose more items, exit

// reviewCart()
// show items in shopping cart
// prompt to check out, remove items, choose more items, exit

// checkOut()
// total what is in the cart, add items to the purchased DB

// removeCart()
// show items in shopping cart, select one to remove, remove it from the shopping cart, add it back to products DB, 
// prompt to check out, remove items, choose more items, exit

// let productView = _ => {
//     db.query(`SELECT * FROM products`, (error, results) => {
//         if (error) { console.log(error) } else {
//             inquirer
//                 .prompt([
//                     {
//                         name: 'choice',
//                         type: 'rawlist',
//                         choices: function () {
//                             let prodList = []
//                             results.forEach((items) => {
//                                 let { item_id, product_name, department_name, price, stock_quantity } = items
//                                 prodList.push(`${item_id} ${product_name} $${price} each (${stock_quantity} left in stock)`)
//                             })
//                             return prodList
//                         },
//                         message: 'Choose something to buy'
//                     },
//                     {
//                         name: 'qtyBuy',
//                         type: 'input',
//                         message: 'How many do you want to buy?'
//                     }
//                 ]).then((answer) => {
//                     // process.exit()
//                     productView()
//                 })
//         }
//     })

// }

const openBamazon = _ => {
    prompt({
        type: 'list',
        name: 'prodshow',
        message: 'Select an option:',
        choices: ['Product View / Go Shopping', 'Check Shopping Cart', 'Check Out', 'Exit--->']
    })
        .then(({ prodshow }) => {
            switch (prodshow) {
                case 'Product View / Go Shopping':
                    prodView('*')
                        .then(r => {
                            console.log(r.map(({ product_name, price }) => `${product_name} $${price}`))
                            
                            // r.forEach(({ item_id, product_name, department_name, price }) => {
                            //     console.log(`
                            //         ==========
                            //         id: ${item_id} 
                            //         ${product_name} $${price}
                            //         ${department_name}
                            //         ==========
                            //         `)
                            // })
                            openBamazon()
                        })
                        .catch(e => console.log(e))
                    break;

                case 'Check Shopping Cart':

                    break;

                case 'Check Out':

                    break;

                case 'Exit--->':
                    process.exit()
                    break;

                default:
                    openBamazon()
                    break;
            }
        })
        .catch(e => console.log(e))
}

db.connect(e => {
    if (e) { console.log(e) } else {
        openBamazon()
    }
})