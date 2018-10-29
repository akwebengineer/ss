define([
'../../../../../ui-common/js/common/restApiConstants.js',
'../../../../../sd-common/js/common/utils/TimeKeeper.js'
], function (RestApiConstants,TimeKeeper) {
    var PolicyProfilesGridConf = function(context){
        this.getNotificationConfig = function () {
          var notificationSubscriptionConfig = {
            'uri' : ['/api/juniper/sd/fwpolicy-management/policy-profiles'],
            'autoRefresh' : true,
            'callback' : function () {
              this.gridWidget.reloadGrid();
            }
          };
          return notificationSubscriptionConfig;
         }; 
         this.getValues= function(){
            return {
                "title": context.getMessage('policy_profiles_grid_title'),
                "title-help": {
                    "content": context.getMessage('policy_profiles_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_PROFILE_CREATING")
                },
                "tableId": "policyprofiles",
                "height": "auto",
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
                    searchUrl: true,
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "jsonId": "id",
                "url": "/api/juniper/sd/fwpolicy-management/policy-profiles",
                "jsonRoot": "policy-profiles.policy-profile",
                "jsonRecords": function(data) {
                        return data['policy-profiles'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                    "headers": {
                        "x-date": TimeKeeper.getXDate( ),
                        "Accept": 'application/vnd.juniper.sd.fwpolicy-management.policy-profiles+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('policy_profiles_grid_edit'),
                    "delete": context.getMessage('policy_profiles_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('policy_profiles_delete'),
                        question: context.getMessage('policy_profiles_delete_msg')
                    }
                },
                "columns": [
                    {
                        "index": "id",
                        "name": "id",
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
                        "index": "created-by-user-name",
                        "name": "created-by-user-name",
                        "label": context.getMessage('policy_profiles_last_updated_by'),
                        "width": 300
                    },
                     {
                        "index": "last-modified-time",
                        "name": "last-modified-time",
                        "label": context.getMessage('policy_profiles_last_updated_time'),
                        "width": 300,
                        formatter: function (val,cell,options) {
                            return '<span style="white-space: normal;">' + Slipstream.SDK.DateFormatter.format(new Date(parseInt(val)), "ddd, DD MMM YYYY HH:mm:ss")+ ' ' + TimeKeeper.getTZStringForTimeOfYear(true, true, false) + '</span>';
                        }
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('grid_column_domain'),
                        "width": 120,
                        "editCell": {
                            "type": "input"
                        }
                    },
                    {
                       "index": "domain-id",
                        "name": "domain-id",
                        "hidden": true
                    }
                ]
            }
        }        
    };    
    return PolicyProfilesGridConf;
});
