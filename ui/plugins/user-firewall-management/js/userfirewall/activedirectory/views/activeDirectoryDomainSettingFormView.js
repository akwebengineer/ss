/**
 * A module that launches create active directory wizard- General Information Page.
 *
 * @module activeDirectoryGeneralInformationView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/activeDirectoryDomainSettingsFormConf.js',
    './activeDirectoryDomainControllerGridView.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    './activeDirectoryDomainLDAPGridView.js',
    '../../constants/userFirewallConstants.js'
], function (
        Backbone,
        Syphon,
        FormWidget,
        ResourceView,
        FormConf,
        DomainControllerGridView,
        ValidationUtility,
        DomainLDAPGridView,
        Constants
    ) {

    var FormView = ResourceView.extend({
        events: {
           // 'change #active_directory_ldap_username': 'enableLDAPPassword',
           // 'change #active_directory_initial_event_log_timestamp': 'handleChangeEvent',
           // 'change #active_directory_event_log_scanning': 'handleChangeEvent',
            'click #domain-settings-save': "submit",
            'click #domain-settings-cancel': "closeOverlay"

        },

        /**
         * Initialize the view
         * @returns {FormView}
         */
        initialize: function (options) {
            this.activity = options.activity;
            this.context = options.activity.context;
            this.rowData = options.rowData;
            this.isEditMode = false;
            if(this.rowData){
                this.formMode = this.MODE_EDIT;
                var record = this.activity.domainCollection.where({'domain-name':this.rowData.originalRow['domain-name']});
                if(record.length>0){
                    _.extend(this.rowData.originalRow,record[0].attributes);
                    this.model = record[0];
                }
            }

            // Add validations methods
            _.extend(this, ValidationUtility);

            return this;
        },

        /**
         *
         * Renders the form
         * @returns {FormView}
         */
        render: function () {
            var formConfiguration = new FormConf(this.context),
                formElements = formConfiguration.getValues();

            // Add name remote validation
            this.addRemoteNameValidation(formElements);
            this.addDynamicFormConfig(formElements);
            // add form
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formElements,
                values: this.rowData? this.rowData.originalRow : {
                    'event-log-time-span':Constants.ACTIVE_DIRECTORY.DEFAULTS.EVENT_LOG_TIME_SPAN,
                    'event-log-interval': Constants.ACTIVE_DIRECTORY.DEFAULTS.EVENT_LOG_INTERVAL
                } // set default values in create workflow
            });
            this.formWidget.build();

            // add domain controller grid
            this.domainControllerGridView = new DomainControllerGridView({parentView: this, context: this.context});
            // add domain controller grid
            this.domainLDAPGridView = new DomainLDAPGridView({parentView: this, context: this.context});


            // bind basic validations
            this.addSubsidiaryFunctions(formElements);

            this.updateFormElements();

            // bind validation handlers
            this.bindValidationHandler();

            //set model attributes
            this.setModelAttributes();

            return this;
        },

        addDynamicFormConfig: function (formConfiguration) {
            var me = this, dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(me, formConfiguration);
            switch (me.formMode) {
                case me.MODE_EDIT:
                    dynamicProperties.title = me.context.getMessage('active_directory_domain_settings_modify');
                    break;
                default:
                    dynamicProperties.title = me.context.getMessage('active_directory_domain_settings_add');
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        /**
         * Bind validation handlers on the sections
         */
        bindValidationHandler: function () {
            var self = this;
            this.$el.find('#active_directory_group_mapping').find('.row').each(function (i, obj) {
                var el, isUserGrpSettingAdded = false;

                el = $(obj).find('input');

                if (el.length > 0) {
                    el = el[0];
                    $(el).bind('baseValidation', $.proxy(self.baseValidation, self));
                }

            });

           // this.$el.find('#event_log_scanning_interval').bind('rangeValidate', $.proxy(self.rangeValidation, self));
           // this.$el.find('#initial_event_log_timestamp_interval').bind('rangeValidate', $.proxy(self.rangeValidation, self));
        },

        /**
         * It sets the model attributes for the checkboxes
         */
        setModelAttributes: function () {
            var self = this, data, el, domainControllers, domainLDAPs;
            data = this.rowData? this.rowData.originalRow : {};

            if (!_.isEmpty(data)) {

                self.$el.find('#use-ssl').prop('checked', data['use-ssl']);
                self.$el.find('#authentication-algorithm').prop('checked', data['authentication-algorithm']);

                if(data['domain-controllers'] && data['domain-controllers']['domain-controller'] && data['domain-controllers']['domain-controller'].length > 0){
                    domainControllers = data['domain-controllers']['domain-controller'];
                    self.domainControllerGridView.gridWidget.addRow(domainControllers);
                }

                if(data['ldap-addresses'] && data['ldap-addresses']['ldap-address'] && data['ldap-addresses']['ldap-address'].length > 0){
                    domainLDAPs = data['ldap-addresses']['ldap-address'];
                    self.domainLDAPGridView.gridWidget.addRow(domainLDAPs);
                }

            } else{
                self.$el.find('#authentication-algorithm').prop('checked', true);
            }
        },

        closeOverlay : function(){
            this.activity.overlay.destroy();
        },
        isDomainContollerAndLdapGridInvalid: function(){
            var formInValid = false,
                self = this,
                domainContorllerGridErrors = self.$el.find('#active_directory_domain_controller').find('.error'),
                domainLDAPGridErrors = self.$el.find('#active_directory_domain_ldap').find('.error'),
                LDAPGridVisibleRows = self.domainLDAPGridView.gridWidget.getAllVisibleRows(),
                domainController = self.domainControllerGridView.gridWidget.getAllVisibleRows(),
                elLdap = self.$el.find('#active_directory_domain_ldap'),
                elContoller = self.$el.find('#active_directory_domain_controller');

            if(LDAPGridVisibleRows.length> 0 || domainController.length>0){
                for(var i = 0; i<LDAPGridVisibleRows.length; i++){
                    var ldapAddress = LDAPGridVisibleRows[i]['user-grp-ip-address'];
                    if(!ldapAddress){
                        formInValid = true;
                        elLdap.closest('.row').addClass('error');
                        elLdap.siblings('.error').show().text(self.context.getMessage("active_directory_invalid_ldap_ip_address"));
                        break;
                    }
                }
                for(var j = 0; j<domainController.length; j++){
                    var contollerAddress = domainController[j]['domain-controller-ip-address'],
                        controllerName = domainController[j]['domain-controller-name'];
                    if(!contollerAddress || !controllerName){
                        formInValid = true;
                        elContoller.closest('.row').addClass('error');
                        elContoller.siblings('.error').show().text(self.context.getMessage("active_directory_invalid_contoller_name_or_ip_address"));
                        break;
                    }
                }
                if ( domainContorllerGridErrors.length > 0 || domainLDAPGridErrors.length > 0) {
                    formInValid = true;
                } else if(!formInValid){
                    elLdap.closest('.row').removeClass('error');
                    elContoller.closest('.row').removeClass('error');
                }
            }

            return formInValid;
        },
        /**
         *  validation for Base DN field..
         * @param data
         * @returns {boolean}
         */
        isBaseDNRequired: function(data){
            var self = this;
            // if any of the field under LDAP is entered then Base DN field is manadatory
            if((self.domainLDAPGridView.gridWidget.getAllVisibleRows().length > 0
                || !_.isEmpty(data['user-grp-name'])
                || !_.isEmpty(data['user-grp-password'])
                || data['use-ssl']
                || data['authentication-algorithm'])
                &&  _.isEmpty(data['base'])){

                return true;
            }
            return false;
        },
        /**
         * final form submit
         */
        submit : function (){

            var self = this,
                inputFields,

                collecton = this.activity.domainCollection,
                data =this.getPageData(),
                elBase = self.$el.find('#baseDN');
            this.formWidget.isValidInput();
            if(collecton.where({'domain-name':data['domain-name']}).length>0 && this.formMode !== this.MODE_EDIT){
                // TODO:show form error
//                self.formWidget.showFormInlineError('active_directory_domain_name');
                var el = self.$el.find('#active_directory_domain_name');
                el.closest('.row').addClass('error');
                el.siblings('.error').show().text(self.context.getMessage("active_directory_duplicate_domain_error"));

                return;
            }
            inputFields = self.$el.find("#active-directory-general-form").find("input[data-invalid]");
            if (inputFields.length > 0) {
                console.log('form is invalid');
                return false;
            }
            if(self.isDomainContollerAndLdapGridInvalid()){
                return false;
            }

            // check for Base DN field if LDAP IP Address and Port is given
            if(self.isBaseDNRequired(data)){
                elBase.closest('.row').addClass('error');
                elBase.siblings('.error').show().text(self.context.getMessage("active_directory_base_require"));
                return;
            }else{
                self.removeErrorInfo(elBase);
            }
            // check if the ranges are defined properly
            if (this.$el.find('#event_log_scanning').prop('checked')) {
                if (_.isEmpty(this.$el.find('#event_log_scanning_interval').val())) {
                    console.log('form is invalid');
                    return false;
                }
            }

            if (this.$el.find('#initial_event_log_timestamp').prop('checked')) {
                if (_.isEmpty(this.$el.find('#initial_event_log_timestamp_interval').val())) {
                    console.log('form is invalid');
                    return false;
                }
            }

            if(this.formMode === this.MODE_EDIT){
                this.model.set(data);
                //modify the existing row
                this.activity.gridWidget.editRow (this.rowData.originalRow, this.getPageData());
            }else {
                collecton.add(new Backbone.Model(data));
                // add an new row to root certificate grid with selected values.
                this.activity.gridWidget.addRow(this.getPageData());
            }

            this.closeOverlay();
        },
        /**
         * Returns the page data which need to be set in the model before moving to the next page
         */
        getPageData: function () {
            var self = this, properties, domainControllers, ldapServers;

            properties = Syphon.serialize(this);

            // check if the user group port is specified or not
            if (_.isEmpty(properties['user-grp-port'])) {
                properties['user-grp-port'] = undefined;
            } else {
                properties['user-grp-port'] = properties['user-grp-port'];
            }
           // properties ['event-log-interval'] = properties ['event-log-interval'];
            //properties ['event-log-time-span'] =properties ['event-log-time-span'];

            domainControllers = self.domainControllerGridView.gridWidget.getAllVisibleRows().map(function (item) {
                return  _.omit(item, 'id');

            });

            ldapServers = self.domainLDAPGridView.gridWidget.getAllVisibleRows().map(function (item) {
                return  _.omit(item, 'id');

            });

            // add domain controllers rows:
            properties ['domain-controllers'] = {
                'domain-controller': domainControllers
            };
            // add domain controllers rows:
            properties ['ldap-addresses'] = {
                'ldap-address': ldapServers
            };

            delete properties['domain-controller-id-address'];
            delete properties['domain-controller-name'];

            return properties;

        },

        /**
         * Remove Error Message on the comp
         * @param comp
         */
        removeErrorInfo: function (comp) {
            comp.removeAttr('data-invalid').parent().removeClass('error');
            comp.parent().prev().removeClass('error');
            comp.siblings(".inline-help").hide();
        },

        /**
         * Check the base validation
         * @param d
         */
        baseValidation: function (d) {
            var baseEl = this.$el.find('input#base'), self = this,
                el, isUserGrpSettingAdded = false;
            if (!_.isEmpty(baseEl.val())) {
                // remove base input validation
                this.removeErrorInfo(baseEl);
                return;
            }

            this.$el.find('#active_directory_group_mapping').find('.row').each(function (i, obj) {


                el = $(obj).find('input');
                if (el.length > 0) {
                    el = el[0];
                    if (el.name !== 'base') {
                        // check if the value is specified
                        if (el.type === 'checkbox') {
                            if (el.checked === true) {
                                isUserGrpSettingAdded = true;
                                return false;
                            }
                        } else if (!_.isEmpty(el.value)) {
                            isUserGrpSettingAdded = true;
                            return false;
                        }
                    }
                }

            });
            if (!isUserGrpSettingAdded) {
                // remove base input validation
                self.removeErrorInfo(baseEl);

            } else {
                // show error on base
                self.showErrorInfo(baseEl);
            }

        },

        /***
         * It updates the UI elements based on settings.
         * Need to be called after the data is set in the form if edit mode.
         */
        updateFormElements: function () {
            this.$el.find('input#event_log_scanning_interval').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_seconds') + '<span');

            this.$el.find('input#initial_event_log_timestamp_interval').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_hours') + '<span');
        },

    });

    return FormView;
});