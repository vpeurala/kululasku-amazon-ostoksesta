"use strict";

const {execSync} = require("child_process");
const fs = require("fs");

const ETASKU_FRONT_PAGE_URL = "https://www.etasku.fi/";

const currencyConversion = require("./currency_conversion");
const parsePdf = require("./parse_pdf");
const s = require("./selectors");

const username = process.env.ETASKU_USERNAME;
const password = process.env.ETASKU_PASSWORD;
const receiptFile = process.env.AMAZON_INVOICE_PDF;

function usage() {
  console.log("\x1b[97;1mUsage:\x1b[0m");
  console.log("  \x1b[93mETASKU_USERNAME\x1b[0m=\x1b[32mYOUR_ETASKU_USERNAME\x1b[0m " +
    "\x1b[93mETASKU_PASSWORD\x1b[0m=\x1b[32mYOUR_ETASKU_PASSWORD\x1b[0m " +
    "\x1b[93mAMAZON_INVOICE_PDF\x1b[0m=\x1b[32mYOUR_AMAZON_INVOICE_PDF\x1b[0m " +
    "\x1b[92;1myarn kululasku\x1b[0m");
  console.log("\x1b[97;1mExample:\x1b[0m");
  console.log("  \x1b[93mETASKU_USERNAME\x1b[0m=\x1b[32m'ville.peurala@wunderdog.fi'\x1b[0m " +
    "\x1b[93mETASKU_PASSWORD=\x1b[32m'Mansikka2'\x1b[0m " +
    "\x1b[93mAMAZON_INVOICE_PDF=\x1b[32m'/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf'\x1b[0m " +
    "\x1b[92;1myarn kululasku\x1b[0m");
}

function assertVariableIsDefined(variable,
                                 environmentVariableName,
                                 explanation) {
  if (variable === undefined) {
    console.log("\x1b[31mERROR (missing mandatory input):\x1b[0m");
    console.log("Missing required environment variable \x1b[93m" +
      environmentVariableName +
      "\x1b[0m " +
      "(" +
      explanation +
      ").");
    usage();
    process.exit(1);
  }
}

assertVariableIsDefined(username, "ETASKU_USERNAME", "your username to 'https://www.etasku.fi' service");
assertVariableIsDefined(password, "ETASKU_PASSWORD", "your password to 'https://www.etasku.fi' service");
assertVariableIsDefined(receiptFile, "AMAZON_INVOICE_PDF", "the invoice file downloaded from Amazon, in PDF format");

fs.access(receiptFile, fs.constants.F_OK, (error) => {
  if (error) {
    console.log(`The speficied Amazon Invoice PDF file \x1b[93m${receiptFile}\x1b[0m does not exist.
Error code: \x1b[31m${error.code}\x1b[0m`);
    console.log("Make sure that the path to the file is correct. " +
      "Use an \x1b[96;1mabsolute\x1b[0m path if you have no luck with relative paths.");
    console.log("An absolute path means a path all the way from the root directory. Examples:");
    console.log("  \x1b[96;1m(MacOS):\x1b[0m     \x1b[36m/Users/vpeurala/Downloads/Serious_Cryptography.pdf\x1b[0m");
    console.log("  \x1b[96;1m(Linux):\x1b[0m     \x1b[36m/home/vpeurala/Downloads/Serious_Cryptography.pdf\x1b[0m");
    console.log("  \x1b[96;1m(Windows):\x1b[0m   \x1b[36mC:\\Users\\vpeurala\\Downloads\\Serious_Cryptography.pdf\x1b[0m");
    process.exit(1);
  }
});

fs.access(receiptFile, fs.constants.R_OK, (error) => {
  if (error) {
    console.log(`The speficied Amazon Invoice PDF file \x1b[93m${receiptFile}\x1b[0m was found, but
it is not readable by this user.
Error code: \x1b[31m${error.code}\x1b[0m`);
    console.log("The current user does not have read access to the file.");
    console.log("Maybe you could try with \x1b[1msudo\x1b[0m, if you cannot modify the permissions of the file?");
    process.exit(1);
  }
});

try {
  execSync("which pdftotext", {
    "encoding": "ASCII",
    "timeout": 1000
  });
} catch (error) {
  console.log(`Command \x1b[92mwhich pdftotext\x1b[0m returned exit status: \x1b[31m${error.status}\x1b[0m.`);
  console.log("Probably \x1b[93mpdftotext\x1b[0m is missing from your PATH, or its executable bit is not set for this user.");
  console.log("If you are using a Mac and Homebrew, you can install pdftotext with brew.");
  console.log("Command pdftotext is part of \x1b[32mPoppler\x1b[0m library, so run the following command:");
  console.log("    \x1b[1mbrew install poppler\x1b[0m");
  process.exit(1);
}

fixture("etasku.fi");

test.page(ETASKU_FRONT_PAGE_URL)("Create kululasku", async (t) => {
  let parsedReceipt = await parsePdf
    .parsePdf(receiptFile);
  let priceInEur = await currencyConversion
    .usdToEur(
      parsedReceipt.priceInUsd,
      parsedReceipt.purchaseDateInCurrencylayerFormat);
  await t
    .click(s.kirjaudu)
    .typeText(s.kayttajatunnus, username, {"replace": true})
    .typeText(s.salasana, password, {"replace": true})
    .click(s.kirjauduSisaan)
    .click(s.takaisinVanhaanPalveluun)
    .click(s.luoTosite)
    .setFilesToUpload(s.lisaaTiedosto, receiptFile)
    .typeText(s.ostopaiva, parsedReceipt.purchaseDateInETaskuFormat, {
      "paste": true,
      "replace": true
    })
    // Sulje laatikko, joka aukeaa Ostopaikka-kentän päälle - tämä lienee bugi eTasku.fi:ssä.
    .click(s.bugiLaatikko, {})
    .typeText(s.ostopaikka, "www.amazon.com")
    .typeText(s.lisatietoa, extraInformationField(parsedReceipt, priceInEur))
    .typeText(s.hinta, priceInEur.toString());
  await selectOption(t, s.verokanta, "24 %");
  await selectOption(t, s.luokitus, "Työkalut");
  await selectOption(t, s.maksutapa, "Luottokortti");
  await selectOption(t, s.kustannuspaikka, "1999 Liiketoiminta");
  await selectOption(t, s.toimiala, "IT IT");
  await selectOption(t, s.alue, "10091 Helsinki");
  await selectOption(t, s.palvelu, "KON Konsultointi");
  await t.click(s.tallenna);

  async function selectOption(t, selectElementSelector, optionText) {
    await t
      .click(selectElementSelector)
      .click(selectElementSelector.find("option").withText(optionText));
  }

  function extraInformationField(parsedReceipt, priceInEur) {
    return `Ammattikirjallisuutta: "${parsedReceipt.productName}".\n
  Hinta ${parsedReceipt.priceInUsd} USD, ostopäivän valuuttakursseilla ${priceInEur} EUR."\n`;
  }
});
