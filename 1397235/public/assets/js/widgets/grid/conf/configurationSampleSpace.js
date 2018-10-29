/**
 * A sample configuration object that shows the parameters required to build a Grid widget
 *
 * @module configurationSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'widgets/dropDown/dropDownWidget',
    'widgets/grid/conf/searchConfiguration',
    'widgets/grid/conf/rowSelectConfiguration',
    'widgets/grid/tests/view/sampleTooltipView'
], function (DropDownWidget, searchConfiguration, RowSelectConfiguration, SampleTooltipView) {

    var rowSelectConfiguration = new RowSelectConfiguration();

    var configurationSample = {};

    var enableSdGridRowInteraction = function (rowId, rowData) {
        var rowIds = rowSelectConfiguration.getSDServicesDisabledRowsIds();
        if (~rowIds.indexOf(rowId)) {
            console.log(rowData);
            return false;
        }
        return true;
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

    var baseConfiguration = {
        "jsonRoot": "services.service",
        "jsonId": "id",
        "jsonRecords": function (data, a, b) {
            var totalNumberOfRows = 0;
            if (data && data.services['total']) {
                var disabledRows = rowSelectConfiguration.getSDServicesDisabledRowsIds();
                totalNumberOfRows = data.services['total'] - disabledRows.length;
            }
            return totalNumberOfRows;
        },
        "scroll": true,
        "height": 'auto',
        "multiselect": true,
        "enabledRowInteraction": enableSdGridRowInteraction,
        "showRowNumbers": true,
        "onSelectAll": rowSelectConfiguration.getRowIds,
        "onSelectRowRange": rowSelectConfiguration.getRowIdsInRange,
        "deleteRow": {
            // "autoRefresh": true,
            "onDelete": deleteRow
        },
        "contextMenu": {
            "edit": "Edit Job",
            "delete": "Delete Job",
            "clearAll": "Clear All",
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
                    "label": "Toggle all selected rows",
                    "key": "toggleAllSelectedRowsEvent"
                },
                {
                    "label": "Toggle rows",
                    "key": "toggleRowsEvent"
                },
                {
                    "label": "Reload grid",
                    "key": "reloadGridEvent"
                },
                {
                    "label": "Reload grid with 20 rows",
                    "key": "reloadGridEvent20"
                },
                {
                    "label": "Reset selection and reload grid",
                    "key": "resetReloadGrid"
                }
            ]
        },
        "filter": {
            searchUrl: true,
            noSearchResultMessage: "There are no search results found"
        },
        "columns": [
            {
                "name": "id",
                "label": "ID",
                "align": "right",
                "width": 75
            },
            {
                "name": "name",
                "label": "Name",
                "width": 100
            },
            {
                "name": "is-group",
                "label": "Is Group"
            },
            {
                "name": "description",
                "label": "description",
                "width": 300

            },
            {
                "name": "domain-name",
                "label": "Domain Name",
                "width": 100
            }
        ]
    };

    configurationSample.urlSimpleGrid = $.extend(true, {}, baseConfiguration,
        {
            "title": "Simple Grid with URL from Space Services API",
            "url": "/api/juniper/sd/service-management/services", //needs connection to Space Server
            "beforeSendRequest": function (url) {
                // return url + "&policyId=98503";
                return url;
            },
            "reformatUrl": function (url) {
                return url;
            },
            "ajaxOptions": {
                headers: {
                    "Accept": 'application/vnd.juniper.sd.service-management.services+json;version=1;q=0.01'
                }
            },
            "numberOfRows": 50
        }
    );

    configurationSample.collectionSimpleGrid = $.extend(true, {}, baseConfiguration,
        {
            "title": "Simple Grid with a Collection from Space Services API",
            "numberOfRows": 35,
            "autoPageSize": false
        }
    );

    return configurationSample;

});