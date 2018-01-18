# Kululasku Amazon-ostoksesta

Tämä ohjelma automatisoi osittain kululaskun luonnin [eTaskuun](https://etasku.fi/) Amazon-ostoksesta.

Sinun pitää manuaalisesti hakea ostoksestasi PDF-kuitti Amazonista. Alla oleva opetusvideo näyttää, miten se tapahtuu. Sen jälkeen tämä skripti hoitaa loput.

## Opetusvideo

Katso tämä, se on nopein tapa oppia ohjelman käyttö.

TODO: Video tähän

## Vaatimukset ympäristölle

1. Sinulla pitää olla asennettuna (ja löytyä PATH:ista) sellainen komento kuin **pdftotext**. Sillä muunnetaan Amazonilta saatu PDF-kuitti tekstimuotoon, jotta siitä voidaan parsia tarvittava data. Ainakin MacOS:lla **pdftotext** on osa **Poppler**-nimistä ohjelmistoa. Helpoin tapa asentaa se on [Homebrewillä](https://brew.sh/):

    brew install poppler
    
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

Sunnuntaina 31.12.2017 tätä kokeiltiin ensimmäistä kertaa "tuotantokäytössä". Viidestä kuitista neljä meni läpi, ja kun tarkastin ne silmämääräisesti, niissä oli kaikki tiedot oikein. Yksi kuitti ei mennyt läpi. Kun tutkin sitä tarkemmin, huomasin, että siitä puuttui sellaisia tietoja joita muissa oli - se oli sellaisesta kirjasta, joka oli ostettu ihan äsken, ja ilmeisesti Amazonissa kuitit muodostuvat jotenkin "vaiheittain" siten että ostoksesta pitäisi odottaa jonkin aikaa ennen kuin kuitti on valmis.

Sinun pitää asettaa seuraavat ympäristömuuttujat ajon yhteydessä:
* ETASKU_USERNAME = käyttäjätunnuksesi eTaskuun.
* ETASKU_PASSWORD = salasanasi eTaskuun.
* AMAZON_INVOICE_PDF = Amazonilta saatu kuittitiedosto, pdf-muodossa.

Omalla koneella pitää olla pdftotext asennettuna.

MacOS:lle sen saa (Homebrewillä) näin:

    brew install poppler

Esimerkki käytöstä, kaikki ympäristömuuttujat asetetaan ajon yhteydessä:

    ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' AMAZON_INVOICE_PDF='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku

Koska käyttäjätunnuksesi ja salasanasi [eTaskuun](https://etasku.fi/) eivät muutu joka kerta, toisin kuin kuittitiedosto, voit
periaatteessa asettaa ne kerran ja sen jälkeen sinun täytyy antaa enää kuittitiedoston nimi erikseen:

    export ETASKU_USERNAME='ville.peurala@wunderdog.fi'
    export ETASKU_PASSWORD='Mansikka2'

Nyt voit ajaa monta laskua:

    AMAZON_INVOICE_PDF='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku

### Tätä työkalua on käytetty ainoastaan MacOS:lla (High Sierra, 10.13.2). Se ei luultavasti toimi Linuxilla tai Windowsilla suoraan, ilman muutoksia. Kontribuutiot Linux- tai Windows-käyttäjiltä ovat enemmän kuin tervetulleita!
