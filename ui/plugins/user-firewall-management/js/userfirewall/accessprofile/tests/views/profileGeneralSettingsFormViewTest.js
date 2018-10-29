/**
 * UT for Access Profile GeneralSettings form View
 *
 * @module profileGeneralSettingsFormViewTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/profileGeneralSettingsFormView.js',
    '../../models/accessProfileModel.js'
], function (View, Model ) {

    var view,  getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Access Profile General Settings Form view UT', function () {

        before(function () {

            activity.context = context;
            view = new View({
                wizardView: {addRemoteNameValidation:function(){}},
                context:context

            });
            view.model = new Model();
            view.model.set({'ldap-servers':{'ldap-server':[{id:123, address: 'test'},{},{}]}});
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile General Settings Form view object is created properly', function () {
            view.should.exist;
        });

        describe('Access Profile General Settings Form view UT ', function () {
            var authenticationOrderChangeHandler, getGeneralSettingsFormData;
            before(function () {
                authenticationOrderChangeHandler = sinon.stub(view, 'authenticationOrderChangeHandler');
                getGeneralSettingsFormData = sinon.stub(view, 'getGeneralSettingsFormData');
            });

            after(function () {
                authenticationOrderChangeHandler.restore();
                getGeneralSettingsFormData.restore();
            });
            var conf = {title:'Test'};
            it('Checks render with create mode', function () {
                view.render(conf);
                authenticationOrderChangeHandler.called.should.be.equal(true);
                getGeneralSettingsFormData.called.should.be.equal(true);
                view.formWidget.should.exist;
                view.ldapServerGridView.should.exist;
            });
            it('Checks render with edit mode', function () {
                view.render(conf);
                authenticationOrderChangeHandler.called.should.be.equal(true);
                getGeneralSettingsFormData.called.should.be.equal(true);
            });
        });
        describe('Access Profile General Settings Form view UT ', function () {
            var authenticationOrderChangeHandler;
            before(function () {
                authenticationOrderChangeHandler = sinon.stub(view, 'authenticationOrderChangeHandler')
            });

            after(function () {
                authenticationOrderChangeHandler.restore();
            });
            it('Checks authenticationOrderOnChange', function () {
                view.authenticationOrderOnChange({target:{value:true}});
                authenticationOrderChangeHandler.called.should.be.equal(true);
            });

        });
        describe('Access Profile General Settings Form view UT with validForm', function () {

            it('Checks getGeneralSettingsFormData', function () {
                var resp = view.getGeneralSettingsFormData();
                resp['authentication_order1'].id.should.be.equal("NONE");
                resp['authentication_order1'].text.should.be.equal("NONE");
            });

        });

        describe('Access Profile General Settings Form view UT with inValidForm', function () {
            var authenticationOrderChangeHandler, addGridData;
            before(function () {
                authenticationOrderChangeHandler = sinon.stub(view, 'authenticationOrderChangeHandler');
                addGridData = sinon.stub(view.ldapServerGridView, 'addGridData');
            });

            after(function () {
                authenticationOrderChangeHandler.restore();
                addGridData.restore();
            });
            it('Checks updateGeneralSettingsFormData', function () {
                view.updateGeneralSettingsFormData();
                authenticationOrderChangeHandler.called.should.be.equal(true);
                authenticationOrderChangeHandler.args[0][0].should.be.equal("NONE");
                addGridData.called.should.be.equal(true);
                addGridData.args[0][0][0].id.should.be.equal(123);
            });

        });

        describe('Access Profile General Settings Form view UT with validForm', function () {

            it('Checks authenticationOrderChangeHandler with LDAP', function () {
                view.authenticationOrderChangeHandler("LDAP");
                view.$el.find('.access_profile_authentication_order2').prop('style')['display'].should.be.equal('block');
            });
            it('Checks authenticationOrderChangeHandler with PASSWORD', function () {
                view.authenticationOrderChangeHandler("PASSWORD");
                view.$el.find('.access_profile_authentication_order2').prop('style')['display'].should.be.equal('block');
            });
            it('Checks authenticationOrderChangeHandler with NONE', function () {
                view.authenticationOrderChangeHandler("NONE");
                view.$el.find('.access_profile_authentication_order2').prop('style')['display'].should.be.equal('none');
            });

        });

        describe('Access Profile General Settings Form view UT', function () {

            it('Checks getTitle', function () {
                view.getTitle().should.be.equal('access_profile_general_setting_title');
                getMessage.called.should.be.equal(true);
            });

        });

        describe('Access Profile General Settings Form view UT', function () {

            it('Checks getSummary', function () {
                view.model.set({name: "test", 'authentication-order1': true, 'authentication-order2': false});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('access_profile_general_setting_title');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('access_profile_name');
                resp[1].value.should.be.equal('test');
                resp[2].label.should.be.equal('access_profile_authentication_order1');
                resp[2].value.should.be.equal(true);
                resp[3].label.should.be.equal('access_profile_authentication_order2');
                resp[3].value.should.be.equal(false);
                resp[4].label.should.be.equal('access_profile_ldap_server_title');
                resp[4].value.should.be.equal("test (+2)");
            });

            it('Checks getSummary', function () {
                view.model.set({name: "test", 'authentication-order1': true, 'authentication-order2': false, 'ldap-servers':{'ldap-server':[{address: "test"}]}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('access_profile_general_setting_title');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('access_profile_name');
                resp[1].value.should.be.equal('test');
                resp[2].label.should.be.equal('access_profile_authentication_order1');
                resp[2].value.should.be.equal(true);
                resp[3].label.should.be.equal('access_profile_authentication_order2');
                resp[3].value.should.be.equal(false);
                resp[4].label.should.be.equal('access_profile_ldap_server_title');
                resp[4].value.should.be.equal("test");
            });


        });

        describe('Access Profile General Settings Form view UT with validForm', function () {

            var getAllVisibleRows;
            before(function () {
                getAllVisibleRows = sinon.stub(view.ldapServerGridView, 'getAllVisibleRows', function(){return [];});
            });

            after(function () {
                getAllVisibleRows.restore();
            });

            it('Checks beforePageChange', function () {
                view.model.set({'authentication-order1': 'NONE'});
                view.beforePageChange().should.be.equal(false);
                getAllVisibleRows.called.should.be.equal(true);
            });
        });

        describe('Access Profile General Settings Form view UT with in validForm', function () {
            var isValidInput;
            before(function () {
                isValidInput = sinon.stub(view.formWidget, 'isValidInput', function(){return false;})
            });

            after(function () {
                isValidInput.restore();
            });
            it('Checks beforePageChange', function () {
                view.beforePageChange(3, 1).should.be.equal(true);
                isValidInput.called.should.be.equal(false);
            });
            it('Checks beforePageChange', function () {
                view.beforePageChange().should.be.equal(false);
                isValidInput.called.should.be.equal(true);
            });

        });

    });
});