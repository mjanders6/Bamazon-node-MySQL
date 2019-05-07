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

async function shoppingCartView(column) {
    let response = await new Promise((resolve, reject) => {
        db.query(`SELECT ${column} FROM shopping_cart Where ?`, { user_name: username }, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
    return response
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
            console.log(`
            Hello ${username}, welcome to Bamazon!
            `)
            openBamazon()
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
                        console.log(`
                        Sorry, not enough stock. Please revise the QTY.
                        `)
                        addToCart()
                    } else {
                        console.log(`
                        ${cart.product_name} added to your shopping cart
                        `)
                        db.query(`INSERT INTO shopping_cart SET ?`, {
                            user_name: username,
                            product_name: cart.product_name,
                            department_name: cart.department_name,
                            price: cart.price,
                            purchase_quantity: response.selQTY,
                            total_cost: cart.totalCost
                        }, (err) => {
                            if (err) throw err
                            // console.log('Added to shopping cart!')
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
                            })
                        openBamazon()
                    }
                })
                .catch(e => console.log(e))

        })
        .catch(e => console.log(e))
}

// checkOut()
// total what is in the cart, add items to the purchased DB
const checkOut = _ => {
    shoppingCartView('*')
        .then(r => {
            // let [{ user_name, product_name, department_name, price, purchase_quantity, total_cost }] = r
            let que = []
            for (i = 0; i < r.length; i++) {
                que.push([r[i].user_name, r[i].product_name, r[i].department_name, r[i].price, r[i].purchase_quantity, r[i].total_cost])
            }
            console.log(`
            Thank you for shopping at Bamazon!
            `)

            db.query(`INSERT INTO purchased(user_name, product_name, department_name, price, purchase_quantity, total_cost) VALUES ?`,
                [que], (err) => {
                    if (err) throw err
                    // console.log('Added to shopping cart!')
                })

            db.query(`DELETE FROM shopping_cart WHERE ?`, { user_name: username }, (err, r) => {
                if (err) throw err
                // console.log('')
            })
            openBamazon()
        })
        .catch(e => console.log(e))
}


// removeCart()
// show items in shopping cart, select one to remove, remove it from the shopping cart, add it back to products DB, 
// prompt to check out, remove items, choose more items, exit
const removeCart = _ => {
    console.log(`
    Need to create a delete action in the shopping cart
    `)
    openBamazon()
    // shoppingCartView('*')
    //     .then(r => {
    //         console.log(r)
    //         prompt({
    //             type: 'rawlist',
    //             name: 'itemRemove',
    //             message: 'Select the item to purchase:',
    //             choices: r.map(({ product_name}) => product_name)
    //         })
    //         .then(({ itemRemove, item_id }) => {
    //             // let {item_id, user_name, product_name, department_name, price, purchase_quantity } = r
    //             // db.query(`DELETE FROM shopping_cart WHERE ?`, [{item_id}], (err, r) => {
    //             //     if (err) throw err
    //             //     // console.log()
    //             // })
    //             console.log(item_id)
    //             openBamazon()
    //             })
    //             .catch(e => console.log(e))
    //     })
    //     .catch(e => console.log(e))
}


// reviewCart()
// show items in shopping cart
// prompt to check out, remove items, choose more items, exit
const reviewCart = _ => {
    shoppingCartView('*')
        .then((r) => {
            let s = 0
            for (i = 0; i < r.length; i++) {
                s += parseInt(r[i].total_cost)
            }
            console.log(r.map(({ item_id, product_name, price, purchase_quantity, total_cost }) => `${item_id}) ($${price} each) ${product_name} ${purchase_quantity} $${total_cost}`))
            console.log(`
            The Total Cost is: $${s}
            `)
            prompt({
                type: 'list',
                name: 'cartshow',
                message: 'Select an option:',
                choices: ['Back to Menu', 'Finalize Purchase', 'Remove an Item', 'Exit--->']
            })
                .then(({ cartshow }) => {
                    switch (cartshow) {
                        case 'Back to Menu':
                            openBamazon()
                            break;

                        case 'Finalize Purchase':
                            checkOut()
                            break;

                        case 'Remove an Item':
                            removeCart()
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
        })
        .catch(e => console.log(e))
}

// initial view
const openBamazon = _ => {
    prompt([
        {
            type: 'list',
            name: 'prodshow',
            message: 'Select an option:',
            choices: ['Product View / Go Shopping', 'Check Shopping Cart', 'Exit--->']
        }
    ])
        .then(({ prodshow }) => {

            switch (prodshow) {
                case 'Product View / Go Shopping':
                    addToCart()
                    break;

                case 'Check Shopping Cart':
                    reviewCart()

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
        // (!username) ? userName() : openBamazon()
        (!username) ? userName() : removeCart()
    }
})