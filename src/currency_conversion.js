"use strict";

const bluebird = require("bluebird");
const http = require("http");
const util = require("util");
const utils = require("./utils");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

function callCurrencylayer(callback) {
  http.get({
    "hostname": "apilayer.net",
    "path": "/api/live?access_key=" + CURRENCYLAYER_COM_API_KEY + "&currencies=EUR&format=0",
    "timeout": 3000
  }, (response) => {
    if (response.statusCode !== 200) {
      response.resume();
      callback(
        "Getting exchange rates from currencylayer.com was not successful. Response was: " +
        util.inspect(response),
        null);
    }
    response.setEncoding("ASCII");
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      let json = JSON.parse(body);
      callback(null, json);
    });
  }).on("error", (error) => {
    callback(
      "Getting exchange rates from currencylayer.com was not successful. Error was: " + util.inspect(error),
      null);
  });
}

/**
 * Convert an amound of USD to equivalent amount of EUR.
 * TODO: Currently uses the current exchange rate. Should use the exchange rate of the purchase day.
 *
 * @param {number} usdAmount
 * @returns {number}
 */
function usdToEur(usdAmount) {
  let callCurrencylayerAsync = bluebird.promisify(callCurrencylayer);
  return callCurrencylayerAsync()
    .then((json) => {
      if (json.success !== true) {
        throw "Getting exchange rates from currencylayer.com was not successful. Returned JSON was: " +
        util.inspect(json);
      }
      let exchangeRate = json.quotes.USDEUR;
      let eurAmountRaw = exchangeRate * usdAmount;
      return utils.numberToTwoDecimalAccuracy(eurAmountRaw);
    });
}

module.exports = {
  "CURRENCYLAYER_COM_API_KEY": CURRENCYLAYER_COM_API_KEY,
  "usdToEur": usdToEur
};
