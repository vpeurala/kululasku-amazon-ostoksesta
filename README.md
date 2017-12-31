# kululasku-amazon-ostoksesta

Automatisoi kululaskun luonnin eTaskuun Amazon-ostoksesta.

Sinun pitää asettaa seuraavat ympäristömuuttujat ajon yhteydessä:
* ETASKU_USERNAME = käyttäjätunnuksesi eTaskuun.
* ETASKU_PASSWORD = salasanasi eTaskuun.
* ETASKU_RECEIPT_FILE = kuittitiedosto, pdf-muodossa.

Esimerkki käytöstä:

`ETASKU_USERNAME='ville.peurala@wunderdog.fi' ETASKU_PASSWORD='Mansikka2' ETASKU_RECEIPT_FILE='/Users/vpeurala/Documents/Wunderdog_kularit/2017_12_30/Autotools.pdf' yarn kululasku`

TODO:
* Käytä nockia yksikkötestejä ajaessa ettei currencylayer.comin kuukausittainen quota kulu testiajoihin.
* Pysäytä prosessi heti jos PDF:n parsinnassa tapahtuu jokin virhe.
