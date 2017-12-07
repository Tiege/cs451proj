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

/* FOR FORMATTING RES.SEND
html string that will be send to browser
var reo ='<html><head><title>Node.js MySQL Select</title></head><body><h1>Node.js MySQL Select</h1>{${table}}</body></html>';

      var table =''; //to store html table

      //create html table with data from res.
      for(var i=0; i<res.length; i++){
        table +='<tr><td>'+ (i+1) +'</td><td>'+ res[i].name +'</td><td>'+ res[i].address +'</td></tr>';
      }
      table ='<table border="1"><tr><th>Nr.</th><th>Name</th><th>Address</th></tr>'+ table +'</table>';
*/

app.get('/', function (req, res)  {
     res.sendFile( __dirname + "/" + "form.html");
});

//Search query
app.get('/search', function (req, res) {
   query = req.query.srch;
          con.query("SELECT * FROM farmer WHERE farm_name LIKE '" + query + "%'", function (err, results) {
            if (err) throw err;

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

            res.redirect('/?farmer,' + end);
     });
});

//Drop down query
app.get('/dropdown', function (req, res) {
   query = req.query.selectProduce;
          con.query("SELECT * FROM " + query, function (err, results) {
            if (err) throw err;
            res.send(results[0]);
     });
});

//port listening
app.listen(8890);
