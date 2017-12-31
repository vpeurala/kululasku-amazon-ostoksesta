"use strict";

const testcafe = require("testcafe/lib/api/exportable-lib");
const selector = testcafe.Selector;

// Etusivu
const kirjaudu = selector("ul.nav.navbar-nav.pull-right.hidden-xs a#navbar-login.btn.btn-primary");

// Sisäänkirjautumissivu
const kayttajatunnus = selector("input#username.textbox");
const salasana = selector("input.textbox[type=password]");
const kirjaudu_sisaan = selector("input.loginbutton");

// Kululaskun syöttösivu
const luo_tosite = selector("div#customertools.actionbutton");
const lisaa_tiedosto = selector("#uploadifive-fileDropZone input[type=file]");
const ostopaiva = selector("input#date.tcal.tcalInput");
const ostopaikka = selector("input#receipt_name");
const lisatietoa = selector("textarea#show_comment_edit");
const hinta = selector("input#show_price_edit");
const verokanta = selector("select#taxrate_select");
const luokitus = selector("select#class_select");
const maksutapa = selector("select#paymethod_select");
const kustannuspaikka = selector("select#Kustannuspaikka_select.dimensiongroup_select");
const toimiala = selector("select#Toimiala_select.dimensiongroup_select");
const alue = selector("select#Alue_select.dimensiongroup_select");
const palvelu = selector("select#Palvelu_select.dimensiongroup_select");
const tallenna = selector("input#save_button");

module.exports = {
    "kirjaudu": kirjaudu,
    "kayttajatunnus": kayttajatunnus,
    "salasana": salasana,
    "kirjaudu_sisaan": kirjaudu_sisaan,
    "luo_tosite": luo_tosite,
    "lisaa_tiedosto": lisaa_tiedosto,
    "ostopaiva": ostopaiva,
    "ostopaikka": ostopaikka,
    "lisatietoa": lisatietoa,
    "hinta": hinta,
    "verokanta": verokanta,
    "luokitus": luokitus,
    "maksutapa": maksutapa,
    "kustannuspaikka": kustannuspaikka,
    "toimiala": toimiala,
    "alue": alue,
    "palvelu": palvelu,
    "tallenna": tallenna
};
