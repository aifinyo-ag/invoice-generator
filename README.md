
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
|source| "decimo"| Bspw. Ihr Firmenname |
|env| "prod"| Entweder "prod" oder "dev" - Standard ist "dev" |
|data.user.token| \<decimo User ID Token\>| Gültiger decimo User ID Token zur Vorinitialisierung des Formulars. Der Wert wird nach Speicherung des Kunden auf Seiten decimos im Request zurückgegeben. |
|data.form_data| {from: {Kundenattribute}, to: {Kundenattribute}}| Initialisierung des Formular nach dem Laden des Generators - Daten werden nicht an decimo übergeben|
|data.from, data.to| {Kundenattribute}| Initialisierung des Formular vor dem Laden des Generators - Daten werden an decimo übergeben|

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
      data: {  
         "user": {
          "token": ""
         },
         form_data: {
          "from":{  
              "firstname":"Lili",
              "company":"",
              "lastname": "Lane",
              "email": "launetagger@dec.de",
              "line1":"Surallee 42",
              "zip":"0815",
              "city":"Astau",
              "country":"DE",
              "phone":"01623344567",
              "tax_number_natural":"",
              "vat_number":"",
              "registry_number":"",
              "legal_form":""
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
          }
        }
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