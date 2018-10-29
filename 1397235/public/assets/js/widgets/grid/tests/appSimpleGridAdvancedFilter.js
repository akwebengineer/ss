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
    'widgets/grid/conf/configurationSampleAdvancedFilter',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/view/quickView',
    'text!widgets/grid/tests/templates/advancedFilterContainers.html',
    'widgets/carousel/carouselWidget',
    'widgets/layout/tests/view/cardsView',
    'mockjax'
], function (Backbone, GridWidget, configurationSample, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, QuickView, advancedFilterContainers, CarouselWidget, CardsView, mockjax) {
    var GridView = Backbone.View.extend({

        events: {
            "click .show-hide-carousel": "showHideCarousel",
            "click .cellLink": "openLink"
        },

        initialize: function () {
            this.addContainers();
            this.mockApiResponse();
            this.buildGridWithNonJqueryEvents();
            this.findAdvanceFilterType();
            // this.buildGridWithJqueryEvents();
        },

        buildGridWithNonJqueryEvents: function () {
            this.bindNonJqueryEvents();
            this.buildGrid();
            //optionally, add or remove handlers programmatically:
            // this.bindMoreNonJqueryEvents();
            // this.unbindNonJqueryEvents();
        },

        buildGridWithJqueryEvents: function () {
            this.bindJQueryEvents();
            this.buildGrid();
        },

        findAdvanceFilterType: function () {
            this.isQueryBuilder = configurationSample.simpleGridAdvancedFilter.filter.advancedSearch.queryBuilder;
        },

        render: function () {
            return this;
        },

        buildGrid: function () {
            this.gridWidget = new GridWidget({
                container: this.el,
                elements: configurationSample.simpleGridAdvancedFilter,
                actionEvents: this.actionEvents
            });
            this.gridWidget.build();

        },

        bindNonJqueryEvents: function () {
            var self = this,
                createEvent = function (e, addGridRow) {
                    console.log(self.actionEvents.createEvent.name + ":");
                    console.log(addGridRow);
                    self.addRow(addGridRow);
                },
                updateEvent = function (e, updatedGridRow) {
                    console.log(self.actionEvents.updateEvent.name + ":");
                    console.log(updatedGridRow);
                    self.updateRow(updatedGridRow);
                },
                deleteEvent = function (e, deletedGridRows) {
                    console.log(self.actionEvents.deleteEvent.name + ":");
                    console.log(deletedGridRows);
                },
                copyEvent = function (e, copiedGridRows) {
                    console.log(self.actionEvents.copyEvent.name + ":");
                    console.log(copiedGridRows);
                },
                pasteEvent = function (e, pastedGridRow) {
                    console.log(self.actionEvents.pasteEvent.name + ":");
                    console.log(pastedGridRow);
                },
                statusEvent = function (e, updatedGridRow) {
                    console.log(self.actionEvents.statusEvent.name + ":");
                    console.log(updatedGridRow);
                },
                quickViewEvent = function (e, quickViewRow) {
                    console.log(self.actionEvents.quickViewEvent.name + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0]
                    }).render();
                },
                resetHitEvent = function (e, selectedRows) {
                    console.log(self.actionEvents.resetHitEvent.name + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                },
                disableHitEvent = function (e, selectedRows) {
                    console.log(self.actionEvents.disableHitEvent.name + ": ");
                    console.log(selectedRows);
                },
                printGrid = function (e, selectedRows) {
                    console.log(self.actionEvents.printGrid.name + " Reload grid: ");
                    console.log(selectedRows);
                },
                exportSubMenu3 = function (e, selectedRows) {
                    console.log(self.actionEvents.exportSubMenu3.name + " Reload grid: ");
                    console.log(selectedRows);
                },
                reloadGrid = function (e, selectedRows) {
                    console.log(self.actionEvents.reloadGrid.name + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                },
                reloadGridNewRowNumber = function (e, selectedRows) {
                    console.log(self.actionEvents.reloadGridNewRowNumber.name + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        "numberOfRows": 10
                    });
                },
                subMenu1 = function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu1.name + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                },
                subMenu2 = function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu2.name + ": ");
                    console.log(selectedRows);
                    self.gridWidget.addRow(firewallPoliciesData.oneRow);
                },
                createMenu1 = function (e, selectedRows) {
                    console.log(self.actionEvents.createMenu1.name + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                },
                testPublishGrid = function (e, selectedRows) {
                    console.log(self.actionEvents.testPublishGrid.name + " Reload grid: ");
                    console.log(self.gridWidget.getSelectedRows());
                    console.log(selectedRows);
                },
                testSaveGrid = function (e, selectedRows) {
                    console.log(self.actionEvents.testSaveGrid.name + ": ");
                    console.log(selectedRows);
                },
                testCloseGrid = function (e, selectedRows) {
                    console.log(self.actionEvents.testCloseGrid.name + ": ");
                    console.log(selectedRows);
                },
                selectedEvent = function (e, selectedRows) {
                    // console.log(self.actionEvents.selectedEvent.name + ": ");
                    // console.log(selectedRows);
                },
                loadFilters = function (e, selectedRows) {
                    console.log(self.actionEvents.loadFilters.name + " : ");
                    if(self.isQueryBuilder){
                        self.gridWidget.getSearchWidgetInstance().add({'query':'123.43.5.3 OR ManagedStatus = InSync, OutSync AND name = SRX, MX'});
                    }else{
                        self.gridWidget.getSearchWidgetInstance().addTokens(['123.43.5.3', 'OR', 'ManagedStatus = InSync, OutSync', 'AND', 'name = SRX, MX']);
                    }
                },
                saveFilter = function (e, selectedRows) {
                    console.log(self.actionEvents.saveFilter.name + " : ");
                    if(self.isQueryBuilder){
                        console.log(self.gridWidget.getSearchWidgetInstance().getQuery());
                    }else {
                        console.log(self.gridWidget.getSearchWidgetInstance().getAllTokens());
                    }
                },
                clearSearchEvent = function (e, previousSelectedRows) {
                    console.log(self.actionEvents.clearSearchEvent.name + ":");
                    self.gridWidget.clearSearch();
                },
                gridLoaded = function (e, gridLoadedData) {
                    console.log("gridLoaded:");
                    console.log(gridLoadedData);
                };
            this.gridOnRowSelection = function (e, selectedRows) {
                console.log(self.gridWidget.getSelectedRows());
                console.log("gridOnRowSelection 1:");
                console.log(selectedRows);
            };
            this.gridRowOnEditMode = function (e, selectedRows) {
                console.log("gridRowOnEditMode:");
                console.log(selectedRows);
            };
            this.actionEvents = {
                "createEvent": {
                    "name": "createNonJQueryEvent",
                    "handler": [createEvent]
                },
                "updateEvent": {
                    "name": "updateNonJQueryEvent",
                    "handler": [updateEvent]
                },
                "deleteEvent": {
                    "name": "deleteNonJQueryEvent",
                    "handler": [deleteEvent]
                },
                "copyEvent": {
                    "name": "copyNonJQueryEvent",
                    "handler": [copyEvent]
                },
                "pasteEvent": {
                    "name": "pasteNonJQueryEvent",
                    "handler": [pasteEvent]
                },
                "statusEvent": {
                    "name": "statusNonJQueryEvent",
                    "handler": [statusEvent]
                },
                "quickViewEvent": {
                    "name": "quickViewNonJQueryEvent",
                    "handler": [quickViewEvent]
                },
                "resetHitEvent": {
                    "name": "resetHitNonJQueryEvent",
                    "handler": [resetHitEvent]
                },
                "disableHitEvent": {
                    "name": "disableHitNonJQueryEvent",
                    "handler": [disableHitEvent]
                },
                "printGrid": {
                    "name": "printGridNonJQueryEvent",
                    "handler": [printGrid]
                },
                "exportSubMenu3": {
                    "name": "exportSubMenu3NonJQueryEvent",
                    "handler": [exportSubMenu3]
                },
                "reloadGrid": {
                    "name": "reloadGridNonJQueryEvent",
                    "handler": [reloadGrid]
                },
                "reloadGridNewRowNumber": {
                    "name": "reloadGridNewRowNumberNonJQueryEvent",
                    "handler": [reloadGridNewRowNumber]
                },
                "subMenu1": {
                    "name": "subMenu1NonJQueryEvent",
                    "handler": [subMenu1]
                },
                "subMenu2": {
                    "name": "subMenu2NonJQueryEvent",
                    "handler": [subMenu2]
                },
                "createMenu1": {
                    "name": "createMenu1NonJQueryEvent",
                    "handler": [createMenu1]
                },
                "testPublishGrid": {
                    // "name": "testPublishGrid",
                    "name": "testPublishGridNonJQueryEvent",
                    "handler": [testPublishGrid]
                },
                "testSaveGrid": {
                    "name": "testSaveGridNonJQueryEvent",
                    "handler": [testSaveGrid]
                },
                "testCloseGrid": {
                    "name": "testCloseGridNonJQueryEvent",
                    "handler": [testCloseGrid]
                },
                "selectedEvent": {
                    "name": "selectedNonJQueryEvent",
                    "handler": [selectedEvent]
                },
                "loadFilters": {
                    "name": "loadFiltersNonJQueryEvent",
                    "handler": [loadFilters]
                },
                "saveFilter": {
                    "name": "saveFilterNonJQueryEvent",
                    "handler": [saveFilter]
                },
                "clearSearchEvent": {
                    "name": "clearSearchNonJQueryEvent",
                    "handler": [clearSearchEvent]
                },
                "gridLoaded": {
                    "handler": [gridLoaded]
                },
                "gridRowOnEditMode": {
                    "handler": [self.gridRowOnEditMode]
                },
                "gridOnRowSelection": {
                    "handler": [self.gridOnRowSelection]
                }
            };
        },

        bindMoreNonJqueryEvents: function () {
            var self = this;
            var gridOnRowSelectionMore = function (e, rowSelection) {
                console.log("gridOnRowSelection 2:");
                console.log(rowSelection);
            };
            this.gridWidget.bindEvents({
                "gridOnRowSelection": {
                    "handler": [gridOnRowSelectionMore]
                },
                "slipstreamGrid.resized:gridWidth": {
                    "handler": [function () {
                        console.log("grid resized");
                    }]
                }
            });
        },

        unbindNonJqueryEvents: function () {
            var self = this;
            var gridOnRowSelectionMore = function (e, gridLoadedData) {
                console.log("gridOnRowSelectionMore:");
                console.log(gridLoadedData);
            };
            this.gridWidget.unbindEvents({
                "gridRowOnEditMode": {
                    "handler": [self.gridRowOnEditMode]
                },
                "gridOnRowSelection": {
                    "handler": [self.gridOnRowSelection]
                }
            });
        },

        bindJQueryEvents: function () {
            var self = this;
            this.actionEvents = {
                "createEvent": "AddRow",
                "updateEvent": "UpdateRow",
                "deleteEvent": "DeleteRow",
                "copyEvent": "CopyRow",
                "pasteEvent": "PasteRow",
                "statusEvent": "UpdateStatusRow",
                "quickViewEvent": "QuickViewRow",
                "resetHitEvent": "ResetHitCount",
                "disableHitEvent": "DisableHitCount",
                "printGrid": "printGrid",
                "exportSubMenu3": "exportSubMenu3",
                "reloadGrid": "ReloadGrid",
                "reloadGridNewRowNumber": "reloadGridNewRowNumber",
                "subMenu1": "SubMenu1",
                "subMenu2": "SubMenu2",
                "createMenu1": "createMenu1",
                "testPublishGrid": "testPublishGrid",
                "selectedEvent": "selectedEvent",
                "loadFilters": "loadFilters",
                "saveFilter": "saveFilter",
                "clearSearchEvent": "clearSearchEvent"
            };
            this.$el
                .bind(this.actionEvents.createEvent, function (e, addGridRow) {
                    console.log(addGridRow);
                    self.addRow(addGridRow);
                })
                .bind(this.actionEvents.updateEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                    self.updateRow(updatedGridRow);
                })
                .bind(this.actionEvents.deleteEvent, function (e, deletedGridRows) {
                    console.log(deletedGridRows);
                })
                .bind(this.actionEvents.copyEvent, function (e, copiedGridRows) {
                    console.log(copiedGridRows);
                })
                .bind(this.actionEvents.pasteEvent, function (e, pastedGridRow) {
                    console.log(pastedGridRow);
                })
                .bind(this.actionEvents.statusEvent, function (e, updatedGridRow) {
                    console.log(updatedGridRow);
                })
                .bind("clearSearchEvent", function (e, previousSelectedRows) {
                    self.gridWidget.clearSearch();
                })
                .bind(this.actionEvents.quickViewEvent, function (e, quickViewRow) {
                    console.log(self.actionEvents.quickViewEvent + ":");
                    console.log(quickViewRow);
                    new QuickView({
                        'rowData': quickViewRow.selectedRows[0]
                    }).render();
                })
                .bind(this.actionEvents.resetHitEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.resetHitEvent + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.disableHitEvent, function (e, selectedRows) {
                    console.log(self.actionEvents.disableHitEvent + ": ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.reloadGrid, function (e, selectedRows) {
                    console.log(self.actionEvents.reloadGrid + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid();
                })
                .bind(this.actionEvents.reloadGridNewRowNumber, function (e, selectedRows) {
                    console.log(self.actionEvents.reloadGridNewRowNumber + ": ");
                    console.log(selectedRows);
                    self.gridWidget.reloadGrid({
                        "numberOfRows": 10
                    });
                })
                .bind(this.actionEvents.subMenu1, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.subMenu2, function (e, selectedRows) {
                    console.log(self.actionEvents.subMenu2 + ": ");
                    console.log(selectedRows);
                    self.gridWidget.addRow(firewallPoliciesData.oneRow);
                })
                .bind(this.actionEvents.createMenu1, function (e, selectedRows) {
                    console.log(self.actionEvents.createMenu1 + ": ");
                    console.log(selectedRows);
                    new GridOverlayView();
                })
                .bind(this.actionEvents.testPublishGrid, function (e, selectedRows) {
                    console.log(self.actionEvents.testPublishGrid + " Reload grid: ");
                    console.log(self.gridWidget.getSelectedRows());
                    self.gridWidget.reloadGrid();
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.exportSubMenu3, function (e, selectedRows) {
                    console.log(self.actionEvents.exportSubMenu3 + " Reload grid: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.printGrid, function (e, selectedRows) {
                    console.log(self.actionEvents.printGrid + " Reload grid: ");
                    console.log(selectedRows);
                })
                .bind(this.actionEvents.selectedEvent, function (e, selectedRows) {
//                    console.log(self.actionEvents.selectedEvent + " : ");
//                    console.log(selectedRows);
                })
                .bind(this.actionEvents.loadFilters, function (e, selectedRows) {
                    console.log(self.actionEvents.loadFilters + " : ");
                    self.gridWidget.getSearchWidgetInstance().addTokens(['123.43.5.3', 'OR', 'ManagedStatus = InSync, OutSync', 'AND', 'name = SRX, MX']);
                })
                .bind(this.actionEvents.saveFilter, function (e, selectedRows) {
                    console.log(self.actionEvents.saveFilter + " : ");
                    console.log(self.gridWidget.getSearchWidgetInstance().getAllTokens());
                })
                .bind("gridRowOnEditMode", function (e, selectedRows) {
                    console.log("gridRowOnEditMode: ");
                    console.log(selectedRows);
                })
                .bind("gridOnRowSelection", function (e, selectedRows) {
                    console.log(self.gridWidget.getSelectedRows());
                    console.log("gridOnRowSelection: ");
                    console.log(selectedRows);
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

        addContainers: function () {
            this.$el.append(advancedFilterContainers);
            this.carouselContainer = this.$el.find('.carousel-test');
        },

        showHideCarousel: function () {
            this.setCarouselItems();
            if (this.carouselContainer.hasClass('carousel-widget-test')) {
                if (this.carouselContainer.css("display") == "none")
                    this.carouselContainer.show();
                else
                    this.carouselContainer.hide();
            } else {
                this.carouselContainer.addClass('carousel-widget-test');
                new CarouselWidget({
                    "container": this.carouselContainer,
                    "items": this.multipleItems
                }).build();
            }
        },

        setCarouselItems: function () {
            this.multipleItems = [{
                id: "card1",
                content: new CardsView.view1()
            }, {
                id: "card2",
                content: new CardsView.view3()
            }, {
                id: "card3",
                content: new CardsView.view2()
            }, {
                id: "card4",
                content: new CardsView.view4()
            }, {
                id: "card5",
                content: new CardsView.view9()
            }, {
                id: "card6",
                content: new CardsView.view10()
            }, {
                id: "card7",
                content: new CardsView.view5()
            }, {
                id: "card8",
                content: new CardsView.view7()
            }, {
                id: "card9",
                content: new CardsView.view6()
            }, {
                id: "card10",
                content: new CardsView.view8()
            }];
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function () {
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                type: 'POST',
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
        }
    });

    return GridView;
});