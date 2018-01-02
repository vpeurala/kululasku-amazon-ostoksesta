"use strict";

const ETASKU_FRONT_PAGE_URL = "https://www.etasku.fi/";
const s = require("./selectors");
const parsePdf = require("./parse_pdf");
const currencyConversion = require("./currency_conversion");
const username = process.env.ETASKU_USERNAME;
const password = process.env.ETASKU_PASSWORD;
const receiptFile = process.env.ETASKU_RECEIPT_FILE;

fixture("etasku.fi");

test.page(ETASKU_FRONT_PAGE_URL)("Create kululasku", async (t) => {
    let parsedReceipt = await parsePdf.parsePdf(receiptFile);
    let priceInEur = await currencyConversion.usdToEur(parsedReceipt.priceInUsd).toFixed(2);
    await t
      .click(s.kirjaudu)
      .typeText(s.kayttajatunnus, username, {"replace": true})
      .typeText(s.salasana, password, {"replace": true})
      .click(s.kirjauduSisaan)
      .click(s.luoTosite)
      // Kuittitiedoston uploadaus.
      .setFilesToUpload(s.lisaaTiedosto, receiptFile)
      // Ostopäivä-kenttä = input#date.tcal.tcalInput.
      .typeText(s.ostopaiva, parsedReceipt.purchaseDate, {
        "paste": true,
        "replace": true
      })
      // Ostopaikka-kenttä = input#receipt_name.
      .typeText(s.ostopaikka, "amazon.com")
      // Lisätietoa-kenttä = textarea#show_comment_edit.
      .typeText(
        s.lisatietoa,
        "Ammattikirjallisuutta: \"" +
        parsedReceipt.productName +
        "\". USD " +
        parsedReceipt.priceInUsd.toFixed(2).toString() +
        " = " +
        "EUR " +
        priceInEur.toString() +
        ".")
      // Hinta-kenttä (euroina) = input#show_price_edit.
      .typeText(s.hinta, priceInEur.toString())
      // Verokanta-kenttä = select#taxrate_select; Amazonilta ostettaessa aina "24 %".
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
  }
);
