/**
 * A configuration object with the parameters required to build
 * a grid for user firewall active directory
 *
 * @module userfirewallActiveDIrectory
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
        '../../../../../ui-common/js/common/restApiConstants.js',
        '../../../../../ui-common/js/common/gridConfigurationConstants.js',
        '../../constants/userFirewallConstants.js'
    ], function (RestApiConstants, GridConfigurationConstants, UserFirewallConstants) {

        var Configuration = function (context) {

            /**
             *
             * @param cellValue
             * @param options
             * @param rowObject
             * @returns {*}
             */
            this.format = function( cellValue, options, rowObject ) {

                var valueList = [],servers;
                if(!cellValue || cellValue.length === 0){
                    return "";
                }

                if(!_.isArray(cellValue)){
                    if(cellValue['name']){
                        servers = {"name":cellValue["name" ]};
                    } else if(cellValue["domain-name"]){
                        servers = {"domain-name":cellValue["domain-name" ]};
                    }
                    cellValue = []
                    cellValue.push(servers);
                }

                cellValue.forEach( function( device ) {
                    valueList.push(device["name"] || device["domain-name"]);
                } );

                return valueList;
            };
            /**
             *
             * @param cell
             * @param cellValue
             * @param options
             * @param rowObject
             * @returns {*}
             */
            this.formatCell = function (cell, cellValue, options, rowObject) {

                if(cellValue && cellValue.length > 0){

                    var cellContentValue = $(cell[1]).find('.cellContentWrapper .cellContentValue');
                    cellValue.forEach( function( value, index ) {
                        if(cellContentValue[index]){
                            cellContentValue[index].innerHTML = value;
                        }
                    });

                }
                return cell;
            };

            /**
             * Returns configuration values
             */
            this.getValues = function () {
                var self = this;
                return {
                    "title": context.getMessage('active_directory_grid_title'),
                    "title-help": {
                        "content": context.getMessage('active_directory_grid_tooltip'),
                        "ua-help-identifier": "alias_for_ua_event_binding",
                        "ua-help-text": context.getMessage('more_link'),
                        "ua-help-identifier": context.getHelpKey("ABOUT_THE_ACTIVE_DIRECTORY_PROFILE_PAGE")
                    },
                    "tableId": "active-directory-ilp",
                    "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                    "height": "500px",
                    "sortName": "name",
                    "sortOrder": "asc",
                    "repeatItems": "true",
                    "multiselect": "true",
                    "scroll": true,
                    "url": UserFirewallConstants.ACTIVE_DIRECTORY.URL_PATH,
                    "jsonRoot": UserFirewallConstants.ACTIVE_DIRECTORY.GRID_JSON_ROOT,
                    "jsonRecords": function (data) {
                        return data['active-directories'][RestApiConstants.TOTAL_PROPERTY];
                    },
                    "confirmationDialog": {
                        "delete": {
                            title: context.getMessage('active_directory_delete_title'),
                            question: context.getMessage('active_directory_delete_msg')
                        }
                    },
                    "ajaxOptions": {
                        "headers": {
                            "Accept": UserFirewallConstants.ACTIVE_DIRECTORY.ACCEPT_HEADER
                        }
                    },
                    "contextMenu": {
                        "edit": context.getMessage('active_directory_grid_edit'),
                        "custom":[{
                            "label":context.getMessage('active_directory_grid_delete'),
                            "key":"deleteADEvent",
                            "isDisabled": function(eventName, selectedRows) {
                                for (var i=0; i<selectedRows.length; i++) {
                                    var domainID = selectedRows[i]['domain-id'];
                                    if (domainID && Juniper.sm.DomainProvider.isNotCurrentDomain(parseInt(domainID))) {
                                        return true;
                                    }
                                }
                                return selectedRows.length===0;
                            }
                        }]
                    },

                    "filter": {
                        searchUrl: true,
                        optionMenu: {
                            "showHideColumnsItem": {},
                            "customItems": []
                        },
                        columnFilter: true
                    },
                    "actionButtons": {
                        "customButtons": [
                            {
                                "button_type": true,
                                "label": context.getMessage("deploy_context_menu_title"),
                                "key": "deployEvent",
                                "disabledStatus": true,
                                "secondary": true
                            },
                            {
                                "button_type": true,
                                "label": context.getMessage("action_delete"),
                                "key": "deleteADEvent",
                                "disabledStatus": true,
                                "secondary": true
                            }

                        ]
                    },
                    "columns": [
                        {
                            "index": "id",
                            "name": "id",
                            "hidden": true
                        },
                        {
                            "index": "domain-id",
                            "name": "domain-id",
                            "hidden": true
                        },
                        {
                            "index": "name",
                            "name": "name",
                            "searchCell": true,
                            sortable: true,
                            "label": context.getMessage('grid_column_name')
                        },
                        {
                            "index": "description",
                            "name": "description",
                            "searchCell": false,
                            sortable: false,
                            "label": context.getMessage('grid_column_description'),
                            "width": 200
                        },
                        {
                            "index": "domain-name",
                            "name": "domain-name",
                            "searchCell": false,
                            sortable: true,
                            "label": context.getMessage('grid_column_domain')
                        },
                        {
                            "index": "device",
                            "name": "devices.device",
                            "label": context.getMessage('grid_column_devices'),
                            "collapseContent":{
                                "formatData": this.format,
                                "formatCell": this.formatCell
                            }
                        },
                        {
                            "index": "domains",
                            "name": "domains.domain",
                            sortable: false,
                            "label": context.getMessage('active_directory_domains'),
                            "collapseContent":{
                                "formatData": this.format,
                                "formatCell": this.formatCell
                            }
                        }

                    ]
                }
            }
        };

        return Configuration;
    }
)
;
