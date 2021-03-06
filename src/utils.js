"use strict";

/**
 * Rounds a number to two-decimal accuracy.
 * For example: number_to_two_decimal_accuracy(13.368913453128) = 13.37
 *
 * @param {number} input any floating-point number.
 * @returns {number} the input number rounded to two-decimal accuracy.
 */
function numberToTwoDecimalAccuracy(input) {
  return parseFloat(input.toFixed(2));
}

module.exports = {
  "numberToTwoDecimalAccuracy": numberToTwoDecimalAccuracy
};
