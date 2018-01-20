"use strict";

const currencyConversion = require("../src/currency_conversion");
const fs = require("fs");
const nock = require("nock");
const parsePdf = require("../src/parse_pdf");
const tape = require("tape");
const utils = require("../src/utils");

tape("number rounding", (t) => {
  t.plan(1);
  let expected = 13.37;
  let inputToRounding = 13.368913453128;
  let actual = utils.numberToTwoDecimalAccuracy(inputToRounding);
  t.equal(actual, expected);
});

const EXPECTED_PDF_PARSE_RESULT = {
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

tape("pdf parsing", (t) => {
  t.plan(1);
  let actualPdfParseResult = parsePdf.parsePdf(__dirname + "/resources/Amazon_Invoice.pdf");
  t.deepEqual(actualPdfParseResult, EXPECTED_PDF_PARSE_RESULT);
});

const CURRENCYLAYER_COM_QUERY_PARAMETERS = {
  "access_key": currencyConversion.CURRENCYLAYER_COM_API_KEY,
  "currencies": "EUR",
  "date": "2018-01-06",
  "format": 0
};

tape("currency conversion happy path", async (t) => {
  t.plan(1);
  nock.disableNetConnect();
  nock("http://apilayer.net")
    .get("/api/historical")
    .query(CURRENCYLAYER_COM_QUERY_PARAMETERS)
    .reply(200, readTestResource("successful_response_from_currencylayer_com.json"));
  let expected = 18.91;
  let actual = await currencyConversion.usdToEur(EXPECTED_PDF_PARSE_RESULT.priceInUsd, "2018-01-06");
  t.equal(actual, expected);
});

tape("currency conversion internal server error", async (t) => {
  t.plan(1);
  nock.disableNetConnect();
  nock("http://apilayer.net")
    .get("/api/historical")
    .query(CURRENCYLAYER_COM_QUERY_PARAMETERS)
    .reply(500, "Internal server error");
  try {
    await currencyConversion.usdToEur(EXPECTED_PDF_PARSE_RESULT.priceInUsd, "2018-01-06");
    t.fail("An exception should have been thrown.");
  } catch (error) {
    const expectedErrorMessage = "Getting exchange rates from currencylayer.com was not successful.";
    let errorCause = error.cause;
    let actualErrorMessage = errorCause.message;
    t.equal(actualErrorMessage.substring(0, expectedErrorMessage.length), expectedErrorMessage);
  }
});

function readTestResource(filename) {
  let resourcePath = __dirname + "/resources/" + filename;
  return fs.readFileSync(resourcePath, "ASCII");
}
