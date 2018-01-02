"use strict";

const currency_conversion = require("../src/currency_conversion");
const fs = require("fs");
const nock = require("nock");
const parse_pdf = require("../src/parse_pdf");
const tape = require("tape");
const utils = require("../src/utils");

const response_from_currencylayer_com = fs.readFileSync(
  __dirname + "/resources/response_from_currencylayer_com.json",
  "ASCII");

const expected_pdf_parse_result = {
  "price_in_usd":
    22.75,
  "product_name":
  "PostgreSQL: Up and Running: A Practical Guide to the Advanced Open Source Database[Kindle Edition]" +
  " " +
  "By: Regina O. Obe, Leo S. Hsu",
  "purchase_date":
    "14.12.2017"
};

tape("number rounding", (t) => {
  t.plan(1);
  let expected = 13.37;
  let actual = utils.number_to_two_decimal_accuracy(13.368913453128);
  t.equal(actual, expected);
});

tape("pdf parsing", (t) => {
  t.plan(1);
  let actual_pdf_parse_result = parse_pdf.parse_pdf(__dirname + "/resources/Amazon_Invoice.pdf");
  t.deepEqual(actual_pdf_parse_result, expected_pdf_parse_result);
});

tape("currency conversion", async (t) => {
  t.plan(1);
  nock.disableNetConnect();
  nock("http://apilayer.net")
    .get("/api/live")
    .query({
      "access_key": currency_conversion.CURRENCYLAYER_COM_API_KEY,
      "currencies": "EUR",
      "format": 0
    })
    .reply(200, response_from_currencylayer_com);
  let expected = 18.96;
  let actual = await currency_conversion.usd_to_eur(expected_pdf_parse_result.price_in_usd);
  t.equal(expected, actual);
});
