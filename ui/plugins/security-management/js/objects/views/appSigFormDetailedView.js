/**
 * Created by ramesha on 8/31/15.
 */
define(
    [
       'backbone',
        'widgets/form/formWidget',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/appSigFormViewDetailedConfiguration.js',
        '../conf/appSigGroupFormDetailedConfiguration.js',
        'widgets/grid/gridWidget',
        '../conf/appsigGroupGridViewDetailsConfiguration.js'
    ], function(Backbone, FormWidget,ResourceView, AppSigDetailedConfiguration,AppSigGroupDetailedConfiguration,
    GridWidget, AppSigGroupGridConf) {
        var AppSigFormView = ResourceView.extend({
            events: {
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
                this.model = options.activity.model;
                this.formMode = this.model.formMode;
            },
            /**
             * Renders the form view in a overlay.
             *
             * returns this object
             */
            render: function() {
                var me = this,formConfiguration;

                  if(this.formMode === this.MODE_VIEW){
                      formConfiguration = new AppSigDetailedConfiguration(this.context)
                  }
                  if(this.formMode === this.MODE_VIEW_GROUP){
                      formConfiguration = new AppSigGroupDetailedConfiguration(this.context)
                  }
                    formElements = formConfiguration.getValues();
                    me.addDynamicFormConfig(formElements);

                      me.form = new FormWidget({
                              "container": this.el,
                              "elements": formElements,
                              "values": this.model.attributes
                      });
                me.form.build();

                  if(this.formMode === "VIEWGROUP"){
                       me.createAppSigGrid();
                       me.populateAppSigGroup();
                       this.$el.find(".grid-widget").show();
                  }
                 return me;
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
                    case this.MODE_VIEW:
                        dynamicProperties.title = this.context.getMessage('app_sig_grid_view');
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

        return AppSigFormView;

    }
);
