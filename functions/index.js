const functions = require("firebase-functions")
const express = require("express")
const app = express()
const hbs = require('hbs')

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// EXPRESS einrichten:
app.set('view engine', 'hbs')
app.set('views', 'templates/views')
hbs.registerPartials('templates/partials')

app.get("", function (req, res) {
  res.render('index')
});
app.get("/user", function (req, res) {
  var name = req.query.name
  res.send({name:name, age:32, adress:"Libanon"});
});
app.get("/room", function (req, res) {
  var id = req.query.id
  res.render('gameRoom',{id:id})
});
exports.app = functions.https.onRequest(app);
