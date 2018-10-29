/**
 * Created by vinutht on 5/28/15.
 */
define(
    [
        'backbone',
        'backbone.syphon',
        '../conf/appsigGroupGridConfiguration.js',
        'widgets/form/formWidget',
        'widgets/grid/gridWidget',
        'widgets/dropDown/dropDownWidget',
        'widgets/form/formValidator',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/appsigGridConfiguration.js'
    ],

    function(Backbone, Syphon, appsigGroupGridConf, FormWidget, GridWidget, DropDownWidget, FormValidator, ResourceView, GridConfig) {

            var MODE_CREATE = 'create',
            MODE_EDIT = 'edit';
            var AppSigGroupFormView = ResourceView.extend({
            events: {
                'click #sd-appsig-group-cancel': "cancel",
                'click #sd-appsig-group-save': "update"
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
                this.protocol = options.protocol;
                this.selectedRowIds = options.selectedRows;

            },

            /**
             * Renders the form view in a overlay.
             *
             * @return returns this object
             */
            render: function() {


                var formConfig = new appsigGroupGridConf(this.context),
                    formElements = formConfig.getValues();
                var config ={id:'appSig_group',selectedRowIds:this.selectedRowIds};
                var gridConfig = new GridConfig(this.context),
                    gridElements = gridConfig.getValues(config);

                this.formWidget = new FormWidget({
                    "elements": formElements,
                    "container": this.el
                });
                this.formWidget.build();

                var gridContainer = this.$el.find('.appsiggroup').empty();

                this.gridWidget = new GridWidget({
                    container: gridContainer,
                    elements: gridElements
                });
                this.gridWidget.build();
                return this;
            },
            cancel: function(event) {
                event.preventDefault();
                this.parentView.overlay.destroy();
            },
            update: function(event) {
                var selected = this.gridWidget.getSelectedRows();

                for(i=0;i<selected.length;i++) {
                    this.parentView.appsigData.add(selected[i]);
                    this.parentView.appsigGrid.addRow(selected[i],true);
                }
                this.parentView.overlay.destroy();
            }

        });

        return AppSigGroupFormView;
    }
);