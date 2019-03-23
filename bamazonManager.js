var mysql = require("mysql");
var inquirer = require("inquirer");
// var moment = require("moment");

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

var bamazon = {


  start: function () {
    this.doConnect();
  },
  doConnect: function () {
    connection.connect(function (err) {
      if (err) throw err;
      bamazon.runManager();
    });
  },
  lowInventory: function () {
    connection.query('SELECT * FROM products WHERE stock_quantity <= 10',
      function (err, res) {
        if (err) {
          console.error(err)
        } if (res) {
          var lowInv = res[0].stock_quantity;
          var name = res[0].product_name;
          console.table(res);
          // console.log("Low Stock on " + name + ". You only have " + lowInv + " left")
        }
      });
  },

  addInventory: function () {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the item you would like to add?"
        },
        {
          name: "department",
          type: "input",
          message: "What department does it belong in?"
        },
        {
          name: "price",
          type: "input",
          message: "How much does it cost?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "stock",
          type: "input",
          message: "How many are in stock?",
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "INSERT INTO products SET ?",
          {
            product_name: answer.item,
            department_name: answer.department,
            price: answer.price || 0,
            stock_quantity: answer.stock || 0
          },
          function (err) {
            if (err) throw err;
            console.log("Your item was successfully!");
            bamazon.showProducts();
          }
          );
        });
    },
    

            showProducts: function () {
              connection.query('select * from products',
                function (err, res) {
                  if (err) throw err;
                  if (res) {
                    console.table(res);
                  }
                })
            },
  
  runManager: function () {
            inquirer

              .prompt({
                name: "action",
                type: "list",
                message: "What would you like to do?",
                choices: [
                  "View products for sale",
                  "View low inventory",
                  "Add to inventory",
                  "Add new product",
                  "Exit"
                ]
              })
              .then(function (answer) {
                switch (answer.action) {
                  case "View products for sale":
                    bamazon.showProducts();
                    break;

                  case "View low inventory":
                    bamazon.lowInventory();
                    break;

                  case "Add to inventory":
                    bamazon.addInventory();
                    break;

                  case "Add new product":
                    bamazon.addProduct();
                    break;

                  case "exit":
                    connection.end();
                    break;
                };
              });

          },

          showProducts: function () {
            connection.query('select * from products',
              function (err, res) {
                if (err) throw err;
                if (res) {
                  console.table(res);
                }
              });
          }
}
bamazon.start();
