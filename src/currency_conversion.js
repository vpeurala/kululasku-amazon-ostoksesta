"use strict";

const https = require("https");

const CURRENCYLAYER_COM_API_KEY = "737e36a2d5d98271355df3729abbec59";

async function usd_to_eur(usd_amount) {
    await https.get("https://currencylayer.com/api/convert" +
        "?access_key=" + CURRENCYLAYER_COM_API_KEY +
        "&from=USD" +
        "&to=EUR" +
        "&amount=" + usd_amount, (response) => {
        let data = "";
        // TODO Remove
        console.log("response: ", response);
        response.on("data", (chunk) => {
            data += chunk;
        });
        response.on("end", () => {
            return JSON.parse(data);
        });
    }).on("error", (e) => {
        // eslint-disable-next-line no-console
        console.error("Error from currencylayer.com: ", e);
        throw e;
    });
}

module.exports = {
    "usd_to_eur": usd_to_eur
};
