/**
 * A view implementing general form workflow for create Access Profile wizard.
 *
 * @module PolicyGeneralFormView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/ldapOptionsFormConf.js'
], function(Backbone, Syphon, FormWidget, Form) {

    var FormView = Backbone.View.extend({
        /**
         * Initialize Backbone view
         * @param options
         */
        initialize: function(options) {
            this.wizardView = this.options.wizardView;
            this.context = this.options.context;
            return this;
        },
        /**
         * builds form view
         * @returns {FormView}
         */
        render: function(){
            var self = this,
                formConfiguration = new Form(self.context),
                formElements = formConfiguration.getValues(),
                formData = self.model.get("ldap-options");

            //set the revert-neterval to empty if its 0, bcos UI interval limit is 60 to 4294967295 and UI default is 0
            if(formData && formData['revert-interval'] == 0){
                formData['revert-interval'] = "";
            }
            self.formWidget = new FormWidget({
                "container": self.el,
                elements: formElements,
                values: formData || {}
            });
            self.formWidget.build();
            self.updateFormElements();
            self.initializeLdapOptionsFormData();

            return self;
        },
        /**
         * update LDAP form with server values
         */
        initializeLdapOptionsFormData: function(){
            var self = this;
            self.assembleActionHandler(this.model.get("ldap-options")? this.model.get("ldap-options")['assemble'] : false);
            self.adminSearchActionHandler(this.model.get("ldap-options")? this.model.get("ldap-options")['admin-search'] : false);
            self.$el.find('#access_profile_assemble').change(function(){
                self.assembleActionHandler(this.checked);
            });
            self.$el.find('#access_profile_admin_search').change(function(){
                self.adminSearchActionHandler(this.checked);
            });
            self.updateLdapOptionsFormData();
        },
        /***
         * It updates the UI elements based on settings.
         * Need to be called after the data is set in the form if edit mode.
         */
        updateFormElements: function () {
            this.$el.find('input#access_profile_revert_interval').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_seconds') + '<span');

        },
        /**
         * update LDAP form with server values
         */
        updateLdapOptionsFormData: function(){
            if(this.model.get("ldap-options")){
                this.$el.find("#access_profile_assemble").prop('checked', this.model.get("ldap-options")['assemble']);
                this.$el.find("#access_profile_admin_search").prop('checked', this.model.get("ldap-options")['admin-search']);
            }
        },
        /**
         * assemble Action Handler
         * @param value
         */
        assembleActionHandler : function(value){
            if(value){
                this.$el.find('.access_profile_assemble_common_name').show();
            }else{
                this.$el.find('#access_profile_assemble_common_name').val("");
                this.$el.find('.access_profile_assemble_common_name').hide();
            }
        },
        /**
         * admin Search Action Handler
         * @param value
         */
        adminSearchActionHandler: function(value){
            var disName = this.$el.find('.access_profile_distinguished_name'),
                password = this.$el.find('.access_profile_password');
            if(value){
                disName.show();
                password.show();
            }else{
                this.$el.find('#access_profile_password').val("");
                this.$el.find('#access_profile_distinguished_name').val("");
                disName.hide();
                password.hide();
            }
        },
        /**
         *  form manual validation
         * @returns {boolean}
         */
        validateLdapOptionsForm : function(){
            var formValid = true, ldapOptions = this.model.get('ldap-options');
            if(this.model.get('ldap-servers') && this.model.get('ldap-servers')['ldap-server'].length > 0){
                if(!ldapOptions['base-dn']){
                    this.formWidget.showFormInlineError('access_profile_base_distinguished_name', true);
                    formValid = false;
                }
            }
            if((ldapOptions['assemble']
                || ldapOptions['admin-search']
                || !_.isEmpty(ldapOptions['search-filter'])
                || !_.isEmpty(ldapOptions['revert-interval']))
                && _.isEmpty(ldapOptions['base-dn']) ){

                this.formWidget.showFormInlineError('access_profile_base_distinguished_name', true);
                formValid = false;
            }

            if(ldapOptions['admin-search'] ){

                if(!ldapOptions['search-filter']){
                    this.formWidget.showFormInlineError('access_profile_search_filter', true);
                    formValid = false;
                }
                if(!ldapOptions['admin-dn']){
                    this.formWidget.showFormInlineError('access_profile_distinguished_name', true);
                    formValid = false;
                }
                if(!ldapOptions['admin-password']){
                    this.formWidget.showFormInlineError('access_profile_password', true);
                    formValid = false;
                }

            }
            return formValid;
        },
        /**
         * title for wizard page
         * @returns Title form getMessage
         */
        getTitle: function(){
            return this.context.getMessage('access_profile_ldap_options_title') ;
        },
        /**
         * builds data for summary view screen
         * @returns {Array}
         */
        getSummary: function() {
            var summary = [], self = this, ldapOptionsData = self.model.get("ldap-options");

            summary.push({
                label: self.context.getMessage('access_profile_ldap_options_title'),
                value: ' '
            });
            summary.push({
                label: self.context.getMessage('access_profile_assemble'),
                value: ldapOptionsData['assemble'] ? self.context.getMessage("enable") : self.context.getMessage("disabled")
            });
            summary.push({
                label: self.context.getMessage('access_profile_assemble_common_name'),
                value: ldapOptionsData['common-name']
            });
            summary.push({
                label: self.context.getMessage('access_profile_base_distinguished_name'),
                value:  ldapOptionsData['base-dn']
            });
            summary.push({
                label: self.context.getMessage('access_profile_revert_interval'),
                value: ldapOptionsData['revert-interval'] ? ldapOptionsData['revert-interval'] + " " + self.context.getMessage("access_profile_seconds") : ""
            });

            return summary;
        },

        /**
         *
         * @param currentStep
         * @param requestedStep
         * @returns {boolean}
         */
        beforePageChange: function(currentStep, requestedStep) {
            var self = this, formData = Syphon.serialize(self);


            self.model.set({"ldap-options": formData});
            //if admin search is not selected then clear the user name and password fields
            if(!self.model.get('admin-search')) {
                self.model.set({'admin-dn':""});
                self.model.set({'admin-password' : ""});
            }
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }

            return self.validateLdapOptionsForm();
        }
    });
    return FormView;
});
