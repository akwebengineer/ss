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
        '../conf/baseSigSelectorFormConf.js',
        '../../../../ui-common/js/util/gridUtility.js'
    ],

    function(Backbone, Syphon, FormWidget, GridWidget, ResourceView, SigGroupGridConf, GridUtility) {

        var baseSigAvailableListGridViewLHS = ResourceView.extend({
            events: {
                'click #sd-sig-group-cancel': "cancel",
                'click #sd-sig-group-save': "update"
           },

            /**
             * The constructor for the application signature protocol form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {
                this.parentView = options.parentView;
                this.context = options.parentView.context;
                this.currentview = options.currentView;
                this.gridUtility = new GridUtility();
             },

            /**
             * Renders the form view in a overlay.
             *
             * @return returns this object
              *mandatory methods that needs to be defined at base class.
                  updateSigFormLabel()
                  updateSelectorGridConf()
                  updatesigData()
             */
            render: function() {
               
                var self=this,
                    formConfig = new SigGroupGridConf(self.context),
                    formElements = formConfig.getValues(self.formTitleMsgs),
                    gridContainer = self.parentView.$el.find('.siggroup').empty(),
                    gridConfig = self.gridConf,
                    gridElements = gridConfig.getValues(this.config),
                    storeId = self.options.uuid;

                /* update the ips signature titles */
                formElements = this.updateSigFormLabel(formElements);

                self.formWidget = new FormWidget({
                    "elements": formElements,
                    "container": self.el
                });
                self.formWidget.build();

                gridElements.numberOfRows = 500;
                gridElements.height = '420px';

               /* update the gridElements 
                @param - gridElements : {} , url , header details . 
                updateGridConf() : ipsAvaliableListGridView.js */
                gridElements = this.updateSelectorGridConf(gridElements);
               
                this.gridWidget = new GridWidget({
                    container: self.$el.find('.siggroupselector').empty(),
                    elements: gridElements
                });
                self.gridWidget.build();

                gridElements.onSelectAll = $.proxy(self.getRowIds,this);
                //Enabling OK Button on Signature selection.
                self.$el.find('#sd-sig-group-save').addClass("disabled");
                self.$el.find('.siggroupselector').bind("gridOnRowSelection", function(e, selectedRows){
                    if(selectedRows.numberOfSelectedRows<1){
                        self.$el.find('#sd-sig-group-save').addClass("disabled");
                    }else{
                       
                        self.$el.find('#sd-sig-group-save').removeClass("disabled");
                    }
                });

                this.$el.find('.siggroupselector').bind("gridOnSelectAll", function(e, status){
                    if(status){
                        self.$el.find('#sd-sig-group-save').removeClass("disabled");
                    }else{
                        self.$el.find('#sd-sig-group-save').addClass("disabled");
                    }
                });
                
                this.delegateEvents();
                return this;
            },
            cancel: function(event) {
                event.preventDefault();
                this.currentview.overlayLHS.destroy();

            },
            getSelectedRows : function() {
                 /* returns the selected row IDs */
                var me = this, selections = me.gridWidget.getSelectedRows(true),
                allRowIds = selections['allRowIds'];
                return _.isEmpty(allRowIds) ? selections['selectedRowIds'] : allRowIds;
            },
            update: function(event) {
              /*  update the selected rowId's from the available list. */
                this.updatesigData(this.options.uuid ,this.getSelectedRows(),this.currentview);
                
                /* destroy LHS overlay */              
                this.currentview.overlayLHS.destroy();
            },

            getRowIds: function (setIdsSuccess, setIdsError, tokens, parameters) {
                /* returns the all the rows from the available list on select All checkbox */
                var baseUrl = '/api/juniper/sd/ips-signature-management/item-selector/'+ this.options.uuid ;
                return this.gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
            },
            updateSigFormLabel : function(formElements){
                /* method written in the child class.*/
            },
            updateSelectorGridConf : function(gridElements) {
                 /* method written in the child class.*/
            },
            updatesigData : function(uuid,selectedrowIds, currentView) {
                 /* method written in the child class.*/
            }
        });

        return baseSigAvailableListGridViewLHS;
    }
);
