const functions = require("firebase-functions");
const express = require("express");
const app = express();
const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get("/", function (req, res) {
  res.send("Hello Sven!");
});
app.get("/user", function (req, res) {
  var name = req.query.name
  res.send({name:name, age:32, adress:"Libanon"});
});
exports.app = functions.https.onRequest(app);
