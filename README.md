
# invoice-generator
Der Rechnungsgenerator für jede Plattform


## Getting Started

Eine beispielhafte Einbettung des Rechnungsgenerators findet man in der [index.html](/index.html). Im Nachgang werden nun die wichtigstens Integrationspunkte aufgeführt und erläutert.

* Das Script [invoice_generator.js](/assets/invoice_generator.js) muss eingebunden werden.
* Es muss ein Container DOM Element geben, in welchem der Rechnungsgenerator geladen wird. An diesem DOM Element muss die CSS Klasse “generator-style" mit dem Farbschema "light” oder “dark” gesetzt sein.
* Der Rechnungsgenerator muss initialisiert werden. Dies geschieht in einem JavaScript Block auf der Seite. Dafür legt man vorher ein Options Objekt an, welche alle initialen Werte sowie die Einstellungen des Generators enthalten.

**Options**

|Name| Wert | Erklärung|
|--|--|--|
|container| \<container-id\>| Im folgenden Beispiel: generator |
|token | \<Auth Token\> | Wird von decimo bereitgestellt |
|source| "decimo" | Bspw. Ihr Firmenname |
|env| "prod" | ["prod", "dev"] - Auswahl des Ziel-Environment - Standard ist "dev" |
|preload| true | Vorladen der decimo.js (ohne extra Einbindung der decimo.js auf der Website) - Standard ist: true |
|privacy| false | Übertragung personenbezogener Daten (from, to) an decimo Server - Standard ist: false |
|data.user.token| \<decimo User ID Token\>| Gültiger decimo User ID Token zur Vorinitialisierung des Formulars. Der Wert wird nach Speicherung des Kunden auf Seiten decimos im Request zurückgegeben. |
|data.template| "factoring" | ["factoring", "standard"] - PDF wird als "Factoring" oder "Standard" Rechnung generiert. - Standard ist "standard" | 
|data.output| "customer" | ["callback", "customer"] - PDF Email wird an eine Callback URL oder an die E-Mail Adresse des Kunden versendet. - Standard ist "customer" | 
|data.from| {Kundenattribute}| Initialisierung des Rechnungsempfängers|
|data.to| {Kundenattribute}| Initialisierung des Rechnungsstellers|
|data.number| "1" | Rechnungsnummer|
|data.delivery_from| "2018-08-25" | Startdatum des Leistungszeitraums |
|data.delivery_to| "2018-09-02" | Enddatum des Leistungszeitraums |
|data.target_days| "30" | ["7", "14", "30", "45", "60", "90"] - Zahlungsziel |
|data.days| "2018-09-02" | Rechnungsdatum |
|data.subject| "Projekt" | Projekt |
|data.positions| [{Position}] | Array von Rechnungspositionen |

**Kundenattribute**

|Name| Wert |
|--|--|
|firstname| Max
|lastname| Mustermann
|company| Muster AG
|email| max@muster.de
|line1| Musterstraße 23
|zip| 12345
|city| Musterstadt
|country| DE, AT oder CH
|phone| +49 30 121 220 10
|tax_number_natural| *Steuernummer von Freelancer, Selbstständigen, Einzelunternehmen*
|tax_number_legal| *Steuernnummer von eingetragenen Unternehmen*
|vat_number| *USt-IdNr*
|registry_number| *Registernummer*
|legal_form| 2: *Freelancer*; 3: *Einzelunternehmen/Selbstständig*; 11: *OG / KG / GbR*; 21: *GmbH*; 22: *UG*; 23: *AG*; 31: *Eingetragener Verein*; 41: *Öffentliches Recht* 
|date_of_birth| 01.11.2018

**Position**

|Name| Wert |
|--|--|
|description| "Test"
|amount| 10.00
|unit| "Tag" aus ["Tag", "Stunde", "Kilometer", "Stück", "Pauschale", "Anzahl"]
|price| 100.00
|tax_rate| 19.00 aus [0, 7.00, 19.00]


In einem Beispiel sieht eine Konfiguration wie folgt aus:
```
<script type="text/javascript" src="assets/invoice_generator.js"></script>
<div id=“generator” class=“generator-style dark”>


<script type="text/javascript">
  $( document ).ready(function() {

    options = {
      container: "generator",
      token: "",
      source: "",
      env: "dev",
      preload: true,
      privacy: true,
      data: {
        /*  
        "user": {
          "token": ""
        },
        */
        "template": "factoring",
        "output": "customer",  
        "from":{  
            "firstname": "Lili",
            "company": "",
            "lastname": "Lane",
            "email": "launetagger@dec.de",
            "line1": "Surallee 42",
            "zip": "0815",
            "city": "Astau",
            "country": "DE",
            "phone": "01623344567",
            "tax_number_natural": "",
            "vat_number": "",
            "registry_number": "",
            "legal_form": "",
            "bank_holder": "Max Mustermann",
            "bank_iban": "DE3423412341234123"
        },
        "to":{  
            "firstname":"Max",
            "lastname": "Mustermannn",
            "line1":"Musterweg 42",
            "zip":"1723",
            "city":"Musterlitz",
            "country":"DE",
            "phone": "01623344567",
            "email": "bla@bla.de"
        },
        "number": "1",
        "delivery_from": "2018-08-25",
        "delivery_to": "2018-09-02",
        "target_days": "30",
        "date": "2018-09-02",
        "subject": "Projekt Wordpress",
        "positions": [
          {
            "description": "Test",
            "amount": 10.00,
            "unit": "Tag",
            "price": 100.00,
            "tax_rate": 19.00
          },
          {
            "description": "Wordpress",
            "amount": 5.00,
            "unit": "Tag",
            "price": 100.00,
            "tax_rate": 19.00
          }
        ]
      }
    }
    InvoiceGenerator.init(options, function(response) {
      handleResponse(response); 
    }); 
  });

  function handleResponse(response) {
    // Hier sollte Ihre Behandlung des Response Objekts erfolgen.
  }
</script>
``` 
In der Funktion handleResponse() können Sie anhand des Response Objekt Ihre jeweilige Aktion ausführen.

**Response Objekt**

*Rechnung speichern und Nutzer anlegen*
```javascript
{"status": "created", "user_token": "123123123", "message": "Ihre Rechnung wurde gespeichert und die PDF an Sie verschickt.", "type": "save-invoice"}
```
*Rechnung per PDF versandt*
```javascript
{"status": "success", "message": "Ihre Rechnung wurde als PDF an Sie verschickt.", "type": "send-pdf"}
```
*Validierungsfehler*
```javascript
{"status": "error", "message": {
"10": "RS-Name fehlt",
"11": "RS-Email fehlt",
"12": "RS-Adresszeile 1 fehlt",
"13": "RS-PLZ fehlt",
"14": "RS-Stadt fehlt",
"15": "RS-Land fehlt",
"16": "RS-Steuernummer oder RS USt-IdNr. fehlt",
"17": "RS-Telefonnummer fehlt",
"20": "RE-Name fehlt",
"21": "RE-Adresszeile fehlt",
"22": "RE-PLZ fehlt",
"23": "RE-Stadt fehlt",
"30": "Rechnungsnummer fehlt",
"31": "Start des Leistungszeitraums fehlt",
"32": "Ende des Leistungszeitraums fehlt",
"40": "IBAN ist ungültig",
"41": "Bankdaten unvollständig"}, "Time": "aktuelle Zeit"}
```