/**
 * A configuration object with the parameters required to build
 * a grid for Access Profile
 *
 * @module AccessProfileGridConfiguration
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    '../../../../../ui-common/js/common/restApiConstants.js',
    '../../../../../ui-common/js/common/gridConfigurationConstants.js'
], function( RestApiConstants, GridConfigurationConstants) {
    /**
     *
     * @param context
     * @constructor
     */
    var Configuration = function(context) {
        /**
         * used for show hide columns filter
         * @param columnSelection
         * @returns {*}
         */
        this.setShowHideColumnSelection= function (columnSelection){
            return columnSelection;
        };
        /**
         *
         */
        this.intigerFormatter = function(cellValue, options, rowObject){
            if(cellValue === 0){
                return "";
            }
            return cellValue;
        }
        /**
         *
         * @returns {grid conf}
         */
        this.getValues = function() {

            return {
                "tableId": "access_profile_ldpa_server",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "150px",
                "repeatItems": "true",
                "multiselect": "true",
                "jsonId": "slipstreamGridWidgetRowId",
                "scroll": true,
                "contextMenu": {
                    "edit": context.getMessage('access_profile_edit_ldap_server'),
                    "delete": context.getMessage('access_profile_delete_ldap_server')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("access_profile_delete_ldap_server"),
                        question: context.getMessage("access_profile_delete_ldap_server_message")
                    }
                },
                "filter": {
                    optionMenu: {
                        "showHideColumnsItem": {
                            "setColumnSelection": this.setShowHideColumnSelection
                        },
                        "customItems":[]
                    }
                },
                "columns": [
                    {
                        "index": "address",
                        "name": "address",
                        "label": context.getMessage('access_profile_address')
                    },
                    {
                        "index": "port",
                        "name": "port",
                        "label": context.getMessage('access_profile_port'),
                        'formatter': this.intigerFormatter,
                        'unformat': this.intigerFormatter
                    },
                    {
                        "index": "retry",
                        "name": "retry",
                        "label": context.getMessage('access_profile_retry'),
                        'formatter': this.intigerFormatter,
                        'unformat': this.intigerFormatter
                    },
                    {
                        "index": "routing-instance",
                        "name": "routing-instance",
                        "label": context.getMessage('access_profile_routing_instance')
                    },
                    {
                        "index": "src-address",
                        "name": "src-address",
                        "label": context.getMessage('access_profile_source_address')
                    },
                    {
                        "index": "time-out",
                        "name": "time-out",
                        "label": context.getMessage('access_profile_timeout'),
                        'formatter': this.intigerFormatter,
                        'unformat': this.intigerFormatter
                    }
                ]
            }
        }
    };

    return Configuration;
});