/**
 * A configuration object with the parameters required to build a grid for Global Settings
 *
 * @module globalSettingsGridConf
 * @author Stanley Quan <squan@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 *
 * Endpoint Settings Notes
 *
 * Device
 * Type **
 * External Interface
 * Tunnel Zone
 * Protected Zone/Networks/Interfaces
 * Route Settings  **
 * Routing Instance **
 * Ike Address
 * Certificate **
 * Proxy Id
 *
 * fields with **  appear and disappear from grid in SD implementation
 *
 * Issue with Column data:
 * Type, Route Settings, Routing Instance -> No rest response????
 *
 * Rest response fields:
 *
 * device
 * certificate
 * is-hub
 * ike-group-id
 * initiator
 * external-if-name
 * proxy-id ??? not in rest call response
 * protected-networks total=
 * protected-network-zones total=
 * protected-network-interfaces total=
 * tunnel-zone
 * export-default-routes
 * export-static-routes
 * export-ospf-routes
 * export-rip-routes
 * metric
 * extranet-device
 * device-moid
 * device-name
 * device-ip
 * edit-version
 * version
 * domain-id
 * id
 * tunnel-vr???  in tech-pub documentation but not in rest call response
 */

define([], function () {

    var GlobalSettingsGridConf = function(context){
        this.getValues = function(){
            return {
//                "title": context.getMessage("vpn_trg_settings_form_section_heading_global-settings"),
                "tableId":"global-settings-grid-id",
                "autowidth":false,
                "shrinkToFit":true,
                "numberOfRows": 2,
                "height": "auto",
                "repeatItems": "true",
                "scroll": true,
                "contextMenu": {
                    "edit": "Edit Row Selection"
                },
                "editRow": {
                    "showInline": true
                },
                multiselect: false, //PR PR 1147530
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "hidden": true
                    },
                    {
                        "index": "type",
                        "name": "type",
                        "label": context.getMessage("ipsec_vpns_grid_column_name_type"),
                        "width": 80
                    },
                    {
                        "index": "external-if-name",
                        "name": "external-if-name",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_external_interface"),
                        "collapseContent":true
                    },
                    {
                        "index": "tunnel-zone",
                        "name": "tunnel-zone",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_tunnel_zone"),
                        "collapseContent":true
                    },
                    {
                        "index": "protected-zoneinterface",
                        "name": "protected-zoneinterface",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_protected_zone"),
                        "collapseContent":true
                    },
                    {
                        "index": "ike-group-id",
                        "name": "ike-group-id",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_group_ike"),
                        "collapseContent":true
                    },
                    {
                        "index": "certificate",
                        "name": "certificate",
                        "label": context.getMessage("ipsec_vpns_endpoints_column_certificate"),
                        "collapseContent":true
                    }
                ]
            }
        }
    };

    return GlobalSettingsGridConf;
});
