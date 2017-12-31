"use strict";
/* eslint-disable no-magic-numbers */

const test = require("tape");
const nock = require("nock");

const currency_conversion = require("./currency_conversion");
const parse_pdf = require("./parse_pdf");

const expected_parse_result = {
    "price_in_usd": "22.75",
    "product_name": "PostgreSQL: Up and Running: A Practical Guide to the Advanced Open Source Database[Kindle Edition] By: Regina O. Obe, Leo S. Hsu",
    "purchase_date": "14.12.2017"
};

test("pdf_parsing", (t) => {
    t.plan(1);
    let actual = parse_pdf.parse_price_in_usd_and_item_name_from_pdf("./test_resources/Amazon_Invoice.pdf");
    let expected = expected_parse_result;
    t.deepEqual(actual, expected);
});

test("currency conversion", (t) => {
    t.plan(1);
    nock("http://apilayer.net");
    let expected = 18.955391;
    let actual = currency_conversion.usd_to_eur(parseFloat(expected_parse_result.price_in_usd));
    t.deepEqual(actual, expected);
});
