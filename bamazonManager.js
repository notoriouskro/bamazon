var mysql = require("mysql");
var inquirer = require("inquirer");
var moment = require("moment");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});


// View Products for sale
// View Low Inventory
// Add to Inventory
// Add New Product