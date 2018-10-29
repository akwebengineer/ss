/**
 * UT for user Fw Device List Builder form View
 *
 * @module userFwDeviceListBuilderTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/userFwDeviceListBuilder.js'
], function (View, Model ) {

    var view,  getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Device List Builder Form view UT', function () {

        before(function () {

            activity.context = context;
            view = new View({
                context: context,
                container: this.el
            });
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Device List Builder Form view object is created properly', function () {
            view.should.exist;
            view.listBuilderModel.should.exist;
        });
        describe('Device List Builder Form view UT', function () {
            var getInitialFilterParameter, handleFilter;
            before(function () {
                getInitialFilterParameter = sinon.stub(view, 'getInitialFilterParameter');
                handleFilter = sinon.stub(view, 'handleFilter');
            });
            after(function () {
                getInitialFilterParameter.restore();
                handleFilter.restore();
            });
            it('Checks addDynamicFormConfig 0', function () {
                var element = {
                    availableElements:{urlParameters:""},
                    selectedElements:{urlParameters:""},
                    search:{url:""}};
                view.addDynamicFormConfig(element);
                getInitialFilterParameter.called.should.be.equal(true);
                element.search.url({}, []);
                handleFilter.called.should.be.equal(true);
            });
        });

        describe('Device List Builder Form view UT', function () {
            var getInitialFilterParameter, handleFilter;
            before(function () {
                getInitialFilterParameter = sinon.stub(view, 'getInitialFilterParameter');
                handleFilter = sinon.stub(view, 'handleFilter');
            });
            after(function () {
                getInitialFilterParameter.restore();
                handleFilter.restore();
            });
            it('Checks addDynamicFormConfig 1', function () {
                var element = {
                    availableElements:{urlParameters:""},
                    selectedElements:{urlParameters:""},
                    search:{url:""}};
                view.addDynamicFormConfig(element);
                getInitialFilterParameter.called.should.be.equal(true);
                element.search.url({_search:"test"}, null);
                handleFilter.called.should.be.equal(false);
            });
        });

        describe('Device List Builder Form view UT', function () {
            var getInitialFilterParameter, handleFilter;
            before(function () {
                getInitialFilterParameter = sinon.stub(view, 'getInitialFilterParameter');
                handleFilter = sinon.stub(view, 'handleFilter');
            });
            after(function () {
                getInitialFilterParameter.restore();
                handleFilter.restore();
            });
            it('Checks addDynamicFormConfig 2', function () {
                var element = {
                    availableElements:{urlParameters:""},
                    selectedElements:{urlParameters:""},
                    search:{url:""}};
                view.addDynamicFormConfig(element);
                getInitialFilterParameter.called.should.be.equal(true);
                element.search.url({}, "test");
                handleFilter.called.should.be.equal(false);
            });
        });

        describe('Device List Builder Form view UT', function () {
            var addDynamicFormConfig;
            before(function () {
                addDynamicFormConfig = sinon.stub(view, 'addDynamicFormConfig');
            });
            after(function () {
                addDynamicFormConfig.restore();
            });
            it('Checks initListBuilderConf', function () {
                view.initListBuilderConf();
                addDynamicFormConfig.called.should.be.equal(true);
            });

        });

        describe('Device List Builder Form view UT', function () {
            var getFilterUrl;
            before(function () {
                getFilterUrl = sinon.stub(view, 'getFilterUrl', function(value){return value;});
            });
            after(function () {
                getFilterUrl.restore();
            });
            it('Checks getInitialFilterParameter', function () {
                var res = view.getInitialFilterParameter();
                res[0].modifier.should.be.equal("ne");
                res[0].property.should.be.equal("deviceType");
                res[0].value.should.be.equal("LSYS");
                getFilterUrl.called.should.be.equal(true);
            });

        });

        describe('Device List Builder Form view UT', function () {
            var getFilterUrl;
            before(function () {
                getFilterUrl = sinon.stub(view, 'getFilterUrl', function(value){return value;});
            });
            after(function () {
                getFilterUrl.restore();
            });
            it('Checks handleFilter', function () {
                view.handleFilter();
                getFilterUrl.called.should.be.equal(true);
            });

        });
    });
});