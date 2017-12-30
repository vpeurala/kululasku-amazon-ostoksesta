"use strict";

const child_process = require("child_process");
const moment = require("moment");

function parse_price_in_usd_and_item_name_from_pdf(pdf_file) {
    let child_process_output = child_process.execSync("pdftotext " +
        pdf_file + " - " +
        "| grep -e 'Order Total:' -e 'Digital Order:' -e 'Items Ordered' " +
        "| sed 's/^.*Order Total: \\$//g' " +
        "| sed 's/^Digital Order: //g'" +
        "| sed 's/^Items Ordered //g' " + "" +
        "| sed 's/ Quantity:.*$//g'", {
        "encoding": "ASCII",
        "timeout": 1000
    });
    let child_process_output_lines = child_process_output.split("\n");
    let price_in_usd = child_process_output_lines[0].trim();
    let purchase_date_in_wrong_format = child_process_output_lines[1].trim();
    let purchase_date_in_correct_format =
        moment(purchase_date_in_wrong_format, "MMMM D, YYYY")
            .format("D.M.YYYY");
    let product_name = child_process_output_lines[2].trim();
    return {
        "price_in_usd": price_in_usd,
        "product_name": product_name,
        "purchase_date": purchase_date_in_correct_format
    };
}

module.exports = {
    "parse_price_in_usd_and_item_name_from_pdf": parse_price_in_usd_and_item_name_from_pdf
};
