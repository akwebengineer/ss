/**
 * Unit test file for Create/Edit Alert Definition view
 *
 * @module alertDefinition
 * @author shinig <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    "../../../alerts/js/models/alertDefinitionModel.js",
    "../../../alerts/js/views/alertDefinitionCreateView.js",
    "../../../alerts/js/service/alertDefinitionService.js",
    "../../../ui-common/js/common/utils/filterUtil.js",
    '../../../ui-common/js/views/apiResourceView.js',
    '../../../sd-common/js/common/widgets/timePicker/timePickerWidget.js',
    '../../../alerts/js/widgets/filterpicker/filterPickerWidget.js',
    '../../../ui-common/js/common/utils/filterGridConfig.js'
    ], function(AlertDefModel, AlertDefView, AlertDefService, FilterUtil, ResourceView, TimePickerWidget, FilterPickerWidget, FilterGridConfig) {

    describe("Unit test cases for the files included in Alert Definition view", function() {

        var context, view, intent, model, stub, save,
            event = {
                 type: 'click',
                 preventDefault: function () {}
            };

        before(function() {
            activity = new Slipstream.SDK.Activity();

            context = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });

            context.getMessage = function (key) {
                return key; // return as per requirement
            }

            $.mockjax({
                url: "/api/space/user-management/users",
                type: 'GET',
                responseText: {"users":{"user": [{"@key":"1032","name":"super","primaryEmail":"super@juniper.net","firstName":"Open","lastName":"Space","roleType":"ALL_ACCESS"}]}}
            });

        });

        after(function() {
            context.restore();
        });


        describe("Alert Definition View unit tests", function() {

            before(function(){
                model = new AlertDefModel();
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
                });
                view = new AlertDefView({
                    activity: activity,
                    model: model,
                    service: new AlertDefService(),
                    util: new FilterUtil()
                });
            });

            after(function() {
                intent.restore();
            });

            it("AlertDefinitionModel model exists ?", function() {
                model.should.exist;
            });

            it("alertDefinition view exists ?", function() {
                view.should.exist;
            });

            it("alertDefinition view rendered ?", function() {
                var createEmailDropDownWidget   = sinon.stub(view, "createEmailDropDownWidget", function() { return true;}),
                    showOrHideSections          =  sinon.stub(view, "showOrHideSections", function() {return true;});
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);

                $('#name').val("Alert Definition Test");
                $('#description').val("Test");
                $('#status').val(true);
                $('#severity').val("1");
                $('#custom-message').val("test");
                $('#filter-string').val("");
                $('#additional-emails').val("super@juniper.net");
                $('#threshhold').val("11");

                createEmailDropDownWidget.calledOnce.should.be.equal(true);
                showOrHideSections.calledOnce.should.be.equal(true);

                createEmailDropDownWidget.restore();
                showOrHideSections.restore();
            });

            it("view.formMode should be CREATE", function() {
                view.formMode.should.be.equal('CREATE');
            });

            it("view.form should exist", function() {
                view.form.should.exist;
            });

            it("create alert Definition overlay should be destroyed when Cancel button clicked", function() {
                view.activity.overlay = {destroy: function(){console.log('destroyed');}}
                sinon.spy(view.activity.overlay, "destroy");

                view.cancel(event);
                view.activity.overlay.destroy.calledOnce.should.be.equal(true);
            });

            it("Error info should be shown if form is invalid when Alert Definition form Submits", function() {
                var isValidInput = sinon.stub(view.form, "isValidInput", function() { return false;});
                view.submit(event);

                isValidInput.calledOnce.should.be.equal(true);
                isValidInput.restore();
            });

            describe("Create Alert Definition - Form Valid check(submit)", function() {
                var  getValue, getValues, isValidInput;

                beforeEach(function () {
                    isValidInput = sinon.stub(view.form, "isValidInput", function() { return true;});
                    getValue = sinon.stub(view.groupByDropDown, "getValue", function() { return "none";});
                    getValues = sinon.stub(timePickerWidget, "getValues", function() { return {"duration": 86400000, "duration-unit": 0}; });
                });

                afterEach(function () {
                    isValidInput.restore();
                    getValue.restore();
                    getValues.restore();
                });

                it("model.save() should be called if form is valid", function() {
                    view.submit(event);
                    isValidInput.calledOnce.should.be.equal(true);
                });


                it("Returns false if aggregation is 'none' after reading form values", function() {

                    $.mockjax({
                        url: "/api/juniper/seci/alertdefinition-management/alert-definitions/",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    view.submit(event);
                    isValidInput.calledOnce.should.be.equal(true);
                    getValue.called.should.be.equal(true);
                    getValues.called.should.be.equal(true);
                });
            });
            //

            describe("Create Alert Definition - if form is inValid", function() {
                var isValidInput, getValue, getValues, filterWidget, filterWidgetSpy;

                beforeEach(function() {
                    isValidInput = sinon.stub(view.form, "isValidInput", function() { return true;}),
                    getValue = sinon.stub(view.groupByDropDown, "getValue", function() { return "application";}),
                    getValues = sinon.stub(timePickerWidget, "getValues", function() { return {"duration": 86500000, "duration-unit": 0}; }),
                    filterWidget = {getFilterString: function(){console.log('filterWidget');}};
                    filterWidgetSpy = sinon.spy(filterWidget, "getFilterString", function() { return "event-category = antispam"});
                });

                afterEach(function() {
                    isValidInput.restore();
                    getValue.restore();
                    getValues.restore();
                    filterWidgetSpy.restore();
                });


                it("Returns false if duration greater than 86400000 after reading form values", function() {
                    $.mockjax({
                        url: "/api/juniper/seci/alertdefinition-management/alert-definitions/",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    view.submit(event);
                    isValidInput.calledOnce.should.be.equal(true);
                    getValue.called.should.be.equal(true);
                    getValues.called.should.be.equal(true);
                    filterWidget.getFilterString.calledOnce.should.be.equal(false);
                });
            });
            //

            describe("Create Alert Definition Form is Valid, save the input values to model", function() {
                var set, getFilters, showLoadingMask, getValue, getValues, getFilterString, getFilters, isValidInput;
                
                beforeEach(function () {
                    save = sinon.stub(view.model, 'save');
                    set = sinon.stub(view.model, 'set');
                    isValidInput = sinon.stub(view.form, "isValidInput", function() { return true;});
                    getValue = sinon.stub(view.groupByDropDown, "getValue", function() { return "event-category";});
                    getFilterString = sinon.stub(view.filterWidget, "getFilterString", function() { return "event-category = antispam";});
                    getFilters = sinon.stub(view.filterWidget, "getFilters", function() { return true;});
                    showLoadingMask = sinon.stub(spinner, "showLoadingMask", function() { console.log("Spinner loaded"); });
                    getValues = sinon.stub(timePickerWidget, "getValues", function() { return {"duration": 3600000, "duration-unit": 0}; });
                });

                afterEach(function () {
                    view.model.save.restore();
                    view.model.set.restore();
                    isValidInput.restore();
                    getValue.restore();
                    getFilterString.restore();
                    getFilters.restore();
                    showLoadingMask.restore();
                    getValues.restore();
                });
                /*commented due to UT error
                it("Alert Definition should be saved correctly when ok button clicked (using mockjax)", function() {

                  $.mockjax({
                        url: "/api/juniper/seci/alertdefinition-management/alert-definitions/",
                        type: 'POST',
                        status: 200,
                        contentType: 'text/json',
                        dataType: 'json',
                        responseText: true
                    });

                    view.submit(event);
                    isValidInput.calledOnce.should.be.equal(true);
                    set.called.should.be.equal(true);
                    save.called.should.be.equal(true);
                    getValue.called.should.be.equal(true);
                    getFilterString.called.should.be.equal(true);
                    getFilters.called.should.be.equal(true);
                    showLoadingMask.called.should.be.equal(false);
                    getValues.called.should.be.equal(true);
                });*/
            });
            //

            describe("Call createEmailDropDownWidget", function() {
                var getUsers;

                beforeEach(function() {
                    //getUsers = sinon.stub(view.service, "getUsers", function() { return true;});
                });

                afterEach(function(){
                    //getUsers.restore();
                });

                it("Fetch users from api and load dropdown widget", function() {
                    view.createEmailDropDownWidget();
                    //getUsers.called.should.be.equal(true);

                });
            });


            /*it("Call showFilter to display all the available filters", function() {
                view.showFilter(event);
            });*/

            it("call addDynamicFormConfig, to set the form title on - CREATE Mode", function(){
                var formConfiguration = {
                        "add_remote_name_validation" : "alert-definition-name",
                        "buttonsAlignedRight" : true,
                        "err_div_id" : "errorDiv",
                        "form_id" : "sd_alert_definition_form_id",
                        "form_name" : "sd_alert_definition_form_id",
                        "on_overlay" :  true
                };

                view.addDynamicFormConfig(formConfiguration);
            });

            it("call modifyForm, to explicitly set the values on edit mode ", function() {
                var filterWidget = {addFilterTokens: function(){console.log('filterWidget');}},
                    filterString = "event-category = antispam",
                    severityData =  { "severity" : "1"},
                    sectionData = {
                        "alertcriteria" : {
                            "aggregation"   : "application",
                            "duration"      : "3600000",
                            "duration-unit" : "1",
                            "filter-string" : "event-category = antispam",
                            "threshhold"    : "11",
                            "formatted-filter": ""
                        }
                    };
                view.model.set(severityData);
                view.model.set(sectionData);
                sinon.spy(filterWidget, "addFilterTokens", function(filterString) {return true;});
                view.modifyForm();
                filterWidget.addFilterTokens.calledOnce.should.be.equal(false);
            });

            it("call populateDataCriteria, read selected filter and insert value to section", function() {
                var filterWidget = {removeFilters: function(){console.log('filterWidget');}},
                    removeFilters, selectedFilter = {
                        "0": {
                            "aggregation" : "destination-address",
                            "duration" : "10800000",
                            "filter-description" : "Top Destination IPs By Count",
                            "filter-name" : "Top Destination IPs",
                            "filter-string" : "event-type = RT_FLOW_SESSION_CLOSE,RT_FLOW_SESSION_CREATE,RT_FLOW_SESSION_DENY",
                            "id" : "266",
                            "time-unit" : "1"
                        }
                    };

                sinon.spy(filterWidget, "removeFilters");
                view.populateDataCriteria(selectedFilter);
                filterWidget.removeFilters.calledOnce.should.be.equal(false);
            });

        });

        describe("Alert Definition Modify unit tests", function() {

            before(function(){
                model = new AlertDefModel();
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EDIT);
                });
                view = new AlertDefView({
                    activity: activity,
                    model: model,
                    service: new AlertDefService(),
                    util: new FilterUtil()
                });
            });

            after(function(){
                intent.restore();
            });

            it("view.formMode should be EDIT", function() {
                view.formMode.should.be.equal('EDIT');
            });

            it("call addDynamicFormConfig, to set the form title on - EDIT Mode ", function() {
                var formConfiguration = {
                        "add_remote_name_validation" : "alert-definition-name",
                        "buttonsAlignedRight" : true,
                        "err_div_id" : "errorDiv",
                        "form_id" : "sd_alert_definition_form_id",
                        "form_name" : "sd_alert_definition_form_id",
                        "on_overlay" :  true
                };

                view.addDynamicFormConfig(formConfiguration);
            });

        });

        describe("Alert Definition Clone unit tests", function() {

            before(function(){
                model = new AlertDefModel();
                intent = sinon.stub(activity, 'getIntent', function() {
                    return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CLONE);
                });
                view = new AlertDefView({
                    activity: activity,
                    model: model
                });
            });

            after(function(){
                intent.restore();
            });

            it("view.formMode should be CLONE", function() {
                view.formMode.should.be.equal('CLONE');
            });


            it("call addDynamicFormConfig, to set the form title on - CLONE Mode ", function() {
                var formConfiguration = {
                        "add_remote_name_validation" : "alert-definition-name",
                        "buttonsAlignedRight" : true,
                        "err_div_id" : "errorDiv",
                        "form_id" : "sd_alert_definition_form_id",
                        "form_name" : "sd_alert_definition_form_id",
                        "on_overlay" :  true
                };
                view.addDynamicFormConfig(formConfiguration);

            });

        });

        describe("Time Picker Widget unit tests", function() {

            before(function(){
               var  timePickerContainer = $('#main-content'),
                    timePickerWidget = new TimePickerWidget({
                        "container": timePickerContainer,
                        "units": [
                            TimePickerWidget.repeatUnits.MINUTES,
                            TimePickerWidget.repeatUnits.HOURS
                        ]
                    });
            });

            after(function(){

            });

            it("Time Picker Widget Build, in the given container", function() {
                var widget;
                widget = timePickerWidget.build();
                assert(typeof widget === "object");
            });

            it("getValues from the Time Picker Widget" , function(){
                var timeSpan;
                timeSpan = timePickerWidget.getValues();
                timeSpan["duration"].should.be.equal(3600000);
                timeSpan["duration-unit"].should.be.equal('1');
            });

            it("call setValues from Time Picker Widget", function() {
                var setVal, conf = {
                    "duration-unit" :1 ,
                    "duration": 10
                };
                setVal = timePickerWidget.setValues(conf);
            });

        });


        describe("Filter Util unit tests", function() {
            var duration_unit   = 0,
                duration        = 600000;

            before(function(){
                var filterUtil = new FilterUtil()
            });

            after(function(){

            });

            it("Get the time duration for unit 0 (Minutes) - getDurationBasedOnUnit", function() {
                var timePeriod;
                timePeriod = filterUtil.getDurationBasedOnUnit(duration_unit, duration);
                timePeriod.should.be.equal(10)
            });

            it("Get the time duration for unit 1 (Hours) - getDurationBasedOnUnit", function() {
                var timePeriod, duration_unit1   = 1, duration1 = 86400000;
                timePeriod = filterUtil.getDurationBasedOnUnit(duration_unit1, duration1);
                timePeriod.should.be.equal(24)
            });

            it("Get the time duration for unit 2 (Days)- getDurationBasedOnUnit", function() {
                var timePeriod, duration_unit2   = 2, duration2 = 864000000;
                timePeriod = filterUtil.getDurationBasedOnUnit(duration_unit2, duration2);
                timePeriod.should.be.equal(10)
            });

            it("Get the time duration for unit 3 (Weeks)- getDurationBasedOnUnit", function() {
                var timePeriod, duration_unit3   = 3, duration3 = 604800000;
                timePeriod = filterUtil.getDurationBasedOnUnit(duration_unit3, duration3);
                timePeriod.should.be.equal(1)
            });

            it("Get the time duration for unit 4 (Months) - getDurationBasedOnUnit", function() {
                var timePeriod, duration_unit4   = 4, duration4 = 2628000000;
                timePeriod = filterUtil.getDurationBasedOnUnit(duration_unit4, duration4);
                timePeriod.should.be.equal(1)
            });


            it("Return duration in milli seconds for unit 0 (Minutes)- getDurationInMS" , function(){
                var ms, duration = 10;
                ms = filterUtil.getDurationInMS(duration, duration_unit);
                ms.should.be.equal(600000);
            });

            it("Return duration in milli seconds for unit 1 (Hours)- getDurationInMS" , function(){
                var duration_unit1   = 1, duration1 = 24, ms;
                ms = filterUtil.getDurationInMS(duration1, duration_unit1);
                ms.should.be.equal(86400000);
            });

            it("Return duration in milli seconds for unit 2 (Days)- getDurationInMS" , function(){
                var  duration_unit2   = 2, duration2 = 10, ms;
                ms = filterUtil.getDurationInMS(duration2, duration_unit2);
                ms.should.be.equal(864000000);
            });

            it("Return duration in milli seconds for unit 3 (Weeks) - getDurationInMS" , function(){
                var  duration_unit3   = 3, duration3 = 1, ms;
                ms = filterUtil.getDurationInMS(duration3, duration_unit3);
                ms.should.be.equal(604800000);
            });

            it("Return duration in milli seconds for unit 4 (Months) - getDurationInMS" , function(){
                var  duration_unit4   = 4, duration4 = 1, ms;
                ms = filterUtil.getDurationInMS(duration4, duration_unit4);
                ms.should.be.equal(2628000000);
            });

            it("convert the milli seconds to equivalent minutes, hours, days etc.-  millisToDaysHoursMinutes", function() {
                var duration2 = 2628060000, returnVal;
                returnVal = filterUtil.millisToDaysHoursMinutes(duration2);
                returnVal.should.be.equal("4 week(s) 2 day(s) 10 hour(s) 1 minute(s) ");
            });

            it("convert milli seconds to find the exact unit - convertMS", function(){
                var ms;
                ms = filterUtil.convertMS(duration);
                ms.should.be.equal("0.0.10.0.0");
            });

            it("find the time span from milli seconds - getTimeSpanFromMS", function(){
                var returnVal, duration = 2628060000;
                returnVal = filterUtil.getTimeSpanFromMS(duration);
                returnVal["duration"].should.be.equal("4");
                returnVal["unit"].should.be.equal(3);
            });

            it("find the accurate time span - preciseTimeSpan", function(){
                var returnVal;
                returnVal = filterUtil.preciseTimeSpan(duration_unit, duration);
                returnVal["duration"].should.be.equal('10');
                returnVal["unit"].should.be.equal(0);
            });

            it("Return the object map of lcKey  - using getLCKeyObjectMap ", function() {
                var objectMap;
                objectMap = filterUtil.getLCKeyObjectMap(context);
                assert(typeof objectMap === "object");
                objectMap["action"].should.be.equal("lc-action");
            });

            it("Return teh filter string into human readable - using formatFilterStringToHumanReadableString", function() {
                var returnVal, filterStr = "event-category = antispam";
                returnVal = filterUtil.formatFilterStringToHumanReadableString(filterStr, context);
                returnVal.should.be.equal("lc-event-category = antispam");
            });

        });


        describe("FilterPickerWidget Unit tests", function() {

            var filterPickerWidget;
            before(function(){
                filterPickerWidget = new FilterPickerWidget({
                context : context
                });

                $.mockjax({
                    url: "/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true",
                    type: 'GET',
                    responseText: { "event-filters": {
                        "event-filter":[
                              {"id":32871,"filter-name":"custom filter","moid":"net.juniper.jnap.seci.eventcollector.jpa.EventFilter:32871","filter-string":"event-type = AAMW_ACTION_LOG","filter-description":"custom filter","formatted-filter":{"case-sensitive":false,"and":[{"case-sensitive":false,"filter":{"key":"event-type","operator":"EQUALS","value":["AAMW_ACTION_LOG"]}}]},"created-by-user-name":"super","last-modified-time":1459779566000,"duration":1800000,"conditions":{"condition":[]},"aggregation":"none","time-unit":0,"uri":"/api/juniper/seci/filter-management/filters/all-filters/32871","href":"/api/juniper/seci/filter-management/my-filter/32871"},
                              {"id":189,"filter-name":"custom-filter","moid":"net.juniper.jnap.seci.eventcollector.jpa.EventFilter:189","filter-string":"event-type = RT_FLOW_SESSION_CLOSE","filter-description":"custom-filter","formatted-filter":{"case-sensitive":false,"and":[{"case-sensitive":false,"filter":{"key":"event-type","operator":"EQUALS","value":["RT_FLOW_SESSION_CLOSE"]}}]},"created-by-user-name":"super","last-modified-time":1457022617000,"duration":174600000,"conditions":{"condition":[]},"aggregation":"event-type","time-unit":0,"uri":"/api/juniper/seci/filter-management/filters/all-filters/189","href":"/api/juniper/seci/filter-management/my-filter/189"}
                        ],
                        "uri":"/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true",
                        "total":2
                        }
                    }
                });

            });

            after(function() {

            });

            it("check filterPickerWidget is rendered - render()", function(){
                var widget;

                widget = filterPickerWidget.render();
                assert(typeof widget === "object");
                widget.formWidget.should.exist;
                widget.gridWidget.should.exist;
            });

            it("get the selected filter from the grid - getSelectedFilters", function(){
            var filter;
                filter = filterPickerWidget.getSelectedFilters();
                assert(typeof filter === "object");
            });

        });

        describe("FilterGridConfig Unit tests", function() {

            var filterConfig,
                rowObject = {
                    "duration":261000000,
                    "filter-name":"custom filter",
                    "id":425999,
                    "time-unit":2
                };
            before(function(){
                filterConfig = new FilterGridConfig(context);

                $.mockjax({
                    url: "/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true",
                    type: 'GET',
                    responseText: { "event-filters": {
                        "event-filter":[
                              {"id":32871,"filter-name":"custom filter","moid":"net.juniper.jnap.seci.eventcollector.jpa.EventFilter:32871","filter-string":"event-type = AAMW_ACTION_LOG","filter-description":"custom filter","formatted-filter":{"case-sensitive":false,"and":[{"case-sensitive":false,"filter":{"key":"event-type","operator":"EQUALS","value":["AAMW_ACTION_LOG"]}}]},"created-by-user-name":"super","last-modified-time":1459779566000,"duration":1800000,"conditions":{"condition":[]},"aggregation":"none","time-unit":0,"uri":"/api/juniper/seci/filter-management/filters/all-filters/32871","href":"/api/juniper/seci/filter-management/my-filter/32871"},
                              {"id":189,"filter-name":"custom-filter","moid":"net.juniper.jnap.seci.eventcollector.jpa.EventFilter:189","filter-string":"event-type = RT_FLOW_SESSION_CLOSE","filter-description":"custom-filter","formatted-filter":{"case-sensitive":false,"and":[{"case-sensitive":false,"filter":{"key":"event-type","operator":"EQUALS","value":["RT_FLOW_SESSION_CLOSE"]}}]},"created-by-user-name":"super","last-modified-time":1457022617000,"duration":174600000,"conditions":{"condition":[]},"aggregation":"event-type","time-unit":0,"uri":"/api/juniper/seci/filter-management/filters/all-filters/189","href":"/api/juniper/seci/filter-management/my-filter/189"}
                        ],
                        "uri":"/api/juniper/seci/filter-management/filters/all-filters?skip-empty=true",
                        "total":2
                        }
                    }
                });

            });

            after(function() {

            });

            it("Call getValues from Filter Grid Config", function(){
                var values, isSingleSelect = true;
                values = filterConfig.getValues(isSingleSelect);
                assert(typeof values === "object");
                values["singleselect"].should.be.equal(false)
            });

            it("Return toolTip for the cellValue - addToolTip()", function(){
                var cellValue = "Top Applications Blocked", returnVal;
                returnVal = filterConfig.addToolTip(cellValue);
                assert(typeof returnVal === "string");
            });

            it("return formatted Filter String - formatFilterString()", function(){
                var cellValue = "dst-country-name = Angola", returnVal;
                returnVal = filterConfig.formatFilterString(cellValue);
                assert(typeof returnVal === "string");
            });

            it("call  getTimeSpanString from filter grid config", function(){
                var cellValue = "261000000", returnVal, options = "";
                returnVal = filterConfig.getTimeSpanString(cellValue, options, rowObject);
                assert(typeof returnVal === "string");
                returnVal.should.be.equal("Last 3 day(s) 30 minute(s) ");
            });

            it("Call formatAggregation from filter grid config", function(){
                var cellValue = "application", options, returnVal;
                returnVal = filterConfig.formatAggregation(cellValue, options, rowObject);
                assert(typeof returnVal === "string");
            });

        });
    });

});

