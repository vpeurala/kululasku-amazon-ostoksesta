"use strict";

const testcafe = require("testcafe/lib/api/exportable-lib");
const selector = testcafe.Selector;

// Etusivu
const kirjaudu = selector("ul.nav.navbar-nav.pull-right.hidden-xs a#navbar-login.btn.btn-primary");

// Sisäänkirjautumissivu
const kayttajatunnus = selector("input#username.textbox");
const salasana = selector("input.textbox[type=password]");
const kirjauduSisaan = selector("input.loginbutton");

// Kululaskun syöttösivu
const bugiLaatikko = selector("input#date.tcal.tcalInput.tcalActive");
const luoTosite = selector("div#customertools.actionbutton");
const lisaaTiedosto = selector("#uploadifive-fileDropZone input[type=file]");
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
const takaisinVanhaanPalveluun = selector("a#backToOld");

module.exports = {
  "alue": alue,
  "bugiLaatikko": bugiLaatikko,
  "hinta": hinta,
  "kayttajatunnus": kayttajatunnus,
  "kirjaudu": kirjaudu,
  "kirjauduSisaan": kirjauduSisaan,
  "kustannuspaikka": kustannuspaikka,
  "lisaaTiedosto": lisaaTiedosto,
  "lisatietoa": lisatietoa,
  "luoTosite": luoTosite,
  "luokitus": luokitus,
  "maksutapa": maksutapa,
  "ostopaikka": ostopaikka,
  "ostopaiva": ostopaiva,
  "palvelu": palvelu,
  "salasana": salasana,
  "takaisinVanhaanPalveluun": takaisinVanhaanPalveluun,
  "tallenna": tallenna,
  "toimiala": toimiala,
  "verokanta": verokanta
};
