"use strict";

const currencyConversion = require("../src/currency_conversion");
const fs = require("fs");
const nock = require("nock");
const parsePdf = require("../src/parse_pdf");
const tape = require("tape");
const utils = require("../src/utils");

const responseFromCurrencylayerCom = fs.readFileSync(
  __dirname + "/resources/response_from_currencylayer_com.json",
  "ASCII");

const expectedPdfParseResult = {
  "orderNumber":
    "D01-0575136-8633850",
  "priceInUsd":
    22.75,
  "productName":
  "PostgreSQL: Up and Running: A Practical Guide to the Advanced Open Source Database[Kindle Edition]" +
  " " +
  "By: Regina O. Obe, Leo S. Hsu",
  "purchaseDateInCurrencylayerFormat":
    "2017-12-14",
  "purchaseDateInETaskuFormat":
    "14.12.2017"
};

tape("number rounding", (t) => {
  t.plan(1);
  let expected = 13.37;
  let inputToRounding = 13.368913453128;
  let actual = utils.numberToTwoDecimalAccuracy(inputToRounding);
  t.equal(actual, expected);
});

tape("pdf parsing", (t) => {
  t.plan(1);
  let actualPdfParseResult = parsePdf.parsePdf(__dirname + "/resources/Amazon_Invoice.pdf");
  t.deepEqual(actualPdfParseResult, expectedPdfParseResult);
});

tape("currency conversion", async (t) => {
  t.plan(1);
  nock.disableNetConnect();
  nock("http://apilayer.net")
    .get("/api/historical")
    .query({
      "access_key": currencyConversion.CURRENCYLAYER_COM_API_KEY,
      "currencies": "EUR",
      "date": "2018-01-06",
      "format": 0
    })
    .reply(200, responseFromCurrencylayerCom);
  let expected = 18.91;
  let actual = await currencyConversion.usdToEur(expectedPdfParseResult.priceInUsd, "2018-01-06");
  t.equal(expected, actual);
});
