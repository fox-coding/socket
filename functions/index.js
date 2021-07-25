const functions = require("firebase-functions")
const express = require("express")
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const hbs = require('hbs')


// Taplate Engine einrichten:
app.set('view engine', 'hbs')
app.set('views', 'templates/views')
hbs.registerPartials('templates/partials')


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get("/", function (req, res) {
  res.render('index',{
    title: "MidgardForecast",
    name: "Sven"
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});


});
app.get("/user", function (req, res) {
  var name = req.query.name
  res.send({name:name, age:32, adress:"Libanon"})
});
exports.app = functions.https.onRequest(app)
