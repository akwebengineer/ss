/**
 * Created by ramesha on 8/31/15.
 */


define(
    [
        'backbone',
        'widgets/form/formWidget',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/appSigGroupFormDetailedConfiguration.js',
        'widgets/grid/gridWidget',
        '../conf/appsigGroupGridViewDetailsConfiguration.js'
    ],

    function(Backbone, FormWidget, ResourceView, AppSigDetailedConfiguration,
              GridWidget, AppSigGroupGridConf) {

        var AppSigFormViewGroup = ResourceView.extend({

            events: {
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
                this.model = options.activity.model;

                 this.formMode=this.MODE_VIEW_GROUP;
                 this.selectedRows = this.activity.model.selectedRows;
            },
             render: function() {
                var me = this,
                 formConfiguration = new AppSigDetailedConfiguration(this.context),
                 formElements = formConfiguration.getValues();

                 me.addDynamicFormConfig(formElements);
           
                if(this.selectedRows){
                me.appSigValues = this.selectedRows;
                }
                me.form = new FormWidget({
                        "container": this.el,
                        "elements": formElements,
                        "values": me.appSigValues
                });

                me.form.build();

                me.createAppSigGrid();
                me.populateAppSigGroup();
                this.$el.find(".grid-widget").show();

              return me;
            },
            addDynamicFormConfig: function(formConfiguration) {
                 var dynamicProperties = {};
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
                      case this.MODE_VIEW_GROUP:
                         dynamicProperties.title = this.context.getMessage('app_sig_group_grid_view');
                      break;
                 }
                 _.extend(formConfiguration, dynamicProperties);
             },

            populateAppSigGroup: function(){
                var self = this,members = {};
                if(this.model.attributes['group-nested-members']){
                    members = this.model.attributes['group-nested-members']['group-nested-member'];
                }
               if (members) {

                       for(i=0;i<members.length;i++)
                       {
                       this.appsigGrid.addRow(members[i]);
                       }
                    }
            },
            createAppSigGrid: function() {
                var appsigGridContainer = this.$el.find('#app-sig-protocol-grid'),
                    appSigGroupGridConf = new AppSigGroupGridConf(this.context);

                this.appsigGrid = new GridWidget({
                    container: appsigGridContainer,
                    elements: appSigGroupGridConf.getValues()
                       }).build();

                appsigGridContainer.find(".grid-widget").addClass("elementinput-long");            

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
