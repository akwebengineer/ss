define([
    '../../../../ui-common/js/common/restApiConstants.js'
], function (RestApiConstants) {
    var VPNProfilesGridConf = function(context){
         this.getValues= function(){
            return {
                "title": context.getMessage('vpn_profiles_grid_title'),
                "title-help": {
                    "content": context.getMessage('vpn_profiles_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("VPN_PROFILE_CREATING")
                },
                "tableId": "vpnprofiles",
                "height": "500px",
                "numberOfRows": 20,
                "scroll": true,
                "multiselect": "true",
                "sorting": [ 
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "filter": {
                    searchUrl: true
                },
                "jsonId": "id",
                "url": "/api/juniper/sd/vpn-management/vpn-profiles",
                "jsonRoot": "vpn-profiles.vpn-profile",
                "jsonRecords": function(data) {
                        return data['vpn-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.vpn-management.vpn-profiles+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('vpn_profiles_grid_edit'),
                    "delete": context.getMessage('vpn_profiles_grid_delete')
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
                        "label": "ID",
                        "hidden": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "label": "DOMAIN ID",
                        "hidden": true
                    },
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('grid_column_name'),
                        "width": 150,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "definition-type",
                        "name": "definition-type",
                        "label": context.getMessage('grid_column_type'),
                        "width": 120,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('grid_column_description'),
                        "width": 300,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "mode",
                        "name": "mode",
                        "label": context.getMessage('vpn_profiles_grid_column_mode'),
                        "width": 120,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                        "index": "created-by-user-name",
                        "name": "created-by-user-name",
                        "label": context.getMessage('grid_column_created-by'),
                        "width": 120
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
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
    return VPNProfilesGridConf;
});
