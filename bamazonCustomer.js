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

const purchView = _ => {
    prodView('*')
        .then(r => {

            r.forEach(({ item_id, product_name, price, stock_quantity }) => {
                console.log(`
                ${item_id}) ${product_name} ($${price} each) (${stock_quantity} left in stock)
                `)
            })
        })
        .catch(e => console.log(e))
}

// userName
const userName = _ => {
    prompt({
        type: 'input',
        name: 'uName',
        message: 'Please register your name:',
    })
        .then(({ uName }) => {
            username = uName
            addToCart()
            // process.exit()
        })
        .catch(e => console.log(e))
}

// addToCart()
// show items in DB, select one to buy, add it to shopping cart, remove from products DB
// prompt to review cart, choose more items, exit
const addToCart = _ => {
    prodView('*')
        .then(r => {
            console.log(r.map(({ item_id, product_name, price, stock_quantity }) => `${item_id}) ${product_name} ($${price} each) (${stock_quantity} left in stock)`))

            prompt([{
                type: 'rawlist',
                name: 'product_name',
                message: 'Select the item to purchase:',
                choices: r.map(({ product_name }) => product_name)
            },
            {
                type: 'input',
                name: 'selQTY',
                message: 'How many would you like to purchase?'
            }])
                .then((response) => {
                    let cart = {}
                    r.forEach(item => {
                        if (item.product_name === response.product_name) {
                            cart = item
                        }
                    })
                    cart.totalCost = response.selQTY * cart.price
                    // console.log(cart)

                    if (response.selQTY > cart.stock_quantity) {
                        console.log('not enough stock')
                        addToCart()
                    } else {
                        console.log('thank you')
                        db.query(`INSERT INTO shopping_cart SET ?`, {
                            user_name: username,
                            product_name: cart.product_name,
                            department_name: cart.department_name,
                            price: cart.price,
                            purchase_quantity: response.selQTY,
                            total_cost: cart.totalCost
                        }, (err) => {
                            if (err) throw err
                            console.log('Added to shopping cart!')
                            // addToCart()
                        })

                        db.query(`UPDATE products SET ? WHERE ?`,
                            [
                                {
                                    stock_quantity: cart.stock_quantity - response.selQTY
                                },
                                {
                                    item_id: cart.item_id
                                }
                            ], (err) => {
                                if (err) throw err
                                // console.log('added')
                                // addToCart()
                            })
                        openBamazon()
                    }
                })
                .catch(e => console.log(e))

        })
        .catch(e => console.log(e))
}


// reviewCart()
// show items in shopping cart
// prompt to check out, remove items, choose more items, exit

// checkOut()
// total what is in the cart, add items to the purchased DB

// removeCart()
// show items in shopping cart, select one to remove, remove it from the shopping cart, add it back to products DB, 
// prompt to check out, remove items, choose more items, exit

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
                    (!username) ? userName() : addToCart()
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
        // purchView()
    }
})