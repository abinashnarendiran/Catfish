const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const assert = require('assert');
const uuid = require('uuid/v1');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();

mongoose.connect('mongodb://localhost/catfishdb');
var db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// configure sessions
app.use(session({
  genid: function(request) {
    return uuid();
  },
  resave: false,
  saveUninitialized: false,
  //cookie: {secure: true},
  secret: 'apollo slackware prepositional expectations'
}));

// Body Parser Middleware
//parse application/x-www-form-urlencoded
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse application/json

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// database schema
var Schema = mongoose.Schema;
var userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  hashedPassword: String,
  birthDate: String,
  gender: String,
  bio: String
}, {collection: 'users'});
var User = mongoose.model('user', userSchema);


// Home route while not signed-in
app.get('/', function(req, res){
  res.render('login');
});

// userList
var userList = [];
var currentUser;
var currentCard;


// Add Route
app.get('/main', function(req, res) {
  User.find({}, function(err, users) {
    if(err) {
      console.log(err, "Error getting users from db")
    } else {
      // Populate users
      var today = new Date();
      for(var i in users){
        var birthDate = new Date(users[i].birthDate);
        var userAge = today.getFullYear() - birthDate.getFullYear();
        userList.push({firstName: users[i].firstName,
                       lastName : users[i].lastName,
                       gender: users[i].gender,
                       age: userAge,
                       bio: users[i].bio,
                       email: users[i].email});
      }
      //
      currentCard = userList.pop();
      res.render('main_page', {firstName: currentCard.firstName,
                     lastName : currentCard.lastName,
                     gender: currentCard.gender,
                     age: currentCard.age,
                     bio: currentCard.bio,
                     location: 'Durham Region'});
    }
  });
});

// POST route for like/Dislike
app.post('/main', function(req, res) {
  var vote = req.body.vote;
  if(vote == 'dislike') {
    console.log(currentUser.firstName,'dislikes', currentCard.firstName);
  }
  else if (vote == 'like') {
    console.log(currentUser.firstName,'likes', currentCard.firstName);
    // Link both parties by email
    let smtpTrans = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'teamcatfish3230@gmail.com',
        pass: 'password3230!'
      }
    });
    mailLiked = {
      from: currentUser.email,
      to: currentCard.email,
      subject: 'Catfish: Someone likes you!',
      text: "Hey, you matched with me on Catfish. Let's talk!"
    };
    smtpTrans.sendMail(mailLiked, function (error, response) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(currentUser.firstName, 'emailed', currentCard.firstName);
      }
    });
  }
  if (userList.length > 0) {
    var user = userList.pop();
    res.render('main_page', {firstName: user.firstName,
                   lastName : user.lastName,
                   gender: user.gender,
                   age: user.age,
                   bio: user.bio,
                   location: 'Durham Region'});
  }
  else {
    // Out of matches
    res.render('main_page', {errorMessage: 'Sorry. All out of matches',
  firstName: 'Out of matches'});
  }
});


// Add Route
app.get('/about/', function(req,res){
  res.render('about', {
    title:'About'
  });
});

// Add Route
app.get('/contact/', function(req,res){
  res.render('contact', {
    title:'Contact'
  });
});

// POST route from contact form
app.post('/processContact/', function (request, response) {
  var email = request.body.email;
  var name = request.body.name;
  var message = request.body.message;
  let mailOpts, smtpTrans;

  smtpTrans = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'teamcatfish3230@gmail.com',
      pass: 'password3230!'
    }
  });

  mailOpts = {
    from: request.body.name + ' &lt;' + request.body.email + '&gt;',
    to: 'teamcatfish3230@gmail.com',
    subject: 'Catfish Contact Form',
    text: `${request.body.name} (${request.body.email}) says: ${request.body.message}`
  };

  mailOptsUser = {
    from: 'teamcatfish3230@gmail.com',
    to: request.body.email,
    subject: 'Thank you for contacting team Catfish',
    text: 'Thank you for contacting Catfish'
  };

  smtpTrans.sendMail(mailOpts, function (error, response) {
    if (error) {
      console.log(error)
    }
    else {
      console.log('Email sent to team Catfish')
    }
  });

  smtpTrans.sendMail(mailOptsUser, function (error, response) {
    if (error) {
      console.log(error)
    }
    else {
      console.log('Email sent to user')
    }
  });
  response.redirect('/');
});

app.get('/register/', function(request, response) {
  response.render('register');
});

app.post('/processRegistration/', function(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName;
  var email = request.body.email;
  var password = request.body.pwd;
  var hashedPassword = bcrypt.hashSync(password);
  var bio = request.body.bio;
  var gender = request.body.gender;
  //var birthDatewithTime =  new Date(request.body.birthDate);
  //var birth = birthDatewithTime.toDateString();
  var birth = request.body.birthDate;
  var newUser = new User({firstName: firstName,
                          lastName: lastName,
                          email: email,
                          hashedPassword: hashedPassword,
                          gender: gender,
                          birthDate: birth,
                          bio: bio});
  newUser.save(function(error) {
    if (error) {
      console.log('Unable to register: ' + error);
      response.render('register', {errorMessage: 'Unable to register user'});
    }
    else {
      response.redirect('/');
    }
  });
});

app.get('/login/', function(request, response) {
  response.render('login', {errorMessage: ''});
});

app.post('/processLogin/', function(request, response) {
  var email = request.body.email;
  var password = request.body.pwd;
  User.find({email: email}).then(function(results) {
    if (results.length == 0) {
      // Login failed
      response.render('login', {errorMessage: 'Sorry, email provided does not exist'});
    }
    else {
      // login success
      if (bcrypt.compareSync(password, results[0].hashedPassword)) {
        var user = User.findOne({email: email},  function(err, doc){
            response.render('profile_page', {firstName: doc.firstName});
            // set session
            //request.session.userFirst = doc.firstName;
            //request.session.email = doc.email;
            currentUser = {firstName: doc.firstName, lastName: doc.lastName, email: doc.email};
        });
        app.get('/settings/', function(request, response){
          User.findOne({email: email},  function(err, doc){
            response.render('settings', {firstName: doc.firstName,
                                         lastName: doc.lastName,
                                         email: doc.email,
                                         bio: doc.bio,
                                         errorMessage: ''});
                });
            });
          }
      else{
        response.render('login', {errorMessage: 'Password Incorrect. Please try again.'});
      }
    }
  });
});

/*
app.get('/settings/', function(request, response) {
  response.render('settings', {errorMessage: ''});
});

*/

app.post('/processUpdate/', function(request, response) {
  var firstName = request.body.firstName;
  var lastName = request.body.lastName
  var email = request.body.email;
  var bio = request.body.bio;

  var userData = {firstName: firstName,
                  lastName: lastName,
                  bio: bio
                };

    User.find({email: email}).then(function(results) {
    if (results.length > 0) {
        User.update({email: email},
                        userData,
                        {multi: false},
                        function(error, numAffected) {
        if (error || numAffected != 1) {
          console.log('Unable to update student: ' + error);
          response.redirect("/main");
        }
        else {
        response.redirect("/main");
        }
      });
    }

    else {
      response.render('login', {errorMessage: "No email was found when updating profile"});
    }
  });
});


app.get('/logout/', function(request, response) {
  if (request.session) {
    // delete session object
    request.session.destroy(function(error) {
      if(error) {
        return next(error);
      } else {
        return response.redirect('/');
      }
    });
  }
});

// Start server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
