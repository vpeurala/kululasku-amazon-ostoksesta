"use strict";

const testcafe = require("testcafe/lib/api/exportable-lib");
const selector = testcafe.Selector;
const etasku_front_page_url = "https://www.etasku.fi/";
const username = process.env.ETASKU_USERNAME;
const password = process.env.ETASKU_PASSWORD;
const receipt_file = process.env.ETASKU_RECEIPT_FILE;

fixture("Create kululasku").page(etasku_front_page_url);

test("Happy path", async (t) => {
    console.log("username: ", username);
    console.log("password: ", password);
    console.log("receipt file: ", receipt_file);
    await t
        .click(selector("ul.nav.navbar-nav.pull-right.hidden-xs a#navbar-login.btn.btn-primary"))
        .typeText(selector("input#username.textbox"), username, {"replace": true})
        .typeText(selector("input.textbox[type=password]"), password, {"replace": true})
        .click(selector("input.loginbutton"))
        .click(selector("div#customertools.actionbutton"))
        // Kuittitiedoston uploadaus.
        .setFilesToUpload("#uploadifive-fileDropZone input[type=file]", receipt_file)
        // Ostopäivä-kenttä jätetään default-arvoon, eli siihen päivään jolloin tämä ajetaan; muista tehdä kululasku heti ostoksen jälkeen!
        // Ostopaikka-kenttä = input#receipt_name.
        .typeText(selector("input#receipt_name"), "amazon.com")
        // Lisätietoa-kenttä = textarea#show_comment_edit.
        .typeText(selector("textarea#show_comment_edit"), "Ammattikirjallisuutta: TODO")
        // Hinta-kenttä (euroina) = input#show_price_edit.
        .typeText(selector("input#show_price_edit"), "TODO")
        // Verokanta-kenttä = select#taxrate_select; Amazonilta ostettaessa aina "24 %".
        // .click(selector("select#taxrate_select").filter) // TODO Kesken
        // Luokitus-kenttä = select#class_select; kirjaostoksissa "Työkalut".
        // Maksutapa-kenttä = select#paymethod_select; Amazonilta ostettaessa ainakin minulla aina "Luottokortti".
        // Kustannuspaikka-kenttä = select#Kustannuspaikka_select.dimensiongroup_select; aina "1999 Liiketoiminta".
        // Toimiala-kenttä = select#Toimiala_select.dimensiongroup_select; aina "IT IT".
        // Alue-kenttä = select#Alue_select.dimensiongroup_select; aina "10091 Helsinki".
        // Palvelu-kenttä = select#Palvelu_select.dimensiongroup_select; aina "KON Konsultointi".
        // Tositenippu-kenttä jätetään default-arvoon "Ei valittu".
        .click(selector("input#save_button"))
        .debug();
});
