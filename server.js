const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/catfishdb');
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Home Route
app.get('/', function(req, res){
  res.render('index', {
    title:'Catfish'
  });
});

// Add Route
app.get('/mainpage/', function(req,res){
  res.render('main_page', {
    title:'Catfish'
  });
});

// Start server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
