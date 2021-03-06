# Bamazon-node-MySQL
Amazon like store front using MyQSL and Node.js

## List of Tables
1. Products - Used to store items in the store
1. Shopping Cart - Used to store items in a users shopping cart
1. Purchased - Used to store items that users have purchased

# Overview
This program is a simulation of a storefront in a terminal environment. 

When an item is chosen it is removed from the Products table and sent to the Shopping Cart table. Items in the shopping can be removed prior to closing out the transaction. 

When the shopping is done the transaction can be completed. When the Checkout option is selected the items in the Shopping Cart table are removed from the Shopping Cart and then added to the Purchased table to keep a history on transactions. 

# Link to Project Video
[Project Video](https://drive.google.com/file/d/1bARBkGNNhy5w8xFSzj5uvl2rGA4tfA41/view?usp=sharing)

# Future

## Remove from the shopping cart
Need to create a function to remove a selection from the shopping cart and add it back to inventory. 

## Future tables
1. departments

### Enhanced view
[Table from NPM](https://www.npmjs.com/package/table#table-usage-predefined-border-templates) can be used to enhance the command line look. 

### Manager View actions

1. View products for sale
1. View low inventory
1. Add to inventory
1. Add new products

### Supervisor View actions 

1. View product sales by Department
1. Create new Departments