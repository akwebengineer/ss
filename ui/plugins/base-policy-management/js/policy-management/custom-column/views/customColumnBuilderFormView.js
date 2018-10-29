/**
 * @author skesarwani
 * Form View for Custom Column Create/Modify 
 */

define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',    
    'widgets/overlay/overlayWidget',       
    '../conf/customColumnFormConfiguration.js',
    '../conf/customColumnGridConf.js',    
    '../../../../../ui-common/js/views/apiResourceView.js',
    './customColumnCreateFormView.js',
    '../model/customColumnCollection.js',
    '../model/customColumnModel.js',
    '../../constants/basePolicyManagementConstants.js'
],

function(Backbone, Syphon, FormWidget, GridWidget, OverlayWidget,CustomColumnFormConfiguration,
         CustomColumnGridConf,ResourceView,CustomColumnFormView,CustomColumnCollection, CustomColumnModel, PolicyManagementConstants) {

    var CustomColumnBuilderView = ResourceView.extend({
        
        events: {
            'click #custom-column-ok': "okClickHandler"
        },
       
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.params = options.params;
            this.collection = new CustomColumnCollection(null, {
              url : PolicyManagementConstants.CUSTOM_COLUMN_GET_URL,
              "accept": PolicyManagementConstants.CUSTOM_COLUMN_GET_ACCEPT_URL
            });
        },
        
        render: function() {
            var customColumnBuilderFormConf = new CustomColumnFormConfiguration(this.context);
            this.$el.addClass("security-management"); 
            this.formWidget = new FormWidget({
                "elements": customColumnBuilderFormConf.getValues(),
                "container": this.el
            });
            this.formWidget.build();
            this.buildCustomColumnGrid();            
            return this;
        },
        loadCustomColumnGrid : function () {
          var self = this;
          self.collection.fetch({
            sord: 'asc',
            success : function(collection, response, options) {
              $('#' + self.tableId).jqGrid('clearGridData');
              self.customColumnGridWidget.addPageRows(response['custom-columns']['custom-column'], {
                numberOfPage : 1,
                totalPages : 1,
                totalRecords : response['custom-columns']['total']
              });
            },
            error : function() {
              console.log('Error in loading the custom column data');
            }
          });
        },

        buildCustomColumnGrid: function(){
          var self = this,
          customColumnGridConf = new CustomColumnGridConf(self.context), config = customColumnGridConf.getValues(),
          gridContainer = self.$el.find('.gridWidgetSmallPlaceHolder').empty();
          self.tableId = config.tableId;
          self.customColumnGridWidget = new GridWidget({
              container: gridContainer,
              actionEvents : customColumnGridConf.getEvents(),
              elements: config
          }).build();
          self.loadCustomColumnGrid();
          this.bindContextEvents(customColumnGridConf.getEvents());
        },

        bindContextEvents: function(definedEvents) {
            // create button for custom column
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.addCustomColumnAction, this));
            }
            // edit button for custom column
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.modifyCustomColumnAction, this));
            }
            // delete button for custom column
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteCustomColumnAction, this));
            }                
        },

                /**
         * @private
         *
         * This will popup a form to add custom column
         * This is invoked when the user clicks on the create button of the custom column name grid.
         * */
        addCustomColumnAction: function() {
            // Form for context create
            var model = new CustomColumnModel({}, 
            {
              url : PolicyManagementConstants.CUSTOM_COLUMN_CREATE_URL,
              'contentType': PolicyManagementConstants.CUSTOM_COLUMN_CREATE_CONTENT_URL,
              'accept': PolicyManagementConstants.CUSTOM_COLUMN_CREATE_ACCEPT_URL
            }),
            overlayGridForm = new CustomColumnFormView({
                parentView: this,
                model : model,
                params: {
                  formMode: "create",                             
                }
            });         
            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'small',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        //Edit selected custom column
        modifyCustomColumnAction: function(e, row) {
            // Form for context update
            var id = row.originalRow.slipstreamGridWidgetRowId,
            model = this.collection.get(id), overlayGridForm;
            model.url = PolicyManagementConstants.CUSTOM_COLUMN_MODIFY_URL+id;
            model.requestHeaders = model.requestHeaders || {}; 
            model.requestHeaders.contentType = PolicyManagementConstants.CUSTOM_COLUMN_MODIFY_CONTENT_URL;
            
            overlayGridForm = new CustomColumnFormView({
                parentView: this,
                model : model,
                params: {
                    formMode: "edit",
                    flatValues: row.originalRow,
                    id: id,
                    originalRow : row.originalRow,
               }
            });

            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'small',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },         

        /**
         * call back handler delete event to update the local cache
         * 
         * @param  {e} event
         * @param  {[array]} array of selected objects for delete
         */
        deleteCustomColumnAction: function(e, selectedObj){ 
                              
            var self = this; 
            var toDelete = {"id-list" : {"ids" : selectedObj.selectedRows.selectedRowIds }};

            $.ajax({
                url: PolicyManagementConstants.CUSTOM_COLUMN_DELETE_URL,
                type: 'POST',
                data: JSON.stringify(toDelete),
                dataType: 'json',
                headers: {      
                 'content-type': PolicyManagementConstants.CUSTOM_COLUMN_DELETE_CONTENT_URL,
                },                         
                success: function (data) {
                    
                self.activity.view.notify('success', self.activity.context.getMessage("delete_success"));
                console.log("successfully deleted custom column");            
                },
                error: function () {
                    
                self.activity.view.notify('error', self.activity.context.getMessage("delete_error"));                 
                console.log("error deleting custom colum");                  
                }                           
            });
        },
              
        okClickHandler: function(event) {
          event.preventDefault();
          this.activity.overlay.destroy();         
        }
    });

    return CustomColumnBuilderView;
}
);

