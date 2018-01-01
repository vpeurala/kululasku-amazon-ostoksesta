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
 * @returns {number}
 */
async function usd_to_eur(usd_amount) {
    let result = await call_currencylayer((json) => {
        if (json.success !== true) {
            throw "Getting exchange rates from currencylayer.com was not successful. Returned JSON was: " + util.inspect(json);
        }
        console.log("json:", json);
        let exchange_rate = json.quotes.USDEUR;
        let eur_amount_with_too_many_decimals = exchange_rate * usd_amount;
        console.log("eur_amount_with_too_many_decimals:", eur_amount_with_too_many_decimals);
        let eur_amount_with_two_decimals = utils.number_to_two_decimal_accuracy(eur_amount_with_too_many_decimals);
        console.log("eur_amount_with_two_decimals:", eur_amount_with_two_decimals);
        return eur_amount_with_two_decimals;
    });
    console.log("result:", result);
    return await result;
}

module.exports = {
    "CURRENCYLAYER_COM_API_KEY": CURRENCYLAYER_COM_API_KEY,
    "usd_to_eur": usd_to_eur
};
