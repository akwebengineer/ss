/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/dataSample/columnFilterDropdown',
    'widgets/grid/tests/view/quickView',
    'widgets/grid/tests/dataSample/rbac',
    'mockjax'
], function (Backbone, GridWidget, configurationSample, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, columnFilterDropdownData, QuickView, rbacData, mockjax) {
    var GridView = Backbone.View.extend({

        events: {
            "click .cellLink": "openLink"
        },

        initialize: function () {
            this.mockApiResponse();
            this.actionEvents = {
                createEvent: {
                    capabilities: ['CreatePolicy'],
                    name: "AddRow"
                },
//                updateEvent: "UpdateRow",
                updateEvent: {
                    capabilities: ['ModifyPolicy'],
                    name: "UpdateRow"
                },
                deleteEvent: {
                    capabilities: ['DeletePolicy'],
                    name: "DeleteRow"
                },
                copyEvent: {
                    capabilities: ['ModifyPolicy'],
                    name: "CopyRow"
                },
                pasteEvent: {
                    capabilities: ['ModifyPolicy'],
                    name: "PasteRow"
                },
                statusEvent: {
                    capabilities: ['ModifyPolicy'],
                    name: "UpdateStatusRow"
                },
                quickViewEvent: {
                    capabilities: ['managePolicies'],
                    name: "QuickViewRow"
                },
                clearAllEvent: "ClearAll",
                resetHitEvent: {
                    capabilities: ['ResetHitCount'],
                    name: "ResetHitCount"
                },
                disableHitEvent: {
                    capabilities: ['ModifyPolicy'],
                    name: "DisableHitCount"
                },
                printGrid: {
                    capabilities: ['ModifyPolicy'],
                    name: "printGrid"
                },
                exportSubMenu3: {
                    capabilities: ['ExportPolicy'],
                    name: "exportSubMenu3"
                },
                reloadGrid: {
                    capabilities: ['CreatePolicy'],
                    name: "ReloadGrid"
                },
                deleteRows: "deleteRows",
                deleteRowsWithoutReset: "deleteRowsWithoutReset",
                updateActionStatusEvent: "updateActionStatus",
                resetReloadGrid: "resetReloadGrid",
                selectRowEvent: "selectRowEvent",
                getSelectedRowsEvent: "GetSelectedRows",
                subMenu1: "SubMenu1",
                subMenu2: "SubMenu2",
                subMenu3: {
                    capabilities: ['subMenu3'],
                    name: "subMenu3"
                },
//                subMenu3: "SubMenu3",
                subMenu4: "SubMenu4",
                createMenu: "createMenu",
                createMenu1: {
                    capabilities: ['CreatePolicy'],
                    name: "createMenu1"
                },
                testPublishGrid: {
                    capabilities: ['PublishPolicy'],
                    name: "testPublishGrid"
                },
                testCloseGrid: "testCloseGrid",
                customCheckboxAction: "customCheckboxAction",
                oneDropdown: "oneDropdown",
                manyDropdown: "manyDropdown",
                customLinkAction: "customLinkAction",
                selectedEvent: "selectedEvent",
                cellMenu11: "cellMenu11",
                cellSubMenu11: "cellSubMenu11",
                cellMenu22: "cellMenu22",
                clearSearchEvent: "clearSearchEvent",
                "deleteButton": "deleteButton",
                "editIcon": "editIcon"
            };
            this.bindGridEvents();
            this.search = [
//                "sourceAddress = IP_CONV_204.17.79.60, IP_TRE_204.17.79.60",
                "Destination Address >= 3"
//                "PSP", //PSP is a filtered value
//                "quickFilter = juniper"
//                "name = test"
            ];
            this.render();
        },

        render: function () {
            var self = this;

            function doRefresh() {
                console.log("custom refresh method");
                self.gridWidget.reloadGrid();
            }

            configurationSample.simpleGrid.refresh.onRefresh = doRefresh;

            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.simpleGrid,
                search: this.search,
                actionEvents: this.actionEvents,
                cellTooltip: this.cellTooltip,
                // rbacData: rbacData
            });
            this.gridWidget.build();
            return this;
        },
        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.createEvent.name, function (e, addGridRow) {
                    console.log(addGridRow);
                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent.name, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                    self.updateRow(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent.name, function (e, deletedGridRows) {
                    console.log(deletedGridRows);
                })
                .bind("deleteRows", function (e) {
                    var rowIds = ['190002-INS_to_Sircon_drop_em1', '196001-VPN_Cleanup_rule__IPSec_1', '190002-INS_to_Sircon_drop_em'];
                    self.gridWidget.deleteRow(rowIds);
                    console.log("Delete rows and reset selections");
                })
                .bind("deleteRowsWithoutReset", function (e) {
                    var rowIds = ['190002-INS_to_Sircon_drop_em1', '196001-VPN_Cleanup_rule__IPSec_1', '190002-INS_to_Sircon_drop_em'];
                    self.gridWidget.deleteRow(rowIds, false);
                    console.log("Delete rows but keep selections");
                })
                .bind(this.actionEvents.copyEvent.name, function (e, copiedGridRows) {
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent.name, function (e, pastedGridRow) {
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent.name, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                })
                .bind(this.actionEvents.quickViewEvent.name, function (e, quickViewRow) {
                    console.log(self.actionEvents.quickViewEvent.name + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0],
                        'removeQuickView': self.gridWidget.removeQuickView
                    }).render();
                })
                .bind(this.actionEvents.clearAllEvent, function (e, previousSelectedRows) {
                    console.log(previousSelectedRows);
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind("clearSearchEvent", function (e, previousSelectedRows) {
                    self.gridWidget.clearSearch();
                })
                .bind(this.actionEvents.resetHitEvent.name, function (e, selectedRows) {
                    console.log(self.actionEvents.resetHitEvent.name + ": ");
                    console.log(selectedRows);
//                    self.gridWidget.reloadGrid();
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.disableHitEvent.name, function (e, selectedRows) {
                    console.log(self.actionEvents.disableHitEvent.name + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.reloadGrid.name, function (e, selectedRows) {
                    console.log(self.actionEvents.reloadGrid.name + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.resetReloadGrid, function (e, selectedRows) {
                    console.log(self.actionEvents.resetReloadGrid + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        resetSelection: true
                    });
                    console.log("rows selected after reset selection:")
                    console.log(self.gridWidget.getSelectedRows(true));
                })
                .bind(this.actionEvents.subMenu1, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView({
                        type: "large"
                    });
                })
                .bind(this.actionEvents.subMenu2, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu2 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView({
                        type: "small"
                    });
                })
                .bind(this.actionEvents.subMenu3.name, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu3 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView({
                        type: "empty"
                    });
                })
                .bind(this.actionEvents.subMenu4, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu4 + ": ");
                    console.log(selectedRows);
                    self.gridWidget.addRow(firewallPoliciesData.oneRow);
                })
                .bind(this.actionEvents.cellMenu11, function (e, selectedRows) {
                    console.log(self.actionEvents.cellMenu11 + ": ");
                    console.log(selectedRows);
                    if (selectedRows.numberOfSelectedRows == 1) {
                        var cellValue = selectedRows.$rowAndTable[0].rawRow[selectedRows.cellColumn.name];
                        self.gridWidget.search(selectedRows.cellColumn.name + " = " + cellValue);
                    }
                })
                .bind(this.actionEvents.cellSubMenu11, function (e, selectedRows) {
                    console.log(self.actionEvents.cellSubMenu11 + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.cellMenu22, function (e, selectedRows) {
                    console.log(self.actionEvents.cellMenu22 + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.createMenu1.name, function (e, selectedRows) {
                    console.log(self.actionEvents.createMenu1.name + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.testPublishGrid.name, function (e, selectedRows) {
                    console.log(self.actionEvents.testPublishGrid.name + " Reload grid: ");
                    console.log(self.gridWidget.getSelectedRows());
//                    self.gridWidget.reloadGrid();
//                    console.log(selectedRows);
                    self.gridWidget.search('policy123');
                })
                .bind(this.actionEvents.exportSubMenu3.name, function (e, selectedRows) {
                    console.log(self.actionEvents.exportSubMenu3.name + " Reload grid: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.testCloseGrid, function (e, selectedRows) {
                    console.log("Close Grid");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.printGrid.name, function (e, selectedRows) {
                    console.log(self.actionEvents.printGrid.name + " Reload grid: ");
                    console.log(selectedRows);

                })
                .bind(this.actionEvents.customCheckboxAction, function (e, selectedRows) {
                    console.log(self.actionEvents.customCheckboxAction + " Reload grid: ");
                    console.log(selectedRows);

                })
                .bind(this.actionEvents.oneDropdown, function (e, selectedRows) {
                    console.log(self.actionEvents.oneDropdown + " Reload grid: ");
                    console.log(selectedRows);
                    self.gridWidget.updateGridConfiguration({
                        "url": "/api/get-filtered-data"
                    });

                })
                .bind(this.actionEvents.manyDropdown, function (e, selectedRows) {
                    console.log(self.actionEvents.manyDropdown + " Reload grid: ");
                    console.log(selectedRows);
                    self.gridWidget.updateGridConfiguration({
                        "url": "/api/get-data"
                    });
                })
                .bind(this.actionEvents.customLinkAction, function (e, selectedRows) {
                    console.log(self.actionEvents.customLinkAction + " Reload grid: ");
                    console.log(selectedRows);

                })
                .bind(this.actionEvents.selectedEvent, function (e, selectedRows) {
//                    console.log(self.actionEvents.selectedEvent + " : ");
//                    console.log(selectedRows);
                })
                .bind("gridRowOnEditMode", function (e, selectedRows) {
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                })
                .bind("gridOnRowSelection", function (e, selectedRows) {
//                    console.log(self.gridWidget.getSelectedRows());
//                    console.log("gridOnRowSelection: ");
//                    console.log(selectedRows);
                })
                .bind(this.actionEvents.updateActionStatusEvent, function (e, selectedRows) {
                    self.gridWidget.updateActionStatus({
                        "create": false,
                        "testCloseGrid": true
                    });
                })
                .bind(this.actionEvents.selectRowEvent, function (e, selectedRows) {
                    console.log(selectedRows);
                    self.gridWidget.toggleRowSelection("183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent");
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind(this.actionEvents.getSelectedRowsEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.getSelectedRowsEvent + ": ");
                    console.log(selectedRows);
                    console.log(self.gridWidget.getSelectedRows());
                })
                .bind("gridOnSelectAll", function (e, status) {
                    console.log("gridOnSelectAll status: " + status);
                })
                .bind("gridLoaded", function (e, status) {
                    self.$el.find(".column-label-wrapper").on("click", "input", function (e) {
                       console.log("column: " + this.value);
                       console.log("is checked: " + this.checked);
                        e.stopPropagation();
                    });
                });
        },

        addRow: function (addGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        updateRow: function (updateGridRow) {
            var self = this;
            var view = new ZonePoliciesAddView({
                'model': new ZonePoliciesModel.zone.model(updateGridRow.originalRow),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.update, self)
            });
            self.originalRow = updateGridRow.originalRow;
        },

        save: function (data) {
            this.gridWidget.addRow(data);
//            this.gridWidget.reloadGrid();
            console.log("Row added. Number of rows now: " + this.gridWidget.getNumberOfRows());
        },

        update: function (updatedRow) {
            this.gridWidget.editRow(this.originalRow, updatedRow);
            console.log("Row updated");
        },

        /* method that handles the cell click for the Name column. it empties existing container and builds a new grid using existing data in the cell
         * when the grid is used in the framework context, a new intent could be created to replace existing grid with the new grid:
         * new Slipstream.SDK.Intent(action, data)
         * where data could contain the data collected in the data-cell property of the cell defined in the formatter function of the column
         */
        openLink: function (e) {
            var linkValue = $(e.target).attr('data-cell');
            var minimumGridConfiguration = _.extend(configurationSample.smallGrid, {
                "title": "Grid for: " + linkValue
            });
            this.$el.empty();
            new GridWidget({
                container: this.el,
                elements: minimumGridConfiguration
            }).build();
        },

        cellTooltip: function (cellData, renderTooltip) {
//            console.log(cellData);
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
                success: function (data) {
                    renderTooltip(cellData.cellId + "<br/>"
                        + cellData.columnName + "<br/>"
                        + data.address[0].name);
                }
            });
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function () {
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function (settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    if (typeof settings.data == 'string') {
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i = 0; i < seg.length; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch (urlHash['_search']) {
                            case "PSP":
                                this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                                break;
                            case "NoData":
                                this.responseText = firewallPoliciesData.noDataResponse;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    else {
                        this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                },
                responseTime: 10
            });
            $.mockjax({
                url: '/api/get-filtered-data',
                dataType: 'json',
                response: function (settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                },
                responseTime: 10
            });
            $.mockjax({
                url: /^\/api\/data-sample\/client\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["client"],
                response: function (settings) {
                    var client = settings.urlParams.client,
                        clients = ["test", "test2", "test3"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 100
            });
            /* mocks REST API implementation for remote validation with callback */
            $.mockjax({
                url: /^\/form-test\/remote-validation\/callback\/developer-new-generation\/([a-zA-Z0-9\-\_]*)$/,
                urlParams: ["client"],
                response: function (settings) {
                    var client = settings.urlParams.client,
                        clients = ["Sujatha", "Andrew", "Miriam", "Vidushi", "Eva", "Sanket", "Arvind", "Viswesh", "Swena"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 10000
            });
            /* mocks REST API implementation for form validation with callback */
            $.mockjax({
                url: /^\/form-test\/submit-callback\/spinner-build-test1\/$/,
                status: 500,
                response: function (settings) {
                    this.responseText = "true";
                },
                responseTime: 10000
            });
            $.mockjax({
                url: '/api/dropdown/getRemoteData',
                dataType: 'json',
                responseTime: 700,
                response: function () {
                var responseText = {};
                    this.responseText = {
                        data: columnFilterDropdownData
                    }
                }
            });
        }
    });

    return GridView;
});