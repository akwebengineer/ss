define([
	"../../../../event-viewer/js/eventviewer/models/eventFilterModel.js",
	"../../../../event-viewer/js/eventviewer/views/createFilterView.js"
	], function(EventFilterModel, CreateFilterView) {

	var activity = new Slipstream.SDK.Activity(),
        view, model,endTime = new Date(), filterObj,
        startTime = new Date(endTime - (7200000/4)), filterManagement = {}, response = {},
        save, isValidInput,
        event = {
            type: 'click',
            preventDefault: function () {}
        };

	describe("Event Viewer Create Filter unit tests", function() {

        describe("CreateFilterView - create", function() {
            before(function(){
                model = new EventFilterModel();
                filterObj   = {
                  "aggregation": "none",
                   "time-unit": 0,
                   "start-time": startTime,
                   "end-time": endTime,
                   "filter-tags" :"all",
                   "duration": endTime - startTime,
                   "time-period": "Last 30 minute(s)",
                   "filter-string": "event-category = antispam",
                   "formatted-filter": {"and": [{"filter": {"key": "event-type", "operator": "EQUALS", "value": "AAMW_ACTION_LOG"}}]}
                };
                view = new CreateFilterView({
                    activity: activity,
                    context: new Slipstream.SDK.ActivityContext(),
                    model: model,
                    filterObj:filterObj,
                    filterMgmt: filterManagement,
                    formMode : 'CREATE'
                });
            });

            it("EventFilterModel model exists ?", function() {
                model.should.exist;
            });

            it("filter view exists ?", function() {
                view.should.exist;
            });

            it("filter view rendered ?", function() {
                view.render();

                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#filter-name').val('custom filter');
                $('#humanReadableFilterString').val('event-type = AAMW_ACTION_LOG');
                $('#time-period').val('Last 30 minute(s)');
                $('#tags').val('ALL EVENTS');
                $('#start-time').val(1459757862659);
                $('#end-time').val(1459759662659);
                $('#filter-tags').val('all');
                $('#duration').val(1800000);
                $('#aggregation').val('none');
                $('#time-unit').val(0);

            });

            it("view.formMode should be CREATE", function() {
                view.options.formMode.should.be.equal('CREATE');
            });

            it("view.formWidget should exist", function() {
                view.formWidget.should.exist;
            });

            it("create filter overlay should be destroyed when Cancel button clicked", function() {
                var event = {
                    type: 'click',
                    preventDefault: function () {}
                };
                view.activity.overlayWidgetObj = {
                    destroy: function(){}
                };

                view.cancel(event);
            });

            describe("CreateFilterView - Form InValid check(submit)", function() {

                beforeEach(function () {
                    save = sinon.stub(view.model, 'save');
                    isValidInput = sinon.stub(view.formWidget, "isValidInput", function() { return false;});
                });

                afterEach(function () {
                    view.model.save.restore();
                    isValidInput.restore();
                });

                it("Error info should be shown if form is invalid when ok button clicked", function() {
                    view.submit(event);
                    save.called.should.be.equal(false);
                    isValidInput.calledOnce.should.be.equal(true);
                });

            });

            describe("CreateFilterView - Save Filter(submit)", function() {

                beforeEach(function () {
                    save = sinon.stub(view.model, 'save');
                });

                afterEach(function () {
                    view.model.save.restore();
                });

                it("Filter should be saved correctly when ok button clicked (using mockjax)", function() {

                    $.mockjax({
                        url: "/api/juniper/seci/filter-management/filters/",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    view.submit(event);
                    save.called.should.be.equal(true);
                });
            });

            describe("CreateFilterView - Success Handler", function() {
                var submit;

                before(function() {
                    var filterData =  { "filter-name" : "custom filter", "id" : 32877};
                    view.model.set(filterData);

                    $.mockjax({
                        url: "/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id=32877",
                        type: 'PUT'
                    });
                });

                it("Recent filters list should update once filter is saved correctly (using mockjax)", function() {
                    view.onSync(model, response);
                });
            });

            describe("CreateFilterView - Error Handler", function() {
                it("Create filter should throw error if the filter name is duplicate", function() {
                    view.onError(model, response);
                });
            });

        });

        // Modify Filter //

        describe("CreateFilterView - Modify", function() {

            before(function(){
                filterObj   = {
                    "filter-name" : "custom filter",
                     "aggregation": "none",
                     "time-unit": 0,
                     "start-time": startTime,
                     "end-time": endTime,
                     "duration": endTime - startTime,
                     "filter-tags" :"webfilter",
                     "time-period": "Last 30 minute(s)",
                     "filter-string": "event-category = antispam",
                     "formatted-filter": {"and": [{"filter": {"key": "event-type", "operator": "EQUALS", "value": "AAMW_ACTION_LOG"}}]},
                     "selected-filterid" : 32877,
                     "id" : 32877
                };
                view = new CreateFilterView({
                      activity: activity,
                      context: new Slipstream.SDK.ActivityContext(),
                      model: model,
                      filterObj:filterObj,
                      filterMgmt: filterManagement,
                      formMode : 'EDIT'
                });
            });

            it("view.formMode should be EDIT", function() {
                view.options.formMode.should.be.equal('EDIT');
            });

            describe("CreateFilterView - modify filter", function() {

                var save;
                beforeEach(function () {
                    save = sinon.stub(view.model, 'save');
                });

                afterEach(function () {
                    view.model.save.restore();
                });

                it("Filter should be modified correctly when ok button clicked (using mockjax)", function() {
                    var event = {
                         type: 'click',
                         preventDefault: function () {}
                    };

                    view.render();
                    $('#main-content').empty();
                    $('#main-content').append(view.$el);

                    $('#filter-name').val('custom filter');
                    $('#humanReadableFilterString').val('event-type = AAMW_ACTION_LOG');
                    $('#time-period').val('Last 30 minute(s)');
                    $('#tags').val('ALL EVENTS');
                    $('#start-time').val(1459757862659);
                    $('#end-time').val(1459759662659);
                    $('#filter-tags').val('firewall');
                    $('#duration').val(1800000);
                    $('#aggregation').val('none');
                    $('#time-unit').val(0);
                    $('#id').val(32877);

                    $.mockjax({
                          url: "/api/juniper/seci/filter-management/filters/32877",
                          type: 'PUT',
                          status: 200,
                          contentType: 'text/json',
                          dataType: 'json',
                          responseText: true
                    });

                    view.submit(event);
                    save.called.should.be.equal(true);
                });
            });
            describe("CreateFilterView - Modify Success Handler", function() {
                var submit, response = {};

                before(function() {
                    var filterData =  { "filter-name" : "custom filter", "id" : 32877, "formMode" : "EDIT"};
                    view.model.set(filterData);

                    $.mockjax({
                        url: "/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id=32877",
                        type: 'PUT'
                    });
                });

                it("Recent filters list should update once filter is saved correctly (using mockjax)", function() {
                    view.onSync(model, response);
                });
            });

        }); // Modify
	});
});