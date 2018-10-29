define([
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/conf/configurationSampleDragNDrop',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/conf/configurationSampleLocalData',
    'widgets/grid/conf/configurationSampleAdvancedFilter',
    'widgets/grid/conf/partialConfigurationSample',
    'widgets/grid/conf/searchConfiguration',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/dataSample/multiLevelTreeData',
    'widgets/grid/tests/dataSample/nextGenFirewallPoliciesData',
    'widgets/grid/tests/dataSample/firewallPoliciesTreeData',
    'widgets/grid/tests/dataSample/rbac',
    'widgets/grid/tests/view/noSearchResultView',
    'text!widgets/grid/tests/templates/noResultsContent.html',
    'mockjax',
    'widgets/grid/conf/tooltipConfiguration'
], function (GridWidget, configurationSample, configurationSampleDND, configurationTreeSample, configurationSampleLocal, configurationSampleAdvancedFilter, partialConfigurationSample, searchConfiguration, firewallPoliciesData, firewallPoliciesTreeData, firewallPoliciesGroupedData, firewallPoliciesTreeDataJson, rbacData, NoSearchResultView, nrTemplate, mockjax, tooltipConfiguration) {

    var $el = $('#test_widget'),
        containerId = 0;

    var createContainer = function () {
        var $container = $("<div id = grid-container-id" + containerId++ + "></div>");
        $el.append($container);
        return $container;
    };
    var cleanUp = function (thisObj) {
        thisObj.gridWidgetObj.destroy();
        thisObj.$gridContainer.remove();
        thisObj = null;
    };

    /* mocks REST API response for remote validation of an input value */
    (function () {

        $.mockjax({
            url: '/api/get-no-data',
            dataType: 'json',
            response: function (settings) {
                this.responseText = {};
            },
            responseTime: 10
        });

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
            url: '/api/get-tree',
            response: function (settings) {
                var urlHash = {},
                    seg = settings.data.split('&');
                for (var i = 0; i < seg.length; i++) {
                    if (!seg[i]) {
                        continue;
                    }
                    var s = seg[i].split('=');
                    urlHash[s[0]] = s[1];
                }
                if (urlHash.page == 2) {
                    this.responseText = firewallPoliciesTreeData.firewallPoliciesPage2;
                } else {
                    switch (urlHash['_search']) {
                        case "PSP":
                            this.responseText = firewallPoliciesTreeData.firewallPoliciesFiltered;
                            break;
                        case "NoData":
                            this.responseText = firewallPoliciesTreeData.noDataResponse;
                            break;
                        default:
                            if (urlHash.filter) {
                                this.responseText = firewallPoliciesTreeData.firewallPoliciesFiltered;
                            } else {
                                switch (urlHash.nodeid) {
                                    case "11":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel11;
                                        break;
                                    case "15":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel15;
                                        break;
                                    case "25":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel25;
                                        break;
                                    case "4":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel4;
                                        break;
                                    case "55":
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesLevel55;
                                        break;
                                    default:
                                        this.responseText = firewallPoliciesTreeData.firewallPoliciesAll;
                                }
                            }
                    }
                }
            },
            responseTime: 10
        });
        $.mockjax({
            url: '/api/get-updated-configuration-tree-data',
            dataType: 'json',
            response: function (settings) {
                this.responseText = firewallPoliciesTreeData.firewallPoliciesUpdatedConfiguration;
            },
            responseTime: 10
        });
        $.mockjax({
            url: '/api/get-grouped-data',
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
                            this.responseText = firewallPoliciesGroupedData.firewallPoliciesFiltered;
                            break;
                        case "NoData":
                            this.responseText = firewallPoliciesGroupedData.noDataResponse;
                            break;
                        default:
                            this.responseText = firewallPoliciesGroupedData.firewallPoliciesAll;
                    }
                }
                else {
                    this.responseText = firewallPoliciesGroupedData.firewallPoliciesAll;
                }
            },
            responseTime: 10
        });
    })();

    describe('Grid Widget - Unit Tests:', function () {

        describe('Grid Widget Interface', function () {
            before(function () {
                this.$gridContainer = createContainer();
                this.gridWidgetObj = new GridWidget({
                    "elements": configurationSample.simpleGrid,
                    "container": this.$gridContainer[0]
                }).build();
            });
            after(function () {
                cleanUp(this);
            });
            it('should exist', function () {
                this.gridWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.gridWidgetObj.build, 'The Grid widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.gridWidgetObj.destroy, 'The Grid widget must have a function named destroy.');
            });
        });

        describe('Grid Widget Elements', function () {
            describe('Grid Widget Elements - Simple Grid', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
                });
                it('should contain subtitle', function () {
                    assert.equal(this.$gridContainer.find('.grid-sub-title .content').text(), this.gridWidgetConfElements.subTitle, "the grid should have a sub title");
                });
                it('should contain the header of the grid', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th').length > 0, "column headers has been created and the grid widget should have added at least one column");
                });
                it('should contain the content of the grid', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-btable tr').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
                });
                it('should contain groups of columns', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th.groupColumn').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
                });
                it('should contain custom titles for columns', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th .customColumn').length > 1, "data has been rendered and the grid widget should have created a least more than one column with custom title");
                });
                it('should contain date columns', function () {
                    var allDateCells = this.$gridContainer.find('[data-view-type]');
                    assert.isTrue(allDateCells.length > 1, "data has been rendered and the grid widget should have created a least more than date cell");
                    assert.isTrue(allDateCells.eq(0).attr("data-date-value") == "2007-10-06", "date cell should keep its original value");
                    //assert.isTrue(allDateCells.eq(0).text() == "Oct 5, 2007, 5:00:00 PM", "date cell should be formatted");
                });
            });
            describe('Grid Widget Elements - Tree Grid', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGridPreselection;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
                });
                it('should contain subtitle', function () {
                    assert.equal(this.$gridContainer.find('.grid-sub-title .content').text(), this.gridWidgetConfElements.subTitle, "the grid should have a sub title");
                });
                it('should contain the header of the grid', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th').length > 0, "column headers has been created and the grid widget should have added at least one column");
                });
                it('should contain the content of the grid', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-btable tr').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
                });
                it('should contain groups of columns', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-labels th.groupColumn').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
                });
                it('should contain row expand icon when row contains moreTooltip', function () {
                    var $row = this.$gridContainer.find(".moreTooltip").eq(1).closest('tr');
                    var $moreIcon = $row.find(".moreIcon");
                    assert.isTrue($moreIcon.hasClass("moreIconShow"));
                });
                it('should contain row expand icon when row contains cellContentBlock', function () {
                    var $row = this.$gridContainer.find(".objectWrap").eq(1).closest('tr');
                    var $moreIcon = $row.find(".moreIcon");
                    assert.isTrue($moreIcon.hasClass("moreIconShow"));
                });
            });
        });

        describe('Grid Widget Methods', function () {
            describe('Simple Grid', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = _.extend({}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.onSelectAll = function () {
                        self.onSelectAllInvoked = true;
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        $(this).unbind('gridLoaded');
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('toggleGridHeader', function () {
                    //Before toggle header
                    assert.equal(this.$gridContainer.find('.ui-jqgrid-hdiv').css('display') !== 'none', true, "the grid should have header");
                    assert.equal(this.$gridContainer.find('.sub-header').css('display') !== 'none', true, "the grid should have sub title");
                    assert.equal(this.$gridContainer.find('.search-save-container').css('display') !== 'none', true, "the grid should have search");

                    //Hide the header
                    this.gridWidgetObj.toggleGridHeader();
                    assert.equal(this.$gridContainer.find('.ui-jqgrid-hdiv').css('display') === 'none', true, "the grid should NOT have header");
                    assert.equal(this.$gridContainer.find('.sub-header').css('display') === 'none', true, "the grid should NOT have sub title");
                    assert.equal(this.$gridContainer.find('.search-save-container').css('display') === 'none', true, "the grid should NOT have search");

                    //Show the header
                    this.gridWidgetObj.toggleGridHeader(false);
                    assert.equal(this.$gridContainer.find('.ui-jqgrid-hdiv').css('display') !== 'none', true, "the grid should have header");
                    assert.equal(this.$gridContainer.find('.sub-header').css('display') !== 'none', true, "the grid should have sub title");
                    assert.equal(this.$gridContainer.find('.search-save-container').css('display') !== 'none', true, "the grid should have search");

                    //Show the subheader and search and hide the header
                    this.gridWidgetObj.toggleGridHeader(true, ['subheader', 'search']);
                    assert.equal(this.$gridContainer.find('.ui-jqgrid-hdiv').css('display') === 'none', true, "the grid should NOT have header");
                    assert.equal(this.$gridContainer.find('.sub-header').css('display') !== 'none', true, "the grid should have sub title");
                    assert.equal(this.$gridContainer.find('.search-save-container').css('display') !== 'none', true, "the grid should have search");

                    //Show the header only
                    this.gridWidgetObj.toggleGridHeader(false);
                    this.gridWidgetObj.toggleGridHeader(true, 'header');
                    assert.equal(this.$gridContainer.find('.ui-jqgrid-hdiv').css('display') !== 'none', true, "the grid should have header");
                    assert.equal(this.$gridContainer.find('.sub-header').css('display') === 'none', true, "the grid should NOT have sub title");
                    assert.equal(this.$gridContainer.find('.search-save-container').css('display') === 'none', true, "the grid should NOT have search");
                });
                it('deleteRow: delete a row with reset selection', function () {
                    var totalRows = this.gridWidgetObj.getAllVisibleRows().length,
                        rowId = '190002-INS_to_Sircon_drop_em';

                    this.gridWidgetObj.deleteRow(rowId);
                    assert.equal(this.gridWidgetObj.getAllVisibleRows().length, totalRows - 1, "the total number of row decreases");
                });
                it('deleteRow: delete multiple rows without reset selections', function () {
                    var totalRows = this.gridWidgetObj.getAllVisibleRows().length,
                        selectedRowIds = ['189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante', '183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'],
                        deletedRowIds = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];

                    this.gridWidgetObj.toggleRowSelection(selectedRowIds, 'selected');
                    this.gridWidgetObj.deleteRow(deletedRowIds, false);
                    assert.equal(this.gridWidgetObj.getAllVisibleRows().length, totalRows - 2, "the total number of rows decrease");

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.$gridContainer.find('.selection-count-number').text(), "the total selected rows equals to 1");
                });
                it('reloadGrid: reloadGrid by keeping row selection and state (collapse/expand)', function () {
                    var selectedRowIds = ['189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante', '183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'],
                        $gridSelectAll = this.$gridContainer.find(".ui-jqgrid-labels input.cbox"),
                        $row = this.$gridContainer.find("#" + selectedRowIds[0]),
                        $rowCarat = $row.find(".slipstreamgrid_more"),
                        $rowMoreCarat = $rowCarat.find(".moreIcon"),
                        $rowLessCarat = $rowCarat.find(".lessIcon");

                    //row is collapsed by default
                    assert.isTrue($rowMoreCarat.css("display") != "none", "more icon is displayed to show that row is collapsed by default");

                    //row is expanded by clicking on the expand cell
                    $rowCarat.trigger("click");
                    assert.isFalse($rowCarat.find(".moreIcon").css("display") != "none", "more icon is NOT displayed to show that row is collapsed");
                    assert.isFalse($rowLessCarat.css("display") == "none", "more icon is displayed to show that row is expanded");

                    //rowSelection
                    this.gridWidgetObj.toggleRowSelection(selectedRowIds, 'selected');
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, selectedRowIds.length, "Rows are selected before reloadGrid");

                    //binds to the gridTable so unit test can be done on the grid after reloadGrid
                    //unit test verifies that the grid widget restores previous state on row (expanded) after reloadGrid
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () {
                        $row = $(this).find("#" + selectedRowIds[0]);
                        $rowCarat = $row.find(".slipstreamgrid_more");
                        $rowMoreCarat = $rowCarat.find(".moreIcon");
                        $rowLessCarat = $rowCarat.find(".lessIcon");
                        assert.isFalse($rowMoreCarat.css("display") != "none", "more icon is NOT displayed to show that row is collapsed");
                        assert.isFalse($rowLessCarat.css("display") == "none", "more icon is displayed to show that row is expanded");
                        $(this).unbind('gridLoaded');

                    });
                    this.onSelectAllInvoked = false;
                    this.gridWidgetObj.reloadGrid();

                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, selectedRowIds.length, "The same rows are selected after reloadGrid");
                    assert.isFalse(this.onSelectAllInvoked, "onSelectAll callback didn't get invoked");

                    $gridSelectAll.trigger("click");
                    this.gridWidgetObj.reloadGrid();
                    assert.isTrue(this.onSelectAllInvoked, "onSelectAll callback got invoked");

                });
                it('updateGridConfiguration: updates grid configuration', function (done) {
                    var numberOfRows = this.gridWidgetObj.getNumberOfRows(),
                        self = this;
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () {
                        done();
                        assert.notEqual(self.gridWidgetObj.getNumberOfRows(), numberOfRows, "New API got called so the total number of rows gets updated");
                        $(this).unbind('gridLoaded');
                    });
                    //updating the grid url will reload the grid with a new set of data
                    this.gridWidgetObj.updateGridConfiguration({
                        "url": "/api/get-no-data"
                    });
                });
            });
            describe('Tree Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["24a", //multiple items on source-address and destination-address
                            "26", //multiple items on source-address and destination-address
                            "3", //multiple items on destination-address
                            "8"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGrid);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('deleteRow: delete a row with reset selection', function () {
                    var totalRows = this.gridWidgetObj.getAllVisibleRows().length,
                        rowId = '3';

                    this.gridWidgetObj.deleteRow(rowId);
                    assert.equal(this.gridWidgetObj.getAllVisibleRows().length, totalRows - 1, "the total number of row decreases");
                });
                it('deleteRow: delete multiple rows without reset selections', function () {
                    var totalRows = this.gridWidgetObj.getAllVisibleRows().length,
                        selectedRowIds = ['25', '26', '24a'],
                        deletedRowIds = ['26', '24a'];

                    this.gridWidgetObj.toggleRowSelection(selectedRowIds, 'selected');
                    this.gridWidgetObj.deleteRow(deletedRowIds, false);
                    assert.equal(this.gridWidgetObj.getAllVisibleRows().length, totalRows - 2, "the total number of rows decrease");

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 1, "the total selected rows equals to 1");
                });
                it('expandAllRowParent/collapseAllParentRows: expands or collapse all row parents', function () {
                    var expandIconClass = "tr[role='row'] .ui-icon.tree-minus",
                        collapseIconClass = "tr[role='row'] .ui-icon.tree-plus",
                        expandedRowParents = this.$gridTable.find(expandIconClass),
                        collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length > 0, "some row parents are not expanded");

                    //expand all rows
                    this.gridWidgetObj.expandAllParentRows();
                    expandedRowParents = this.$gridTable.find(expandIconClass);
                    collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length > 0, "all row parents are expanded");
                    assert.isTrue(collapsedRowParents.length == 0, "all row parents are not collapsed");

                    //collapse all rows
                    this.gridWidgetObj.collapseAllParentRows();
                    expandedRowParents = this.$gridTable.find(expandIconClass);
                    collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length == 0, "all row parents are not expanded");
                    assert.isTrue(collapsedRowParents.length > 0, "all row parents are collapsed");
                });
                it('updateGridConfiguration: updates grid configuration', function (done) {
                    var numberOfRows = this.gridWidgetObj.getNumberOfRows(),
                        self = this;
                    this.$gridTable.bind('gridLoaded', function () {
                        done();
                        assert.notEqual(self.gridWidgetObj.getNumberOfRows(), numberOfRows, "New API got called so the total number of rows gets updated");
                        $(this).unbind('gridLoaded');
                    });
                    //updating the grid url will reload the grid with a new set of data
                    this.gridWidgetObj.updateGridConfiguration({
                        "url": "/api/get-updated-configuration-tree-data",
                        "jsonId": "rowIdentifier"
                    });
                });
            });
            describe('Nested Grid', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.nestedGrid);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            self.rows = self.$gridContainer.find('.nestedTable .jqgrow');
                            done();
                        });
                });
                after(function () {
                    cleanUp(this);
                });
                it('expandAllParentRows/collapseAllParentRows: expands or collapse all row parents', function () {
                    var numberOfParents = this.rows.length,
                        expandIconClass = "tr[role='row'] .ui-icon.ui-icon-minus",
                        collapseIconClass = "tr[role='row'] .ui-icon.ui-icon-plus",
                        expandedRowParents = this.$gridTable.find(expandIconClass),
                        collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length == 0, "all row parents are not expanded");
                    assert.isTrue(collapsedRowParents.length == numberOfParents, "all row parents are collapsed");

                    //expand all rows
                    this.gridWidgetObj.expandAllParentRows();
                    expandedRowParents = this.$gridTable.find(expandIconClass);
                    collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length == numberOfParents, "all row parents are expanded");
                    assert.isTrue(collapsedRowParents.length == 0, "all row parents are not collapsed");

                    //collapse all rows
                    this.gridWidgetObj.collapseAllParentRows();
                    expandedRowParents = this.$gridTable.find(expandIconClass);
                    collapsedRowParents = this.$gridTable.find(collapseIconClass);
                    assert.isTrue(expandedRowParents.length == 0, "all row parents are not expanded");
                    assert.isTrue(collapsedRowParents.length == numberOfParents, "all row parents are collapsed");
                });
            });
        });

        describe('Grid Widget NonJQuery Action/Events', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                this.rows = [];
                delete this.gridWidgetConfElements.actionButtons.actionStatusCallback;
                var self = this,
                    rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                        "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                        "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                        "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"],
                    baseCallback = function (key, keyData) {
                        self.callbackInvoked = true;
                    },
                    callbacks = {
                        createEvent: function (e, addGridRow) {
                            baseCallback("createEvent", addGridRow);
                        },
                        updateEvent: function (e, updatedGridRow) {
                            baseCallback("updateEvent", updatedGridRow);
                        },
                        deleteEvent: function (e, deletedGridRows) {
                            baseCallback("deleteEvent", deletedGridRows);
                        },
                        testPublishGrid: function (e, selectedRows) {
                            baseCallback("testPublishGrid", selectedRows);
                        },
                        testCloseGrid: function (e, selectedRows) {
                            baseCallback("testCloseGrid", selectedRows);
                        },
                        subMenu: function (e, selectedRows) {
                            baseCallback("subMenu", selectedRows);
                        },
                        oneDropdown: function (e, selectedRows) {
                            baseCallback("oneDropdown", selectedRows);
                        },
                        customCheckboxAction: function (e, selectedRows) {
                            baseCallback("customCheckboxAction", selectedRows);
                        },
                        customLinkAction: function (e, selectedRows) {
                            baseCallback("customLinkAction", selectedRows);
                        },
                        gridLoaded: function (e, selectedRows) {
                            self.$actionContainer = self.$gridContainer.find(".sub-header");
                            for (var i = 0; i < rowIds.length; i++) {
                                self.rows[i] = self.$gridContainer.find('#' + rowIds[i]);
                            }
                            done();
                            console.log("gridLoaded");
                            console.log(selectedRows);
                        },
                        gridOnRowSelection: function (e, selectedRows) {
                            self.callbackRowSelectionInvoked = true;
                            console.log("gridOnRowSelection");
                            console.log(selectedRows);
                        }
                    };
                this.actionEvents = {
                    "createEvent": {
                        "name": "AddRow",
                        "handler": [callbacks.createEvent]
                    },
                    "updateEvent": {
                        "name": "UpdateRow",
                        "handler": [callbacks.updateEvent]
                    },
                    "deleteEvent": {
                        "name": "DeleteRow",
                        "handler": [callbacks.deleteEvent]
                    },
                    "testPublishGrid": {
                        "name": "testPublishGridNonJquery",
                        "handler": [callbacks.testPublishGrid]
                    },
                    "testCloseGrid": {
                        "name": "testCloseGridNonJquery",
                        "handler": [callbacks.testCloseGrid]
                    },
                    "testCloseGrid1": {
                        "name": "testCloseGrid1NonJquery",
                        "handler": [callbacks.testCloseGrid]
                    },
                    "subMenu": {
                        "name": "subMenu",
                        "handler": [callbacks.subMenu]
                    },
                    "dropdownKey": {
                        "name": "oneDropdown",
                        "handler": [callbacks.oneDropdown]
                    },
                    "customCheckboxAction": {
                        "name": "customCheckboxAction",
                        "handler": [callbacks.customCheckboxAction]
                    },
                    "customLinkAction": {
                        "name": "customLinkAction",
                        "handler": [callbacks.customLinkAction]
                    },
                    "gridLoaded": {
                        "handler": [callbacks.gridLoaded]
                    },
                    "gridOnRowSelection": {
                        "handler": [callbacks.gridOnRowSelection]
                    }
                };

                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0],
                    "actionEvents": this.actionEvents
                }).build();
                this.customButtonsByType = function (customButtons) {
                    var buttonsByType = {
                        "buttons": {},
                        "icons": {},
                        "menus": {},
                        "dropdown": {},
                        "custom": {}
                    };
                    var addButtonProperty = function (property, value) {
                        buttonsByType[property][value.key] = value;
                    };
                    customButtons.forEach(function (button) {
                        if (button.button_type) {
                            addButtonProperty("buttons", button);
                        } else if (button.icon_type) {
                            addButtonProperty("icons", button);
                        } else if (button.menu_type) {
                            addButtonProperty("menus", button);
                        } else if (button.dropdown_type) {
                            addButtonProperty("dropdown", button);
                        } else if (button.custom_type) {
                            addButtonProperty("custom", button);
                        }

                    });
                    return buttonsByType;
                }(this.gridWidgetConfElements.actionButtons.customButtons);
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain CRUD action buttons: create and action should be triggered', function () {
                var $createIcon = this.$actionContainer.find(".create");
                assert.equal($createIcon.length, 1, "the create action icon was added to the action bar of the grid");
                //invoke create action
                this.callbackInvoked = false;
                $createIcon.trigger("click");
                assert.equal(this.callbackInvoked, true, "the create action was invoked");
            });
            it('should contain CRUD action buttons: edit', function () {
                var $editIcon = this.$actionContainer.find(".edit");
                assert.equal($editIcon.length, 1, "the edit action icon was added to the action bar of the grid");
                //invoke edit action
                this.callbackInvoked = false;
                this.rows[1].find(".cbox").trigger("click");
                $editIcon.trigger("click");
                assert.equal(this.callbackInvoked, true, "the edit action was invoked");
                this.rows[1].find(".cbox").trigger("click");
            });
            it('should contain CRUD action buttons: delete', function () {
                var $deleteIcon = this.$actionContainer.find(".delete");
                assert.equal($deleteIcon.length, 1, "the delete action icon was added to the action bar of the grid");
                //invoke delete action
                this.callbackInvoked = false;
                this.rows[0].find(".cbox").trigger("click");
                $deleteIcon.trigger("click");
                $(".slipstream-overlay-widget-content .yesButton").trigger("click");
                assert.equal(this.callbackInvoked, true, "the delete action was invoked");
            });
            it('should contain custom action buttons', function () {
                this.rows[1].find(".cbox").trigger("click");
                var buttons = this.customButtonsByType.buttons;
                for (var buttonKey in buttons) {
                    if (this.actionEvents[buttonKey]) {
                        var $button = this.$actionContainer.find("#" + buttonKey + " input");
                        assert.equal($button.attr('type'), "button", "the button was added to the action bar of the grid");
                        //invoke button action
                        this.callbackInvoked = false;
                        $button.trigger("click");
                        assert.equal(this.callbackInvoked, true, "the button action was invoked");
                        break;
                    }
                    assert.isTrue(false, "no custom buttons were tested");
                }
                this.rows[1].find(".cbox").trigger("click");
            });
            it('should contain custom icons', function () {
                this.rows[1].find(".cbox").trigger("click");
                var icons = this.customButtonsByType.icons;
                for (var iconKey in icons) {
                    if (this.actionEvents[iconKey]) {
                        var $icon = this.$actionContainer.find("#" + iconKey);
                        assert.isTrue($icon.hasClass("actionIcon"), "the icon was added to the action bar of the grid");
                        //invoke button action
                        this.callbackInvoked = false;
                        $icon.trigger("click");
                        assert.equal(this.callbackInvoked, true, "the icon action was invoked");
                        break;
                    }
                    assert.isTrue(false, "no custom icons were tested");
                }
                this.rows[1].find(".cbox").trigger("click");
            });
            it('should contain custom menu buttons', function () {
                var menus = this.customButtonsByType.menus;
                this.rows[1].find(".cbox").trigger("click");
                for (var menuKey in menus) {
                    if (this.actionEvents[menuKey]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + menuKey).hasClass("actionMenu"), "the menu button was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
                this.rows[1].find(".cbox").trigger("click");
            });
            it('should contain dropdown buttons', function () {
                var dropdowns = this.customButtonsByType.dropdown;
                for (var dropdownKey in dropdowns) {
                    if (this.actionEvents[dropdownKey]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + dropdownKey).hasClass("dropdownMenu"), "the dropdown button was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
            });
            it('should contain custom actions', function () {
                this.rows[1].find(".cbox").trigger("click");
                var customs = this.customButtonsByType.custom;
                for (var customKey in customs) {
                    if (this.actionEvents[customKey]) {
                        var $customAction = this.$actionContainer.find("#" + customKey);
                        assert.isTrue($customAction.hasClass("customAction"), "the custom action was added to the action bar of the grid");
                        //invoke custom action
                        this.callbackInvoked = false;
                        $customAction.trigger("click");
                        assert.equal(this.callbackInvoked, true, "the icon action was invoked");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
                this.rows[1].find(".cbox").trigger("click");
            });
            it('should bind new event', function () {
                var moreCallbackInvoked = false,
                    gridOnRowSelectionMore = function (e, rowSelection) {
                        moreCallbackInvoked = true;
                    };
                this.callbackRowSelectionInvoked = false;
                this.rows[1].find(".cbox").trigger("click");
                assert.equal(this.callbackRowSelectionInvoked, true, "the rowSelection events was invoked");
                assert.equal(moreCallbackInvoked, false, "the rowSelection events was invoked");

                this.gridWidgetObj.bindEvents({
                    "gridOnRowSelection": {
                        "handler": [gridOnRowSelectionMore]
                    }
                });

                this.callbackRowSelectionInvoked = false;
                assert.equal(moreCallbackInvoked, false, "the rowSelection events was invoked");
                this.rows[1].find(".cbox").trigger("click");
                assert.equal(this.callbackRowSelectionInvoked, true, "the rowSelection events was invoked");
                assert.equal(moreCallbackInvoked, true, "the new rowSelection events was also invoked");
            });
            it('should unbind new event', function () {
                var moreCallbackInvoked = false,
                    gridOnRowSelectionMore = function (e, rowSelection) {
                        moreCallbackInvoked = true;
                    };
                this.gridWidgetObj.bindEvents({
                    "gridOnRowSelection": {
                        "handler": [gridOnRowSelectionMore]
                    }
                });

                this.callbackRowSelectionInvoked = false;
                this.rows[1].find(".cbox").trigger("click");
                assert.equal(this.callbackRowSelectionInvoked, true, "the rowSelection events was invoked");
                assert.equal(moreCallbackInvoked, true, "the rowSelection events was invoked");

                this.gridWidgetObj.unbindEvents({
                    "gridOnRowSelection": {
                        "handler": [gridOnRowSelectionMore]
                    }
                });

                this.callbackRowSelectionInvoked = false;
                moreCallbackInvoked = false;
                this.rows[1].find(".cbox").trigger("click");
                assert.equal(this.callbackRowSelectionInvoked, true, "the rowSelection events was invoked");
                assert.equal(moreCallbackInvoked, false, "the new rowSelection events was not invoked");
            });
        });

        describe('Grid Widget Action Bar', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = configurationSample.simpleGrid;
                this.actionEvents = {
                    "createEvent": "AddRow",
                    "updateEvent": "UpdateRow",
                    "deleteEvent": "DeleteRow",
                    "testPublishGrid": "testPublishGrid",
                    "testCloseGrid": "testCloseGrid",
                    "subMenu": "subMenu",
                    "dropdownKey": "oneDropdown",
                    "customCheckboxAction": "customCheckboxAction",
                    "customLinkAction": "customLinkAction"
                };
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0],
                    "actionEvents": this.actionEvents
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
                this.customButtonsByType = function (customButtons) {
                    var buttonsByType = {
                        "buttons": {},
                        "icons": {},
                        "menus": {},
                        "dropdown": {},
                        "custom": {}
                    };
                    var addButtonProperty = function (property, value) {
                        buttonsByType[property][value.key] = value;
                    };
                    customButtons.forEach(function (button) {
                        if (button.button_type) {
                            addButtonProperty("buttons", button);
                        } else if (button.icon_type) {
                            addButtonProperty("icons", button);
                        } else if (button.menu_type) {
                            addButtonProperty("menus", button);
                        } else if (button.dropdown_type) {
                            addButtonProperty("dropdown", button);
                        } else if (button.custom_type) {
                            addButtonProperty("custom", button);
                        }

                    });
                    return buttonsByType;
                }(this.gridWidgetConfElements.actionButtons.customButtons);
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain CRUD action buttons: create', function () {
                assert.equal(this.$gridContainer.find('.sub-header .create').length, 1, "the create action icon was added to the action bar of the grid");
            });
            it('should contain CRUD action buttons: edit', function () {
                assert.equal(this.$gridContainer.find('.sub-header .edit').length, 1, "the edit action icon was added to the action bar of the grid");
            });
            it('should contain CRUD action buttons: delete', function () {
                assert.equal(this.$gridContainer.find('.sub-header .delete').length, 1, "the delete action icon was added to the action bar of the grid");
            });
            it('should contain custom action buttons', function () {
                var buttons = this.customButtonsByType.buttons;
                for (var key in buttons) {
                    if (this.actionEvents[key]) {
                        assert.equal(this.$gridContainer.find('.sub-header #' + key + ' input').attr('type'), "button", "the button was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom buttons were tested");
                }
            });
            it('should contain custom icons', function () {
                var icons = this.customButtonsByType.icons;
                for (var key in icons) {
                    if (this.actionEvents[key]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + key).hasClass("actionIcon"), "the icon was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom icons were tested");
                }
            });
            it('should contain custom menu buttons', function () {
                var menus = this.customButtonsByType.menus;
                for (var key in menus) {
                    if (this.actionEvents[key]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + key).hasClass("actionMenu"), "the menu button was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
            });
            it('should contain dropdown buttons', function () {
                var dropdowns = this.customButtonsByType.dropdown;
                for (var key in dropdowns) {
                    if (this.actionEvents[key]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + key).hasClass("dropdownMenu"), "the dropdown button was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
            });
            it('should contain custom actions', function () {
                var customs = this.customButtonsByType.custom;
                for (var key in customs) {
                    if (this.actionEvents[key]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + key).hasClass("customAction"), "the custom action was added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
            });
            it('custom buttons/menus/icons should be disabled and enabled w.r.t the disabledStatus property', function () {
                var customButtons = this.gridWidgetConfElements.actionButtons.customButtons;
                for (var i = 0; i < customButtons.length; i++) {
                    var buttonDisabled;
                    var buttonEnabled;
                    if (customButtons[i].menu_type) {
                        buttonEnabled = ".sub-header #" + customButtons[i].key + ":not(.disabled)";
                        buttonDisabled = ".sub-header #" + customButtons[i].key + ".disabled";
                    } else if (customButtons[i].dropdown_type) {
                        buttonEnabled = ".sub-header #" + customButtons[i].key;
                        buttonDisabled = ".sub-header #" + customButtons[i].key + "[disabled]";
                    } else {
                        buttonDisabled = ".sub-header #" + customButtons[i].key + " .disabled";
                        buttonEnabled = ".sub-header #" + customButtons[i].key + " :not(.disabled)";
                    }
                    if (_.isBoolean(customButtons[i].disabledStatus) && customButtons[i].key) {
                        assert.isTrue(this.$gridContainer.find(buttonDisabled).length > 0, customButtons[i].key + " on action bar should not be enabled");
                    }
                    else {
                        assert.isTrue(this.$gridContainer.find(buttonEnabled).length > 0, customButtons[i].key + "  on action bar should not be disabled");
                    }
                }
            });
        });

        describe('Grid Widget Action Bar with Overridden Default Buttons', function () {
            before(function (done) {
                var self = this,
                    rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                this.$gridContainer = createContainer();
                var gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                gridWidgetConfElements.actionButtons.defaultButtons =
                    {
                        "create": {
                            // "menu_type": true, //commenting it out to exercise the grid default value
                            "label": "Create",
                            "key": "createMenu",
                            "items": [{
                                "label": "Open grid overlay",
                                "key": "createMenu1"
                            }, {
                                "label": "Create Menu2",
                                "key": "createMenu2"
                            }],
                            "disabledStatus": false
                        },
                        "delete": {
                            "button_type": true,
                            "label": "Publish",
                            "key": "deleteButton",
                            "disabledStatus": false
                        },
                        "edit": {
                            "icon_type": true,
                            "label": "Close",
                            "icon": {
                                default: "icon_archive_purge-bg",
                                hover: "icon_archive_purge_hover-bg",
                                disabled: "icon_exit_filters_disable"
                            },
                            "disabledStatus": false,
                            "key": "editIcon"
                        }
                    };
                this.actionEvents = {
                    "createEvent": "AddRow",
                    "updateEvent": "UpdateRow",
                    "deleteEvent": "DeleteRow",
                    "testPublishGrid": "testPublishGrid",
                    "testCloseGrid": "testCloseGrid",
                    "subMenu": "subMenu",
                    "deleteButton": "deleteButton",
                    "editIcon": "editIcon",
                    "createMenu": "createMenu"
                };
                this.gridWidgetObj = new GridWidget({
                    "elements": gridWidgetConfElements,
                    "container": this.$gridContainer[0],
                    "actionEvents": this.actionEvents
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    self.$row = self.$gridContainer.find("#" + rowId);
                    done();
                });
                //returns the custom buttons and the default buttons which have been overridden
                this.customButtonsByType = function (actionButtons) {
                    var customButtons = actionButtons.customButtons;
                    var defaultButtons = actionButtons.defaultButtons;
                    var buttonsByType = {
                        "buttons": {},
                        "icons": {},
                        "menus": {}
                    };
                    var addButtonProperty = function (property, value) {
                        buttonsByType[property][value.key] = value;
                    };
                    for (var key in defaultButtons) {
                        customButtons.push(defaultButtons[key]);
                    }
                    customButtons.forEach(function (button) {
                        if (button.button_type) {
                            addButtonProperty("buttons", button);
                        } else if (button.icon_type) {
                            addButtonProperty("icons", button);
                        } else if (button.menu_type) {
                            addButtonProperty("menus", button);
                        }
                    });
                    return buttonsByType;
                }(gridWidgetConfElements.actionButtons);
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain custom action buttons and overridden default buttons', function () {
                var buttons = this.customButtonsByType.buttons;
                for (var key in buttons) {
                    if (this.actionEvents[key]) {
                        assert.equal(this.$gridContainer.find('.sub-header #' + key + ' input').attr('type'), "button", "the custom action button should have been added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom buttons were tested");
                }
            });
            it('should contain custom icons and overridden default icons and action event should be triggered', function () {
                var icons = this.customButtonsByType.icons;
                for (var key in icons) {
                    if (this.actionEvents[key]) {
                        var $icon = this.$gridContainer.find('.sub-header #' + key),
                            numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                        this.$gridContainer.bind(key, function (e, rowData) {
                            assert.isTrue(_.isObject(rowData), "an event is triggered with data of the row that was selected");
                            assert.equal(numberOfSelectedRows + 1, rowData.numberOfSelectedRows, "the number of selected rows gets updated");
                        });
                        assert.isTrue($icon.hasClass("actionIcon"), "the custom action button should have been added to the action bar of the grid");
                        this.$row.trigger("click");
                        $icon.trigger("click");
                        break;
                    }
                    assert.isTrue(false, "no custom icons were tested");
                }
            });
            it('should contain custom menu buttons and overridden default menus', function () {
                var menus = this.customButtonsByType.menus;
                for (var key in menus) {
                    if (this.actionEvents[key]) {
                        assert.isTrue(this.$gridContainer.find('.sub-header #' + key).hasClass("actionMenu"), "button", "the custom action button should have been added to the action bar of the grid");
                        break;
                    }
                    assert.isTrue(false, "no custom menu buttons were tested");
                }
            });
        });

        describe('Grid Widget Action Bar with RBAC', function () {
            var old_verifyaccess;
            before(function (done) {
                old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;

                Slipstream.SDK.RBACResolver.prototype.verifyAccess = function () {
                    return false;
                };
                this.deferred = $.Deferred();
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = configurationSample.simpleGrid;
                this.actionEvents = {
                    "testCloseGrid": {
                        capabilities: ['CreatePolicy'],
                        name: "testCloseGrid"
                    },
                    subMenu: {
                        capabilities: ['CreatePolicy'],
                        name: "subMenu"
                    }
                };
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0],
                    "actionEvents": this.actionEvents
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
                cleanUp(this);
            });
            it('should NOT contain custom action button', function () {
                var $button = this.$gridContainer.find('#testCloseGrid_button');
                assert.isTrue($button.length == 0, "no testCloseGrid custom button in the DOM");
            });
            it('should NOT contain custom menu', function () {
                var $menu = this.$gridContainer.find('#subMenu');
                assert.isTrue($menu.length == 0, "no subMenu custom menu in the DOM");
            });
        });

        describe('Grid Widget Filter Options', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = configurationSample.simpleGrid;
                this.filterConfiguration = this.gridWidgetConfElements.filter;
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain search button', function () {
                if (this.filterConfiguration && (this.filterConfiguration.searchUrl || this.filterConfiguration.searchResult)) {
                    var $searchButton = this.$gridContainer.find('.filter-container .grid_filter_input');
                    assert.notEqual($searchButton.css("display"), "none", "the search button is visible");
                    assert.isTrue($searchButton.hasClass("collapse-search"), "the search input area of the button is collapsed by default");
                } else {
                    assert.isTrue(false, "no search button was tested");
                }
            });
            it('search button searches when there is data in the search field and toggles the input field if the data in the search field is empty', function () {
                if (this.filterConfiguration && (this.filterConfiguration.searchUrl || this.filterConfiguration.searchResult)) {
                    var $search = this.$gridContainer.find('.filter-container .grid_filter_input');
                    var $searchIcon = $search.find(".filter-icon");
                    var $searchField = $search.find(".filter");
                    $searchIcon.trigger("click");
                    assert.isFalse($search.hasClass("collapse-search"), "the search input is open");
                    $searchIcon.trigger("click");
                    assert.isTrue($search.hasClass("collapse-search"), "the search input is open");
                    $searchIcon.trigger("click");
                    $searchField.val("Swena");
                    $searchIcon.trigger("click");
                    assert.isFalse($search.hasClass("collapse-search"), "the search input is open");
                    var tokens = this.gridWidgetObj.getSearchWidgetInstance().getAllTokens();
                    assert.isTrue(tokens.indexOf("Swena") >= 0, "the string is searched");
                    $searchIcon.trigger("click");
                    assert.isTrue($search.hasClass("collapse-search"), "the search input is closed");
                }
            });
            it('should contain filter menu', function () {
                if (this.filterConfiguration && (this.filterConfiguration.columnFilter || this.filterConfiguration.showFilter)) {
                    var $filterButton = this.$gridContainer.find('.filter-container .grid_show_filters');
                    assert.notEqual($filterButton.css("display"), "none", "the filter menu is visible");
                } else {
                    assert.isTrue(false, "no filter menu was tested");
                }
            });
            it('should contain options menu', function () {
                if (this.filterConfiguration && this.filterConfiguration.optionMenu) {
                    var $optionsMenu = this.$gridContainer.find('.filter-container .grid_filter_options');
                    assert.notEqual($optionsMenu.css("display"), "none", "the options menu is visible");
                } else {
                    assert.isTrue(false, "no options menu was tested");
                }
            });
        });

        describe('Grid Widget with Collection Data', function () {
            describe('Simple Grid', function () {
                var obj = {
                    "$gridContainer": null,
                    "gridWidgetConfElements": null,
                    "gridWidgetObj": null
                },
                isInvoked = false,
                isSearchInvoked = false,
                data = firewallPoliciesData.firewallPoliciesAll["policy-Level1"]["policy-Level2"]["policy-Level3"],
                filteredData = firewallPoliciesData.firewallPoliciesFiltered["policy-Level1"]["policy-Level2"]["policy-Level3"];

                before(function (done) {
                    function renderData (renderGridPage, page, searchTokens, gridSize){
                        if (page && page.length > 0){
                            isInvoked = true;
                            renderGridPage(data, {
                                numberOfPage: 1,
                                totalPages: 1,
                                totalRecords: data.length
                            });
                        }
                        if (searchTokens && searchTokens.length > 0){
                            isSearchInvoked = true;
                            renderGridPage(filteredData, {
                                numberOfPage: 1,
                                totalPages: 1,
                                totalRecords: filteredData.length
                            });
                        }
                        
                        done();
                    };
                    obj.$gridContainer = createContainer();
                    obj.gridWidgetConfElements = _.extend({}, configurationSample.modelViewGrid, {filter: true, getPageData: renderData, numberOfRows: data.length});
                    obj.gridWidgetObj = new GridWidget({
                        "elements": obj.gridWidgetConfElements,
                        "container": obj['$gridContainer'][0],
                    }).build();
                });

                after(function () {
                    cleanUp(obj);
                });
                describe('Grid Loads', function () {
                    it('callback should be invoked', function () {
                        var expectedNumberOfRows = obj.gridWidgetObj.getAllVisibleRows().length;
                        assert.isTrue(isInvoked, "render function has been triggered");
                        assert.isFalse(isSearchInvoked, "there is no search token when the grid loaded");
                        assert.equal(expectedNumberOfRows, data.length, "rows are added in the grid");
                    });
                });
                describe('Grid Search', function () {
                    it('callback should be invoked', function () {
                        obj.gridWidgetObj.search(["a"]);
                        
                        var expectedNumberOfRows = obj.gridWidgetObj.getAllVisibleRows().length;
                        assert.isTrue(isSearchInvoked, "there is search token after search is triggered");
                        assert.equal(expectedNumberOfRows, filteredData.length, "filtered data is added in the grid");
                    });
                });
            });
            describe('Tree Grid', function () {
                var obj = {
                    "$gridContainer": null,
                    "gridWidgetConfElements": null,
                    "gridWidgetObj": null
                },
                isInvoked = false, 
                isSearchInvoked = false,
                data = firewallPoliciesTreeDataJson.firewallPoliciesAll.ruleCollection.rules,
                filteredData = firewallPoliciesTreeDataJson.firewallPoliciesPage2.ruleCollection.rules;

                before(function (done) {
                    function renderData (renderGridPage, page, searchTokens, gridSize){
                        if (page && page.length > 0){
                            isInvoked = true;
                            renderGridPage(data, {
                                numberOfPage: 1,
                                totalPages: 1,
                                totalRecords: data.length
                            });
                        }

                        if (searchTokens && searchTokens.length > 0){
                            isSearchInvoked = true;
                            renderGridPage(filteredData, {
                                numberOfPage: 1,
                                totalPages: 1,
                                totalRecords: filteredData.length
                            });
                        }
                        done();
                    };
                    obj.$gridContainer = createContainer();
                    obj.gridWidgetConfElements = _.extend({}, configurationTreeSample.treeGridMV, {filter: true, getPageData: renderData, numberOfRows: data.length});

                    obj.gridWidgetObj = new GridWidget({
                        "elements": obj.gridWidgetConfElements,
                        "container": obj['$gridContainer'][0],
                    }).build();
                });

                after(function () {
                    cleanUp(obj);
                });
                describe('Grid Loads', function () {
                    it('callback should be invoked', function () {
                        assert.isTrue(isInvoked, "render function has been triggered");
                        assert.isFalse(isSearchInvoked, "there is no search token when the grid loaded");

                        var expectedNumberOfRows = obj.gridWidgetObj.getAllVisibleRows().length;
                        assert.equal(expectedNumberOfRows, data.length, "data is added in the grid");
                    });
                });
                describe('Grid Search', function () {
                    it('callback should be invoked', function () {
                        obj.gridWidgetObj.search(["a"]);
                        
                        var expectedNumberOfRows = obj.gridWidgetObj.getAllVisibleRows().length;
                        assert.isTrue(isSearchInvoked, "there is search token after search is triggered");
                        assert.equal(expectedNumberOfRows, filteredData.length, "filtered data is added in the grid");
                    });
                });
            });
        });

        describe('Grid Widget Group Column', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = configurationSample.simpleGrid;
                this.filterConfiguration = this.gridWidgetConfElements.filter;
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain grouped columns with collapse/expand group options', function () {
                var $groupColumns = this.$gridContainer.find(".ui-jqgrid-labels th.groupColumn"),
                    groupSize = $groupColumns.length;
                assert.isTrue(groupSize >= 3, "grid with at least groups with 3 columns -start, middle and end- is available");

                //start of the group
                var $groupStart = $groupColumns.eq(groupSize - 3),
                    $groupControl = $groupStart.find(".group-control");
                assert.equal($groupControl.length, 1, "expand group option exists in a column that is at the beginning of a group of columns");
                assert.isTrue($groupControl.hasClass("hide"), "expand group is hidden for a grid that is rendered for the first time");

                //middle of the group
                var $groupMiddle = $groupColumns.eq(groupSize - 2),
                    $groupControl = $groupMiddle.find(".group-control");
                assert.equal($groupControl.length, 0, "expand/collapse group is not available in a column that is in the middle of a group of columns");

                //end of the group
                var $groupEnd = $groupColumns.eq(groupSize - 1),
                    $groupControl = $groupEnd.find(".group-control");
                assert.equal($groupControl.length, 1, "collapse option exists in a column that is at the end of a group of columns");
                assert.isFalse($groupControl.hasClass("hide"), "collapse group is visible for a grid that is rendered for the first time");

            });
            it('should collapse/expand group columns', function () {
                var $groupColumns = this.$gridContainer.find(".ui-jqgrid-labels th.groupColumn"),
                    $groupStart = $groupColumns.eq(0),
                    $groupExpand = $groupStart.find(".group-control"),
                    $groupEnd = $groupColumns.eq(1),
                    $groupCollapse = $groupEnd.find(".group-control");

                //collapse a group
                assert.notEqual($groupStart.css("display"), "none", "column that starts the group is visible");
                assert.notEqual($groupEnd.css("display"), "none", "column that ends the group is visible");
                $groupCollapse.trigger("click");
                assert.notEqual($groupStart.css("display"), "none", "column that starts the group is visible");
                assert.equal($groupEnd.css("display"), "none", "column that ends the group is collapsed");

                //expand a group
                $groupExpand.trigger("click");
                assert.notEqual($groupStart.css("display"), "none", "column that starts the group is visible");
                assert.notEqual($groupEnd.css("display"), "none", "column that ends the group is visible");
            });
            it('should provide which columns are collapsed in group collapsed state', function () {
                var $groupColumns = this.$gridContainer.find(".ui-jqgrid-labels th.groupColumn"),
                    groupSize = $groupColumns.length,
                    $groupStart = $groupColumns.eq(groupSize-3),
                    $groupExpand = $groupStart.find(".group-control"),
                    $groupEnd = $groupColumns.eq(groupSize-1),
                    $groupCollapse = $groupEnd.find(".group-control");

                //collapse a group
                $groupCollapse.trigger("click");
                var $groupCount = $groupStart.find(".group-label .group-count")
                assert.equal($groupCount.text(), "+2", "text with how many columns are collapsed is available");
                assert.isTrue($groupCount.hasClass("tooltipstered"), "tooltip is available to detail the columns that belongs to the group");

                //expand a group
                $groupExpand.trigger("click");
            });
        });

        describe('Grid Widget Quick View', function () {
            describe('Simple Grid', function () {
                beforeEach(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                    this.$gridContainer = createContainer();
                    var gridLoaded = function () { //waits for data to be loaded
                        self.$row = self.$gridContainer.find("#" + rowId);
                        done();
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(true, {}, configurationSample.simpleGrid),
                        "container": this.$gridContainer[0],
                        "actionEvents": {
                            "gridLoaded": {
                                "handler": [gridLoaded]
                            }
                        }
                    }).build();
                });
                afterEach(function () {
                    cleanUp(this);
                });
                it('should contain the quickView icon on row hover', function () {
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".quickView").length, 1, "the row hover menu is available");
                });
                it('should invoke the quickView callback', function () {
                    var self = this,
                        isQuickViewInvoked = false,
                        quickView = function (e, quickViewData) {
                            isQuickViewInvoked = true;
                            assert.isObject(quickViewData, "quickViewEvent callback should have the quickViewData Object");
                            assert.equal(quickViewData.lastSelectedRowId, self.$row.attr("id"), "quickViewData callback parameter provides data for the row that triggered the quick view");
                        };
                    this.gridWidgetObj.bindEvents({
                        "quickViewEvent": {
                            "name": "quickViewNonJQueryEvent",
                            "handler": [quickView]
                        }
                    });
                    this.$row.find(".quickView").trigger("click");
                    // assert.isTrue(isQuickViewInvoked, "quickViewEvent handler should be invoked"); //PR 1358038: SVG is not triggering click event
                });
                it('should remove the data-preview-triggered using the removeQuickView method', function () {
                    var self = this,
                        isQuickViewInvoked = false,
                        quickView = function (e, quickViewData) {
                            isQuickViewInvoked = true;
                            assert.isTrue(self.$row.find(".quickView[data-preview-triggered]").length == 1, "quick view is available");
                            self.gridWidgetObj.removeQuickView();
                            assert.isFalse(self.$row.find(".quickView[data-preview-triggered]").length == 1, "quick view is removed");
                        };
                    this.gridWidgetObj.bindEvents({
                        "quickViewEvent": {
                            "name": "quickViewNonJQueryEvent",
                            "handler": [quickView]
                        }
                    });
                    assert.isFalse(this.$row.find(".quickView[data-preview-triggered]").length == 1, "quick view is not triggered");
                    this.$row.find(".quickView").trigger("click");
                    // assert.isTrue(isQuickViewInvoked, "quickViewEvent handler should be invoked"); //PR 1358038: SVG is not triggering click event
                });
                it('should not unselect other rows when the quickView icon is clicked', function () {
                    var self = this,
                        isQuickViewInvoked = false,
                        rowIds = ["184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante",
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____",
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"],
                        quickView = function (e, quickViewData) {
                            isQuickViewInvoked = true;
                            assert.isObject(quickViewData, "quickViewEvent callback should have the quickViewData Object");
                            var previousSelectedRows = self.gridWidgetObj.getSelectedRows();
                            assert.isTrue(previousSelectedRows.length == rowIds.length, "some rows are still selected after quick view was triggered");
                            assert.isTrue(previousSelectedRows[0].name == rowIds[0], "id of the selected row is available");
                            assert.equal(quickViewData.lastSelectedRowId, self.$row.attr("id"), "quickViewData callback parameter provides data for the row that triggered the quick view");
                            assert.equal(quickViewData.nonQuickViewSelectedRows.numberOfSelectedRows, previousSelectedRows.length, "quickViewData callback parameter provides data for the rows that are selected");
                        };
                    this.gridWidgetObj.bindEvents({
                        "quickViewEvent": {
                            "name": "quickViewNonJQueryEvent",
                            "handler": [quickView]
                        }
                    });
                    var $gridTable = this.$gridContainer.find('.gridTable');
                    rowIds.forEach(function (id) {
                        $gridTable.find('#' + id + " .cbox").trigger("click");
                    });
                    assert.isTrue(this.gridWidgetObj.getSelectedRows().length == rowIds.length, "some rows are selected before quick view is triggered");
                    this.$row.find(".quickView").trigger("click");
                    // assert.isTrue(isQuickViewInvoked, "quickViewEvent handler should be invoked"); //PR 1358038: SVG is not triggering click event
                });
            });
            describe('Tree Grid', function () {
                before(function (done) {
                    var self = this,
                        rowId = "24a";
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        self.$row = self.$gridContainer.find("#" + rowId);
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain the quickView icon on row hover', function () {
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".quickView").length, 1, "the row hover menu is available");
                });
                it('should invoke the quickView callback', function () {
                    var self = this,
                        isQuickViewInvoked = false,
                        quickView = function (e, quickViewData) {
                            isQuickViewInvoked = true;
                            assert.isObject(quickViewData, "quickViewEvent callback should have the quickViewData Object");
                            assert.equal(quickViewData.lastSelectedRowId, self.$row.attr("id"), "quickViewData callback parameter provides data for the row that triggered the quick view");
                            self.gridWidgetObj.removeQuickView();
                        };
                    this.gridWidgetObj.bindEvents({
                        "quickViewEvent": {
                            "name": "quickViewNonJQueryEvent",
                            "handler": [quickView]
                        }
                    });
                    this.$row.find(".quickView").trigger("click");
                    // assert.isTrue(isQuickViewInvoked, "quickViewEvent handler should be invoked"); //PR 1358038: SVG is not triggering click event
                });
            });
        });

        describe('Grid Widget Page Size', function () {
            describe('Grid Widget with numberOfRows less than the default page size', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('default page size is set', function () {
                    assert.equal(this.$gridContainer.find(".jqgrow").length, 50, "the page size is less than 50 and it's set to the default 50");
                });
            });
            describe('Grid Widget with user defined page size', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.autoPageSize = false; //by default true, the pageSize is set to fit 50 rows or more, with this property disabled (off), a smaller page size is allowed
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('numbersOfRows page size is set', function () {
                    assert.equal(this.$gridContainer.find(".jqgrow").length, this.gridWidgetConfElements.numberOfRows, "the page size is set as per the default numbersOfRows");
                });
            });
        });

        describe('Grid Widget Size', function () {
            describe('Grid Widget with auto height and auto width', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    var gridWidgetConfElements = $.extend(true, {}, configurationSample.smallGrid);
                    gridWidgetConfElements.height = "auto";
                    gridWidgetConfElements.showWidthAsPercentage = true;
                    this.gridWidgetObj = new GridWidget({
                        "elements": gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        self.$gridWidgetContainer = self.$gridContainer.find(".grid-widget");
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('auto width is set', function () {
                    assert.isTrue(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-width"), "auto width has been set");
                });
                it('auto height is set', function () {
                    assert.isTrue(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-height"), "auto height has been set");
                });
            });
            describe('Grid Widget with auto height and fixed width', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    var gridWidgetConfElements = $.extend(true, {}, configurationSample.smallGrid);
                    gridWidgetConfElements.height = "auto";
                    gridWidgetConfElements.showWidthAsPercentage = false;
                    this.gridWidgetObj = new GridWidget({
                        "elements": gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        self.$gridWidgetContainer = self.$gridContainer.find(".grid-widget");
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('fixed width is set', function () {
                    assert.isFalse(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-width"), "fixed width has been set");
                });
                it('auto height is set', function () {
                    assert.isTrue(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-height"), "auto height has been set");
                });
            });
            describe('Grid Widget with auto width and fixed height', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    var gridWidgetConfElements = $.extend(true, {}, configurationSample.smallGrid);
                    gridWidgetConfElements.height = 500;
                    gridWidgetConfElements.showWidthAsPercentage = true;
                    this.gridWidgetObj = new GridWidget({
                        "elements": gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        self.$gridWidgetContainer = self.$gridContainer.find(".grid-widget");
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('auto width is set', function () {
                    assert.isTrue(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-width"), "auto width has been set");
                });
                it('fixed height is set', function () {
                    assert.isFalse(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-height"), "fixed height has been set");
                });
            });
            describe('Grid Widget with fixed height and fixed width', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    var gridWidgetConfElements = $.extend(true, {}, configurationSample.smallGrid);
                    gridWidgetConfElements.height = 500;
                    gridWidgetConfElements.showWidthAsPercentage = false;
                    this.gridWidgetObj = new GridWidget({
                        "elements": gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        self.$gridWidgetContainer = self.$gridContainer.find(".grid-widget");
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('fixed width is set', function () {
                    assert.isFalse(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-width"), "fixed width has been set");
                });
                it('fixed height is set', function () {
                    assert.isFalse(this.$gridWidgetContainer.hasClass("slipstream-widget-auto-height"), "fixed height has been set");
                });
            });
        });

        describe('Grid Widget with Row Hover Menu', function () {
            describe('Grid Widget with Row Hover Menu from an Object configuration', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                    this.$gridContainer = createContainer();
                    this.rowHoverMenu = partialConfigurationSample.rowHoverMenu;
                    this.actionEvents = {
                        "subMenu": "subMenu",
                        "publishGrid": "publishGrid",
                        "publishGrid1": "publishGrid1",
                        "expandAll": "expandAll",
                        "expandAll1": "expandAll1",
                        "editOnRowHover": "editOnRowHover",
                        "deleteOnRowHover": "deleteOnRowHover",
                        "testCloneHover": "testCloneHover"
                    };
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid, {
                        "rowHoverMenu": this.rowHoverMenu
                    });
                    delete this.gridWidgetConfElements.actionButtons.actionStatusCallback;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');

                    this.$gridTable
                        .bind('gridLoaded', function () { //waits for data to be loaded
                            self.$row = self.$gridContainer.find("#" + rowId);
                            done();
                        })
                        .bind(this.actionEvents.testCloneHover, function (evt, selectedRows) {
                            assert.isTrue(_.isObject(selectedRows, "Event associated with an icon in the row hover menu is invoked and an object with the selected rows is available"));
                        });
                });
                afterEach(function () {
                    this.$row.trigger("mouseout");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain the row menu on row hover', function () {
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper").length, 1, "the row hover menu is available");
                });
                it('should contain a default actions defined in defaultButtons property as true (default value) and in the actionEvents property', function () {
                    assert.isTrue(this.rowHoverMenu.defaultButtons.delete, "delete button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.deleteOnRowHover), "delete action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter"); //row on hover
                    var $hoverMenuWrapper = this.$row.find(".hoverMenu-wrapper"),
                        $moreMenuRow = $hoverMenuWrapper.find(".moreMenuRow.actionMenu");
                    assert.equal($moreMenuRow.length, 1, "the more menu is available");
                    //open More menu
                    $moreMenuRow.trigger("mouseover");
                    var $contextMenu = $(".context-menu-list:last"),
                        $menuItems = $contextMenu.find(".context-menu-item");
                    assert.equal($menuItems.length, 2, "items without action type should be part of the more menu");
                    assert.equal($menuItems.eq(0).text(), "Delete", "the delete item on the more menu on row hover is available");
                    $(".context-menu-list:last").trigger('contextmenu:hide');
                    $("#context-menu-layer").remove();
                });
                it('should not contain a default action defined in defaultButtons property as false and in the actionEvents property', function () {
                    assert.isFalse(this.rowHoverMenu.defaultButtons.edit, "edit button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.editOnRowHover), "edit action event is defined in the actionEvents property");
                    //open More menu
                    this.$row.trigger("mouseenter");
                    var $hoverMenuWrapper = this.$row.find(".hoverMenu-wrapper"),
                        $moreMenuRow = $hoverMenuWrapper.find(".moreMenuRow.actionMenu");
                    //open More menu
                    $moreMenuRow.trigger("mouseover");
                    var $contextMenu = $(".context-menu-list:last"),
                        $menuItems = $contextMenu.find(".context-menu-item"),
                        $menuItem;
                    assert.isTrue($menuItems.length > 0, "more menu on row hover has some item menu");
                    $menuItems.each(function () {
                        $menuItem = $(this);
                        assert.notEqual($menuItem.text(), "Edit", "the edit item on the more menu on row hover is not available");
                    });
                    $(".context-menu-list:last").trigger('contextmenu:hide');
                    $("#context-menu-layer").remove();
                });
                it('should contain a custom action in the more menu -missing the action type- defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("testCloneHover"), "testCloneHover item menu is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.testCloneHover), "testCloneHover action event is defined in the actionEvents property");
                    //open More menu
                    this.$row.trigger("mouseenter");
                    var $hoverMenuWrapper = this.$row.find(".hoverMenu-wrapper"),
                        $moreMenuRow = $hoverMenuWrapper.find(".moreMenuRow.actionMenu");
                    //open More menu
                    $moreMenuRow.trigger("mouseover");
                    var $contextMenu = $(".context-menu-list:last"),
                        $menuItems = $contextMenu.find(".context-menu-item");
                    assert.isTrue($menuItems.length > 0, "more menu on row hover has some items menu");
                    assert.equal($menuItems.eq(1).text(), "Clone", "a custom item on the more menu on row hover is available");
                    $(".context-menu-list:last").trigger('contextmenu:hide');
                    $("#context-menu-layer").remove();
                });
                it('should contain a custom button action defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("publishGrid"), "publishGrid button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.publishGrid), "publishGrid action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    var $customButton = this.$row.find(".hoverMenu-wrapper .publishGrid");
                    assert.equal($customButton.length, 1, "the publishGrid button on row hover is available");
                });
                it('should contain a custom icon action defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("expandAll"), "expandAll icon is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.expandAll), "expandAll action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    var $customIcon = this.$row.find(".hoverMenu-wrapper .expandAll");
                    assert.equal($customIcon.length, 1, "the publishGrid button on row hover is available");
                });
                it('should contain a custom menu action defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("subMenu"), "subMenu menu is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.subMenu), "subMenu action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    var $customMenu = this.$row.find(".hoverMenu-wrapper .expandAll");
                    assert.equal($customMenu.length, 1, "the subMenu menu on row hover is available");
                });
                it('should not contain a custom action defined in customButtons property but not in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("testButtonCloneHover"), "testButtonCloneHover button is available from the rowHoverMenu property");
                    assert.isTrue(_.isUndefined(this.actionEvents.testButtonCloneHover), "testButtonCloneHover action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper .testButtonCloneHover").length, 0, "the testCloneHover1 button on row hover is not available");
                });
                it('should enable and disable click events on hover menu items according to their disabledStatus property', function () {
                    this.$row.trigger("mouseenter");
                    var customHoverButtons = this.rowHoverMenu.customButtons;
                    for (var i = 0; i < customHoverButtons.length; i++) {
                        var customHoverButton = customHoverButtons[i],
                            actionDisabled = ".hoverMenu-wrapper ." + customHoverButtons[i].key + " [disabled]",
                            actionEnabled = ".hoverMenu-wrapper ." + customHoverButtons[i].key + " :not([disabled])";
                        if (_.has(customHoverButton, ["button_type", "icon_type", "menu_type"])) {//tested on actions that are not part of the more menu
                            if (_.isBoolean(customHoverButtons[i].disabledStatus) && customHoverButton.key) {
                                assert.equal(this.$row.find(actionDisabled).length, 1, customHoverButton.key + " button on row hover should not be enabled");
                            } else {
                                assert.equal(this.$row.find(actionEnabled).length, 1, customHoverButton.key + " button on row hover should not be disabled");
                            }
                        }
                    }
                });
            });
            describe('Grid Widget with Row Hover Menu from a callback configuration', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent",
                        rowHoverMenuCallback = function () {
                            return self.rowHoverMenu;
                        };
                    this.$gridContainer = createContainer();
                    this.rowHoverMenu = {
                        "defaultButtons": { //overwrite default CRUD grid buttons
                            "delete": {
                                "icon_type": true
                            },
                            "edit": false
                        },
                        "customButtons": [
                            {
                                "button_type": true,
                                "label": "Clone",
                                "key": "testCloneHover",
                                "icon": "icon_clone_blue"
                            },
                            {
                                "icon_type": true,
                                "label": "Info",
                                "key": "testInfoHover",
                                "disabledStatus": true, //default status
                                "icon": {
                                    default: "icon_info_hover",
                                    disabled: "icon_info_disabled"
                                }
                            }
                        ]
                    };
                    this.actionEvents = {
                        "editOnRowHover": "editOnRowHover",
                        "deleteOnRowHover": "deleteOnRowHover",
                        "testCloneHover": "testCloneHover"
                    };
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid, {
                        "rowHoverMenu": rowHoverMenuCallback
                    });
                    delete this.gridWidgetConfElements.actionButtons.actionStatusCallback;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable
                        .bind('gridLoaded', function () { //waits for data to be loaded
                            self.$row = self.$gridContainer.find("#" + rowId);
                            done();
                        })
                        .bind(this.actionEvents.testCloneHover, function (evt, selectedRows) {
                            assert.isTrue(_.isObject(selectedRows, "Event associated with an icon from a callback configuration in the row hover menu is invoked and an object with the selected rows is available"));
                        });
                });
                afterEach(function () {
                    this.$row.trigger("mouseout");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a rowHoverMenu callback and build a row menu on row hover', function () {
                    assert.isFunction(this.gridWidgetConfElements.rowHoverMenu, 'the grid widget configuration should include the rowHoverMenu callback');
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper").length, 1, "the row hover menu is available");
                });
                it('should contain a default action defined in defaultButtons property as true (default value) and in the actionEvents property', function () {
                    assert.isTrue(_.isObject(this.rowHoverMenu.defaultButtons.delete), "delete button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.deleteOnRowHover), "delete action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper .deleteOnRowHover").length, 1, "the delete button on row hover is available");
                });
                it('should not contain a default action defined in defaultButtons property as false and in the actionEvents property', function () {
                    assert.isFalse(this.rowHoverMenu.defaultButtons.edit, "edit button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.editOnRowHover), "edit action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper .editOnRowHover").length, 0, "the edit button on row hover is not available");
                });
                it('should contain a custom action defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("testCloneHover"), "testCloneHover button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.testCloneHover), "testCloneHover action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    var $testCloneIcon = this.$row.find(".hoverMenu-wrapper .testCloneHover");
                    assert.equal($testCloneIcon.length, 1, "the testCloneHover button on row hover is available");
                    $testCloneIcon.trigger("click");
                });
                it('should not contain a custom action defined in customButtons property but not in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("testInfoHover"), "testInfoHover button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.testCloneHover), "testInfoHover action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper .testInfoHover").length, 0, "the testInfoHover button on row hover is not available");
                });
            });
            describe('Grid Widget with Row Hover Menu with limited row interaction', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent",
                        nonInteractionrowIds = ["190002-INS_to_Sircon_drop_em", "196001-VPN_Cleanup_rule__IPSec_1"];
                    this.$gridContainer = createContainer();
                    this.rowHoverMenu = {
                        "customButtons": [
                            {
                                "button_type": true,
                                "label": "Clone",
                                "key": "testCloneHover",
                                "icon": "icon_clone_blue"
                            }
                        ]
                    };
                    this.actionEvents = {
                        "testCloneHover": "testCloneHover"
                    };
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid, {
                        "rowHoverMenu": this.rowHoverMenu,
                        "enabledRowInteraction": function (rowId) {
                            if (~nonInteractionrowIds.indexOf(rowId)) {
                                return false;
                            }
                            return true;
                        }
                    });
                    delete this.gridWidgetConfElements.actionButtons.actionStatusCallback;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');

                    this.$gridTable
                        .bind('gridLoaded', function () { //waits for data to be loaded
                            self.$row = self.$gridContainer.find("#" + rowId);
                            self.$nonInteractionRow = self.$gridContainer.find("#" + nonInteractionrowIds[0]);
                            done();
                        })
                        .bind(this.actionEvents.testCloneHover, function (evt, selectedRows) {
                            assert.isTrue(_.isObject(selectedRows, "Event associated with an icon in the row hover menu is invoked and an object with the selected rows is available"));
                        });
                });
                afterEach(function () {
                    this.$row.trigger("mouseout");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain the row menu on row hover', function () {
                    this.$row.trigger("mouseenter");
                    assert.equal(this.$row.find(".hoverMenu-wrapper").length, 1, "the row hover menu is available");
                });
                it('should contain a custom action defined in customButtons property and in the actionEvents property', function () {
                    assert.isTrue(!!~_.pluck(this.rowHoverMenu.customButtons, "key").indexOf("testCloneHover"), "testCloneHover button is available from the rowHoverMenu property");
                    assert.isTrue(!_.isUndefined(this.actionEvents.testCloneHover), "testCloneHover action event is defined in the actionEvents property");
                    this.$row.trigger("mouseenter");
                    var $testCloneIcon = this.$row.find(".hoverMenu-wrapper .testCloneHover");
                    assert.equal($testCloneIcon.length, 1, "the testCloneHover button on row hover is available");
                    $testCloneIcon.trigger("click");
                });
                it('should not contain the row menu on row hover if the row has enableRowInteraction disabled', function () {
                    this.$nonInteractionRow.trigger("mouseenter");
                    assert.equal(this.$nonInteractionRow.find(".hoverMenu-wrapper").length, 0, "the row hover menu is not available");
                });
            });
        });

        describe('Grid Widget with Selection Container', function () {
            describe('Simple Grid with showSelection option set to default value', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent"];
                    isViewRendered = false;
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () {
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should show selection container with right count on selecting and deselecting a row', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCell.click(); //selects first row
                    numberOfSelectedRows++;
                    var selection_button = this.$gridContainer.find('.selection-count');

                    //MH: unit tests for this describe are failing, to be fixed!
                    // assert.equal(selection_button.css('display') !== 'none', true, 'Selection container is displayed');
                    // assert.equal(_.first(selection_button.text().trim().split(" ")), numberOfSelectedRows, 'Selection count is updated');
                    $firstRowCheckbox.click(); //deselects first row
                    numberOfSelectedRows--;
                    assert.equal(selection_button.css('display') === 'none', true, 'Selection container template is hidden when no row is selected');
                });
                it('should show selection container with right count on selecting a row using metaKey + click', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRow = this.rows[0];
                    var $firstRowCell = $firstRow.find("td").eq(4); // metaKey + click on cell instead of checkbox
                    var evtCommandClick = $.Event("click");
                    evtCommandClick.metaKey = true;
                    $firstRowCell.trigger(evtCommandClick);
                    numberOfSelectedRows++;
                    var selection_button = this.$gridContainer.find('.selection-count');
                    assert.equal(_.isElement(selection_button[0]), true, 'Selection container is displayed');
                    // assert.equal(_.first(selection_button.text().trim().split(" ")), numberOfSelectedRows, 'Selection count is updated');
                });
            });
            describe('Simple Grid with showSelection option set to tooltip object', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent"];
                    isViewRendered = false;
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    var SimpleTooltipView = Backbone.View.extend({
                        render: function () {
                            isViewRendered = true;
                        }
                    });
                    var tooltipConfig = {
                        setTooltipContent: function (currentSelection, renderTooltip) {
                            var tooltipView = new SimpleTooltipView(currentSelection);
                            renderTooltip(tooltipView);
                        }
                    };
                    this.gridWidgetConfElements.showSelection = tooltipConfig;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () {
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Selection Button: Tooltip should appear on hover', function (done) {
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCheckbox.click(); //selects first row
                    var selection_button = this.$gridContainer.find('.selection-count');
                    selection_button.trigger('mouseover');
                    setTimeout(function () {
                        var isTooltipstered = $(selection_button).data('tooltipster-ns') && $(selection_button).data('tooltipster-ns').length > 0;
                        assert.equal(isTooltipstered, true, "Tooltip is attached to selection container");
                        done();
                    }, 600);
                });
                it('Selection Button: Tooltip view should be rendered', function (done) {
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCheckbox.click();
                    var selection_button = this.$gridContainer.find('.selection-count');
                    selection_button.trigger('mouseover');
                    assert.equal(isViewRendered, true, "Defined view is render on tooltip");
                    setTimeout(function () {
                        assert.equal(isViewRendered, true, "Defined view is render on tooltip");
                        done();
                    }, 600);
                });
            });
            describe('Simple Grid with showSelection option set to false', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    this.gridWidgetConfElements.showSelection = false;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Selection container template should not be rendered if showSelection is false', function () {
                    var selection_button = this.$gridContainer.find('.selection-count');
                    assert.equal(_.isElement(selection_button[0]), false, 'Selection container template is not rendered');
                });
            });
            describe('Simple Grid with hideSelectionAndRowCount set to true', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = _.extend({}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.showSelection = true;
                    var footerObj = {
                        footer: {
                            hideSelectionAndRowCount: true
                        }
                    };
                    _.extend(this.gridWidgetConfElements, footerObj);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Selection count and total row count should not be rendered if hideSelectionAndRowCount is true', function () {
                    var selection_button = this.$gridContainer.find('.selection-count');
                    assert.equal(_.isElement(selection_button[0]), false, 'Selection container template is rendered');
                    var rowTotal = (this.$gridContainer.find('.rowTotal'));
                    assert.isTrue(rowTotal.length == 0, 'Total row count is visible');

                });
            });
        });

        describe('Grid Widget Row Selection', function () {
            describe('Simple Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"],
                        unselectableRowId = "190002-INS_to_Sircon_drop_em1",
                        disabledUnselectableRowId = "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____2",

                        enabledRowInteraction = function (rowId, rowData) {
                            if (rowId == unselectableRowId || rowId == disabledUnselectableRowId) {
                                return false;
                            }
                            return true;
                        };
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {
                        "enabledRowInteraction": enabledRowInteraction
                    }, configurationSample.simpleGrid);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                        self.unselectableRow = self.$gridTable.find('#' + unselectableRowId);
                        self.disabledUnselectableRow = self.$gridTable.find('#' + disabledUnselectableRowId);
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection on clicking of either row checkbox or cell with row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCell.click(); //selects first row
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox");
                    $firstRowCheckbox.click(); //deselects first row
                    numberOfSelectedRows--;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the cell for the row checkbox");
                });
                it('should not update row selection by clicking on either row expand/collapse icon or cell with the row row expand/collapse icon', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    for (var rowKey in this.rows) {
                        this.rows[rowKey].find('td .cbox').first().click();
                    }
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, _.size(this.rows), "the row selection got updated by clicking on each of the row checkbox");
                    var $expandCollapseCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_more]');
                    $expandCollapseCell.click();
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, _.size(this.rows), "the row selection was NOT updated by clicking on the expand/collapse icon");
                });
                it('should not update row selection by clicking on the more pill of a cell', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $morePill = this.rows[0].find('.moreTooltip.tooltipstered').first();
                    $morePill.click(); //all other rows gets not unselected, and current row is not selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, numberOfSelectedRows, "the number of selected rows hasn't changed");
                });
                it('should update row selection by clicking on the any cell that is not the expand/collapse icon or the row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $sourceAddressRow = this.rows[0].find('td[aria-describedby$=_destination-address]');
                    $sourceAddressRow.click(); //all other rows gets unselected, and current row is selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, 1, "the row selection gets updated to only 1 row");
                    assert.equal(selectedRows.selectedRowIds[0], this.rows[0].attr("id"), "the row selection id should match the first row");
                });
                it('should not update row selection by clicking on the checkbox of a no selectable row defined with the enabledRowInteraction callback', function () {
                    this.rows[1].find("td .cbox").click(); //select first row
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.notEqual(numberOfSelectedRows, 0, "there are selected rows");
                    assert.isTrue(this.disabledUnselectableRow.hasClass("rowDisabled"), "the row shows disabled");
                    this.disabledUnselectableRow.find("td .cbox").click(); //checkbox of a row not selectable is clicked
                    var newNumberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(newNumberOfSelectedRows, numberOfSelectedRows, "the number of selected rows hasn't changed because the row is not selectable");
                });
                it('should not update row selection by clicking on the checkbox of a disabled and no selectable row defined with the showInactive column and the enabledRowInteraction callback', function () {
                    this.rows[1].find("td .cbox").click(); //select first row
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.notEqual(numberOfSelectedRows, 0, "there are selected rows");
                    this.unselectableRow.find("td .cbox").click(); //checkbox of a row not selectable is clicked
                    var newNumberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(newNumberOfSelectedRows, numberOfSelectedRows, "the number of selected rows hasn't changed because the row is not selectable");
                });
                it('should select and unselect a row by the toggleRowSelection method', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows,
                        rowId = this.rows[2].attr("id");
                    //toggle selection of a row
                    this.gridWidgetObj.toggleRowSelection(rowId, "selected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows + 1, "Row is selected");
                    this.gridWidgetObj.toggleRowSelection(rowId, "unselected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "Row is unselected");
                });
            });
            describe('Tree Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["24a", //multiple items on source-address and destination-address
                            "26", //multiple items on source-address and destination-address
                            "3", //multiple items on destination-address
                            "8"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection on clicking of either row checkbox or cell with row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input');
                    $firstRowCell.click(); //selects first row
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox");

                    $firstRowCheckbox.click(); //deselects first row
                    numberOfSelectedRows--;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the cell for the row checkbox");
                });
                it('should not update row selection by clicking on either row expand/collapse icon or cell with the row row expand/collapse icon', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    for (var rowKey in this.rows) {
                        this.rows[rowKey].find('td[aria-describedby$=slipstreamgrid_select] input').first().click();
                    }
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, _.size(this.rows), "the row selection got updated by clicking on each of the row checkbox");
                    var $expandCollapseCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_more]');
                    $expandCollapseCell.click();
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, _.size(this.rows), "the row selection was NOT updated by clicking on the expand/collapse icon");
                });
                it('should not update row selection by clicking on the more pill of a cell', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.notEqual(numberOfSelectedRows, 0, "there are no selected rows");
                    var $morePill = this.rows[0].find('.moreTooltip.tooltipstered').first();
                    $morePill.click(); //all other rows gets unselected, and current row is selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, numberOfSelectedRows, "the number of selected rows hasn't changed");
                });
                it('should update row selection by clicking on the any cell that is not the expand/collapse icon or the row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.notEqual(numberOfSelectedRows, 0, "there are some selected rows");
                    var $actionRow = this.rows[0].find('td[aria-describedby$=_action]');
                    $actionRow.click(); //all other rows gets unselected, and current row is selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, 1, "the row selection gets updated to only 1 row");
                    assert.equal(selectedRows.selectedRowIds[0], this.rows[0].attr("id"), "the row selection id should match the first row");
                    //clicking on any cell, opens the edit mode of this grid, the next lines will exit edit mode
                    var escapeKeyEvent = $.Event("keydown");
                    escapeKeyEvent.keyCode = escapeKeyEvent.which = 27;
                    this.rows[0].find('input').trigger(escapeKeyEvent);
                });
                it('should select and unselect parent and leaf rows by the toggleRowSelection method', function () {
                    var parentRow = "1",
                        leafRow = "10",
                        numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    //toggle selection of a row parent
                    this.gridWidgetObj.toggleRowSelection(parentRow, "selected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows + 1, "Parent row is selected");
                    this.gridWidgetObj.toggleRowSelection(parentRow, "unselected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "Parent row is unselected");
                    //toggle selection of a row leaf
                    this.gridWidgetObj.toggleRowSelection(leafRow, "selected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, 1 + numberOfSelectedRows, "Leaf row is selected");
                    this.gridWidgetObj.toggleRowSelection(leafRow, "unselected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, + numberOfSelectedRows, "Leaf row is unselected");
                });
            });
            describe('Tree Grid With Preselection', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["25", //row children
                            "26", //row children
                            "24a", //row children
                            "1"]; //row parent
                    this.rows = {};
                    this.parentId = rowIds[rowIds.length - 1]; //parent row is at the end of the array
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGridPreselection;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection on clicking of either the checkbox of the row selection or the cell with row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input'),
                        $secondRowCell = this.rows[1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $secondRowCheckbox = $secondRowCell.find('input');
                    $firstRowCheckbox.click(); //selects first row which is the row
                    numberOfSelectedRows = 2; //parent and child are selected
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox and caused parent and children be selected");
                    $secondRowCell.click(); //selects second child
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows + 1, "the row selection got updated on clicking of the row checkbox and caused parent and children be selected");

                    $secondRowCheckbox.click(); //deselects second child
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox and caused parent and children be selected");

                    $firstRowCell.click(); //deselects first row
                    numberOfSelectedRows = 0; //parent and children are unselected
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the cell for the row checkbox and caused parent and children be deselected");
                });
                it('should not update row selection by clicking on either row expand/collapse icon or cell with the row row expand/collapse icon', function () {
                    var rowsSize = _.size(this.rows),
                        $firstParent = this.rows[rowsSize - 1].find('td[aria-describedby$=slipstreamgrid_select] input').first(),
                        numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    $firstParent.click(); //click on parent
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, rowsSize, "the row selection got updated by clicking on a parent row checkbox");
                    var $expandCollapseCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_more]');
                    $expandCollapseCell.click();
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, rowsSize, "the row selection was NOT updated by clicking on the expand/collapse icon");
                    $firstParent.click(); //resets previous selection
                });
                it('should not update row selection by clicking on the more pill of a cell', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "there are no selected rows");
                    var $morePill = this.rows[0].find('.moreTooltip.tooltipstered').first();
                    $morePill.click(); //all other rows gets unselected, and current row is selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, numberOfSelectedRows, "the number of selected rows hasn't changed");
                });
                it('should update row selection by clicking on the parent row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows,
                        rowsSize = _.size(this.rows);
                    assert.equal(numberOfSelectedRows, 0, "there are no selected rows");
                    var $firstParent = this.rows[rowsSize - 1].find('td[aria-describedby$=slipstreamgrid_select]');
                    $firstParent.click(); //parent and children rows are selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, rowsSize, "the row selection gets updated to parent and children selection");
                    assert.equal(selectedRows.selectedRowIds[0], this.rows[rowsSize - 1].attr("id"), "the first row selection id should match the parent row id");
                    $firstParent.click(); //resets previous selection
                });
                it('should update row selection by clicking on the any cell that is not the expand/collapse icon or the row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "there are some selected rows");
                    var $actionRow = this.rows[0].find('td[aria-describedby$=_action]'),
                        $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]');
                    $actionRow.click(); //all other rows gets unselected, and current row is selected
                    numberOfSelectedRows = 2; //parent and child are selected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, numberOfSelectedRows, "the row selection gets updated to parent and child selection");
                    assert.isTrue(!!~selectedRows.selectedRowIds.indexOf(this.parentId), "the row selection ids should include the parent row id");
                });
                it('should select and unselect parent and leaf rows by the toggleRowSelection method', function () {
                    var parentRow = "2", //parent with 3 children (+4 rows)
                        leafRow = "3",//leaf with a parent (+2 rows)
                        numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    //toggle selection of a row parent (include children)
                    this.gridWidgetObj.toggleRowSelection(parentRow, "selected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, 4 + numberOfSelectedRows, "Parent row and its children are selected");
                    this.gridWidgetObj.toggleRowSelection(parentRow, "unselected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "Parent row and its children are unselected");
                    //toggle selection of a row leaf
                    this.gridWidgetObj.toggleRowSelection(leafRow, "selected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, 2 + numberOfSelectedRows, "Leaf row is selected");
                    this.gridWidgetObj.toggleRowSelection(leafRow, "unselected");
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, + numberOfSelectedRows, "Leaf row is unselected");
                });
            });

        });

        describe('Grid Widget Checkbox Indeterminate State', function () {
            describe('Tree Grid With Preselection', function () {
                before(function (done) {
                    var self = this,
                        rowIds = [
                            "24a", //row children
                            "25", //row children
                            "26", //row children
                            "1"]; //row parent
                    this.rows = [];
                    this.parentId = rowIds[rowIds.length - 1]; //parent row is at the end of the array
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGridPreselection;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows.push(self.$gridTable.find('#' + rowIds[i]));
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update checkbox state on clicking of either row checkbox or cell with row checkbox', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");

                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input'),
                        $selectAllCheckbox = this.$gridContainer.find('.tree-select-all input');
                    assert.isFalse($selectAllCheckbox.is(":checked"), "The state of the checkbox of the select all is NOT checked");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");

                    $firstRowCell.click(); //selects first row which is the row
                    var $parentRowCell = this.rows[this.rows.length - 1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $parentRowCheckbox = $parentRowCell.find('input');
                    assert.isTrue($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is indeterminate");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    $firstRowCheckbox.click(); //deselects first row
                    assert.isFalse($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is NOT indeterminate");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");
                });
                it('should update checkbox state when clicking the parent row', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");

                    var $selectAllCheckbox = this.$gridContainer.find('.tree-select-all input');
                    assert.isFalse($selectAllCheckbox.is(":checked"), "The state of the checkbox of the select all is NOT checked");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");

                    var $parentRowCell = this.rows[this.rows.length - 1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $parentRowCheckbox = $parentRowCell.find('input');
                    $parentRowCheckbox.click(); //selects the parent row
                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input');
                    assert.isTrue($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":checked"), "The state of the checkbox of the parent row is checked");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    $parentRowCheckbox.click(); //deselects the parent row
                    assert.isFalse($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($parentRowCheckbox.is(":checked"), "The state of the checkbox of the parent row is NOT checked");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");
                });
                it('should update checkbox state when selecting all child rows one by one', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");

                    var $selectAllCheckbox = this.$gridContainer.find('.tree-select-all input');
                    assert.isFalse($selectAllCheckbox.is(":checked"), "The state of the checkbox of the select all is NOT checked");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");

                    var $parentRowCell = this.rows[this.rows.length - 1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $parentRowCheckbox = $parentRowCell.find('input');

                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input');
                    $firstRowCheckbox.click(); //selects the first child row
                    assert.isTrue($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is indeterminate");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    var $secondRowCell = this.rows[1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $secondRowCheckbox = $secondRowCell.find('input');
                    $secondRowCheckbox.click(); //selects the second child row
                    assert.isTrue($secondRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is indeterminate");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    var $thirdRowCell = this.rows[2].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $thirdRowCheckbox = $thirdRowCell.find('input');
                    $thirdRowCheckbox.click(); //selects the third child row
                    assert.isTrue($thirdRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":checked"), "The state of the checkbox of the parent row is checked");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    $parentRowCheckbox.click(); //deselects the parent row, so all children will be deselected
                    assert.isFalse($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($secondRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($thirdRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($parentRowCheckbox.is(":checked"), "The state of the checkbox of the parent row is NOT checked");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");
                });
                it('should update checkbox state when using toggleRowSelection method', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");

                    this.gridWidgetObj.toggleRowSelection("24a");

                    var $firstRowCheckbox = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select] input'),
                        $parentRowCheckbox = this.rows[this.rows.length - 1].find('td[aria-describedby$=slipstreamgrid_select] input'),
                        $selectAllCheckbox = this.$gridContainer.find('.tree-select-all input');

                    assert.isTrue($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is checked");
                    assert.isTrue($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is indeterminate");
                    assert.isTrue($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is indeterminate");

                    this.gridWidgetObj.toggleRowSelection("24a");
                    assert.isFalse($firstRowCheckbox.is(":checked"), "The state of the checkbox of the row is NOT checked");
                    assert.isFalse($parentRowCheckbox.is(":indeterminate"), "The state of the checkbox of the parent row is NOT indeterminate");
                    assert.isFalse($selectAllCheckbox.is(":indeterminate"), "The state of the checkbox of the select all is NOT indeterminate");
                });
            });
        });

        describe('Grid Widget Select All', function () {

            describe('Simple Grid - select all rows checkbox', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, configurationSample.modelViewGrid, {
                        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePageSmall.json",
                        "jsonId": "name",
                        "jsonRoot": "policy",
                        "jsonRecords": function (data) {
                            if (!_.isEmpty(data)) {
                                var policyData = data.policy;
                                if (!_.isEmpty(policyData)) {
                                    self.numbersOfRows = policyData.length;
                                    return policyData[0]['junos:total'];
                                }
                            }
                            return 0;
                        }
                    });
                    delete this.gridWidgetConfElements.enabledRowInteraction;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridSelectAll = this.$gridContainer.find(".ui-jqgrid-labels input.cbox");
                    this.$gridTotalRowsFooter = this.$gridContainer.find('.gridTableFooter .totalRows');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        self.$row = self.$gridContainer.find("#" + rowId);
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should select all rows', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.numbersOfRows, "after clicking on select all checkbox, all rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should not change and it should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //unselect all rows
                });
                it('should select all, then unselect one row and then select one row', function () {
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.numbersOfRows, "all rows should be selected");
                    //unselect a row
                    this.$row.find(".cbox").trigger("click"); //one row should be unselected
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.numbersOfRows - 1, "after clicking on a row checkbox that was selected with the select all, the total number of rows should be the all the rows minus the unselected row");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the total number of rows available in the grid data");
                    //select all checkbox should not be checked
                    assert.isFalse(this.$gridSelectAll[0].checked, "select all checkbox should not be checked");
                    //select a row
                    this.$row.find(".cbox").trigger("click"); //one row should be selected
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.numbersOfRows, "after clicking on a row checkbox that was selected with the select all, the total number of rows should be the all the rows plus the selected row");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the total number of rows available in the grid data");
                    //select all checkbox should be checked
                    assert.isTrue(this.$gridSelectAll[0].checked, "select all checkbox should be checked");
                    this.$gridSelectAll.trigger("click"); //unselect all rows
                });
                it('should unselect all rows', function () {
                    this.$gridSelectAll.trigger("click"); //select all rows
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.numbersOfRows, "all rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "after clicking on select all checkbox again, no rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should not change and it should match the numbers of rows available in the grid data");
                });
            });

            describe('Simple Grid - select all rows checkbox except the ones with interaction disabled', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                    this.disabledRowIds = ["190002-INS_to_Sircon_drop_em", "196001-VPN_Cleanup_rule__IPSec_"];
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, configurationSample.modelViewGrid, {
                        "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePageSmall.json",
                        "jsonId": "name",
                        "jsonRoot": "policy",
                        "jsonRecords": function (data) {
                            if (!_.isEmpty(data)) {
                                var policyData = data.policy;
                                if (!_.isEmpty(policyData)) {
                                    self.numbersOfRows = policyData.length;
                                    self.maxNumberOfSelectedRows = policyData.length - self.disabledRowIds.length;
                                    return policyData[0]['junos:total'];
                                }
                            }
                            return 0;
                        },
                        "enabledRowInteraction": function (rowId) {
                            if (~self.disabledRowIds.indexOf(rowId)) {
                                return false;
                            }
                            return true;
                        }
                    });
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridSelectAll = this.$gridContainer.find(".ui-jqgrid-labels input.cbox");
                    this.$gridTotalRowsFooter = this.$gridContainer.find('.gridTableFooter .totalRows');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        self.$row = self.$gridContainer.find("#" + rowId);
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should select all rows', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.maxNumberOfSelectedRows, "after clicking on select all checkbox, all rows should be selected except the ones in the no selection list");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should not change and it should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //unselect all rows
                });
                it('should select all, then unselect one row and then select one row', function () {
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.maxNumberOfSelectedRows, "all rows should be selected except the ones with interaction disabled");
                    //unselect a row
                    this.$row.find(".cbox").trigger("click"); //one row should be unselected
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.maxNumberOfSelectedRows - 1, "after clicking on a row checkbox that was selected with the select all, the total number of rows should be the all the rows, except the ones with interaction disabled, minus the unselected row");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the total number of rows available in the grid data");
                    //select a row
                    this.$row.find(".cbox").trigger("click"); //one row should be unselected
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.maxNumberOfSelectedRows, "after clicking on a row checkbox that was selected with the select all, the total number of rows should be the all the rows, except the ones with interaction disabled, plus the selected row");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the total number of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //forces select all rows required after the row selection happened partially (selectAllReset is on)
                    this.$gridSelectAll.trigger("click"); //unselect all rows
                });
                it('should unselect all rows', function () {
                    this.$gridSelectAll.trigger("click"); //select all rows
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.maxNumberOfSelectedRows, "all rows should be selected except the ones the ones that are in the no selection list");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows available in the grid data");
                    this.$gridSelectAll.trigger("click"); //triggers click on select all checkbox
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "after clicking on select all checkbox again, no rows should be selected");
                    assert.equal(this.$gridTotalRowsFooter.text(), this.numbersOfRows, "numbers of rows in the grid footer section should not change and it should match the numbers of rows available in the grid data");
                });
            });

        });

        describe('Grid Widget Row Selection through keyboard interaction', function () {
            describe('Simple Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante",
                            "190002-INS_to_Sircon_drop_em1",
                            "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS"];
                    this.rows = {};
                    this.$gridContainer = createContainer();

                    this.gridWidgetConfElements = _.extend({}, configurationSample.simpleGrid);
                    var inlineEditObj = {
                        editRow: {
                            showInline: true
                        }
                    };
                    _.extend(this.gridWidgetConfElements, inlineEditObj);

                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection through navigation by shift + up/down arrow keys', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCheckbox.click(); //selects first row
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of a row checkbox");

                });
                it('should select the next row for shift and down arrow ', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    var evtDownArrowKey = $.Event("keydown");
                    evtDownArrowKey.keyCode = evtDownArrowKey.which = 40;
                    evtDownArrowKey.shiftKey = true; //shift & down arrow key

                    $firstRowCheckbox.trigger(evtDownArrowKey);
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got selected on shift + down");
                });
                it('should toggle the row for shift and up arrow ', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $secondRowCell = this.rows[1].find('td').first(),
                        $secondRowCheckbox = $secondRowCell.find('.cbox');
                    var evtUpArrowKey = $.Event("keydown");
                    evtUpArrowKey.keyCode = evtUpArrowKey.which = 38;
                    evtUpArrowKey.shiftKey = true; //shift & up arrow key

                    $secondRowCheckbox.trigger(evtUpArrowKey);
                    numberOfSelectedRows--;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got toggled on shift + up");
                });
                it('should multiselect another row by pressing metaKey + click on a row', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var evtCommandClick = $.Event("click");
                    evtCommandClick.metaKey = true;
                    this.rows[1].trigger(evtCommandClick);
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "another row is selected by pressing metaKey and click");
                });
                it('should not go into edit mode by pressing metaKey + click on a row', function () {
                    var $firstRow = this.rows[0];
                    var $firstRowCell = $firstRow.find("td").eq(4); //get first editable cell.
                    var evtCommandClick = $.Event("click");
                    evtCommandClick.metaKey = true;
                    $firstRowCell.trigger(evtCommandClick);
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable after metaKey + click");
                });
            });
            describe('Grid navigation with special handling for next & prev directions', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante",
                            "190002-INS_to_Sircon_drop_em1",
                            "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should select the correct row when navigating through shift + up arrow key', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox');
                    $firstRowCheckbox.click(); //selects first row

                    var $secondRowCell = this.rows[1].find('td').first(),
                        $secondRowCheckbox = $secondRowCell.find('.cbox');
                    $secondRowCheckbox.click(); //selects second row

                    numberOfSelectedRows += 2;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "rows selection got updated on clicking on row checkbox's");

                    var evtUpArrowKey = $.Event("keydown");
                    evtUpArrowKey.keyCode = evtUpArrowKey.which = 38;
                    evtUpArrowKey.shiftKey = true; //shift & up arrow key

                    $secondRowCheckbox.trigger(evtUpArrowKey);
                    assert.isFalse($firstRowCheckbox.prop('checked'), 'As current row & previous row is selected, toggles current row');
                    $secondRowCheckbox.click();
                });
                it('no shift + down/up selection happen when none of the rows is selected', function () {
                    var $secondRowCell = this.rows[1].find('td').first(),
                        $secondRowCheckbox = $secondRowCell.find('.cbox');
                    $secondRowCheckbox.click(); //selects second row
                    $secondRowCheckbox.click(); //unselects

                    var evtDownArrowKey = $.Event("keydown");
                    evtDownArrowKey.keyCode = evtDownArrowKey.which = 40;
                    evtDownArrowKey.shiftKey = true; //shift & up arrow key

                    $secondRowCheckbox.trigger(evtDownArrowKey);
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, 0, "rows selection got updated on clicking on row checkbox's");
                });
            });
            describe('Tree Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["24a", //multiple items on source-address and destination-address
                            "26", //multiple items on source-address and destination-address
                            "3", //multiple items on destination-address
                            "8"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGrid;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection through navigation by shift + up/down arrow keys', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox_tree');
                    $firstRowCheckbox.click(); //selects first row
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of a row checkbox");
                });
                it('should select the next row for shift and down arrow ', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $firstRowCell = this.rows[0].find('td').first(),
                        $firstRowCheckbox = $firstRowCell.find('.cbox_tree');
                    var evtDownArrowKey = $.Event("keydown");
                    evtDownArrowKey.keyCode = evtDownArrowKey.which = 40;
                    evtDownArrowKey.shiftKey = true; //shift & down arrow key

                    $firstRowCheckbox.trigger(evtDownArrowKey);
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got selected on shift + down");
                    var $secondRowCell = this.rows[1].find('td').first(),
                        $secondRowCheckbox = $secondRowCell.find('.cbox_tree');
                    $secondRowCheckbox.click();
                    $firstRowCheckbox.click();
                });
                it('should toggle the row for shift and up arrow ', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $secondRowCell = this.rows[1].find('td').first(),
                        $secondRowCheckbox = $secondRowCell.find('.cbox_tree');
                    var evtUpArrowKey = $.Event("keydown");
                    evtUpArrowKey.keyCode = evtUpArrowKey.which = 38;
                    evtUpArrowKey.shiftKey = true; //shift & up arrow key

                    $secondRowCheckbox.trigger(evtUpArrowKey);
                    numberOfSelectedRows--;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got toggled on shift + up");
                });
                it('should multiselect another row by pressing metaKey + click on a row', function () {
                    this.rows[1].find('td').first().find('.cbox_tree').click(); //Unselecting existing selection
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var evtCommandClick = $.Event("click");
                    evtCommandClick.metaKey = true;
                    this.rows[2].trigger(evtCommandClick);
                    numberOfSelectedRows++;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "another row is selected by pressing metaKey and click");
                });
            });
            /*
            //SPOG-3241 needs to be completed before keyboard selection for tree grid preselection can be concluded using SPOG-3586. Use case that still needs to be implemented is described on: GNATS 1383490
            describe('Tree Grid With Preselection', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["25", //row children
                            "26", //row children
                            "24a", //row children
                            "1"]; //row parent
                    this.rows = {};
                    this.parentId = rowIds[rowIds.length - 1]; //parent row is at the end of the array
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGridPreselection;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should update row selection through navigation by shift + down arrow keys', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "the first time a grid is rendered, no rows should be selected");
                    var $firstRowCell = this.rows[0].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input');
                    $firstRowCheckbox.click(); //selects first row which is the row
                    numberOfSelectedRows = 2; //parent and child are selected
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox and caused parent and children be selected");

                    var evtDownArrowKey = $.Event("keydown");
                    evtDownArrowKey.keyCode = evtDownArrowKey.which = 40;
                    evtDownArrowKey.shiftKey = true; //shift & down arrow key
                    $firstRowCheckbox.trigger(evtDownArrowKey);
                    numberOfSelectedRows = 3; //parent and child are selected
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the row selection got updated on clicking of the row checkbox and caused parent and children be selected");
                });
                it('should update row selection through navigation by shift + up arrow keys', function () {
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $firstRowCell = this.rows[1].find('td[aria-describedby$=slipstreamgrid_select]'),
                        $firstRowCheckbox = $firstRowCell.find('input');

                    var evtUpArrowKey = $.Event("keydown");
                    evtUpArrowKey.keyCode = evtUpArrowKey.which = 38;
                    evtUpArrowKey.shiftKey = true; //shift & up arrow key

                    $firstRowCheckbox.trigger(evtUpArrowKey);
                    numberOfSelectedRows = 2; //parent and child are selected
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "the current row was deselected when shift up was pressed");
                });
            });
            */
        });

        describe('Grid Widget Row Selection through keyboard interaction using user provided callback', function () {
            describe('Simple Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante",
                            "190002-INS_to_Sircon_drop_em1",
                            "191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationSample.simpleGrid;
                    this.onSelectRowRangeInvoked = false; //a flag to check if user provided callback was invoked or not.
                    this.rowIdsInRange = [
                        "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____",
                        "195002-SEC_-_NEMO_Project__-_Waiver___1156_-_Pa__SEC_VPN_connec24",
                        "196001-VPN_Cleanup_rule__IPSec_4",
                        "201003-Blue_Coat_drop_rule_-_CRQ_4620_04-11-2012_Sante24",
                        "190002-INS_to_Sircon_drop_em1"];
                    this.gridWidgetConfElements.onSelectRowRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, start, limit) {
                        setIdsInRangeSuccess(self.rowIdsInRange); //returning set of ids within start and start+limit
                        self.onSelectRowRangeInvoked = true;
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should multiselect from beginning consecutive rows by shift + click when there is no existing (initialRowId) row selection', function () {
                    this.onSelectRowRangeInvoked = false;
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "no rows are selected");

                    //when there are no existing row selection, try shift + click
                    var $thirdRowCell = this.rows[2].find('td').first(),
                        $thirdRowCheckbox = $thirdRowCell.find('.cbox');

                    var shiftClick = $.Event("click");
                    shiftClick.shiftKey = true;
                    shiftClick.target = $thirdRowCheckbox[0];
                    this.$gridTable.trigger(shiftClick);

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 3, "consecutive rows are selected by pressing shift and click from the beginning");
                    assert.isFalse(this.onSelectRowRangeInvoked, 'onSelectRowRange method not invoked');
                    $thirdRowCheckbox.trigger('click');
                    for(var i=0;i<2;i++) {
                        var $rowCell = this.rows[i].find('td').first(),
                            $rowCheckbox = $rowCell.find('.cbox');
                        $rowCheckbox.trigger('click');
                    }
                });
                it('should multiselect consecutive rows in DOM by shift + click', function () {
                    var click = $.Event("click");
                    this.rows[0].find('td').first().find(".cbox").trigger(click);

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $fourthRowCell = this.rows[4].find('td').first(),
                        $fourthRowCheckbox = $fourthRowCell.find('.cbox');

                    var shiftClick = $.Event("click");
                    shiftClick.shiftKey = true;
                    shiftClick.target = $fourthRowCheckbox[0];
                    this.$gridTable.trigger(shiftClick); //selects fourth row with shift  

                    numberOfSelectedRows = numberOfSelectedRows + 4;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "consecutive rows are selected by pressing shift and click");

                    var keyUp = $.Event("keyup");
                    keyUp.shiftKey = false;
                    keyUp.target = $fourthRowCheckbox[0];
                    this.$gridTable.trigger(keyUp);

                    var selectedRowIds = this.gridWidgetObj.getSelectedRows(true).selectedRowIds;
                    for (var index = 0; index <= selectedRowIds.length; index++) {
                        var $firstRowCell = this.$gridTable.find('tr#' + selectedRowIds[index]).find('td').first(),
                            $firstRowCheckbox = $firstRowCell.find('.cbox');
                        $firstRowCheckbox.click(); //deselects selected rows
                    }

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "no rows are selected");
                });
                it('should multiselect consecutive rows by shift + click when there is no initial row in DOM (simulate row selection across pages)', function () {
                    var click = $.Event("click");
                    this.rows[2].find('td').first().find(".cbox").trigger(click);
                    this.onSelectRowRangeInvoked = false;
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 1, "Initial row is selected");

                    var $thirdRowCell = this.rows[4].find('td').first(),
                        $thirdRowCheckbox = $thirdRowCell.find('.cbox');
                    $(this.rows[2]).attr('id', 'unknownRowid'); //simulate DOM removal by removing reference to initial row.

                    var shiftClick = $.Event("click");
                    shiftClick.shiftKey = true;
                    shiftClick.target = $thirdRowCheckbox[0];
                    this.$gridTable.trigger(shiftClick);

                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, this.rowIdsInRange.length, "consecutive rows are selected by pressing shift and click");
                    assert.isTrue(this.onSelectRowRangeInvoked, 'onSelectRowRange method invoked');
                });
            });
            describe('Tree Grid', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["1", "24a", "25", "26", "2", "3", "4", "8", "9"];
                    this.rows = {};
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = configurationTreeSample.treeGrid;
                    this.onSelectRowRangeInvoked = false; //a flag to check if user provided callback was invoked or not.
                    this.rowIdsInRange = ["25", "26", "2", "3", "4"];
                    this.gridWidgetConfElements.onSelectRowRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, start, limit) {
                        setIdsInRangeSuccess(self.rowIdsInRange); //returning set of ids within start and start+limit
                        self.onSelectRowRangeInvoked = true;
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                    $el.show();
                });
                after(function () {
                    $el.hide();
                    cleanUp(this);
                });
                it('should multiselect from beginning consecutive rows by shift + click when there is no existing (initialRowId) row selection', function () {
                    this.onSelectRowRangeInvoked = false;
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "no rows are selected");

                    //when there are no existing row selection, try shift + click
                    var $thirdRowCell = this.rows[4].find('td').first(),
                        $thirdRowCheckbox = $thirdRowCell.find('.cbox_tree');

                    var shiftClick = $.Event("click");
                    shiftClick.shiftKey = true;
                    shiftClick.target = $thirdRowCheckbox[0];
                    $thirdRowCheckbox.prop('checked', true);
                    this.$gridTable.trigger(shiftClick);
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 5, "consecutive rows are selected by pressing shift and click from the beginning");
                    assert.isFalse(this.onSelectRowRangeInvoked, 'onSelectRowRange method not invoked');
                    for(var i=0;i<5;i++) {
                        var $rowCell = this.rows[i].find('td').first(),
                            $rowCheckbox = $rowCell.find('.cbox_tree');
                        $rowCheckbox.trigger('click');
                    }

                });
                it('should multiselect consecutive rows in DOM by shift + click', function () {
                    var click = $.Event("click");
                    this.rows[2].find('td').first().find(".cbox_tree").trigger(click);
                    var numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    var $fourthRowCell = this.rows[5].find('td').first(),
                        $fourthRowCheckbox = $fourthRowCell.find('.cbox_tree');

                    var shiftClick = $.Event("click");
                    shiftClick.shiftKey = true;
                    shiftClick.target = $fourthRowCheckbox[0];
                    $fourthRowCheckbox.prop('checked', true);
                    this.$gridTable.trigger(shiftClick); //selects fourth row with shift  

                    numberOfSelectedRows = numberOfSelectedRows + 3;
                    assert.equal(this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows, numberOfSelectedRows, "consecutive rows are selected by pressing shift and click");

                    for(var i=2;i<=5;i++) {
                        var $rowCell = this.rows[i].find('td').first(),
                            $rowCheckbox = $rowCell.find('.cbox_tree');
                        $rowCheckbox.trigger('click');
                    }
                    numberOfSelectedRows = this.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, 0, "no rows are selected");
                });
            });
        });

        describe('Grid Widget Edition with Integrated Widgets', function () {
            before(function (done) {
                var self = this,
                    rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent";
                this.gridWidgetConfElements = $.extend(true, {
                    "editRow": {"showInline": true},
                }, configurationSample.simpleGrid);
                this.gridWidgetConfElements.columns.push(partialConfigurationSample.actionColumn);
                this.$gridContainer = createContainer();
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0],
                    "actionEvents": {
                        "gridLoaded": {
                            "handler": [function () { //waits for data to be loaded
                                done();
                                self.$row = self.$gridTable.find('#' + rowId);
                            }]
                        },

                    }
                }).build();
                this.$gridTable = this.$gridContainer.find('.gridTable');
            });
            after(function () {
                cleanUp(this);
            });
            it('should trigger gridRowOnEditMode event when a row enters edit mode for an integrated Dropdown widget', function () {
                var self = this;
                this.gridWidgetObj.bindEvents({
                    "gridRowOnEditMode": {
                        "handler": [function (e, rowOnEdition) {
                            var dropdownChangeEventName = "slipstreamGrid.edit:dropdownChange";
                            self.gridOnEditMode = true;
                            assert.isObject(rowOnEdition, "rowOnEdition is an Object with the properties required to update the row");
                            var actionDropdown = rowOnEdition.integratedWidgets["action"][1];
                            //listen for change event on actionDropdown
                            actionDropdown && actionDropdown.$container.unbind(dropdownChangeEventName).bind(dropdownChangeEventName, function (e, data) {
                                self.dropdownChange = true;
                            });
                        }]
                    }
                });
                var $firstCell = this.$row.find("td").eq(3); //get first editable cell
                assert.equal(this.$row.attr("editable"), undefined, "Row is not editable before click");
                this.gridOnEditMode = false;
                $firstCell.click(); // should enter into edit mode.
                assert.equal(this.$row.attr("editable"), 1, "Row is editable after click");
                assert.isTrue(self.gridOnEditMode, "'gridRowOnEditMode' event is triggered when a row enters edit mode");

                var $dropdownAction = this.$row.find(".dropdown-widget-integration[data-column-name='action'] select");
                this.dropdownChange = false;
                $dropdownAction.val('deny').trigger('change');
                assert.isTrue(self.dropdownChange, "'slipstreamGrid.edit:dropdownChange' event is triggered when a row enters edit mode");

                var escapeKeyEvent = $.Event("keydown");
                escapeKeyEvent.keyCode = escapeKeyEvent.which = 27; //escape key
                this.$row.find('input').trigger(escapeKeyEvent);
                assert.equal(this.$row.attr('editable'), 0, "Row is not editable after escape keypress");
            });
        });

        describe('Grid Widget Row Creation and Edition', function () {
            describe('Simple Grid Edition', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"],
                        unselectableRowId = "190002-INS_to_Sircon_drop_em1",
                        enabledRowInteraction = function (rowId, rowData) {
                            if (rowId == unselectableRowId) {
                                return false;
                            }
                            return true;
                        };
                    this.rows = {};
                    this.gridWidgetConfElements = $.extend(true, {
                        "editRow": {"showInline": true},
                        "enabledRowInteraction": enabledRowInteraction
                    }, configurationSample.simpleGrid);

                    this.gridWidgetConfElements.columns.push({
                        "index": "condition1",
                        "name": "condition1",
                        "label": "Condition1",
                        "collapseContent": true,
                        "editCell": {
                            "type": "input"
                        }
                    }, {
                        "index": "condition",
                        "name": "condition",
                        "label": "Condition",
                        "collapseContent": true,
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
                        }
                    });
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                        self.unselectableRow = self.$gridTable.find('#' + unselectableRowId);
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should enter and exit from inline cell edit by pressing escape key', function () {
                    var $firstRow = this.rows[0];
                    var $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable before click");
                    $firstRowCell.click(); // should enter into edit mode.
                    assert.equal($firstRow.attr("editable"), 1, "Row is editable after click");

                    var escapeKeyEvent = $.Event("keydown");
                    escapeKeyEvent.keyCode = escapeKeyEvent.which = 27; //escape key
                    $firstRow.find('input').trigger(escapeKeyEvent);
                    assert.equal($firstRow.attr('editable'), 0, "Row is not editable after escape keypress");
                });
                it('should not enter edit mode by clicking on a cell of a row that is not selectable as defined with the onSelect callback', function () {
                    var $firstRowCell = this.unselectableRow.eq(3); //get first editable cell.
                    assert.equal(this.unselectableRow.attr("editable"), undefined, "Row is not editable before click");
                    $firstRowCell.click(); // should not enter into edit mode.
                    assert.equal(this.unselectableRow.attr("editable"), undefined, "Row is not editable after click");
                });
                it('should render default and custom input elements for default and collapseContent cells except the cells that are not editable', function () {
                    var $firstRow = this.rows[0];
                    var $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    $firstRowCell.click(); // should enter into edit mode
                    var $sourceAddressCell = $firstRow.find("td[aria-describedby$=_source-address]"),
                        $applicationServicesCell = $firstRow.find("td[aria-describedby$=_application-services]"),
                        $conditionCell1 = $firstRow.find("td[aria-describedby$=_condition1]"),
                        $conditionCell = $firstRow.find("td[aria-describedby$=_condition]"),
                        $actionCell = $firstRow.find("td[aria-describedby$=_action]");

                    assert.isTrue($conditionCell1.find(".emptyCell").length == 0, "The emptyCell template is NOT added in the beginning");
                    assert.equal($sourceAddressCell.find(".editable textarea").length, 1, "Cell should be on edit mode with default texarea input for a collapseContent cell");
                    assert.equal($applicationServicesCell.find(".editable").length, 0, "Cell should not be on edit mode");
                    assert.equal($conditionCell1.find(".editable input").length, 2, "Cell should be on edit mode with input option for a collapseContent cell with editCell.type input");
                    assert.equal($conditionCell.find(".editable .dropdown-widget-integration.dropdown-widget").length, 2, "Cell should be on edit mode with an integrated dropdown widget for each item of s collapseContent cell with editCell.type dropdown");
                    assert.equal($actionCell.find(".editable .dropdown-widget-integration.dropdown-widget").length, 1, "Cell should be on edit mode with an integrated dropdown widget for a regular cell with editCell.type dropdown");

                    //Update the condition1 input cell
                    $conditionCell1.find("input").val("");

                    //exit row edition by clicking on the same row
                    this.rows[0].click();

                    assert.equal($sourceAddressCell.find(".editable textarea").length, 0, "Cell should exit edit mode for a collapseContent cell");
                    assert.equal($conditionCell1.find(".editable input").length, 0, "Cell should exit edit mode for a collapseContent cell with editCell.type input");
                    assert.equal($conditionCell.find(".editable .dropdown-widget-integration.dropdown-widget").length, 0, "Cell should exit edit mode for a collapseContent cell with editCell.type dropdown");
                    assert.equal($actionCell.find(".editable .dropdown-widget-integration.dropdown-widget").length, 0, "Cell should be exit mode for a regular cell with editCell.type dropdown");
                    assert.isTrue($conditionCell1.find(".emptyCell").length > 0, "The emptyCell template is added after the value is updated");
                });
                it('should enter inline edit mode and update the row on save', function () {
                    var $firstRow = this.rows[0],
                        $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    $firstRowCell.click(); // should enter into edit mode.
                    var $nameCellInput = $firstRow.find("td[aria-describedby$=_name] input"),
                        $saveIcon = $firstRow.find(".save-inline-row"),
                        originalValue = $nameCellInput.val(),
                        newValue = "test123";
                    //update row
                    $nameCellInput.val(newValue);
                    assert.notEqual(originalValue, newValue, "An input field is updated on edit mode");
                    //save row
                    $saveIcon.trigger("click");
                    var $nameCell = $firstRow.find("td[aria-describedby$=_name]");
                    assert.equal($nameCell.text(), newValue, "Row is updated after clicking on save row");
                });
                it('should enter inline edit mode and discard row updates on cancel', function () {
                    var $firstRow = this.rows[0],
                        $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    $firstRowCell.click(); // should enter into edit mode.
                    var $nameCellInput = $firstRow.find("td[aria-describedby$=_name] input"),
                        $cancelIcon = $firstRow.find(".cancel-inline-row"),
                        originalValue = $nameCellInput.val(),
                        newValue = "noTest123";
                    //update row
                    $nameCellInput.val(newValue);
                    //cancel row
                    $cancelIcon.trigger("click");
                    var $nameCell = $firstRow.find("td[aria-describedby$=_name]");
                    assert.notEqual($nameCell.text(), newValue, "Row is not updated after clicking on cancel row");
                });
            });
            describe('Simple Grid Creation and Edition Callbacks', function () {
                before(function (done) {
                    var self = this,
                        rowId = "183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent",
                        updatedDateRow = "2007-20-06",
                        setUpdateCallbackState = function (onCreate, onEdit) {
                            self.updateCallbackState = {
                                "onCreate": onCreate,
                                "onEdit": onEdit
                            };
                        },
                        updateRow = function (layoutOptions, rowData, success) {
                            var updatedRow;
                            setUpdateCallbackState(false, false); //resets callback state
                            if (!_.isUndefined(rowData.defaultRow)) { //onCreate callback is invoked
                                setUpdateCallbackState(true, false);
                                updatedRow = rowData.defaultRow;
                            } else { //onEdit callback is invoked
                                setUpdateCallbackState(false, true);
                                updatedRow = _.extend(rowData.originalRow, {"date": updatedDateRow});
                            }
                            success(updatedRow);
                        };
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, configurationSample.simpleGrid, {
                        "createRow": {
                            "onCreate": updateRow
                        },
                        "editRow": {
                            "onEdit": updateRow
                        }
                    });
                    delete this.gridWidgetConfElements.actionButtons.actionStatusCallback;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": {
                            "createEvent": "AddRow",
                            "updateEvent": "UpdateRow"
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable
                        .bind('gridLoaded', function () { //waits for data to be loaded
                            self.$row = self.$gridContainer.find("#" + rowId);
                            done();
                        })
                        .bind("gridRowOnEditMode", function (e, updatedRow) {
                            assert.equal(updatedRow.currentRow.date, updatedDateRow, "row property got updated after onEdit callback was invoked");
                        });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should show create button', function () {
                    this.$createButton = this.$gridContainer.find(".create");
                    assert.isTrue(_.isElement(this.$createButton[0]), "the create button is rendered");
                    assert.isTrue(this.$createButton.css("display") != "none", "the create button is not hidden");
                });
                it('should show edit button', function () {
                    this.$editButton = this.$gridContainer.find(".edit");
                    assert.isTrue(_.isElement(this.$editButton[0]), "the edit button is rendered");
                    assert.isTrue(this.$editButton.css("display") != "none", "the edit button is not hidden");
                });
                it('should invoke createRow callback and add a row', function () {
                    var expectedNumberOfRows = this.gridWidgetObj.getAllVisibleRows().length + 1; //current number of rows plus one that will be added in the next step
                    this.$createButton.click();
                    var currentNumberOfRows = this.gridWidgetObj.getAllVisibleRows().length;
                    assert.deepEqual({
                        "onCreate": true,
                        "onEdit": false
                    }, this.updateCallbackState, "onCreate callback was invoked");
                    assert.equal(expectedNumberOfRows, currentNumberOfRows, "a new row was added");
                });
                it('should invoke editRow callback and edit a row', function () {
                    this.$row.find(".cbox").trigger("click"); //one row should be unselected
                    var selectedRows = this.gridWidgetObj.getSelectedRows(true);
                    assert.equal(selectedRows.numberOfSelectedRows, 1, "one row should be selected so it can be edited");
                    this.$editButton.click();
                    assert.deepEqual({
                        "onCreate": false,
                        "onEdit": true
                    }, this.updateCallbackState, "onEdit callback was invoked");
                });
            });
            describe('Tree Grid Edition Callback', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["24a", "0", "1"],
                        onBeforeEdit = function (rowId, rawData, rowData, isTreeRowParent) {
                            if (rowId == rowIds[1]) {
                                return false;
                            } else if (isTreeRowParent) { //rowIds[2]
                                return { //disable some cells for editing
                                    "sourceAddress.addresses": false,
                                    "destinationAddress.addresses": false,
                                    "application-services": false,
                                    "applications": false,
                                    "action": false
                                };
                            }
                            return true;
                        };
                    this.rows = {};
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGrid, {
                        "editRow": {
                            "showInline": true,
                            "onBeforeEdit": onBeforeEdit
                        }
                    });
                    this.gridWidgetConfElements.columns[0] = {
                        "index": "name",
                        "name": "name",
                        "label": "Name",
                        "editCell": {
                            "type": "input"
                        }
                    };
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () {
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should enter and exit from inline cell edit by pressing escape key', function () {
                    var $firstRow = this.rows[0];
                    var $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable before click");
                    $firstRowCell.click(); // should enter into edit mode.
                    assert.equal($firstRow.attr("editable"), 1, "Row is editable after click");

                    var escapeKeyEvent = $.Event("keydown");
                    escapeKeyEvent.keyCode = escapeKeyEvent.which = 27; //escape key
                    $firstRow.find('input').trigger(escapeKeyEvent);
                    assert.equal($firstRow.attr('editable'), 0, "Row is not editable after escape keypress");
                });
                it('should not enter edit mode by clicking on a cell of a row that is not editable as defined with the onBeforeEdit callback', function () {
                    var $firstRow = this.rows[1];
                    var $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable before click");
                    $firstRowCell.click(); // should not enter into edit mode.
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable after click");
                });
                it('should have restricted edit mode by clicking on a cell of a row that is not editable as defined with the onBeforeEdit callback', function () {
                    var $firstRow = this.rows[2];
                    var $firstRowCell = $firstRow.find("td").eq(3); //get first editable cell.
                    assert.equal($firstRow.attr("editable"), undefined, "Row is not editable before click");
                    $firstRowCell.click(); // should not enter into edit mode.
                    var $editable = $firstRow.find("td:not([style='display:none;']) .editable");
                    assert.equal($editable.length, 1, "One cell in the row is editable after click");
                });
                it('should enter inline edit mode and update the row on save', function () {
                    var $thirdRow = this.rows[0],
                        $firstRowCell = $thirdRow.find("td").eq(3); //get first editable cell.
                    $firstRowCell.click(); // should enter into edit mode.
                    var $nameCellInput = $thirdRow.find("td[aria-describedby$=_name] input"),
                        $saveIcon = $thirdRow.find(".save-inline-row"),
                        originalValue = $nameCellInput.val(),
                        newValue = "test123";
                    //update row
                    $nameCellInput.val(newValue);
                    assert.notEqual(originalValue, newValue, "An input field is updated on edit mode");
                    //save row
                    $saveIcon.trigger("click");
                    var $nameCell = $thirdRow.find("td[aria-describedby$=_name]");
                    assert.equal($nameCell.text(), newValue, "Row is updated after clicking on save row");
                });
                it('should enter inline edit mode and discard row updates on cancel', function () {
                    var $thirdRow = this.rows[2],
                        $firstRowCell = $thirdRow.find("td").eq(3); //get first editable cell.
                    $firstRowCell.click(); // should enter into edit mode.
                    var $nameCellInput = $thirdRow.find("td[aria-describedby$=_name] input"),
                        $cancelIcon = $thirdRow.find(".cancel-inline-row"),
                        originalValue = $nameCellInput.val(),
                        newValue = "noTest123";
                    //update row
                    $nameCellInput.val(newValue);
                    //cancel row
                    $cancelIcon.trigger("click");
                    var $nameCell = $thirdRow.find("td[aria-describedby$=_name]");
                    assert.notEqual($nameCell.text(), newValue, "Row is not updated after clicking on cancel row");
                });
            });
        });

        describe('Grid Widget Row Deletion', function () {
            describe('Default Confirmation Dialog', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"];
                    this.rows = {};
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    delete this.gridWidgetConfElements.deleteRow;
                    this.$gridContainer = createContainer();
                    this.actionEvents = {
                        "deleteEvent": "DeleteRow"
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                    this.$deleteButton = this.$gridContainer.find(".delete");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should show delete button', function () {
                    assert.isTrue(_.isElement(this.$deleteButton[0]), "the delete button is rendered");
                    assert.isTrue(this.$deleteButton.css("display") != "none", "the create button is not hidden");
                });
                it('should show delete message and call onDelete callback', function () {
                    this.rows[1].trigger("click");
                    this.rows[3].trigger("click");
                    this.$deleteButton.removeClass("disabled").trigger("click");

                    //gets overlay content
                    var $overlayContent = $(".bbm-modal__section"),
                        selectedRows = this.gridWidgetObj.getSelectedRows(true),
                        confirmationDialogMessage = $overlayContent.find(".question").text(),
                        defaultDialogMessage = "Delete the " + selectedRows.numberOfSelectedRows + " selected items?";
                    assert.isTrue(defaultDialogMessage == confirmationDialogMessage, "the delete message is showed with the user defined content");
                    $overlayContent.empty();
                });
            });
            describe('Custom Confirmation Dialog', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"];
                    this.rows = {};
                    this.userDefinedMessage = "Custom Message";
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.deleteRow = {
                        "message": function () {
                            return self.userDefinedMessage;
                        },
                        "onDelete": function () {
                            self.onDeleteCallback = true;
                        }
                    };
                    this.$gridContainer = createContainer();
                    this.actionEvents = {
                        "deleteEvent": "DeleteRow"
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                    this.$deleteButton = this.$gridContainer.find(".delete");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should show delete button', function () {
                    assert.isTrue(_.isElement(this.$deleteButton[0]), "the delete button is rendered");
                    assert.isTrue(this.$deleteButton.css("display") != "none", "the create button is not hidden");
                });
                it('should show delete message and call onDelete callback', function () {
                    this.rows[1].trigger("click");
                    this.rows[3].trigger("click");
                    this.$deleteButton.removeClass("disabled").trigger("click");

                    //gets overlay content
                    var $overlayContent = $(".bbm-modal__section");
                    var confirmationDialogMessage = $overlayContent.find(".question").text();
                    assert.isTrue(this.userDefinedMessage == confirmationDialogMessage, "the delete message is showed with the user defined content");

                    //resets the onDeleteCallback flag
                    this.onDeleteCallback = false;
                    $overlayContent.find(".yesButton").trigger("click");
                    assert.isTrue(this.onDeleteCallback, "the onDelete callback is invoked");
                    $overlayContent.empty();
                });
            });
            describe('User Defined Confirmation View', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                            "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                            "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                            "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"];
                    this.rows = {};
                    this.userDefinedMessage = "Custom Message";
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.deleteRow = function (selectedRows, deleteRow, reloadGrid) { //callback where user could define a user defined confirmation view or dialog
                        self.onDeleteRowCallback = true;
                        assert.isObject(selectedRows, "the selectedRows Object with the number of row selected should be available");
                        assert.isFunction(deleteRow, "the deleteRow method should be available so it can be invoked to delete rows");
                        assert.isFunction(reloadGrid, "the reloadGrid method should be available so it can be invoked to reload the grid");
                    };
                    this.$gridContainer = createContainer();
                    this.actionEvents = {
                        "deleteEvent": "DeleteRow"
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": this.actionEvents
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                        for (var i = 0; i < rowIds.length; i++) {
                            self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                        }
                    });
                    this.$deleteButton = this.$gridContainer.find(".delete");
                });
                after(function () {
                    cleanUp(this);
                });
                it('should show delete button', function () {
                    assert.isTrue(_.isElement(this.$deleteButton[0]), "the delete button is rendered");
                    assert.isTrue(this.$deleteButton.css("display") != "none", "the create button is not hidden");
                });
                it('should call onDeleteRow callback', function () {
                    //resets the onDeleteCallback flag
                    this.onDeleteRowCallback = false;

                    this.rows[1].trigger("click");
                    this.rows[3].trigger("click");
                    this.$deleteButton.removeClass("disabled").trigger("click");

                    assert.isTrue(this.onDeleteRowCallback, "the onDeleteRow callback is invoked");
                });
            });
        });

        describe('Grid Widget Item Cell Selection', function () {
            before(function (done) {
                var self = this,
                    rowIds = ["183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent", //multiple items on source-address and destination-address
                        "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante", //multiple items on source-address and destination-address
                        "185003-PSP_sFTP_accessfrom_internet_-_CSD_578275___CRQ_4925____", //multiple items on destination-address
                        "189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante"];
                this.rows = {};
                this.$gridContainer = createContainer();
                this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                this.gridWidgetConfElements.columns[3].collapseContent.multiselect = true; // multiselect for source-address
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridTable = this.$gridContainer.find('.gridTable');
                this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                    for (var i = 0; i < rowIds.length; i++) {
                        self.rows[i] = self.$gridTable.find('#' + rowIds[i]);
                    }
                });
                this.expandRow = function ($row) {
                    //Make sure the row is expanded before selecting cell items
                    $row.find('.slipstreamgrid_more').first().trigger('click');
                };
            });
            after(function () {
                cleanUp(this);
            });
            it('should show all elements with multiselection', function () {
                var $row = this.rows[1];
                this.expandRow($row);

                var $firstMultiselectCell = $row.find('td.multiselect_cell').first(),
                    $multiselectCellItems = $firstMultiselectCell.find(".multiselect-cell-checkbox"),
                    $multiselectCellItem = $multiselectCellItems.eq(0);
                assert.equal($firstMultiselectCell.length, 1, "A multiselect cell is available");
                assert.isTrue($multiselectCellItems.length > 0, "A multiselect cell with multiple items is available");
                assert.equal($multiselectCellItem.attr("type"), "checkbox", "Each items has a checkbox for item selection");
            });
            it('should select items on a cells with multiselection enabled', function () {
                var $row = this.rows[1];
                this.expandRow($row);

                var $multiselectCellItems = $row.find('td.multiselect_cell .multiselect-cell-checkbox'),
                    $multiselectCellItem = $multiselectCellItems.eq(0);
                $multiselectCellItem.trigger("click");
                var numberOfSelectedCellItems = this.$gridContainer.find(".multiselectCellFooter").find(".selectedRows").text();
                assert.isTrue(numberOfSelectedCellItems == 1, "One cell item has been selected and the multiselect footer shows the selection");
            });
        });

        describe('Grid Widget User Preferences for:', function () {
            var initPreferences = function () {
                var preferences = {
                    "prefsFetchCalled": false,
                    "prefsSaveCalled": false,
                    "oldPreferences": Slipstream.SDK.Preferences
                };
                Slipstream.SDK.Preferences.fetch = function (path, prefs) {
                    preferences.prefsFetchCalled = true;
                    preferences.preferencesPath = path;
                    return prefs;
                };
                Slipstream.SDK.Preferences.save = function (path, prefs) {
                    preferences.prefsSaveCalled = true;
                    preferences.savedPreferences = prefs;
                };
                return preferences;
            };

            describe('Simple Grid with onConfigUpdate callback', function () {
                before(function (done) {
                    var self = this;
                    this.preferences = initPreferences();
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0],
                        "onConfigUpdate": function (updatedConf) {
                            self.updatedConfiguration = updatedConf;
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                    this.$gridTable = null;
                    this.updatedConfiguration = null;
                    this.preferences = null;
                });
                it('should trigger column sort and onConfigUpdate callback from the grid configuration should be invoked', function () {
                    var sortingElementsOriginalLength = this.updatedConfiguration && this.updatedConfiguration.elements.sorting ? this.updatedConfiguration.elements.sorting.length : 0;
                    //simulates that user triggers the sorting of a column
                    this.$gridTable.sortGrid('DestinationAddress', true);
                    assert.lengthOf(this.updatedConfiguration.elements.sorting, sortingElementsOriginalLength + 1, 'includes the new sorted column');
                    assert.isFalse(this.preferences.prefsSaveCalled, "the preferences save API should not be called to save the preferences object");
                    assert.isFalse(this.preferences.prefsFetchCalled, "the preferences fetch API should not be called to read the preferences object");
                });
                it('should add a token and then the onConfigUpdate callback from the grid configuration should be invoked', function () {
                    //simulates that user adds a token
                    this.gridWidgetObj.search("test");
                    assert.isNotNull(this.updatedConfiguration.search, "the search parameter in the updatedConfiguration configuration gets updated from the onConfigUpdate callback");
                    assert.includeMembers(this.updatedConfiguration.search, ['test'], 'includes the "test" token');
                    assert.isFalse(this.preferences.prefsSaveCalled, "the preferences save API should not be called to save the preferences object");
                    assert.isFalse(this.preferences.prefsFetchCalled, "the preferences fetch API should not be called to read the preferences object");
                });
            });

            describe('Simple Grid with preferences API', function () {
                before(function (done) {
                    this.preferences = initPreferences();
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0],
                        "sid": "juniper.net:some_plugin:test_grid"
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                    this.preferences = null;
                    this.$gridTable = null;
                });
                it('should call preferences APIs to load and save the grid configuration', function () {
                    assert.isTrue(this.preferences.prefsFetchCalled, "the preferences fetch API should be called to load the grid prefs");
                    assert.equal(this.preferences.preferencesPath, "juniper.net:some_plugin:test_grid");
                    this.preferences.prefsSaveCalled = false; //resets the prefsSaveCalled preferences
                    this.$gridTable.sortGrid('DestinationAddress', true);
                    assert.isTrue(this.preferences.prefsSaveCalled, "the preferences save API should be called when the config changes");
                    assert.equal(this.preferences.savedPreferences.elements.sorting[2]['column'], "DestinationAddress");
                });
            });

            describe('Simple Grid with reconciled configuration', function () {
                var preferences;
                var config;
                var oldfetch, oldsave;

                var sid = "juniper.net:some_plugin:test_grid_reconcile";
                var twoColumnConfig, threeColumnConfig;

                before(function () {
                    // Simulated preferences fetch/save methods
                    preferences = {};
                    config = {};

                    oldfetch = Slipstream.SDK.Preferences.fetch;

                    Slipstream.SDK.Preferences.fetch = function (path, prefs) {
                        preferences.prefsFetchCalled = true;
                        preferences.preferencesPath = path;

                        return config;
                    };

                    oldsave = Slipstream.SDK.Preferences.save;

                    Slipstream.SDK.Preferences.save = function (path, prefs) {
                        preferences.prefsSaveCalled = true;
                        preferences.savedPreferences = prefs;
                        config = prefs;
                    };
                });

                beforeEach(function () {
                    twoColumnConfig = {
                        "elements": {
                            "columns": [
                                {
                                    "index": "c1",
                                    "name": "c1",
                                    "label": "c1"
                                },
                                {
                                    "index": "c2",
                                    "name": "c2",
                                    "label": "c2"
                                }
                            ]
                        },
                        "search": ["abcde"]
                    };

                    threeColumnConfig = {
                        "elements": {
                            "columns": [
                                {
                                    "index": "c1",
                                    "name": "c1",
                                    "label": "c1"
                                },
                                {
                                    "index": "c2",
                                    "name": "c2",
                                    "label": "c2"
                                },
                                {
                                    "index": "c3",
                                    "name": "c3",
                                    "label": "c3"
                                }
                            ]
                        },
                        "search": ["test"]
                    };
                });

                after(function () {
                    Slipstream.SDK.Preferences.fetch = oldfetch;
                    Slipstream.SDK.Preferences.save = oldsave;
                });

                it("should add new column to grid configuration that isn't already in preferences", function () {
                    this.$gridContainer = createContainer();

                    config = twoColumnConfig;

                    this.gridWidgetObj = new GridWidget($.extend({}, threeColumnConfig, {
                        "container": this.$gridContainer[0],
                        "sid": sid
                    })).build();

                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    assert.equal(config.elements.columns.length, 3);
                    assert.equal(config.elements.columns[0].name, "c1");
                    assert.equal(config.elements.columns[1].name, "c2");
                    assert.equal(config.elements.columns[2].name, "c3");
                    assert.isTrue(preferences.prefsFetchCalled);
                    assert.isTrue(preferences.prefsSaveCalled);
                    this.gridWidgetObj.destroy();
                });

                it("should remove old column from grid configuration that exists in preferences", function () {
                    this.$gridContainer = createContainer();

                    config = threeColumnConfig;

                    this.gridWidgetObj = new GridWidget($.extend({}, twoColumnConfig, {
                        "container": this.$gridContainer[0],
                        "sid": sid
                    })).build();

                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    assert.equal(config.elements.columns.length, 2);
                    assert.equal(config.elements.columns[0].name, "c1");
                    assert.equal(config.elements.columns[1].name, "c2");
                    assert.isUndefined(config.elements.columns[2]);
                    assert.isTrue(preferences.prefsFetchCalled);
                    assert.isTrue(preferences.prefsSaveCalled);
                    this.gridWidgetObj.destroy();
                });

                it("should ignore the search criteria that exists in preferences", function () {
                    this.$gridContainer = createContainer();

                    config = threeColumnConfig;

                    this.gridWidgetObj = new GridWidget($.extend({}, twoColumnConfig, {
                        "container": this.$gridContainer[0],
                        "sid": sid,
                        "preferences": {
                            "override": ["search"]
                        }
                    })).build();

                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    assert.equal(config.search[0], twoColumnConfig.search[0]);
                    assert.isTrue(preferences.prefsFetchCalled);
                    assert.isTrue(preferences.prefsSaveCalled);
                    this.gridWidgetObj.destroy();
                });

                it("should NOT ignore the search criteria that exists in preferences", function () {
                    this.$gridContainer = createContainer();

                    config = threeColumnConfig;

                    this.gridWidgetObj = new GridWidget($.extend({}, twoColumnConfig, {
                        "container": this.$gridContainer[0],
                        "sid": sid,
                        "preferences": {
                            "override": ["elements.columns"]
                        }
                    })).build();

                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    assert.equal(config.search[0], threeColumnConfig.search[0]);
                    assert.isTrue(preferences.prefsFetchCalled);
                    assert.isTrue(preferences.prefsSaveCalled);
                    this.gridWidgetObj.destroy();
                });
            });

            describe('Tree Grid with onConfigUpdate callback', function () {
                before(function (done) {
                    var self = this;
                    this.preferences = initPreferences();
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationTreeSample.treeGridPreselection,
                        "container": this.$gridContainer[0],
                        "onConfigUpdate": function (updatedConf) {
                            self.updatedConfiguration = updatedConf;
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                    this.preferences = null;
                    this.updatedConfiguration = null;
                    this.$gridTable = null;
                });
                it('should trigger column sort and onConfigUpdate callback from the grid configuration should be invoked', function () {
                    var sortingElementsOriginalLength = this.updatedConfiguration && this.updatedConfiguration.elements.sorting ? this.updatedConfiguration.elements.sorting.length : 0;
                    //simulates that user triggers the sorting of a column
                    this.$gridTable.sortGrid('name', true);
                    assert.lengthOf(this.updatedConfiguration.elements.sorting, sortingElementsOriginalLength + 1, 'includes the new sorted column');
                    assert.isFalse(this.preferences.prefsSaveCalled, "the preferences save API should not be called to save the preferences object");
                    assert.isFalse(this.preferences.prefsFetchCalled, "the preferences fetch API should not be called to read the preferences object");
                });
                it('should add a token and then the onConfigUpdate callback from the grid configuration should be invoked', function () {
                    //simulates that user adds a token
                    this.gridWidgetObj.search("test");
                    assert.isNotNull(this.updatedConfiguration.search, "the search parameter in the updatedConfiguration configuration gets updated from the onConfigUpdate callback");
                    assert.includeMembers(this.updatedConfiguration.search, ['test'], 'includes the "test" token');
                    assert.isFalse(this.preferences.prefsSaveCalled, "the preferences save API should not be called to save the preferences object");
                    assert.isFalse(this.preferences.prefsFetchCalled, "the preferences fetch API should not be called to read the preferences object");
                });
            });

            describe('Tree Grid with preferences API', function () {
                before(function (done) {
                    this.preferences = initPreferences();
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0],
                        "sid": "juniper.net:some_plugin:test_grid"
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                    this.preferences = null;
                    this.$gridTable = null;
                });
                it('should call preferences APIs to load and save the grid configuration', function () {
                    assert.isTrue(this.preferences.prefsFetchCalled, "the preferences fetch API should be called to load the grid prefs");
                    assert.equal(this.preferences.preferencesPath, "juniper.net:some_plugin:test_grid");
                    this.preferences.prefsSaveCalled = false; //resets the prefsSaveCalled preferences
                    this.$gridTable.sortGrid('name', true);
                    assert.isTrue(this.preferences.prefsSaveCalled, "the preferences save API should be called when the config changes");
                    assert.equal(this.preferences.savedPreferences.elements.sorting[0]['column'], "name");
                });
            });

        });

        describe('Grid Tooltips', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                configurationSample.simpleGrid.tableId = 'test1';
                this.gridWidgetObj = new GridWidget({
                    "elements": configurationSample.simpleGrid,
                    "container": this.$gridContainer[0]
                }).build();

                this.$gridContainer.find('.gridTable').bind('gridLoaded', function (e) {//waits for data to be loaded
                    done();
                });

            });

            after(function () {
                cleanUp(this);
            });

            it('Show tooltips on demand', function (done) {
                var $firstRow = this.$gridContainer.find('.jqgrow').first();
                var $Col = $firstRow.find('[aria-describedby = "test1_source-address"]');
                var $moreContainer = $Col.find('.moreTooltip');

                assert.isTrue($('body').find('.tooltipster-base').length == 0, "tooltip does not load");
                $moreContainer.trigger('mouseover');
                setTimeout(function () {
                    assert.isTrue($('body').find('.tooltipster-base').length > 0, "tooltip displays");
                    $('body').find('.tooltipster-base').remove();
                    done();
                }, 600);
            });

            it('Set tooltips as objects on demand', function (done) {
                var $firstRow = this.$gridContainer.find('.jqgrow').first();
                var $Col = $firstRow.find('[aria-describedby = "test1_destination-address"]');
                var $moreContainer = $Col.find('.moreTooltip');

                assert.isTrue($('body').find('.tooltipster-base').length == 0, "tooltip does not load");
                $moreContainer.trigger('mouseover');
                setTimeout(function () {
                    var tooltipsContainer = $('body').find('.tooltipster-base');
                    assert.isTrue(tooltipsContainer.length > 0, "tooltip displays");
                    assert.isTrue(tooltipsContainer.find('.more-item div').length > 0, "tooltip displays");
                    done();
                }, 600);
            });
        });

        describe('Grid Footer for:', function () {

            describe('Simple Grid', function () {
                before(function (done) {
                    var data = firewallPoliciesData.firewallPoliciesAll;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.numbersOfRows = configurationSample.simpleGrid.jsonRecords(data);
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should match the number of rows provided in the grid data and the one that getNumberOfRows method returns', function () {
                    assert.equal(this.gridWidgetObj.getNumberOfRows(), this.numbersOfRows, "numbers of rows from the getNumberOfRows method should match the numbers of rows provided in the grid configuration");
                });
                it('should show the number of rows provided in the grid data', function () {
                    assert.equal(this.$gridContainer.find('.gridTableFooter .totalRows').text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows provided in the grid configuration");
                });
            });

            describe('Tree Grid', function () {
                before(function (done) {
                    var data = firewallPoliciesTreeData.firewallPoliciesAll;
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationTreeSample.treeGridPreselection,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.numbersOfRows = configurationTreeSample.treeGridPreselection.jsonRecords(data);
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should match the number of rows provided in the grid data and the one that getNumberOfRows method returns', function () {
                    assert.equal(this.gridWidgetObj.getNumberOfRows(), this.numbersOfRows, "numbers of rows from the getNumberOfRows method should match the numbers of rows in the grid data");
                });
                it('should show the number of rows provided in the grid data', function () {
                    assert.equal(this.$gridContainer.find('.gridTableFooter .totalRows').text(), this.numbersOfRows, "numbers of rows in the grid footer section should match the numbers of rows in the grid data");
                });
            });
        });

        describe('DragNDrop Grid', function () {
            describe('Cell Item Checkbox selection', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();

                    this.gridWidgetObj = new GridWidget({
                        container: this.$gridContainer[0],
                        elements: configurationSampleDND.dragNDropGrid1,
                        rbacData: rbacData
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                    this.expandRow = function ($row) {
                        //Make sure the row is expanded before selecting cell items
                        $row.find('.slipstreamgrid_more').first().trigger('click');
                    };
                });

                after(function () {
                    cleanUp(this);
                });

                it('should display checkboxes when hovered on a cell item', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);
                    var $firstCol = $firstRow.find('.cell_draggable').first();

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);

                    var $cellItemCheckbox = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    $cellItemCheckbox.trigger('click');
                    assert.isTrue($cellItemCheckbox.is(':checked'), "checkbox is selected");
                });

                it('should deselect previously selected checkboxes when a cell item from another COLUMN from the same row is selected', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);
                    var $firstCol = $firstRow.find('.cell_draggable').first();
                    var $secondCol = $firstRow.find('.cell_draggable').eq(1);

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);

                    var $firstCellItemCheckbox = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    var $secondColcellItemCheckbox = $secondCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    $firstCellItemCheckbox.trigger('click');
                    $secondColcellItemCheckbox.trigger('click');
                    var containsTempClassAndChecked_firstCell = (($firstCellItemCheckbox.is(':checked')) || ($firstCellItemCheckbox.hasClass('last-selected-item-checkbox')));
                    var containsTempClassAndChecked_secondColCell = ($secondColcellItemCheckbox.is(':checked')) && ($secondColcellItemCheckbox.hasClass('last-selected-item-checkbox'));
                    assert.isTrue(containsTempClassAndChecked_secondColCell, "checkbox in the first cell is deselected");
                    assert.isFalse(containsTempClassAndChecked_firstCell, "checkbox in the second cell is selected");
                });

                it('should deselect previously selected checkboxes when a cell item from another ROW is selected', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);
                    var $secondtRow = this.$gridContainer.find('.jqgrow').eq(6);
                    var $firstCol = $firstRow.find('.cell_draggable').first();
                    var $secondCol = $secondtRow.find('.cell_draggable').first();

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);
                    this.expandRow($secondtRow);

                    var $firstCellItemCheckbox = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    var $secondColcellItemCheckbox = $secondCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    $firstCellItemCheckbox.trigger('click');
                    $secondColcellItemCheckbox.trigger('click');
                    assert.isTrue($secondColcellItemCheckbox.is(':checked'), "checkbox in the first cell is deselected");
                    assert.isFalse($firstCellItemCheckbox.is(':checked'), "checkbox in the second cell is selected");
                });

                it('should not select row when multiple cell items are selected with meta key', function () {
                    var $row = this.$gridContainer.find('.jqgrow').eq(1);

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($row);

                    var $col = $row.find('.multiselect_cell').first();
                    var $cellItemCheckbox = $col.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    var $rowCheckbox = $row.find('.cbox');

                    var evtCommandClick = $.Event("click");
                    evtCommandClick.metaKey = true;
                    $cellItemCheckbox.trigger(evtCommandClick);
                    assert.isFalse($rowCheckbox.is(':checked'), "row is not selected");
                });

            });

            describe('DragnDrop footer', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        container: this.$gridContainer[0],
                        elements: configurationSampleDND.dragNDropGrid1,
                        rbacData: rbacData
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () {
                        done();
                    });
                    this.expandRow = function ($row) {
                        //Make sure the row is expanded before selecting cell items
                        $row.find('.slipstreamgrid_more').first().trigger('click');
                    };
                });
                after(function () {
                    cleanUp(this);
                });
                it('should be displayed when cell item checkbox is clicked', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);

                    var $firstCol = $firstRow.find('.cell_draggable').first();
                    var $cellItemCheckbox = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox').first();
                    var $gridTable = this.$gridContainer.find('.gridTable');
                    $cellItemCheckbox.trigger('click');
                    var $dragndropFooter = this.$gridContainer.find('.multiselectCellFooter');
                    assert.isTrue($dragndropFooter.length > 0, "DragNdrop footer is created");
                });
                it('should select all checkbox in a cell on selectAll button click', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);

                    var $firstCol = $firstRow.find('.cell_draggable').first();
                    var $dragndropFooter = this.$gridContainer.find('.multiselectCellFooter');
                    $dragndropFooter.find('.selectAll').trigger('click');
                    var flag = true;
                    var $cellWrapper = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox');
                    $cellWrapper.each(function () {
                        if (!this.checked) {
                            flag = false;
                        }
                    });
                    assert.isTrue(flag, "All checkboxes are selected");
                });
                it('should deselect all checkbox in a cell on deselectAll button click', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').eq(1);

                    //Have to expand the rows first because the expanded content is added on demand
                    this.expandRow($firstRow);

                    var $firstCol = $firstRow.find('.cell_draggable').first();
                    var $dragndropFooter = this.$gridContainer.find('.multiselectCellFooter');
                    $dragndropFooter.find('.deselectAll').trigger('click');
                    var flag = true;
                    var $cellWrapper = $firstCol.find('.cellExpandWrapper').first().find('.multiselect-cell-checkbox');
                    $cellWrapper.each(function () {
                        if (this.checked) {
                            flag = false;
                        }
                    });
                    assert.isTrue(flag, "All checkboxes are deselected");
                });
                it('should hide when slipstreamGrid.dragNdrop:cellItemSelected event is triggered and no cell item checkbox is selected ', function (done) {
                    var $gridContainer = this.$gridContainer;
                    //need this function to wait for fadeout event. Default wait-time for mocha test case is 2000ms.
                    setTimeout(function () {
                        var $dragndropFooter = $gridContainer.find('.multiselectCellFooter');
                        assert.equal($dragndropFooter.css('display'), "none", "DragNDrop footer is hidden");
                        done();
                    }, 1000);
                });
            });
        });

        describe('Columns Sortable', function () {
            describe('Simple Grid', function () {
                describe('Enable Columns Sortable by Default', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        this.gridWidgetObj = new GridWidget({
                            "elements": configurationSample.simpleGrid,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                        this.$gridTable = null;
                    });
                    it('sortable is enable by default', function () {
                        assert.isTrue(this.$gridContainer.find('.orderable').length > 0, "column header is orderable");
                    });
                });
                describe('Disable Columns Sortable', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                        this.gridWidgetConfElements.orderable = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                        this.$gridTable = null;
                    });
                    it('sortable is disabled', function () {
                        assert.isTrue(this.$gridContainer.find('.orderable').length == 0, "column header is NOT orderable");
                    });
                });
            });
            describe('Tree Grid', function () {
                describe('Enable Columns Sortable by Default', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        this.gridWidgetObj = new GridWidget({
                            "elements": configurationTreeSample.treeGrid,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                        this.$gridTable = null;
                    });
                    it('sortable is enable by default', function () {
                        assert.isTrue(this.$gridContainer.find('.orderable').length > 0, "column header is orderable");
                    });
                });
                describe('Disable Columns Sortable', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGrid);
                        this.gridWidgetConfElements.orderable = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                        this.$gridTable = null;
                    });
                    it('sortable is disabled', function () {
                        assert.isTrue(this.$gridContainer.find('.orderable').length == 0, "column header is NOT orderable");
                    });
                });
            });
        });

        describe('Tree Grid', function () {
            describe('onHoverShowCheckbox Enabled', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGrid);
                    this.gridWidgetConfElements.columns.push({
                        "index": "serialNumber",
                        "name": "serialNumber",
                        "label": "Serial Number",
                        "onHoverShowRowSelection": true
                    });
                    console.log(this.gridWidgetConfElements.tree)
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Checkbox should show onHover', function () {
                    var $row = this.$gridContainer.find('#25'),
                        $checkboxCol = $row.find('.slipstreamgrid_switch_row_selection');

                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden");

                    $row.trigger('mouseenter');
                    assert.isTrue($checkboxCol.css('display') != 'none', "checkbox should be displayed onHover");

                    $row.trigger('mouseleave');
                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden");
                });
                it('Checkbox should show when row is selected', function () {
                    var $row = this.$gridContainer.find('#25'),
                        $checkboxCol = $row.find('.slipstreamgrid_switch_row_selection'),
                        $switchCol = $row.find('.slipstreamgrid_switch_col');

                    //The checkbox should be hidden after the grid loads
                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden");
                    assert.isTrue($switchCol.css('display') != 'none', "switchCol should be displayed");

                    //The checkbox should be displayed after selecting the row
                    $checkboxCol.find('.cbox_tree').click();
                    assert.isTrue($checkboxCol.css('display') != 'none', "checkbox should be displayed when row is selected");
                    assert.isTrue($switchCol.css('display') == 'none', "switchCol should be hidden");

                    //The checkbox should still be displayed after unselecting the row
                    $checkboxCol.find('.cbox_tree').click();
                    assert.isTrue($checkboxCol.css('display') != 'none', "checkbox should be displayed when row is selected");
                    assert.isTrue($switchCol.css('display') == 'none', "switchCol should be hidden");

                    //The checkbox is hidden when the mouse leaves the row
                    $row.trigger('mouseleave');
                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden after mouseleave");
                });
            });
            describe('Row Interaction Enabled', function () {
                before(function (done) {
                    var self = this,
                    notSelectableRowId = "25",
                    selectableRowId = "26";
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGrid);
                    this.gridWidgetConfElements.enabledRowInteraction = function (rowId, rowData) {
                        if (rowId == notSelectableRowId) { //only a row with id "25" has limited user interaction
                            return false;
                        }
                        return true;
                    };

                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        self.notSelectableRow = self.$gridContainer.find("#" + notSelectableRowId);
                        self.selectableRow = self.$gridContainer.find("#" + selectableRowId);
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Checkbox should be disabled', function () {
                    var $checkbox = this.notSelectableRow.find('.cbox_tree');

                    assert.isTrue(this.notSelectableRow.hasClass('rowNoSelectable'), "$row has rowNoSelectable class");
                    assert.isTrue($checkbox.prop('disabled'), "$checkbox is disabled");
                });

                it('Checkbox should NOT be selected when selecting all', function () {
                    var $selectAllCheckbox = this.$gridContainer.find('.tree-select-all .cbox'),
                        $checkbox = this.notSelectableRow.find('.cbox_tree'),
                        $nextRowCheckbox = this.selectableRow.find('.cbox_tree');

                    assert.isFalse($checkbox.prop('checked'), "$row is not checked");
                    assert.isFalse($nextRowCheckbox.prop('checked'), "$row is not checked");
                    $selectAllCheckbox.click();
                    assert.isFalse($checkbox.prop('checked'), "$row is still NOT checked");
                    assert.isTrue($nextRowCheckbox.prop('checked'), "$row is checked");
                    $selectAllCheckbox.click();
                });

                it('Checkbox should NOT be selected on right click', function () {
                    var $nextRowCheckbox = this.selectableRow.find('.cbox_tree');
                    assert.equal(this.gridWidgetObj.getSelectedRows().length, 0, "rows are not selected");
                    //right click on a row that is not selectable
                    this.notSelectableRow.trigger("contextmenu");
                    assert.equal(this.gridWidgetObj.getSelectedRows().length, 0, "a none selectable row is not selected on right click");
                    //right click on a row that is selectable
                    this.selectableRow.trigger("contextmenu");
                    assert.equal(this.gridWidgetObj.getSelectedRows().length, 1, "a row is selected");
                    $.contextMenu("destroy", this.selectableRow);
                    $nextRowCheckbox.trigger("click");
                    assert.equal(this.gridWidgetObj.getSelectedRows().length, 0, "rows are not selected");
                });
            });
            describe('Data from a local storage without pagination', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["1", "24a", "25", "26"]; //24a is a leaf. 24a, 25 and 26 are children. 25 has on demand children
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridMV);
                    this.gridWidgetConfElements.scroll = true;
                    this.gridWidgetConfElements.tree.getChildren = function (node, addChildren) {
                        var data = firewallPoliciesTreeDataJson["firewallPoliciesLevel" + node.nodeId];
                        if (data) {
                            addChildren(node.nodeId, data.ruleCollection.rules);
                        } else {
                            assert.isTrue(false, "data to test getChildren is NOT available");
                        }
                        self.getChildrenInvoked = true;
                    };
                    this.$rows = {};
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for grid to be loaded
                        var data = firewallPoliciesTreeDataJson.firewallPoliciesAll;
                        if (data) {
                            self.gridWidgetObj.addPageRows(data.ruleCollection.rules, {
                                numberOfPage: 1,
                                totalPages: 1
                            });
                            rowIds.forEach(function (rowId) {
                                self.$rows[rowId] = self.$gridContainer.find("#" + rowId);
                            });
                        } else {
                            assert.isTrue(false, "data to test addPageRows is NOT available");
                        }
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Rows were added', function () {
                    var $allRows = this.$gridContainer.find("tr[role='row']");
                    assert.isTrue(_.isElement(this.$rows["1"][0]), "row has been added");
                    assert.isTrue($allRows.length > 2, "besides internal rows, tree rows have been added");
                });
                it('Parent row can be expanded to load children using getChildren', function () {
                    var self = this,
                        $rowCarat = this.$rows["25"].find('.treeclick'); //rowId of 25 is a parent row of the childIds
                    assert.isTrue($rowCarat.hasClass("tree-plus"), "parent row is collapsed");
                    this.getChildrenInvoked = false;
                    $rowCarat.trigger("click");
                    assert.isTrue($rowCarat.hasClass("tree-minus"), "parent row is expanded");
                    assert.isTrue(this.getChildrenInvoked, "getChildren callback was called");
                });
                it('Parent row can be expanded or collapsed to show or hide existing children', function () {
                    var self = this,
                        $rowCarat = this.$rows["1"].find('.treeclick'),//rowId of 1 is a parent row of the childIds
                        childIds = ["24a", "25", "26"];
                    assert.isTrue($rowCarat.hasClass("tree-minus"), "parent row is expanded");
                    assert.isFalse($rowCarat.hasClass("tree-plus"), "expand icon is not available");
                    childIds.forEach(function (childId) {
                        assert.notEqual(self.$rows[childId].css("display"), "none", "child of parent row is available");
                    });
                    //collapse children
                    $rowCarat.trigger("click");
                    assert.isFalse($rowCarat.hasClass("tree-minus"), "collapse icon is not available");
                    assert.isTrue($rowCarat.hasClass("tree-plus"), "parent row is collapsed");
                    childIds.forEach(function (childId) {
                        assert.equal(self.$rows[childId].css("display"), "none", "child of parent row is available");
                    });
                });
            });
            describe('Data from a local storage with pagination', function () {
                before(function (done) {
                    var self = this,
                        rowIds = ["1", "24a", "25", "26"]; //24a is a leaf. 24a, 25 and 26 are children. 25 has on demand children
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridMV);
                    this.gridWidgetConfElements.scroll = {pagination:true};
                    this.gridWidgetConfElements.tree.getChildren = function (node, addChildren) {
                        var data = firewallPoliciesTreeDataJson["firewallPoliciesLevel" + node.nodeId];
                        if (data) {
                            addChildren(node.nodeId, data.ruleCollection.rules);
                        } else {
                            assert.isTrue(false, "data to test getChildren is NOT available");
                        }
                        self.getChildrenInvoked = true;
                    };
                    this.$rows = {};
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('slipstreamGrid.pagination:pageLoaded', function (e, paginationData) { //waits for page to be loaded
                        assert.isObject(paginationData, "data with pagination information is available");
                        assert.equal(paginationData.page, 1, "request for the first page is sent");
                        assert.equal(paginationData.pageSize, self.gridWidgetConfElements.numberOfRows, "the first page size is requested with the default numberOfRows defined in the grid configuration");

                        var data = firewallPoliciesTreeDataJson.firewallPoliciesAll;
                        if (data) {
                            self.gridWidgetObj.addPageRows(data.ruleCollection.rules, {
                                numberOfPage: 1,
                                totalPages: 1
                            });
                            rowIds.forEach(function (rowId) {
                                self.$rows[rowId] = self.$gridContainer.find("#" + rowId);
                            });
                        } else {
                            assert.isTrue(false, "data to test addPageRows is NOT available");
                        }
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Rows were added', function () {
                    var $allRows = this.$gridContainer.find("tr[role='row']");
                    assert.isTrue(_.isElement(this.$rows["1"][0]), "row has been added");
                    assert.isTrue($allRows.length > 2, "besides internal rows, tree rows have been added");
                });
                it('Parent row can be expanded to load children using getChildren', function () {
                    var self = this,
                        $rowCarat = this.$rows["25"].find('.treeclick'), //rowId of 25 is a parent row of the childIds
                        $child;
                    assert.isTrue($rowCarat.hasClass("tree-plus"), "parent row is collapsed");
                    this.getChildrenInvoked = false;
                    $rowCarat.trigger("click");
                    assert.isTrue($rowCarat.hasClass("tree-minus"), "parent row is expanded");
                    assert.isTrue(this.getChildrenInvoked, "getChildren callback was called");
                });
                it('Parent row can be expanded or collapsed to show or hide existing children', function () {
                    var self = this,
                        $rowCarat = this.$rows["1"].find('.treeclick'),//rowId of 1 is a parent row of the childIds
                        childIds = ["24a", "25", "26"];
                    assert.isTrue($rowCarat.hasClass("tree-minus"), "parent row is expanded");
                    assert.isFalse($rowCarat.hasClass("tree-plus"), "expand icon is not available");
                    childIds.forEach(function (childId) {
                        assert.notEqual(self.$rows[childId].css("display"), "none", "child of parent row is available");
                    });
                    //collapse children
                    $rowCarat.trigger("click");
                    assert.isFalse($rowCarat.hasClass("tree-minus"), "collapse icon is not available");
                    assert.isTrue($rowCarat.hasClass("tree-plus"), "parent row is collapsed");
                    childIds.forEach(function (childId) {
                        assert.equal(self.$rows[childId].css("display"), "none", "child of parent row is available");
                    });
                });
            });
        });

        describe('Nested Grid', function () {
            describe('Nested Grid with Search', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.nestedGrid);
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        self.rows = self.$gridContainer.find('.nestedTable .jqgrow');
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.slipstream_nested_grid').length, 1, "the grid has been created and it is of the nested grid type");
                });
                it('should contain rows that will contain subgrids', function () {
                    assert.isTrue(this.rows.length > 1, "the grid has rows that will contain the subgrids");
                });
                it('should open a subgrid on demand', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-subgrid').length == 0, "the grid has no subgrids open");
                    var $caratTd = this.rows.eq(0).find("td").eq(0);
                    $caratTd.trigger("click");
                    assert.isTrue(this.$gridContainer.find('.ui-subgrid').length == 1, "the grid has one subgrid open");
                });
            });
            describe('Nested Grid without Search', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.nestedGrid);
                    delete this.gridWidgetConfElements.filter; //remove search capabilities
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        self.rows = self.$gridContainer.find('.nestedTable .jqgrow');
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.slipstream_nested_grid').length, 1, "the grid has been created and it is of the nested grid type");
                });
                it('should contain rows that will contain subgrids', function () {
                    assert.isTrue(this.rows.length > 1, "the grid has rows that will contain the subgrids");
                });
                it('should open a subgrid on demand', function () {
                    console.log(this.$gridContainer.find('.ui-subgrid'));
                    assert.isTrue(this.$gridContainer.find('.ui-subgrid').length == 0, "the grid has no subgrids open");
                    var $caratTd = this.rows.eq(0).find("td").eq(0);
                    $caratTd.trigger("click");
                    assert.isTrue(this.$gridContainer.find('.ui-subgrid').length == 1, "the grid has one subgrid open");
                });
            });

            describe('onHoverShowCheckbox Enabled', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.nestedGrid);
                    this.gridWidgetConfElements.subGrid.expandOnLoad = true;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        var totalParentRows = self.gridWidgetObj.getAllVisibleRows().length,
                            count = 0;
                        $(this).find('.ui-subgrid').bind('subGridLoaded', function () {
                            count++;
                            count == totalParentRows && done();
                        });
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('Checkbox should show onHover', function () {
                    var $subTable = this.$gridContainer.find('.ui-subgrid').eq(0),
                        $row = $subTable.find('.ui-jqgrid-btable .jqgrow').eq(2),
                        $checkbox = $row.find('.slipstreamgrid_switch_row_selection');

                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");

                    $row.trigger('mouseenter');
                    assert.isTrue($checkbox.css('display') != 'none', "checkbox should be displayed onHover");

                    $row.trigger('mouseleave');
                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");
                });
                it('Checkbox should show when row is selected', function () {
                    var $subTable = this.$gridContainer.find('.ui-subgrid').eq(1),
                        $row = $subTable.find('.ui-jqgrid-btable .jqgrow').eq(6),
                        $checkboxCol = $row.find('.slipstreamgrid_switch_row_selection'),
                        $switchCol = $row.find('.slipstreamgrid_switch_col');

                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden");
                    assert.isTrue($switchCol.css('display') != 'none', "switchCol should be displayed");

                    $checkboxCol.find('.cbox').click();
                    assert.isTrue($checkboxCol.css('display') != 'none', "checkbox should be displayed when row is selected");
                    assert.isTrue($switchCol.css('display') == 'none', "switchCol should be hidden");

                    $checkboxCol.find('.cbox').click();
                    assert.isTrue($checkboxCol.css('display') != 'none', "checkbox should be displayed when row is selected");
                    assert.isTrue($switchCol.css('display') == 'none', "switchCol should be hidden");

                    $row.trigger('mouseleave');
                    assert.isTrue($checkboxCol.css('display') == 'none', "checkbox should be hidden after mouseleave");
                });
            });
        });

        describe('Group Grid', function () {
            var sorting = [
                    {
                        "column": "name",
                        "order": "asc" //asc,desc
                    }
                ],
                grouping = {
                    "columns": [
                        {
                            "column": "name",
                            "order": "desc", //asc,desc
                            "show": true,
                            "text": "Id: <b>{0}</b>"
                        }
                    ],
                    "collapse": false
                };
            describe('Group Grid with Sort', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    this.gridWidgetConfElements.sorting = sorting;
                    this.gridWidgetConfElements.grouping = grouping;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        self.rows = self.$gridContainer.find('.jqgroup');
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain group rows that will contain children', function () {
                    assert.isTrue(this.rows.length > 1, "the grid has rows that will contain the groups");
                });
                it('should be sorted as per the sort property', function () {
                    var $sortAscIcon = this.$gridContainer.find(".ui-jqgrid-htable th[title='Name']").find(".ui-icon-asc");
                    assert.isTrue($sortAscIcon.css("display") != "none", "the grid has been sorted asc");
                });
                it('should collapse a group on demand', function () {
                    var $children = this.rows.eq(0).next();
                    assert.isTrue($children.css("display") != "none", "the group children is open");
                    var $carat = this.rows.eq(0).find("td .ui-icon");
                    $carat.trigger("click");
                    assert.isTrue($children.css("display") == "none", "the group children is closed");
                });
            });
            describe('Group Grid without Sort', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid);
                    delete this.gridWidgetConfElements.sorting;
                    this.gridWidgetConfElements.grouping = grouping;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        self.rows = self.$gridContainer.find('.jqgroup');
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain group rows that will contain children', function () {
                    assert.isTrue(this.rows.length > 1, "the grid has rows that will contain the groups");
                });
                it('should not be sorted if the sort property is missing', function () {
                    var $sortAscIcon = this.$gridContainer.find(".ui-jqgrid-htable th[title='Name']").find(".ui-icon-asc");
                    var $sortDescIcon = this.$gridContainer.find(".ui-jqgrid-htable th[title='Name']").find(".ui-icon-desc");
                    assert.isTrue($sortAscIcon.css("display") == "none", "the grid has not been sorted asc");
                    assert.isTrue($sortDescIcon.css("display") == "none", "the grid has not been sorted desc");
                });
                it('should collapse a group on demand', function () {
                    var $children = this.rows.eq(0).next();
                    assert.isTrue($children.css("display") != "none", "the group children is open");
                    var $carat = this.rows.eq(0).find("td .ui-icon");
                    $carat.trigger("click");
                    assert.isTrue($children.css("display") == "none", "the group children is closed");
                });
            });
        });

        describe('Grid Widget Empty Cell', function () {
            describe('Simple Grid', function () {
                describe('emptyCell configuration is enabled by default', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationSampleLocal.localGrid);
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        done();
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should contain emptyCell class and text', function () {
                        var $emptyCell = this.$gridTable.find('.emptyCell');
                        assert.isTrue($emptyCell.length > 0, "emptyCell is enabled by default");
                        assert.isTrue($emptyCell.eq(1).text().indexOf("—") != -1, "emptyCell text is enabled by default");
                    });
                });
                describe('emptyCell configuration is disabled', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationSampleLocal.localGrid);
                        this.gridWidgetConfElements.emptyCell = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        done();
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should NOT contain any text', function () {
                        var cellText = this.$gridTable.find('.emptyCell').eq(1).text();
                        assert.isTrue(_.isEmpty(cellText), "emptyCell is disabled");
                    });
                });
                describe('emptyCell configuration in both grid and column level', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {tableId : "test1"}, configurationSample.simpleGrid);
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should contain grid level configuration', function () {
                        assert.isTrue(this.$gridTable.find('.newIcon').length > 0, "emptyCell is enabled by grid configuration");
                    });
                    it('should contain column level configuration', function () {
                        var $column = this.$gridTable.find('#184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante td[aria-describedby="test1_application"]'),
                            cellText = $column.find('.emptyCell').text();
                        assert.isTrue( cellText == "----", "emptyCell is enabled by column configuration");
                    });
                });
                describe('grid emptyCell configuration is enabled but column emptyCell configuration is disabled', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationSampleLocal.localGrid);
                        this.gridWidgetConfElements.columns[this.gridWidgetConfElements.columns.length - 1].emptyCell = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        done();
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('last column empty cell should NOT contain any text', function () {
                        var $column = this.$gridTable.find('#184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante td[aria-describedby="localDataGrid_application"]'),
                            cellText = $column.find('.emptyCell').eq(0).text();
                        assert.isTrue(_.isEmpty(cellText), "last column emptyCell is disabled");
                    });
                    it('other column empty cell should contain the default text', function () {
                        var $column = this.$gridTable.find('#191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS td[aria-describedby="localDataGrid_source-address"]');
                        assert.isTrue($column.find('.emptyCell').text().indexOf("—") != -1, "other emptyCell text is enabled by default");
                    });
                });
                describe('grid emptyCell configuration is disabled but column emptyCell configuration is enabled', function () {
                    before(function (done) {
                        var self = this;
                        this.configuredLabel = "----";
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationSampleLocal.localGrid);
                        this.gridWidgetConfElements.columns[this.gridWidgetConfElements.columns.length - 1].emptyCell = {
                            label: this.configuredLabel
                        };
                        this.gridWidgetConfElements.emptyCell = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        done();
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('last column empty cell should contain configured text', function () {
                        var $column = this.$gridTable.find('#184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante td[aria-describedby="localDataGrid_application"]'),
                            cellText = $column.find('.emptyCell').eq(0).text();
                        assert.isTrue( cellText == this.configuredLabel, "last column emptyCell is enabled");
                    });
                    it('other column empty cell should NOT contain any text', function () {
                        var $column = this.$gridTable.find('#191002-LOT_-_VPN_Tunnell_-_Lottery_VPN_Tunnel_-_8_2_2007_-_KTS td[aria-describedby="localDataGrid_source-address"]'),
                            cellText = $column.find('.emptyCell').text();
                        assert.isTrue(_.isEmpty(cellText), "other emptyCell text is disabled");
                    });
                });
            });
            describe('Tree Grid', function () {
                describe('emptyCell configuration is enabled by default', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridPreselection);
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should contain emptyCell class and text', function () {
                        var $emptyCell = this.$gridTable.find('.emptyCell');
                        assert.isTrue($emptyCell.length > 0, "emptyCell is enabled by default");
                        assert.isTrue($emptyCell.eq(1).text().indexOf("—") != -1, "emptyCell text is enabled by default");
                    });
                    it('parent row should NOT contain emptyCell class and text', function () {
                        var $emptyCell = this.$gridTable.find('#0');
                        assert.isTrue($emptyCell.length == 0, "emptyCell is NOT existing by default in the parent row");
                    });
                });
                describe('emptyCell configuration is disabled', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridPreselection);
                        this.gridWidgetConfElements.emptyCell = false;
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should NOT contain any text', function () {
                        var cellText = this.$gridTable.find('.emptyCell').eq(1).text();
                        assert.isTrue(_.isEmpty(cellText), "emptyCell is disabled");
                    });
                });
                describe('emptyCell configuration in both grid and column level', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {tableId : "test1"}, configurationTreeSample.treeGrid);
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('should contain grid level configuration', function () {
                        assert.isTrue(this.$gridTable.find('.gridEmptyCell').length > 0, "emptyCell is enabled by grid configuration");
                    });
                    it('should contain column level configuration', function () {
                        assert.isTrue(this.$gridTable.find('.columnEmptyCell').length > 0, "emptyCell is enabled by column configuration");
                    });
                });
                describe('grid emptyCell configuration is enabled but column emptyCell configuration is disabled', function () {
                    before(function (done) {
                        var self = this;
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridPreselection);
                        this.gridWidgetConfElements.columns[5].emptyCell = false;
                        this.gridWidgetConfElements.tableId = "treeGrid_unit_test";
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('The sixth column empty cell should NOT contain any text', function () {
                        var $leafRow = this.$gridTable.find('#3'),
                            $column = $leafRow.find('td[aria-describedby="treeGrid_unit_test_application-services"]'),
                            cellText = $column.find('.emptyCell').eq(0).text();
                        assert.isTrue(_.isEmpty(cellText), "The sixth column emptyCell is disabled");
                    });
                    it('other column empty cell should contain the default text', function () {
                        var $leafRow = this.$gridTable.find('#3');
                        assert.isTrue($leafRow.find('.emptyCell').eq(0).text().indexOf("—") != -1, "other emptyCell text is enabled by default");
                    });
                });
                describe('grid emptyCell configuration is disabled but column emptyCell configuration is enabled', function () {
                    before(function (done) {
                        var self = this;
                        this.configuredLabel = "----";
                        this.$gridContainer = createContainer();
                        this.gridWidgetConfElements = $.extend(true, {}, configurationTreeSample.treeGridPreselection);
                        this.gridWidgetConfElements.columns[5].emptyCell = {
                            label: this.configuredLabel
                        };
                        this.gridWidgetConfElements.emptyCell = false;
                        this.gridWidgetConfElements.tableId = "treeGrid_unit_test";
                        this.gridWidgetObj = new GridWidget({
                            "elements": this.gridWidgetConfElements,
                            "container": this.$gridContainer[0]
                        }).build();
                        this.$gridTable = this.$gridContainer.find('.gridTable');
                        this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });
                    it('The sixth column empty cell should contain configured text', function () {
                        var $leafRow = this.$gridTable.find('#3'),
                            $column = $leafRow.find('td[aria-describedby="treeGrid_unit_test_application-services"]'),
                            cellText = $column.find('.emptyCell').eq(0).text();
                        assert.isTrue( cellText == this.configuredLabel, "The sixth column emptyCell is enabled");
                    });
                    it('other column empty cell should NOT contain any text', function () {
                        var $leafRow = this.$gridTable.find('#3'),
                            cellText = $leafRow.find('.emptyCell').eq(0).text();
                        assert.isTrue(_.isEmpty(cellText), "other emptyCell text is disabled");
                    });
                });
            });
        });

        describe('Grid Widget with Simplified Style', function () {
            describe('Grid Widget with Default Card items', function () {
                before(function (done) {
                    var self = this,
                        rowId = "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante";
                    this.$gridContainer = createContainer();
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid_simplified);
                    delete this.gridWidgetConfElements.rowMaxElement;
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": {
                            "editOnRowHover": "editOnRowHover",
                            "deleteOnRowHover": "deleteOnRowHover",
                            "testCloneHover": "testCloneHover"
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        self.$row = self.$gridTable.find("#" + rowId);
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.slipstream-grid-widget-card-view').length, 1, "the grid has simplified style applied");
                    assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
                });
                it('should contain grouped data with default items, operator and column count', function () {
                    var $groupContentCell = this.$row.find("td").eq(4),
                        $groupContentCellGroup = $groupContentCell.find(".groupContent"),
                        $groupContentCellOperator = $groupContentCell.find(".groupOperator"),
                        $groupContentCellItems = $groupContentCellGroup.eq(0).find(".cellContentBlock"),
                        contentGroupCount = $groupContentCellGroup.length,
                        contentOperatorCount = $groupContentCellOperator.length,
                        contentItemCount = $groupContentCellItems.length;
                    assert.isTrue(contentGroupCount > 0, "the grid should have data with groupContent formatter applied");
                    assert.isTrue(contentOperatorCount > 0, "the default column count should be less or equal than the default 1 column");
                    assert.isTrue(contentItemCount <= 15, "the default item count per column should be less or equal than the default 15 items");
                });
                it('should show the more tooltip on hover of the more pill', function () {
                    var $cellWithMoreTooltip = this.$gridContainer.find('.ui-jqgrid-btable .groupContent').eq(1);
                    assert.equal($cellWithMoreTooltip.find('.tooltipstered').length, 0, "the more tooltip is not showed");
                    $cellWithMoreTooltip.find(".moreTooltip").trigger("mouseenter");
                    assert.equal($cellWithMoreTooltip.find('.tooltipstered').length, 1, "the more tooltip is available");
                });
                it('should contain the row menu on row hover', function () {
                    var $rowWithHoverMenu = this.$gridContainer.find('.ui-jqgrid-btable tr').eq(1);
                    $rowWithHoverMenu.trigger("mouseenter");
                    assert.equal($rowWithHoverMenu.find(".hoverMenu-wrapper").length, 1, "the row hover menu is available");
                });
                it('should include data-tooltip to allow tooltip on a cell (cellTooltip attribute) using default key/value data', function () {
                    var $groupContentCell = this.$row.find("td").eq(4),
                        $groupValueItems = $groupContentCell.find(".cellContentBlock .cellContentValue"),
                        $groupKeyItems = $groupContentCell.find(".cellContentBlock[data-tooltip]");
                    assert.isTrue($groupValueItems.eq(0).text() != "", "item value is available for the default value attribute");
                    assert.isTrue($groupKeyItems.length > 0, "data-tooltip is available for the default key attribute");
                });
                it('should include data-tooltip to allow tooltip on a cell (cellTooltip attribute) using custom key/value data', function () {
                    var $groupContentCell = this.$row.find("td").eq(5),
                        $groupValueItems = $groupContentCell.find(".cellContentBlock .cellContentValue"),
                        $groupKeyItems = $groupContentCell.find(".cellContentBlock[data-tooltip]");
                    assert.isTrue($groupValueItems.eq(0).text() != "", "item value is available for the default value attribute");
                    assert.isTrue($groupKeyItems.length > 0, "data-tooltip is available for the default key attribute");
                });
            });
            describe('Grid Widget with rowMaxElements Card items', function () {
                before(function (done) {
                    var self = this,
                        rowId = "184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante";
                    this.$gridContainer = createContainer();
                    this.formatDataCounter = 0;
                    this.gridWidgetConfElements = $.extend(true, {}, configurationSample.simpleGrid_simplified);
                    this.gridWidgetConfElements.columns[2].groupContent = {
                        "formatData": function (cellvalue) {
                            self.formatDataCounter++;
                            return cellvalue;
                        },
                        "key": "label",
                        "value": "label"
                    };
                    this.gridWidgetConfElements.rowMaxElement.groupContentColumns = 3;//predefined groupContentColumns
                    this.gridWidgetObj = new GridWidget({
                        "elements": this.gridWidgetConfElements,
                        "container": this.$gridContainer[0],
                        "actionEvents": {
                            "editOnRowHover": "editOnRowHover",
                            "deleteOnRowHover": "deleteOnRowHover",
                            "testCloneHover": "testCloneHover"
                        }
                    }).build();
                    this.$gridTable = this.$gridContainer.find('.gridTable');
                    this.$gridTable.bind('gridLoaded', function () { //waits for data to be loaded
                        self.$row = self.$gridTable.find("#" + rowId);
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should contain a grid', function () {
                    assert.equal(this.$gridContainer.find('.slipstream-grid-widget-card-view').length, 1, "the grid has simplified style applied");
                    assert.equal(this.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
                });
                it('should contain grouped data with default items and column count', function () {
                    assert.isTrue(this.$gridContainer.find('.ui-jqgrid-btable .groupContent').length > 0, "the grid should have data with groupContent formatter applied");
                    var $groupContentCell = this.$row.find("td").eq(4),
                        $groupContentCellColumn = $groupContentCell.find(".groupColumnContent"),
                        $groupContentCellItems = $groupContentCellColumn.eq(0).find(".cellContentBlock"),
                        contentColumnCount = $groupContentCell.find(".groupColumnContent").length,
                        contentItemCount = $groupContentCell.find(".groupColumnContent").length,
                        rowMaxElement = this.gridWidgetConfElements.rowMaxElement;
                    assert.isTrue(contentColumnCount <= rowMaxElement.groupContentColumns, "the default column count should be less or equal than groupContentColumns");
                    assert.isTrue(contentItemCount <= rowMaxElement.groupContentItems, "the default item count per column should be less or equal than groupContentItems");
                });
                it('should contain a cell that is collapsed', function () {
                    var $caratCell = this.$row.find("td").eq(2),
                        $groupContentCell = this.$row.find("td").eq(5),
                        $groupContentCollapse = $groupContentCell.find(".groupContentCollapse"),
                        $groupContentExpand = $groupContentCell.find(".groupContentExpand");
                    assert.isTrue($caratCell.hasClass("slipstreamgrid_more"), "the default column count should be less or equal than groupContentColumns");
                    assert.isTrue($groupContentCollapse.html() != "", "the collapse cell content is not available and will be added on demand");
                    assert.isTrue($groupContentExpand.html() == "", "the expand cell content is not available and will be added on demand");
                });
                it('should add an expand cell on demand', function () {
                    var $caratCell = this.$row.find("td").eq(2),
                        $groupContentCell = this.$row.find("td").eq(5),
                        totalFormatDataCounter = this.formatDataCounter;
                    assert.isTrue(totalFormatDataCounter > 0, "the formatData callback has been invoked on collapsed cell");
                    $caratCell.trigger("click");
                    var $groupContentCollapse = $groupContentCell.find(".groupContentCollapse"),
                        $groupContentExpand = $groupContentCell.find(".groupContentExpand");
                    assert.isTrue($groupContentCollapse.html() != "", "the collapse cell content is not available and will be added on demand");
                    assert.isTrue($groupContentExpand.html() != "", "the expand cell content is not available and will be added on demand");
                    assert.isTrue(totalFormatDataCounter == this.formatDataCounter, "the formatData callback is not invoked on expanded cell");
                    $caratCell.trigger("click");
                });
                it('should toggle cell on cell carat click', function () {
                    var $groupContentCell = this.$row.find("td").eq(5),
                        $caratCell = $groupContentCell.find(".moreGroups").eq(0),
                        $groupContentCollapse = $groupContentCell.find(".groupContentCollapse"),
                        $groupContentExpand = $groupContentCell.find(".groupContentExpand");
                    assert.isTrue($groupContentCollapse.css("display") != "none", "the collapse cell is visible");
                    assert.isTrue($groupContentExpand.css("display") == "none", "the expand cell is hidden");
                    $caratCell.trigger("click");
                    assert.isTrue($groupContentCollapse.css("display") == "none", "the collapse cell is hidden");
                    assert.isTrue($groupContentExpand.css("display") != "none", "the expand cell is visible");
                });
                it('should not toggle cell on more tooltip click', function () {
                    var $groupContentCell = this.$row.find("td").eq(5),
                        $caratCell = $groupContentCell.find(".moreTooltip").eq(0),
                        $groupContentCollapse = $groupContentCell.find(".groupContentCollapse"),
                        groupContentCollapseVisibility = $groupContentCollapse.css("display"),
                        $groupContentExpand = $groupContentCell.find(".groupContentExpand"),
                        groupContentExpandVisibility = $groupContentExpand.css("display");
                    $caratCell.trigger("click");
                    assert.isTrue($groupContentCollapse.css("display") == groupContentCollapseVisibility, "the collapse cell is not expanded");
                    assert.isTrue($groupContentExpand.css("display") == groupContentExpandVisibility, "the expand cell is not collapsed");
                });
                it('should include data-tooltip to allow tooltip on a cell (cellTooltip attribute) using default key/value data', function () {
                    var $groupContentCell = this.$row.find("td").eq(4),
                        $groupValueItems = $groupContentCell.find(".cellContentBlock .cellContentValue"),
                        $groupKeyItems = $groupContentCell.find(".cellContentBlock[data-tooltip]");
                    assert.isTrue($groupValueItems.eq(0).text() != "", "item value is available for the default value attribute");
                    assert.isTrue($groupKeyItems.length > 0, "data-tooltip is available for the default key attribute");
                });
                it('should include data-tooltip to allow tooltip on a cell (cellTooltip attribute) using custom key/value data', function () {
                    var $groupContentCell = this.$row.find("td").eq(5), //column defined on this.gridWidgetConfElements.columns[2].groupContent
                        $groupValueItems = $groupContentCell.find(".cellContentBlock .cellContentValue"),
                        $groupKeyItems = $groupContentCell.find(".cellContentBlock[data-tooltip]");
                    assert.isTrue($groupValueItems.eq(0).text() != "", "item value is available for the default value attribute");
                    assert.isTrue($groupKeyItems.length > 0, "data-tooltip is available for the default key attribute");
                });
            });
        });

        describe('Grid Widget with List Style', function () {
            before(function (done) {
                var gridWidgetConfElements = $.extend(true, {}, configurationSample.listNestedGrid);
                this.$gridContainer = createContainer();
                this.gridWidgetObj = new GridWidget({
                    "elements": gridWidgetConfElements,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                cleanUp(this);
            });
            it('should contain a grid', function () {
                assert.equal(this.$gridContainer.find('.slipstream-grid-widget-list-view').length, 1, "the grid has a list style applied");
            });
            it('should contain subgrid expanded: expandOnLoad', function () {
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid').length > 1, "the grid has been created and the subgrid has been added");
            });
            it('should not contain spinner after data is loaded', function () {
                assert.equal(this.$gridContainer.find('.indeterminateSpinnerContainer').length, 0, "the grid spinner is removed after gridLoaded");
            });
            it('should expand search results onLoad ', function () {
                this.gridWidgetObj.search('a');
                assert.isTrue(this.$gridContainer.find('.ui-jqgrid').length > 1, "the grid has been created and the subgrid has been added after search");
            });
        });

        describe('Grid Widget with Local Data', function () {
            var obj = {
                "$gridContainer": null,
                "gridWidgetConfElements": null,
                "gridWidgetObj": null
            };

            function createGrid(done) {
                obj.$gridContainer = createContainer();
                obj.gridWidgetConfElements = configurationSampleLocal.localGrid;
                obj.gridWidgetObj = new GridWidget({
                    "elements": obj.gridWidgetConfElements,
                    "container": obj['$gridContainer'][0],
                    "actionEvents": {
                        createEvent: "AddRow",
                        updateEvent: "UpdateRow",
                        deleteEvent: "DeleteRow",
                        searchEvent: "searchEvent"
                    }
                }).build();
                done();
            }

            beforeEach(function (done) {
                createGrid(done);
            });

            afterEach(function () {
                cleanUp(obj);
            });
            describe('Grid Loads', function () {
                it('should contain a grid', function () {
                    assert.equal(obj.$gridContainer.find('.ui-jqgrid').length, 1, "the grid has been created and the container with ui-jqgrid class should have a child container");
                });
                it('should contain the content of the grid', function () {
                    assert.isTrue(obj.$gridContainer.find('.ui-jqgrid-btable tr').length > 1, "data has been rendered and the grid widget should have created a least more than one row");
                });
            });

            describe('Grid Actions', function () {
                it('should contain CRUD action buttons: create', function () {
                    assert.equal(obj.$gridContainer.find('.sub-header .create').length, 1, "the create action icon should have been added to the action bar of the grid");
                });
                it('should contain CRUD action buttons: edit', function () {
                    assert.equal(obj.$gridContainer.find('.sub-header .edit').length, 1, "the edit action icon should have been added to the action bar of the grid");
                });
                it('should contain CRUD action buttons: delete', function () {
                    assert.equal(obj.$gridContainer.find('.sub-header .delete').length, 1, "the delete action icon should have been added to the action bar of the grid");
                });
                it('create inline', function () {
                    var createButton = obj.$gridContainer.find('.sub-header .create'),
                        totalRows = obj.gridWidgetObj.getAllVisibleRows().length;
                    createButton.click();
                    totalRows++;
                    assert.equal(obj.gridWidgetObj.getAllVisibleRows().length, totalRows, "the total number of rows increases");
                });
                it('delete a row with reset selection', function () {
                    var totalRows = obj.gridWidgetObj.getAllVisibleRows().length,
                        rowId = '190002-INS_to_Sircon_drop_em';

                    obj.gridWidgetObj.deleteRow(rowId);
                    assert.equal(obj.gridWidgetObj.getAllVisibleRows().length, totalRows - 1, "the total number of row decreases");
                });
                it('delete multiple rows without reset selections', function () {
                    var totalRows = obj.gridWidgetObj.getAllVisibleRows().length,
                        selectedRowIds = ['189002-INS_to_Sircon_-_INS_vpn_with_Sircon_07_07_2008_sante', '183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'],
                        deletedRowIds = ['183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent', '184002-PSP_IPSec_drop_rule_-_PSP_VPN_to_Rissnet_08-22-08_Sante'];

                    obj.gridWidgetObj.toggleRowSelection(selectedRowIds, 'selected');
                    obj.gridWidgetObj.deleteRow(deletedRowIds, false);
                    assert.equal(obj.gridWidgetObj.getAllVisibleRows().length, totalRows - 2, "the total number of rows decrease");

                    var numberOfSelectedRows = obj.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.equal(numberOfSelectedRows, obj.$gridContainer.find('.selection-count-number').text(), "the total selected rows equals to 1");
                });
                it('edit inline', function () {
                    var row = obj.$gridContainer.find('.gridTable tr')[4],
                        $row = $(row),
                        $rowCell = $row.find("td").eq(5);

                    assert.equal($row.attr("editable"), undefined, "Row is not editable before click");
                    $rowCell.click(); // should enter into edit mode.
                    assert.equal($row.attr("editable"), 1, "Row is editable after click");
                });
                it('select all', function () {
                    var selectAll = obj.$gridContainer.find('.ui-jqgrid-htable .cbox');
                    selectAll.click();

                    var numberOfSelectedRows = obj.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;

                    assert.equal(obj.gridWidgetObj.getAllVisibleRows().length, numberOfSelectedRows, "select all rows");
                });

                it('addRows after selectAll is checked', function () {
                    var selectAll = obj.$gridContainer.find('.ui-jqgrid-htable .cbox');
                    selectAll.click();
                    obj.gridWidgetObj.addRow(firewallPoliciesData.addNewData, 'last');
                    assert.isTrue(obj.$gridContainer.find('#' + firewallPoliciesData.addNewData.name + ' .cbox').prop('checked'), "new row is selected when selectAll is checked");
                });
            });
            describe('Grid Local Search', function () {
                it('search method - string value', function () {
                    var totalRows = obj.gridWidgetObj.getAllVisibleRows().length;

                    assert.equal(obj.$gridContainer.find('.gridTableFooter .totalRows').text(), totalRows, "total row number before search");
                    obj.gridWidgetObj.search('1195002');

                    totalRows = obj.gridWidgetObj.getAllVisibleRows().length;
                    assert.equal(obj.$gridContainer.find('.gridTableFooter .totalRows').text(), totalRows, "total row number after search");
                });
                it('search method - multiple values', function () {
                    var totalRows = obj.gridWidgetObj.getAllVisibleRows().length;

                    assert.equal(obj.$gridContainer.find('.gridTableFooter .totalRows').text(), totalRows, "total row number before search");
                    obj.gridWidgetObj.search(['1195002', 'psp']);

                    totalRows = obj.gridWidgetObj.getAllVisibleRows().length;
                    assert.equal(obj.$gridContainer.find('.gridTableFooter .totalRows').text(), totalRows, "total row number after search");
                });
            });
            describe('onHoverShowCheckbox Enabled ', function () {
                it('Checkbox should show onHover', function () {
                    var row = obj.$gridContainer.find('.gridTable tr')[4],
                        $row = $(row),
                        tableId = obj.gridWidgetConfElements.tableId,
                        $checkbox = $row.find('[aria-describedby="' + tableId + '_cb"]');

                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");

                    $row.trigger('mouseenter');
                    assert.isTrue($checkbox.css('display') != 'none', "checkbox should be displayed onHover");

                    $row.trigger('mouseleave');
                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");
                });
                it('Checkbox should show when row is selected', function () {
                    var row = obj.$gridContainer.find('.gridTable tr')[4],
                        $row = $(row),
                        tableId = obj.gridWidgetConfElements.tableId,
                        $checkbox = $row.find('[aria-describedby="' + tableId + '_cb"]'),
                        $switchCol = $row.find('.slipstreamgrid_switch_col');

                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");

                    $checkbox.click();
                    assert.isTrue($checkbox.css('display') != 'none', "checkbox should be displayed when row is selected");

                    $checkbox.click();
                    assert.isTrue($checkbox.css('display') != 'none', "checkbox should be displayed after unselect the checkbox");

                    $row.trigger('mouseleave');
                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden after mouseleave");
                });
                it('Toggle selectAll', function () {
                    var $row = obj.$gridContainer.find('.gridTable tr').eq(4),
                        tableId = obj.gridWidgetConfElements.tableId,
                        $checkbox = $row.find('[aria-describedby="' + tableId + '_cb"]'),
                        selectAll = obj.$gridContainer.find('.ui-jqgrid-htable .cbox'),
                        numberOfSelectedRows = obj.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;

                    //When the grid loads, no checkbox and rowHoverMenu are displayed
                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");
                    assert.isTrue(numberOfSelectedRows == 0, "no row is selected");
                    assert.equal($row.find(".hoverMenu-wrapper").length, 0, "the row hover menu is not available");

                    //After selectAll
                    selectAll.click();
                    numberOfSelectedRows = obj.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.isTrue($checkbox.css('display') != 'none', "checkbox should be displayed when row is selected");
                    assert.isTrue(numberOfSelectedRows > 0, "multiple rows are selected");
                    assert.isTrue(numberOfSelectedRows == obj.$gridContainer.find('.gridTableFooter .totalRows').text(), "footer are updated");
                    assert.equal($row.find(".hoverMenu-wrapper").length, 0, "the row hover menu is not available");

                    //After unSelectAll
                    selectAll.click();
                    numberOfSelectedRows = obj.gridWidgetObj.getSelectedRows(true).numberOfSelectedRows;
                    assert.isTrue($checkbox.css('display') == 'none', "checkbox should be hidden");
                    assert.isTrue(numberOfSelectedRows == 0, "no row is selected");
                    assert.equal($row.find(".hoverMenu-wrapper").length, 0, "the row hover menu is not available");
                });
            });
        });

        describe('Grid Search', function () {
            describe('Grid Search with SearchResult Callback', function () {
                var obj = {
                    "$gridContainer": null,
                    "gridWidgetConfElements": {},
                    "gridWidgetObj": null
                };
                var searchResultCallback = function (tokens, renderGridData) {
                        renderGridData(firewallPoliciesData.localSearchData);
                        return;
                    },
                    jsonRecordsFunction = function (data, tableId) {
                        return firewallPoliciesData.localSearchData.length;
                    };
                before(function (done) {
                    obj.$gridContainer = createContainer();


                    _.extend(obj.gridWidgetConfElements, configurationSampleLocal.localGrid, {jsonRecords: jsonRecordsFunction});

                    var newFilterConfig = _.extend({}, obj.gridWidgetConfElements.filter, {searchResult: searchResultCallback});
                    _.extend(obj.gridWidgetConfElements, {filter: newFilterConfig});

                    obj.gridWidgetObj = new GridWidget({
                        "elements": obj.gridWidgetConfElements,
                        "container": obj['$gridContainer'][0]
                    }).build();
                    done();
                });
                after(function () {
                    cleanUp(obj);
                });
                it('searchResult Callback', function () {
                    obj.gridWidgetObj.search('psp');
                    var totalRows = obj.gridWidgetObj.getAllVisibleRows().length;

                    assert.equal(totalRows, firewallPoliciesData.localSearchData.length, "number of rows in the DOM should be as same as the data sample length");
                });
            });
            describe('Grid Search with Different LogicOperator', function () {
                describe('OR LogicOperator', function () {
                    var obj = {
                        "$gridContainer": null,
                        "gridWidgetConfElements": null,
                        "gridWidgetObj": null
                    };
                    before(function (done) {
                        obj.$gridContainer = createContainer();
                        obj.gridWidgetConfElements = configurationSampleLocal.localGrid;
                        obj.gridWidgetObj = new GridWidget({
                            "elements": obj.gridWidgetConfElements,
                            "container": obj['$gridContainer'][0]
                        }).build();
                        done();
                    });
                    after(function () {
                        cleanUp(obj);
                    });
                    it('OR LogicOperator', function () {
                        obj.gridWidgetObj.search('psp');
                        var totalRows1 = obj.gridWidgetObj.getAllVisibleRows().length;
                        obj.gridWidgetObj.clearSearch();
                        obj.gridWidgetObj.search('nemo');
                        var totalRows2 = obj.gridWidgetObj.getAllVisibleRows().length;
                        obj.gridWidgetObj.clearSearch();
                        obj.gridWidgetObj.search(['nemo', 'psp']);
                        var totalRows3 = obj.gridWidgetObj.getAllVisibleRows().length;

                        assert.equal(totalRows3, totalRows1 + totalRows2, "total row number after search");
                    });
                });
                describe('AND LogicOperator', function () {
                    var obj = {
                        "$gridContainer": null,
                        "gridWidgetConfElements": null,
                        "gridWidgetObj": null
                    };
                    before(function (done) {
                        obj.$gridContainer = createContainer();
                        obj.gridWidgetConfElements = configurationSampleLocal.localGrid;

                        //Remove logicOperator from the config
                        if (obj.gridWidgetConfElements.filter && obj.gridWidgetConfElements.filter.readOnlySearch) {
                            delete obj.gridWidgetConfElements.filter.readOnlySearch.logicOperator;
                        }
                        obj.gridWidgetObj = new GridWidget({
                            "elements": obj.gridWidgetConfElements,
                            "container": obj['$gridContainer'][0]
                        }).build();
                        done();
                    });
                    after(function () {
                        cleanUp(obj);
                    });
                    it('AND LogicOperator', function () {
                        var searchString = ['BP', 'Cogent3'];
                        obj.gridWidgetObj.search(['BP', 'Cogent3']);
                        var name = obj.$gridContainer.find('[aria-describedby="localDataGrid_name"]').text();
                        var count = 0;
                        for (var i = 0; i < searchString.length; i++) {
                            if (name.search(searchString[i]) !== -1) {
                                count++;
                            }
                        }
                        assert.equal(count, searchString.length, "name contains both search strings");
                    });
                });
            });
            describe('Grid Sorting', function () {
                describe('Sorting property in case of true/false/undefined', function () {
                    var obj = {
                        "$gridContainer": null,
                        "gridWidgetConfElements": null,
                        "gridWidgetObj": null
                    };
                    before(function (done) {
                        obj.$gridContainer = createContainer();
                        obj.gridWidgetConfElements = configurationSample.simpleGrid_cellFormatters;
                        obj.gridWidgetObj = new GridWidget({
                            "elements": obj.gridWidgetConfElements,
                            "container": obj['$gridContainer'][0]
                        }).build();
                        obj.sortingcontainer = obj.$gridContainer.find('#jqgh_slipstream_grid_widget4_source');
                        obj.sortingicon = obj.sortingcontainer.find('.s-ico');
                        done();
                    });
                    after(function () {
                        cleanUp(obj);
                    });
                    //ToBeFixed with PR: 1276163
                    /*
                     it('Sorting Undefined and Orderable false', function () {
                     obj.sortingcontainer.trigger( "click" );
                     assert.isTrue(!_.isEqual(obj.sortingicon.css('display'),"none"), "Sorting is active on sorting property being undefined");
                     });
                     */
                });
            });

        });

        describe('Expand Row(s) on Demand', function () {
            describe('Simple Grid', function () {
                before(function (done) {

                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid,
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should not contain expanded content after grid loads', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').first();
                    var $cell = $firstRow.find('td:not(.slipstreamgrid_more)');
                    assert.isTrue($cell.find('.cellExpandWrapper').length == 0, 'there is no cellExpandWrapper element');
                });
                it('should contain expanded content after row expands', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').first();

                    //Click expanded arrow
                    $firstRow.find('.slipstreamgrid_more').trigger('click');

                    var $cells = $firstRow.find('td:not(.slipstreamgrid_more)');
                    assert.isTrue($cells.find('.cellExpandWrapper .cellItem').length > 0, 'there are cellExpandWrapper elements');
                });
            });
            describe('Simplified Grid', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.simpleGrid_simplified,
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should not contain expanded icon after grid loads', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').first();
                    var $lessIcon = $firstRow.find('.lessIcon');
                    assert.isTrue($lessIcon.length == 0, 'there is no lessIcon element');
                });
                it('should contain expanded icon after row expands', function () {
                    var $firstRow = this.$gridContainer.find('.jqgrow').first();

                    //Click expanded arrow
                    $firstRow.find('.slipstreamgrid_more').trigger('click');

                    var $lessIcon = $firstRow.find('.lessIcon');
                    assert.isTrue($lessIcon.length > 0, 'there is lessIcon elements');
                });
            });

            describe('Tree Grid', function () {
                before(function (done) {


                    this.$gridContainer = createContainer();
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationTreeSample.treeGridPreselection,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });
                it('should not contain expanded content after tree grid loads', function () {
                    var $secondRow = this.$gridContainer.find('.jqgrow').eq(1);
                    var $cells = $secondRow.find('td:not(.slipstreamgrid_more)');
                    assert.isTrue($cells.find('.cellExpandWrapper').length == 0, 'there is no cellExpandWrapper element');
                });
                it('should contain expanded content after row expands', function () {
                    var $secondRow = this.$gridContainer.find('.jqgrow').eq(1);

                    //Click expanded arrow
                    $secondRow.find('.slipstreamgrid_more').trigger('click');

                    var $cells = $secondRow.find('td:not(.slipstreamgrid_more)');
                    assert.isTrue($cells.find('.cellExpandWrapper .cellItem').length > 0, 'there are cellExpandWrapper elements');
                });
            });


            describe('Nested Grid', function () {
                before(function (done) {
                    var self = this;
                    this.$gridContainer = createContainer();

                    configurationSample.nestedGrid.subGrid.expandOnLoad = true;
                    console.log(configurationSample.nestedGrid)
                    this.gridWidgetObj = new GridWidget({
                        "elements": configurationSample.nestedGrid,
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        var totalParentRows = self.gridWidgetObj.getAllVisibleRows().length,
                            count = 0;
                        $(this).find('.ui-subgrid').bind('subGridLoaded', function () {
                            count++;
                            count == totalParentRows && done();
                        });
                    });

                });
                after(function () {
                    cleanUp(this);
                });
                it('should not contain expanded content after nested grid loads', function () {
                    var $firstSubgrid = this.$gridContainer.find('.ui-jqgrid').eq(1),
                        $firstRow = $firstSubgrid.find('.jqgrow').first(),
                        $columns = $firstRow.find('td:not(.slipstreamgrid_more)');

                    assert.isTrue($columns.find('.cellExpandWrapper .cellItem').length == 0, 'there is no cellExpandWrapper element');
                });
                it('should contain expanded content after row expands', function () {
                    var $firstSubgrid = this.$gridContainer.find('.ui-jqgrid').eq(1),
                        $firstRow = $firstSubgrid.find('.jqgrow').first();

                    //Click expanded arrow
                    $firstRow.find('.slipstreamgrid_more').trigger('click');

                    var $columns = $firstRow.find('td:not(.slipstreamgrid_more)');
                    assert.isTrue($columns.find('.cellExpandWrapper .cellItem').length > 0, 'there are cellExpandWrapper elements');
                });
            });
        });

        describe('Grid Widget Zero State', function () {
            describe('Empty Simple Grid with default zero state message from configuration OBJECT (buttons, message)', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();

                    function getGridConfiguration() {
                        return $.extend(true, {}, configurationSample.simpleGrid);
                    }

                    var simpleDefaultMessageGridExtendedConf = {
                        "url": "/api/get-no-data",
                        "noResultMessage": {
                            "buttons": [
                                {
                                    "id": "add-record",
                                    "value": "Add Record",
                                    "isInactive": true
                                },
                                {
                                    "id": "add-user",
                                    "value": "Add User"
                                }
                            ]
                        }
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(getGridConfiguration(), simpleDefaultMessageGridExtendedConf),
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });

                it('should display the STRING value passed in the grid configuration to noResultMessage', function () {
                    //no-content-wrapper check
                    var isViewRendered = (this.$gridContainer.find('.no-content-wrapper').length > 0);
                    assert.isTrue(isViewRendered);
                });
                it('should display no footer when no row', function () {
                    var footerContainer = (this.$gridContainer.find('.gridTableFooter'));
                    assert.isTrue(footerContainer.css('display') == 'none');
                });
                it('should display the footer when a row exists', function () {
                    this.gridWidgetObj.addRow(firewallPoliciesData.oneRow);
                    var footerContainer = (this.$gridContainer.find('.gridTableFooter'));
                    assert.isFalse(footerContainer.css('display') == 'none');
                });

            });
            describe('Empty Simple Grid with default zero state message from configuration OBJECT & RBAC functionality enabled', function () {
                var old_verifyaccess;
                before(function (done) {
                    this.$gridContainer = createContainer();
                    old_verifyaccess = Slipstream.SDK.RBACResolver.prototype.verifyAccess;
                    Slipstream.SDK.RBACResolver.prototype.verifyAccess = function (capabilities) {
                        if (capabilities.indexOf("CreateRecord") >= 0) {
                            return false;
                        }
                        return true;
                    };
                    function getGridConfiguration() {
                        return $.extend(true, {}, configurationSample.simpleGrid);
                    }

                    var simpleDefaultMessageGridExtendedConf = {
                        "url": "/api/get-no-data",
                        "noResultMessage": {
                            "buttons": [{
                                "key": "addRecord",
                                "id": "addRecord",
                                "value": "Add Record",
                                "isInactive": true
                            }, {
                                "key": "addUser1",
                                "value": "Add User"
                            }]
                        }
                    };
                    this.actionEvents = {
                        addRecord: {
                            capabilities: ['CreateRecord'],
                            name: "addRecord"
                        },
                        addUser1: {
                            capabilities: ['CreateUser'],
                            name: "addUser1"
                        }
                    };
                    this.gridWidgetObj = new GridWidget({
                        elements: $.extend(getGridConfiguration(), simpleDefaultMessageGridExtendedConf),
                        container: this.$gridContainer[0],
                        actionEvents: this.actionEvents
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    Slipstream.SDK.RBACResolver.prototype.verifyAccess = old_verifyaccess;
                    cleanUp(this);
                });

                it('addRecord button is hidden', function () {
                    //no-content-wrapper check
                    var addRecordButton = this.$gridContainer.find('.no-content-wrapper #addRecord');
                    assert.isTrue(addRecordButton.css('display') == 'none', "The add record button is hidden");
                });
                it('addUser button is shown', function () {
                    var addUserButton = this.$gridContainer.find('.no-content-wrapper #addUser1');
                    assert.isFalse(addUserButton.css('display') == 'none', "The add user button is visible");
                });
            });
            describe('Empty Simple Grid with zero state message from configuration STRING', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    // this.originalConfig = {
                    //     "title": configurationSample.simpleGrid.title,
                    //    "subTitle": configurationSample.simpleGrid.subTitle,
                    //     "url": configurationSample.simpleGrid.url,
                    //     "noResultMessage": configurationSample.simpleGrid.noResultMessage
                    // };
                    var simpleGridExtendedConf = {
                        "title": "Grid Sample Page To Demonstrate Empty Grid State",
                        "subTitle": "Example 2: SIMPLE Grid that has no data, empty state displayed from String",
                        "url": "/api/get-no-data",
                        "noResultMessage": "<div class='no-content-wrapper'><div class='grid-no-content-title'>There are no records to display.</div><div class='grid-no-content-description'>(This information was a string, passed in the grid configuration)</div></div>"
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(configurationSample.simpleGrid, simpleGridExtendedConf),
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    // $.extend(configurationSample.simpleGrid, this.originalConfig);
                    cleanUp(this);
                });

                it('should display the STRING value passed in the grid configuration to noResultMessage', function () {
                    var renderedMessageTitle = this.$gridContainer.find('.grid-no-content-title').text();
                    var renderedMessageDescription = this.$gridContainer.find('.grid-no-content-description').text();
                    assert.equal(renderedMessageTitle, "There are no records to display.");
                    assert.equal(renderedMessageDescription, "(This information was a string, passed in the grid configuration)");
                });

            });

            describe('Empty MVC Grid with zero state message from configuration VIEW', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    // this.originalConfig = {
                    //     "title": configurationSample.modelViewGrid.title,
                    //     "subTitle": configurationSample.modelViewGrid.subTitle,
                    //     "url": configurationSample.modelViewGrid.url,
                    //     "noResultMessage": configurationSample.modelViewGrid.noResultMessage
                    // };
                    var modelViewGridExtendedConf = {
                        "title": "",
                        "subTitle": "Example 3: MVC Grid that has no data, empty state displayed from VIEW",
                        "url": "/api/get-no-data",
                        "filter": {
                            "advancedSearch": {
                                "filterMenu": searchConfiguration.filterMenu,
                                "logicMenu": searchConfiguration.logicMenu
                            }
                        },
                        "noResultMessage": function () {
                            return new NoSearchResultView();
                        }
                    };

                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(configurationSample.modelViewGrid, modelViewGridExtendedConf),
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    // $.extend(configurationSample.modelViewGrid, this.originalConfig);
                    cleanUp(this);
                });

                it('should render the VIEW  passed in the grid configuration to noResultMessage', function () {
                    var isViewRendered = (this.$gridContainer.find('.no-content-wrapper').length > 0);
                    assert.isTrue(isViewRendered);
                });

            });

            describe('Empty Grid with zero state message from configuration HTML TEMPLATE', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    this.originalConfig = {
                        "title": configurationTreeSample.treeGrid.title,
                        "subTitle": configurationTreeSample.treeGrid.subTitle,
                        "url": configurationTreeSample.treeGrid.url,
                        "jsonRoot": configurationTreeSample.treeGrid.jsonRoot,
                        "noResultMessage": configurationTreeSample.treeGrid.noResultMessage
                    };
                    var configurationSampleTreeExtendedConf = {
                        "title": "",
                        "subTitle": "Example 4: TREE Grid that has no data, empty state displayed from TEMPLATE",
                        "url": "/api/get-no-data",
                        "jsonRoot": "",
                        "noResultMessage": nrTemplate,
                        "jsonRecords": function (data) {
                            return 0;
                        }
                    };

                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(configurationTreeSample.treeGrid, configurationSampleTreeExtendedConf),
                        "container": this.$gridContainer[0]
                    }).build();
                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    $.extend(configurationSample.treeGrid, this.originalConfig);
                    cleanUp(this);
                });

                it('should render the HTML TEMPLATE  passed in the grid configuration to noResultMessage', function () {
                    var isViewRendered = (this.$gridContainer.find('.no-content-wrapper').length > 0);
                    assert.isTrue(isViewRendered);
                });
            });

            describe('Simple Grid with error message due to error in fetching data', function () {
                before(function (done) {
                    this.$gridContainer = createContainer();
                    var simpleGridExtendedConf = {
                        "url": "/api/get-error-data"
                    };
                    this.gridWidgetObj = new GridWidget({
                        "elements": $.extend(configurationSample.simpleGrid, simpleGridExtendedConf),
                        "container": this.$gridContainer[0]
                    }).build();

                    this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                        done();
                    });
                });
                after(function () {
                    cleanUp(this);
                });

                it('should display error message when fetching data errors', function () {
                    var renderedMessage = this.$gridContainer.find('.noResultContainer').text();
                    assert.equal(renderedMessage, "An error occurred while requesting the data");
                });

            });

            describe('NestedGrid with no data', function () {
                describe('Parent Container', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        var nestedGridExtendedConf = {
                            "url": "/api/get-no-data"
                        };
                        this.gridWidgetObj = new GridWidget({
                            "elements": $.extend(configurationSample.nestedGrid, nestedGridExtendedConf),
                            "container": this.$gridContainer[0]
                        }).build();

                        this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });

                    it('should display noResultMessage', function () {
                        var renderedMessage = this.$gridContainer.find('.noResultContainer');
                        assert.isTrue(renderedMessage.length > 0);
                        assert.isTrue(renderedMessage.css('display') !== 'none');
                    });
                });
                describe('Child Container', function () {
                    before(function (done) {
                        this.$gridContainer = createContainer();
                        var nestedSubGridExtendedConf = {
                            "url": "/api/get-no-data",
                            "expandOnLoad": true
                        };
                        $.extend(configurationSample.nestedGrid.subGrid, nestedSubGridExtendedConf),
                            this.gridWidgetObj = new GridWidget({
                                "elements": configurationSample.nestedGrid,
                                "container": this.$gridContainer[0]
                            }).build();

                        this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function () {
                        cleanUp(this);
                    });

                    it('should display noResultMessage', function () {
                        var renderedMessage = this.$gridContainer.find('.noResultContainer');
                        assert.isTrue(renderedMessage.length > 0);
                        assert.isTrue(renderedMessage.css('display') !== 'none');
                    });
                });
            });

        });

        describe('Grid Widget Hide Show', function () {
            before(function (done) {
                this.$gridContainer = createContainer();
                this.gridFilterOptions = this.$gridContainer.find('.grid_filter_options');
                this.gridWidgetConfElements = configurationSample.simpleGrid;
                this.gridWidgetObj = new GridWidget({
                    "elements": this.gridWidgetConfElements,
                    "container": this.$gridContainer[0]
                }).build();
                this.$gridContainer.find('.gridTable').bind('gridLoaded', function () { //waits for data to be loaded
                    done();
                });
            });
            after(function () {
                cleanUp(this);
            });
            it('Should not contain Name field when "internal" set to true', function () {
                this.gridFilterOptions.bind("contextmenu:visible", function () {
                    var hideShowItems = $.find('.context-menu-root > .grid-widget-show-hide-columns-menu > .grid-widget-show-hide-columns-menu .context-menu-item label input');
                    var nameDoesNotExist = false;
                    for (var i = 0; i < hideShowItems.length; i++) {
                        if (!_.isEqual(hideShowItems[i].innerHTML, "Name")) {
                            nameDoesNotExist = true;
                        } else {
                            nameDoesNotExist = false;
                        }
                    }
                    assert.isTrue(nameDoesNotExist, "When internal is true Name does not show in Show Hide Columns");
                    $.contextMenu("destroy", this.gridFilterOptions);
                });
                this.gridFilterOptions.trigger("click");
            });
            it('Should contain Inactive field when "internal" is set to false', function () {
                this.gridFilterOptions.bind("contextmenu:visible", function () {
                    var hideShowItems = $.find('.context-menu-root > .grid-widget-show-hide-columns-menu > .grid-widget-show-hide-columns-menu .context-menu-item label span');
                    var inactiveFieldExists = false;
                    for (var i = 0; i < hideShowItems.length; i++) {
                        if (_.isEqual(hideShowItems[i].innerHTML, "Inactive")) {
                            inactiveFieldExists = true;
                            break;
                        }
                    }
                    assert.isTrue(inactiveFieldExists, "When internal is false for inactive field, it shows in Show Hide Columns");
                    $.contextMenu("destroy", this.gridFilterOptions);
                });
                this.gridFilterOptions.trigger("click");
            });
            it('Should have fields with "hidden" set to true, unchecked', function () {
                this.gridFilterOptions.bind("contextmenu:visible", function () {
                    var hideShowItems = $.find('.context-menu-root > .grid-widget-show-hide-columns-menu > .grid-widget-show-hide-columns-menu .context-menu-item label input');
                    var itsChecked = false;
                    for (var i = 0; i < hideShowItems.length; i++) {
                        if ((_.isEqual(hideShowItems[i].value, "inactive") || _.isEqual(hideShowItems[i].value, "from-source-zone")) && hideShowItems[i].checked) {
                            itsChecked = true;
                        }
                    }
                    assert.isFalse(itsChecked, "When hidden is true, fields show unchecked");
                    $.contextMenu("destroy", this.gridFilterOptions);
                });
                this.gridFilterOptions.trigger("click");
            });
            it('Should have fields with "hidden" set to false, checked', function () {
                this.gridFilterOptions.bind("contextmenu:visible", function () {
                    var hideShowItems = $.find('.context-menu-root > .grid-widget-show-hide-columns-menu > .grid-widget-show-hide-columns-menu .context-menu-item label input');
                    var itsChecked = false;
                    for (var i = 0; i < hideShowItems.length; i++) {
                        if (_.isEqual(hideShowItems[i].value, "source-address") && hideShowItems[i].checked) {
                            itsChecked = true;
                            break;
                        }
                    }
                    assert.isTrue(itsChecked, "When hidden is false, fields show checked");
                    $.contextMenu("destroy", this.gridFilterOptions);
                });
                this.gridFilterOptions.trigger("click");
            });
            it('Should have fields with "hidden" & "internal" not defined in configuration, checked', function () {
                this.gridFilterOptions.bind("contextmenu:visible", function () {
                    var hideShowItems = $.find('.context-menu-root > .grid-widget-show-hide-columns-menu > .grid-widget-show-hide-columns-menu .context-menu-item label input');
                    var itsChecked = false;
                    for (var i = 0; i < hideShowItems.length; i++) {
                        if (_.isEqual(hideShowItems[i].value, "date") && hideShowItems[i].checked) {
                            itsChecked = true;
                            break;
                        }
                    }
                    assert.isTrue(itsChecked, "When 'hidden' & 'internal' not defined in configuration, fields show checked");
                    $.contextMenu("destroy", this.gridFilterOptions);

                });
                this.gridFilterOptions.trigger("click");
            });
        });

    });

    describe('Advance filter: QueryBuilder Widget - integrated to grid Widget', function () {

        var self = this;
        var searchDataAST;
        var predefineSearchString = "searchString";

        var mockjaxID = $.mockjax({
            url: '/api/advanceFilterData',
            dataType: 'json',
            type: 'POST',
            response: function (settings) {
                console.log('parameters in the mockjax request: ' + settings.data);
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
                    self.searchDataAST = JSON.parse(settings.data).filterTokens;

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

        before(function () {
            this.$gridContainer = createContainer();

            var advanceFilterConf = {
                "url": "/api/advanceFilterData"
            };

            this.gridWidgetObj = new GridWidget({
                "elements": $.extend(configurationSampleAdvancedFilter.simpleGridAdvancedFilter, advanceFilterConf),
                "search": predefineSearchString,
                "container": this.$gridContainer[0]
            }).build();
        });

        after(function () {
            $.mockjax.clear([mockjaxID]);
            cleanUp(this);
        });

        it('Should have the advance filter integrated', function () {
            var queryWidget = this.$gridContainer.find('.queryBuilder-widget');
            assert.isDefined(queryWidget[0]);
        });

        it('QueryBuilder Instance should be returned from gridWidget', function () {
            var queryBuilder = this.gridWidgetObj.getSearchWidgetInstance();
            assert.isObject(queryBuilder, "queryBuilder Object should exist.");
            assert.isFunction(queryBuilder.getQuery, "getQuery method should exist.");
        });

        it('The predefined search in the grid integration should be available from queryBuilder', function () {
            var queryBuilder = this.gridWidgetObj.getSearchWidgetInstance();
            assert.equal(queryBuilder.getQuery(), predefineSearchString, "predefineSearchString should be available from queryBuilder");
        });

        it('QueryBuilder method should provide the same value as in UI', function () {
            var queryBuilder = this.gridWidgetObj.getSearchWidgetInstance();
            queryBuilder.clear();
            var searchString = "a";
            queryBuilder.add({"query": searchString});
            assert.equal(queryBuilder.getQuery(), searchString, "getQuery should return same value.");
        });
    });

});