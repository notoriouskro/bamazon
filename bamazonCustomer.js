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

var bamazon = {
  productID: 0,
  orderQTY: 0,
  productInv: 0,
  

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
        bamazon.sellProduct();
      })

    });
  },

  showProducts: function (res) {
    console.table(res)
  },
  sellProduct: function () {
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Please select a product you wish to purchase by ID',
          name: 'productID'
        },
        {
          type: 'input',
          message: 'Please enter the quantity of the product you wish to purchase',
          name: 'orderQTY'
        }
      ])
      .then(function (inq) {
        this.productID = inq.productID;
        this.orderQTY = inq.orderQTY;
        this.productInv = bamazon.checkInv(this.productID);
        // console.log("sell Value " + productInv)
        
      })

  },
  checkInv: function (id) {
    connection.query('select products.stock_quantity from products where ?',
    {id:id},
    function (err, res){
      if (err) throw err;
      if(res){
        productInv = res[0].stock_quantity;
        // console.log("res " + res[0].stock_quantity);
        console.log('Checkinv productInv ' + productInv);
        if(this.productInv >= this.orderQTY){
          bamazon.doSale(this.productID,this.orderQTY);
        }else {
          console.log("Sorry, we do not have enough in stock.")
        }
        // console.log("Product Id", this.productID)
        // console.log("Product Qty", this.orderQTY)
        connection.end();

      }


    })

  },
  doSale: function(id,orderQTY,productInv){
    newInv = bamazon.productInv-orderQTY;
    console.log("New Inventory" + newInv)
    connection.query('select products.stock_quantity set ? where ?',
    [{stock_quantity: newInv}, {id:id}],
    function (err, res){
      if (err) throw err;
      if(res){
        console.log(res);
        return res;
      }
    },
    this.printReciept(product_name,price,orderQTY));
    
  },
  printReciept: function(product_name,price,orderQTY){
    console.log('Thanks for shopping with us!');
    console.log(moment().format('MMMM do YYYY, h:mm a'));
    console.log('Item: ' + this.product_name);
    console.log('Qty: ' + orderQTY + 'Price: ' + price + 'Total: ' + (price*orderQTY));
  }

};




bamazon.start();