/**
 * Created by wasima on 7/17/15.
 */

define([
'../constants/ipsSigConstants.js',
'../../../../ui-common/js/common/restApiConstants.js',
'../../../../ui-common/js/common/gridConfigurationConstants.js'
], function(IpsSigConstants, RestApiConstants, GridConfigurationConstants) {

     var labelTable = {
          "any": IpsSigConstants.ANY,
          "cts": IpsSigConstants.CTS,
          "stc": IpsSigConstants.STC,
          "rarely" : IpsSigConstants.HIGH,
          "occasionally" : IpsSigConstants.MEDIUM,
          "frequently" : IpsSigConstants.LOW,
          "none" : IpsSigConstants.UNKNOWN,
          "9" : IpsSigConstants.HIGH,
          "5" : IpsSigConstants.MEDIUM,
          "1" : IpsSigConstants.LOW,
          "0" : IpsSigConstants.UNKNOWN
    };

    var Configuration = function(context) {

        this.formatTypeObject = function (cellValue, options, rowObject) {
            if (cellValue === 'anomaly')  return "Protocol Anomally"
            if (cellValue === 'signature')  return "Signature";
            if (cellValue === 'static')  return "Static Group";
            if (cellValue === 'dynamic')  return "Dynamic Group";
            if (cellValue === 'chain')  return "Compound Attack";
        };

        this.formatAction = function (cellValue, options, rowObject) {
            if (cellValue === 'none')  return IpsSigConstants.NO_ACTION;
            if (cellValue === 'close')  return IpsSigConstants.CLOSE_CLIENT_SERVER;
            if (cellValue === 'close_client')  return IpsSigConstants.CLOSE_CLIENT;
            if (cellValue === 'close_server')  return IpsSigConstants.CLOSE_SERVER;
            if (cellValue === 'ignore')  return IpsSigConstants.IGNORE;
            if (cellValue === 'drop')  return IpsSigConstants.DROP;
            if (cellValue === 'drop_packet')  return IpsSigConstants.DROP_PACKET;
            if(_.isEmpty(cellValue)){
                return '';
            }
        };

        this.setShowHideColumnSelection= function (columnSelection){
            columnSelection['cves'] = false; //hides the CVES column by default
            columnSelection['bugs'] = false; //hides the BUGS column by default
            columnSelection['certs'] = false; //hides CERTS column by default
            columnSelection['confidence'] = false; //hides confidence column by default
            columnSelection['service'] = false; //hides service column by default
            columnSelection['performance'] = false; //hides performance column by default
            columnSelection['direction'] = false; //hides direction column by default
            return columnSelection;
        };

        this.formatCell = function(cellvalue, options, rowObject) {
            var formattedValue = cellvalue,me = this;
            if (!$.isEmptyObject(formattedValue)) {
              formattedValue = formattedValue.replace(/\s+/g, '');
              var res = formattedValue.split(","),textValue;     
              res.forEach(function (object) {
                  textValue =textValue +","+labelTable[object];
                });
              textValue = textValue.split('undefined,').slice(1);
              return textValue;
            }
            return "";
        };


        this.getValues = function(config) {
            return {
                "tableId": ((config && config.id) ? config.id : "ips_sig"),
                "numberOfRows": GridConfigurationConstants.PAGE_SIZE,
                "title": ((context && context.type) ? null : context.getMessage('ips_sig_ilp_title')),
                "title-help": {
                    "content": context.getMessage('ips_sig_ilp_tooltip'),
                    "ua-help-text": context.getMessage('more_link'),
                    "ua-help-identifier": context.getHelpKey("IPS_POLICY_SIGNATURE_CREATING")
                },
                "height": GridConfigurationConstants.TABLE_HEIGHT,
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
                "url": "/api/juniper/sd/ips-signature-management/ips-signatures",
                "jsonRoot": "ips-signatures.ips-signature",
                "jsonId": "id", 
                "jsonRecords": function(data) {
                      var dataCheck = data['ips-signatures']['ips-signature'],gridData=[];
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
                      // return gridData;                 
                    return data['ips-signatures'][RestApiConstants.TOTAL_PROPERTY];
                },
                "filter": {
                    searchUrl: true,
                  /*  searchUrl: function (value, url){  
                        return url + "?filter=(global eq '"  + value+"')";
                    },*/
                    columnFilter: true,
                    optionMenu: {
                        "showHideColumnsItem": {
                             "setColumnSelection": this.setShowHideColumnSelection
                        },
                        "customItems":[]
                    }
                },
                "confirmationDialog" : {
                    "delete" : {
                        title : 'Warning',
                        question : 'Are you sure you want to delete selected record ?'
                    }
                },
                // "showWidthAsPercentage": false,
                "ajaxOptions": {
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.ips-signature-management.ips-signatures+json;version=1;q=0.01'
                    }
                },
                "contextMenu": {
                    "edit": "Edit",
                    "delete": "Delete"
                },
                "actionButtons":{
                    "defaultButtons":{ //overwrite default CRUD grid buttons
                        "create": {
                           "label": "Create",
                           "key": "createIpsSigEvent",
                           "items": [{
                               "label":context.getMessage('ips_signature_menu'),
                               "key":"createIpsSigEvent"
                            },{
                               "label":context.getMessage('ips_static_group'),
                               "key":"createIpsSigStaticGroupEvent"
                            },{
                               "label":context.getMessage('ips_dynamic_group'),
                               "key":"createIpsSigDynamicGroupEvent"
                            }/*,{
                                "label":context.getMessage('view_advanced_filter'), 
                                "key":"viewAdvancedFilterEvent"
                        }*/]
                        }
                    },
                    "customButtons":[]
                },                 
                "columns": [
                    {
                        "index": "name",
                        "name": "name",
                        "label": context.getMessage('ips_sig_grid_column_name'),
                        "width": 250,
                        "searchCell": true
                    },
                    {
                        "index": "severity",
                        "name": "severity",
                        "label": context.getMessage('ips_sig_grid_column_severity'),
                        "width": 100,
                        "searchCell": {
                            "type": 'dropdown',
                            "values":[{
                                "label": IpsSigConstants.CRITICAL,
                                "value": "Critical"
                            },{
                                "label": IpsSigConstants.MAJOR,
                                "value": "Major"
                            },
                            {
                                "label": IpsSigConstants.INFO,
                                "value": "Info"
                            },
                            {
                                "label": IpsSigConstants.MINOR,
                                "value": "Minor"
                            },{
                                "label": IpsSigConstants.WARNING,
                                "value": "Warning"
                            }]
                        }
                    },
                    {
                        "index": "category",
                        "name": "category",
                        "label": context.getMessage('ips_sig_grid_column_category'),
                        "width": 180,
                        "searchCell": true
                    },
                    {
                        "index": "sigType",
                        "name": "sig-type",
                        "label": context.getMessage('ips_sig_grid_column_object_type'),
                        "width": 250,
                        "formatter": this.formatTypeObject,
                        "searchCell": {
                            "type": 'dropdown',
                            "values":
                                [{
                                  "value": "dynamic",
                                  "label": IpsSigConstants.DYNAMIC
                                },
                                {
                                  "value": "static",
                                  "label": IpsSigConstants.STATIC
                                },
                                {
                                  "value": "signature",
                                  "label": IpsSigConstants.SIGNATURE
                                },
                                {
                                  "value": "anomaly",
                                  "label": IpsSigConstants.ANOMALY
                                },
                                {
                                  "value": "chain",
                                  "label": IpsSigConstants.COMPOUND_ATTACK
                                }]
                        }
                    },
                    {
                        "index": "recommended",
                        "name": "recommended",
                        "label": context.getMessage('ips_sig_grid_column_recommended'),
                        "width": 100,
                        "searchCell": {
                            "type": 'dropdown',
                            "values":[{
                                "label": "false",
                                "value": "false"
                            },{
                                "label": "true",
                                "value": "true"
                            }]
                        }
                    },
                    {
                        "index": "recommendedAction",
                        "name": "recommended-action",
                        "label": context.getMessage('action'),
                        "width": 180,
                        "formatter": this.formatAction,
                        "searchCell":{
                            "type": 'dropdown',
                            "values" : [{
                                  "value": "",
                                  "label": IpsSigConstants.NO_ACTION
                                },
                                {
                                  "value": "close",
                                  "label": IpsSigConstants.CLOSE_CLIENT_SERVER
                                },
                                {
                                  "value": "close_client",
                                  "label": IpsSigConstants.CLOSE_CLIENT
                                },
                                {
                                  "value": "close_server",
                                  "label": IpsSigConstants.CLOSE_SERVER
                                },
                                {
                                  "value": "ignore",
                                  "label": IpsSigConstants.IGNORE
                                },
                                {
                                  "value": "drop",
                                  "label": IpsSigConstants.DROP
                                },
                                {
                                  "value": "drop_packet",
                                  "label": IpsSigConstants.DROP_PACKET
                                }]
                        }
                    },
                    {
                        "index": "definitionType",
                        "name": "definition-type",
                        "label": context.getMessage('ips_sig_grid_column_predefined_custom'),
                        "width": 160,
                        "searchCell": {
                            "type": 'dropdown',
                            "values":[{
                                "label": IpsSigConstants.PREDEFINED,
                                "value": "Predefined"
                            },{
                                "label": IpsSigConstants.CUSTOM,
                                "value": "Custom"
                            }]
                        }
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "width": 186,
                        "hidden": true
                    },                   
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('ips_sig_grid_column_domain'),
                        "width": 100
                    },
                    {
                    "index": "domain-id",
                    "name": "domain-id",
                    "hidden":true,
                    "width":10
                    },
                    {
                        "index": "cves",
                        "name": "cves",
                        "label": "CVE",
                        "width":120,
                        "searchCell": true
                    },
                    {
                        "index": "certs",
                        "name": "certs",
                        "label": "CERT",
                        "width":90,
                        "searchCell": true
                    },
                    {
                        "index": "bugs",
                        "name": "bugs",
                        "label": "BUG",
                        "width":120,
                        "searchCell": true
                    },
                    {
                        "index": "confidence",
                        "name": "confidence",
                        "label": "False Positives",
                        "width":150,
                        "formatter": this.formatCell,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : IpsSigConstants.HIGH,
                             "value" : "rarely"
                           },
                           {
                             "label" : IpsSigConstants.MEDIUM,
                             "value" : "occasionally"
                           },
                           {
                             "label" : IpsSigConstants.LOW,
                             "value" : "frequently"
                           },
                           {
                             "label" : IpsSigConstants.UNKNOWN,
                             "value" : "none"
                           },
                          ]
                          }
                    },
                    {
                        "index": "service",
                        "name": "service",
                        "label": "Service",
                        "width":100,
                        "searchCell": true
                    },
                    {
                        "index": "performance",
                        "name": "performance",
                        "label": "Performance Impact",
                        "width":150,
                        "formatter": this.formatCell,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : IpsSigConstants.HIGH,
                             "value" : "9"
                           },
                           {
                             "label" : IpsSigConstants.MEDIUM,
                             "value" : "5"
                           },
                           {
                             "label" : IpsSigConstants.LOW,
                             "value" : "1"
                           },
                           {
                             "label" : IpsSigConstants.UNKNOWN,
                             "value" : "0"
                           }
                          ]
                          }
                    },
                    {
                        "index": "direction",
                        "name": "direction",
                        "label": "Direction",
                        "width":250,
                        "formatter": this.formatCell,
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [
                           {
                             "label" : IpsSigConstants.ANY,
                             "value" : "any"
                           },
                           {
                             "label" : IpsSigConstants.CTS,
                             "value" : "cts"
                           },
                           {
                             "label" : IpsSigConstants.STC,
                             "value" : "stc"
                           }
                          ]
                          }
                    }
                ]
            }
        };
    };

    return Configuration;

});
