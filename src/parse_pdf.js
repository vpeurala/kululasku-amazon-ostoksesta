"use strict";

const childProcess = require("child_process");
const moment = require("moment");
const utils = require("./utils");
const R = require("ramda");

function parsePdf(pdfFile) {
  // Invoke pdftotext in a child process and store its output.
  // We assume that the encoding is UTF-8 with UNIX linebreaks ('\n').
  // The operation should take a lot less than one second, so we set one second as timeout.
  let childProcessOutput = childProcess.execSync("pdftotext -enc UTF-8 -eol unix " +
    pdfFile + " -", {
    "encoding": "UTF-8",
    "timeout": 1000
  });
  let lines = childProcessOutput.split("\n");

  console.log("lines: ", lines);

  // Then we must do a lot of kind of hacky operations, because the text produced by
  // pdftext is not structured in any logical way.
  // We only have some strings as navigational aids:
  const amazonComOrderNumberStr = "Amazon.com order number: ";
  const itemsOrderedStr = "Items Ordered";
  const priceStr = "Price";
  const quantityStr = "Quantity:";

  // First, we must find the line with the Amazon.com order number.
  const lineWithOrderNumber = R.find((line) => {
    return R.startsWith(amazonComOrderNumberStr, line);
  }, lines);

  console.log("lineWithOrderNumber:", lineWithOrderNumber);

  // The order number is the rest of that line after the amazonComOrderNumber prefix.
  const orderNumber = R.drop(amazonComOrderNumberStr.length, lineWithOrderNumber);

  // Then, we must find the line with text "Items Ordered", because it is an important navigational aid.
  // Above that line is the line on which we find the purchase date.
  // Below that line we find the item names.
  const itemsOrderedLineIndex = R.findIndex((line) => {
    return line === itemsOrderedStr;
  }, lines);

  // Now we can find the purchase date; it is on the previous line before "Items Ordered" line, after ": ".
  const purchaseDateContainingLine = lines[itemsOrderedLineIndex - 1];
  const lastIndexOfColon = purchaseDateContainingLine.lastIndexOf(":");
  // The "+2" in (lastIndexOfColon + 2) comes from the fact that there is a space after the colon before the date.
  const purchaseDateInLongFormat = R.drop(lastIndexOfColon + 2, purchaseDateContainingLine);

  console.log(`purchaseDateInLongFormat:${purchaseDateInLongFormat}`);

  // Next we have to find the line containing "Quantity: *". The product name is on the lines between
  // "Items Ordered" line and that one.
  const lineWithQuantityIndex = R.findIndex((line) => {
    return R.startsWith(quantityStr, line);
  }, lines);

  const linesContainingProductName = R.map((line) => {
    return lines[line];
  }, R.range(itemsOrderedLineIndex + 1, lineWithQuantityIndex));

  console.log(`linesContainingProductName: ${linesContainingProductName}`);

  const productName = R.join(" ", linesContainingProductName);

  console.log(`productName: '${productName}'`);

  // Next we have to find a line which contains solely of word "Price": the price information is below it.
  const lineWithPriceIndex = R.findIndex((line) => {
    return priceStr === line;
  }, lines);

  // On the next line below is the price in USD prefixed with dollar sign, for example "$22.75.".
  // We remove the dollar sign.
  const priceInUsdAsString = R.drop(1, lines[lineWithPriceIndex + 1]);
  const priceInUsdAsFloat = utils.numberToTwoDecimalAccuracy(parseFloat(priceInUsdAsString));

  let purchaseDateInCurrencyLayerFormat =
    moment(purchaseDateInLongFormat, "MMMM D, YYYY")
      .format("YYYY-MM-DD");
  let purchaseDateInETaskuFormat =
    moment(purchaseDateInLongFormat, "MMMM D, YYYY")
      .format("D.M.YYYY");
  return {
    "orderNumber": orderNumber,
    "priceInUsd": priceInUsdAsFloat,
    "productName": productName,
    "purchaseDateInCurrencylayerFormat": purchaseDateInCurrencyLayerFormat,
    "purchaseDateInETaskuFormat": purchaseDateInETaskuFormat
  };
}

module.exports = {
  "parsePdf": parsePdf
};
