const functions = require("firebase-functions");
const express = require("express");
const app = express();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

app.get("/", function (req, res) {
  res.send("Hello World");
});

exports.app = functions.https.onRequest(app);
