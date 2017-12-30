"use strict";

const test = require("tape");

const parse_pdf = require("./parse_pdf");

test("pdf_parsing", (t) => {
    t.plan(1);
    let expected = {
        "price_in_usd": "22.75",
        "product_name": "PostgreSQL: Up and Running: A Practical Guide to the Advanced Open Source Database[Kindle Edition] By: Regina O. Obe, Leo S. Hsu",
        "purchase_date": "14.12.2017"
    };
    let actual = parse_pdf.parse_price_in_usd_and_item_name_from_pdf("./test_resources/Amazon_Invoice.pdf");
    t.deepEqual(actual, expected);
});
