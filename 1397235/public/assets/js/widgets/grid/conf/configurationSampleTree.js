/**
 * A sample configuration object that shows the parameters required to build a Grid widget with advanced filter
 *
 * @module configurationSampleAdvancedFilter
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define(['widgets/grid/conf/rowSelectConfiguration'], function (RowSelectConfiguration) {

    var configurationSample = {},
        rowSelectConfiguration = new RowSelectConfiguration();

    var configurationCallback = {
        reformatData: function (data) {
            var originalData = data && data.ruleCollection && data.ruleCollection.rules;
            //        originalData[0].name = "Zone";
            //        originalData[0].ruleLevel = 0;
            //        console.log(data);
            return data;
        },
        getChildren: function (node, addChildren) {
            var data = 'expanded=' + node.expanded + '&nodeid=' + node.nodeId + '&parentid=' + node.parentId + '&n_level=' + node.n_level;
            console.log(data);
            $.ajax({
                type: 'GET',
                url: "/api/get-tree",
                data: data,
                success: function (data) {
                    addChildren(node.nodeId, data.ruleCollection.rules);
                }
            });
        },
        isTreeRowEditable: function (rowId, rowObject) {
            if (!rowObject.leaf) {
                return false; //disable all row editing
            }
            return true;
        },
        onBeforeEdit: function (rowId, rawData, rowData, isTreeParentRow) {
            if (rowId == 0) {
                return false;
            } else if (isTreeParentRow) {
                return { //disable some cells for editing
                    "sourceAddress.addresses": false,
                    "destinationAddress.addresses": false,
                    "application-services": false,
                    "applications": false,
                    "action": false
                };
            }
            return true;
        },
        createLink: function (cellvalue, options, rowObject) {
            //        return '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
            return '<a class="cellLink" data-tooltip="' + cellvalue + '" title="' + cellvalue + '">' + cellvalue + '</a>';
        },
        undoLink: function (cellvalue, options, rowObject) {
            return cellvalue;
        },
        formatTreeCell: function (cell, cellvalue, options, rowObject) {
            if (rowObject['destinationExcluded']) {
                var formattedCell = '';
                $(cell).each(function (i, ele) {
                    formattedCell += $(ele).addClass('lineThrough')[0].outerHTML
                });
                cell = formattedCell;
            }
            return cell;
        },
        getServicesHelp: function () {//sample data for testing purposes
            var filterHelp = "Specify port-based services or service sets to be used as match criteria for the policy.";
            return filterHelp;
        },
        formatIPSCell: function (cellvalue, options, rowObject) {
            if (rowObject.isLeaf)
                return (cellvalue == true) ? "ON" : "OFF";
            return "";
        },
        formatProfile: function (cellvalue, options, rowObject) {
            if (rowObject.isLeaf)
                return cellvalue;
            return "";
        },
        onBeforeSearch: function (tokens) {
            var newTokens = [];
            quickFilterParam = "quickFilter = ",
                quickFilerParamLength = quickFilterParam.length;
            tokens.forEach(function (token) {
                if (~token.indexOf(quickFilterParam)) {
                    var value = token.substring(quickFilerParamLength);
                    switch (value) {
                        case 'juniper':
                            token = "jun eq '2'";
                            break;
                        case "nonJuniper":
                            token = "(jun eq 3 or jun eq 5)";
                            break;
                        default:
                            token = "jun eq 'all'"
                    }
                }
                newTokens.push(token);
            });
            console.log(newTokens);
            return newTokens;
        },
        rowBeforeDrag: function (sortingRow) {
            console.log('rowBeforeDrag')
            console.log(sortingRow);
            return true;
        },
        rowHoverDropCallback: function (sortingRow) {
            console.log('rowHoverDropCallback')
            console.log(sortingRow);
            return true;
        },
        rowAfterChangeCallback: function (sortingRow) {
            console.log('rowAfterChangeCallback')
            console.log(sortingRow);
            // return false;
            return true;
        },
        rowDropCallback: function (sortingRow) {
            console.log('rowDropCallback')
            console.log(sortingRow);
            // return {isValid: false, errorMessage: 'afterDrop callback returns error object.'};
            return true;
        },
        enableRowInteraction: function (rowId, rowData) {
            var rowIds = ["0"];
            if (~rowIds.indexOf(rowId)) {
                console.log(rowData);
                return false;
            }
            return true;
        }
    };

    var keyLabelTable = {
        "utm-policy": "UTM",
        "idp": "IDP",
        "application-firewall": "AppFW",
        "application-traffic-control": "AppTC"
    };

    configurationSample.treeGrid = {
        "title": "Tree Grid",
        "refresh": {
            tooltipText: "Click Me!"
        },
        "url": "/api/get-tree",
        "jsonRoot": "ruleCollection.rules",
        "reformatData": configurationCallback.reformatData,
        "jsonId": "rowId",
//        "height": "400px",
        "height": "auto",
        "numberOfRows": 50,
        "jsonRecords": function (data) {
//            if (data.ruleCollection.rules.length>0)
//                return data.ruleCollection.rules.length;
            return 130;
        },
        "ajaxOptions": {
            headers: {
                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
            }
        },
        "multiselect": true,
//        "singleselect": true,
        "enabledRowInteraction": configurationCallback.enableRowInteraction,
        "scroll": {
            pagination: true
        },
        "footer": {
            "hideRowCount": true
//            "hideSelectionAndRowCount": false
        },
        "dragNDrop": {
            moveRow: {
                beforeDrag: configurationCallback.rowBeforeDrag,
                hoverDrop: configurationCallback.rowHoverDropCallback,
                afterChange: configurationCallback.rowAfterChangeCallback,
                afterDrop: configurationCallback.rowDropCallback
            }
        },
        "showWidthAsPercentage": false,
        "onSelectAll": rowSelectConfiguration.getTreeRowIds,
        "onSelectRowRange": rowSelectConfiguration.getTreeRowIdsInRange,
        "tree": {
            "column": "name",
            "level": "ruleLevel",
            "initialLevelExpanded": 1,
            "parent": "parent", //optional since it's using the default value of the attribute
            "leaf": "leaf", //optional since it's using the default value of the attribute
            "parentSelect": true, //parent has a checkbox for row selection
            "getChildren": configurationCallback.getChildren
        },
        "filter": {
            searchUrl: true,
            // readOnlySearch: {
            //     logicOperator: "or"
            // },
            optionMenu: {
                "showHideColumnsItem": true
            }
        },
        "emptyCell":{
            label: "<span class='gridEmptyCell'>--</span>",
            tooltip: "configuration is from the grid level"
        },
        "contextMenu": {
            "edit": "Edit Row",
            "delete": "Delete Row",
            "createBefore": "Create Rule Before",
            "createAfter": "Create Rule After",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom": [
                { //user should bind custom key events
                    "label": "Select a row",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Get all visible rows",
                    "key": "getAllRowsEvent"
                }, {
                    "label": "Delete rows with reset",
                    "key": "deleteRows"
                }, {
                    "label": "Delete rows w/o reset",
                    "key": "deleteRowsWithoutReset"
                }, {
                    "label": "Reload grid",
                    "key": "reloadGridEvent"
                }
            ]
        },

//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
        "editRow": {
            "showInline": true,
            // "isRowEditable": configurationCallback.isTreeRowEditable,
            "onBeforeEdit": configurationCallback.onBeforeEdit
        },
        "columns": [
            {
                "index": "name",
                "name": "name",
                "label": "Name",
//            "formatter":configurationCallback.createLink,
//            "unformat":configurationCallback.undoLink,
                "editCell": {
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "width": 250,
                "frozen": true
            },
            {
                "index": "fromZone",
                "name": "fromZone.name",
                "label": "Source Zone",
                "width": 100,
                "frozen": true
            },
            {
                "index": "sourceAddress",
                "name": "sourceAddress.addresses",
                "label": "Source Address",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "toZone",
                "name": "toZone.name",
                "label": "Destination Zone",
                "width": 150
            },
            {
                "index": "destinationAddress",
                "name": "destinationAddress.addresses",
                "label": "Destination Address",
                "collapseContent": {
                    "name": "name",
                    "formatCell": configurationCallback.formatTreeCell,
                    "overlaySize": "xlarge"
                },
                "width": 150
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 200,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable
                },
                "header-help": {
                    "content": configurationCallback.getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "emptyCell":{
                    label: "<span class='columnEmptyCell'>----</span>",
                    tooltip: "configuration is from the column level"
                }
            },
            {
                "index": "services",
                "name": "applications",
                "label": "Services",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 100,
                "editCell": {
                    "type": "dropdown",
                    "values": [
                        {
                            "label": "Permit",
                            "value": "permit"
                        },
                        {
                            "label": "Deny",
                            "value": "deny"
                        },
                        {
                            "label": "Reject",
                            "value": "reject"
                        },
                        {
                            "label": "Tunnel",
                            "value": "tunnel"
                        }]
                }
            }, {
                "index": "profile",
                "name": "ruleProfile.profileType",
                "label": "Profile",
                "formatter": configurationCallback.formatProfile,
                "width": 100
            },
            {
                "index": "ips",
                "name": "ipsEnabled",
                "label": "IPS",
                "width": 100,
                "formatter": configurationCallback.formatIPSCell
            }
        ]
    };

    var getColumnLabelFormatter = function (columnName, columnConfiguration) {
        console.log(columnName);
        return "<span class='column-label-wrapper'><input type='checkbox'/> <label>Advanced <b>Security<b/></label></span>";
    };

    configurationSample.treeGridPreselection = {
        "title": "Tree Grid with Preselection Enabled",
        "subTitle": "Subtitle for a Grid Long with PreSelection", //string
        "url": "/api/get-tree",
        "jsonRoot": "ruleCollection.rules",
        "reformatData": configurationCallback.reformatData,
        "jsonId": "rowId",
        "height": "auto",
//        "height": "500px",//fixed height required for infinite scrolling in the tree grid
        "numberOfRows": 25,
        "jsonRecords": function (data) {
            return data.ruleCollection.total;
        },
        "multiselect": true,
        "scroll": true,
        // "showWidthAsPercentage": false,
        "onSelectAll": rowSelectConfiguration.getPreselectionTreeRowIds,
        "tree": {
            "column": "name",
            "level": "ruleLevel",
            "initialLevelExpanded": 0,
            "parent": "parent", //optional since it's using the default value of the attribute
            "leaf": "leaf", //optional since it's using the default value of the attribute
            "parentSelect": true, //parent has a checkbox for row selection
            "getChildren": configurationCallback.getChildren,
            "preselection": true
        },
        "filter": {
            searchUrl: true,
            onBeforeSearch: configurationCallback.onBeforeSearch,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
//            advancedSearch: {
//                "filterMenu": searchConfiguration.filterMenu,
//                "logicMenu": searchConfiguration.logicMenu
//                },
            noSearchResultMessage: "There are no search results found",
            columnFilter: true,
            showFilter: {
                quickFilters: [
                    {
                        "label": "Only Juniper devices",
                        "key": "juniper"
                    },
                    {
                        "label": "Only non-Juniper devices",
                        "key": "nonJuniper"
                    }]
            },
            optionMenu: {
                "showHideColumnsItem": true
            }
        },
        "contextMenu": {
            "edit": "Edit Row",
            "delete": "Delete Row",
            "createBefore": "Create Rule Before",
            "createAfter": "Create Rule After",
//            "quickView": "Detail View",
            "custom": [
                { //user should bind custom key events
                    "label": "Toggle row selection",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Toggle row selection to selected",
                    "key": "setSelectedRowEvent"
                },
                {
                    "label": "Toggle row selection to unselected",
                    "key": "setUnselectedRowEvent"
                },
                {
                    "label": "Toggle select all rows",
                    "key": "selectAllRowsEvent"
                },
                {
                    "label": "Get all visible rows",
                    "key": "getAllRowsEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "separator": true
                },
                {
                    "label": "Reload grid",
                    "key": "reloadGridEvent"
                },
                {
                    "label": "Update grid configuration",
                    "key": "updateConfiguration"
                }
            ]
        },
        "actionButtons": {
            "customButtons": [
                {
                    "icon_type": true,
                    "label": "Expand",
                    "icon": {
                        "default": {
                            "icon_url": "#icon_expand_all",
                            "icon_class": "icon_expand_all-dims"
                        }
                    },
                    "key": "expandAll"
                },
                {
                    "icon_type": true,
                    "label": "Collapse",
                    "icon": {
                        "default": {
                            "icon_url": "#icon_collapse_all",
                            "icon_class": "icon_collapse_all-dims"
                        }
                    },
                    "key": "collapseAll",
                }
            ]
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//        "editRow": {
//            "showInline": true,
//            "isRowEditable": configurationCallback.isTreeRowEditable
//        },
        "columns": [
            {
                "index": "name",
                "name": "name",
                "label": "Name",
//            "formatter":configurationCallback.createLink,
//            "unformat":configurationCallback.undoLink,
                "editCell": {
                    "type": "input"
                },
                "width": 250
            },
            {
                "index": "fromZone",
                "name": "fromZone.name",
                "label": "Source Zone",
                "width": 100
            },
            {
                "index": "sourceAddress",
                "name": "sourceAddress.addresses",
                "label": "Source Address",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "toZone",
                "name": "toZone.name",
                "label": "Destination Zone",
                "width": 150
            },
            {
                "index": "destinationAddress",
                "name": "destinationAddress.addresses",
                "label": "Destination Address",
                "group": "destination-application-services",
                "collapseContent": {
                    "name": "name",
                    "formatCell": configurationCallback.formatTreeCell,
                    "overlaySize": "xlarge"
                },
                "width": 150
            },
            {
                "index": "application-services",
                "name": "application-services",
                // "label": "Advanced Security",
                "label": {
                    "formatter": getColumnLabelFormatter
                },
                "width": 200,
                "group": "destination-application-services",
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable
                },
                "header-help": {
                    "content": configurationCallback.getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "index": "services",
                "name": "applications",
                "label": "Services",
                "group": "destination-application-services",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 100,
                "editCell": {
                    "type": "dropdown",
                    "values": [
                        {
                            "label": "Permit",
                            "value": "permit"
                        },
                        {
                            "label": "Deny",
                            "value": "deny"
                        },
                        {
                            "label": "Reject",
                            "value": "reject"
                        },
                        {
                            "label": "Tunnel",
                            "value": "tunnel"
                        }]
                }
            },
            {
                "index": "profile",
                "name": "ruleProfile.profileType",
                "label": "Profile",
                "formatter": configurationCallback.formatProfile,
                "width": 100
            },
            {
                "index": "ips",
                "name": "ipsEnabled",
                "label": "IPS",
                "width": 100,
                "formatter": configurationCallback.formatIPSCell
            },
            {
                "index": "serialNumber",
                "name": "serialNumber",
                "label": "Serial Number",
                // "onHoverShowRowSelection": true,
                "width": "100"
            }
        ]
    };

    configurationSample.treeGridMV = {
        "title": "Tree Grid from a Collection",
        "refresh": {
            tooltipText: "Click Me!"
        },
        "jsonRoot": "ruleCollection.rules",
        "jsonId": "rowId",
//        "height": "400px",
        "height": "auto",
        "numberOfRows": 50,
        "jsonRecords": function (data) {
//            if (data.ruleCollection.rules.length>0) //for one page
//                return data.ruleCollection.rules.length;
            return 130;
        },
        "multiselect": true,
        "enabledRowInteraction": configurationCallback.enableRowInteraction,
        // "scroll": { //uncomment it to add pagination, it needs 'slipstreamGrid.pagination:pageLoaded' event
        //     pagination: true
        // },
//         "footer": {
//             "hideRowCount": true
// //            "hideSelectionAndRowCount": false
//         },
        // "showWidthAsPercentage": false,
        // "onSelectAll": rowSelectConfiguration.getTreeRowIds,
        // "onSelectRowRange": rowSelectConfiguration.getTreeRowIdsInRange,
        "tree": {
            "column": "name",
            "level": "ruleLevel",
            "initialLevelExpanded": 1,
            "parent": "parent", //optional since it's using the default value of the attribute
            "leaf": "leaf", //optional since it's using the default value of the attribute
            "parentSelect": true, //parent has a checkbox for row selection
            // "getChildren": configurationCallback.getChildren
        },
        // "filter": {
        //     searchUrl: true,
        //     // readOnlySearch: {
        //     //     logicOperator: "or"
        //     // },
        //     optionMenu: {
        //         "showHideColumnsItem": true
        //     }
        // },
        // "emptyCell":{
        //     label: "<span class='gridEmptyCell'>--</span>",
        //     tooltip: "configuration is from the grid level"
        // },
        "contextMenu": {
            "edit": "Edit Row",
            "delete": "Delete Row",
            "createBefore": "Create Rule Before",
            "createAfter": "Create Rule After",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom": [
                { //user should bind custom key events
                    "label": "Select a row",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Get all visible rows",
                    "key": "getAllRowsEvent"
                }, {
                    "label": "Delete rows with reset",
                    "key": "deleteRows"
                }, {
                    "label": "Delete rows w/o reset",
                    "key": "deleteRowsWithoutReset"
                }, {
                    "label": "Reload grid",
                    "key": "reloadGridEvent"
                }
            ]
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//         "editRow": {
//             "showInline": true,
//             // "isRowEditable": configurationCallback.isTreeRowEditable,
//             "onBeforeEdit": configurationCallback.onBeforeEdit
//         },
        "columns": [
            {
                "index": "name",
                "name": "name",
                "label": "Name",
//            "formatter":configurationCallback.createLink,
//            "unformat":configurationCallback.undoLink,
                "editCell": {
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "width": 250,
                "frozen": true
            },
            {
                "index": "fromZone",
                "name": "fromZone.name",
                "label": "Source Zone",
                "width": 100,
                "frozen": true
            },
            {
                "index": "sourceAddress",
                "name": "sourceAddress.addresses",
                "label": "Source Address",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "rowId",
                "name": "rowId",
                "label": "rowId",
                "width": 150,
                "hidden": true
            },
            {
                "index": "toZone",
                "name": "toZone.name",
                "label": "Destination Zone",
                "width": 150
            },
            {
                "index": "destinationAddress",
                "name": "destinationAddress.addresses",
                "label": "Destination Address",
                "collapseContent": {
                    "name": "name",
                    "formatCell": configurationCallback.formatTreeCell,
                    "overlaySize": "xlarge"
                },
                "width": 150
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 200,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable
                },
                "header-help": {
                    "content": configurationCallback.getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "emptyCell":{
                    label: "<span class='columnEmptyCell'>----</span>",
                    tooltip: "configuration is from the column level"
                }
            },
            {
                "index": "services",
                "name": "applications",
                "label": "Services",
                "collapseContent": {
                    "name": "name"
                },
                "width": 150
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 100,
                "editCell": {
                    "type": "dropdown",
                    "values": [
                        {
                            "label": "Permit",
                            "value": "permit"
                        },
                        {
                            "label": "Deny",
                            "value": "deny"
                        },
                        {
                            "label": "Reject",
                            "value": "reject"
                        },
                        {
                            "label": "Tunnel",
                            "value": "tunnel"
                        }]
                }
            }, {
                "index": "profile",
                "name": "ruleProfile.profileType",
                "label": "Profile",
                "formatter": configurationCallback.formatProfile,
                "width": 100
            },
            {
                "index": "ips",
                "name": "ipsEnabled",
                "label": "IPS",
                "width": 100,
                "formatter": configurationCallback.formatIPSCell
            }
        ]
    };

    configurationSample.treeGridManyRows = {
        "title": "Tree Grid with 3K rows",
        "url": "/assets/js/widgets/grid/tests/dataSample/vpnTreeData.json",
        "jsonId": "rowId",
        "jsonRecords": function (data) {
            return data.length;
        },
        "height": "360",
        "numberOfRows": 10000,
        "multiselect": true,
        "tree": {
            "column": "name",
            "level": "ruleLevel",
            "initialLevelExpanded": 1,
            "parent": "parent", //optional since it's using the default value of the attribute
            "leaf": "leaf", //optional since it's using the default value of the attribute
            "parentSelect": true
        },
        "contextMenu": {
            "quickView": "Detail View"
        },
        "columns": [{
            "index": "name",
            "name": "name",
            "label": "import_vpn_device_endpoint_name", //"Name",
            "width": 250
        }
        ]
    };


    return configurationSample;

});
