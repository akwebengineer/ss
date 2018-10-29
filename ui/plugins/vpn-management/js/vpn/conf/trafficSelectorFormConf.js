/**
 * A form configuration object with the common parameters required to build traffic selector editor for
 * modify vpn tunnel endpoints.
 *
 * @module trafficSelectorFormConfiguration
 * @author Venkata Swaroop <vswaroop@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([], function () {

    var ipPattern = "^("
                      + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])"
                      + "|"
                      + "(([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])\\.){3}([0-1]?\\d\\d?|2[0-4]\\d|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))"
                      + ")$";


    var trafficSelectorFormConfiguration = function (context) {

        this.getValues = function () {
            return {
                "title": context.getMessage("ipsec_vpns_tunnels_column_traffic_selector_settings"),
                "form_id": "edit_trafficSelector_form",
                "form_name": "edit_trafficSelector_form",
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_tunnels_column_traffic_selector_title_help"),
                    "ua-help-identifier": "alias_for_title_edit_traffic_selector"
                },
                "err_div_id": "errorDiv",
                "err_div_message": "form_error",
                "err_div_link_text": "none",
                "err_timeout": "1000",
                "valid_timeout": "5000",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                             {
                                 "element_text": true,
                                 "id": "name",
                                 "name": "name",
                                 "label": context.getMessage("ipsec_vpns_tunnels_column_ts_name"),
                                 "error": context.getMessage("ipsec_vpns_tunnels_form_entry_name_error"),
                                 "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                                 "value": "{{name}}",
                                 "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector_name_field_help")
                                 }
                             },
                             {
                                "element_text": true,
                                "id": "local-ip",
                                "name": "local-ip",
                                "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_local_proxy"),
                                "value": "{{local-ip}}",
                                "error": context.getMessage("ipsec_vpns_tunnels_form_entry_ip_address_error"),
                                "pattern": ipPattern,
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector_local_field_help")
                                }
                             },
                             {
                                "element_text": true,
                                "id": "remote-ip",
                                "name": "remote-ip",
                                "label": context.getMessage("ipsec_vpns_modify_tunnel_endpoints_remote_proxy"),
                                "value": "{{remote-ip}}",
                                "error": context.getMessage("ipsec_vpns_tunnels_form_entry_ip_address_error"),
                                "pattern": ipPattern,
                                "field-help": {
                                   "content" : context.getMessage("ipsec_vpns_tunnels_column_traffic_selector_remote_field_help")
                                },
                                "inlineButtons":[{
                                    "id": "gridAddRow",
                                    "class": "input_button",
                                    "name": "input_button",
                                    "value": "Add"

                                }]
                             } ]
                    },{
                          "section_id": "trafficSelector-grid",
                          "elements": [
                              {
                                  "element_text": true,
                                  "id": "traffic-selector-grid",
                                  "name": "traffic-selector-grid",
                                  "label": "",
                                  "class": "traffic-selector-grid"
                              }
                          ]
                      }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "btnOk",
                        "name": "btnOk",
                        "value": context.getMessage("ok")
                    }
                ],
                "cancel_link": {
                    "id": "linkCancel",
                    "value": context.getMessage("cancel")
                }
            }
        };
    };

    return trafficSelectorFormConfiguration;

});
