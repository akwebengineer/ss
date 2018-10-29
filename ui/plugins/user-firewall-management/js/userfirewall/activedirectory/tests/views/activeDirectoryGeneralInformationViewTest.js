/**
 * UT for active General Information View
 *
 * @module activeDirectoryGeneralInformationViewTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/activeDirectoryGeneralInformationView.js',
    'backbone.syphon'
], function (View, Syphon) {


    describe('General Information Form View UT', function () {
        var view, getMessage, values, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();
        before(function () {
            activity.context = context;
            activity.domainCollection = {where: function () {
                return [new Backbone.Model()]
            }};
            view = new View({
                activity: activity,
                context: context,
                rowData: {originalRow: {}},
                model: new Backbone.Model(),
                wizardView: {addRemoteNameValidation:function(){}}
            });
            getMessage = sinon.stub(context, 'getMessage', function (value) {
                return value;
            });
        });
        after(function () {
            getMessage.restore();
        });

        it('Checks if the view is created properly', function () {
            view.should.exist;
        });
        describe('render UT', function () {
            var updateModelWithDefaultVaule, updateFormElements, constructAddressLists, setModelAttributes;
            beforeEach(function(){
                updateModelWithDefaultVaule = sinon.stub(view, 'updateModelWithDefaultVaule');
                updateFormElements = sinon.stub(view, 'updateFormElements');
                constructAddressLists = sinon.stub(view, 'constructAddressLists');
                setModelAttributes = sinon.stub(view, 'setModelAttributes');

            });
            afterEach(function(){
                updateModelWithDefaultVaule.restore();
                updateFormElements.restore();
                constructAddressLists.restore();
                setModelAttributes.restore();
            });
            it('Checks render', function () {
                view.render();
                updateModelWithDefaultVaule.called.should.be.equal(true);
                updateFormElements.called.should.be.equal(true);
                constructAddressLists.called.should.be.equal(true);
                setModelAttributes.called.should.be.equal(true);
            });
        });

        describe('updateModelWithDefaultVaule UT', function () {
            it('Checks updateModelWithDefaultVaule', function () {
                view.wizardView.formMode = 'CREATE';
                view.updateModelWithDefaultVaule();
                view.model.get('authentication-time-out').should.be.equal(30);
            });
        });
        describe('updateFormElements UT', function () {
            it('Checks updateFormElements', function () {
                view.updateFormElements();
                getMessage.called.should.be.equal(true);
            });
        });
        describe('setModelAttributes UT', function () {
            it('Checks setModelAttributes', function () {

                var find = sinon.stub(view.$el, 'find', function(){
                    return {prop: function(){}, closest: function(){
                        return {toggleClass: function(){}}
                    }}
                });
                view.model.set( {
                    'include-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.model.set( {
                    'exclude-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.setModelAttributes();
                find.called.should.be.equal(true);
                find.restore();
            });
        });
        it('Checks getTitle', function () {
            view.getTitle().should.be.equal('');
        });
        describe('render UT', function () {
            it('Checks getSummary 0', function () {
                view.model.set( {
                    'include-filter-addresses':{
                        'address-reference': []
                    }});
                view.model.set( {
                    'exclude-filter-addresses':{
                        'address-reference': []
                    }});
                view.getSummary();
            });
            it('Checks getSummary 1', function () {
                view.model.set( {
                    'include-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.model.set( {
                    'exclude-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.getSummary().length.should.be.equal(12);
            });
            it('Checks getSummary 2', function () {
                view.model.set( {
                    'include-filter-addresses':{
                        'address-reference': [{id:123},{id:456}]
                    }});
                view.model.set( {
                    'exclude-filter-addresses':{
                        'address-reference': [{id:123},{id:456}]
                    }});

                view.getSummary().length.should.be.equal(12);
            });
        });
        describe('beforePageChange UT', function () {
            var isValidInput;

            afterEach(function(){
                isValidInput.restore();
            });
            it('Checks beforePageChange 0', function () {
                isValidInput = sinon.stub(view.formWidget, 'isValidInput', function(){return true;});
                view.beforePageChange().should.be.equal(true);
            });
            it('Checks beforePageChange 1', function () {
                isValidInput = sinon.stub(view.formWidget, 'isValidInput', function(){return false;});
                view.beforePageChange(2, 1).should.be.equal(true);
            });
            it('Checks beforePageChange 2', function () {
                isValidInput = sinon.stub(view.formWidget, 'isValidInput', function(){return false;});
                view.beforePageChange().should.be.equal(false);
            });
            it('Checks beforePageChange 3', function () {
                view.excludeAddressFetchTriggered = false;
                view.includeAddressFetchTriggered = false;
                view.excludeAddressListBuilder = {
                    getSelectedItems: function () {

                    }
                };
                view.includeAddressListBuilder = {
                    getSelectedItems: function () {

                    }
                };
                isValidInput = sinon.stub(view.formWidget, 'isValidInput', function(){return true;})
                var find = sinon.stub(view.$el, 'find', function(){return {prop: function(){return true;}};}),
                    includeAddressListBuilder = sinon.stub(view.includeAddressListBuilder, 'getSelectedItems'),
                    excludeAddressListBuilder = sinon.stub(view.excludeAddressListBuilder, 'getSelectedItems');
                view.beforePageChange().should.be.equal(false);
                find.called.should.be.equal(true);
                includeAddressListBuilder.called.should.be.equal(true);
                excludeAddressListBuilder.called.should.be.equal(true);
                find.restore();
                includeAddressListBuilder.restore();
                excludeAddressListBuilder.restore();
            });
        });
        describe('SelectedItemsSelectedCallBack UT', function () {
            var getAddressList, gotoPage;

            beforeEach(function(){
                view.wizardView = {
                    wizard: {
                        gotoPage: function(){

                        }
                    }
                };
                getAddressList =  sinon.stub(view, 'getAddressList');
                gotoPage = sinon.stub(view.wizardView.wizard, 'gotoPage');
            });
            afterEach(function(){
                getAddressList.restore();
                gotoPage.restore();
            });
            it('Checks getExcludeAddressSelectedItemsSelectedCallBack', function () {
                view.getExcludeAddressSelectedItemsSelectedCallBack();
                getAddressList.called.should.be.equal(true);
                gotoPage.called.should.be.equal(true);
            });

            it('Checks getIncludeAddressSelectedItemsSelectedCallBack', function () {
                view.getIncludeAddressSelectedItemsSelectedCallBack();
                getAddressList.called.should.be.equal(true);
                gotoPage.called.should.be.equal(true);
            });
        });
        describe('getFormData UT', function () {
            it('Checks getFormData', function () {
                _.isUndefined(view.getFormData()).should.be.equal(false);
            });
        });
        describe('getPageData UT', function () {
            var find, serialize;
            beforeEach(function(){
                find = sinon.stub(view.$el, 'find', function(){
                    return {prop: function(){ return true;}}
                });
                serialize = sinon.stub(Syphon, 'serialize', function(){
                    return {'authentication-time-out': "123", 'wmi-time-out' : "456"};
                });
            });
            afterEach(function(){
                find.restore();
                serialize.restore();
            });
            it('Checks getPageData 0 ', function () {
                _.isUndefined(view.getPageData()).should.be.equal(false);
                find.called.should.be.equal(true);
            });
            it('Checks getPageData 1', function () {
                view.wizardView.formMode = view.wizardView.MODE_EDIT;
                _.isUndefined(view.getPageData()).should.be.equal(false);
                find.called.should.be.equal(true);
            });

            it('Checks getPageData 1', function () {
                view.wizardView.formMode = view.wizardView.MODE_EDIT;

                view.getPageData();
                serialize.called.should.be.equal(true);
                find.called.should.be.equal(true);

            });


        });
        describe('getAddressList UT', function () {
            it('Checks getAddressList', function () {
                var returnVal = view.getAddressList({
                    addresses: {
                        address:[{name:'test', id:123}]
                    }
                });
                returnVal['address-reference'][0].name.should.be.equal('test');
                returnVal['address-reference'][0].id.should.be.equal(123);
            });
        });
        describe('addNewIncludeAddress UT', function () {
            it('Checks addNewIncludeAddress', function () {
                var addNewAddress = sinon.stub(view, 'addNewAddress');
                view.addNewIncludeAddress();
                addNewAddress.called.should.be.equal(true);
                addNewAddress.restore();
            });
        });
        describe('addNewExcludeAddress UT', function () {
            it('Checks addNewExcludeAddress', function () {
                var addNewAddress = sinon.stub(view, 'addNewAddress');
                view.addNewExcludeAddress();
                addNewAddress.called.should.be.equal(true);
                addNewAddress.restore();
            });
        });
        describe('addNewAddress UT', function () {
            var listBuilder = {refresh: function(){}, selectItems : function(){}};
            it('Checks addNewAddress', function () {
                var startActivityForResult = sinon.stub(view.context, 'startActivityForResult', function(val1, val2){
                    val2();
                });
                var refresh = sinon.stub(listBuilder, 'refresh', function(val){
                    val();
                });
                var selectItems = sinon.stub(listBuilder, 'selectItems');
                view.addNewAddress(listBuilder);
                startActivityForResult.called.should.be.equal(true);
                refresh.called.should.be.equal(true);
                selectItems.called.should.be.equal(true);
                selectItems.restore();
                startActivityForResult.restore();
                refresh.restore();
            });
        });
        describe('constructAddressLists UT', function () {
            it('Checks constructAddressLists', function () {
                view.constructAddressLists();
                view.includeAddressListBuilder.should.exist;
                view.excludeAddressListBuilder.should.exist;
            });
        });

        describe('getSelectedItems UT', function () {
            it('Checks getSelectedItems', function () {
                view.model.set( {
                    'include-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.model.set( {
                    'exclude-filter-addresses':{
                        'address-reference': [{id:123}]
                    }});
                view.getSelectedItems('include-filter-addresses').length.should.be.equal(1);
            });
        });
        describe('handleChangeEvent UT', function () {
            var find;
            beforeEach(function(){
                find = sinon.stub(view.$el, 'find', function(){
                    return {closest: function(){
                        return {toggleClass: function(){

                        }}
                    }}
                });
            });
            afterEach(function(){
                find.restore();
            });
            it('Checks handleChangeEvent 1', function () {
                view.handleChangeEvent({target: {id: 'active_directory_include_address_enable'}});
                find.called.should.be.equal(true);
            });
            it('Checks handleChangeEvent 2', function () {
                view.handleChangeEvent({target: {id: 'active_directory_exclude_address_enable'}});
                find.called.should.be.equal(true);
            });
        });


    });
});