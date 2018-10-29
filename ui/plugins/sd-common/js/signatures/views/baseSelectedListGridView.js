/**
 *
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
 /* baseSelectedListGridView - create the base grid */
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../../../../ui-common/js/views/apiResourceView.js',
    'widgets/overlay/overlayWidget',
    '../../../../ui-common/js/util/gridUtility.js'
], function (Backbone, FormWidget, GridWidget, ResourceView,OverlayWidget,GridUtility) {

    var baseSelectedListGridViewRHS = ResourceView.extend({
        
        initialize: function(options) {
            this.parentView = options.parentView;
            //this.context = options.activity.context;
            this.sigGroupGridConf = options.sigGroupGridConf;
            this.uuid = this.generateStoreId();
            this.gridUtility = new GridUtility();
        },
        /*mandatory methods that needs to be defined at base class.
                  updateGridConf()
                  updatesigData()
                  deleteRecords()
                  */
         
        createSigGroupGrid: function() {           
            
             var sigGroupGridContainer = this.parentView.$el.find('#'+this.gridContainerId).empty(),
             actionEvnt = {},
            gridElements = this.sigGroupGridConf.getValues();
            /* update the gridElements 
            @param - url , header details . 
           */
            gridElements = this.updateGridConf(gridElements);

             gridElements.numberOfRows = 500;
             gridElements.height = '420px';
               
            this.sigGroupGrid = new GridWidget({
                container: sigGroupGridContainer,
                elements: gridElements,
                  actionEvents: this.options.isDefined ? actionEvnt : this.sigGroupGridConf.getEvents()
            }).build();


            gridElements.onSelectAll = $.proxy(this.getRowIds,this);

            sigGroupGridContainer.find(".grid-widget").addClass("elementinput-long-ips-sig-static-grid");

            this.bindEvents(this.sigGroupGridConf.getEvents());

            if(this.parentView.formMode === 'EDIT' || this.options.selectedSig.length > 0 ) 
            { 
                var members=[],signatureId;
                signatureId = this.options.selectedSig;
               
                signatureId.forEach(function (id ,indx) {
                      members.push(signatureId[indx]['id']);
                });

                this.sigSelectorView.updatesigData(this.uuid , members, this);
            }

           
        },
        getRowIds: function (setIdsSuccess, setIdsError, tokens, parameters) {
            /* returns the all the rows from the available list on select All checkbox */
            var baseUrl ='/api/juniper/sd/ips-signature-management/item-selector/'+ this.uuid +'/selected-ids';
            return this.gridUtility.getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
        },
        bindEvents: function(definedEvents) {
            /* create the overlay to show new available signatures- LHS */
            if (definedEvents.createEvent) {
                this.parentView.$el.bind(definedEvents.createEvent, $.proxy(this.createAction, this));
            }
            /* delete the selected signatures */
            if (definedEvents.deleteEvent) {
                this.parentView.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteAction, this));
            }
        },

        createAction: function() {
            /* Get the view from the basesigAvailableview */
            this.overlayLHS = new OverlayWidget({
                view: this.sigSelectorView,
                type: 'large',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlayLHS.build();
       
            return this;
        },
        deleteAction :function(e, selectedObj) {
          
            var selectedRowId = [] ;
            if(selectedObj.isSelectAll) {
                 $(selectedObj.selectedRows.allRowIds).each(function (i) {
                    selectedRowId[i] = selectedObj.selectedRows.allRowIds[i];
                 })

            }else {
                $(selectedObj.deletedRows).each(function (i) {
                    selectedRowId[i] = selectedObj.deletedRows[i]['id'];
                })
            }
            /* delete the selected signatures and update the backend api 
             Method written in the child class - ipsSigAvailablegrid view*/
            this.deleteRecords(this.uuid,selectedRowId);
        },
        /* generate the random store Id - uuid */
        generateStoreId: function() {
            return Math.ceil(Math.random() * 1000000);
        },
        updateGridConf : function(gridElements) {
            //child class
            return ;
        },
        deleteRecords : function(uuid,selectedrowid) {
           
        },
        updatesigData : function(uuid , members, obj) {
            
        }
        
    });

    return baseSelectedListGridViewRHS;
});
