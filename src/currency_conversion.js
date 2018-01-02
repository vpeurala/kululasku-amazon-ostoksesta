"use strict";

const bluebird = require("bluebird");
const http = require("http");
const util = require("util");
const utils = require("./utils");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

function call_currencylayer(callback) {
    http.get({
        "hostname": "apilayer.net",
        "path": "/api/live?access_key=" + CURRENCYLAYER_COM_API_KEY + "&currencies=EUR&format=0",
        "timeout": 3000
    }, (response) => {
        if (response.statusCode !== 200) {
            response.resume();
            callback(
                "Getting exchange rates from currencylayer.com was not successful. Response was: " + util.inspect(response),
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
 * @param {number} usd_amount
 * @returns {number}
 */
function usd_to_eur(usd_amount) {
    let call_currencylayerAsync = bluebird.promisify(call_currencylayer);
    let result = call_currencylayerAsync()
        .then((json) => {
            if (json.success !== true) {
                throw "Getting exchange rates from currencylayer.com was not successful. Returned JSON was: " + util.inspect(json);
            }
            let exchange_rate = json.quotes.USDEUR;
            let eur_amount_with_too_many_decimals = exchange_rate * usd_amount;
            return utils.number_to_two_decimal_accuracy(eur_amount_with_too_many_decimals);
        });
    return result;
}

module.exports = {
    "CURRENCYLAYER_COM_API_KEY": CURRENCYLAYER_COM_API_KEY,
    "usd_to_eur": usd_to_eur
};
