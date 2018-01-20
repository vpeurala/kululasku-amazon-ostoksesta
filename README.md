# Kululasku Amazon-ostoksesta

[![Build Status](https://travis-ci.org/vpeurala/kululasku-amazon-ostoksesta.svg?branch=master)](https://travis-ci.org/vpeurala/kululasku-amazon-ostoksesta)

[![Maintainability](https://api.codeclimate.com/v1/badges/5f3e5e48a34203dffff9/maintainability)](https://codeclimate.com/github/vpeurala/kululasku-amazon-ostoksesta/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/5f3e5e48a34203dffff9/test_coverage)](https://codeclimate.com/github/vpeurala/kululasku-amazon-ostoksesta/test_coverage)

[![Dependencies](https://david-dm.org/vpeurala/kululasku-amazon-ostoksesta.svg)](https://david-dm.org/vpeurala/kululasku-amazon-ostoksesta.svg)

Tämä ohjelma automatisoi osittain kululaskun luonnin [eTaskuun](https://etasku.fi/) [Amazon](https://www.amazon.com/)-ostoksesta.

Sinun pitää manuaalisesti hakea ostoksestasi PDF-kuitti Amazonista. Alla oleva opetusvideo näyttää, miten se tapahtuu. Sen jälkeen tämä skripti hoitaa loput.

## Opetusvideo

Katso tämä, se on nopein tapa oppia ohjelman käyttö.

TODO: Video tähän

## Vaatimukset ympäristölle

1. Sinulla pitää olla asennettuna (ja löytyä PATH:ista) sellainen komento kuin **pdftotext**. Sillä muunnetaan Amazonilta saatu PDF-kuitti tekstimuotoon, jotta siitä voidaan parsia tarvittava data. Ainakin MacOS:lla **pdftotext** on osa **Poppler**-nimistä ohjelmistoa. Helpoin tapa asentaa se on [Homebrewillä](https://brew.sh/):

    `brew install poppler`

   Sinulla täytyy olla _täsmälleen_ oikea versio **pdftotext**-ohjelmasta, muuten Amazonin PDF-kuitin parsinta luultavasti epäonnistuu. Tätä kirjoitettaessa se on **0.62.0**. Asenna **Poppler**:ista versio **0.62.0**, niin saat mukana oikean version myös **pdftotext**:istä.

   Eri versiot **pdftotext**:istä tuottavat samasta PDF:stä hieman erilaisen tekstitiedoston, ja tämän tiedoston parsinta on ylivoimaisesti fragiilein osa tätä ohjelmaa, koska tiedosto ei ole mitään JSON:ia, XML:ää tai muuta määrämuotoista formaattia, vaan täysin sattumanvaraiselta tuntuva tekstiformaatti, jonka parsiminen perustuu siihen että haetaan tiettyjä merkkijonoja, joita "ankkurina" käyttäen haluttu data löydetään. Esimerkiksi laskun päivämäärä saadaan siten, että haetaan rivi, jolla lukee "Items Ordered". Sitten otetaan tästä rivistä _edellinen_ rivi, etsitään sen rivin viimeinen kaksoispiste, siirrytään siitä kaksi merkkiä oikealle ja otetaan siitä kohdasta eteenpäin loput rivistä.

   Kuulostaako robustilta? No ei minustakaan. Siksi on ehdottoman tärkeää, että käytössä on juuri oikea versio **pdftotext**-ohjelmasta, koska jos sinulla on joku muu versio, niin se 99,9% varmuudella muuntaa PDF:n tekstiksi hiukan eri tavalla, ja vaikkapa yksi välilyönti väärässä paikassa saattaa rikkoa kuitin parsinnan. Voit varmistua siitä, että sinulla on oikea versio **pdftotext**:istä, ajamalla yksikkötestit: `yarn test`.

1. Sinulla pitää olla [Node.js](https://nodejs.org/en/). Suosittelen lämpimästi 8.x-sarjan uusinta LTS (Long Term Support) -versiota, joka tätä kirjoitettaessa on 8.9.4. Muilla versioilla tätä softaa ei ole testattu.

1. Sinulla pitää olla [Yarn](https://yarnpkg.com/en/).

1. Sinulla pitää olla [git](https://git-scm.com/).

## Ajaminen

1. Kloonaa repositorio itsellesi: `git clone https://github.com/vpeurala/kululasku-amazon-ostoksesta`
1. Mene repositorion juureen: `cd kululasku-amazon-ostoksesta`
1. Asenna riippuvuudet: `yarn install`
1. Aja kululaskun luonti: `yarn kululasku`. Selaimena tämä käyttää defaulttina Chromea, koska sillä kululaskun luonti menee kaikkein nopeimmin. Jos vihaat Chromea, niin puukota package.json-tiedoston tätä riviä:

  "kululasku": "testcafe --debug-on-fail chrome src/create_kululasku.js"

  Voit vaihtaa tuohon merkkijonon 'chrome' tilalle minkä tahansa näistä:
  1. chromium
  1. chrome
  1. chrome-canary
  1. ie
  1. edge
  1. firefox
  1. opera
  1. safari

  Tietysti sinulla pitää olla kyseinen selain asennettuna.

  Tälle ohjelmalle välitetään parametrit ympäristömuuttujina. Niitä on kolme, ja ne kaikki ovat pakollisia:
  1. ETASKU_USERNAME = käyttäjätunnuksesi eTaskuun.
  1. ETASKU_PASSWORD = salasanasi eTaskuun.
  1. AMAZON_INVOICE_PDF = Amazonilta saatu kuittitiedosto (PDF).

  Esimerkki ohjelman ajosta siten, että kaikki parametrit asetetaan ajon yhteydessä:

    ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' AMAZON_INVOICE_PDF='/Users/vpeurala/Desktop/Serious_Cryptography.pdf' yarn kululasku

  Koska käyttäjätunnuksesi ja salasanasi [eTaskuun](https://etasku.fi/) ovat aina samat, toisin kuin kuittitiedosto, kannattaa asettaa ne pysyviksi ympäristömuuttujiksi. MacOS:lla ja Linuxilla se tapahtuu näin:

    export ETASKU_USERNAME='ville.peurala@wunderdog.fi'
    export ETASKU_PASSWORD='Mansikka2'

  Jos haluat, ettei sinun tarvitse huolehtia näistä enää ikinä, niin laita nuo export-lauseet **.zshrc**:hen, **.bashrc**:hen, tai vastaavaan tiedostoon, mitä shelliä sitten ikinä käytätkään.

  Tämän jälkeen sinun ei ohjelmaa ajaessasi tarvi antaa muita parametrejä kuin kuittitiedosto:

    AMAZON_INVOICE_PDF='/Users/vpeurala/Desktop/Serious_Cryptography.pdf' yarn kululasku

## Tähänastinen testaushistoria

Sunnuntaina 31.12.2017 tätä kokeiltiin ensimmäistä kertaa tuotantokäytössä. Minulla oli silloin viisi kirjaa, joista minun piti tehdä kululaskut. Viidestä kuitista neljä meni läpi, ja kun tarkastin ne silmämääräisesti, niissä oli kaikki tiedot oikein. Nämä neljä kululaskua menivät läpi myös Mobulta ja kirjanpitäjältä, ja tätä kirjoittaessani rahat ovat jo tilillä.

Yksi kuitti ei mennyt läpi. Kun tutkin sitä tarkemmin, huomasin, että siitä puuttui sellaisia tietoja joita muissa oli. Tämä kyseinen kuitti oli sellaisesta kirjasta, jonka olin ostanut ihan äsken. Hypoteesini on, että Amazonissa kuitit muodostuvat jotenkin "vaiheittain" siten, että ostoshetkestä kestää jonkin aikaa ennen kuin kuitti on valmis (sellaisessa muodossa, mitä me tarvitsemme). Kannattaa varmaan odottaa vaikka pari tuntia ostohetkestä ennen kuin tekee kululaskut.

Toisen kerran kokeilin tätä keskiviikkona 10.1.2018. Silloin tein tällä kolme kululaskua, ja kaikki toimivat aivan moitteettomasti. Mobulta tai kirjanpitäjältä ei myöskään tullut mitään huomautuksia, ja rahat ovat näistäkin jo tilillä.

### Tätä työkalua on käytetty ainoastaan MacOS:lla (High Sierra, 10.13.2). Se ei luultavasti toimi Linuxilla tai Windowsilla suoraan ilman muutoksia. Kontribuutiot Linux- tai Windows-käyttäjiltä ovat enemmän kuin tervetulleita!
