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
  password: "Steinh0fer",
  database: "bamazon_db"
});

var bamazon = {
    
  
    start: function () {
      this.doConnect();
    },
    doConnect: function () {
        connection.connect(function (err) {
          if (err) throw err;
          connection.query("SELECT * FROM products", function (err, res) {
            if (err) {
              console.error(err)
            }
            bamazon.showProducts(res);
            bamazon.runManager();
          })
    
        });
      },

      showProducts: function (res) {
        console.table(res)
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
      .then(function(answer) {
        switch (answer.action) {
        case "Find songs by artist":
          artistSearch();
          break;
  
        case "View low inventory":
          multiSearch();
          break;
  
        case "Add to inventory":
          rangeSearch();
          break;
  
        case "Add new product":
          songSearch();
          break;
            
        case "exit":
          connection.end();
          break;
        }
      });
  }
}
bamazon.start();
