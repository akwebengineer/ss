/**
 * Created by vinutht on 5/14/15.
 */


define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/dropDown/dropDownWidget',
        'widgets/form/formValidator',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/appSigFormViewConfiguration.js',
        '../conf/appsig.js',
        'widgets/grid/gridWidget',
        '../conf/appsigProtocolGridConfiguration.js',
        './appsigProtocolFormView.js',
        'widgets/overlay/overlayWidget',
        '../models/appSigCategoriesCollection.js',
        '../models/appSigSubCategoriesCollection.js',
        '../models/appsigCollection.js'

    ],

    function(Backbone, Syphon, FormWidget, DropDownWidget, FormValidator, ResourceView, AppSigConfiguration,
             AppSigJSON, GridWidget, AppSigProtocolGridConf, ProtocolFormView, OverlayWidget, CategoriesCollection, SubCategoriesCollection, Collection) {
        var AppSigFormView = ResourceView.extend({

            events: {
                'click #sd-appsig-save': "submit",
                'click #sd-appsig-cancel': "cancel"
            },

            /**
             * The constructor for the application signature form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {

                ResourceView.prototype.initialize.call(this, options);

                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.validator = new FormValidator();
                this.categories = new CategoriesCollection();
                this.subCategories = new SubCategoriesCollection();
                //collection is for Appsig group
                this.collection = new Collection();


                if(this.formMode==undefined){
                this.formMode=this.MODE_CREATE;
                }
                this.successMessageKey = 'app_sig_create_success';
                this.editMessageKey = 'app_sig_edit_success';
                this.fetchErrorKey = 'app_sig_fetch_error';
                this.fetchCloneErrorKey = 'app_sig_fetch_clone_error';

                this.protocolData = new Backbone.Collection();
            },
            /**
             * Renders the form view in a overlay.
             *
             * returns this object
             */
            render: function() {
                var me = this,
                    formConfiguration = new AppSigConfiguration(this.context),
                    formElements = formConfiguration.getValues(),
                    appSigDataModel = new AppSigJSON();

                     me.addDynamicFormConfig(formElements);

                me.appSigflatValues = appSigDataModel.toFlatValues(me.model.attributes);
                me.form = new FormWidget(
                    {
                        "container": this.el,
                        "elements": formElements,
                        "values": me.appSigflatValues
                    }
                );
                me.form.build();

                me.populateCategoriesDropDown();
                me.populateSubCategoriesDropDown();

                me.createAppSigProtocolGrid();
                me.populateAppSigGrid();

                me.$el.find(".create").html("<span></span>Add");
                me.$el.find('#sd_appsig_SigDetailsSectionAdvanced').hide();

              /*  this.$el.find('input[type=radio][name=appsig_object_type]').click(function() {
                    me.appSigObjTypeChangeHandler(this.value);
                });*/

                this.$el.find('input[type=radio][name=type]').click(function() {
                    me.appSigTypeChangeHandler(this.value);
                });

                if(me.formMode === me.MODE_EDIT ||
                    me.formMode === me.MODE_CLONE) {
                    me.handleModifyMode();
                }
                else if(me.formMode === me.MODE_CREATE) {
                    me.hideAdvancedForm();
                }
                else if(me.formMode === me.MODE_CREATE_GROUP){
                    me.handleCreateGroup();
                }

                return me;
            },

               /**
             * @private
             *
             * This is called when the object type changes in the create flow.
             * @param - {value} value of the selected radio.
             * @return none
             * */
             appSigObjTypeChangeHandler: function(value) {
                 var appsig_type_radio =   this.$el.find('input[type=radio][name=type]:checked').val()
                 //alert(appsig_type_radio);
                 if (value === "GROUP") {
                     this.$el.find('#sd_appsig_groupform').children().show();
                     this.$el.find('#sd_appsig_create_type_form').hide();
                     this.$el.find('#sd_appsig_SigDetailsSectionBasic').hide();
                     this.$el.find('#sd_appsig_create_type_form').show();
                     this.appSigTypeChangeHandler(appsig_type_radio);
                     this.$el.find('#sd_appsig_tags_form').show();
                     this.$el.find('#sd_appsig_groupform').children().hide();
                     this.$el.find('#sd_appsig_SigDetailsSectionAdvanced').hide();
                 }
             },

           /**
             * @private
             *
             * This is a helper api which holds all the logic of the modify flow.
             *
             * @return none
             * */
            handleModifyMode: function() {
                var me = this;

                me.$el.find("label[for=app-sig-object]").parent().parent().hide();

                if(me.appSigflatValues['type'] === 'protocol') {
                    me.hideAdvancedForm();
                }
                else {
                    me.hideBasicForm();
                    me.$el.find('#app-sig-advanced-radio').prop('checked', true);
                    me.$el.find('#app-sig-chain-order').prop('checked', this.appSigflatValues['chain_order']);
                    me.$el.find('#app-sig-group-disable').prop('checked', this.appSigflatValues['disable_state']);
                    this.$el.find('#app-sig-protocol').val(this.appSigflatValues['protocol']);
                }

                me.$el.find('#app-sig-advanced-radio').prop('disabled', true);
                me.$el.find('#app-sig-basic-radio').prop('disabled', true);
                me.$el.find('#app-sig-risk').val(this.appSigflatValues['risk']);
                me.$el.find("label[for=app-sig-object]").parent().parent().hide();

                if(me.appSigflatValues['type']=== 'group'){
                    me.appSigObjTypeChangeHandler('GROUP');

                }
                else{
                    me.$el.find('#app-sig-object-type-appsig-radio').prop('checked', true);
                     me.appSigObjTypeChangeHandler('APPSIG');
                }
            },

            /**
             * @private
             *
             * This is a helper api which hides the app-sig-basic form section and shows app-sig-advanced form section
             *
             * @return none
             * */
            hideBasicForm: function() {
                this.$el.find('#sd_appsig_SigDetailsSectionBasic').hide().find('input').removeAttr('required');
                this.$el.find('#sd_appsig_SigDetailsSectionBasicPatterns').hide();
                this.$el.find('#sd_appsig_SigDetailsSectionAdvanced').show();
                this.$el.find('#app-sig-max-transaction').prop('required', true);
                this.$el.find('.grid-widget').show();
                this.$el.find('#sd_appsig_tags_form_sub_category').hide();
            },


            /**
             * @private
             *
             * This is a helper api which hides the app-sig-advanced form section and shows app-sig-basic form section
             *
             * @return none
             * */
            hideAdvancedForm: function() {
                this.$el.find('#sd_appsig_SigDetailsSectionBasic').show().find('input').prop('required',true);
                this.$el.find('#sd_appsig_SigDetailsSectionBasicPatterns').show();
                this.$el.find('#sd_appsig_SigDetailsSectionAdvanced').hide().find('input').removeAttr('required');
                this.$el.find('.grid-widget').hide();
                this.$el.find('#sd_appsig_tags_form_sub_category').show();
            },


            /**
             * @private
             *
             * This is a helper api which populates app-sig-categories drop down by fetching the values from the server.
             * URL: /api/juniper/sd/app-sig-management/app-sigs/categories
             *
             * @return none
             * */
            populateCategoriesDropDown: function () {
                var self = this;

                this.categories.fetch({
                    success: function (collection, response, options) {
                        response.forEach(function(object) {
                            var comboBean = object['combo-bean'];

                            self.$el.find('#app-sig-category').append( new Option(comboBean.text,comboBean.value));
                        });


                        self.$el.find('#app-sig-category').val(self.appSigflatValues['category']);
                    },
                    error: function (collection, response, options) {
                        console.log('app sig categories collection not fetched');
                    }
                });
            },

            /**
             * @private
             *
             * This is a helper api which populates app-sig-sub-categories drop down by fetching the values from the server.
             * URL: /api/juniper/sd/app-sig-management/app-sigs/sub-categories
             *
             * @return none
             * */
            populateSubCategoriesDropDown: function () {
                var self = this;

                this.subCategories.fetch({
                    success: function (collection, response, options) {
                        response.forEach(function(object) {
                            var comboBean = object['combo-bean'];
                            self.$el.find('#app-sig-sub-category').append( new Option(comboBean.text,comboBean.value));
                        });
                        self.$el.find('#app-sig-sub-category').val(self.appSigflatValues['sub_category']);
                    },
                    error: function (collection, response, options) {
                        console.log('app sig sub categories collection not fetched');
                    }
                });
            },


            /**
             * @private
             *
             * Application Signature Protocol Grid

             * @return none
             * */
            createAppSigProtocolGrid: function() {
                var protocolGridContainer = this.$el.find('#app-sig-protocol-grid'),
                    appSigProtoGridConf = new AppSigProtocolGridConf(this.context);

                this.protocolGrid = new GridWidget({
                    container: protocolGridContainer,
                    elements: appSigProtoGridConf.getValues(),
                    actionEvents: appSigProtoGridConf.getEvents()
                }).build();

                protocolGridContainer.find('.grid-widget').unwrap();

                this.bindEvents(appSigProtoGridConf.getEvents());


            },

               populateAppSigGrid: function(){
                        var self = this;
                   //update list builder with appsigs already assigned
                   //     this.$el.find('#app-sig-group-disable').prop('checked', this.appSigflatValues['disable_state']);

                         if(this.appSigflatValues['members']) {
                               this.protocolGrid.addRow(this.appSigflatValues['members']['pattern-member']);
                               this.protocolData = new Backbone.Collection(this.appSigflatValues['members']['pattern-member']);
                           }
                    },

            /**
             * @private
             *
             * This api is registring the event handlers for the app-sig-protocol-grid events.
             *
             * @param (JSON) definedEvents - Events registered for the grid
             * */
            bindEvents: function(definedEvents) {
                // create button for protocol
                if (definedEvents.createEvent) {
                    this.$el.bind(definedEvents.createEvent, $.proxy(this.createAction, this));
                    // Once form supports gridWidget, will check if it is still needed
                //    this.$el.bind("slipstream.grid.createAfter", $.proxy(this.createAction, this));
                }
                // edit button for protocol
                if (definedEvents.updateEvent) {
                    this.$el.bind(definedEvents.updateEvent, $.proxy(this.updateAction, this));
                    // Once form supports gridWidget, will check if it is still needed
                 //   this.$el.bind("slipstream.grid.edit", $.proxy(this.updateAction, this));
                }
                // delete button for url
                if (definedEvents.deleteEvent) {
                    this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
                    // Once form supports gridWidget, will check if it is still needed
                 //   this.$el.bind("slipstream.grid.delete", $.proxy(this.deleteAction, this));

                }
            },

            /**
             * @private
             *
             * This will popup a form to add protocols.
             * This is invoked when the user clicks on the create button of the protocol grid.
             * */
            createAction: function() {
                // Form for protocol creation

                var protocolForm = new ProtocolFormView({"parentView": this, "formMode": "create", "protocol": this.$el.find('#app-sig-protocol').val()});
                this.overlay = new OverlayWidget({
                    view: protocolForm,
                    type: 'large',
                    showScrollbar: true,
                    xIconEl: true
                });
                this.overlay.build();

                return this;
            },

            /**
             * @private
             *
             * This will popup a form to modify the chosen protocols
             * This is invoked when the user clicks on the edit button of the protocol grid.
             *
             * @param (object) event - This is the click event
             * @param (object) row - This is the selected row of the grid.
             * */
            updateAction: function(e, row) {

                // Form for protocol update
                var protocolForm = new ProtocolFormView(
                    {
                        "parentView": this,
                        "formMode": "edit",
                        "flatValues": row.originalRow,
                        "protocol": this.$el.find('#app-sig-protocol').val(),
                        "id": row.originalRow.slipstreamGridWidgetRowId
                    });

                this.overlay = new OverlayWidget({
                    view: protocolForm,
                    type: 'large',
                    showScrollbar: true,
                    xIconEl: true
                });
                this.overlay.build();

                return this;
            },

            /**
                @private

                This api will delete a row from the protocol data collection.

                @param (object) e - delete event
                @param (object) row - row that is getting deleted
            */
            deleteAction : function(e, row) {

                var protoModel = this.protocolData.findWhere(
                    {
                        "context": row.deletedRows[0].context,
                        "direction": row.deletedRows[0].direction,
                        "pattern": row.deletedRows[0].pattern
                    });

                this.protocolData.remove(protoModel);
            },

            /**
             * @private
             *
             * Handler to handle application signature type change event.
             * There are two types - Basic (protocol) and Advanced (application)
             *
             * @param (object) sigType - Signature Type (either protocol or application)
             * */
            appSigTypeChangeHandler: function(sigType) {
                if(sigType === 'application') {
                    this.hideBasicForm();
                }
                else if(sigType === 'protocol') {
                    this.hideAdvancedForm();
                }
            },

            /**
             * @private
             *
             * Change the title of the form based on the context.
             *
             * @param (object) formConfiguration - form items configuration
             * */
            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                switch (this.formMode) {
                    case this.MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('app_sig_modify_title');
                        break;
                    case this.MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('app_sig_create_title');
                        break;
                    case this.MODE_CLONE:
                        dynamicProperties.title = this.context.getMessage('app_sig_clone_title');
                        break;
                    case this.MODE_CREATE_GROUP:
                     dynamicProperties.title = this.context.getMessage('app_sig_create_title');
                        break;
                }

                _.extend(formConfiguration, dynamicProperties);
            },

            // View event handlers

            /**
             * Called when OK button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            submit: function(event) {
                event.preventDefault();
                this.bindModelEvents();
                var appsig_obj_type;
                if(this.formMode==this.MODE_CREATE||this.formMode==this.MODE_CREATE_GROUP){
                appsig_obj_type =   this.$el.find('input[type=radio][name=appsig_object_type]:checked').val();
                }
                else{
                appsig_obj_type = this.appSigflatValues['type']=='group'?'GROUP':'APPSIG';
                }
                if (this.form.isValidInput(this.$el.find('form'))) {
                    var appSigDataModel = new AppSigJSON(),
                    properties = Syphon.serialize(this);
                    properties.members = {"pattern-member": this.protocolData.toJSON()};
                    this.model.set(appSigDataModel.toNestedObject(properties));
                    this.model.save();
                }
            },

            /**
             * Called when Cancel button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function(event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            }



        });

        return AppSigFormView;

    }
);
