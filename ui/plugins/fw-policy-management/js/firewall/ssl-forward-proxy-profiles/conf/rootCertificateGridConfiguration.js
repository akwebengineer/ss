/**
 * A configuration object with the parameters required to build
 * a grid for sslForwardProxyProfile
 *
 * @module sslForwardProxyProfileGridConfiguration
 * @author nadeem@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */

define(['../../../../../ui-common/js/common/utils/SmUtil.js'
], function (SmUtil) {

    var smUtil = new SmUtil(),Configuration = function(context) {

            /**
             * handle Rootcertificate for ssl edit mode
             * 
             * @param  {cell}
             * @param  {cellValue}
             * @param  {options}
             * @param  {rowObject}
             * @return {string} root certificate
             */
           var formatRootCertificate = function(cell, cellValue, options, rowObject){
                // cell will have value while edit mode data load 
                return smUtil.columnCellToolTipFormater(cell || options['root-certificate'] || "");
            },
            columns = [{
                    "index": "security-device-id",
                    "name": "security-device-id",
                    "hidden": true
                },
                {
                    "index": "security-device-name",
                    "name": "security-device-name",
                    "label": context.getMessage("ssl_rootcertificate_column_device"),
                    "width": 180,
                    "sortable": false,
                    "collapseContent":{
                        "name": "name"
                    }
                },
                {
                    "index": "trusted-cas.trusted-ca",
                    "name": "trusted-cas.trusted-ca",
                    "label": context.getMessage("ssl_rootcertificate_column_trusted_cs"),
                    "width": 225,
                    "sortable": false,
                    "collapseContent":{
                        "name": "name"
                    }
                },
                {
                    "index": "root_certificate",
                    "name": "root_certificate",
                    "label": context.getMessage("ssl_rootcertificate_column_root_certificate"),
                    "width": 190,
                    "sortable": false,
                    "formatter": formatRootCertificate,
                    "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        }

                }
            ];

        this.getValues = function(option) {
            return {

                "tableId": "sslForwardProxyProfiles1RootCertificate",
                "height": "100px",
                "repeatItems": "false",
                "multiselect": "true",
                "scroll": true,
                "jsonId": "slipstreamGridWidgetRowId",
                "numberOfRows":12,
                "createRow": {
                   "addLast":true
                },
                "contextMenu": {
                    "edit": context.getMessage('ssl_rootcertificate_grid_edit'),
                    "delete": context.getMessage('ssl_rootcertificate_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("sslForwardProxyProfile_grid_confDialogue_delete_title"),
                        question: context.getMessage("ssl_root_certificate_delete_msg")
                    }
                },
                "columns": columns
            }
        };

        this.getViewValues = function(option){
            return {
                "tableId": "sslForwardProxyProfiles1RootCertificate_view",
                "numberOfRows": 12,
                "height": "100px",
                "repeatItems": "true",
                "scroll": true,
                "jsonId": "id",
                "columns": columns
            }
        }
    };

    return Configuration;
});
