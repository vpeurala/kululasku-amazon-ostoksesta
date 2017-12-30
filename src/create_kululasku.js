"use strict";

const etasku_front_page_url = "https://www.etasku.fi/";
const s = require("./selectors");
const username = process.env.ETASKU_USERNAME;
const password = process.env.ETASKU_PASSWORD;
const receipt_file = process.env.ETASKU_RECEIPT_FILE;

fixture("Create kululasku").page(etasku_front_page_url);

test("Happy path", async (t) => {
    await t
        .click(s.kirjaudu)
        .typeText(s.kayttajatunnus, username, {"replace": true})
        .typeText(s.salasana, password, {"replace": true})
        .click(s.kirjaudu_sisaan)
        .click(s.luo_tosite)
        // Kuittitiedoston uploadaus.
        .setFilesToUpload(s.lisaa_tiedosto, receipt_file)
        // Ostopäivä-kenttä jätetään default-arvoon, eli siihen päivään jolloin tämä ajetaan;
        // muista tehdä kululasku heti ostoksen jälkeen!
        // Ostopaikka-kenttä = input#receipt_name.
        .typeText(s.ostopaikka, "amazon.com")
        // Lisätietoa-kenttä = textarea#show_comment_edit.
        .typeText(s.lisatietoa, "Ammattikirjallisuutta: TODO")
        // Hinta-kenttä (euroina) = input#show_price_edit.
        .typeText(s.hinta, "TODO")
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
        .click(s.tallenna)
        .debug();
});
