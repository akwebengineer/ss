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
    '../../../../../ui-common/js/common/gridConfigurationConstants.js',
    '../../constants/userFirewallConstants.js'
], function( RestApiConstants, GridConfigurationConstants, UserFirewallConstants) {


    var Configuration = function(context) {



        this.formatAddressCell = function (cell, cellValue, options, rowObject) {

            if(cellValue && cellValue.length > 0){
                var servers = cellValue;
                $(cell[0]).find('.cellContentValue .cellItem').html(servers[0].address);
                servers.forEach( function( address, index ) {
                    if($(cell[1]).find('.cellContentWrapper .cellContentValue')[index]){
                        $(cell[1]).find('.cellContentWrapper .cellContentValue')[index].innerHTML = address;
                    }
                });

            }
            return cell;
        };

        this.formatAddress = function( cellValue, options, rowObject ) {

            var valueList = [], servers;
            if(!cellValue || cellValue.length == 0){
                return "";
            }

            if(!_.isArray(cellValue)){
                servers = {"address":cellValue["address"]};
                cellValue = []
                cellValue.push(servers);
            }

            cellValue.forEach( function( ldpaServer ) {
                valueList.push(ldpaServer["address"]);
            } );

            return valueList;
        };
        this.formatDevices = function( cellValue, options, rowObject ) {

            var valueList = [],servers;
            if(!cellValue || cellValue.length === 0){
                return "";
            }

            if(!_.isArray(cellValue)){
                servers = {"name":cellValue["name"]};
                cellValue = []
                cellValue.push(servers);
            }

            cellValue.forEach( function( device ) {
                valueList.push(device["name"]);
            } );

            return valueList;
        };
        this.formatDevicesCell = function (cell, cellValue, options, rowObject) {

            if(cellValue && cellValue.length > 0){

                $(cell[0]).find('.cellContentValue .cellItem').html(cellValue[0].name);
                cellValue.forEach( function( value, index ) {
                    if($(cell[1]).find('.cellContentWrapper .cellContentValue')[index]){
                        $(cell[1]).find('.cellContentWrapper .cellContentValue')[index].innerHTML = value;
                    }
                });

            }
            return cell;
        };

        this.getValues = function() {

            return {
                "title": context.getMessage('access_profile_title'),
                "title-help": {
                    "content": context.getMessage('access_profile_title_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding",
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("ABOUT_THE_ACCESS_PROFILE_PAGE")
                },
                "tableId": "access_profile_ilp",
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "height": "500px",
                "sortName": "name",
                "sortOrder": "asc",
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": UserFirewallConstants.ACCESS_PROFILE.URL_PATH,
                "jsonRoot": UserFirewallConstants.ACCESS_PROFILE.JSON_ROOT,
                "jsonRecords": function(data) {
                    return data[UserFirewallConstants.ACCESS_PROFILE.JSON_ROOT1][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": UserFirewallConstants.ACCESS_PROFILE.ACCEPT
                    }
                },
                "filter": {
                    searchUrl : true,
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
                            "key": "deleteAPEvent",
                            "disabledStatus": true,
                            "secondary": true
                        }
                    ]
                },
                "contextMenu": {
                    "edit": context.getMessage('access_profile_title_edit'),
                    "custom":[{
                        "label":context.getMessage('access_profile_title_delete'),
                        "key":"deleteAPEvent",
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

                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("access_profile_delete_title"),
                        question: context.getMessage("access_profile_delete_message")
                    }
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
                        "label": context.getMessage('grid_column_name'),
                        "searchCell": true
                    },
                    {
                        "index": "authentication-order1",
                        "name": "authentication-order1",
                        "label": context.getMessage('access_profile_authentication_order1'),
                        "searchCell": {
                            "type": 'dropdown',
                            "values": [
                                {
                                    "label" : "NONE",
                                    "value" : "NONE"
                                },
                                {
                                    "label" : "LDAP",
                                    "value" : "LDAP"
                                },
                                {
                                    "label" : "RADIUS",
                                    "value" : "RADIUS"
                                },
                                {
                                    "label" : "SECURID",
                                    "value" : "SECURID"
                                },
                                {
                                    "label" : "PASSWORD",
                                    "value" : "PASSWORD"
                                }
                            ]
                        }
                    },
                    {
                        "index": "authentication-order2",
                        "name": "authentication-order2",
                        "label": context.getMessage('access_profile_authentication_order2'),
                        "searchCell": {
                            "type": 'dropdown',
                            "values": [
                                {
                                    "label" : "NONE",
                                    "value" : "NONE"
                                },
                                {
                                    "label" : "LDAP",
                                    "value" : "LDAP"
                                },
                                {
                                    "label" : "RADIUS",
                                    "value" : "RADIUS"
                                },
                                {
                                    "label" : "SECURID",
                                    "value" : "SECURID"
                                },
                                {
                                    "label" : "PASSWORD",
                                    "value" : "PASSWORD"
                                }
                            ]
                        }
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description')
                    },
                    {
                        "index": "ldap-servers",
                        "name": "ldap-servers.ldap-server",
                        "label": context.getMessage('access_profile_ldap_server_address'),
                        "collapseContent":{
                            "formatData": this.formatAddress,
                            "formatCell": this.formatAddressCell
                        }
                    },
                    {
                        "index": "baseDN",
                        "name": "ldap-options.base-dn",
                        "label": context.getMessage('access_profile_options_base_distinguished_name'),
                        "searchCell": true
                    },
                    {
                        "index": "device-list",
                        "name": "device-list.device-lite",
                        "label": context.getMessage('grid_column_devices'),
                        "collapseContent":{
                            "formatData": this.formatDevices,
                            "formatCell": this.formatDevicesCell
                        }
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                       // "searchCell": true,  //comain column filter is not supported
                        "label": context.getMessage('grid_column_domain')
                    }
                ]
            }
        }
    };

    return Configuration;
});