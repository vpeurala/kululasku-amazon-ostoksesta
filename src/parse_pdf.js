"use strict";

const child_process = require("child_process");

function parse_price_in_usd_and_item_name_from_pdf(pdf_file) {
    child_process.execSync("pdftotext " +
        pdf_file +
        " - | ggrep -e 'Order Total:' -e 'Items Ordered' " +
        "| sed 's/^.*Order Total: \\$//g' " +
        "| sed 's/^Items Ordered //g' " + "" +
        "| sed 's/ Quantity:.*$//g'");
}

module.exports = {
    "parse_price_in_usd_and_item_name_from_pdf": parse_price_in_usd_and_item_name_from_pdf
};
