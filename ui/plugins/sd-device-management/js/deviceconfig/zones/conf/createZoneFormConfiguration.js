
/**
 * Created by skesarwani
 */
 define([],function() {
   var ZoneFormConfiguration = function(context) {

   this.getNamePattern = function(){
        var nameRegex=context.valueObject['name-regex'],pattern,
          nameMinLength=context.valueObject['name-min-length'],
          nameMaxLength=context.valueObject['name-max-length'];
          pattern = nameRegex.substring(0,nameRegex.length-2)+"{"+nameMinLength+","+nameMaxLength+"}"+nameRegex.substring(nameRegex.length-1);
          return pattern;
    }
  this.getDescriptionPattern = function(){
       var descRegex=context.valueObject['description-regex'],pattern,
         descMinLength=context.valueObject['description-min-length'],
         descMaxLength=context.valueObject['description-max-length'];
         pattern = descRegex.substring(0,descRegex.length-2)+"{"+descMinLength+","+descMaxLength+"}"+descRegex.substring(descRegex.length-1);
         return pattern;
   }
    this.getInterfaceInboundTrafficGridConfig = function () {
      return {
        "tableId" : "zones-eachinterface-inbound-traffic-list",
        "numberOfRows" : 10,
        "height" : "auto",
        "width" : "auto",
        "on_overlay": true,
        "multiselect" : "true",
        "parent-data-path" : ['configuration/security/zones/security-zone'],
        "jsonId" : "row-id",
        "contextMenu" : {
        },
        "confirmationDialog" : {
          "delete" : {
            title : 'Warning',
            question : 'Are you sure you want to delete selected record'
          }
        },
        "editRow": {
          "showInline": true
          //"isRowEditable" : function(){return true}
        },
        "columns" : [
        {
          "index" : "name",
          "name" : "name",
          "schema-path" : "name",
            //"label" : context.getMessage('juniper.sd.deviceconfig.zone.grid.column.name'),
            "label" : "Selected Interfaces",
            "width" : "200px"
        },
        {
          "index" : "system-services",
          "name" : "system-services",
          "label" : "System Services",
          "collapseContent": {
            "name": "name",
            "formatCell": $.proxy(this.initerfaceCellRenderer, this),
            "overlaySize": "medium"
          },
          "width" : "150px"
        },
        {
          "index" : "protocols",
          "name" : "protocols",
          "collapseContent": {
            "name": "name",
            "formatCell": $.proxy(this.initerfaceCellRenderer, this),
            "overlaySize": "medium"
          },
          "label" : "Protocols",
          "width" : "150px"
        },
        {
          "index" : "system-services-isexcept",
          "name" : "system-services-isexcept",
          "collapseContent": {
            "name": "name"
          },
          "label" : "Hidden",
          "width" : "10px",
          "hidden" : true
        },
        {
          "index" : "protocols-isexcept",
          "name" : "protocols-isexcept",
          "collapseContent": {
            "name": "name"
          },
          "label" : "Hidden",
          "width" : "10px",
          "hidden" : true
        }]
      };
    };
    this.getValues = function(configMode) {
    var getZonesHelpKey = function ()
    {
        if(configMode.mode == "create"){
        return context.getHelpKey("SECURITY_DEVICES_ZONE_MODIFYING");
        }
        if(configMode.mode == "edit"){
        return context.getHelpKey("SECURITY_DEVICES_ZONE_MODIFYING");
        }
    };
      return {
        "title" : "{{add_edit_form_title}}",
        "title-help": {
            "content": context.getMessage("create_zone_title_help"),
            "ua-help-text":context.getMessage("more_link"),
            "ua-help-identifier": getZonesHelpKey
        },
        "form_id": "sd_device_config_zone_form",
        "form_name": "sd_device_config_zone_form",
        "on_overlay": true,
        "err_div_id": "errorDivZoneDeviceConfig",
        "sections": [{
          "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.general_information"),
          "section_id": "deviceconfig_zone_form_general_info_section",
          "section_class": "section_class",
                    "progressive_disclosure": "expanded", //two possible values: expanded or collapsed
                    "elements": [{
                      "element_text": true,
                      "name": "name",
                      "label": context.getMessage("juniper.sd.deviceconfig.zone.form.name"),
                      "required": true,
                      "schema-path": "name",
                      "parent-path": "configuration/security/zones/security-zone",
                      "id" :"name",
                      "pattern": this.getNamePattern,
                      "value": "{{name}}",
                      "error": context.getMessage("juniper.sd.deviceconfig.zone.form.name.error"),
                      "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.name.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                      }
                    },
                    {
                      "element_textarea": true,
                      "name": "description",
                      "id": "deviceconfig_zone_form_description",
                      "value": "{{description}}",
                      "schema-path": "description",
                      "parent-path": "configuration/security/zones/security-zone",
                      "pattern" : this.getDescriptionPattern,
                      "class" : "{{description-hidden}}",
                      "label": context.getMessage("juniper.sd.deviceconfig.zone.form.description"),
                      "error": "Enter a value between {{description-min-length}} and {{description-max-length}}",
                      "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.description.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                      }
                    },
                    {
                      "element_checkbox": true,
                      "label": context.getMessage("juniper.sd.deviceconfig.zone.form.application_tracking"),
                      "id": "deviceconfig_zone_form_application_tracking",
                      "class" : "{{app-tracking-hidden}}",
                      "values": [{
                        "name": "application-tracking",
                        "label": ""
                      }],
                      "value":"{{application-tracking}}",
                      "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.appTracking.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                      }
                    }]},
                    {
                      "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.interfaces"),
                      "section_id": "deviceconfig_zone_form_interfaces",
                      "section_class": "section_class",
                      "progressive_disclosure": "expanded",
                      "elements": [{
                        "element_text": true,
                        "id": "interfaces-list-builder",
                        "name" : "interfaces-list-builder",
                        "class": "list-builder",
                        "placeholder": context.getMessage('loading')
                      }]
                    },
                    {
                      "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.system_services"),
                      "section_id": "deviceconfig_zone_form_system_services",
                      "section_class": "section_class",
                      "progressive_disclosure": "expanded",
                      "elements": [{
                        "element_checkbox": true,
                        "label": "Is Except",
                        "id": "deviceconfig_zone_form_system_services_isexcept",
                        "values": [{
                          "name": "system-services-isexcept",
                          "label": ""
                        }],
                        "value":"{{zone-system-services-isexcept}}",
                        "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.isExcept.systemServices.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                        }
                      },{
                        "element_text": true,
                        "id": "system-services-list-builder",
                        "name": "system-services-list-builder",
                        "class": "list-builder",
                        "placeholder": context.getMessage('loading')
                      }]
                    },
                    {
                      "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.protocols"),
                      "section_id": "deviceconfig_zone_form_protocols",
                      "section_class": "section_class",
                      "progressive_disclosure": "expanded",
                      "elements": [{
                        "element_checkbox": true,
                        "label": "Is Except",
                        "id": "deviceconfig_zone_form_protocols_isexcept",
                        "values": [{
                          "name": "protocols-isexcept",
                          "label": ""
                        }],
                        "value":"{{zone-system-services-isexcept}}",
                        "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.isExcept.protocols.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                        }
                      },{
                        "element_text": true,
                        "id": "protocols-list-builder",
                        "name": "protocols-list-builder",
                        "class": "list-builder",
                        "placeholder": context.getMessage('loading')
                      }]
                    },
                    {
                      "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.traffic_control_options"),
                      "section_id": "deviceconfig_zone_form_traffic_control",
                      "section_class": "section_class",
                      "progressive_disclosure": "expanded",
                      "elements": [{
                        "element_checkbox": true,
                        "label": context.getMessage("juniper.sd.deviceconfig.zone.form.tcp_rst"),
                        "id": "deviceconfig_zone_form_tcp_rst",
                        "class" : "{{tcp-rst-hidden}}",
                        "values": [{
                          "name": "tcp-rst",
                          "label": ""
                        }],
                        "value":"{{tcp-rst}}",
                        "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.tcpRust.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                        }
                      }, {
                        "element_dropdown": true,
                        "id": "deviceconfig_zone_form_screen",
                        "name": "screen",
                        "class" : "{{screen-hidden}}",
                        "label": context.getMessage("juniper.sd.deviceconfig.zone.form.screen"),
                        "field-help": {
                          "content": context.getMessage("juniper.sd.deviceconfig.zone.form.screen.field_help"),
                          "ua-help-identifier": "utm_web_filtering_safe_search_tooltip"
                        }
                      }]
                    },
                    {
                      "heading": context.getMessage("juniper.sd.deviceconfig.zone.form.interface_services_protocols"),
                      "section_id": "deviceconfig_zone_form_interface_inbound_traffic_container_section_id",
                      "section_class": "section_class",
                      "progressive_disclosure": "expanded",
                      "elements": [{
                        "element_description": true,
                        "id": "deviceconfig_zone_form_interface_inbound_traffic_container",
                        "name": "deviceconfig_zone_form_interface_inbound_traffic_container"
                      }]
                    }],
                    "buttonsAlignedRight": true,
                    "buttonsClass": "buttons_row",
                    "cancel_link": {
                      "id": "device-config-zone-form-cancel",
                      "value": context.getMessage('cancel_button_label')
                    },
                    "buttons": [
                    {
                      "id": "device-config-zone-form-save",
                      "name": "create",
                      "value": context.getMessage('ok_button_label')
                    }]
                  };
                };
              };

            return ZoneFormConfiguration;
          });


