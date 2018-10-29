/**
 * IPSEC VPNs Grid configuration.
 *
 * @module IpsecVpnsGridConf
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    '../../../../ui-common/js/common/restApiConstants.js',
    '../../../../sd-common/js/publish/constants/publishConstants.js'
], function (RestApiConstants, PublishConstants) {

    var Configuration = function(context) {

        this.getValues = function() {

            formatTypeCell = function (cellValue, options, rowObject) {
                if (rowObject['type'] == "SITE_TO_SITE")
                    cellValue = context.getMessage("ipsec_vpns_type_site_to_site");
                if (rowObject['type'] ==  "HUB_N_SPOKE")
                    cellValue = context.getMessage("ipsec_vpns_type_hub_and_spoke");
                if (rowObject['type']  ==  "FULL_MESH")
                    cellValue = context.getMessage("ipsec_vpns_type_full_mesh");
                return cellValue;
            };

            formatPolicyStateCell = function (cellValue, options, rowObject) {
                if (rowObject['policy-state'] == "DRAFT")
                    cellValue = context.getMessage("ipsec_vpns_policy_state_draft");
                if (rowObject['policy-state'] ==  "FINAL")
                    cellValue = context.getMessage("ipsec_vpns_policy_state_final");
                return cellValue;
            };

            formatPublishStateCell = function (cellValue, options, rowObject) {
                var cellValue = '', state;
                // get the state
                state = rowObject['publish-state'];

                // return the formatted value
                cellValue = context.getMessage(PublishConstants.PUBLISH_STATE[state]);

                return cellValue;
            };

            formatTunnelStateCell = function (cellValue, options, rowObject) {
                if (rowObject['vpn-tunnel-mode-types'] == "POLICY_BASED")
                    cellValue = context.getMessage("ipsec_vpns_tunnel_type_policy_based");
                if (rowObject['vpn-tunnel-mode-types'] ==  "ROUTE_BASED")
                    cellValue = context.getMessage("ipsec_vpns_tunnel_type_route_based");
                return cellValue;
            };

            formatAdvpnStateCell = function (cellValue, options, rowObject) {
                if (rowObject['type'] == "SITE_TO_SITE")
                    cellValue = context.getMessage("ipsec_vpns_advpn_not_applicable");
                if (rowObject['type'] == "FULL_MESH")
                    cellValue = context.getMessage("ipsec_vpns_advpn_not_applicable");
                if (rowObject['type'] == "HUB_N_SPOKE") {
                       if (rowObject['advpn'] == true)
                         cellValue = context.getMessage("ipsec_vpns_advpn_enable");
                       if (rowObject['advpn'] == false)
                         cellValue = context.getMessage("ipsec_vpns_advpn_disable");
                  }
                return cellValue;
            };

            formatAutoVpnStateCell = function (cellValue, options, rowObject) {
                if (rowObject['type'] == "SITE_TO_SITE")
                    cellValue = context.getMessage("ipsec_vpns_advpn_not_applicable");
                if (rowObject['type'] ==  "FULL_MESH")
                    cellValue = context.getMessage("ipsec_vpns_advpn_not_applicable");
                if (rowObject['type'] == "HUB_N_SPOKE") {
                     if (rowObject['auto-vpn'] ==  true)
                         cellValue = context.getMessage("ipsec_vpns_advpn_enable");
                     if (rowObject['auto-vpn'] ==  false)
                         cellValue = context.getMessage("ipsec_vpns_advpn_disable");
                 }
                return cellValue;
            };

            setCustomActionStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
                updateStatusSuccess({
                    "publishEvent": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "updatePolicyEvent": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "viewTunnelEvent": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "edit": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "delete": selectedRows.numberOfSelectedRows == 1 ? true : false
                });
            };

            /**
             * Sets the dropdown for publish state column filter
             * @returns {Array} Filter options
             */
            publishSearchData = function(){
                var publishSearchValues = [], key, value;

                for (key in PublishConstants.PUBLISH_STATE) {

                    if (PublishConstants.PUBLISH_STATE.hasOwnProperty(key) && key !== 'DELETED') {
                        value = context.getMessage(PublishConstants.PUBLISH_STATE[key]);
                        publishSearchValues.push({
                            'label': value,
                            'value': value
                        });
                    }
                }
                return publishSearchValues;
            };

            return {
                "url": "/api/juniper/sd/vpn-management/ipsec-vpns",
                "title": context.getMessage("ipsec_vpns_grid_title_main"),
                "title-help": {
                    "content": context.getMessage("ipsec_vpns_grid_tooltip"),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("VPN_IPSEC_CREATING")
                },
                "jsonRoot": "ipsec-vpns.ipsec-vpn",
                "height": "500px",
                "numberOfRows": 20,
                "scroll": true,
                "jsonRecords": function(data) {
                    return data['ipsec-vpns'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.ipsec-vpns+json;version=2'
                    }
                },
                "jsonId": "id",
                "tableId": "ipsecVpns",
                "multiselect": "true",
                "contextMenu": {
                    "custom": [
                        {
                            "label": context.getMessage("action_import_vpn"),
                            "key": "importEvent"
                        },
                        {
                            "label": context.getMessage("ipsec_vpns_view_tunnels"),
                            "key": "viewTunnelEvent"
                        }

                    ],
                    "edit": context.getMessage("action_modify_vpn"),
                    "delete": context.getMessage("ipsec_vpns_delete")
                },
                "contextMenuItemStatus": function(key, isItemDisabled, selectedRows) {
                    if (key == "edit" || key == "delete" || key == "viewTunnelEvent")
                    {
                        if (selectedRows.length !== 1)
                        {
                            return true;
                        }
                    }
                },
                "filter": {
                    searchUrl: true,
                    /*searchUrl: function (value, url){
                        return url + "&search="+ value;
                    },*/
                  columnFilter: true,
                },
                "actionButtons":{
                    "customButtons":[{
                        "button_type": true,
                        "label": context.getMessage("publish_context_menu_title"),
                        "key": "publishEvent",
                        "disabledStatus": true,
                        "secondary": true
                    },
                    {
                        "button_type": true,
                        "label": context.getMessage("update_context_menu_title"),
                        "key": "updatePolicyEvent",
                        "disabledStatus": true,
                        "secondary": true
                    }],
                    "actionStatusCallback": setCustomActionStatus
                 },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_id"),
                        "hidden": true,
                        "width": 50
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_name"),
                        "width": 150,
                        "searchCell": true,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_description"),
                        "width": 200,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_type"),
                        "width": 120,
                        "searchCell": {
                                 "type": 'dropdown',
                                 "values":[{
                                     "label": context.getMessage("ipsec_vpns_type_site_to_site"),
                                     "value": context.getMessage("ipsec_vpns_type_site_to_site")
                                 },{
                                     "label": context.getMessage("ipsec_vpns_type_hub_and_spoke"),
                                     "value": context.getMessage("ipsec_vpns_type_hub_and_spoke")
                                 },{
                                     "label": context.getMessage("ipsec_vpns_type_full_mesh"),
                                     "value": context.getMessage("ipsec_vpns_type_full_mesh")
                                 }]
                        },
                        "editCell": {
                            "type": "input"
                        },
                        "formatter": formatTypeCell
                    },
                    {
                        "index": "profile",
                        "name": "profile.name",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_profile-name"),
                        "width": 150,
                        //  "searchCell": true,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                       "index": "vpn-tunnel-mode-types",
                         "name": "vpn-tunnel-mode-types",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_vpn-tunnel-mode-types"),
                        "width": 150,
                         "formatter": formatTunnelStateCell,
                        "editCell": {
                          "type": "input"
                         }
                    },
                    {
                        "index": "advpn",
                        "name": "advpn",
                        "label": "ADVPN",
                        "width": 90,
                        "formatter": formatAdvpnStateCell,
                        "sortable": false,
                        "searchCell": {
                                 "type": 'dropdown',
                                 "values":[{
                                     "label": context.getMessage("ipsec_vpns_advpn_enable"),
                                     "value": true
                                 },{
                                     "label": context.getMessage("ipsec_vpns_advpn_disable"),
                                     "value": false
                                 }]
                        }
                    },
                    {
                        "index": "auto-vpn",
                        "name": "auto-vpn",
                        "label": "Auto-VPN",
                        "sortable": false,
                        "width": 90,
                        "formatter": formatAutoVpnStateCell,
                        "searchCell": {
                                 "type": 'dropdown',
                                 "values":[{
                                     "label": context.getMessage("ipsec_vpns_advpn_enable"),
                                     "value": true
                                 },{
                                     "label": context.getMessage("ipsec_vpns_advpn_disable"),
                                     "value": false
                                 }]
                        }
                        /*"editCell": {
                            "type": "input"
                        }*/
                    },
                    {
                        "index": "policy-state",
                        "name": "policy-state",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_policy-state"),
                        "width": 120,
                        "searchCell": {
                             "type": 'dropdown',
                             "values":[{
                                 "label": "Draft",//context.getMessage("ipsec_vpns_type_site_to_site"),
                                 "value": "Draft"//context.getMessage("ipsec_vpns_type_site_to_site")
                             },{
                                 "label": "Final",//context.getMessage("ipsec_vpns_type_hub_and_spoke"),
                                 "value": "Final"//context.getMessage("ipsec_vpns_type_hub_and_spoke")
                             }]
                        },
                        "formatter": formatPolicyStateCell
                    },
                    {
                        "index": "publish-state",
                        "name": "publish-state",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_publish-state"),
                        "width": 120,
                        "searchCell": {
                         "type": 'dropdown',
                         "values":publishSearchData()
                    },
                        "formatter": formatPublishStateCell
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_domain-name"),
                        "width": 120,
                        "sortable": false,
                        "editCell": {
                            "type": "input"
                        }
                    }
                ]
            }
        }
    };

    return Configuration;
});