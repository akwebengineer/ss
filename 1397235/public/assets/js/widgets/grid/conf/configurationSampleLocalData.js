/**
 * A sample configuration object that shows the parameters required to build a Grid widget with local data
 *
 * @module configurationSampleLocalData
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'widgets/grid/tests/dataSample/firewallPoliciesData'
], function (DataSample) {
    var configurationSample = {};

    var rowDropCallback = function(sortingRow, previousRow, nextRow){
        console.log(sortingRow);
        console.log(previousRow);
        console.log(nextRow);
        return true;
    };

    var setCustomTextAreaElement = function(cellvalue, options){
        var $textarea = $("<textarea>");
        $textarea.val(cellvalue);
        return $textarea[0];
    };

    var getCustomTextAreaValue = function(elem, operation){
        return $(elem).val();
    };

    var isRowEditable = function (rowId){
        var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
        if (rows.indexOf(rowId)!=-1)
            return false;
        return true;
    };

    var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                setTooltipDataCallback(data.address, {
                    "key": "ip-prefix",
                    "label": {
                            "unformat": "name",
                            "formatter": function(currentData){
                                return "<div>" + currentData.name + "</div>";
                                }
                        },
                    "clickHandler": function(item){
                        console.log(item);
                    }
                });
            }
        });
        };

    var setTooltipDataLabel = function (rowData, rawData, setTooltipDataCallback){
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                setTooltipDataCallback(data.address, {
                    "key": "ip-prefix",
                    "label": "name",
                    "clickHandler": function(item){
                        console.log(item);
                    }
                });
            }
        });
   };

    var formatCollapseCell = function ($cell, cellvalue, options, rowObject){
        $($cell[1]).find('.cellContentWrapper .cellContentValue').attr('title',rowObject.name).addClass('tooltip');
        return $cell;
    };

    var unformatCollapseCell = function (originalContent, cellvalue, options, rowObject){
        return originalContent;
    };

    var deleteRowMessage = function (selectedRows) {
        return "Are you sure you want to delete " + selectedRows.numberOfSelectedRows + " rule(s) for the Firewall Policies grid?";
    };

    //performs the row deletion by an asynchronous calls. In case of success, the success callback should be invoked and in case of failure, the error callback should be used.
    var deleteRow = function (selectedRows, success, error) {
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                success();
            },
            error: function() {
                error("Row deletion FAILED. " + selectedRows.numberOfSelectedRows + "were not deleted");
            }
        });
    };

    var searchResult = function (tokens, renderGridData) {
        var data = DataSample.firewallPoliciesPage2['policy-Level1']['policy-Level2']['policy-Level3'],
            page = {
                totalRecords: data.length
            };
        renderGridData(data, page);
        
    };
    configurationSample.localGrid = {
        "title": "Simple Grid Sample Page with Local Data",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "subTitle": "Local Data",
        "data": DataSample.localData,
        "tableId":"localDataGrid",
        "jsonId": "name",
        "multiselect": true,
        "height": 'auto', //could be auto
        "numberOfRows": 100,
        "noResultMessage": function () {
            return "No data available";
        },
        "createRow": {
           "showInline": true
        },
        "editRow": {
           "showInline": true,
           "isRowEditable": isRowEditable
        },
        "deleteRow": {
            "onDelete": deleteRow,
            "message": deleteRowMessage
        },
        "contextMenu": {
            "enable":"Enable Rule",
            "disable":"Disable Rule",
            "edit": "Edit Row",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom":[{
                "label":"Search Element",
                "key":"searchEvent"
            },{
                "label":"Clear Search Element",
                "key":"clearSearchEvent"
            },{
                "label":"Delete rows with reset",
                "key":"deleteRows"
            },{
                "label":"Delete rows w/o reset",
                "key":"deleteRowsWithoutReset"
            },{ //user should bind custom key events
                "label":"Reset Hit Count",
                "key":"resetHitEvent" //isDisabled property available to set status of individual items by a callback
            },{
                "label":"Disable Hit Count",
                "key":"disableHitEvent"
            },{
                "label":"Reload Grid",
                "key":"reloadGrid"
            },{
                "label":"Reset selection and reload grid",
                "key":"resetReloadGrid"
            },{
                "label":"Grid on Overlay",
                "key":"subMenus",
                "items": [{
                    "label": "Large grid",
                    "key": "subMenu1"
                },
                {
                    "label": "Small grid",
                    "key": "subMenu2"
                },
                {
                    "label": "Empty grid",
                    "key": "subMenu3"
                }]
            }]
        },
        "actionButtons": {
            "customButtons": [{
            "menu_type": true,
            "label": "Grids on Overlay",
            "key": "subMenu",
            "items": [
                {
                    "label": "Large grid",
                    "key": "subMenu1"
                },
                {
                    "label": "Small grid",
                    "key": "subMenu2"
                },
                {
                    "label": "Empty grid",
                    "key": "subMenu3"
                }]
            }]
        },
        "filter": {
            searchUrl: true,
            readOnlySearch: {
                logicOperator: "or"
            },
            columnFilter: true,
            noSearchResultMessage : "There are no search results found"
        },
        "sorting": [{
            "column":"name",
            "order": "asc" //asc,desc
        }],
        "dragNDrop":{
            moveRow: {
                afterDrop: rowDropCallback
            }
        },
        "columns": [{
            "index": "junos:position",
            "name": "junos:position",
            "label": "Position",
            "onHoverShowRowSelection": true,
            "width": "100"
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": "400",
            "editCell":{
                "type": "input",
                "post_validation": "postValidation",
                "pattern": "^[a-zA-Z0-9_\-]+$",
                "error": "Enter alphanumeric characters, dashes or underscores"
            },
            "sortable": true,
            "searchCell": true,
            "contextMenu": {
                "copyCell": "Copy Cell",
                "pasteCell": "Paste Cell",
                "searchCell": "Search Cell",
                "custom":[{ //user should bind custom key events
                    "label":"Search Cell",
                    "key":"cellMenu11"
                },{
                    "label":"Cell Menu 12",
                    "key":"cellMenu12"
                },{
                    "label":"Cell Sub Menu",
                    "key":"cellSubMenu1",
                    "items": [{
                        "label":"Cell Sub Menu 11",
                        "key":"cellSubMenu11"
                    },{
                        "label":"Cell Sub Menu 12",
                        "key":"cellSubMenu12"
                    }]
                }]
            }
        }, {
            "index": "inactive",
            "name": "inactive",
            "label": "Inactive",
            "hidden": true,
            "showInactive":true
        }, {
            "index": "from-zone-name",
            "name": "from-zone-name",
            "label": "Source Zone",
            "createdDefaultValue":'untrust-inet',
            "width": "100",
            "hidden": true,
            "editCell":{
                "type": "custom",
                "element":setCustomTextAreaElement,
                "value":getCustomTextAreaValue
            }
        }, {
            "index": "source-address",
            "name": "source-address",
            "label": "Source Address",
            "width": "200",
            "collapseContent":{
                "formatCell": formatCollapseCell,
                "unformatCell": unformatCollapseCell
            },
            "createdDefaultValue":"any",
            "searchCell": {
                "type": 'dropdown',
                "values":[{
                    "label": "IP_CONV_204.17.79.60",
                    "value": "1"
                },{
                    "label": "IP_TRE_204.17.79.60",
                    "value": "2"
                },{
                    "label": "IP_TRE_96.254.162.106",
                    "value": "3"
                }]
            },
            "contextMenu": {
                "copyCell": "Copy Cell",
                "pasteCell": "Paste Cell",
                "custom":[{ //user should bind custom key events
                    "label":"Cell Menu 21",
                    "key":"cellMenu21"
                },{
                    "label":"Cell Menu 22",
                    "key":"cellMenu22"
                },{
                    "label":"Cell Sub Menu",
                    "key":"cellSubMenu2",
                    "items": [{
                        "label":"Cell Sub Menu 21",
                        "key":"cellSubMenu21"
                    },{
                        "label":"Cell Sub Menu 22",
                        "key":"cellSubMenu22"
                    }]
                }]
            }
        }, {
            "index": "to-zone-name",
            "name": "to-zone-name",
            "label": "Destination Zone",
            "createdDefaultValue":'untrust-inet',
            "width": "100",
            "editCell":{
                "type": "input",
                "pattern": "length",
                "min_length":"2",
                "max_length":"10",
                "error": "Must be between 2 and 10 characters."
            }
        }, {
            "index": "destination-address",
            "name": "destination-address",
            "label": "Destination Address",
            "collapseContent":{
                "moreTooltip": setTooltipData
            },
            "width": "100",
            "createdDefaultValue":"any",
            "searchCell":{
                "type": "number"
            }
        }, {
            "index": "date",
            "name": "@date",
            "label": "Date",
            "width": "100",
            "searchCell":{
                "type": "date"
            },
            "contextMenu": {
                "copyCell": "Copy Cell",
                "pasteCell": "Paste Row Before",
                "searchCell": "Search Cell"
            },
            "sortable": false
        }, {
            "index": "application",
            "name": "application",
            "label": "Application Application",
            "width": "100",
            "collapseContent":{
                "moreTooltip": setTooltipDataLabel
            },
            "createdDefaultValue":"any"
        }]
    };

    return configurationSample;

});