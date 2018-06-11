/*!
 * decimo Invoice Generator
 * version: 0.3
 * Requires jQuery v1.11
 * Copyright (c) 2018 Mike Nagora (mike.nagora@decimo.de)
 */

(function(window){
  var host = "https://dev-api.decimo.de";

  // This function will contain all our code
  function InvoiceGenerator(){
    var _invoiceGeneratorObject = {};
    
    // This variable will be inaccessible to the user, only can be visible in the scope of your library.
    var settings = {
      container: "",
      token: "",
      callback: {},
      user_token: "",
      form: ""
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
        settings.user_token = (options.data && options.data.user) ? options.data.user.token : ""
        settings.form = settings.container + ' form.new_invoice'

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
        }).done(function(response) {
          $(settings.container).html(response);

          if (options.data && options.data.form_data) {
            self.initFields(options.data.form_data);
          }

          // initialize recipient addresses 
          if (settings.user_token) {
            getAddress(settings.token, settings.user_token);  
          } 

          $('input[name="sender[email]"]').change(function() {
            $('#send-to-email').text($(this).val());
            $('#user-registration-email').text($(this).val());
          });

        }).fail(function(response) {
          settings.callback(JSON.parse(response.responseText));
        });
      });  
    };

    _invoiceGeneratorObject.initEvents = function(){
       var self = this;

        // set body CSS class
        $('body').addClass('decimo-generator');

        if (settings.user_token) {
          $('body').addClass('registered');
        }

        // initialize events
        $(document).on('click', settings.container + ' .send-to-button', function(e) {  
            if (localStorage.getItem("email-modal-displayed") == "true") {
              self.send_pdf($(settings.form).serialize());
            } else {
              $('#email-modal').modal('show');
            }
        });

        $(document).on('click', settings.container + ' button.send-pdf', function(e) {  
            $('#email-modal').modal('hide');
            
            // Save data to the current local store
            localStorage.setItem("email-modal-displayed", $('#email-modal').find('#email-modal-displayed').is(':checked'));
            
            self.send_pdf($(settings.form).serialize());
        });

        $(document).on('click', settings.container + ' .btn-invoice-save', function(e) {  
            e.preventDefault();

            if (settings.user_token) {
              self.submit($(settings.form).serialize());
            } else {
              $('#save-modal').modal('show');
            }
        });

        $(document).on('click', settings.container + ' .save-customer', function(e) {  
            $('#save-modal').modal('hide');
            self.submit($(settings.form).serialize());
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

          setFullAddress(sender, data.from);
          setContactInfo(sender, data.from);

          sender.find('.data-vat-number').text(data.from.vat_number);
          sender.find('.data-tax-number').text(data.from.tax_number);
          sender.find('.data-registry-number').text(data.from.registry_number);

          //set data in modal
          setFormField($('input[name="sender[first_name]"]'), data.from.firstname);
          setFormField($('input[name="sender[last_name]"]'), data.from.lastname);
          setFormField($('input[name="sender[email]"]'), data.from.email);
          setFormField($('input[name="sender[line1]"]'), data.from.line1);
          setFormField($('input[name="sender[zip]"]'), data.from.zip);
          setFormField($('input[name="sender[city]"]'), data.from.city);
          setFormField($('input[name="sender[country]"]'), data.from.country);
          setFormField($('input[name="sender[phone]"]'), data.from.phone);
          setFormField($('input[name="sender[vat_number]"]'), data.from.vat_number);
          setFormField($('input[name="sender[tax_number]"]'), data.from.tax_number);
          setFormField($('input[name="sender[registry_number]"]'), data.from.registry_number);
          setFormField($('input[name="sender[email]"]'), data.from.email);
          setFormField($('input[name="sender[phone]"]'), data.from.phone);
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

          setFullAddress(recipient, data.to);
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
        settings.callback(response);
      }).fail(function(response) {
        settings.callback(response.responseJSON)
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
        settings.callback(response);
      }).fail(function(response) {
      settings.callback(response.responseJSON);
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
      var contacts_count = response.contacts.length
      $.each(response.contacts, function(index, value) {
        item = $('.modal#contact-modal').find('.contact-item:first');
        row = item.parents('.row');

        item.attr('data-id', value.id);
        item.find('.display-name').text(value.name);
        item.find('.line1').text(value.line1);
        item.find('.zip').text(value.zip);
        item.find('.city').text(value.city);
        item.find('.country').text(countryLabelLong(value.country));
        item.find('.country_code').text(value.country);

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
      settings.callback(response.responseJSON)
    });
  }

  function setFormField(field, value) {
    if (value && value != "") {
      field.val(value);
      field.parents('.form-group').removeClass('is-empty');
    }
  }

  function setFullAddress(object, data) {
    object.find('.data-full-address').html(
      '<p>' + data.firstname + ' ' + data.lastname + 
      '<br>' + data.line1 + 
      '<br>' + data.zip + ' ' + data.city + 
      '<br>' + countryLabelLong(data.country) + '</p>'
    );
  }

  function setContactInfo(object, data) {
    object.find('.data-contact-info').html(
      '<p>' + data.email + 
      '<br>' + data.phone + '</p>'
    );
  }

  function countryLabelLong(country) {
    switch(country) {
      case 'DE': return 'Deutschland'; break;
      case 'CH': return 'Schweiz'; break;
      case 'AT': return 'Österreich'; break;
    }
  }

  // We need that our library is globally accesible, then we save in the window
  if(typeof(window.InvoiceGenerator) === 'undefined'){
    window.InvoiceGenerator = InvoiceGenerator();
  }
})(window); // We send the window variable withing our function
