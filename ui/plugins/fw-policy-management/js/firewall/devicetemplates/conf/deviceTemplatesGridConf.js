define([
'../common/constant/deviceTemplatesConstant.js',
'../../../../../ui-common/js/common/restApiConstants.js'
], function (DeviceTemplatesConstant, RestApiConstants) {
    var DeviceTemplatesGridConf = function(context){
         this.getNotificationConfig = function () {
              var notificationSubscriptionConfig = {
                'uri' : [DeviceTemplatesConstant.DEVICE_TEMPLATE_URL],
                'autoRefresh' : true,
                'callback' : function () {
                  this.gridWidget.reloadGrid();
                }
              };
              return notificationSubscriptionConfig;
         };   
         this.formatConfigType = function(cellValue, options, rowObject) {
                return (cellValue === 'QUICK_TEMPLATE' ? 'Quick Template': 'Config Template');
        };
        //Since templates have space platform based REST calls we need to do custom select all callback implementation
        this.selectAll = function (setIdsSuccess, setIdsError, searchData, queryParams) {
          var url, qString = "";
          
          url = DeviceTemplatesConstant.DEVICE_TEMPLATE_URL_DOMAIN;
          
          if(queryParams._search !== undefined){
            qString += "&_search="+queryParams._search;
          }
          if(queryParams.search !== undefined){
            qString += "&search="+queryParams.search;
          }  
          if(!_.isEmpty(qString)) {
            url = url + '?' + qString;
          }
          $.ajax({
              method: 'GET',
              dataType:'json',
              headers: { 
                'accept': DeviceTemplatesConstant.DEVICE_TEMPLATE_ACCEPT_HEADER
              },
              url: url,
              success: function(data) {
                var ids = [];
                if(data['config-templates'] && data['config-templates']['config-template']) {
                  if(!_.isArray(data['config-templates']['config-template'])) {
                    data['config-templates']['config-template'] = [data['config-templates']['config-template']];
                  }
                  ids = _.pluck(data['config-templates']['config-template'], "id");
                }
                setIdsSuccess(ids);
              },
              error: function() {
                setIdsError("Getting all row ids in the grid FAILED.");
              }
          });
        };
         this.getValues= function(){
            return {
                "title": context.getMessage('device_templates_grid_title'),
                "title-help": {
                    "content": context.getMessage('device_templates_grid_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("FIREWALL_POLICY_SD_DEVICE_TEMPLATE_CREATING")
                },
                "tableId": "devicetemplates-grid",
                "height": "auto",
                "scroll": true,
                "multiselect": "true",
                "deleteRow": {
                    "autoRefresh": true
                },
                "sorting": [ 
                    {
                    "column": "name",
                    "order": "asc"
                    }
                ],
                "filter": {
                    optionMenu: {
                        "showHideColumnsItem": {},
                        "customItems": []
                    }
                },
                "jsonId": "id",
                "url": DeviceTemplatesConstant.DEVICE_TEMPLATE_URL_DOMAIN,
                //Implement select all call back for grid
                "onSelectAll" : this.selectAll,
                "jsonRoot": "config-templates.config-template",
                "jsonRecords": function(data) {
                  var retCount = 0;
                   if(data != null && data['config-templates'] != null){
                    if(Array.isArray(data['config-templates']['config-template'])){
                       data['config-templates']['config-template'].forEach(function(d) {
                    if(d['device-family'] != 'JUNOS-ES'){ 
                        data['config-templates']['config-template'].splice(data['config-templates']['config-template'].indexOf(d),1); 
                    }
                });
                } else {
                    if(!_.isEmpty(data['config-templates']) && !_.isEmpty(data['config-templates']['config-template'])) {
                         if (data['config-templates']['config-template']['device-family'] != 'JUNOS-ES'){
                            data['config-templates']['config-template'] = "";
                         } else {
                           data['config-templates']['config-template'] = [data['config-templates']['config-template']];
                         }
                     }
                }
                    //return the count ; Since we are removing entries which are not of device family JUNOS-ES we need to check the array length rather than @total property
                    //of REST response
                    retCount = parseInt(data['config-templates'][RestApiConstants.SPACE_TOTAL_PROPERTY]);
                    if(retCount !== 0) {
                      retCount = data['config-templates']['config-template'].length;
                    }
                }
                  return retCount;
                },
                "ajaxOptions": {
                    "headers": {
                        "Accept":DeviceTemplatesConstant.DEVICE_TEMPLATE_ACCEPT_HEADER
                    }
                },
                "contextMenu": {
                    "edit": context.getMessage('device_templates_grid_edit'),
                    "delete": context.getMessage('device_templates_grid_delete')
                },
                "confirmationDialog": {
                    "delete": {
                        title: context.getMessage('fw_device_templates_delete_title'),
                        question: context.getMessage('fw_device_templates_delete_msg')
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
                        "label": context.getMessage('device_templates_column_name'),
                        "width": 150
                    },
                    {
                        "index": "config-type",
                        "name": "config-type",
                        "label": context.getMessage('device_templates_template_type'),
                        "width": 150,
                        "formatter": this.formatConfigType
                    },
                    {
                        "index": "description",
                        "name": "description",
                        "label": context.getMessage('device_templates_description'),
                        "width": 300,
                        "collapseContent": {
                          "singleValue" : true
                        }
                    },
                    {
                        "index": "os-version",
                        "name": "os-version",
                        "label": context.getMessage('device_templates_os_version'),
                        "width": 120
                    },
                    {
                        "index": "last-updated-by",
                        "name": "last-updated-by",
                        "label": context.getMessage('device_templates_last_updated_by'),
                        "width": 120
                    },
                    {
                        "index": "last-update-time-string",
                        "name": "last-update-time-string",
                        "label": context.getMessage('device_templates_last_updated_time'),
                        "width": 150
                    },
                   {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('device_templates_domain'),
                        "width": 80
                    },
                    {
                    "index": "domain-id",
                    "name": "domain-id",
                    "hidden":true
                    }
                ]
            }
        }        
    };    
    return DeviceTemplatesGridConf;
});
