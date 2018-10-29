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
         * used to format domain controller ip address
         * @param cellValue
         * @param options
         * @param rowObject
         * @returns {*}
         */
        this.formatDomain = function( cellValue, options, rowObject ) {

            var valueList = [],ipAddress;
            if(!cellValue || cellValue.length === 0){
                return "";
            }

            if(!_.isArray(cellValue)){
                if(cellValue["domain-controller-ip-address"]){
                    ipAddress = {"domain-controller-ip-address":cellValue["domain-controller-ip-address"]};
                } else if(cellValue["user-grp-ip-address"]){
                    ipAddress = {"user-grp-ip-address":cellValue["user-grp-ip-address"]};
                }

                cellValue = []
                cellValue.push(ipAddress);
            }

            cellValue.forEach( function( device ) {
                if(device["domain-controller-ip-address"]){
                    valueList.push(device["domain-controller-ip-address"]);
                } else if(device["user-grp-ip-address"]){
                    valueList.push(device["user-grp-ip-address"]);
                }
            } );

            return valueList;
        };
        /**
         * used to format domain controller ip address
         * @param cell
         * @param cellValue
         * @param options
         * @param rowObject
         * @returns {*}
         */
        this.formatDomainCells = function (cell, cellValue, options, rowObject) {

            if(cellValue && cellValue.length > 0){
                var celVal = $(cell[1]).find('.cellContentWrapper .cellContentValue');
                cellValue.forEach( function( value, index ) {
                    if(value.labe && celVal[index]){
                        celVal[index].innerHTML = value;
                    }
                });

            }
            return cell;
        };
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
                    "edit": context.getMessage('active_directory_edit_domain_settings'),
                    "delete": context.getMessage('active_directory_delete_domain_settings')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("active_directory_delete_domain_settings"),
                        question: context.getMessage("active_directory_delete_domain_settings_message")
                    }
                },
                "columns": [
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('active_directory_grid_column_domainName')
                    },
                    {
                        "index": "domain-controllers",
                        "name": "domain-controllers.domain-controller",
                        "label": context.getMessage('active_directory_domain_contorller_ip'),
                        "collapseContent":{
                            "formatData": this.formatDomain,
                            "formatCell": this.formatDomainCells
                        }
                    },
                    {
                        "index": "ldap-addresses",
                        "name": "ldap-addresses.ldap-address",
                        "label": context.getMessage('active_directory_user_group_mapping'),
                        "collapseContent":{
                            "formatData": this.formatDomain,
                            "formatCell": this.formatDomainCells
                        }

                    }
                ]
            }
        }
    };

    return Configuration;
});