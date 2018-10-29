/**
 * Created by vinutht on 5/28/15.
 */

define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/dropDown/dropDownWidget',
        'widgets/form/formValidator',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/appsigProtocolFormViewConfiguration.js',
        '../models/appSigContextCollection.js'
    ],

    function(Backbone, Syphon, FormWidget, DropDownWidget, FormValidator, ResourceView, ProtocolFormConfig, ContextsCollection) {

        var MODE_CREATE = 'create',
            MODE_EDIT = 'edit';

        var AppSigProtocolFormView = ResourceView.extend({
            events: {
                'click #sd-appsig-protocol-save': "submit",
                'click #sd-appsig-protocol-cancel': "cancel"
            },

            /**
             * The constructor for the application signature protocol form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {

                this.parentView = options.parentView;
                this.context = options.parentView.context;
                this.formMode = options.formMode;
                this.contexts = new ContextsCollection();
                this.protocol = options.protocol;

                if (this.formMode == MODE_EDIT) {
                    this.appSigProtoFlatValues = options.flatValues;
                    this.model = this.parentView.protocolData.findWhere(
                        {
                            "context": options.flatValues['context'], 
                            "direction": options.flatValues['direction'],
                            "pattern": options.flatValues['pattern']
                        });
                    this.rowId = options.id;
                } else {
                    this.appSigProtoFlatValues = {};
                }

            },

            /**
             * Renders the form view in a overlay.
             *
             * @return returns this object
             */
            render: function() {

                var protoFormConfig = new ProtocolFormConfig(this.context),
                    formElements = protoFormConfig.getValues();

                this.addDynamicFormConfig(formElements);

                this.protoForm = new FormWidget({
                    container: this.el,
                    elements: formElements,                    
                    values: this.appSigProtoFlatValues
                });

                this.protoForm.build();

                this.populateContextsDropDown();                

                if(this.formMode === MODE_EDIT) {
                    this.$el.find('#app-sig-protocol-direction').val(this.appSigProtoFlatValues['direction']);
                }

                return this;
            },

            /**
             * @private
             *
             * This is a helper api which populates app-sig-contexts drop down by fetching the values from the server.
             * URL: /api/juniper/sd/app-sig-management/app-sigs/contexts
             *
             * @return none
             * */
            populateContextsDropDown: function() {
                var self = this;

                this.contexts.fetch({
                    "data": {
                        "protocol": self.protocol
                    },
                    success: function (collection, response, options) {
                         self.$el.find('#app-sig-protocol-context').append('<option></option>');
                        response.forEach(function(object) {
                            var comboBean = object['combo-bean'];
                            self.$el.find('#app-sig-protocol-context').append( new Option(comboBean.text,comboBean.value));
                        });
                        if(self.appSigProtoFlatValues['context']) {
                            self.$el.find('#app-sig-protocol-context').val(self.appSigProtoFlatValues['context']);    
                        }                        
                    },
                    error: function (collection, response, options) {
                        console.log('app sig categories collection not fetched');
                    }
                });

            },

            /**
             * Change the title of the form based on the context.
             *
             * @param (object) formConfiguration - form items configuration
             * */
            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                switch (this.formMode) {
                    case MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('app_sig_protocol_modify_title');
                        break;
                    case MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('app_sig_protocol_create_title');
                        break;
                }

                _.extend(formConfiguration, dynamicProperties);
            },

            cancel: function(event) {
                event.preventDefault();
                this.parentView.overlay.destroy();
            },

            submit: function(event) {

                var properties = Syphon.serialize(this);

               if (this.formMode == MODE_EDIT) {
                if (this.protoForm.isValidInput(this.$el.find('form'))) {
                    this.parentView.protocolData.remove(this.model);
                    this.parentView.protocolData.add(properties);
                    // update the column of detail in grid
                    properties.detail = "update";
                    this.model.id = this.rowId;
                    this.parentView.protocolGrid.editRow(this.model, properties);
                    this.parentView.overlay.destroy();
                }
                }
                else {
                     if (this.protoForm.isValidInput(this.$el.find('form'))) {
                     this.parentView.protocolData.add(properties);
                     this.parentView.protocolGrid.addRow(properties);
               /*      if(this.parentView.protocolGrid.getAllVisibleRows().length > 0) {
                          this.parentView.$el.find("#app-sig-protocol").prop('disabled', true);
                     }*/
                     this.parentView.overlay.destroy();
               }
            }
                }
        });

        return AppSigProtocolFormView;
    }
);
