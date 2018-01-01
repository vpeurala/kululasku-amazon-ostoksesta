"use strict";

const http = require("http");
const util = require("util");
const utils = require("./utils");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

function call_currencylayer(success_callback) {
    http.get({
        "hostname": "apilayer.net",
        "path": "/api/live?access_key=" + CURRENCYLAYER_COM_API_KEY + "&currencies=EUR&format=0",
        "timeout": 3000
    }, (response) => {
        if (response.statusCode !== 200) {
            response.resume();
            throw "Getting exchange rates from currencylayer.com was not successful. Response was: " + util.inspect(response);
        }
        response.setEncoding("ASCII");
        let body = "";
        response.on("data", (chunk) => {
            body += chunk;
        });
        response.on("end", () => {
            let json = JSON.parse(body);
            success_callback(json);
        });
    }).on("error", (error) => {
        throw "Getting exchange rates from currencylayer.com was not successful. Error was: " + util.inspect(error);
    });
}

/**
 * Convert an amound of USD to equivalent amount of EUR.
 * TODO: Currently uses the current exchange rate. Should use the exchange rate of the purchase day.
 *
 * @param {number} usd_amount
 * @returns {Promise<number>}
 */
async function usd_to_eur(usd_amount) {
    return await call_currencylayer(async (json) => {
        if (json.success !== true) {
            throw "Getting exchange rates from currencylayer.com was not successful. Returned JSON was: " + util.inspect(json);
        }
        let exchange_rate = json.quotes.USDEUR;
        let eur_amount = exchange_rate * usd_amount;
        return utils.number_to_two_decimal_accuracy(eur_amount);
    });
}

module.exports = {
    "CURRENCYLAYER_COM_API_KEY": CURRENCYLAYER_COM_API_KEY,
    "usd_to_eur": usd_to_eur
};
