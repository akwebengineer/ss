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
        '../conf/appSigGroupFormConfiguration.js',
        '../conf/appsig.js',
        'widgets/grid/gridWidget',
        '../conf/appsigGroupGridViewConfiguration.js',
        './appsigGroupFormView.js',
        'widgets/overlay/overlayWidget',
        '../models/appsigCollection.js'

    ],

    function(Backbone, Syphon, FormWidget, DropDownWidget, FormValidator, ResourceView, AppSigConfiguration,
             AppSigJSON, GridWidget, AppSigGroupGridConf, GroupFormView, OverlayWidget, Collection) {

        var AppSigFormViewGroup = ResourceView.extend({

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

              //  ResourceView.prototype.initialize.call(this, options);

                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.validator = new FormValidator();
                this.collection = new Collection();
                this.formMode = this.model.formMode;

                this.successMessageKey = 'app_sig_create_success';
                this.editMessageKey = 'app_sig_edit_success';
                this.fetchErrorKey = 'app_sig_fetch_error';
                this.fetchCloneErrorKey = 'app_sig_fetch_clone_error';

                this.appsigData = new Backbone.Collection();
                this.selectedRows = this.model.selectedRows;

            },
             render: function() {
                var me = this,
                 formConfiguration = new AppSigConfiguration(this.context),
                 formElements = formConfiguration.getValues(),
                 appSigDataModel = new AppSigJSON();

                 me.addDynamicFormConfig(formElements);
                 me.appSigflatValues = appSigDataModel.toFlatValues(me.model.attributes);

                if(this.selectedRows){
                me.appSigflatValues['members'] = this.selectedRows;
                }
                me.form = new FormWidget({
                        "container": this.el,
                        "elements": formElements,
                        "values": me.appSigflatValues
                });

                me.form.build();


                me.createAppSigGrid();
                me.populateAppSigGroup();

                this.$el.find(".app-sig-selection-grid").show();
                var deleteButton =  me.$el.find(".delete"), createButton = me.$el.find(".create");
                deleteButton.attr("title", "Remove");
                deleteButton.html("<span></span>");
                createButton.attr("title","Add");
                createButton.html("<span></span>");

              return me;
            },

            addDynamicFormConfig: function(formConfiguration) {
                 var dynamicProperties = {};
                 ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
                 switch (this.formMode) {
                     case this.MODE_EDIT:
                         dynamicProperties.title = this.context.getMessage('app_sig_group_modify_title');
                         break;
                     case this.MODE_CREATE:
                         dynamicProperties.title = this.context.getMessage('app_sig_create_group_title');
                         break;
                     case this.MODE_CLONE:
                         dynamicProperties.title = this.context.getMessage('app_sig_group_clone_title');
                         break;
                     case this.MODE_CREATE_GROUP:
                      dynamicProperties.title = this.context.getMessage('app_sig_create_group_title');
                         break;


                 }

                 _.extend(formConfiguration, dynamicProperties);
             },


            populateAppSigGroup: function(){
                var self = this;
           //update list builder with appsigs already assigned
                this.$el.find('#app-sig-group-disable').prop('checked', this.appSigflatValues['disable_state']);
                if (this.appSigflatValues['members']) {
                      var members = this.appSigflatValues['members'];

                       for(i=0;i<members.length;i++)
                       {
                       this.appsigGrid.addRow(members[i],true);
                       }
                    }
            },
            createAppSigGrid: function() {
                var appsigGridContainer = this.$el.find('#app-sig-selection-grid').empty(),
                    appSigGroupGridConf = new AppSigGroupGridConf(this.context);


                this.appsigGrid = new GridWidget({
                    container: appsigGridContainer,
                    elements: appSigGroupGridConf.getValues(),
                    actionEvents: appSigGroupGridConf.getEvents()
                       }).build();

                appsigGridContainer.find(".grid-widget").addClass("elementinput-long");
               

                this.bindEvents(appSigGroupGridConf.getEvents());

           },

           bindEvents: function(definedEvents) {
                if (definedEvents.createEvent) {
                   this.$el.bind(definedEvents.createEvent, $.proxy(this.createAction, this));
                }
                if (definedEvents.deleteEvent) {
                     this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
                }
            },

            createAction: function() {
                 var selectedRowIds = [];
                    /* for(i=0;i<this.appSigflatValues['members'].length;i++)
                     {
                        selectedRowIds.push(this.appSigflatValues['members'][i].id);
                     }*/
                     var visible = this.appsigGrid.getAllVisibleRows();
                                          for(i=0;i<visible.length;i++)
                                          {
                                             selectedRowIds.push(visible[i].id);
                                          }

                var appsigGroupForm = new GroupFormView({"parentView": this, "formMode": "create","selectedRows":selectedRowIds});
                this.overlay = new OverlayWidget({
                    view: appsigGroupForm,
                    type: 'large',
                    showScrollbar: true,
                    xIconEl: true
                });
                this.overlay.build();

                return this;
            },

            submit: function(event) {
                event.preventDefault();
                this.bindModelEvents();
                var members = [],
                properties = {};

                properties['name'] = this.$el.find('#app-sig-group-name').val();
                properties['type'] = 'group';
                properties['disable-state'] = this.$el.find('#app-sig-group-disable').is(":checked");
                properties['definition-type']= 'CUSTOM';
                selectedItems = this.appsigGrid.getAllVisibleRows();

                if (!this.form.isValidInput()) {
                    console.log('The form is invalid');
                    return;
                }
                if(selectedItems.length < 1){
                    this.form.showFormError(this.context.getMessage("appsig_required_error"));
                    return false;
                }
                /*
                 *Converting type "Application group" to "group" because backend using "group" where in UI we are showing
                 as "Application group"
                 *
                 */
                selectedItems.forEach(function (object,index) {
                  selectedItems[index].type = (selectedItems[index].type === "Application group") ? "group":(object.type ? object.type.toLowerCase():"");
               });

                properties['group-nested-members'] = {};
                properties['group-nested-members']['group-nested-member'] = selectedItems;
                this.model.set(properties);
                this.model.save();
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

        return AppSigFormViewGroup;

    }
);
