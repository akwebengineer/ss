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
    '../conf/policyGeneralFormConf.js',
    './ldapGridView.js',
    '../../constants/userFirewallConstants.js'
], function(Backbone, Syphon, FormWidget, Form, LdapGridView, Constants) {

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
            var self = this, formConfiguration = new Form(self.context),
                formElements = formConfiguration.getValues((self.wizardView.formMode === this.wizardView.MODE_EDIT));
            // Add name remote validation
            self.wizardView.addRemoteNameValidation(formElements);

            //specity the onchange handle to the order1 dropdown
            formElements.sections[1].elements[0]['onChange'] =  $.proxy(self.authenticationOrderOnChange, self);

            self.formWidget = new FormWidget({
                "container": this.el,
                elements: formElements,
                values:  self.getGeneralSettingsFormData()
            });
            self.formWidget.build();

            // build LDAP server grid
            self.ldapServerGridView = new LdapGridView({
                parentView: self,
                context: self.context
            }); 

            self.updateGeneralSettingsFormData();
            // TO HAVE STATIC WIDTH FOR THE DROPDOWN for  PR 1210008 [Confidential]  space-sd-UserFW:Access Profile:Authentication Order is not alligned properly when user selects order 1 and 2.
            self.$el.find('.select2-container').css('width', '295px');

            return self;
        },
        authenticationOrderOnChange : function(event){
           this.authenticationOrderChangeHandler(event.target.value);
        },
        /**
         *
         * @returns {*}
         */
        getGeneralSettingsFormData: function(){
            var formData = this.model.attributes, order1 = this.model.get('authentication-order1') || 'NONE';
            formData['authentication_order1'] = {'id':order1, 'text': order1};
            /* if(undefined !== this.model.get('authentication-order2') ){
             formData['authentication_order2'] = {'id':this.model.get('authentication-order2'), 'text': this.model.get('authentication-order2')};
             }*/
            return formData;
        },
        /**
         *
         */
        updateGeneralSettingsFormData: function(){

            this.authenticationOrderChangeHandler(this.model.get('authentication-order1') || "NONE");
            // update the authentication order 2 drop down in edit workflow
            var autOrder2 = this.formWidget.getInstantiatedWidgets().dropDown_access_profile_authentication_order2;
            autOrder2.instance.setValue(this.model.get('authentication-order2'));

            if(this.model.get('ldap-servers')){
                this.ldapServerGridView.addGridData(this.model.get('ldap-servers')['ldap-server']);
            }
        },
        /**
         *  handle the change event on authentication order1 and
         *  then set the value based to order2 based on order1 selection
         */
        authenticationOrderChangeHandler: function(value){
            var ddData = [], element =  this.$el.find('.access_profile_authentication_order2'),
                autOrder2 = this.formWidget.getInstantiatedWidgets().dropDown_access_profile_authentication_order2;
            if(!autOrder2 || value === "NONE"){
                element.hide();
                return;
            }

            ddData = [{
                "id": "NONE",
                "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.NONE
            },
                {
                    "id": "LDAP",
                    "text":Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.LDAP,
                    "disabled": (value === "LDAP" || value === 'RADIUS' ||  value === 'SECURID')
                },
                {
                    "id": "PASSWORD",
                    "text":Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.PASSWORD,
                    "disabled": (value === 'PASSWORD')
                },
                {
                    "id": "RADIUS",
                    "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.RADIUS,
                    "disabled": (value === "LDAP" || value === 'RADIUS' ||  value === 'SECURID')
                },
                {
                    "id": "SECURID",
                    "text": Constants.ACCESS_PROFILE.AUTHENTICATION_ORDER.SECUREID,
                    "disabled": (value === "LDAP" || value === 'RADIUS' ||  value === 'SECURID')
                }]
            element.show();
            autOrder2.instance.addData(ddData, true);
            autOrder2.instance.setValue( 'NONE');
        },
        /**
         * title for wizard page
         * @returns Title form getMessage
         */
        getTitle: function(){
            return this.context.getMessage('access_profile_general_setting_title') ;
        },
        /**
         * builds data for summary view screen
         * @returns {Array}
         */
        getSummary: function() {
            var summary = [], self = this, ldapServers = this.model.get('ldap-servers')['ldap-server'];

            summary.push({
                label: self.context.getMessage('access_profile_general_setting_title'),
                value: ' '
            });
            summary.push({
                label: self.context.getMessage('access_profile_name'),
                value: this.model.get('name')
            });
            summary.push({
                label: self.context.getMessage('access_profile_authentication_order1'),
                value: this.model.get('authentication-order1')

            });
            summary.push({
                label: self.context.getMessage('access_profile_authentication_order2'),
                value: this.model.get('authentication-order2')
            });

            if(ldapServers.length>0){
                summary.push({
                    label: self.context.getMessage('access_profile_ldap_server_title'),
                    value: ldapServers[0]['address'] + (ldapServers.length>1 ? " (+"+(ldapServers.length -1) +")" : "")
                });
            }

            return summary;
        },
        /**
         *
         * @param currentStep
         * @param requestedStep
         * @returns {boolean}
         */
        beforePageChange: function(currentStep, requestedStep) {
            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }
            if (! this.formWidget.isValidInput()) {
                console.log('form is invalid');
                return false;
            }
            var  self = this, formData = Syphon.serialize(self), ldapServers = this.ldapServerGridView.getAllVisibleRows(),
                order1;

            // as in edit name is display field(non editable) we need to set the name value to the formData Obj before setting to model
            if(this.wizardView.formMode === this.wizardView.MODE_EDIT){
                formData['name'] = self.model.get('name');
            }
            formData['ldap-servers']= {'ldap-server' : ldapServers};
            this.model.set(formData);
            order1 = self.model.get('authentication-order1');
            if(ldapServers.length === 0 && (_.isEmpty(order1) || order1 === 'NONE')){
                self.formWidget.showFormError(self.context.getMessage('access_profile_general_settings_validation_message'));
                return false;
            }
            return true;
        }
    });
    return FormView;
});
