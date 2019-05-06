-- DROP DATABASE IF EXISTS bamazon;
-- CREATE DATABASE bamazon;

-- USE bamazon;

-- CREATE TABLE products (
-- item_id INT AUTO_INCREMENT NOT NULL,
-- product_name VARCHAR(30) NOT NULL,
-- department_name VARCHAR(30) NOT NULL,
-- price INT NOT NULL,
-- stock_quantity INT NOT NULL,
-- PRIMARY KEY (item_id)
-- );

-- CREATE TABLE purchased (
-- item_id INT AUTO_INCREMENT NOT NULL,
-- user_name VARCHAR(30) NOT NULL,
-- product_name VARCHAR(30) NOT NULL,
-- department_name VARCHAR(30) NOT NULL,
-- price INT NOT NULL,
-- purchase_quantity INT NOT NULL,
-- total_cost DECIMAL(20,4) NOT NULL,
-- PRIMARY KEY (item_id)
-- );

-- CREATE TABLE shopping_cart (
-- item_id INT AUTO_INCREMENT NOT NULL,
-- user_name VARCHAR(30) NOT NULL,
-- product_name VARCHAR(30) NOT NULL,
-- department_name VARCHAR(30) NOT NULL,
-- price DECIMAL(20,4) NOT NULL,
-- purchase_quantity DECIMAL(20,4) NOT NULL,
-- total_cost DECIMAL(20,4) NOT NULL,
-- PRIMARY KEY (item_id)
-- );

-- INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ('Dell Computer', 'Electronics', 100, 250), 
-- ('iPhone', 'Electronics', 500, 20), 
-- ('Water Bottle', 'Hydration', 5, 400), 
-- ('Red Jacket', 'Clothing', 25, 200), 
-- ('Hobie SunGlasses', 'Accessories', 60, 102), 
-- ('Hiking Backpack', 'Outdoors', 150, 50), 
-- ('Mac Computer Cable', 'Electronics', 75, 10), 
-- ('Mouse', 'Electronics', 25, 2), 
-- ('Rebok Shoes', 'Footware', 30, 20), 
-- ('Trash Can', 'Household', 10, 500);

-- SELECT * FROM products;