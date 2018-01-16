# Kululasku Amazon-ostoksesta

Automatisoi kululaskun luonnin [eTaskuun](https://etasku.fi/) Amazon-ostoksesta.

Sinun pitää manuaalisesti hakea ostoksestasi PDF-kuitti Amazonista. Sen jälkeen tämä skripti hoitaa loput (tai pitäisi hoitaa).

Sunnuntaina 31.12.2017 tätä kokeiltiin ensimmäistä kertaa "tuotantokäytössä". Viidestä kuitista neljä meni läpi, ja kun tarkastin ne silmämääräisesti, niissä oli kaikki tiedot oikein. Yksi kuitti ei mennyt läpi. Kun tutkin sitä tarkemmin, huomasin, että siitä puuttui sellaisia tietoja joita muissa oli - se oli sellaisesta kirjasta, joka oli ostettu ihan äsken, ja ilmeisesti Amazonissa kuitit muodostuvat jotenkin "vaiheittain" siten että ostoksesta pitäisi odottaa jonkin aikaa ennen kuin kuitti on valmis.

Sinun pitää asettaa seuraavat ympäristömuuttujat ajon yhteydessä:
* ETASKU_USERNAME = käyttäjätunnuksesi eTaskuun.
* ETASKU_PASSWORD = salasanasi eTaskuun.
* AMAZON_INVOICE_PDF = Amazonilta saatu kuittitiedosto, pdf-muodossa.

Omalla koneella pitää olla pdftotext asennettuna.

Esimerkki käytöstä, kaikki ympäristömuuttujat asetetaan ajon yhteydessä:

    ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' AMAZON_INVOICE_PDF='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku

Koska käyttäjätunnuksesi ja salasanasi [eTaskuun](https://etasku.fi/) eivät muutu joka kerta, toisin kuin kuittitiedosto, voit
periaatteessa asettaa ne kerran ja sen jälkeen sinun täytyy antaa enää kuittitiedoston nimi erikseen:

    export ETASKU_USERNAME='ville.peurala@wunderdog.fi'
    export ETASKU_PASSWORD='Mansikka2'

Nyt voit ajaa monta laskua:

    AMAZON_INVOICE_PDF='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku

TODO:
=====
* Pysäytä prosessi heti jos PDF:n parsinnassa tapahtuu jokin virhe.
* Tarkista ohjelmallisesti heti prosessin alussa, löytyykö käyttäjän koneelta kaikki tarvittavat palikat (esim. pdftotext).
* Toistaiseksi testattu vain Macilla, pitäisi kokeilla myös Linuxilla ja Windowsilla. Testaa muutenkin lisää.
* Jätä fixture ja test pois, jos mahdollista - tämä ei ole testi, vaan tapa automatisoida selainworkflow TestCafeta apuna käyttäen.
