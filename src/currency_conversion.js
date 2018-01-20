"use strict";

const bluebird = require("bluebird");
const http = require("http");
const util = require("util");
const utils = require("./utils");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

function httpGetOptions(formattedDate) {
  return {
    "hostname": "apilayer.net",
    "path": "/api/historical?access_key=" + CURRENCYLAYER_COM_API_KEY +
    "&date=" + formattedDate +
    "&currencies=EUR" +
    "&format=0",
    "timeout": 3000
  };
}

function callCurrencylayer(formattedDate, callback) {
  http.get(httpGetOptions(formattedDate), (response) => {
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
 * Convert an amound of USD to equivalent amount of EUR. Uses the conversion rate of the purchase date.
 *
 * @param {number} usdAmount    - the purchase price in USD, for example 22.75.
 * @param {string} purchaseDate - the purchase date formatted as YYYY-MM-DD, for example "2018-01-06".
 * @returns {Promise<number>} an equivalent amount of EUR, as a Promise.
 */
function usdToEur(usdAmount, purchaseDate) {
  let callCurrencylayerAsync = bluebird.promisify(callCurrencylayer);
  return callCurrencylayerAsync(purchaseDate)
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
