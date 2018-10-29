/**
 * UT for Access Profile GeneralSettings form View
 *
 * @module profileGeneralSettingsFormViewTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/profileLdapOptionsFormView.js',
    '../../models/accessProfileModel.js'
], function (View, Model ) {

    var view,  getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();


    describe('Access Profile LDAP Options Form view UT', function () {

        before(function () {

            activity.context = context;
            view = new View({
                wizardView: {addRemoteNameValidation: function () {
                }},
                context: context

            });
            view.model = new Model();
            view.model.set({'ldap-options': {'revert-interval':0}});
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile LDAP Options Form view object is created properly', function () {
            view.should.exist;
        });
        describe('Access Profile LDAP Options Form view UT', function () {
            var initializeLdapOptionsFormData;
            before(function () {
                initializeLdapOptionsFormData = sinon.stub(view, 'initializeLdapOptionsFormData');
            });
            after(function () {
                initializeLdapOptionsFormData.restore();
            });
            it('Checks render', function () {
                view.render();
                initializeLdapOptionsFormData.called.should.be.equal(true);
            });
        });

        describe('Access Profile LDAP Options Form view UT', function () {
            var assembleActionHandler, adminSearchActionHandler, updateLdapOptionsFormData;
            before(function () {
                assembleActionHandler = sinon.stub(view, 'assembleActionHandler');
                adminSearchActionHandler = sinon.stub(view, 'adminSearchActionHandler');
                updateLdapOptionsFormData = sinon.stub(view, 'updateLdapOptionsFormData');
            });
            after(function () {
                assembleActionHandler.restore();
                adminSearchActionHandler.restore();
                updateLdapOptionsFormData.restore();
            });
            it('Checks initializeLdapOptionsFormData condition check 0', function () {
                view.model = new Model();
                view.initializeLdapOptionsFormData();
                assembleActionHandler.called.should.be.equal(true);
                adminSearchActionHandler.called.should.be.equal(true);
                updateLdapOptionsFormData.called.should.be.equal(true);

            });
            it('Checks initializeLdapOptionsFormData condition check 1', function () {
                view.model.set({"ldap-options":{assemble:true, 'admin-search': true}});
                view.initializeLdapOptionsFormData();
                assembleActionHandler.called.should.be.equal(true);
                adminSearchActionHandler.called.should.be.equal(true);
                updateLdapOptionsFormData.called.should.be.equal(true);

            });
        });
        describe('Access Profile LDAP Options Form view UT', function () {
            it('Checks updateLdapOptionsFormData checked false', function () {
                var assemble = view.$el.find("#access_profile_assemble"),
                    search = view.$el.find("#access_profile_admin_search");
                view.model.set({"ldap-options":{'assemble': false,'admin-search': false}});
                view.updateLdapOptionsFormData();
                assemble.prop('checked').should.be.equal(false);
                search.prop('checked').should.be.equal(false);
            });
            it('Checks updateLdapOptionsFormData checked true', function () {
                var assemble = view.$el.find("#access_profile_assemble"),
                    search = view.$el.find("#access_profile_admin_search");
                view.model.set({"ldap-options":{'assemble': true,'admin-search': true}});
                view.updateLdapOptionsFormData();
                assemble.prop('checked').should.be.equal(true);
                search.prop('checked').should.be.equal(true);
            });
        });
        describe('Access Profile LDAP Options Form view UT', function () {

            it('Checks assembleActionHandler', function () {
                var common_name = view.$el.find('.access_profile_assemble_common_name').hide();

                view.assembleActionHandler();
                common_name.prop('style')['display'].should.be.equal('none');
            });
            it('Checks assembleActionHandler with false', function () {
                var common_name_element = view.$el.find('#access_profile_assemble_common_name'),
                    common_name = view.$el.find('.access_profile_assemble_common_name');

                view.assembleActionHandler(true);
                common_name_element.val().should.be.equal("");
                common_name.prop('style')['display'].should.be.equal('block');
            });
        });
        describe('Access Profile LDAP Options Form view UT', function () {

            it('Checks adminSearchActionHandler', function () {
                var disName = view.$el.find('.access_profile_distinguished_name'),
                    password = view.$el.find('.access_profile_password');

                view.adminSearchActionHandler();
                disName.prop('style')['display'].should.be.equal('none');
                password.prop('style')['display'].should.be.equal('none');
            });
            it('Checks adminSearchActionHandler with false', function () {
                var disName = view.$el.find('.access_profile_distinguished_name'),
                    password = view.$el.find('.access_profile_password'),
                    password_element = view.$el.find('#access_profile_password'),
                    name_element = view.$el.find('#access_profile_distinguished_name');

                view.adminSearchActionHandler(true);
                password_element.val().should.be.equal("");
                name_element.val().should.be.equal("");
                disName.prop('style')['display'].should.be.equal('block');
                password.prop('style')['display'].should.be.equal('block');
            });
        });
        describe('Access Profile LDAP Options Form view UT', function () {
            var showFormInlineError;

            beforeEach(function(){
                showFormInlineError = sinon.stub(view.formWidget, 'showFormInlineError');
            });

            afterEach(function(){
                showFormInlineError.restore();
            });

            it('Checks validateLdapOptionsForm 0', function () {
                view.model.set({"ldap-servers":{'ldap-server':[{},{}]},'ldap-options': { 'admin-search': true, 'admin-dn' : false}});
                view.validateLdapOptionsForm().should.be.equal(false);
                showFormInlineError.called.should.be.equal(true);
                showFormInlineError.args[0][0].should.be.equal('access_profile_base_distinguished_name');
            });

            it('Checks validateLdapOptionsForm 2', function () {
                view.model.set({'ldap-options': {'base-dn': '', 'assemble': true},"ldap-servers":{'ldap-server':[]}});
                view.validateLdapOptionsForm().should.be.equal(false);
                showFormInlineError.called.should.be.equal(true);
                showFormInlineError.args[0][0].should.be.equal('access_profile_base_distinguished_name');
            });
            it('Checks validateLdapOptionsForm 3', function () {
                view.model.set({'ldap-options': {'admin-dn': true},"ldap-servers":{'ldap-server':[{},{}]}});
                view.validateLdapOptionsForm().should.be.equal(false);
                showFormInlineError.called.should.be.equal(true);
                showFormInlineError.args[0][0].should.be.equal('access_profile_base_distinguished_name');
            });

            it('Checks validateLdapOptionsForm 4', function () {
                view.model.set({'ldap-options': {'admin-dn': true, 'admin-search': true},"ldap-servers":{'ldap-server':[{},{}]}});
                view.validateLdapOptionsForm().should.be.equal(false);
                showFormInlineError.called.should.be.equal(true);
                showFormInlineError.args[1][0].should.be.equal('access_profile_base_distinguished_name');
            });

        });
        describe('Access Profile LDAP Options Form view UT', function () {

            it('Checks getTitle', function () {
                view.getTitle().should.be.equal('access_profile_ldap_options_title');
                getMessage.called.should.be.equal(true);
            });

        });

        describe('Access Profile LDAP Options Form view UT', function () {

            it('Checks getSummary', function () {
                view.model.set({'ldap-options': {'assemble':true, 'common-name': 'test', 'base-dn': 'test', 'revert-interval': 123}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('access_profile_ldap_options_title');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('access_profile_assemble');
                resp[1].value.should.be.equal('enable');
                resp[2].label.should.be.equal('access_profile_assemble_common_name');
                resp[2].value.should.be.equal('test');
                resp[3].label.should.be.equal('access_profile_base_distinguished_name');
                resp[3].value.should.be.equal('test');
                resp[4].label.should.be.equal('access_profile_revert_interval');
                resp[4].value.should.be.equal("123 access_profile_seconds");
            });
            it('Checks getSummary', function () {
                view.model.set({'ldap-options': {'assemble':false, 'common-name': 'test', 'base-dn': 'test'}});
                var resp = view.getSummary();
                resp[0].label.should.be.equal('access_profile_ldap_options_title');
                resp[0].value.should.be.equal(' ');
                resp[1].label.should.be.equal('access_profile_assemble');
                resp[1].value.should.be.equal('disabled');
                resp[2].label.should.be.equal('access_profile_assemble_common_name');
                resp[2].value.should.be.equal('test');
                resp[3].label.should.be.equal('access_profile_base_distinguished_name');
                resp[3].value.should.be.equal('test');
                resp[4].label.should.be.equal('access_profile_revert_interval');
                resp[4].value.should.be.equal("");
            });
        });
        describe('Access Profile LDAP Options Form view UT with in validForm', function () {
            var validateLdapOptionsForm;
            before(function () {
                validateLdapOptionsForm = sinon.stub(view, 'validateLdapOptionsForm', function(){return false;})
            });

            after(function () {
                validateLdapOptionsForm.restore();
            });
            it('Checks beforePageChange', function () {
                view.beforePageChange(3, 1).should.be.equal(true);
                validateLdapOptionsForm.called.should.be.equal(false);
            });
            it('Checks beforePageChange', function () {
                view.model.set({'admin-search': false});
                view.beforePageChange().should.be.equal(false);
                validateLdapOptionsForm.called.should.be.equal(true);
            });

        });
    });
});