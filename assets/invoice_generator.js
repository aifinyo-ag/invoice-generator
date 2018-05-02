/*!
 * decimo Invoice Generator
 * version: 0.1
 * Requires jQuery v1.11
 * Copyright (c) 2018 Mike Nagora (mike.nagora@decimo.de)
 */

(function(window){
  var host = "http://dev-api.decimo.de";

  // This function will contain all our code
  function InvoiceGenerator(){
    var _invoiceGeneratorObject = {};
    
    // This variable will be inaccessible to the user, only can be visible in the scope of your library.
    var settings = {
      container: "",
      token: "",
      callback: {},
      user_token: ""
    };

    var sender = null;
    var recipient = null;
    var modal = null;

    // Change a private property
    _invoiceGeneratorObject.init = function(options, callback){
        var self = this;
        settings.token = options.token;
        settings.container = "#" + options.container;
        settings.callback = callback;
        settings.user_token = options.data.user.token

        this.initEvents();
           
      $.getScript(host + "/api_packs/decimo.js", function() {
      $.ajax({
        url : host + "/api/v2/generator/invoice?pp=disable",
        headers: {
          'X-AUTH-TOKEN' : options.token
        },
        method: "POST",
        dataType: "html",
        data: options.data
      }).done(function(response){
        $(settings.container).html(response);
        self.initFields(options.data.form_data);
      });
    });
      
    };

    _invoiceGeneratorObject.initEvents = function(){
       var self = this;

        // initialize events
        $(document).on('click', settings.container + ' .btn-invoice-save', function(e) {
            e.preventDefault();
            let form = $(this).parents('form');
            self.submit(form.serialize());
        });

        $(document).on('click', settings.container + ' .invoice-pdf-download', function(e) {
            let form = $(this).parents('form');
            form.attr('action', host + '/api/v2/generator/download_pdf');
            form.submit();
        });

        $(document).on('click', settings.container + ' .send-to-button', function(e) {  
            $('#email-modal').modal('show');
        });

        $(document).on('click', settings.container + ' button.send-pdf', function(e) {  
            $('#email-modal').modal('hide');
            let form = $(settings.container + ' form.new_invoice');
            self.send_pdf(form.serialize());
        });     
    };

    _invoiceGeneratorObject.initFields = function(data){
        sender = $('.invoice-address.invoice-sender');
        recipient = $('.invoice-address.invoice-recipient');
        modal = $('#contact-modal');
        
        var self = this;

        // initialize sender address
        if (data.from) {

          $('input[id="user[name]"]').val(data.from.firstname + " " + data.from.lastname);
          $('input[id="user[email]"]').val(data.from.email);
          $('input[id="user[line1]"]').val(data.from.line1);
          $('input[id="user[zip]"]').val(data.from.zip);
          $('input[id="user[city]"]').val(data.from.city);
          $('input[id="user[country]"]').val(data.from.country);
          $('input[id="user[phone]"]').val(data.from.phone);
          $('input[id="user[vat_number]"]').val(data.from.vat_number);
          $('input[id="user[tax_number]"]').val(data.from.tax_number);
          $('input[id="user[registry_number]"]').val(data.from.registry_number);

          $('#send-to-email').text(data.from.email);
          $('#user-registration-email').text(data.from.email);

          sender.find('.data-full-address').html(
            '<p>' + data.from.firstname + ' ' + data.from.lastname + 
            '<br>' + data.from.line1 + 
            '<br>' + data.from.zip + ' ' + data.from.city + 
            '<br>' + data.from.country + '</p>'
          );
          sender.find('.data-contact-info').html(
            '<p>' + data.from.email + 
            '<br>' + data.from.phone + '</p>'
          );
          sender.find('.data-vat-number').text(data.from.vat_number);
          sender.find('.data-tax-number').text(data.from.tax_number);
          sender.find('.data-registry-number').text(data.from.registry_number);
        }

        // initialize recipient address
        if (data.to) {

          $('input[id="recipient[name]"]').val(data.to.firstname + " " + data.to.lastname);
          $('input[id="recipient[email]"]').val(data.to.email);
          $('input[id="recipient[line1]"]').val(data.to.line1);
          $('input[id="recipient[zip]"]').val(data.to.zip);
          $('input[id="recipient[city]"]').val(data.to.city);
          $('input[id="recipient[country]"]').val(data.to.country);
          $('input[id="recipient[phone]"]').val(data.to.phone);

          recipient.find('.data-full-address').html(
            '<p>' + data.to.firstname + ' ' + data.to.lastname + 
            '<br>' + data.to.line1 + 
            '<br>' + data.to.zip + ' ' + data.to.city + 
            '<br>' + data.to.country + '</p>'
          );
        }

        // initialize recipient addresses 
        if (settings.user_token) {
          getAddress(settings.token, settings.user_token);  
        } else {
          item = $('.modal#contact-modal').find('.contact-item:first');
          item.addClass("hidden");
        }
        
    };

    _invoiceGeneratorObject.submit = function(data){
    $.ajax({
      url : host + "/api/v2/generator/submit",
        headers: {
            'X-AUTH-TOKEN' : settings.token
        },
        method: "POST",
        data: data
    }).done(function(response){
        settings.callback("Ihre Daten wurden gespeichert.");
      }).fail(function(response) {
        settings.callback("Oops, es ist leider eine Fehler aufgetreten.")
      });
    };

    _invoiceGeneratorObject.send_pdf = function(data){
    $.ajax({
      url : host + "/api/v2/generator/send_pdf",
        headers: {
            'X-AUTH-TOKEN' : settings.token
        },
        method: "POST",
        data: data
    }).done(function(response){
        settings.callback('Ihre Email wurde erfolgreich versandt');
      }).fail(function(response) {
      settings.callback("Oops, es ist leider eine Fehler aufgetreten.");
      });
    };

    return _invoiceGeneratorObject;
  }

  function getAddress(token, user_id) {
    $.ajax({
      url : host + "/api/v2/generator/recipient",
      headers: {
          'X-AUTH-TOKEN' : token
      },
      method: "POST",
      data: {
        user_token: user_id
      }
    }).done(function(response){
      let contacts_count = response.contacts.length
      $.each(response.contacts, function(index, value) {
        item = $('.modal#contact-modal').find('.contact-item:first');
        row = item.parents('.row');

        item.attr('data-id', value.id);
        item.find('.display-name').text(value.name);
        item.find('.line1').text(value.line1);
        item.find('.zip').text(value.zip);
        item.find('.city').text(value.city);
        item.find('.country').text(value.country);

        if (contacts_count == 0) {
          item.addClass("hidden")
        }
        if (contacts_count > 1) {
          row.prepend(item);

          if ((contacts_count - 1) != index) {
            row.prepend(item.clone());
          }
        }
      });
    }).fail(function(response) {
      settings.callback("Oops, es ist leider eine Fehler aufgetreten.")
    });
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.InvoiceGenerator) === 'undefined'){
    window.InvoiceGenerator = InvoiceGenerator();
  }
})(window); // We send the window variable withing our function
