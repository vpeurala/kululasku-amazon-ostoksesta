"use strict";

const child_process = require("child_process");

function parse_price_in_usd_and_item_name_from_pdf(pdf_file) {
    let child_process_output = child_process.execSync("pdftotext " +
        pdf_file +
        " - | grep -e 'Order Total:' -e 'Items Ordered' " +
        "| sed 's/^.*Order Total: \\$//g' " +
        "| sed 's/^Items Ordered //g' " + "" +
        "| sed 's/ Quantity:.*$//g'", {
        "encoding": "ASCII",
        "timeout": 1000
    });
    let child_process_output_lines = child_process_output.split("\n");
    let price_in_usd = child_process_output_lines[0].trim();
    let product_name = child_process_output_lines[1].trim();
    return {
        "price_in_usd": price_in_usd,
        "product_name": product_name
    };
}

module.exports = {
    "parse_price_in_usd_and_item_name_from_pdf": parse_price_in_usd_and_item_name_from_pdf
};
