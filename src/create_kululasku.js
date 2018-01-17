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

if (username === undefined) {
  console.log("\x1b[31mERROR (missing mandatory input):\x1b[0m");
  console.log("Missing required environment variable \x1b[93mETASKU_USERNAME\x1b[0m " +
    "(your username to 'https://www.etasku.fi' service).");
  usage();
  process.exit(1);
}

if (password === undefined) {
  console.log("\x1b[31mERROR (missing mandatory input):\x1b[0m");
  console.log("Missing required environment variable \x1b[93mETASKU_PASSWORD\x1b[0m " +
    "(your password to 'https://www.etasku.fi' service).");
  usage();
  process.exit(1);
}

if (receiptFile === undefined) {
  console.log("\x1b[31mERROR (missing mandatory input):\x1b[0m");
  console.log("Missing required environment variable \x1b[93mAMAZON_INVOICE_PDF\x1b[0m " +
    "(the invoice file downloaded from Amazon, in PDF format).");
  usage();
  process.exit(1);
}

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
    .click(s.luoTosite)
    // Kuittitiedoston uploadaus.
    .setFilesToUpload(s.lisaaTiedosto, receiptFile)
    // Ostopäivä-kenttä = input#date.tcal.tcalInput.
    .typeText(s.ostopaiva, parsedReceipt.purchaseDateInETaskuFormat, {
      "paste": true,
      "replace": true
    })
    // Sulje laatikko, joka aukeaa Ostopaikka-kentän päälle - tämä lienee bugi eTasku.fi:ssä.
    .click(s.bugiLaatikko, {})
    // Ostopaikka-kenttä = input#receipt_name.
    .typeText(s.ostopaikka, "www.amazon.com")
    // Lisätietoa-kenttä = textarea#show_comment_edit.
    .typeText(s.lisatietoa, extraInformationField(parsedReceipt, priceInEur))
    // Hinta-kenttä (euroina) = input#show_price_edit.
    .typeText(s.hinta, priceInEur.toString())
    // Verokanta-kenttä = select#taxrate_select; Amazonilta ostettaessa aina "24 %".
    // TODO: Extract this "click dropbox -> click and find" -pattern to its own function.
    .click(s.verokanta)
    .click(s.verokanta.find("option").withText("24 %"))
    // Luokitus-kenttä = select#class_select; kirjaostoksissa "Työkalut".
    .click(s.luokitus)
    .click(s.luokitus.find("option").withText("Työkalut"))
    // Maksutapa-kenttä = select#paymethod_select; Amazonilta ostettaessa ainakin minulla aina "Luottokortti".
    .click(s.maksutapa)
    .click(s.maksutapa.find("option").withText("Luottokortti"))
    // Kustannuspaikka-kenttä = select#Kustannuspaikka_select.dimensiongroup_select; aina "1999 Liiketoiminta".
    .click(s.kustannuspaikka)
    .click(s.kustannuspaikka
      .find("option").withText("1999 Liiketoiminta"))
    // Toimiala-kenttä = select#Toimiala_select.dimensiongroup_select; aina "IT IT".
    .click(s.toimiala)
    .click(s.toimiala
      .find("option").withText("IT IT"))
    // Alue-kenttä = select#Alue_select.dimensiongroup_select; aina "10091 Helsinki".
    .click(s.alue)
    .click(s.alue.find("option").withText("10091 Helsinki"))
    // Palvelu-kenttä = select#Palvelu_select.dimensiongroup_select; aina "KON Konsultointi".
    .click(s.palvelu)
    .click(s.palvelu.find("option").withText("KON Konsultointi"))
    // Tositenippu-kenttä jätetään default-arvoon "Ei valittu".
    .click(s.tallenna);

  function extraInformationField(parsedReceipt, priceInEur) {
    return `Ammattikirjallisuutta: "${parsedReceipt.productName}".\n
  Hinta ${parsedReceipt.priceInUsd} USD, ostopäivän valuuttakursseilla ${priceInEur} EUR."\n`;
  }
});
