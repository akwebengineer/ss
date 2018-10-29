/**
 * View to Ldap Server Form View
 *
 * @module ldapServerFormView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/ldapServerFormConf.js'
], function (
     Backbone,
     Syphon,
     FormWidget,
     FormValidator,
     ResourceView,
     LdapServerFormConf
    ) {

    var ldapServerFormView = ResourceView.extend({
        /**
         * bind submit and cancel events of form
         */
        events: {
            'click #ldap-server-save': "submit",
            'click #ldap-server-cancel': "cancel"
        },
        /**
         * Initialize Resource view
         * @param options
         */
        initialize: function(options) {
            this.syphon = Syphon;
            this.activity = options.activity;
            this.context = options.activity.context;
            this.rowData = options.rowData;
            this.isEditMode = false;
            if(this.rowData){
                this.formMode = this.MODE_EDIT;
            }
        },
        /**
         * builds form view
         * @returns {FormView}
         */
        render: function() {
            var self = this,
                formConfiguration = new LdapServerFormConf(self.context),
                formElements = formConfiguration.getValues();
            self.addDynamicFormConfig(formElements);
            self.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.rowData? this.rowData.originalRow : {'port':389}
            });

            self.form.build();
            self.updateFormElements();
            return self;
        },
        /**
         * Sets title based on form mode
         * @param formConfiguration
         */
        addDynamicFormConfig: function (formConfiguration) {
            var me = this, dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(me, formConfiguration);
            switch (me.formMode) {
                case me.MODE_EDIT:
                    dynamicProperties.title = me.context.getMessage('access_profile_ldap_server_modify');
                    break;
                default:
                    dynamicProperties.title = me.context.getMessage('access_profile_ldap_server_add');
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        /***
         * It updates the UI elements based on settings.
         * Need to be called after the data is set in the form if edit mode.
         */
        updateFormElements: function () {
            this.$el.find('input#access_profile_timeout').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_seconds') + '<span');

            this.$el.find('input#access_profile_retry').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('times') + '<span');
        },
    cancel : function(){
            this.activity.overlay.destroy();
        },
        /**
         * final form submit
         */
        submit : function () {
            var count = 0, visibleRows=[],duplicateAddressName = false,  self = this, formData = self.syphon.serialize(self);
             if(!self.form.isValidInput()){
                 return;
             }
            visibleRows = self.activity.gridWidget.getAllVisibleRows();
            for(var i = 0; i<visibleRows.length; i++){
                if(visibleRows[i].address === formData.address){
                    if(self.formMode !== this.MODE_EDIT ){
                        duplicateAddressName = true;
                        break;
                    } else{
                        count ++;
                        if(count >1){
                            duplicateAddressName = true;
                            break;
                        }
                    }
                }
            }
            if(duplicateAddressName){
                // TODO:show form error
                var el = self.$el.find('#access_profile_address');
                el.closest('.row').addClass('error');
                el.siblings('.error').show().text(self.context.getMessage("access_profile_duplicate_address_error"));

                return;
            }
            if(self.formMode === this.MODE_EDIT){
                //modify the existing row
                self.activity.gridWidget.editRow (self.rowData.originalRow, formData);
            }else {
                // add an new row to root certificate grid with selected values.
                self.activity.gridWidget.addRow(formData);
            }
            // on success, destroy the model
            self.cancel();
        }
    });

    return ldapServerFormView;
});