/**
 * Module that implements the vpnImportIntroPageView.
 * @module vpnImportCustomSummaryResultViewPage
 * @author Anuran <Anuran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
/*
summaries.push({"label":self.context.getMessage("import_vpn_pass_vpns"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-vpns"]).toString()});
summaries.push({"label":self.context.getMessage("import_vpn_device_pass"),"value": JSON.parse(response["vpn-import-summary-response"]["pass-devices"]).toString()});
summaries.push({"label":self.context.getMessage("import_vpn_passed_vpn_endpoints"),"value": JSON.parse(response["vpn-import-summary-response"]["passed-vpn-endpoints"]).toString()});
*/
define([], function () {
    var summaryResultDetailsFormConfiguration = function (context) {

        this.getValues = function (options) {
         var self = this;
            return {
                //"title": "Test",//context.getMessage("ipsec_vpns_endpoint_ike_address_settings"),
                "form_id": "summary_result_details_form",
                "form_name": "ummary_result_details_form",
                "sections": [
                    {
                        "section_id": "cellEditor",
                        "section_class": "section_class",
                        "elements": [
                                {
                                    "element_description": true,
                                    "id": "pass_vpns",
                                    "label": context.getMessage("import_vpn_pass_vpns"),
                                    "value": options[0].value
                                },
                                {
                                    "element_description": true,
                                    "id": "pass_devices",
                                    "label": context.getMessage("import_vpn_device_pass"),
                                    "value": options[1].value
                                },{
                                    "element_description": true,
                                    "id": "pass_endpoints",
                                    "label": context.getMessage("import_vpn_passed_vpn_endpoints"),
                                    "value": options[2].value
                                }
                        ]
                    }
                ]
            }
        };
    };

    return summaryResultDetailsFormConfiguration;

});
