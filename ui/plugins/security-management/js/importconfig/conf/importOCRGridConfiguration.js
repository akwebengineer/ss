/**
 * Created by nareshu on 8/17/15.
 */

define([
'../../../../ui-common/js/common/restApiConstants.js'
], function(RestApiConstants) {

    var Configuration = function(grid) {

        var context = grid.context,apiConfig=grid.wizardView.apiConfig;
 
        this.idFormatter = function(cellValue, options, rowObject) {
        if(grid.conflictMap[options.rowId]==undefined){
            grid.conflictMap[options.rowId] = rowObject;
        }
            return options.rowId;

        };

        this.originalNameFormatter = function(cellValue, options, rowObject) {
            cellValue = rowObject['original-name'];
            var rowData = JSON.stringify(escape(rowObject['tool-tip'])),title =  JSON.stringify(rowObject['original-name']);
            return "<a name='tooltipView' title='"+title+"' datacell='"+rowData+"' id='tooltip_"+options.rowId+"'>"+cellValue+"</a>";
        };

       

        this.resolutionFormatter = function(cellValue, options, rowObject) {
            var actionTypes = {
                "RENAME_NEW":"Rename Object",
                "KEEP_OLD" : "Keep Existing Object",
                "KEEP_NEW" : "Overwrite with New Object"
            };
            return actionTypes[rowObject['resolution']];
        };

        this.isRowEditable = function (rowId, rawObject, rowObject){
           // var selectedRows = grid.importConfigOCRGrid.getSelectedRows();
            if(rowObject['resolution']==grid.actionTypes['RENAME_NEW']){
                return true;        
            }
            return false;

        };
        this.setCustomActionStatus = function (selections, updateStatusSuccess, updateStatusError) {
          var j,i,l,k, selectedRows = selections.selectedRowIds,
          isApproved, action, actions = ['RENAME_NEW', 'KEEP_NEW', 'KEEP_OLD'], button, buttons = ['renameobject', 'overwrite', 'keepobject'], retObject = {};
          if(selectedRows.length > 0) {
              for (j = 0 , k = buttons.length; j < k; ++j) {
                  isApproved = true;
                  button = buttons[j];
                  action = actions[j];
                  for (i = 0, l = selectedRows.length; i < l; ++i) {
                      if (grid.isApproved(selectedRows[i], action) === false) {
                          isApproved = false;
                          break;
                      }
                  }
                  retObject[button] = isApproved;
              }
          }else {
              retObject = {
                  "keepobject": false,
                  "renameobject": false,
                  "overwrite": false
              };
          }

          updateStatusSuccess(retObject);
        };

        this.getValues = function(uuid) {
            this.uuid = uuid, api = apiConfig.api;
            if (api === 'import-zip') {
                api = apiConfig.serviceType + '/rollback';
            }
            var self = this;
           
            return {
                "title-help": {
                    "content": context.getMessage('devices_ilp_tooltip'),
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "tableId": "ocr-ilp",
                "numberOfRows": 50,
                "sortName": "name",
                "sortOrder": "asc",
                "multiselect": "true",
                "url": "/api/juniper/sd/policy-management/"+api+"/object-conflicts?uuid="+uuid,
                "jsonRoot": "object-conflicts.object-conflict",
                "jsonId": "id",
                "jsonRecords": function(data) {
                    var recordsExits = data['object-conflicts']['object-conflict'];
                    return recordsExits.length;
                    
                },
                "ajaxOptions": {
                    "complete":function(data){
                         
                        var conflicts = data.responseJSON['object-conflicts'];
                        grid.dataObject.ocrRecords = data.responseJSON["object-conflicts"]["object-conflict"];
                        /*grid.progressBar.destroy();
                        grid.wizardView.removeMask();*/
                    },
                    "error":function(){
                        /*grid.progressBar.destroy();
                        grid.wizardView.removeMask();*/

                    },
                    "headers": {
                        "Accept": 'application/vnd.juniper.sd.policy-import-management.object-conflicts+json;q=0.01;version=1'
                    }
                },
                noResultMessage: function () {
                  return "No Conflicts to Show";
                },
                "contextMenu": {
                   /* "custom":[{ 
                        "label":"Edit Object Name",
                        "key":"editobjectname"
                    }]*/
                },
                "filter": {
                  searchUrl: true,
                  columnFilter: true,
                  showFilter: true
                },
                "actionButtons":{
                  "actionStatusCallback": this.setCustomActionStatus,
                  "customButtons":[
                        {
                        "button_type": true,
                        "label": "Rename Object",
                        "disabledStatus": true,
                        "id": "rename-object",
                        "key": "renameobject"
                        },
                        {
                        "button_type": true,
                        "label": "Overwrite with Imported Value",
                        "disabledStatus": true,
                        "id": "overwrite-object",
                        "key": "overwrite"
                        },
                        {
                        "button_type": true,
                        "label": "Keep Existing Object",
                        "disabledStatus": true,
                        "id": "keep-object",
                        "key": "keepobject"
                        }
                    ]
                },    
                "editRow": {
                     "showInline": true,
                     "isRowEditable": this.isRowEditable
                },
                "columns": [
                    {
                        "index": "originalname",
                        "name": "originalname",
                        "label": context.getMessage('ocr_grid_column_object_name'),
                        "hidden": false,
                        "formatter" : this.originalNameFormatter
                    },
                    {
                        "index": "original-name",
                        "name": "original-name",
                        "label": context.getMessage('ocr_grid_column_object_name'),
                        "class": "objectNameToolTip",
                        "hidden" : true
                    },
                    {
                        "index": "domain-name",
                        "name": "domain-name",
                        "label": context.getMessage('ocr_grid_column_domain')
                    },
                    {
                        "index": "object-type",
                        "name": "object-type",
                        "searchCell": {
                          "type": 'dropdown',
                          "values": [{
                            "label": "Address",
                            "value": "Address"
                           },{
                            "label": "Service",
                            "value": "Service"
                           },{
                            "label": "Nat Pool",
                            "value": "Pool"
                           },{
                             "label": "IPS Signature",
                             "value": "IPS_SIGNATURE"
                           }, {
                             "label": "Others",
                             "value": "Others"
                           }]
                        },
                        //"sortable":false,
                        "label": context.getMessage('ocr_grid_column_object_type')
                    },
                    {
                        "index": "old-value",
                        "name": "old-value",
                        "label": context.getMessage('ocr_grid_column_value'),
                       // "collapseContent": true 
                    },
                    {
                        "index": "new-value",
                        "name": "new-value",
                        "label": context.getMessage('ocr_grid_column_imported_value'),
                        //"collapseContent": true 
                    },
                    {
                        "index": "resolution",
                        "name": "resolution",
                        "label": context.getMessage('ocr_grid_column_conflict_resolution'),
                        "formatter" : this.resolutionFormatter
                       
                    },
                    {
                        "index": "new-name",
                        "name": "new-name",
                        "label": context.getMessage('ocr_grid_column_new_object_name'),
                        "editCell":{
                            "type": "input",
                            "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$",
                            "error": context.getMessage("address_name_error")
                        }
                    },
                    {
                        "index": "old-id",
                        "name": "old-id",
                        "label": context.getMessage('ocr_grid_column_id'),
                        "hidden": true
                    },
                    {
                        "index": "id",
                        "name": "id",
                        "label": context.getMessage('ocr_grid_column_id'),
                        "formatter": this.idFormatter,
                        "hidden": true
                    },
                    {
                        "index": "tool-tip",
                        "name": "tool-tip",
                        "label" : "tooltip",
                        "hidden": true
                    },
                    {
                        "index": "resolved-ref-ids",
                        "name": "resolved-ref-ids",
                        "label" : "refs",
                        "hidden": true
                    }
                   


                   
                ]
            }
        };
    };

    return Configuration;

});
