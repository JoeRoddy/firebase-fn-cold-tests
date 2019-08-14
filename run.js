const admin = require("firebase-admin");
const serviceAccount = require("./service-acct.json");
const fetch = require("node-fetch");

let lastGlobal = null;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://whereabouts-ff4f7.firebaseio.com"
});

const scheduleCall = (endpoint, lastCompletion) => {
  const timeout = Math.random() * 15 * 1000 * 60; // 1-15 minutes timeout
  setTimeout(async () => {
    const startTime = new Date().getTime();
    await request(endpoint);
    const completionTime = new Date().getTime();
    const timeElapsed = (completionTime - startTime) / 1000;
    const coldTime = lastCompletion
      ? (completionTime - lastCompletion) / 1000
      : null;

    scheduleCall(endpoint, completionTime);

    globalCold = lastGlobal
      ? (completionTime - lastGlobal) / 1000
      : 10 * 60 * 1000; // initial call - set to 10 mins
    lastGlobal = completionTime;
    saveResult(endpoint, coldTime, globalCold, timeElapsed);
  }, timeout);
};

const request = endpoint => {
  return fetch(endpoint);
};

const saveResult = (
  endpoint,
  secondsCold,
  secondsGlobalCold,
  secondsElapsed
) => {
  admin
    .database()
    .ref("invocations")
    .push({
      endpoint,
      secondsCold,
      secondsGlobalCold,
      secondsElapsed
    });
};

const ROOT_URL = "https://us-central1-whereabouts-ff4f7.cloudfunctions.net";

const ALPHABET = "abc";

ALPHABET.split("").forEach(char => {
  scheduleCall(`${ROOT_URL}/${char}`, new Date().getTime());
});
