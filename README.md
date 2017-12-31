# kululasku-amazon-ostoksesta

Automatisoi kululaskun luonnin [eTaskuun](https://etasku.fi/) Amazon-ostoksesta.

Sinun pitää manuaalisesti hakea ostoksestasi PDF-kuitti Amazonista. Sen jälkeen tämä skripti hoitaa loput (tai pitäisi hoitaa).

Sunnuntaina 31.12.2017 tätä kokeiltiin ensimmäistä kertaa "tuotantokäytössä". Viidestä kuitista neljä meni läpi, ja kun tarkastin ne silmämääräisesti, niissä oli kaikki tiedot oikein. Yksi kuitti ei mennyt läpi. Kun tutkin sitä tarkemmin, huomasin, että siitä puuttui sellaisia tietoja joita muissa oli - se oli sellaisesta kirjasta, joka oli ostettu ihan äsken, ja ilmeisesti Amazonissa kuitit muodostuvat jotenkin "vaiheittain" siten että ostoksesta pitäisi odottaa jonkin aikaa ennen kuin kuitti on valmis.

Sinun pitää asettaa seuraavat ympäristömuuttujat ajon yhteydessä:
* ETASKU_USERNAME = käyttäjätunnuksesi eTaskuun.
* ETASKU_PASSWORD = salasanasi eTaskuun.
* ETASKU_RECEIPT_FILE = kuittitiedosto, pdf-muodossa.

Omalla koneella pitää olla pdftotext asennettuna.

Esimerkki käytöstä:

`ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' ETASKU_RECEIPT_FILE='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku`

TODO:
* Käytä nockia yksikkötestejä ajaessa ettei currencylayer.comin kuukausittainen quota kulu testiajoihin.
* Pysäytä prosessi heti jos PDF:n parsinnassa tapahtuu jokin virhe.
* Tarkista ohjelmallisesti heti prosessin alussa, löytyykö käyttäjän koneelta kaikki tarvittavat palikat (esim. pdftotext).
* Toistaiseksi testattu vain Macilla, pitäisi kokeilla myös Linuxilla ja Windowsilla.
