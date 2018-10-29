/**
 * Created by vinutht on 5/14/15.
 */
define([
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(RestApiConstants,GridConfigurationConstants) {

    var Configuration = function(context) {
        this.formatTypeObject = function(cellValue, options, rowObject) {
            if(cellValue === 'application') {
                return context.getMessage('app_sig_grid_cell_value_application');
            }
            else if(cellValue === 'protocol') {
                return context.getMessage('app_sig_grid_cell_value_protocol');
            }
            else if(cellValue === 'group') {
                return context.getMessage('app_sig_grid_cell_value_group');
            }
            else{
                return cellValue;
            }
        };
        this.setShowHideColumnSelection= function (columnSelection){
            columnSelection['id'] = false; //hides id column by default
            columnSelection['domain'] = false; //hides domain column by default
            return columnSelection;
        };

        this.getValues = function(config) {

            return {
                "tableId": ((config && config.id) ? config.id : "app_sig"),
                "numberOfRows": ((config && config.id) ?  500 : GridConfigurationConstants.PAGE_SIZE),
                "height": GridConfigurationConstants.TABLE_HEIGHT,
                "title": ((config && config.id) ?  null : context.getMessage('app_sig_ilp_title')),
                "title-help": {
                 "content": context.getMessage("app_sig_ilp_tooltip"),
                 "ua-help-text": context.getMessage('more_link'),
                 "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_APPLICATION_SIGNATURE_CREATING")
                 },
                "sorting": [
                    {
                        "column": "name",
                        "order": "asc"
                    }
                ],
                "on_overlay": true,
                "repeatItems": "true",
                "multiselect": "true",
                "scroll": true,
                "url": "/api/juniper/sd/app-sig-management/app-sigs",
                "jsonRoot": "application-signatures.application-signature",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    var dataCheck = data['application-signatures']['application-signature'],gridData=[];
                    if(config != undefined && config.selectedRowIds){
                      for(i=0;i<config.selectedRowIds.length;i++) {
                        for(j=0;j<dataCheck.length;j++) {
                         if(config.selectedRowIds[i] == dataCheck[j].id) {
                            dataCheck.splice(j, 1);
                         }
                        }
                      }
                      gridData = dataCheck;
                    }
                    else{
                      gridData = dataCheck;
                    }
                    return data['application-signatures'][RestApiConstants.TOTAL_PROPERTY];
                },
                "ajaxOptions": {
                      "headers": {
                                  "Accept": 'application/vnd.juniper.sd.app-sig-management.application-signatures+json;version=2;q=0.02'
                      }
                },

                "filter": {
                   searchUrl : true,
                   columnFilter: true,
                   showFilter: false,
                   optionMenu: {
                        "showHideColumnsItem": {
                             "setColumnSelection": this.setShowHideColumnSelection
                        },
                        "customItems":[]
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('app_sig_grid_edit'),
                    "delete": context.getMessage('app_sig_grid_delete'),
                    "custom":[{
                      "label":context.getMessage('action_find_usage'),
                      "key":"findUsageEvent"
                  }]
                    
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage("appsig_grid_confDialogue_delete_title"),
                        question: context.getMessage("app_sig_Profile_grid_confDialogue_delete_question")
                    }
                },
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('app_sig_grid_column_name'),
                        "width": 186,
                        "searchCell": true
                    },
                    {
                        "index": "objtype",
                        "name": "type",
                        "label": context.getMessage('app_sig_grid_column_object_type'),
                        "width": 186,
                        "formatter": this.formatTypeObject,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : "Application",
                             "value" : "application"
                           },
                           {
                             "label" : "Group",
                             "value" : "group"
                           }
                          ]
                          }
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('app_sig_grid_column_category'),
                        "width": 186,
                        "searchCell": true
                    },
                    {
                        "index": "subcategory",
                        "name": "sub-category",
                        "label": context.getMessage('app_sig_grid_column_sub_category'),
                        "width": 186,
			                  "sortable":false,
                        "searchCell": true
                    },
                    {
                        "index": "risk",
                        "name": "risk",
                        "label": context.getMessage('app_sig_grid_column_risk'),
                        "width": 186,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : "Low",
                             "value" : "1"
                           },
                           {
                             "label" : "Moderate",
                             "value" : "2"
                           },
                           {
                             "label" : "Unsafe",
                             "value" : "3"
                           },
                           {
                             "label" : "High",
                             "value" : "4"
                           },
                           {
                             "label" : "Critical",
                             "value" : "5"
                           }
                          ]
                          }
                    },
                    {
                        "index": "characteristic",
                        "name": "characteristic",
                        "label": context.getMessage('app_sig_grid_column_characteristic'),
                        "width": 186,
                        "searchCell": true
                    },
                    {
                        "index": "deviceCompatibility",
                        "name": "device-compatibility",
                        "label": context.getMessage('app_sig_grid_column_device_compatibility'),
                        "width": 186,
			                  "sortable":false,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : "All devices",
                             "value" : "ALL"
                           },
                           {
                             "label" : "Older than X46 devices",
                             "value" : "X46_AND_OLDER"
                           },
                           {
                             "label" : "Newer than X47 devices",
                             "value" : "X47_AND_NEWER"
                           }
                          ]
                          }
                    },
                    {
                        "index": "definitionType",
                        "name": "definition-type",
                        "label": context.getMessage('app_sig_grid_column_predefined_custom'),
                        "width": 186,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : "PREDEFINED",
                             "value" : "Predefined"
                           },
                           {
                             "label" : "CUSTOM",
                             "value" : "Custom"
                           },
                           {
                             "label" : "ALL",
                             "value" : "All"
                           }
                          ]
                          }
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "width": 186,
                        "hidden": true,
                        "searchCell": true
                    },
                    {
                        "index": "domain-id",
                        "name": "domain-id",
                        "width": 10,
                        "hidden": true
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('app_sig_grid_column_domain'),
                        "width": 186,
			                  "sortable":false,
                        "searchCell": true
                    }
                ]
            }
        };

        this.getEvents = function() {
            return {
              createAppSigEvent: "createAppSigEvent",
              createAppSigGroupEvent: "createAppSigGroupEvent"
            };
        };
    };
    return Configuration;
});
