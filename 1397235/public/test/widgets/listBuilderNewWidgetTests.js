define([
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/listBuilderNew/tests/dataSample/testingSample',
    'mockjax'
],function(ListBuilderWidget, listBuilderConf, testingSample, mockjax) {
    var $el = $('#test_widget'),
        containerId = 0;

    var createContainer = function () {
        var $container = $("<div id = grid-container-id" + containerId++ + "></div>");
        $el.append($container);
        return $container;
    };

    var cleanUp = function (thisObj) {
        thisObj.listBuilderWidgetObj.destroy();
        thisObj.$container.remove();
    };

    /* mocks REST API response for remote validation of an input value */
    (function (){
        $.mockjax({
            url: '/api/get-data3',
            dataType: 'json',
            response: function(settings) {
                console.log('parameters in the mockjack request: ' + settings.data);
                console.log(testingSample.addresses);
                this.responseText = testingSample.addresses;
            },
            responseTime: 1000
        });
        $.mockjax({
            url: '/api/get-data2',
            dataType: 'json',
            response: function(settings) {
                console.log('parameters in the mockjack request: ' + settings.data);
                console.log(testingSample.addresses);
                this.responseText = testingSample.addresses;
            },
            responseTime: 1000
        });
    })();

    describe('New List Builder Widget - Unit Tests:', function() {

        describe('List Builder Widget Interface', function() {
            describe('List Builder Widget Is Built', function() {
                before(function(){
                    this.$container = createContainer();
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('should exist', function() {
                    this.listBuilderWidgetObj.should.exist;
                });
                it('build() should exist', function() {
                    assert.isFunction(this.listBuilderWidgetObj.build, 'The List Builder widget must have a function named build.');
                });
                it('destroy() should exist', function() {
                    assert.isFunction(this.listBuilderWidgetObj.destroy, 'The List Builder widget must have a function named destroy.');
                });
                it('reload() should exist', function() {
                    assert.isFunction(this.listBuilderWidgetObj.reload, 'The List Builder widget must have a function named reload.');
                });
            });
            describe('List Builder Widget with Error', function() {
                before(function(){
                    this.$container = createContainer();
                    
                });
                it('build()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({});
                    assert.throws(this.listBuilderWidgetObj.build, Error, 'The container object required to build the List Builder widget is missing');
                });
                it('build() - no elements', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.build, Error, 'The elements object required to build the List Builder widget is missing');
                });
                it('build() - no columns', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: {},
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.build, Error, 'List Builder widget could not be built because column is a required parameter in the configuration object of the List Builder widget');
                });
                it('build() - no availableElements', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: {
                           columns: []
                        },
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.build, Error, 'The availableElements configuration is required');
                });
                it('destroy()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.destroy, Error, 'The list builder widget has not been built');
                });
                it('reload()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.reload, Error, 'The list builder widget has not been built');
                });
                it('selectItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.selectItems, Error, 'The list builder widget has not been built');
                });
                it('getSelectedUrlParameter()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.getSelectedUrlParameter, Error, 'The list builder widget has not been built');
                });
                it('searchSelectedItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.searchSelectedItems, Error, 'The list builder widget has not been built');
                });
                it('addSelectedItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.addSelectedItems, Error, 'The list builder widget has not been built');
                });
                it('removeSelectedItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.removeSelectedItems, Error, 'The list builder widget has not been built');
                });
                it('getSelectedItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.getSelectedItems, Error, 'The list builder widget has not been built');
                });
                it('renderSelectedItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.renderSelectedItems, Error, 'The list builder widget has not been built');
                });
                it('unselectItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.unselectItems, Error, 'The list builder widget has not been built');
                });
                it('getAvailableUrlParameter()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.getAvailableUrlParameter, Error, 'The list builder widget has not been built');
                });
                it('searchAvailableItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.searchAvailableItems, Error, 'The list builder widget has not been built');
                });
                it('addAvailableItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.addAvailableItems, Error, 'The list builder widget has not been built');
                });
                it('renderAvailableItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.renderAvailableItems, Error, 'The list builder widget has not been built');
                });
                it('removeAvailableItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.removeAvailableItems, Error, 'The list builder widget has not been built');
                });
                it('getAvailableItems()', function() {
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    });
                    assert.throws(this.listBuilderWidgetObj.getAvailableItems, Error, 'The list builder widget has not been built');
                });
            });
        });

        describe('List Builder Widget Methods', function() {
            describe('Local Data Methods', function() {
                before(function(){
                    this.$container = createContainer();
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('getAvailableItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length,
                        count = this.$container.find(".panel1 .subTitle .content").text().split(' ');
                    assert.equal(totalRows, count[0], "the row count matches the total number of rows");
                });
                it('getSelectedItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length,
                        count = this.$container.find(".panel2 .subTitle .content").text().split(' ');
                    assert.equal(totalRows, count[0], "the row count matches the total number of rows");
                });
                
                it('addAvailableItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                    this.listBuilderWidgetObj.addAvailableItems(testingSample.sample1);

                    var totalRowsNew = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.equal(totalRows + testingSample.sample1.length, totalRowsNew, "the row count matches the total number of rows");

                    var self = this,
                        throwErrorFunc = function(){
                            self.listBuilderWidgetObj.addAvailableItems(testingSample.sample1);
                        };
                    assert.throws(throwErrorFunc, Error, 'This ID already exists');
                });
                it('addSelectedItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    this.listBuilderWidgetObj.addSelectedItems(testingSample.sample2);

                    var totalRowsNew = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.equal(totalRows + testingSample.sample2.length, totalRowsNew, "the row count matches the total number of rows");

                    var self = this,
                        throwErrorFunc = function(){
                            self.listBuilderWidgetObj.addSelectedItems(testingSample.sample2);
                        };
                    assert.throws(throwErrorFunc, Error, 'This ID already exists');
                });
                it('removeAvailableItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                    this.listBuilderWidgetObj.removeAvailableItems(testingSample.sample1);

                    var totalRowsNew = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.equal(totalRows - testingSample.sample1.length, totalRowsNew, "the row count matches the total number of rows");
                });
                it('removeSelectedItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    this.listBuilderWidgetObj.removeSelectedItems(testingSample.sample2);

                    var totalRowsNew = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.equal(totalRows - testingSample.sample2.length, totalRowsNew, "the row count matches the total number of rows");
                });
                it('selectItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                    this.listBuilderWidgetObj.selectItems(testingSample.sample3);

                    var totalRowsNew = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.equal(totalRows - testingSample.sample3.length, totalRowsNew, "the row count matches the total number of rows");
                });
                it('unselectItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    this.listBuilderWidgetObj.unselectItems(testingSample.sample3);

                    var totalRowsNew = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.equal(totalRows - testingSample.sample3.length, totalRowsNew, "the row count matches the total number of rows");
                });
                it('searchAvailableItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                    this.listBuilderWidgetObj.searchAvailableItems("dummy");

                    var totalRowsNew = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.isTrue(totalRowsNew < totalRows, "search available panel");
                });
                it('searchSelectedItems', function() {
                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    this.listBuilderWidgetObj.searchSelectedItems("kyle");

                    var totalRowsNew = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.isTrue(totalRowsNew < totalRows, "search selected panel");
                });
            });   
            describe('Remote Data Methods', function() {
                describe('Share same config', function() {
                    before(function(){
                        this.$container = createContainer();
                        listBuilderConf.firstListBuilder.availableElements.url = "/api/get-data3";
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.firstListBuilder,
                            container: this.$container[0]
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('getAvailableUrlParameter', function() {
                        var postData = this.listBuilderWidgetObj.getAvailableUrlParameter();
                        assert.isTrue(!_.isEmpty(postData), "postData object returns");
                    });
                    it('getSelectedUrlParameter', function() {
                        var postData = this.listBuilderWidgetObj.getSelectedUrlParameter();
                        assert.isTrue(!_.isEmpty(postData), "postData object returns");
                    });
                    it('reload', function() {
                        var availableCount = this.$container.find(".panel1 .subTitle .content").text().split(' '),
                            selectedCount = this.$container.find(".panel2 .subTitle .content").text().split(' ');
                        this.listBuilderWidgetObj.reload();
                        var newAvailableCount = this.$container.find(".panel1 .subTitle .content").text().split(' '),
                            newSelectedCount = this.$container.find(".panel2 .subTitle .content").text().split(' ');
                        assert.equal(newAvailableCount[0] + newSelectedCount[0], availableCount[0] + selectedCount[0], "get same count after load");
                    });
                });
                describe('Different config', function() {
                    beforeEach(function(){
                        this.$container = createContainer();
                    });
                    afterEach(function(){
                        cleanUp(this);
                        listBuilderConf.firstListBuilder.selectedElements.url = "/api/get-data2";
                        listBuilderConf.firstListBuilder.availableElements.url = "/api/get-data3";
                    });
                    it('selectItems', function() {
                        listBuilderConf.firstListBuilder.onChangeSelected = function(e, list){
                            assert.equal(list.data.length, testingSample.sample3.length, "data number should match the api returned data");
                            assert.equal(list.event, "select", "Should be select event");
                        };
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.firstListBuilder,
                            container: this.$container[0]
                        }).build();
                        this.listBuilderWidgetObj.selectItems(testingSample.sample3);
                    });
                    it('unselectItems', function() {
                        listBuilderConf.firstListBuilder.onChangeSelected = function(e, list){
                            assert.equal(list.data.length, testingSample.sample3.length, "data number should match the api returned data");
                            assert.equal(list.event, "unselect", "Should be unselect event");
                        };
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.firstListBuilder,
                            container: this.$container[0]
                        }).build();
                        this.listBuilderWidgetObj.unselectItems(testingSample.sample3);
                    });
                });
            });
            describe('Collection Data Methods', function() {
                var page = {
                    numberOfPage: 1,
                    totalPages: 1,
                    totalRecords: 3
                };
                before(function(){
                    this.$container = createContainer();
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('renderAvailableItems', function() {
                    var originalTotalNumber = this.listBuilderWidgetObj.getAvailableItems().length;
                    this.listBuilderWidgetObj.renderAvailableItems(testingSample.filteredZone, page);
                    var currentTotalNumber = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.isTrue(originalTotalNumber !== currentTotalNumber, "renderAvailableData reset the data in the available panel");
                    assert.equal(testingSample.filteredZone.length, currentTotalNumber, "data is added in the available panel");
                });
                it('renderSelectedItems', function() {
                    var originalTotalNumber = this.listBuilderWidgetObj.getSelectedItems().length;
                    this.listBuilderWidgetObj.renderSelectedItems(testingSample.filteredZone, page);
                    var currentTotalNumber = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.isTrue(originalTotalNumber !== currentTotalNumber, "renderSelectedData reset the data in the selected panel");
                    assert.equal(testingSample.filteredZone.length, currentTotalNumber, "data is added in the selected panel");
                });
            });    
        });
        describe('List Builder Widget Interaction', function() {
            describe('Local Data Interaction', function() {
                before(function(){
                    this.$container = createContainer();
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.thirdListBuilder,
                        container: this.$container[0]
                    }).build();
                });
                after(function(){
                    cleanUp(this);
                });
                it('Clear Search in the filter menu', function() {
                    this.$container.find('.panel1 .listActions .actionMenu').click();
                    var $clearAllLink = $(".context-menu-list .clearAll");
                    assert.isTrue($clearAllLink.length > 0, "Clear All link is available");
                    assert.isTrue($clearAllLink.hasClass("disabledLink"), "Clear All link is disabled");
                    $(".context-menu-list input").eq(0).click();
                    assert.isTrue($clearAllLink.hasClass("activeLink"), "Clear All link is active");
                    $('.context-menu-list').trigger('contextmenu:hide');
                });
                it('Select All', function() {
                    this.$container.find('.panel1 .ui-jqgrid-htable input[type=checkbox]').click();
                    var allRowNum = this.$container.find('.panel1 .gridTable input[type=checkbox]:checked').length,
                        availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                    assert.equal(allRowNum, availableTotalRows, "select all items from the available panel");

                    var selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    this.$container.find('.btn-group .select-container').click();

                    var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                    assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the available panel");
                });
                it('UnSelect All', function() {
                    this.$container.find('.panel2 .ui-jqgrid-htable input[type=checkbox]').click();
                    var allRowNum = this.$container.find('.panel2 .gridTable input[type=checkbox]:checked').length,
                        selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;
                    assert.equal(allRowNum, selectedTotalRows, "select all items from the available panel");

                    var availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                    this.$container.find('.btn-group .unselect-container').click();

                    var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                    
                    assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the selected panel");
                });
                it('Available Search', function(done) {
                    var self = this,
                        evtKeyUpKey = $.Event("keyup"),
                        orgTotalRows = this.listBuilderWidgetObj.getAvailableItems().length,
                        searchInput = this.$container.find('.panel1 .filter_container input');

                    searchInput.val('d');
                    searchInput.trigger(evtKeyUpKey);
                    searchInput.val('du');
                    searchInput.trigger(evtKeyUpKey);
                    searchInput.val('dum');
                    searchInput.trigger(evtKeyUpKey);

                    setTimeout(function() {
                        var totalRows = self.listBuilderWidgetObj.getAvailableItems().length,
                            count = self.$container.find(".panel1 .subTitle .content").text().split(' ');
                        
                        assert.equal(totalRows, count[0], "the row count matches the total number of rows");
                        assert.isTrue(totalRows < orgTotalRows, "search available panel");
                        done();
                    }, 500);
                });
            });
            describe('Load Data Once Interaction', function() {
                describe('Load through URL', function() {
                    before(function(done){
                        this.$container = createContainer();
                        listBuilderConf.secondListBuilder.availableElements.url = "/api/get-data3";
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.secondListBuilder,
                            container: this.$container[0]
                        }).build();
                        this.$container.find('.new-list-builder-widget').bind('onBuildListBuilder', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('Select All', function() {
                        this.$container.find('.panel1 .ui-jqgrid-htable input[type=checkbox]').click();
                        var allRowNum = this.$container.find('.panel1 .gridTable input[type=checkbox]:checked').length,
                            availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        assert.equal(allRowNum, availableTotalRows, "select all items from the available panel");

                        var selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                        this.$container.find('.btn-group .select-container').click();

                        var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                        assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the available panel");
                    });
                    it('UnSelect All', function() {
                        this.$container.find('.panel2 .ui-jqgrid-htable input[type=checkbox]').click();
                        var allRowNum = this.$container.find('.panel2 .gridTable input[type=checkbox]:checked').length,
                            selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;
                        assert.equal(allRowNum, selectedTotalRows, "select all items from the available panel");

                        var availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                        this.$container.find('.btn-group .unselect-container').click();

                        var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        
                        assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the selected panel");
                    });
                    it('Available Search', function(done) {
                        var self = this,
                            evtKeyUpKey = $.Event("keyup"),
                            orgTotalRows = this.listBuilderWidgetObj.getAvailableItems().length,
                            searchInput = this.$container.find('.panel1 .filter_container input');

                        searchInput.val('d');
                        searchInput.trigger(evtKeyUpKey);
                        searchInput.val('du');
                        searchInput.trigger(evtKeyUpKey);
                        searchInput.val('dum');
                        searchInput.trigger(evtKeyUpKey);

                        setTimeout(function() {
                            var totalRows = self.listBuilderWidgetObj.getAvailableItems().length,
                                count = self.$container.find(".panel1 .subTitle .content").text().split(' ');
                            
                            assert.equal(totalRows, count[0], "the row count matches the total number of rows");
                            assert.isTrue(totalRows < orgTotalRows, "search available panel");
                            done();
                        }, 500);
                    });
                    it('Select Items', function() {
                        this.listBuilderWidgetObj.searchAvailableItems('');
                        var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        this.listBuilderWidgetObj.selectItems(testingSample.sample3);
                        var currentAvailableRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        assert.equal(totalRows, currentAvailableRows + testingSample.sample3.length, "The totalRows = the number of current available row + the number of selected items");
                    });
                });
                describe('Load through getData', function() {
                    before(function(done){
                        this.$container = createContainer();
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.fourthListBuilder,
                            container: this.$container[0]
                        }).build();
                        this.$container.find('.new-list-builder-widget').bind('onBuildListBuilder', function () { //waits for data to be loaded
                            done();
                        });
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('Select All', function() {
                        this.$container.find('.panel1 .ui-jqgrid-htable input[type=checkbox]').click();
                        var allRowNum = this.$container.find('.panel1 .gridTable input[type=checkbox]:checked').length,
                            availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        assert.equal(allRowNum, availableTotalRows, "select all items from the available panel");

                        var selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                        this.$container.find('.btn-group .select-container').click();

                        var totalRows = this.listBuilderWidgetObj.getSelectedItems().length;

                        assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the available panel");
                    });
                    it('UnSelect All', function() {
                        this.$container.find('.panel2 .ui-jqgrid-htable input[type=checkbox]').click();
                        var allRowNum = this.$container.find('.panel2 .gridTable input[type=checkbox]:checked').length,
                            selectedTotalRows = this.listBuilderWidgetObj.getSelectedItems().length;
                        assert.equal(allRowNum, selectedTotalRows, "select all items from the available panel");

                        var availableTotalRows = this.listBuilderWidgetObj.getAvailableItems().length;

                        this.$container.find('.btn-group .unselect-container').click();

                        var totalRows = this.listBuilderWidgetObj.getAvailableItems().length;
                        
                        assert.equal(availableTotalRows + selectedTotalRows, totalRows, "select all items from the selected panel");
                    });
                    it('Available Search', function(done) {
                        var self = this,
                            evtKeyUpKey = $.Event("keyup"),
                            orgTotalRows = this.listBuilderWidgetObj.getAvailableItems().length,
                            searchInput = this.$container.find('.panel1 .filter_container input');

                        searchInput.val('d');
                        searchInput.trigger(evtKeyUpKey);
                        searchInput.val('du');
                        searchInput.trigger(evtKeyUpKey);
                        searchInput.val('dum');
                        searchInput.trigger(evtKeyUpKey);

                        setTimeout(function() {
                            var totalRows = self.listBuilderWidgetObj.getAvailableItems().length,
                                count = self.$container.find(".panel1 .subTitle .content").text().split(' ');
                            
                            assert.equal(totalRows, count[0], "the row count matches the total number of rows");
                            assert.isTrue(totalRows < orgTotalRows, "search available panel");
                            done();
                        }, 500);
                    });
                });
            });
            describe('Remote Data Interaction', function() {
                beforeEach(function(){
                    this.$container = createContainer();
                    listBuilderConf.firstListBuilder.availableElements.url = "/api/get-data3";
                });
                afterEach(function(){
                    cleanUp(this);
                });
                it('click select btn - select all', function() {
                    listBuilderConf.firstListBuilder.onChangeSelected = function(e, list){
                        assert.equal(list.data.length, testingSample.selectAllAvailable.length, "data number should match the api returned data");
                        assert.equal(list.event, "selectAll", "Should be selectAll event");
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.firstListBuilder,
                        container: this.$container[0]
                    }).build();

                    this.$container.find('.panel1 .ui-jqgrid-htable input[type=checkbox]').click();
                    this.$container.find('.btn-group .select-container').click();
                });
                it('click unselect btn - unselect all', function() {
                    listBuilderConf.firstListBuilder.onChangeSelected = function(e, list){
                        assert.equal(list.data.length, testingSample.selectAllAvailable.length, "data number should match the api returned data");
                        assert.equal(list.event, "unselectAll", "Should be unselectAll event");
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.firstListBuilder,
                        container: this.$container[0]
                    }).build();

                    this.$container.find('.panel2 .ui-jqgrid-htable input[type=checkbox]').click();
                    this.$container.find('.btn-group .unselect-container').click();
                });
            }); 
            describe('Collection Data Interaction', function() {
                beforeEach(function(){
                    this.$container = createContainer();
                });
                afterEach(function(){
                    cleanUp(this);
                });
                it('Select all available items', function() {
                    listBuilderConf.collectionData.onChangeSelected = function(e, list){
                        assert.equal(list.data.length, testingSample.selectAllAvailable.length, "data number should match the api returned data");
                        assert.equal(list.event, "selectAll", "Should be selectAll event");
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    }).build();

                    this.$container.find('.panel1 .ui-jqgrid-htable input[type=checkbox]').click();
                    this.$container.find('.btn-group .select-container').click();
                });
                it('Unselect all selected items', function() {
                    listBuilderConf.collectionData.onChangeSelected = function(e, list){
                        assert.equal(list.data.length, testingSample.selectAllAvailable.length, "data number should match the api returned data");
                        assert.equal(list.event, "unselectAll", "Should be unselectAll event");
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    }).build();

                    this.$container.find('.panel2 .ui-jqgrid-htable input[type=checkbox]').click();
                    this.$container.find('.btn-group .unselect-container').click();
                });
                it('Search available items', function(done) {
                    var token = 'dummy';
                    listBuilderConf.collectionData.availableElements.getPageData = function(renderData, pageData, searchToken, pageSize){
                        if (!_.isEmpty(searchToken)){
                            assert.equal(searchToken, token, "search callback is triggered");
                            done();
                        }
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    }).build();
                    this.listBuilderWidgetObj.searchAvailableItems(token);
                });
                it('Search selected items', function(done) {
                    var token = 'dummy';
                    listBuilderConf.collectionData.selectedElements.getPageData = function(renderData, pageData, searchToken, pageSize){
                        if (!_.isEmpty(searchToken)){
                            assert.equal(searchToken, token, "search callback is triggered");
                            done();
                        }
                    };
                    this.listBuilderWidgetObj = new ListBuilderWidget({
                        elements: listBuilderConf.collectionData,
                        container: this.$container[0]
                    }).build();
                    this.listBuilderWidgetObj.searchSelectedItems(token);
                });
            });
            describe('Auto Width', function() {
                describe('Turn on auto width', function() {
                    before(function(){
                        this.$container = createContainer();
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: listBuilderConf.thirdListBuilder,
                            container: this.$container
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('auto width is set', function() {
                        assert.isTrue(this.$container.find(".slipstream-widget-auto-width").length == 2, "Auto width is set");
                    });
                });
                describe('Turn off auto width', function() {
                    before(function(){
                        var conf = _.extend({}, listBuilderConf.thirdListBuilder, true);
                        delete conf.showWidthAsPercentage; //deleting property, so the auto width is turned off by default
                        this.$container = createContainer();
                        this.listBuilderWidgetObj = new ListBuilderWidget({
                            elements: conf,
                            container: this.$container
                        }).build();
                    });
                    after(function(){
                        cleanUp(this);
                    });
                    it('auto width is NOT set', function() {
                        assert.equal(this.$container.find(".slipstream-widget-auto-width").length, 0, "Custom width is set");
                    });
                });
            });  
        });   
    });

});