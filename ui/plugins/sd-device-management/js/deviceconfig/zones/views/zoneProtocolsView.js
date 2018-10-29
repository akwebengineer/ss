/**
 * A zone view for per interface porotocols selection
 *
 * @author skesarwani@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

 define([
  'backbone',
  'widgets/listBuilder/listBuilderWidget',
  'widgets/form/formWidget'
  ], function (Backbone, ListBuilderWidget, FormWidget) {

      var ZoneProtocolsView = Backbone.View.extend({
      /*events : {
        'click #zone-eachinterface-{}-save'.replace("{}", self.options.type) : 'saveData',
        'click #zone-eachinterface-{}-cancel'replace("{}", self.options.type) : 'closeOverlay'
      },*/
      setCellViewValues : function (rowData) {
        this.originalCellData = rowData.cellData;
        if(this.originalCellData.length === 1 && this.originalCellData[0] === "") {
          this.originalCellData = [];
        }
        this.originalRowData = rowData.originalRowData;
      },
      saveData : function (e) {
        var self = this, /*newRowData,*/ i, l, selections = self.listBuilder.getSelectedItems(), val = {}, 
        isExcept = self.$el.find('#deviceconfig_zone_form_per_interface_isexcept').prop('checked'), servicesList;
        if("system-services" === self.options.type) {
          servicesList = self.options.activity.getNamesFromObject(selections, 'value');
          if(servicesList.length > 1 && -1 < $.inArray('any-service', servicesList)) {
            self.form.showFormError(self.options.activity.context.getMessage("juniper.sd.deviceconfig.zones.any-service.error"));
            return;
          }
        }
        console.log(self.model);
        console.log(selections);
        //newRowData = $.extend(true, {}, self.originalRowData);
        for (i = 0, l = selections.length; i < l; i++) {
          selections[i] = selections[i].value;
        }
        //newRowData['system-services'] = selections;
        val = {
          'columnName' : self.options.columnName,
          'cellData' : selections
        };
        self.options.save(val);
        val = {
          'columnName' : self.options.type + '-isexcept',
          'cellData' : [isExcept]
        };
        self.options.save(val, true);
        self.originalRowData[self.options.type + '-isexcept'] = [isExcept];
        this.closeOverlay(e);
      },
      closeOverlay : function(event) {
        event.preventDefault();
        this.activity.overlay.destroy();
      },
      initialize: function(options) {
        var self = this;
        self.conf = options.conf;
        self.activity = options.activity.activity;
        self.actionEvents = options.actionEvents;
        self.allSystemServices = options.type === "system-services" ? self.activity.allSystemServices : self.activity.allProtocols;
        self.events = { };
        self.events['click #zone-eachinterface-{}-save'.replace("{}", self.options.type)] = 'saveData';
        self.events['click #zone-eachinterface-{}-cancel'.replace("{}", self.options.type)] = 'closeOverlay';
      },

      render: function() {
        var self = this, form, i, l , listBuilderData = {}, container = $(self.el);
        form = new FormWidget({
          "elements" : {
            "title" : "{{title}}",
            "form_id": "sd_device_config_zone_eachinterface_{{type}}_form",
            "form_name": "sd_device_config_zone_eachinterface_{{type}}_form",
            "err_div_id": "errorDivZoneInterfaceSystemServiceDeviceConfig",
            "on_overlay": true,
            "sections": [{
              "section_id": "deviceconfig_zone_eachinterface_form_general_info_section",
              "section_class": "section_class",
              "progressive_disclosure": "expanded",
              "elements" : [{
                "element_checkbox": true,
                "label": "Is Except",
                "id": "deviceconfig_zone_form_per_interface_isexcept",
                "values": [{
                  "name": "isexcept",
                  "label": ""
                }],
                "value":"{{isexcept}}"
              },{
                "element_text": true,
                "id": "eachinterface-{{type}}-list-builder",
                "name" : "eachinterface-{{type}}-list-builder",
                "class": "list-builder"
              }]
            }],
            "buttonsAlignedRight": true,
            "buttonsClass": "buttons_row",
            "cancel_link": {
              "id": "zone-eachinterface-{{type}}-cancel",
              "value": "Cancel"
            },
            "buttons": [
            {
              "id": "zone-eachinterface-{{type}}-save",
              "name": "create",
              "value": "OK"
            }]
          },
          "container" : self.el,
          "values" : {
            "title" : self.options.title,
            "type" : self.options.type
          }
        });
        form.build();
        self.form = form;
        container = self.$el.find("#eachinterface-"+self.options.type+"-list-builder");

        self.$el.find('#deviceconfig_zone_form_per_interface_isexcept').prop('checked', self.originalRowData[self.options.type + '-isexcept'][0]);
        
        listBuilderData ['availableElements'] = [];
        
        self.allSystemServices = $(self.allSystemServices).not(self.originalCellData).get();
        
        for (i = 0, l = self.allSystemServices.length; i < l; ++i) {
          listBuilderData['availableElements'].push({
            "label": self.allSystemServices[i],
            "value": self.allSystemServices[i]
          });
        }
        
        listBuilderData['selectedElements'] = [];
        for (i = 0, l = self.originalCellData.length; i < l; ++i) {
          listBuilderData['selectedElements'].push({
            "label": self.originalCellData[i],
            "value": self.originalCellData[i]
          });
        }
        
        self.listBuilder = new ListBuilderWidget( {
          "list": listBuilderData,
          "container": container
        });
        self.listBuilder.build();
        container.children().attr( 'id', "zone-per-interface-"+self.options.type +"-listbuilder" );
        container.find('.list-builder-widget' ).unwrap( );
        
        self.options.activity.bindExceptCheckboxEvents(self.$el.find("#deviceconfig_zone_form_per_interface_isexcept"), self.listBuilder);
        return this;
      }
  });
  return ZoneProtocolsView;
});

