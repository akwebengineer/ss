/**
 * A sample configuration object that shows the parameters required to build a Grid widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'widgets/dropDown/dropDownWidget',
    'widgets/grid/conf/searchConfiguration',
    'widgets/grid/conf/queryBuilderConfigurationSample',
    'widgets/grid/conf/rowSelectConfiguration',
    'widgets/grid/tests/view/sampleTooltipView'
], function (DropDownWidget, searchConfiguration, queryBuilderConfiguration, RowSelectConfiguration, SampleTooltipView) {

    var rowSelectConfiguration = new RowSelectConfiguration();

    var showSubtitle = function (cellvalue, options, rowObject) {
        var rowSubtitle = cellvalue;
        if (cellvalue) {
            rowSubtitle = cellvalue.split(",");
            if (rowSubtitle[0] && rowSubtitle[1]) {
                rowSubtitle = "Zone: " + rowSubtitle[0] + " to " + rowSubtitle[1];
            }
        }
        return rowSubtitle;
    };

    var createLink = function (cellvalue, options, rowObject) {
//        return '<a class="cellLink tooltip" data-cell="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
        return '<a class="cellLink" data-tooltip="' + cellvalue + '" title="' + cellvalue + '">' + cellvalue + '</a>';
    };

    var createInlineLink = function (cellvalue, options, rowObject) {
        return '<a class="cellLink tooltip" data-cell="' + cellvalue + '" title="' + cellvalue + '">' + cellvalue + '</a>';
    };

    var undoLink = function (cellvalue, options, rowObject) {
        return cellvalue;
    };

    var buildSubgridUrl = function (rowObject, searchTokens) {
        //dynamic url example for ngSRX
//        var url = configurationSample.nestedGrid.url;
//        url += url.slice(-1)!="/"? "/" : "";
//        url += rowObject['from-zone-name']+ "," + rowObject['to-zone-name'];
        var url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json";
        if (rowObject) {
            if (rowObject.context == "trust-inet,untrust-inet" && _.isArray(searchTokens) && searchTokens.length) {
                url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesEmpty.json";
            } else if (rowObject.context == "untrust-inet,esf-inet") {
                url = "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOneRow.json";
            }
        }

        return url;
    };

    var buildSubgridAjaxOptions = function (rowObject, searchTokens) {
        return {
            headers: {
//                    "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
            }
        }
    };

    var buildRemoteValidationUrl = function (cellvalue, ele) {
        console.log($(ele).data('originalRow'));
        var url = "/api/security-policy/global/policy/";
        url += cellvalue;
        return url;
    };

    var processResponse = function (status, responseText) { //isUnique?
        var isInvalid = false;
        if (status === 404)
            isInvalid = true;
        return isInvalid;
    };

    var getDefaultCopiedValue = function (cellvalue) {
        return cellvalue + '_1';
    };

    var getDefaultAddedValue = function (cellvalue) {
        return cellvalue;
    };

    var getFilterHelp = function () {//sample data for testing purposes
        var filterHelp = "Select the <b>Basic</b> filter to display all columns on the page. <br/>" +
            "Select the <b>Advanced</b> filter to display only the relevant columns on the page.";
        return filterHelp;
    };

    var getNameHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify name to be used as match criteria for the policy.";
        return filterHelp;
    };

    var getApplicationHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify port-based applications to be used as match criteria for the policy.";
        return filterHelp;
    };

    var getServicesHelp = function () {//sample data for testing purposes
        var filterHelp = "Specify port-based services or service sets to be used as match criteria for the policy.";
        return filterHelp;
    };

    var rowDropCallback = function (data) {
        console.log(data);
        return true;
    };

    var keyLabelTable = {
        "utm-policy": "UTM",
        "idp": "IDP",
        "application-firewall": "AppFW",
        "application-traffic-control": "AppTC"
    };

    var tooltipConfig = {
        setTooltipContent: function (currentSelection, renderTooltip) {
            var tooltipView = new SampleTooltipView(currentSelection);
            renderTooltip(tooltipView);
        },
        minWidth: 100,
        maxWidth: 300
    };

    var tooltipConfigStr = {
        setTooltipContent: function (currentSelection, renderTooltip) {
            var tooltipStr = "Sample Tooltip";
            renderTooltip(tooltipStr);
        }
    };


    var configurationSample = {};

    configurationSample.nestedGrid = {
        "footer": {
            getTotalRows: function () {
                return 390;
            }
        },
//        "footer": false,
        "title": "Zone Policies",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "filter-help": {
            "content": getFilterHelp,
            "ua-help-text": "More..",
            "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
        },
        "dragNDrop": {
            moveRow: {
                afterDrop: rowDropCallback
            }
        },
        "tableId": "testNested",
//        "sequenceHeader": "S. No.",
        "height": "auto",
        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesManyPages.json",
//        "url": "/api/security-policy/",
//        "numberOfRows": "20",
        "multiselect": "true",
        "emptyCell": false,
//        "singleselect": "true",
        "filter": {
            searchUrl: true,
//            columnFilter: true,
            advancedSearch: {
                "filterMenu": searchConfiguration.autocompleteFilterMenu,
                "logicMenu": searchConfiguration.autocompleteLogicMenu,
                "allowPartialTokens": true,
                "autocomplete": {
                    inline: true
                },
                "implicitLogicOperator": true,
                "keyTokens": {
                    "maxNumber": 1,
                    "position": "start"
                },
                "tokenizeOnEnter": false
            }
        },
//        "jsonRoot": "policy",
        "validationTime": "500",
//        "scroll":"true",
        "actionButtons": {
            "customButtons": [
                {
                    "menu_type": true,
                    "label": "Grids on Overlay",
                    "key": "subMenu",
                    "items": [
                        {
                            "label": "Nested grid",
                            "key": "subMenu1"
                        }
                    ]
                },
                {
                    "icon_type": true,
                    "label": "Expand",
                    "icon": {
                        "default": {
                            "icon_url": "#icon_expand_all",
                            "icon_class": "icon_expand_all-dims"
                            // icon_color: "icon_row_menu-default"
                        },
                        // "hover": "icon_expand_all_hover",
                        // "disabled": "icon_expand_all_disable"
                    },
                    "key": "expandAll"
                },
                {
                    "icon_type": true,
                    "label": "Collapse",
                    "icon": {
                        // "default": "icon_collapse_all_hover",
                        "default": {
                            "icon_url": "#icon_collapse_all",
                            "icon_class": "icon_collapse_all-dims"
                            // icon_color: "icon_row_menu-default"
                        },
                        // "hover": "icon_collapse_all",
                        // "disabled": "icon_collapse_all_disable"
                    },
                    "key": "collapseAll",
                }
            ]
        },
        "contextMenu": {
            "edit": "Edit Rule",
            "enable": "Enable Rule",
            "disable": "Disable Rule",
            "createBefore": "Create Rule Before",
            "createAfter": "Create Rule After",
            "copy": "Copy Rule",
            "pasteBefore": "Paste Rule Before",
            "pasteAfter": "Paste Rule After",
            "delete": "Delete Rule",
            "custom": [
                { //user should bind custom key events
                    "label": "Reset Hit Count",
                    "key": "resetHitEvent"
                },
                {
                    "label": "Toggle selected row",
                    "key": "toggleSelectedRow"
                }
            ]
        },
        "confirmationDialog": {
            "delete": {
                title: 'Warning',
                question: 'Deleting these rules could negatively effect your network. Are you sure you wish to delete these rules?'
            },
            "save": {
                title: 'Save Changes',
                question: 'You made changes that have not been saved. What would you like to do with your changes?'
            }
        },
        "editRow": {
            "showInline": true
        },
        "subGrid": {
            "url": buildSubgridUrl,
            "ajaxOptions": buildSubgridAjaxOptions,
//            "ajaxOptions": {
//                headers: {
////                    "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
//                    "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
//                }
//            },
//            "expandOnLoad": true,
            "numberOfRows": 8,
            "height": "auto",
//            "height": "307",
            "jsonRoot": "policy",
            "scroll": true,
//            "showRowNumbers":true,
            "jsonRecords": function (data, tableId) {
                if (data.policy.length > 0) {
//                    console.log(tableId);
                    return data.policy[0]['junos:total'];
                }
                return 0;
            }
        },
//        "showWidthAsPercentage": false,
        "columns": [
            {
                "index": "context",
                "name": "context",
                "label": "Name",
                "width": 300,
                "formatter": showSubtitle,
                "groupBy": "true",
                "header-help": {
                    "content": getNameHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "index": "junos:position",
                "name": "junos:position",
                "onHoverShowRowSelection": true,
                "label": "Position"
            },
            {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive": "true"
            },
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "hideHeader": "true",
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "remote": {
                        "url": buildRemoteValidationUrl, //should return url string
                        "type": "GET",
                        "response": processResponse, //should return boolean: true: isValid
                        "error": "Name already in use"
                    },
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "searchCell": true
            },
            {
//                "index": "sourceZone",
//                "name": "from-zone-name",
//                "label": "Source Zone",
//                "createdDefaultValue":getDefaultAddedValue,
//                "width": 200,
//                "editCell":{
//                    "type": "input",
//                    "pattern": "hasnotspace",
//                    "error":"Spaces are not allowed"
//                },
//                "searchCell":{
//                    "type": "number"
//                }
//            }, {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 160,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "searchCell": {
                    "type": 'dropdown',
                    "values": [
                        {
                            "label": "IP_CONV_204.17.79.60",
                            "value": "1"
                        },
                        {
                            "label": "IP_SEC_204.17.79.60 and IP_SEC_204.17.79.61",
                            "value": "close or client and server"
                        },
                        {
                            "label": "IP_TRE_204.17.79.60",
                            "value": "3"
                        },
                        {
                            "label": "IP_TRE_96.254.162.106",
                            "value": "4"
                        }
                    ]
                }
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
                    "content": getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "searchCell": true
            },
            {
//                "index": "destinationZone",
//                "name": "to-zone-name",
//                "label": "Destination Zone",
//                "createdDefaultValue":getDefaultAddedValue,
//                "width": 200
//            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "width": 160,
                "collapseContent": true,
                "createdDefaultValue": "any"
            },
            {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": 260,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "header-help": {
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "formatter": function (cellvalue) {
                    if (_.isUndefined(cellvalue)) {
                        return "";
                    }
                    return cellvalue;
                },
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
                        }
                    ]
                }
            }
        ]
    };

    configurationSample.listNestedGrid = {
        "viewType": "list",
        "footer": false,
        "tableId": "listNestedGrid",
//        "sequenceHeader": "S. No.",
        "height": "auto",
        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesManyPages.json",
//        "url": "/api/security-policy/",
//        "numberOfRows": "20",
//        "multiselect": "true",
        "singleselect": true,
        "contextMenu": true,
//        "contextMenu": {
//            "edit": "Edit Rule",
//            "enable":"Enable Rule"
//        },
        "filter": {
            searchUrl: true,
            advancedSearch: {
                "filterMenu": searchConfiguration.autocompleteFilterMenu,
                "logicMenu": searchConfiguration.autocompleteLogicMenu,
                "allowPartialTokens": true,
                "autocomplete": {
                    inline: true
                },
                "implicitLogicOperator": true
                // "tokenizeOnEnter": false
            }
        },
//        "jsonRoot": "policy",
        "subGrid": {
            "url": buildSubgridUrl,
            "ajaxOptions": buildSubgridAjaxOptions,
//            "ajaxOptions": {
//                headers: {
////                    "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
//                    "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
//                }
//            },
            "expandOnLoad": true,
            "numberOfRows": 3,
            "height": "auto",
            "jsonRoot": "policy",
            "scroll": false,
//            "showRowNumbers":true,
            "jsonRecords": function (data, tableId) {
                if (data.policy.length > 0) {
//                    console.log(tableId);
                    return data.policy[0]['junos:total'];
                }
                return 0;
            }
        },
//        "showWidthAsPercentage": false,
        "columns": [
            {
                "index": "context",
                "name": "context",
                "label": "Name",
                "width": 120,
                "formatter": showSubtitle,
                "groupBy": "true",
                "header-help": {
                    "content": getNameHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "name": "name",
                "label": "Name",
                "width": 120,
                "hideHeader": "true",
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "remote": {
                        "url": buildRemoteValidationUrl, //should return url string
                        "type": "GET",
                        "response": processResponse, //should return boolean: true: isValid
                        "error": "Name already in use"
                    },
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "searchCell": true
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "formatter": function (cellvalue) {
                    if (_.isUndefined(cellvalue)) {
                        return "";
                    }
                    return cellvalue;
                },
                "width": 50,
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
                        }
                    ]
                }
            }
        ]
    };

    var buildNameVerificationUrl = function (cellvalue) {
        var url = "/api/data-sample/client/";
        url += cellvalue;
        return url;
    };

    var getData = function (postdata) {
        var self = this;
        $.ajax({
            url: '/api/get-data',
            data: postdata,
            dataType: "json",
            complete: function (data, status) {
                var data = data.responseJSON['policy-Level1']['policy-Level2']['policy-Level3'];
                $(self).addRowData('', data);
            }
        });
    };

    var buildSearchUrl = function (value, url) {
        return url + "?searchKey=" + value + "&searchAll=true";
    };

    var formatData = function (cellvalue, options, rowObject) {
        if (cellvalue && cellvalue.length === 2) {
            return ['0.0.0.0', '1.2.3.4', '4,5,6,7'];
        }
        return cellvalue;
    };

    var formatObjectData = function (cellvalue, options, rowObject) {
//        console.log(rowObject);
        return cellvalue;
    };

    //sets the status of the action menu items asynchronously by using the updateStatusSuccess callback
    var setCustomActionStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
        //console.log(selectedRows); //commented out to avoid error in mocha related to: "JSON.stringify cannot serialize cyclic structures."
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                updateStatusSuccess({
//                    "edit": selectedRows.isRowEnabled ? true : false,
                    "testCollapse": selectedRows.numberOfSelectedRows < 3 ? true : false,
                    "testHelp": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "testPurge": selectedRows.numberOfSelectedRows > 2 ? true : false,
                    "testPublishGrid": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "testSaveGrid": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "testCloseGrid": selectedRows.numberOfSelectedRows > 1 ? true : false,
                    "customCheckboxAction": selectedRows.numberOfSelectedRows < 2 ? true : false,
                    "dropdownKey": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "customLinkAction": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "subMenu": selectedRows.numberOfSelectedRows == 1 ? true : false
                });
            },
            error: function () {
                updateStatusError("Update in the action status FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
            }
        });
    };

    //sets the status of the items in the context menu and more menu asynchronously by using the updateStatusSuccess callback
    var setContextMenuStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
        var isRowEditable = !(~selectedRows.selectedRowIds.indexOf('183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'));
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                updateStatusSuccess({
                    "edit": selectedRows.numberOfSelectedRows == 1 && selectedRows.isRowEnabled && isRowEditable ? true : false,
                    "copy": selectedRows.numberOfSelectedRows > 2 ? true : false,
                    "testPublishGrid": selectedRows.numberOfSelectedRows == 1 ? true : false,
                    "disableHitEvent": selectedRows.numberOfSelectedRows > 1 ? true : false,
                    "subMenus": selectedRows.numberOfSelectedRows > 0 ? true : false,
                    "subMenu4": selectedRows.numberOfSelectedRows > 3 ? true : false,
                    "cellMenu11": selectedRows.numberOfSelectedRows > 2 ? false : true
                });
            },
            error: function () {
                updateStatusError("Update in the status of the context menu items FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
            }
        });
    };

    var setItemStatus = function (key, isItemDisabled, selectedRows) {
        if (key == 'resetHitEvent') isItemDisabled = true;
        else if (key == 'disableHitEvent' && selectedRows.length > 0) isItemDisabled = false;
        if (key == 'subMenu4') isItemDisabled = true;
        return isItemDisabled;
    };

    var setCustomMenuStatusAdd = function (key, isItemDisabled, selectedRows) {
        if (key == 'createMenu2') isItemDisabled = true;
        return isItemDisabled;
    };

    var setCustomMenuStatusSplit = function (key, isItemDisabled, selectedRows) {
        return isItemDisabled;
    };

    var setShowHideColumnSelection = function (columnSelection) {
        columnSelection['from-zone-name'] = false; //hides the from-zone-name column by default
        columnSelection['to-zone-name'] = false; //hides the from-zone-name column by default
        return columnSelection;
    };

    var updateShowHideColumnSelection = function (columnSelection) {
        console.log(columnSelection);
    };

    var setCustomTextAreaElement = function (cellvalue, options) {
        var $textarea = $("<textarea>");
        $textarea.val(cellvalue);
        return $textarea[0];
    };

    var getCustomTextAreaValue = function (elem, operation) {
        return $(elem).val();
    };

    var actionCustomDropdown;

    var getCustomDropdownElement = function (cellvalue, options, rowObject) {
        var actionDropDownData = [
            {
                "id": "permit",
                "text": "permit"
            },
            {
                "id": "deny",
                "text": "deny"
            }
        ];
        var $span = $('<div><select class="celldropdown"></select></div>');
        actionCustomDropdown = new DropDownWidget({
            "container": $span.find('.celldropdown'),
            "data": actionDropDownData,
            "placeholder": "Select an option",
            "enableSearch": true
        }).build();
        actionCustomDropdown.setValue(cellvalue);
        return $span[0];
    };

    var getCustomDropdownValue = function (element, operation) {
        return actionCustomDropdown.getValue();
    };

    var applicationDropDownData = [
        {
            "id": "ike",
            "text": "IKE"
        },
        {
            "id": "ftp",
            "text": "FTP"
        },
        {
            "id": "tcp",
            "text": "TCP"
        }
    ];


    var isRowEditable = function (rowId) {
        var rows = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'];
        if (rows.indexOf(rowId) != -1)
            return false;
        return true;
    };

    var setTooltipData = function (rowData, rawData, setTooltipDataCallback) {
//      console.log(rowData);

        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                setTooltipDataCallback(data.address, {
                    "key": "ip-prefix",
                    "label": {
                        "unformat": "name",
                        "formatter": function (currentData) {
                            return "<div>" + currentData.name + "</div>";
                        }
                    },
                    "clickHandler": function (item) {
                        console.log(item);
                    }
                });
            }
        });
    };

    var setTooltipDataLabel = function (rowData, rawData, setTooltipDataCallback) {
//        console.log(rowData);

        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                setTooltipDataCallback(data.address, {
                    "key": "ip-prefix",
                    "label": "name",
                    "clickHandler": function (item) {
                        console.log(item);
                    }
                });
            }
        });
    };

    var formatCollapseCell = function ($cell, cellvalue, options, rowObject) {
        $cell.find('.slipstreamgrid_cell_item').addClass('newStyle');
        return $cell;
    };

    var formatCollapseCellItem = function ($item, cellvalue, itemvalue, options, rowObject) {
        if (options.colModel.name == "source-address" && itemvalue == "Sircon_Group"){
            $item.prepend("<span class= 'newIcon'></span>");
        }
        return $item;
    };

    var unformatCollapseCell = function (originalContent, cellvalue, options, rowObject) {
        return originalContent;
    };

    var formatObjectCell = function ($cell, cellvalue, options, rowObject) {
//        $($cell[1]).find('.cellContentWrapper .cellContentBlock').attr('title',rowObject.name).addClass('tooltip');
        return $cell;
    };

    var formatObjectCellItem = function ($item, cellvalue, itemvalue, options, rowObject) {
        if (itemvalue['idp']){
            $item.prepend("<span class= 'newIcon'></span>");
        }
        return $item;
    };

    var unformatObjectCell = function (originalContent, cellvalue, options, rowObject) {
        return originalContent;
    };

    var reformatUrl = function (originalUrl) {
        console.log(originalUrl);
        if (originalUrl.sord) {
            var sord = originalUrl.sord;
            delete originalUrl.sord;
            originalUrl.sOrd = sord;
        }
        originalUrl.test = "123";
        return originalUrl;
    };

    var deleteRowMessage = function (selectedRows) {
        return "Are you sure you want to delete " + selectedRows.numberOfSelectedRows + " rule(s) for the Firewall Policies grid?";
    };

    //performs the row deletion by an asynchronous calls. In case of success, the success callback should be invoked and in case of failure, the error callback should be used.
    var deleteRow = function (selectedRows, success, error) {
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                success();
            },
            error: function () {
                error("Row deletion FAILED. " + selectedRows.numberOfSelectedRows + "were not deleted");
            }
        });
    };

    var onClearAllTokens = function () {
        console.log("All Tokens are cleared");
    };
    var onBeforeSearch = function (tokens) {
        var newTokens = [],
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
                        token = "(jun = 3 or jun eq 5)";
                        break;
                    default:
                        token = "jun eq 'all'"
                }
            }
            newTokens.push(token);
        });
        console.log(newTokens);
        return newTokens;
    };

    var getCustomActionHtml = function (actionKey) {
        if (actionKey == "customCheckboxAction") {
            return {
                "default": "<input id='action-checkbox' type='checkbox'><label for='action-checkbox'>Only events 1</label>",
                "disabled": "<input id='action-checkbox' type='checkbox' disabled><label for='action-checkbox'><label>Only events 1</label>"
            };
        }
        return {
            "default": "<a>CustomActiOn</a>",
            "hover": "<a>CustOmAction</a>",
            "disabled": "<label>CustomActiOn<label>"
        };
    };

    var getColumnLabelFormatter = function (columnName, column) {
        return "<span class='column-label-wrapper'><input type='checkbox' value='"+ columnName + "'/> <label>Custom: <b>"+ columnName +"<b/></label></span>";
    };

    var getColumnLabelUnformat = function (columnName, column) {
        switch (columnName) {
            case "application-services":
                return "Application Services";
            case "description":
                return "Description";
        }
        return "Not Defined";
    };

    configurationSample.simpleGrid = {
        "title": "Simple Grid Sample Page",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "subTitle": "Subtitle for a Grid Long Long Long Long", //string
//        "subTitle": { //obj
//            "content": "Subtitle for a Grid",
//            "help": {
//                "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
//                "ua-help-text": "More..",
//                "ua-help-identifier": "alias_for_ua_event_binding"
//            }
//        },
//        "subtitle": subTitleView, //view
        "refresh": {
            tooltipText: "Click Me!"
        },
//        "tableId":"test1",
//        "urlMethod": "POST", //default: "GET"
        "url": "/api/get-data", //option 1 to be used with jsonRoot
//        "reformatUrl": reformatUrl,
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
//        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
//        "jsonRoot": "policy",
//        "getData": getData, //option 2
        "jsonId": "name",
//       "showRowNumbers": true,
        "multiselect": true,
        "height": 'auto',
//        "height": 300, //could be "auto" or percentage ("50%")
        "scroll": true,
        "numberOfRows": 40,
        "emptyCell":{
            label: "<span>--</span>",
            tooltip: "configuration is from the grid level"
        },
        // "autoPageSize": false, //by default true, the pageSize is set to fit 50 rows or more, with this property disabled (off), a smaller page size is allowed
        "jsonRecords": function (data) {
            return data && data['policy-Level1'] && data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        //noResultMessage:"No data available",
        noResultMessage: function () {
            return "No data available";
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//        "editRow": {
//            "showInline": true,
//            "isRowEditable": isRowEditable
//        },
        "deleteRow": {
//            "onDelete": deleteRow,
//            "autoRefresh": true,
            "message": deleteRowMessage
        },
        "onSelectAll": rowSelectConfiguration.getRowIds,
        "actionButtons": {
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
////                "delete": {
////                    "label": "Delete",
////                    "key": "editMenu",
////                    "items": [{
////                        "label":"Open grid overlay",
////                        "key":"createMenu1"
////                    },{
////                        "label":"Create Menu2",
////                        "key":"createMenu2"
////                    }],
////                    "disabledStatus": true, //default status is false
////                    "statusCallback": setCustomMenuStatusAdd
////                }
//                "delete": {
//                    "button_type": true,
//                    "label": "Publish",
//                    "key": "deleteButton",
//                    "disabledStatus": false
//                },
//                "edit": {
//                    "icon_type": true,
//                    "label": "Close",
//                    "icon": {
//                        default: "icon_archive_purge-bg",
//                        hover: "icon_archive_purge_hover-bg",
//                        disabled: "icon_exit_filters_disable"
//                    },
//                    "disabledStatus": false,
//                    "key": "editIcon"
//                }
//        },
            "customButtons": [
                {
                    "custom_type": true, //should be able to return label, selected value, items, width -might be from width()-
                    "formatter": getCustomActionHtml, //callback that should return Object with html to be used in the action container, default property is a required field
                    "key": "customCheckboxAction"
                },
                {
                    "dropdown_type": true,
                    "label": "Group by",
                    "key": "dropdownKey",
                    "disabledStatus": true, //default status is false
                    "items": [
                        {
                            "label": "None",
                            "key": "noneDropdown",
                            "selected": true
                        },
                        {
                            "label": "One",
                            "key": "oneDropdown"
                        },
                        {
                            "label": "Many",
                            "key": "manyDropdown"
                        }
                    ]
                },
                {
                    "custom_type": true, //should be able to return label, selected value, items, width -might be from width()-
                    "formatter": getCustomActionHtml, //callback that should return Object with html to be used in the action container, default property is a required field
                    "unformat": function ($el) {console.log($el[0]); return "Custom Action";}, //string to be used in the more menu
                    "key": "customLinkAction",
                    // "disabledStatus": true//default status is false
                },
                {
                    "icon_type": true,
                    "label": "Collapse",
                    "icon": {
                        "default": {
                            "icon_url": "#icon_collapse_all",
                            "icon_class": "icon_collapse_all-dims",
                        }
                    },
                    // "disabledStatus": true, //default status is false
                    "key": "testCloseGrid"
                },
                {
                    "icon_type": true,
                    "label": "Test help",
                    "icon": {
                        "default": {
                            "icon_url": "#icon_help_utility",
                            "icon_class": "icon_help_utility-dims",
                            "icon_color": "icon_help_utility_test"//optional, value is a class intended to override default icon color
                        },
                        "hover": "icon_help_utility_hover_test",
                        "disabled": "icon_help_utility_disabled_test"
                    },
                    "disabledStatus": true,//default status is false
                    "key": "testCloseGrid1"
                },
                {
                    "icon_type": true,
                    "label": "Purge",
                    "icon": "icon_archive_purge-bg",
                    "disabledStatus": true,//default status is false
                    "key": "testPurge"
                },
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status is false
                },
                {
                    "menu_type": true,
                    "label": "Grids on Overlay",
                    "key": "subMenu",
                    "disabledStatus": true, //default status is false
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
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Add row",
                            "key": "subMenu4"
                        }
                    ],
                    "statusCallback": setCustomMenuStatusSplit
                },
                {
                    "button_type": true,
                    "label": "Open Panel",
                    "key": "openPanel"
//                    "secondary": true
                }
            ],
            "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "enable": "Enable Rule",
            "disable": "Disable Rule",
//            "createBefore": "Create Row Before",
//            "createAfter": "Create Row After",
            "edit": "Edit Row",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom": [
                { //user should bind custom key events
                    "label": "Reset Hit Count",
                    "key": "resetHitEvent" //isDisabled property available to set status of individual items by a callback
                },
                {
                    "label": "Clear Search Element",
                    "key": "clearSearchEvent"
                },
                {
                    "label": "Disable Hit Count",
                    "key": "disableHitEvent"
                },
                {
                    "label": "Update Action Status",
                    "key": "updateActionStatusEvent"
                },
                {
                    "label": "Select a row",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Reload Grid",
                    "key": "reloadGrid"
                },
                {
                    "label": "Reset selection and reload grid",
                    "key": "resetReloadGrid"
                },
                {
                    "label": "Grid on Overlay",
                    "key": "subMenus",
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
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Delete rows with reset",
                            "key": "deleteRows"
                        },
                        {
                            "label": "Delete rows w/o reset",
                            "key": "deleteRowsWithoutReset"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Add row",
                            "key": "subMenu4"
                        }
                    ]
                }
            ]
        },
//        "contextMenuItemStatus": setItemStatus,
        "contextMenuStatusCallback": setContextMenuStatus,
        "filter": {
            searchUrl: true,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
            // readOnlySearch: {
            //     logicOperator: "or"
            // },
            onBeforeSearch: onBeforeSearch,
            onClearAllTokens: onClearAllTokens,
            // advancedSearch: {
            //     "filterMenu": searchConfiguration.filterMenu,
            //     "logicMenu": searchConfiguration.logicMenu
            //     },
            noSearchResultMessage: "There are no search results found",
            columnFilter: true,
            showFilter: {
                customItems: [
                    {
                        "label": "Custom Item 1",
                        "key": "juniperCustom"
                    },
                    {
                        "label": "Custom Item 2",
                        "key": "nonJuniperCustom"
                    }
                ],
                quickFilters: [
                    {
                        "label": "Only Juniper devices",
                        "key": "juniper"
                    },
                    {
                        "label": "Only non-Juniper devices",
                        "key": "nonJuniper"
                    }
                ]
            },
            optionMenu: {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
                },
                "customItems": [
                    { //user should bind custom key events
                        "label": "Export Grid",
                        "key": "exportGrid",
                        "items": [
                            {
                                "label": "Export to PDF",
                                "key": "exportSubMenu1"
                            },
                            {
                                "label": "Export to CSV",
                                "key": "exportSubMenu2"
                            },
                            {
                                "separator": "true"
                            },
                            {
                                "label": "Export to XML",
                                "key": "exportSubMenu3"
                            }
                        ]
                    },
                    {
                        "label": "Share Grid",
                        "key": "shareGrid"
                    },
                    {
                        "label": "Print Grid",
                        "key": "printGrid"
                    }
                ],
                "statusCallback": setCustomMenuStatusSplit
            }
        },
//        "sorting": false,
        "sorting": [
            {
                "column": "name",
                "order": "asc" //asc,desc
            },
            {
                "column": "sourceAddress",
                "order": "desc" //asc,desc
            }
        ],
//        "dragNDrop": {
//            moveRow: {
//                afterDrop: rowDropCallback
//            }
//        },
        "columns": [
            {
//                "index": "Name",
                "name": "name",
                "label": "Name",
                "width": "200",
                "internal": true,
                "formatter": createLink,
                "unformat": undoLink,
                "createdDefaultValue": 'test',
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "post_validation": "postValidation",
                    "pattern": "^[a-zA-Z0-9_\-]+$",
                    "error": "Enter alphanumeric characters, dashes or underscores"
                },
                "searchCell": true,
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
//                    "searchCell": "Search Cell",
                    "custom": [
                        { //user should bind custom key events
                            "label": "Search Cell",
                            "key": "cellMenu11"
                        },
                        {
                            "label": "Cell Menu 12",
                            "key": "cellMenu12"
                        },
                        {
                            "label": "Cell Sub Menu",
                            "key": "cellSubMenu1",
                            "items": [
                                {
                                    "label": "Cell Sub Menu 11",
                                    "key": "cellSubMenu11"
                                },
                                {
                                    "label": "Cell Sub Menu 12",
                                    "key": "cellSubMenu12"
                                }
                            ]
                        }
                    ]
                },
                "frozen": true
            },
            {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "internal": false,
                "hidden": true,
                "frozen": true,
                "showInactive": true
            },
            {
                "index": "sourceZone",
                "name": "from-zone-name",
                "label": "Source Zone",
                "createdDefaultValue": 'untrust-inet',
                "width": "100",
                "hidden": true,
                "frozen": true,
                "editCell": {
                    "type": "custom",
                    "element": setCustomTextAreaElement,
                    "value": getCustomTextAreaValue
                }
            },
            {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": "200",
                // "frozen": true,
                "hidden": false,
                "collapseContent": {
//                    "formatData": formatData,
                    "formatCell": formatCollapseCell,
                    "unformatCell": unformatCollapseCell,
                    "formatCellItem": formatCollapseCellItem
//                    "multiselect": true
                },
                "createdDefaultValue": "any",
                "searchCell": {
                    "type": 'dropdown',
                    "values": [
                        {
                            "label": "IP_CONV_204.17.79.60",
                            "value": "1"
                        },
                        {
                            "label": "IP_SEC_204.17.79.60 and IP_SEC_204.17.79.61",
                            "value": "close or client and server"
                        },
                        {
                            "label": "IP_TRE_204.17.79.60",
                            "value": "3"
                        },
                        {
                            "label": "IP_TRE_96.254.162.106",
                            "value": "4"
                        }
                    ]
                },
                "group": "addresses",
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
//                    "searchCell": "Search Cell",
                    "custom": [
                        { //user should bind custom key events
                            "label": "Cell Menu 21",
                            "key": "cellMenu21"
                        },
                        {
                            "label": "Cell Menu 22",
                            "key": "cellMenu22"
                        },
                        {
                            "label": "Cell Sub Menu",
                            "key": "cellSubMenu2",
                            "items": [
                                {
                                    "label": "Cell Sub Menu 21",
                                    "key": "cellSubMenu21"
                                },
                                {
                                    "label": "Cell Sub Menu 22",
                                    "key": "cellSubMenu22"
                                }
                            ]
                        }
                    ]
               }
            },
            {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent": {
                    "moreTooltip": setTooltipData,
                    "key": "label"
                },
                "width": "200",
                "createdDefaultValue": "any",
                "searchCell": {
                    "type": "number"
                },
                "group": "addresses"
            },
            {
                "index": "destinationZone",
                "name": "to-zone-name",
                "label": "Destination Zone",
                "createdDefaultValue": 'untrust-inet',
                "width": "100",
                "editCell": {
                    "type": "input",
                    "pattern": "length",
                    "min_length": "2",
                    "max_length": "10",
                    "error": "Must be between 2 and 10 characters."
                }
//                "editCell":{
//                    "type": "input",
//                    "pattern": "hasnotspace",
//                    "error":"Spaces are not allowed"
//                }
            },
            {
                "index": "Application",
                "name": "application",
                "label": "Application Application",
                "width": "100",
                "collapseContent": {
                    "moreTooltip": setTooltipDataLabel
                },
                "emptyCell":{
                    label: "----",
                    tooltip: "configuration is from the colum level"
                },
                "createdDefaultValue": "any",
                "header-help": {
                   "content": getApplicationHelp,
                   "ua-help-text": "More..",
                   "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                },
                "searchCell": {
                    "type": 'dropdown',
                    "checkbox": false,
                    "enableSearch": false,
                    "remoteData": {
                        "url": "/api/dropdown/getRemoteData",
                        "numberOfRows": 10,
                        "jsonRoot": "data",
                        "jsonRecords": function (data) {
                            return data.data;
                        },
                        "success": function (data) { console.log("call succeeded" + JSON.stringify(data.data)) },
                        "error": function () { console.log("error while fetching data") }
                    }
                }
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": {
                    "formatter" : getColumnLabelFormatter,
                    "unformat" : getColumnLabelUnformat
                },
                "width": "220",
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable,
//                    "formatData": formatObjectData,
                    "formatObjectCell": formatObjectCell,
                    "unformatObjectCell": unformatObjectCell,
                    "formatObjectCellItem": formatObjectCellItem
                },
                "editCell": false, //only applicable to inline editing
//                "header-help": {
//                    "content": getServicesHelp,
//                    "ua-help-text": "More..",
//                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
//                },
                "searchCell": true
//                "searchCell": {
//                    "searchoptions": {
//                        dataInit: function (element) {
//                            new DropDownWidget({
//                                "container": element,
//                                "data": applicationDropDownData,
//                                "enableSearch": true,
//                                "multipleSelection": true
//                            }).build();
//                        }
//                    }
//                }
            },
            {
                "index": "action",
                "name": "action",
                "label": "Action",
                "width": 150,
                "group": "test-sequence",
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
                        }
                    ]
                }
            },
            {
//                "index": "action",
//                "name": "action",
//                "label": "Action",
//                "width": "100",
//                "editCell":{
//                    "type": "custom",
//                    "element":getCustomDropdownElement,
//                    "value":getCustomDropdownValue
//                }
//            }, {
                "index": "Date",
                "name": "date",
                "label": "Date",
                "width": "100",
                "type": "date",
                "searchCell": {
                    "type": "date"
                },
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Row Before",
                    "searchCell": "Search Cell"
                },
                "sortable": false,
                "group": "test-sequence"
            },
            {
                "index": "description",
                "name": "description",
                "label": {
                    "formatter" : getColumnLabelFormatter,
                    // "unformat" : getColumnLabelUnformat
                },
                "width": 200,
                "sortable": false,
                "collapseContent": {
                    "singleValue": true
                },
                "frozen": true,
                "searchCell": true,
                "group": "test-sequence"
            }
        ]
    };

    var formatDescriptionCell = function (cellValue, options, row) {
        return cellValue || "-";
    };

    var formatObject = function (cell, cellValue, options, rowObject) {
        return cell || "-";
    };

    var enableModelViewRowInteraction = function (rowId, rowData) {
        var rowIds = ["P1_190002-INS_to_Sircon_drop_em", "P1_196001-VPN_Cleanup_rule__IPSec_1", "P2_190002-INS_to_Sircon_drop_em", "P1_AA_190002-INS_to_Sircon_drop_em", "P1_AA_196001-VPN_Cleanup_rule__IPSec_1", "P2_AA_190002-INS_to_Sircon_drop_em"];
        if (~rowIds.indexOf(rowId)) {
            console.log(rowData);
            return false;
        }
        return true;
    };

    configurationSample.modelViewGrid = {
        "title": "Firewall Policies with a Backbone Collection",
        "height": 'auto',
        "multiselect": true,
        "enabledRowInteraction": enableModelViewRowInteraction,
        "scroll": true,
        "jsonRecords": function (data) {
            return (data && data[0] && data[0]['junos:total']) || 0;
        },
        "jsonId": "name",
        "numberOfRows": 48,
        "autoPageSize": false, //by default true, the pageSize is set to fit 50 rows or more, with this property disabled (off), a smaller page size is allowed
        "createRow": {
            "addLast": true,
            "showInline": true
        },
        "editRow": {
            "showInline": true
        },
        "rowMaxElement": {
            // "collapse": 2,
            "expand": 3,
            "edit": 3 //applies only for inline editing
        },
//        "onSelectAll": false,
        "onSelectAll": rowSelectConfiguration.getAllRowIdsTwoPages,
        "actionButtons": {
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
//        },
            "customButtons": [
                {
                    "icon_type": true,
                    "label": "Close",
                    // "icon": "icon_exit_filters_hover",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
//                    "disabledStatus": true, //default status is false
                    "key": "testCloseGrid"
                },
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status is false
                },
                {
                    "button_type": true,
                    "label": "Save",
                    "key": "testSaveGrid",
                    "secondary": true,
                    "disabledStatus": true //default status is false
                }
            ]
//            "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "edit": "Edit Row",
            "enable": "Enable Rule",
            "disable": "Disable Rule",
            "createBefore": "Create Row Before",
            "createAfter": "Create Row After",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "custom": [
                { //user should bind custom key events
                    "label": "Edit Programmatically",
                    "key": "addEditProgrammatically"
                },
                {
                    "label": "Remove Edit Programmatically",
                    "key": "removeEditProgrammatically"
                },
                {
                    "label": "Reload Data",
                    "key": "reloadData"
                },
                {
                    "label": "Update Action Status Off",
                    "key": "updateActionStatusOff"
                },
                {
                    "label": "Update Action Status On",
                    "key": "updateActionStatusOn"
                },
                {
                    "label": "Toggle Selection",
                    "key": "toggleRowSelection"
                }
            ]
        },
        "rowHoverMenu": {
           "defaultButtons": { //overwrite default CRUD grid buttons
           //     "edit": false,
               "delete": {
                   "icon_type": true,
           //         "label": "CustomEdit",
           //         "key": "customEditOnRowHover",
           //         "disabledStatus": true //default status is false
               }
           },
            "customButtons": [
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishHover",
                    // "disabledStatus": true //default status is false
                },
                {
                    "icon_type": true,
                    "label": "Clone",
                    "key": "testCloneHover",
//                    "icon": "icon_clone_blue"
//                     "disabledStatus": true,// default status: false
                    "icon": {
                        default: "icon_clone_blue",
                        disabled: "icon_clone_disabled"
                    }
                },
                {
                    "label": "Info",
                    "key": "testInfoHover",
                    "disabledStatus": true,//default status if false
                    // "icon": {
                    //     default: "icon_info",
                    //     disabled: "icon_info_disabled"
                    // }
                }
            ]
        },
//         "rowHoverMenu": function () {
//             return {
//                 "customButtons": [
//                     {
//                         "icon_type": true,
//                         "label": "Clone",
//                         "key": "testCloneHover",
//                         "icon": "icon_info_hover"
//                     },
//                     {
//                         "label": "Info",
//                         "key": "testInfoHover",
//                         "disabledStatus": true, //default status is false
//                         "icon": {
//                             default: "icon_info_hover",
//                             disabled: "icon_info_disabled"
//                         }
//                     }
//                 ]
//             };
//         },
        "contextMenuItemStatus": setItemStatus,
        "filter": {
//            advancedSearch: {
//                "filterMenu": searchConfiguration.filterMenu,
//                "logicMenu": searchConfiguration.logicMenu
//            },
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
                    }
                ]
            },
            optionMenu: {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
                },
                "customItems": [
                    { //user should bind custom key events
                        "label": "Export Grid",
                        "key": "exportGrid",
                        "items": [
                            {
                                "label": "Export to PDF",
                                "key": "exportSubMenu1"
                            },
                            {
                                "label": "Export to CSV",
                                "key": "exportSubMenu2"
                            },
                            {
                                "separator": "true"
                            },
                            {
                                "label": "Export to XML",
                                "key": "exportSubMenu3"
                            }
                        ]
                    },
                    {
                        "label": "Share Grid",
                        "key": "shareGrid"
                    },
                    {
                        "label": "Print Grid",
                        "key": "printGrid"
                    }
                ],
                "itemStatusCallback": setCustomMenuStatusSplit
            }
        },
        "showWidthAsPercentage": false,
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "hideHeader": "true",
                "formatter": createInlineLink,
                "unformat": undoLink,
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "group": "no-sequence",
                "searchCell": true
            },
            {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive": "true"
            },
            {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "group": "no-sequence",
                "searchCell": {
                    "type": 'dropdown',
                    "values": [
                        {
                            "label": "IP_CONV_204.17.79.60",
                            "value": "1"
                        },
                        {
                            "label": "IP_SEC_204.17.79.60",
                            "value": "2"
                        },
                        {
                            "label": "IP_TRE_204.17.79.60",
                            "value": "3"
                        },
                        {
                            "label": "IP_TRE_96.254.162.106",
                            "value": "4"
                        }
                    ]
                }
            },
            {
                "index": "condition",
                "name": "condition",
                "label": "Condition",
                "width": 260,
                "collapseContent": true,
                "group": "condition-address",
                "editCell": {
                    "type": "dropdown",
                    "values": [
                        {
                            "label": "Condition_001",
                            "value": "condition_001"
                        },
                        {
                            "label": "Condition_002",
                            "value": "condition_002"
                        },
                        {
                            "label": "Condition_003",
                            "value": "condition_003"
                        },
                        {
                            "label": "Condition_004",
                            "value": "condition_004"
                        },
                        {
                            "label": "Condition_005",
                            "value": "condition_005"
                        },
                        {
                            "label": "Condition_006",
                            "value": "condition_006"
                        }
                    ]
                },
                "searchCell": true
            },
            {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent": {
                    "formatData": formatData
                },
                "width": 260,
                "createdDefaultValue": "any",
                "group": "condition-address",
                "editCell": {
                    "type": "input"
                },
                "searchCell": {
                    "type": "number"
                }
            },
            {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": 260,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "header-help": {
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "index": "description",
                "name": "description",
                "label": "Description",
                "width": 140,
                "sortable": false,
                "group": "description",
                "collapseContent": {
                    // "name": "name",
                    "formatData": formatDescriptionCell,
                    "formatCell": formatObject,
                    "overlaySize": "small",
                    "singleValue": true
                },
                "searchCell": true
            },
            {
                "index": "description2",
                "name": "description2",
                "label": "Description2",
                "group": "description",
                "editCell": { //placeholder: https://localhost
                    "type": "input",
                    "pattern": /^(http(s?):[/][/])(www\.)?(\S)+$/,
                    "error": "Error-Ex: https://localhost"
                }
            },
            {
                "index": "Date",
                "name": "date",
                "label": "Date",
                "width": "100",
                "searchCell": {
                    "type": "date"
                }
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 360,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable,
                    "formatData": formatObjectData
                },
                "editCell": false,
                "header-help": {
                    "content": getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
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
                        }
                    ]
                }
            }
        ]
    };
    configurationSample.modelViewGrid_queryBuilder = {
        "title": "Firewall Policies with a Backbone Collection",
        "height": 'auto',
        "multiselect": true,
        "scroll": true,
        "jsonRecords": function (data) {
            return (data && data[0] && data[0]['junos:total']) || 0;
        },
        "jsonId": "name",
        "numberOfRows": 48,
        "autoPageSize": false,
        "createRow": {
            "addLast": true,
            "showInline": true
        },
        "editRow": {
            "showInline": true
        },
        "onSelectAll": rowSelectConfiguration.getAllRowIdsTwoPages,
        "actionButtons": {
            "customButtons": [
                {
                    "icon_type": true,
                    "label": "Close",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "key": "testCloseGrid"
                },
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status is false
                }
            ]
        },
        "contextMenu": {
            "edit": "Edit Row",
            "delete": "Delete Row",
            "custom": [
                { //user should bind custom key events
                    "label": "Edit Programmatically",
                    "key": "addEditProgrammatically"
                }
            ]
        },
        "contextMenuItemStatus": setItemStatus,
        "filter": {
            //  searchUrl: true,
            advancedSearch: {
                "queryBuilder" : true,
                "filterMenu": queryBuilderConfiguration.modelGridSearchConf.filterMenu,
                "logicMenu": queryBuilderConfiguration.modelGridSearchConf.logicMenu,
                "save": [{
                    "label": "Save Filter",
                    "key": "saveFilter"
                }, {
                    "label": "Create Monitor",
                    "key": "createMonitor"
                }, {
                    "label": "Create Alert",
                    "key": "createAlert"
                }]
            },
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
                    }
                ]
            },
            optionMenu: {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
                },
                "itemStatusCallback": setCustomMenuStatusSplit
            }
        },
        "showWidthAsPercentage": false,
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": 300,
                "hideHeader": "true",
                "formatter": createInlineLink,
                "unformat": undoLink,
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "pattern": "hasnotspace",
                    "error": "Spaces are not allowed"
                },
                "group": "no-sequence",
                "searchCell": true
            },
            {
                "index": "inactive",
                "name": "inactive",
                "label": "Inactive",
                "hidden": true,
                "showInactive": "true"
            },
            {
                "index": "sourceAddress",
                "name": "source-address",
                "label": "Source Address",
                "width": 260,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "group": "no-sequence",
                "searchCell": {
                    "type": 'dropdown',
                    "values": [
                        {
                            "label": "IP_CONV_204.17.79.60",
                            "value": "1"
                        },
                        {
                            "label": "IP_SEC_204.17.79.60",
                            "value": "2"
                        },
                        {
                            "label": "IP_TRE_204.17.79.60",
                            "value": "3"
                        },
                        {
                            "label": "IP_TRE_96.254.162.106",
                            "value": "4"
                        }
                    ]
                }
            },
            {
                "index": "condition",
                "name": "condition",
                "label": "Condition",
                "width": 260,
                "collapseContent": true,
                "group": "condition-address",
                "editCell": {
                    "type": "dropdown",
                    "values": [
                        {
                            "label": "Condition_001",
                            "value": "condition_001"
                        },
                        {
                            "label": "Condition_002",
                            "value": "condition_002"
                        },
                        {
                            "label": "Condition_003",
                            "value": "condition_003"
                        },
                        {
                            "label": "Condition_004",
                            "value": "condition_004"
                        },
                        {
                            "label": "Condition_005",
                            "value": "condition_005"
                        },
                        {
                            "label": "Condition_006",
                            "value": "condition_006"
                        }
                    ]
                },
                "searchCell": true
            },
            {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent": {
                    "formatData": formatData
                },
                "width": 260,
                "createdDefaultValue": "any",
                "group": "condition-address",
                "editCell": {
                    "type": "input"
                },
                "searchCell": {
                    "type": "number"
                }
            },
            {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": 260,
                "collapseContent": true,
                "createdDefaultValue": "any",
                "header-help": {
                    "content": getApplicationHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
            },
            {
                "index": "description",
                "name": "description",
                "label": "Description",
                "width": 140,
                "sortable": false,
                "group": "description",
                "collapseContent": {
                    // "name": "name",
                    "formatData": formatDescriptionCell,
                    "formatCell": formatObject,
                    "overlaySize": "small",
                    "singleValue": true
                },
                "searchCell": true
            },
            {
                "index": "description2",
                "name": "description2",
                "label": "Description2",
                "group": "description",
                "editCell": { //placeholder: https://localhost
                    "type": "input",
                    "pattern": /^(http(s?):[/][/])(www\.)?(\S)+$/,
                    "error": "Error-Ex: https://localhost"
                }
            },
            {
                "index": "Date",
                "name": "date",
                "label": "Date",
                "width": "100",
                "searchCell": {
                    "type": "date"
                }
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": 360,
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable,
                    "formatData": formatObjectData
                },
                "editCell": false,
                "header-help": {
                    "content": getServicesHelp,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                }
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
                        }
                    ]
                }
            }
        ]
    };

    configurationSample.smallGrid = {
        "title": "Single Row Selection",
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "singleselect": true,
        "sorting": false,
        "onSelectAll": false,
        // "showWidthAsPercentage": false,
        "noResultMessage": "Data is not available",
        "columns": [
            {
                "name": "name",
                "label": "Name"
            },
            {
                "name": "note",
                "label": "Note"
            },
            {
                "name": "amount",
                "label": "Amount"
            }
        ]
    };

    configurationSample.listGrid = {
        "title": "List Grid",
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "sorting": false,
        "onSelectAll": false,
        "viewType": "card",
        "numberOfRows": 7,
        "height" : '250',
        "footer": false,
        "tableId": "listGrid",
        "noResultMessage": "Data is not available",
        "columns": [
            {
                "name": "id",
                "label": "",
                "width": 50,
                "formatter" : function(cellvalue, options, rowObject) {
                    return "<span class = 'listGrid_id'>"+ cellvalue+"</span>";
                }
            },
            {
                "name": "name",
                "label": "Name"
            },
            {
                "name": "amount",
                "label": "Amount"
            }
        ]
    };

    configurationSample.getDataGrid = {
        "title": "Get Data Grid",
        "getData": function () {},
        "jsonRoot": "policy",
        "multiselect": true,
        "filter": {
            searchUrl: true,
            noSearchResultMessage: "There are no search results found",
            "optionMenu": {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection
                }
            }
        },
        "footer": true,
        "onSelectAll": false,
        "showWidthAsPercentage": false,
        "noResultMessage": "Data is not available",
        "columns": [
            {
                "name": "name",
                "label": "Name"
            },
            {
                "name": "note",
                "label": "Note"
            },
            {
                "name": "amount",
                "label": "Amount"
            }
        ]
    };

    configurationSample.getSetGrid = {
        "filter": {
            "optionMenu": {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection
                }
            }
        },
        "title": "Get / Set Column Properties",
        "url": "/assets/js/widgets/grid/tests/dataSample/simpleGrid.json",
        "jsonRoot": "policy",
        "singleselect": "true",
        "showSelection": tooltipConfig,
        "sorting": false,
        "onSelectAll": false,
        "showWidthAsPercentage": false,
        "noResultMessage": "Data is not available",
        "columns": [
            {
                "name": "name",
                "label": "Name"
            },
            {
                "name": "note",
                "label": "Note"
            },
            {
                "name": "amount",
                "label": "Amount"
            }
        ]
    };

    configurationSample.reloadGrid = {
        "title": "Reload Grid",
        "url": "/api/get-data",
        "numberOfRows": 200,
        "height": "auto",
        //"jsonRoot": "policy",
        "multiselect": "true",
        "showWidthAsPercentage": false,
        "deleteRow": {
            "onDelete": deleteRow,
            "autoRefresh": true
        },
        "columns": [
            {
                "name": "name",
                "label": "Name"
            }
        ],
        "contextMenu": {
            "delete": "Delete Address",
            "create": "Create Address",
            "custom": [
                {
                    "label": "Reload grid",
                    "key": "reloadGrid"
                },
                {
                    "label": "Reset selection and reload grid",
                    "key": "resetReloadGrid"
                }
            ]
        }
    };

    configurationSample.groupGrid = {
        "title": "Job Management",
        "url": "/api/space/job-management/jobs", //needs connection to Space Server
        "ajaxOptions": {
            headers: {
                "Authorization": 'Basic c3VwZXI6am5wcjEyMyE=',
                "Accept": 'application/vnd.net.juniper.space.job-management.jobs+json;version="3";q=0.03'
            }
        },
        "jsonRoot": "jobs.job",
        "jsonId": "id",
        "jsonRecords": function (data) {
            return data.jobs['@total'];
        },
        "numberOfRows": 200,
        "scroll": 1,
        "height": 'auto',
        "multiselect": "true",
        "actionButtons": {
            "customButtons": [
                {
                    "dropdown_type": true,
                    "label": "Group by",
                    "key": "dropdownKey",
                    "items": [
                        {
                            "label": "Id and JobStatus",
                            "key": "idStatusGrouping",
                            "selected": true
                        },
                        {
                            "label": "Percent Complete",
                            "key": "percentGrouping"
                        },
                        {
                            "label": "Id",
                            "key": "idGrouping"
                        }
                    ]
                },
                {
                    "icon_type": true,
                    "label": "Expand",
                    "icon": {
                        "default": "icon_expand_all",
                        "hover": "icon_expand_all_hover",
                        "disabled": "icon_expand_all_disable"
                    },
                    "key": "expandAll"
                },
                {
                    "icon_type": true,
                    "label": "Collapse",
                    "icon": {
                        "default": "icon_collapse_all_hover",
                        "hover": "icon_collapse_all",
                        "disabled": "icon_collapse_all_disable"
                    },
                    "key": "collapseAll",
                }
            ]
        },
        "contextMenu": {
            "edit": "Edit Job",
            "custom": [
                { //user should bind custom key events
                    "label": "Get all visible rows",
                    "key": "getAllRowsEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Delete rows with reset",
                    "key": "deleteRows"
                },
                {
                    "label": "Delete rows w/o reset",
                    "key": "deleteRowsWithoutReset"
                },
                {
                    "label": "Reload grid",
                    "key": "reloadGridEvent"
                }
            ]
        },
        "sorting": [
            {
                "column": "id",
                "order": "asc" //asc,desc
//            },{
//                "column":"percent-complete",
//                "order":"desc"
            }
        ],
        "grouping": {
            "columns": [
                {
                    "column": "id",
                    "order": "desc", //asc,desc
                    "show": true,
                    "text": "Id: <b>{0}</b>"
                },
                {
                    "column": "job-status",
                    "order": "desc",
                    "show": false,
                    "text": "Status: <b>{0}</b>"
                }
            ],
            "collapse": false
        },
        "columns": [
            {
                "index": "id",
                "name": "id",
                "label": "ID",
                "width": 75
            },
            {
                "index": "name",
                "name": "name",
                "label": "Name",
                "width": 200
            },
            {
                "index": "percent-complete",
                "name": "percent-complete",
                "label": "Percent",
                "width": 75,
                "editCell": {
                    "type": "input",
                    "pattern": "float",
                    "error": "Should be a number."
                }
            },
            {
                "index": "job-status",
                "name": "job-status",
                "label": "Status",
                "width": 75
            },
            {
                "index": "job-type",
                "name": "job-type",
                "label": "Job Type",
                "width": 200
            },
            {
                "index": "summary",
                "name": "summary",
                "label": "Summary",
                "width": 250
            },
            {
                "index": "owner",
                "name": "owner",
                "label": "Owner",
                "width": 100
            }
        ]

    };

    var formatGroupData = function (cellvalue, options, rowObject) {
        if (_.isArray(cellvalue) && cellvalue.length === 1) {
            if (_.isArray(cellvalue[0]) && cellvalue[0].length === 1) {
                if (cellvalue[0][0].value == "Any") {
                    cellvalue[0][0].value = "any";
                }
            }
        }
        return cellvalue;
    };

    configurationSample.simpleGrid_cellFormatters = {
        "title": "Simple Grid Sample Page with Cell Formatters",
        "title-help": {
            "content": "Tooltip for the title of the Grid Widget<br/>1. Keyword 'NoData' in search will show the use case when API response not available<br/>2. Keyword 'PSP' in search will show filtered data.<br/>Additional information available on the <b>link</b> below",
            "ua-help-text": "More..",
            "ua-help-identifier": "alias_for_ua_event_binding"
        },
        "subTitle": "collapseContent, groupContent and user-defined formatters", //string
        "url": "/api/get-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
        "jsonId": "name",
        "multiselect": true,
        "height": 'auto', //could be auto
        "scroll": true,
        "numberOfRows": 40,
        "orderable": false,
        "jsonRecords": function (data) {
            return data && data['policy-Level1'] && data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        noResultMessage: function () {
            return "No data available";
        },
//        "createRow": {
////           "addLast":true,
//            "showInline": true
//        },
//        "editRow": {
//            "showInline": true
//            "isRowEditable": isRowEditable
//        },
//        "deleteRow": {
//            "onDelete": deleteRow,
//            "autoRefresh": true,
//            "message": deleteRowMessage
//        },
        "onSelectAll": rowSelectConfiguration.getRowIds,
        "actionButtons": {
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
////                "delete": {
////                    "label": "Delete",
////                    "key": "editMenu",
////                    "items": [{
////                        "label":"Open grid overlay",
////                        "key":"createMenu1"
////                    },{
////                        "label":"Create Menu2",
////                        "key":"createMenu2"
////                    }],
////                    "disabledStatus": true, //default status is false
////                    "statusCallback": setCustomMenuStatusAdd
////                }
//        },
            "customButtons": [
                {
                    "icon_type": true,
                    "label": "Close",
                    // "icon": "icon_exit_filters_hover",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "disabledStatus": true, //default status is false
                    "key": "testCloseGrid"
                },
                {
                    "icon_type": true,
                    "label": "Close 1",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "disabledStatus": true,//default status is false
                    "key": "testCloseGrid1"
                },
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status is false
                },
                {
                    "menu_type": true,
                    "label": "Split Action",
                    "key": "subMenu",
                    "disabledStatus": true, //default status is false
                    "items": [
                        {
                            "label": "SubMenu1 Menu1",
                            "key": "subMenu1"
                        },
                        {
                            "label": "SubMenu1 Menu2",
                            "key": "subMenu2"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "SubMenu1 Menu3",
                            "key": "subMenu3"
                        }
                    ],
                    "statusCallback": setCustomMenuStatusSplit
                },
                {
                    "button_type": true,
                    "label": "Open Panel",
                    "key": "openPanel"
//                    "secondary": true
                }
            ],
            "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "enable": "Enable Rule",
            "disable": "Disable Rule",
//            "createBefore": "Create Row Before",
//            "createAfter": "Create Row After",
            "edit": "Edit Row",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom": [
                { //user should bind custom key events
                    "label": "Reset Hit Count",
                    "key": "resetHitEvent" //isDisabled property available to set status of individual items by a callback
                },
                {
                    "label": "Disable Hit Count",
                    "key": "disableHitEvent"
                },
                {
                    "label": "Update Action Status",
                    "key": "updateActionStatusEvent"
                },
                {
                    "label": "Select a row",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Reload Grid",
                    "key": "reloadGrid"
                },
                {
                    "label": "Reset selection and reload grid",
                    "key": "resetReloadGrid"
                },
                {
                    "label": "With sub menus",
                    "key": "subMenus",
                    "items": [
                        {
                            "label": "Grid Overlay",
                            "key": "subMenu1"
                        },
                        {
                            "label": "SubMenu1 Menu2",
                            "key": "subMenu2"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "SubMenu1 Menu3",
                            "key": "subMenu3"
                        }
                    ]
                }
            ]
        },
//        "contextMenuItemStatus": setItemStatus,
        "contextMenuStatusCallback": setContextMenuStatus,
        "filter": {
            searchUrl: true,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
            onBeforeSearch: onBeforeSearch,
            onClearAllTokens: onClearAllTokens,
            // advancedSearch: {
            //     "filterMenu": searchConfiguration.filterMenu,
            //     "logicMenu": searchConfiguration.logicMenu
            //     },
            noSearchResultMessage: "There are no search results found",
            columnFilter: true,
            showFilter: {
                customItems: [
                    {
                        "label": "Custom Item 1",
                        "key": "juniperCustom"
                    },
                    {
                        "label": "Custom Item 2",
                        "key": "nonJuniperCustom"
                    }
                ],
                quickFilters: [
                    {
                        "label": "Only Juniper devices",
                        "key": "juniper"
                    },
                    {
                        "label": "Only non-Juniper devices",
                        "key": "nonJuniper"
                    }
                ]
            },
            optionMenu: {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
                },
                "customItems": [
                    { //user should bind custom key events
                        "label": "Export Grid",
                        "key": "exportGrid",
                        "items": [
                            {
                                "label": "Export to PDF",
                                "key": "exportSubMenu1"
                            },
                            {
                                "label": "Export to CSV",
                                "key": "exportSubMenu2"
                            },
                            {
                                "separator": "true"
                            },
                            {
                                "label": "Export to XML",
                                "key": "exportSubMenu3"
                            }
                        ]
                    },
                    {
                        "label": "Share Grid",
                        "key": "shareGrid"
                    },
                    {
                        "label": "Print Grid",
                        "key": "printGrid"
                    }
                ],
                "statusCallback": setCustomMenuStatusSplit
            }
        },
//        "sorting": false,
//         "sorting": [
//             {
//                 "column": "name",
//                 "order": "asc" //asc,desc
//             },
//             {
//                 "column": "sourceAddress",
//                 "order": "desc" //asc,desc
//             }
//         ],
        "dragNDrop": {
            moveRow: {
                afterDrop: rowDropCallback
            }
        },
        "columns": [
            {
                "name": "name",
                "label": "Name",
                "width": "120",
                "formatter": createLink,
                "unformat": undoLink,
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "post_validation": "postValidation",
                    "pattern": "^[a-zA-Z0-9_\-]+$",
                    "error": "Enter alphanumeric characters, dashes or underscores"
                },
                "searchCell": true,
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
//                    "searchCell": "Search Cell",
                    "custom": [
                        { //user should bind custom key events
                            "label": "Search Cell",
                            "key": "cellMenu11"
                        },
                        {
                            "label": "Cell Menu 12",
                            "key": "cellMenu12"
                        },
                        {
                            "label": "Cell Sub Menu",
                            "key": "cellSubMenu1",
                            "items": [
                                {
                                    "label": "Cell Sub Menu 11",
                                    "key": "cellSubMenu11"
                                },
                                {
                                    "label": "Cell Sub Menu 12",
                                    "key": "cellSubMenu12"
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "index": "source",
                "name": "source",
                "label": "Source",
                "groupContent": {
                    "moreTooltip": setTooltipData,
                    "showOperator": true //default: false
//                    "formatData": formatGroupData
//                    "formatCell": formatCollapseCell,
//                    "unformatCell": unformatCollapseCell
                },
                "width": "200"
            },
            {
                "index": "destination",
                "name": "destination",
                "label": "Destination",
                "groupContent": {
//                    "moreTooltip": setTooltipData
                    "formatData": formatGroupData
                },
                "width": "200"
            },
            {
                "index": "application",
                "name": "application",
                "label": "Application",
                "width": "100",
                "collapseContent": {
                    "moreTooltip": setTooltipDataLabel
                },
                "createdDefaultValue": "any"
            },
            {
                "index": "application-services",
                "name": "application-services",
                "label": "Advanced Security",
                "width": "100",
                "collapseContent": {
                    "keyValueCell": true, //if false or absent, defaults to an array
                    "lookupKeyLabelTable": keyLabelTable
//                    "formatData": formatObjectData,
//                    "formatObjectCell": formatObjectCell,
//                    "unformatObjectCell": unformatObjectCell
                },
                "searchCell": true
            }
        ]
    };

    //performs the row creation by an asynchronous calls. In case of success, the success callback should be invoked and in case of failure, the error callback should be used.
    var createRow = function (selectedRows, success, error) {
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function (data) {
                success();
            },
            error: function () {
                error("Row deletion FAILED. " + selectedRows.numberOfSelectedRows + "were not deleted");
            }
        });
    };

    configurationSample.simpleGrid_simplified = {
        "viewType": "card", //available "card" for simple grid or "list" for nested grid
        "subTitle": "Click + icon for List and Regular Nested Grid", //string
        "url": "/api/get-grouped-data", //option 1 to be used with jsonRoot
        "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
        "jsonId": "name",
        "multiselect": true,
        "showSelection": tooltipConfigStr,
        "height": 'auto',
        "scroll": true,
        "numberOfRows": 50,
        "jsonRecords": function (data) {
            return data && data['policy-Level1'] && data['policy-Level1']['policy-Level2']['policy-Level3'][0]['junos:total'];
//            return data['policy'][0]['junos:total'];
        },
        noResultMessage: function () {
            return "No data available";
        },
//        "createRow": {
//            "onCreate": createRow
////           "addLast":true,
////            "showInline": true
//        },
//        "editRow": {
//            "showInline": true
//            "isRowEditable": isRowEditable
//        },
//        "deleteRow": {
//            "onDelete": deleteRow,
//            "autoRefresh": true,
//            "message": deleteRowMessage
//        },
//         "onSelectAll": false,
        "actionButtons": {
//            "defaultButtons":{ //overwrite default CRUD grid buttons
//                "create": {
//                    "label": "Create",
//                    "key": "createMenu",
//                    "items": [{
//                        "label":"Open grid overlay",
//                        "key":"createMenu1"
//                    },{
//                        "label":"Create Menu2",
//                        "key":"createMenu2"
//                    }],
//                    "statusCallback": setCustomMenuStatusAdd
//                }
////                "delete": {
////                    "label": "Delete",
////                    "key": "editMenu",
////                    "items": [{
////                        "label":"Open grid overlay",
////                        "key":"createMenu1"
////                    },{
////                        "label":"Create Menu2",
////                        "key":"createMenu2"
////                    }],
////                    "disabledStatus": true, //default status is false
////                    "statusCallback": setCustomMenuStatusAdd
////                }
//        },
            "customButtons": [
                {
                    "icon_type": true,
                    "label": "Close",
                    // "icon": "icon_exit_filters_hover",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover-bg",
                        disabled: "icon_exit_filters_disable-bg"
                    },
                    "disabledStatus": true, //default status is false
                    "key": "testCloseGrid"
                },
                {
                    "icon_type": true,
                    "label": "Close 1",
                    "icon": "icon_archive_purge-bg",
//                    "icon": {
//                        default: "icon_archive_purge-bg",
//                        hover: "icon_archive_purge_hover-bg",
//                        disabled: "icon_exit_filters_disable"
//                    },
//                    "disabledStatus": true,//default status is false
                    "key": "testCloseGrid1"
                },
                {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": true //default status is false
                },
                {
                    "menu_type": true,
                    "label": "Split Action",
                    "key": "subMenu",
                    "disabledStatus": true, //default status is false
                    "items": [
                        {
                            "label": "SubMenu1 Menu1",
                            "key": "subMenu1"
                        },
                        {
                            "label": "SubMenu1 Menu2",
                            "key": "subMenu2"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "SubMenu1 Menu3",
                            "key": "subMenu3"
                        }
                    ],
                    "statusCallback": setCustomMenuStatusSplit
                },
                {
                    "button_type": true,
                    "label": "Open Panel",
                    "key": "openPanel"
//                    "secondary": true
                }
            ],
            "actionStatusCallback": setCustomActionStatus
        },
        "contextMenu": {
            "enable": "Enable Rule",
            "disable": "Disable Rule",
//            "createBefore": "Create Row Before",
//            "createAfter": "Create Row After",
            "edit": "Edit Row",
            "copy": "Copy Row",
            "pasteBefore": "Paste Row Before",
            "pasteAfter": "Paste Row After",
            "delete": "Delete Row",
            "quickView": "Detailed View",
            "clearAll": "Clear All",
            "custom": [
                { //user should bind custom key events
                    "label": "Reset Hit Count",
                    "key": "resetHitEvent" //isDisabled property available to set status of individual items by a callback
                },
                {
                    "label": "Disable Hit Count",
                    "key": "disableHitEvent"
                },
                {
                    "label": "Update Action Status",
                    "key": "updateActionStatusEvent"
                },
                {
                    "label": "Select a row",
                    "key": "selectRowEvent"
                },
                {
                    "label": "Get all selected rows",
                    "key": "getSelectedRowsEvent"
                },
                {
                    "label": "Reload Grid",
                    "key": "reloadGrid"
                },
                {
                    "label": "Reset selection and reload grid",
                    "key": "resetReloadGrid"
                },
                {
                    "label": "With sub menus",
                    "key": "subMenus",
                    "items": [
                        {
                            "label": "Grid Overlay",
                            "key": "subMenu1"
                        },
                        {
                            "label": "SubMenu1 Menu2",
                            "key": "subMenu2"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "SubMenu1 Menu3",
                            "key": "subMenu3"
                        }
                    ]
                }
            ]
        },
//        "contextMenuItemStatus": setItemStatus,
        "contextMenuStatusCallback": setContextMenuStatus,
        "rowHoverMenu": {
//            "defaultButtons": { //overwrite default CRUD grid buttons
//                "edit": false
//            },
            "customButtons": [
                {
                    "label": "Clone",
                    "key": "testCloneHover",
//                    "icon": "icon_clone_blue"
                    "disabledStatus": false,// default status
                    "icon": {
                        default: "icon_clone_blue",
                        disabled: "icon_clone_disabled"
                    }
                },
                {
                    "label": "Info",
                    "key": "testInfoHover",
                    "disabledStatus": true,//default status if false
                    "icon": {
                        default: "icon_info",
                        disabled: "icon_info_disabled"
                    }
                },
                {
                    "label": "Grid on Overlay",
                    "key": "subMenus",
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
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Delete rows with reset",
                            "key": "deleteRows"
                        },
                        {
                            "label": "Delete rows w/o reset",
                            "key": "deleteRowsWithoutReset"
                        },
                        {
                            "separator": "true"
                        },
                        {
                            "label": "Add row",
                            "key": "subMenu4"
                        }
                    ]
                }
            ]
        },
        "filter": {
            searchUrl: true,
//            searchUrl: function (value, url){  //overwrites default search
//                return url + "?searchKey=" + value + "&searchAll=true";
//            },
            onBeforeSearch: onBeforeSearch,
            onClearAllTokens: onClearAllTokens,
            // advancedSearch: {
            //     "filterMenu": searchConfiguration.filterMenu,
            //     "logicMenu": searchConfiguration.logicMenu
            //     },
            noSearchResultMessage: "There are no search results found",
            columnFilter: true,
            showFilter: {
                customItems: [
                    {
                        "label": "Custom Item 1",
                        "key": "juniperCustom"
                    },
                    {
                        "label": "Custom Item 2",
                        "key": "nonJuniperCustom"
                    }
                ],
                quickFilters: [
                    {
                        "label": "Only Juniper devices",
                        "key": "juniper"
                    },
                    {
                        "label": "Only non-Juniper devices",
                        "key": "nonJuniper"
                    }
                ]
            },
            optionMenu: {
                "showHideColumnsItem": {
                    "setColumnSelection": setShowHideColumnSelection, //true for all selected
                    "updateColumnSelection": updateShowHideColumnSelection
                },
                "customItems": [
                    { //user should bind custom key events
                        "label": "Export Grid",
                        "key": "exportGrid",
                        "items": [
                            {
                                "label": "Export to PDF",
                                "key": "exportSubMenu1"
                            },
                            {
                                "label": "Export to CSV",
                                "key": "exportSubMenu2"
                            },
                            {
                                "separator": "true"
                            },
                            {
                                "label": "Export to XML",
                                "key": "exportSubMenu3"
                            }
                        ]
                    },
                    {
                        "label": "Share Grid",
                        "key": "shareGrid"
                    },
                    {
                        "label": "Print Grid",
                        "key": "printGrid"
                    }
                ],
                "statusCallback": setCustomMenuStatusSplit
            }
        },
//        "sorting": false,
        "sorting": [
            {
                "column": "name",
                "order": "asc" //asc,desc
            },
            {
                "column": "sourceAddress",
                "order": "desc" //asc,desc
            }
        ],
        "dragNDrop": {
            moveRow: {
                afterDrop: rowDropCallback
            }
        },
        "rowMaxElement": {
            "groupContentItems": 2,
            // "groupContentColumns": 3 //using card reponsiveness instead
        },
        "columns": [
            {
                "index": "junos:position",
                "name": "junos:position",
                "onHoverShowRowSelection": true,
                "label": "Position"
            },
            {
                "index": "source",
                "name": "source",
                "label": "SOURCE",
                "groupContent": {
                    "moreTooltip": setTooltipData,
                    "formatData": formatGroupData,
                    "showOperator": true //default: false
//                    "formatCell": formatCollapseCell,
//                    "unformatCell": unformatCollapseCell
                },
                "width": "120"
            },
            {
                "index": "destination",
                "name": "destination",
                "label": "DESTINATION",
                // "groupContent": true,
                "groupContent": {
                    "key": "label",
                    "value": "label"
                },
                "width": "110"
            },
            {
                "name": "name",
                "label": "NAME",
                "width": "40",
                "formatter": createLink,
                "unformat": undoLink,
                "createdDefaultValue": "test",
                "copiedDefaultValue": getDefaultCopiedValue,
                "editCell": {
                    "type": "input",
                    "post_validation": "postValidation",
                    "pattern": "^[a-zA-Z0-9_\-]+$",
                    "error": "Enter alphanumeric characters, dashes or underscores"
                },
                "searchCell": true,
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
//                    "searchCell": "Search Cell",
                    "custom": [
                        { //user should bind custom key events
                            "label": "Search Cell",
                            "key": "cellMenu11"
                        },
                        {
                            "label": "Cell Menu 12",
                            "key": "cellMenu12"
                        },
                        {
                            "label": "Cell Sub Menu",
                            "key": "cellSubMenu1",
                            "items": [
                                {
                                    "label": "Cell Sub Menu 11",
                                    "key": "cellSubMenu11"
                                },
                                {
                                    "label": "Cell Sub Menu 12",
                                    "key": "cellSubMenu12"
                                }
                            ]
                        }
                    ]
                }
//            }, {
//                "index": "application",
//                "name": "application",
//                "label": "Application",
//                "width": "100",
//                "collapseContent":{
//                    "moreTooltip": setTooltipDataLabel
//                },
//                "createdDefaultValue":"any"
//            }, {
//                "index": "application-services",
//                "name": "application-services",
//                "label": "Advanced Security",
//                "width": "100",
//                "collapseContent":{
//                    "keyValueCell": true, //if false or absent, defaults to an array
//                    "lookupKeyLabelTable":keyLabelTable
////                    "formatData": formatObjectData,
////                    "formatObjectCell": formatObjectCell,
////                    "unformatObjectCell": unformatObjectCell
//                },
//                "searchCell": true
            }
        ]
    };

    return configurationSample;

});