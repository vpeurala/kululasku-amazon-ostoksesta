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
  console.log("Usage:");
  console.log("  ETASKU_USERNAME=<ETASKU_USERNAME> ETASKU_PASSWORD=<ETASKU_PASSWORD> AMAZON_INVOICE_PDF=<AMAZON_INVOICE_PDF> yarn kululasku");
  console.log("Example: ");
  console.log("  ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' AMAZON_INVOICE_PDF='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku");
}

if (username === undefined) {
  console.log("Missing required environment variable ETASKU_USERNAME (your username to 'https://www.etasku.fi' service).");
  usage();
  process.exit(1);
}

if (password === undefined) {
  console.log("Missing required environment variable ETASKU_PASSWORD (your password to 'https://www.etasku.fi' service).");
  usage();
  process.exit(1);
}

if (receiptFile === undefined) {
  console.log("Missing required environment variable AMAZON_INVOICE_PDF (the invoice file downloaded from Amazon, in PDF format).");
  usage();
  process.exit(1);
}

fs.access(receiptFile, fs.constants.F_OK, (err) => {
  if (err) {
    console.log(`The speficied Amazon Invoice PDF file '${receiptFile}' does not exist. Error code: '${err.code}'`);
    console.log("Make sure that the path to the file is correct. Use an \\e[1mabsolute\\e[0m path if you have no luck with relative paths.");
    console.log("An absolute path means a path all the way from the root directory. Examples:");
    console.log("  (MacOS):   /Users/vpeurala/Desktop/TODO/Kirjakularit/Serious_Cryptography.pdf");
    console.log("  (Windows): C:\\Users\\vpeurala\\Desktop\\TODO\\Kirjakularit\\Serious_Cryptography.pdf");
    process.exit(1);
  }
});

fs.access(receiptFile, fs.constants.R_OK, (err) => {
  if (err) {
    console.log(`The speficied Amazon Invoice PDF file '${receiptFile}' could not be read. Error code: '${err.code}'`);
    console.log("The current process does not have read access to the file.");
    process.exit(1);
  }
});

try {
  execSync("which pdftotext", {
    "encoding": "ASCII",
    "timeout": 1000
  });
} catch (error) {
  console.log("Command 'which pdftotext' produced error: ", error);
  console.log("Probably pdftotext is missing from PATH.");
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
