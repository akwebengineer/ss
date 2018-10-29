/**
 * A configuration object with the parameters required to build 
 * a grid for protocols
 *
 * @module serviceDetailFormProtocolGridConfiguration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
        './protocolTypes.js',
        'text!../../../../sd-common/js/templates/serviceProtocolDetail.html',
        '../../../../ui-common/js/common/gridConfigurationConstants.js'
], function (protocolTypes, detailTemplate, GridConfigurationConstants) {
    var Configuration = function(context) {

        var protocolTypeFormatter = function(cellValue) {
            for (var i=0; i<protocolTypes.length; i++) {
                if (protocolTypes[i].value === cellValue) {
                    return protocolTypes[i].label;
                }
            }

            return cellValue;
        };

        var detailFormatter = function(cellValue, options, rowObject) {
            var detailData = [];

            // Protocol Number
            if (rowObject["protocol-type"] == "PROTOCOL_OTHER" && (rowObject["protocol-number"] || rowObject["protocol-number"] === 0)) {
                detailData.push({
                    label: context.getMessage("application_protocol_form_protocol_number"),
                    value: rowObject["protocol-number"]
                });
            }
            // ALG
            if (rowObject.alg) {
                detailData.push({
                    label: context.getMessage("application_protocol_form_alg"),
                    value:  rowObject.alg
                });
            }
            // RPC Program Number
            if (rowObject["protocol-type"] == "PROTOCOL_SUN_RPC" && (rowObject["rpc-program-number"] || rowObject["rpc-program-number"] === 0)) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_sun_rpc_number'),
                    value: rowObject["rpc-program-number"]
                });
            }
            // UUID
            if (rowObject.uuid) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_ms_rpc_uuid'),
                    value: rowObject.uuid
                });
            }
            // Source Port
            if (rowObject["src-port"] || rowObject["src-port"] === 0) {
                detailData.push({
                    label: context.getMessage('application_protocol_grid_cell_detail_source_port'),
                    value: rowObject["src-port"]
                });
            }
            // Destination Port
            if (rowObject["dst-port"] || rowObject["dst-port"] === 0) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_destination_port'),
                    value: rowObject["dst-port"]
                });
            }
            // ICMP Type
            if (rowObject["icmp-type"]) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_icmp_type'),
                    value: rowObject["icmp-type"]
                });
            }
            // ICMP Code
            if (rowObject["icmp-code"]) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_icmp_code'),
                    value: rowObject["icmp-code"]
                });
            }
            // SUN-RPC Protocol Type
            if (rowObject["protocol-type"] == "PROTOCOL_SUN_RPC" && rowObject["sunrpc-protocol-type"]) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_rpc_protocol_type'),
                    value: rowObject["sunrpc-protocol-type"]
                });
            }
            // MS-RPC Protocol Type
            if (rowObject["protocol-type"] == "PROTOCOL_MS_RPC" && rowObject["msrpc-protocol-type"]) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_rpc_protocol_type'),
                    value: rowObject["msrpc-protocol-type"]
                });
            }
            // Inactivity Timeout
            if (rowObject["disable-timeout"]) {
                detailData.push({
                    label: context.getMessage('application_protocol_form_inactivity_timeout'),
                    value: context.getMessage('application_protocol_grid_cell_detail_disable_inactivity_timeout')
                });
            } else if (rowObject["inactivity-timeout"] && rowObject["inactivity-timeout"] !== "0") {
                detailData.push({
                    label: context.getMessage('application_protocol_form_inactivity_timeout'),
                    value: rowObject["inactivity-timeout"]
                });
            }

            // Render template
            return Slipstream.SDK.Renderer.render(detailTemplate, {detail: detailData});
        };

        this.getValues = function() {

            return {
                "tableId": "service-protocols",
                "numberOfRows": GridConfigurationConstants.OVERLAY_PAGE_SIZE,
                "height": "200px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 90
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 100
                    },
                    {
                        "index": "protocol-type",
                        "name": "protocol-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 90,
                        "formatter": protocolTypeFormatter
                    },
                    {
                        "index": "detail",
                        "name": "detail",
                        "label": context.getMessage('application_protocol_grid_column_detail'),
                        "width": 250,
                        "formatter": detailFormatter
                    }
                ]
            };
        };
    };

    return Configuration;
});
