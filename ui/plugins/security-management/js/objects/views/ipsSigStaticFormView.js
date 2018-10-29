/**
 * Created by wasima on 8/24/15.
 */
define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/grid/gridWidget',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../conf/ipsSigStaticGroupGridConfiguration.js',        
        './ipsSigSelectedListGridView.js'
    ],

    function(Backbone, Syphon, FormWidget, GridWidget, ResourceView, ipsSigGroupGridConf,IpsSigSelectedListGridView) {

            var MODE_CREATE = 'create',
            MODE_EDIT = 'edit';
            var IpsSigGroupFormView = ResourceView.extend({
            events: {
                'click #sd-ipssig-group-cancel': "cancel",
                'click #sd-ipssig-group-save': "update"
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
                this.selectedRowIds = options.selectedRows;
            },

            /**
             * Renders the form view in a overlay.
             *
             * @return returns this object
             */
            render: function() {
                var  self=this,
                    formConfig = new ipsSigGroupGridConf(self.context),
                    formElements = formConfig.getValues();

                self.formWidget = new FormWidget({
                    "elements": formElements,
                    "container": self.el
                });
                self.formWidget.build();
            
               self.gridWidget = new IpsSigSelectedListGridView({parentView: self });
                return self;
            },
            cancel: function(event) {
                event.preventDefault();
                this.parentView.overlay.destroy();
            }

        });

        return IpsSigGroupFormView;
    }
);