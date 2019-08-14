const functions = require("firebase-functions");

const alphabet = "abcdefghijklmnopqrstuvwxyz";

alphabet.split("").forEach(char => {
  exports[char] = functions.https.onRequest((request, response) => {
    response.send("Hello!");
  });
});
