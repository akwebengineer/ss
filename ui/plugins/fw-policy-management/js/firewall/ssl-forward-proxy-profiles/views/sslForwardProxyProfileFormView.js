/**
 * View to create a SSL Forward Proxy Profile
 * 
 * @module SslForwardProxyProfileCreateView
 * @author nadeem@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/sslForwardProxyProfileFormConfiguration.js',
    '../conf/sslForwardProxyProfileViewConfiguration.js',
    '../conf/rootCertificateGridConfiguration.js',
    'widgets/grid/gridWidget',
    'widgets/dropDown/dropDownWidget',
    '../../../../../object-manager/js/objects/widgets/addressListBuilder.js',
    './rootCertificateFormView.js',
    'widgets/overlay/overlayWidget',
    '../conf/ExemptedAddressesGridViewConfiguration.js',
    '../constants/sslFpConstants.js'
], function (Backbone, 
    Syphon, 
    FormWidget, 
    FormValidator, 
    ResourceView, 
    Form, 
    ViewForm,
    RootCertificateConf,
    GridWidget, 
    DropDownWidget,
    ListBuilder,
    RootCertificateView,
    OverlayWidget,
    ExemptedAddressesConf,
    SslFpConstants) {

    var SslForwardProxyProfileFormView = ResourceView.extend({
        // events to be handled
        events: {
            'click #sd-ssl-form-button-save': "submit",
            'click #sd-ssl-form-link-cancel': "cancel",
            'validTextarea #sd-ssl-forward-proxy-profile-create-form': 'validateForm',
            'click #add-new-button1': 'addNewAddress'
        },
        /**
         * Initialize resource view
         * @param options
         */
        initialize: function(options) {
          var self = this;
          ResourceView.prototype.initialize.call(self, options);

          self.activity = options.activity;
          self.context = options.activity.getContext();

          self.successMessageKey = 'sslForwardProxyProfile_create_success';
          self.editMessageKey = 'sslForwardProxyProfile_edit_success';
          self.fetchErrorKey = 'sslForwardProxyProfile_fetch_error';
          self.fetchCloneErrorKey = 'sslForwardProxyProfile_fetch_clone_error';
          self.selectedRootCertificateDevices =[];
          self.customCiphersData = [];
         
          self.actionEvents = {
            createEvent: "addRow",
            deleteEvent: "deleteAction"
          };
          self.bindGridEvents();

        },
         /**
         * Sets title based on form mode
         * @param formConfiguration
         */
        addDynamicFormConfig: function (formConfiguration) {
            var me = this, dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(me, formConfiguration);
            switch (me.formMode) {
                case me.MODE_EDIT:
                    dynamicProperties.title = me.context.getMessage('ssl_forward_proxy_profile_edit_form');
                    break;
                case me.MODE_CREATE:
                    dynamicProperties.title = me.context.getMessage('ssl_forward_proxy_profile_create_form');
                    break;
                case me.MODE_VIEW:
                    dynamicProperties.title = me.context.getMessage('ssl_forward_proxy_profile_view_form');
                    break;
                case me.MODE_CLONE:
                    dynamicProperties.title = me.context.getMessage('ssl_forward_proxy_profile_clone_form');
                    break;
                default: 
                  dynamicProperties.title = me.context.getMessage('ssl_forward_proxy_profile_create_form');
            }

            _.extend(formConfiguration, dynamicProperties);
        },
        /**
         * Handles Form rendering
         * @returns {SslForwardProxyProfileFormView}
         */
        render: function() {
            var self = this,formElements,formConfiguration;

            if(self.formMode === self.MODE_VIEW){
              formConfiguration = new ViewForm(self.context);
              self.prepareModelForViewSslFP();
            }else {
              formConfiguration = new Form(self.context);
            }
            formElements = formConfiguration.getValues();

            // update Form config based on create/edit/view
            self.addDynamicFormConfig(formElements);
          
            self.form = new FormWidget({
                container: self.el,
                elements: formElements,
                values: self.model.attributes
            });

            self.form.build();
            
            // create Root certificate Grid 
            self.buildRootCertificateGrid();

           
            if(self.formMode !== self.MODE_VIEW){

              // update Grid action Label
              self.updateCreateLabelToAddOnRootCertificateGrid();

              //create multi select dropdown for Custom Cliphers
              //self.createCustomCiphersMultipleSelectDropDown();

              //create multi select dropdown for logs
              self.createLogsMultipleSelectDropDown();

              // API call to fetch custom cipher drop down data
         
              self.fetchCustomCiphersDropDownData();
          
            }else{
               self.createExemptedAddressesGrid();
            }
            // Create address List builder 
            self.constructAddressBuilder();

            if(self.activity.intent.action !== Slipstream.SDK.Intent.action.ACTION_CREATE){
              self.updateFormElementsValues();
            }

            return self;
        },

        prepareModelForViewSslFP: function() {

          var self = this, i, data, address, ciphers = "", selectedAddresses="",allLogs = "";
             (self.model.attributes['all-log']) ?  allLogs += "all-log," : allLogs = allLogs;
             (self.model.attributes['warning-log']) ?  allLogs += "warning-log," : allLogs = allLogs;
             (self.model.attributes['info-log']) ?  allLogs += "info-log," : allLogs = allLogs;
             (self.model.attributes['error-log']) ?  allLogs += "error-log," : allLogs = allLogs;
             (self.model.attributes['sessions-white-listed-log']) ?  allLogs += "sessions-white-listed-log," : allLogs = allLogs;
             (self.model.attributes['sessions-dropped-log']) ?  allLogs += "sessions-dropped-log," : allLogs = allLogs;
             (self.model.attributes['sessions-allowed-log']) ?  allLogs += "sessions-allowed-log," : allLogs = allLogs;
             (self.model.attributes['session-ignored-log']) ?  allLogs += "session-ignored-log," : allLogs = allLogs;

             self.model.attributes['ssl-log'] = allLogs.substring(0,allLogs.length-1);

             self.model.attributes['ignore-server-auth-failure'] = (self.model.attributes['ignore-server-auth-failure']) ? "Enabled": "Disabled";
             self.model.attributes['disable-session-resumption'] = (self.model.attributes['disable-session-resumption']) ? "Enabled": "Disabled";
             self.model.attributes['is-flow-tracing'] = (self.model.attributes['is-flow-tracing']) ? "Enabled": "Disabled";

        self.model.attributes['preferred-cipher'] = (self.model.attributes['preferred-cipher'] === "") ? "None" : self.model.attributes['preferred-cipher'];
          if(self.model.attributes['custom-ciphers']){
              data = self.model.attributes['custom-ciphers']['custom-cipher'];
              if(!$.isArray(data)) {
                 data = [data];
              }
              for (i in data) {
                if(data.hasOwnProperty(i)){
                  ciphers += data[i]+",";
                }
              }
              self.model.attributes['ciphers'] = ciphers.substring(0,ciphers.length-1);
            }
           if(self.model.attributes['exempted-addresses']) {
              address = self.model.attributes['exempted-addresses']["address-reference"];
              if(!$.isArray(address)) {
                  address = [address];
              }
              for (i=0;i<address.length ;i++) {
                 selectedAddresses += address[i].name+",";
              }
              self.model.attributes['selectedAddresses'] = selectedAddresses.substring(0,selectedAddresses.length-1);
           }
        },
        /**
         * create Root Certificate Grid Widget 
         */
        buildRootCertificateGrid: function(){
          var self = this, 
              rootCertificateConf = new RootCertificateConf(self.context),
              gridContainer = self.$el.find('#sd-ssl-form-root-certificate').empty(),
              option = self.model.attributes,
              rootCertificateGridConf =  {
                container: gridContainer,
                actionEvents : {createEvent: "addEvent", updateEvent: "editEvent",deleteEvent: "deleteAction"},
                elements: rootCertificateConf.getValues(self.model.attributes)
              };

          if(self.formMode === self.MODE_VIEW){
            rootCertificateGridConf = {
              container: gridContainer,
              elements: rootCertificateConf.getViewValues(self.model.attributes)
            };
          }

          self.rootCertificateGridWidget = new GridWidget(rootCertificateGridConf).build();

          // add the elementinput-long class to grid-widget class to increase the width of the grid
          gridContainer.find(".grid-widget").addClass("elementinput-long-ssl-fp-root-certificate-grid");

          // if data available then populate the data to the root certificate grid
          if(option["root-certificates"]){
              var i, data = option["root-certificates"]["ssl-forward-proxy-certificate"];
              if(data){
                  if(!$.isArray(data)){
                      data = [data];
                  }
                  for(i in data){
                    self.rootCertificateGridWidget.addRow(data[i], 'last');
                  }
              }
          }

        },
        /**
         * create Exempted Addresses Certificate Grid Widget
         */
        createExemptedAddressesGrid: function(){
          var self = this,
              exemptedAddressesConf = new ExemptedAddressesConf(self.context),
              gridContainer = self.$el.find('#sd-ssl-form-exempted-address').empty(),
              option = self.model.attributes;

          self.exemptedAddressesGridWidget = new GridWidget({
            container: gridContainer,
            elements: exemptedAddressesConf.getValues(self.model.attributes)
          }).build();

        // add the elementinput-long class to grid-widget class to increase the width of the grid
        gridContainer.find(".grid-widget").addClass("elementinput-long-ssl-fp-root-certificate-grid");

          // if data available then populate the data to the exempted addresses certificate grid
           if(option["exempted-addresses"]){
               var data = option["exempted-addresses"]["address-reference"];
               if(!$.isArray(data)){
                   data = [data];
               }
             self.exemptedAddressesGridWidget.addRow(data, 'last');
           }
      },
        bindGridEvents: function () {
          var self = this;
         /* self.$el
              .bind("gridRowOnEditMode", function (e, editModeRow) {
                self.handleRowDataEdit(editModeRow);
              });   */
            self.$el.bind( "addEvent", $.proxy(this.onAddRootCertificate, self));
            self.$el.bind( "editEvent", $.proxy(this.onEditRootCertificate, self));

            self.$el.bind("deleteAction", $.proxy(self.onDeleteEvent, self)); 
        },   
        onAddRootCertificate: function(){
           var rootCertificateView = new RootCertificateView({activity: this});
          this.buildRootCertificateOverlay(rootCertificateView);

        },
        onEditRootCertificate: function(e, row){
          var rootCertificateView = new RootCertificateView({activity: this, rowData: row});
          this.buildRootCertificateOverlay(rootCertificateView);

        },
        buildRootCertificateOverlay: function(rootCertificateView){

          this.overlay = new OverlayWidget({
              view: rootCertificateView,
              type: 'medium',
              showScrollbar: true
          });
          this.overlay.build();
        },
        /**
         * call back handler delete event to update the local cache
         * 
         * @param  {e} event
         * @param  {[array]} array of selected objects for delete
         */
        onDeleteEvent: function(e, selectedObj){
          
          var me = this, deltedRootCertificate, elementAt;

          $(selectedObj.deletedRows).each(function (i) {

            deltedRootCertificate = selectedObj.deletedRows[i]['security-device-id'];
            elementAt = $.inArray(deltedRootCertificate,me.selectedRootCertificateDevices);
            me.selectedRootCertificateDevices.splice(elementAt, 1);
          });

        },
       
        
        save:  function(columnName, data) {
          this.$el.find('.grid-widget').trigger('updateCellOverlayView',{
              'columnName':columnName,
              'cellData':data
          });
        },
        /*close:  function(columnName,e) {
          // TODO: as there is bug from frame work team using .trigger function, using destroy with object reference; remove once bug fixed 
          this.rootCertificateGridWidget.overlay.destroy();
          //this.$el.find('.grid-widget').trigger('closeCellOverlayView', columnName);
          e.preventDefault();
        },*/
         /**
         * update create grid action button label to Add
         */
        updateCreateLabelToAddOnRootCertificateGrid: function(){
            this.$el.find('.create').attr("title","Add");
        },
        /**
         * feches data for custom ciphers 
         * and once data is fetched internally calls createCustomCiphersMultipleSelectDropDown()
         * for building the multi-select custom ciphers drop down
         */
        fetchCustomCiphersDropDownData: function(){
          var self = this, ciphers;
          $.ajax({
            url: SslFpConstants.FETCH_CUSTOM_CIPHERS_URL,
            type: 'GET',
            dataType:"json",
            headers:{
                'accept': SslFpConstants.FETCH_CUSTOM_CIPHERS_ACCEPT_HEADER
            },
            success: function(response, status){
              ciphers = response['custom-ciphers']['custom-cipher'];
              $(ciphers).each(function (i) {
                self.customCiphersData.push({id:ciphers[i].value,text:ciphers[i].value});
              });
              // create multi select dropdown for Custom Cliphers
              self.createCustomCiphersMultipleSelectDropDown();
            }
          });
        },
        /**
         *  create custom clippers multiselect DropDown 
         *  with data, allows max 100 selections
         *  assign to the respective container
         */
        createCustomCiphersMultipleSelectDropDown: function(){

          var self = this, multipleDefault;
          // if no data fetched from the server do not build custom clippers multiselect DropDown
          // createCustomCiphersMultipleSelectDropDown will be re-triggered in the response of 
          // fetchCustomCiphersDropDownData API call.
          if(!self.customCiphersData){
            return;
          }
          if(!self.customCiphersDropDown){
            multipleDefault = this.$el.find('#sd-ssl-forward-proxy-profile-custom-ciphers').append('<select class="sd-ssl-form-custom-ciphers" style="width: 100%"></select>');
          }
            self.customCiphersDropDown = new DropDownWidget({
              "container": self.$el.find('.sd-ssl-form-custom-ciphers'),
              "data": self.customCiphersData,
              "multipleSelection": {
                  maximumSelectionLength: 100,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": self.context.getMessage("select_options")
          });
          self.customCiphersDropDown.build();

          self.$el.find('.select2-container').css('width', '300px');

          // update the multiselect dropdown value after its build
          if(self.activity.intent.action !== Slipstream.SDK.Intent.action.ACTION_CREATE){
            if(self.model.attributes['custom-ciphers']){
              self.customCiphersDropDown.setValue(self.model.attributes['custom-ciphers']['custom-cipher']);
            }
          }
        },
        /**
         *  create logs multiselect DropDown 
         *  assign to the respective container
         */
        createLogsMultipleSelectDropDown: function(){

          var self = this, preSelectedValues = [],
              multipleDefault;
          if(!self.logsDropDown){
            multipleDefault = this.$el.find('#sd-ssl-forward-proxy-profile-log').append('<select class="sd-ssl-form-log" style="width: 100%"></select>');
          }
              self.logsData = [{
                  "id": "all-log",
                  "text": "All"
                },
                {
                  "id": "warning-log",
                  "text": "Warnings"
                },
                {
                  "id": "info-log",
                  "text": "Info"
                },
                {
                  "id": "error-log",
                  "text": "Error"
                },
                {
                  "id": "sessions-white-listed-log",
                  "text": "Session Whitelisted"
                },
                {
                  "id": "sessions-allowed-log",
                  "text": "Session Allowed"
                },
                {
                  "id": "sessions-dropped-log",
                  "text": "Session Dropped"
                },
                {
                  "id": "session-ignored-log",
                  "text": "Session Ignored"
                }];

          self.logsDropDown = new DropDownWidget({
              "container": self.$el.find('.sd-ssl-form-log'),
              "data": self.logsData,
              "multipleSelection": {
                  maximumSelectionLength: 100,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": self.context.getMessage("select_an_option")
          });
          self.logsDropDown.build();

          // update the multiselect dropdown value after its build
          if(self.activity.intent.action !== Slipstream.SDK.Intent.action.ACTION_CREATE){
            $(self.logsData).each(function (i) {
              if(self.model.attributes[self.logsData[i].id] === true){
                preSelectedValues.push(self.logsData[i].id);
              }
            });
            self.logsDropDown.setValue(preSelectedValues);
          }
          self.$el.find('.select2-container').css('width', '300px');

        },
        /**
         * create list builder with address 
         * assign to the respective container
         *
         * for edit view assign the selected address from the exempted addresses
         */
        constructAddressBuilder: function(){
            var self = this,
            addressesContainer = self.$el.find('#sd-ssl-fw-exempted-address-group'),
            POLYMORPHIC = 'POLYMORPHIC',
            DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
            ANY = 'ANY',
            ANY_IPV4 = 'ANY_IPV4', 
            ANY_IPV6 = 'ANY_IPV6',
            selectedItems=[],
            exemptedAddresses;

            addressesContainer.attr("readonly", "");

            // build
            if (self.model.get('exempted-addresses')) {
                exemptedAddresses = self.model.get('exempted-addresses');
                if (exemptedAddresses && exemptedAddresses['address-reference']) {
                  exemptedAddresses['address-reference'] = [].concat(exemptedAddresses['address-reference']);
                  selectedItems = exemptedAddresses['address-reference'].map(function(item) {
                      return item.id;
                  });
                }
            }

            self.exemptedAddressListBuilder = new ListBuilder({
                context: this.context,
                container: addressesContainer,
                selectedItems: selectedItems,
                excludedTypes: [POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, ANY, ANY_IPV4, ANY_IPV6]
            });

            self.exemptedAddressListBuilder.build(function() {
                addressesContainer.find('.new-list-builder-widget').unwrap();
            });
        },
        /**
         * applies for Edit mode
         */
        updateFormElementsValues:function(){
          var self = this, selectedRootCertificate = self.model.attributes["root-certificates"]["ssl-forward-proxy-certificate"];

          self.$el.find('#sd-ssl-form-is-flow-tracing').prop('checked',self.model.attributes['is-flow-tracing']);
          self.$el.find('#sd-ssl-form-checkbox_enable_policy_rematch').prop('checked',self.model.attributes['checkbox_enable_policy_rematch']);
          self.$el.find('#sd-ssl-form-ignore-server-auth-failure').prop('checked',self.model.attributes['ignore-server-auth-failure']);
          self.$el.find('#sd-ssl-form-disable-session-resumption').prop('checked',self.model.attributes['disable-session-resumption']);
          self.$el.find('#sd-ssl-form-preferred-cipher').val(self.model.attributes['preferred-cipher']);
          self.$el.find('#sd-ssl-forward-proxy-profile-renegotiation').val(self.model.attributes['renegotiation']);

          if(selectedRootCertificate){
            selectedRootCertificate = $.isArray(selectedRootCertificate)?selectedRootCertificate: [selectedRootCertificate];
            // update selectedRootCertificateDevices arry with pre-existing device ids
            $(selectedRootCertificate).each(function (index) {
              //TODO: willnot support multiple device selection, need to add support one ssl fw proxy profile root  
              //certificate support multiple device selection per row
              if(selectedRootCertificate[index]['security-device-id']){
                self.selectedRootCertificateDevices.push(selectedRootCertificate[index]['security-device-id'].toString());
              }
            
            });
          }
          
        },
        /**
         * Validates form details
         * @param event
         */
        validateForm: function (event) {
            var me = this, el, value = event.target.value, name, allowBlank = true,
                blankErrorText, removeError = false;

            // get target name
            name = event.target.name;

            if (name === 'name') {
                el = me.$el.find('#sd-ssl-forward-proxy-profile-name');
                allowBlank = false;
                blankErrorText = me.context.getMessage("name_error");
            } else if (name === 'description') {
                el = me.$el.find('#sd-ssl-forward-proxy-profile-description');
            } else if (name === 'preferred-cipher') {
              if(me.customCiphersDropDown.getValue().length>0 && me.$el.find('#sd-ssl-form-preferred-cipher').val() === 'medium'){

                el = me.$el.find('#sd-ssl-forward-proxy-profile-custom-ciphers');
              }
            }

            if (el) {
                if (value && value.trim()) {
                    if (value.trim().length > 1024) {
                        el.closest('.row').addClass('error');
                        el.siblings('.error').show().text(me.context.getMessage("maximum_length_error", [1024]));

                    } else {
                        removeError = true;
                    }
                } else if (allowBlank) {
                    removeError = true;
                } else {
                    el.closest('.row').addClass('error');
                    el.siblings('.error').show().text(blankErrorText);
                }

                if (removeError) {
                    el.closest('.row').removeClass('error');
                    el.siblings('.error').hide().text('');
                }
            }
        },
        /**
         * Handles submit action
         * @param event
         */
        submit: function(event) {

          if (!this.form.isValidInput()) {
              console.log('The form is invalid');
              return;
            }
            event.preventDefault();
            

            var me = this, rootCertificates= me.rootCertificateGridWidget.getAllVisibleRows(), 
            rootCertificatesJson = [], properties = Syphon.serialize(me), 
            exemptedAddresses=[],
            selectedLogs = me.logsDropDown.getValue();
            properties["custom-ciphers"] = {"custom-cipher": me.customCiphersDropDown.getValue() ? me.customCiphersDropDown.getValue(): []};

            me.exemptedAddressListBuilder.getSelectedItems(function(data) {
              
              if((!me.customCiphersDropDown.getValue() || me.customCiphersDropDown.getValue().length === 0) && me.$el.find('#sd-ssl-form-preferred-cipher').val() === 'custom'){
                  me.form.showFormError(me.context.getMessage('ssl_forward_proxy_policy_root_custom_cliphers_mandatory'));
                  return;
              }else if(rootCertificates.length<1){
                  me.form.showFormError(me.context.getMessage('ssl_forward_proxy_policy_root_certificate_mandatory'));
                  return;
              }

              properties['exempted-addresses'] = {"address-reference": exemptedAddresses};

              if(!$.isEmptyObject(data.addresses.address)){
                var selectedExemptedAddresss = [].concat(data.addresses.address);
                selectedExemptedAddresss.forEach(function (object) {
                  exemptedAddresses.push({id: object.id});
                });
              }

              

              $(rootCertificates).each(function (i) {
                rootCertificatesJson.push({
                      "trusted-cas": {
                          "trusted-ca": rootCertificates[i]["trusted-cas.trusted-ca"]
                      },
                      "security-device-id": rootCertificates[i]["security-device-id"] || rootCertificates[i]["security-device-id"][0],
                      "root-certificate": rootCertificates[i]["root_certificate"],
                      "security-device-name": rootCertificates[i]["security-device-name"][0]
                  });
              });

              properties["root-certificates"] = {
                "ssl-forward-proxy-certificate":rootCertificatesJson
              };

              $(me.logsData).each(function (index) {  
                properties[me.logsData[index].id] = _.contains(selectedLogs, me.logsData[index].id) ? true : false;
              });

              me.bindModelEvents();
              me.model.set(properties);
              // save on the model
              me.model.save(null,{
                success: function(model, response) {
                 me.exemptedAddressListBuilder.destroy();
                }
              });
            });
        },

        
       addNewAddress: function(e) {

           var self = this;
            // Access address view
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                "mime_type": "vnd.juniper.net.addresses"
            });

            this.context.startActivityForResult(intent, function(resultCode, data) {

                // Add the newly created object in list of selected items.
                self.exemptedAddressListBuilder.refresh(function() {
                    self.exemptedAddressListBuilder.selectItems([data]);
                });

            });

        },

        
        close: function(){
          if(this.exemptedAddressListBuilder){
             this.exemptedAddressListBuilder.destroy();
          }
        },
        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });

    return SslForwardProxyProfileFormView;
});
