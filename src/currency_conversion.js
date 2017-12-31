"use strict";

const request = require("sync-request");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

function get_exchange_rate_from_currency_layer() {
    let response = request("GET", "http://apilayer.net/api/live" +
        "?access_key=" + CURRENCYLAYER_COM_API_KEY +
        "&currencies=USD,EUR" +
        "&format=0");
    let body = response.getBody("ASCII");
    let json = JSON.parse(body);
    if (json.success !== true) {
        throw "Getting exchange rates from currencylayer.com was not successful. " +
        "Response was: " + json;
    }
    return json.quotes.USDEUR;
}

function usd_to_eur(usd_amount) {
    let exchange_rate_usd_to_eur = get_exchange_rate_from_currency_layer();
    return usd_amount * exchange_rate_usd_to_eur;
}

module.exports = {
    "usd_to_eur": usd_to_eur
};
