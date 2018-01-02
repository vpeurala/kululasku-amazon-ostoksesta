"use strict";

const childProcess = require("child_process");
const moment = require("moment");
const utils = require("./utils");

function parsePdf(pdfFile) {
  let childProcessOutput = childProcess.execSync("pdftotext " +
    pdfFile + " - " +
    "| grep -e 'Order Total:' -e 'Digital Order:' -e 'Items Ordered' " +
    "| sed 's/^.*Order Total: \\$//g' " +
    "| sed 's/^Digital Order: //g'" +
    "| sed 's/^Items Ordered //g' " + "" +
    "| sed 's/ Quantity:.*$//g'", {
    "encoding": "ASCII",
    "timeout": 1000
  });
  let childProcessOutputLines = childProcessOutput.split("\n");
  let priceInUsdAsString = childProcessOutputLines[0].trim();
  let priceInUsdAsFloat = utils.numberToTwoDecimalAccuracy(parseFloat(priceInUsdAsString));
  let purchaseDateInWrongFormat = childProcessOutputLines[1].trim();
  let purchaseDateInCorrectFormat =
    moment(purchaseDateInWrongFormat, "MMMM D, YYYY")
      .format("D.M.YYYY");
  let productName = childProcessOutputLines[2].trim();
  return {
    "priceInUsd": priceInUsdAsFloat,
    "productName": productName,
    "purchaseDate": purchaseDateInCorrectFormat
  };
}

module.exports = {
  "parsePdf": parsePdf
};
