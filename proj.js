/***** TREVOR JONES ***** FINAL PROJECT CS 451 **********************
* This web app uses Node.js along with express to produce a frontend html webpage. The backend is connected to a mysql database with fictional entries for data. The user can display data from multiple tables in the database by using the webpage UI. Order By is not working currently.
********************************************************************/
var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "sql3.freemysqlhosting.net",
  user: "sql3209196",
  password: "77xWpge5hz",
  port: "3306",
  database: "sql3209196"
});
//using express
const express = require('express');
const app = express();

//path for imgs
process.env.PWD = process.cwd()

//global query = state
glob = "";

//index
app.get('/', function (req, res)  {
     res.sendFile( __dirname + "/" + "form.html");
});

//Search query
app.get('/search', function (req, res) {
   query = req.query.srch;
          con.query("SELECT * FROM farmer WHERE farm_name LIKE '" + query + "%'", function (err, results) {
            if (err) throw err;
	    //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
	    var end = [];
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].farm_name);
	       end.push(row[i].state);
               end.push(row[i].zipcode);
               end.push(row[i].produce);
	    }
	    //send data to frontend as parameters
            res.redirect('/?farmer,' + end);
     });
});

//Drop down query produce
app.get('/dropdown', function (req, res) {
   query = req.query.selectProduce;
          con.query("SELECT crop_name, price_retail, shelf_life, pesticides, season, farm_name FROM crops c JOIN farmer f ON c.crop_name=f.produce WHERE crop_name='" + query + "'", function (err, results) {
            if (err) throw err;
            //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
	    var end = [];
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].crop_name);
	       end.push(row[i].price_retail);
               end.push(row[i].shelf_life);
               end.push(row[i].pesticides);
	       end.push(row[i].season);
	       end.push(row[i].farm_name);
	    }
	    //send data to frontend as parameters
            res.redirect('/?crop,' + end);
     });
});

//Location query
app.get('/location', function (req, res) {
   query = req.query.srch;
	var end = [];
          con.query("SELECT DISTINCT store_name, zipcode FROM stores WHERE zipcode LIKE '" + query + "%'", function (err, results) {
            if (err) throw err;
	    //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
	    
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].store_name);
	       end.push(row[i].zipcode);
	    }
	});

	   con.query("SELECT DISTINCT farm_name, zipcode FROM farmer WHERE zipcode LIKE '" + query + "%'", function (err, results) {
            if (err) throw err;
	    //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].farm_name);
	       end.push(row[i].zipcode);
	    }
	    //send data to frontend as parameters
            res.redirect('/?location,' + end);
     });
});

//Search month
app.get('/month', function (req, res) {
   query = req.query.selectMonth;
          con.query("SELECT month, crop, organic, grow_time FROM harvest WHERE month LIKE '" + query + "%'", function (err, results) {
            if (err) throw err;
		console.log(results);
	    //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
	    var end = [];
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].month);
	       end.push(row[i].crop);
               end.push(row[i].organic);
	       end.push(row[i].grow_time);
	    }
            //send data to frontend as parameters
            res.redirect('/?harvest,' + end);
     });
});

//Search store
app.get('/searchStore', function (req, res) {
   query = req.query.srch;
          con.query("SELECT * FROM stores WHERE store_name LIKE '" + query + "%' GROUP BY produce_sold", function (err, results) {
            if (err) throw err;
	    //place results in array for passing as parameters to form.html
            var row = [];
            for (var i = 0; i < results.length; i++) {
              row[i] = results[i];
            }
	    var end = [];
            for (var i = 0; i < row.length; i++) {
	       end.push(row[i].store_name);
	       end.push(row[i].state);
               end.push(row[i].zipcode);
               end.push(row[i].produce_sold);
	       end.push(row[i].produce_price);
               end.push(row[i].quantity);
	    }
            //send data to frontend as parameters
            res.redirect('/?store,' + end);
     });
});

//serve resources
app.use(express.static(process.env.PWD + '/img'));
//port listening
app.listen(8890);
