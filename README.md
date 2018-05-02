# invoice-generator
External invoice generator


## HTML - index.html

```
<script type="text/javascript" src="assets/invoice_generator.js"></script>
<body class=“decimo-generator”>
<div id=“generator” class=“generator-style”>
```

* Das Body Element muss die CSS Klasse “decimo-generator” enthalten.
* Am Generator Container muss die CSS Klasse “generator-style” gesetzt sein.
* invoice_generator.js Script muss eingebunden werden.

## Javascript

Objekt “options” hat die Attribute 
* “container” -> container ID (im Beispiel “generator”)
* “token” -> API Token
* “source” -> Quelle
* “data”
    * “user”
        * “token” -> User ID
    * “form_data” -> Daten zur Vorauswahl via Javascript übergeben
        * “from” -> Rechnungssteller
        * “to” -> Rechnungsempfänger
    * “from” -> Rechnungsstellerdaten zur Vorauswahl via Server übergeben
    * “to” -> Rechnungsempfängerdaten zur Vorauswahl via Server übergeben

Funktion “init” mit dem Options Objekt wie einem möglichen Callback aufrufen. Im Beispiel wird nur ein Alert angezeigt. 