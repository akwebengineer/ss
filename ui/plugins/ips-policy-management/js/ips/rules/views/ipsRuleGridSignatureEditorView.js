/**
 * IPSSig Editor View that extends from base cellEditor & is used to select ipssig 
 *
 * @module IPSRuleGridSignatureEditorView
 * @author Vinamra Jaiswal<vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    '../../../../../base-policy-management/js/policy-management/rules/views/baseCellEditorView.js',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/overlay/overlayWidget',
    '../conf/ipsSigEditorFormConfiguration.js',
    '../../../../../security-management/js/objects/views/ipsSigStaticFormView.js',
    '../../../../../security-management/js/objects/conf/ipsSigStaticGridConfiguration.js',
    '../constants/ipsRuleGridConstants.js',
     '../../../../../security-management/js/objects/views/ipsSigSelectedListGridView.js'
    ],function(Backbone, BaseCellEditorView, FormWidget, GridWidget, OverlayWidget, IPSSigEditorFormConfiguration, 
        IPSSigStaticFormView, IPSSigStaticGridConf, IpsRuleConstants,IpsSigSelectedListGridView) {

        var IPSRuleGridSignatureEditorView = BaseCellEditorView.extend({

            events: {
                'click #save': 'updateDataOnGridAndCache',
                'click #cancel': 'closeOverlay'
            },

            initialize: function() {
                this.context = this.options.context;
                this.model = this.options.model;
                this.ipssigData = new Backbone.Collection();

            },

            render : function(){
                var members, self = this,
                    formConfiguration = new IPSSigEditorFormConfiguration(this.context),
                    formElements = formConfiguration.getValues();

                this.form = new FormWidget({
                    "elements": formElements,
                    "container": this.el
                });

                this.form.build();
                this.$el.addClass("security-management");
               /* check if the data for grid exisit and pull data from model.
                    @param - selectedSig : array of members id.
               */
                if(self.model != undefined){
                    var attackData = self.model.get('attacks');
                    if(attackData != undefined && attackData.reference != undefined){
                       members = attackData.reference;
                    }
                }
                 // create  and populate the grid from the base class.
                self.gridWidget = new IpsSigSelectedListGridView({parentView: self, 'selectedSig' : members  });
                return self;
            },
            /* code refactored and removed as part of grid changes.
            refer to the IpsSigSelectedListGridView for the modified changes.
            Methods deleted : createIpsSignatureGrid().
                       bindEvents(),
                       addAction(),populateIPSSigGrid()
            */
            
            /*Update the model*/
            updateModel: function (e) {
                var self = this, ipsSigRows, ipsSigMembers = [];
                /* call to update the grid data */
                ipsSigRows = self.gridWidget.updateDataRHS(self.gridWidget.uuid);
                // update app signature
                ipsSigRows.forEach(function (object) {
                    ipsSigMembers.push(
                        {
                            'id': object.id,
                            "name": object.name,
                            "domain-id": object['domain-id']
                        });
                });

                var attackData = self.model.get('attacks');
                if(attackData !== undefined){
                    self.model.set({
                        'attacks':{
                            'reference': ipsSigMembers
                        }
                    });
                    self.editCompleted(e,this.model);
                }
            },

            updateDataOnGridAndCache: function (e) {
                this.updateModel(e);
                this.closeOverlay(e);
            },

            saveEditorValuesToCache: function (updatedValuesForAPICall) {
                
            },

            closeOverlay: function (e) {
                this.options.close(this.options.columnName, e);
            },

            setCellViewValues: function (rowData) {
                // to get the values from the grid cell in this view
                this.model = this.options.ruleCollection.get(rowData.originalRowData[IpsRuleConstants.JSON_ID]);
            }
    });
    return IPSRuleGridSignatureEditorView;
});