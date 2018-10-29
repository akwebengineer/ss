/**
 * View to create a SSL Forward Proxy Profile add Root Certificate
 * @module rootCertificateFormVIew
 * @author vinayms@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/rootCertificatesFormConfiguration.js',
    'widgets/dropDown/dropDownWidget',
    'backbone.syphon',
    '../models/sslForwardProxyRootCertificatesModel.js',
    '../models/sslForwardProxyTrustedCAsModel.js',
     'widgets/listBuilderNew/listBuilderWidget',
    '../constants/sslFpConstants.js'
], function (Backbone,
            FormWidget,
            RootCertificateFormConfiguration,
            DropDownWidget,
            Syphon,
            RootCertificatesModel,
            TrustedCAsModel,
            ListBuilderWidget,
            SslFpConstants) {

    var RootCertificatesFormView = Backbone.View.extend({

        // events to be handled
        events: {
            'click #root_certificate_save': "submit",
            'click #root_certificate_cancel': "cancel"
        },
        /**
         * Initialize view
         * @param options
         */
        initialize: function (options) {
          var me = this, elementAt;

          me.activity = options.activity;
          me.rowData = options.rowData;
          me.context = options.activity.context;

          me.isEditMode = false;
          if(me.rowData){
            me.isEditMode = true;
            if(me.rowData.selectedRows){
                me.sdDeviceID = me.rowData.selectedRows[0]['security-device-id'].toString() || (me.rowData.selectedRows[0]['security-device-id'][0]?me.rowData.selectedRows[0]['security-device-id'][0].toString():"");
                me.sdDeviceName = me.rowData.selectedRows['security-device-name'];
            } else if(me.rowData.originalData){
                me.sdDeviceID = me.rowData.originalData['security-device-id'].toString() || me.rowData.originalRow['security-device-id'][0].toString();
                me.sdDeviceName = me.rowData.originalData['security-device-name'];
            } else{
              me.sdDeviceID = "";
            }
            elementAt = $.inArray(me.sdDeviceID,me.activity.selectedRootCertificateDevices);
            me.activity.selectedRootCertificateDevices.splice(elementAt, 1);
          }

          me.preSelectedRootCertificateDevices = me.activity.selectedRootCertificateDevices;

          me.rootCertificatesModel = new RootCertificatesModel();
          me.trustedCAsModel = new TrustedCAsModel();

        },
        /**
         * Handles Form rendering
         * @returns {RootCertificatesFormView}
         */
        render: function () {
            var me = this,
                formConf = new RootCertificateFormConfiguration(me.context),
                formElements = formConf.getValues();

            // construct the conf view form
            me.rootCertificateForm = new FormWidget({
                "elements": formElements,
                "container": me.el
            });

            me.rootCertificateForm.build();
            //me.buildMultiSelectDropdownForTrustedCAS();
            me.buildListBuilderForTrustedCAS();
            me.buildSearchableDropdownForDevices();
            // in edit mode..
            if(me.sdDeviceID){
              me.populateRootCertificates(me.sdDeviceID);
              me.populateTrustedCas(me.sdDeviceID);
            }

            this.$el.find('input[type=radio][name=ssl_fp_root_certicicates_trusted_cs]').click(function() {
               if(this.value === 'ALL'){
                me.$el.find('.sd-ssl-form-root-certificate-trusted-cas').hide();
               }else{
                me.$el.find('.sd-ssl-form-root-certificate-trusted-cas').show();
               }
            });

            return me;
        },
        /**
         * [buildSearchableDropdownForDevices : will build multiselect dropdown widget for Devices]
         */
        buildSearchableDropdownForDevices: function(){
          var self = this,  multipleDefault;

          if(!self.devicesDropDown){
            multipleDefault = this.$el.find('#sd-ssl-form-root-certificate-devices').append('<select class="sd-ssl-root-certificate-devices" style="width: 100%"></select>');
          }

            self.devicesDropDown = new DropDownWidget({
              "container": self.$el.find('.sd-ssl-root-certificate-devices'),
              "onChange" : function(){
                var devicesElement = self.devicesDropDown;
                if(devicesElement.getValue()){
                    self.populateRootCertificates(devicesElement.getValue());
                    self.populateTrustedCas(devicesElement.getValue());
                }
              },
              "initValue": {
                  "id": self.sdDeviceID || "",
                  "text": self.sdDeviceName || ""
              },
              "remoteData": {
                headers: {
                   "accept" : SslFpConstants.ROOT_CERTIFICATE_DEVICES_ACCEPT_HEADER
                },
                "url": SslFpConstants.ROOT_CERTIFICATE_DEVICES_URL,
                "numberOfRows": 10,
                "jsonRoot": "devices.device",
               
                "jsonRecords": function(data) {
                  return data['devices']['total']
                },
                "success": function(data){
                  console.log("call succeeded");
                },
                "error": function(){
                  console.log("error while fetching data");
                }
              },
              "templateResult": function (data) {
                    if (data.loading) return data.text;
                     if($.inArray(data['id'].toString(),self.preSelectedRootCertificateDevices) === -1){
                          var markup = data.name;
                          return markup;
                    }
                },
              "templateSelection": function (data) {
                self.selectedDeviceName = data.name;
                self.selectedDeviceID = data['id'];
                 return data.name;
              },
              "enableSearch": true,
              "showCheckboxes": false
          });

          self.devicesDropDown.build();
          self.$el.find('.select2-container').css('width', '300px');
          if(!self.isEditMode){
            self.devicesDropDown.setValue([""]);
          }
        },
        /**
         * [populateTrustedCas :  On select of device Dropdown using the selected Device ID populate the Trusted CAS]
         * will update the trusted CAS multi select dorpdown list
         * @param  {[String]} selectedDevices [Device ID]
         * @param  {[Object]} trustedCAsDropDown            [multi select trusted CAS dropdown]
         */
        populateTrustedCas: function(selectedDevice){
          var self = this;
            self.trustedCAsModel.urlRoot = '/api/juniper/sd/device-management/'+ selectedDevice +'/trusted-cas';
            if(self.trustedCAsModel.attributes['trusted-cas']){
              delete self.trustedCAsModel.attributes['trusted-cas'];
            }
            self.trustedCAsModel.fetch({
              success: function (collection) {
                var trustedCAsData = collection.attributes['trusted-cas'],trustedCas = [],trustedCasData = [];
                if(trustedCAsData && trustedCAsData['trusted-ca'] && trustedCAsData['trusted-ca'].length > 0 ){
                    trustedCas = trustedCAsData['trusted-ca'];
                    self.trustedCAsListBuilder.reload();
                    self.trustedCAsListBuilder.addAvailableItems(trustedCas);
                  } else {
                    self.trustedCAsListBuilder.reload();
                  }                  
                if(!self.onceLoaded && self.isEditMode ){
                  self.onceLoaded = true;
                  $(self.rowData.originalRow['trusted-cas.trusted-ca']).each(function (i) {
                      trustedCasData.push({value: self.rowData.originalRow['trusted-cas.trusted-ca'][i]});
                  });
                  if((trustedCasData.length>0 && trustedCasData[0].value.toLowerCase() !== 'all') || trustedCasData.length === 0){
                    self.$el.find('input[type=radio][name=ssl_fp_root_certicicates_trusted_cs][value=SPECIFY_VALUE]').attr("checked", true);
                    self.$el.find('.sd-ssl-form-root-certificate-trusted-cas').show();
                    self.trustedCAsListBuilder.selectItems(trustedCasData);
                  }
                }
              },
              error: function () {
                console.log('Trusted CAS not fetched');
              }
            });
        },
        /**
         * [populateRootCertificates : On select of device Dropdown using the selected Device ID populate the root certificates]
         * will update the root certificate dropdown options
         * @param  {[string]} selectedDevices [device ID]
         */
        populateRootCertificates: function(selectedDevices){
          var self = this,
          jsonData = {
            "device-certificates-request": {
              "device-id-list":{
                "ids": [selectedDevices]
              },
              "auth-method":"RSA_SIGNATURE"
            }
          };
          if(self.rootCertificatesModel.attributes['certificates-for-devices']){
            delete self.rootCertificatesModel.attributes['certificates-for-devices'];
          }
          self.rootCertificatesModel.set(jsonData);
          self.rootCertificatesModel.save(null,{
            success: function (collection) {
               var rootCertificate = self.$el.find('#sd-ssl-form-root-certificate-certificates'),
                certificates = collection.attributes['certificates-for-devices'], i, certificate,
                perSelectedCertificate = "";
                if(certificates){
                    certificates = certificates['certificatelite'];
                }
                rootCertificate.find('option').remove();
                // append the rest of the certificates from backend on to the option list for certificates
                if(certificates === "" || certificates === undefined){
                   rootCertificate[0].appendChild(new Option("NONE", ""));
                   rootCertificate.val("");
                  return;
                }

                if(!$.isArray(certificates)){
                  certificates = [certificates];
                }
                // add the pre-selected root certificate at the top of the drop down option if any
                if(perSelectedCertificate){
                  rootCertificate[0].appendChild(new Option(perSelectedCertificate, perSelectedCertificate));
                }
                rootCertificate[0].appendChild(new Option("NONE", ""));
                if (certificates.length !== 0) {
                  for (i=0; i < certificates.length; i++) {
                    certificate = certificates[i]['certificate-name'];
                    // exclude the pre-selected root certificate while atting to options of dropdown
                    if(certificate !== perSelectedCertificate){
                      rootCertificate[0].appendChild(new Option(certificate, certificate));
                    }
                  }
                }
                // set dropdown value
                if(self.isEditMode){
                  rootCertificate.val(self.rowData.originalRow['root_certificate']);
                }else{
                  rootCertificate.val("");
                }
              },
              error: function () {
                  console.log('Root Certificates not fetched');
              }
          });
        },
        /**
         * [buildListBuilderForTrustedCAS : will build list builder widget for trusted CAS]
         */
        buildListBuilderForTrustedCAS: function(){
            var self = this,  multipleDefault = this.$el.find('#sd-ssl-form-root-certificate-trusted-cas');

            self.trustedCAsListBuilder =new ListBuilderWidget({
                container: multipleDefault,
                elements: {
                    "availableElements": {
                        "getData": function(){ }
                    },
                    "selectedElements": {
                        "getData": function(){ }
                    },
                    "id": "ssl_fp_trusted_cas_list_builder",
                    "jsonId": "value",
                    "search": {
                        "columns": "value"
                    },
                    "height": '200px',
                    "columns": [
                    {
                        "index": "value",
                        "name": "value",
                        "label": "Name",
                        "width": 200
                    }]
                }
            });
          self.trustedCAsListBuilder.build();
        },
        /**
         * Handles submit action
         * @param event
         */
        submit: function (event) {
            event.preventDefault();
            var self = this, updatedRecord,selectedTrustedCasList=[], selectedTrustedCas = this.trustedCAsListBuilder.getSelectedItems(), properties = Syphon.serialize(self);
            if (!self.devicesDropDown.getValue() && !self.sdDeviceID) {
              console.log('The form is invalid');
              self.rootCertificateForm.showFormError('Device is required');
              return;
            }else if(!properties['root_certificate']){
              self.rootCertificateForm.showFormError('Root Certificate required');
              return;
            } else{

              $(selectedTrustedCas).each(function (i) {
                      selectedTrustedCasList[selectedTrustedCasList.length] = selectedTrustedCas[i].value;
                  });
              updatedRecord = {
                "security-device-id" : self.selectedDeviceID || self.sdDeviceID,
                "security-device-name" : self.selectedDeviceName , 
                "root_certificate": properties['root_certificate'], 
                "trusted-cas.trusted-ca": (properties['ssl_fp_root_certicicates_trusted_cs'] === 'ALL')? ['all']: selectedTrustedCasList 
              };
              if(self.isEditMode){
                //modify the existing row
                self.activity.rootCertificateGridWidget.editRow (self.rowData.originalRow, updatedRecord);
              }else {
                // add an new row to root certificate grid with selected values.
                self.activity.rootCertificateGridWidget.addRow(updatedRecord);
              }
              // update the selected device for root certificate.
              self.activity.selectedRootCertificateDevices.push((self.selectedDeviceID || self.sdDeviceID).toString());
              this.cancel(event, true);
            }
        },
        close: function(){
          if(this.trustedCAsListBuilder){
            this.trustedCAsListBuilder.destroy();
          }
        },
        /**
         * On cancel,  destroy the overlay
         * @param event
         */
        cancel: function (event, updateSelected) {
          if(this.isEditMode && !updateSelected && $.inArray(this.sdDeviceID,this.activity.selectedRootCertificateDevices) === -1){
            this.activity.selectedRootCertificateDevices.push(this.sdDeviceID);
          }
          event.preventDefault();
          this.activity.overlay.destroy();
        }
    });
    return RootCertificatesFormView;
});