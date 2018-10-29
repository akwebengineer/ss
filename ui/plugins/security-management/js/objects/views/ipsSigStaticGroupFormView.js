/**
 * Created by vinamra on 8/24/15.
 */


define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/grid/gridWidget',
        'widgets/overlay/overlayWidget',
        '../../../../ui-common/js/views/apiResourceView.js',
        '../views/ipsSigStaticFormView.js',
        '../conf/ipsSig.js',
        '../conf/ipsSigStaticFormConfiguration.js',
        '../conf/ipsSigStaticGridConfiguration.js',
        '../conf/ipsSigGridConfiguration.js',
        './ipsSigSelectedListGridView.js',
          '../../../../ui-common/js/common/utils/SmProgressBar.js'
    ],

    function(Backbone, Syphon, FormWidget, GridWidget, OverlayWidget, ResourceView, StaticFormView,
             IPSSigJSON, IPSSigStaticConf, IPSSigStaticGridConf, IpsSigGridConfiguration, IPSSigSelectedListGridViewRHS,SmProgressBar) {
    
        var IpsSigStaticGroupFormView = ResourceView.extend({

            events: {
                'click #ips-sig-static-group-save': "submit",
                'click #ips-sig-static-group-cancel': "cancel"
            },

            /**
             * The constructor for the ips signature form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {
                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.formMode = this.model.formMode;

                this.successMessageKey = 'ips_sig_create_success';
                this.editMessageKey = 'ips_sig_edit_success';
                this.fetchErrorKey = 'ips_sig_fetch_error';
                this.fetchCloneErrorKey = 'ips_sig_fetch_clone_error';
                this.ipssigData = new Backbone.Collection();
               
                //During create: To copy the selected rows from Signatures grid
                if(this.model.type==='staticgroup'){
                    this.selectedRows = this.model.selectedRows;
                }
            },

            render: function() {
                var me = this,
                    formConfiguration = new IPSSigStaticConf(this.context),
                    formElements = formConfiguration.getValues(),
                    ipsSigDataModel = new IPSSigJSON();

                me.addDynamicFormConfig(formElements);

                me.ipsSigflatValues = ipsSigDataModel.toFlatValues(me.model.attributes);

                if(this.selectedRows){
                    me.ipsSigflatValues['members'] = this.selectedRows;
                }

                me.form = new FormWidget({
                    "container": this.el,
                    "elements": formElements,
                    "values": me.ipsSigflatValues
                });

                me.form.build();
                me.$el.addClass("security-management");

                /* get the selected signature ids if exisit 
                @param - selectedSig : selected signatures id */
                if(me.model != undefined){
                    var membersData,attackData = me.model.attributes;
                    if(attackData != undefined && attackData.members != undefined){
                       membersData = attackData.members['ips-signature'];
                    }
                    else {
                        membersData = this.activity.view.gridWidget.getSelectedRows(true);
                    }
                }
                /* call base class to create the grid widget for the signatures. */
                self.gridWidget = new IPSSigSelectedListGridViewRHS({"parentView" : me ,"selectedSig" : membersData});
                this.delstore =  self.gridWidget.uuid;
                

                this.$el.find(".ips-sig-static-grid").show();

                return me;
            },
            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
                switch (this.formMode) {
                    case this.MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('ips_sig_static_group_create_title');
                        break;
                    case this.MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('ips_sig_static_group_modify_title');
                        break;
                    case this.MODE_CLONE:
                        dynamicProperties.title = this.context.getMessage('ips_sig_static_group_clone_title');
                        break;
                }
                _.extend(formConfiguration, dynamicProperties);
            },
            close : function() {
                this.deleteStore();
                if(this.smProgressBar){
                  this.smProgressBar.destroy();
                }
            },
            /* Methods to delete the store when the overlay is closed */
            deleteStore : function(){
                $.ajax({
                    url: '/api/juniper/sd/ips-signature-management/item-selector/'+ this.delstore ,
                    type: 'DELETE',
                    headers: {
                        'Content-Type': 'application/vnd.juniper.sd.ips-signature-management.item-selector.select-signatures+json;version=1;charset=UTF-8',
                       'accept': 'application/vnd.juniper.sd.ips-signature-management.signatures+json;version=1;q=0.01'
                    },
                    success: function() {
                       console.log("clean item-selector store by id");
                    },
                    error: function() {
                        console.log('Unable to Delete store');
                    }
                });
            },
            submit: function(event) {
                /* code updated as per the change in approach */
                if (this.form.isValidInput(this.$el.find('form'))) {
                  event.preventDefault();
                  this.bindModelEvents();
                  var members = [],
                  properties = {};

                  properties['name'] = this.$el.find('#ips-sig-name').val();
                  properties['sig-type'] = 'static';
                  properties['definition-type'] = 'CUSTOM';
                 
                 selectedItems = self.gridWidget.sigGroupGrid.getSelectedRows(true)
                
                /* update the selected signature from the grid */
                 selectedIds =  self.gridWidget.updateDataRHS(self.gridWidget.uuid);

                  selectedIds.forEach(function (id ,indx) {
                    members.push({id: selectedIds[indx]['id']});
                });

                  
                 
                  if(selectedIds.length < 1){
                      this.form.showFormError(this.context.getMessage("ips_sig_required_error"));
                      return false;
                  }      
                  self.progressBar =  new SmProgressBar({
                    "container": this.activity.overlay.getOverlayContainer(),
                    "hasPercentRate": false,
                    "isSpinner" : true
                  });
                  self.progressBar.build();  

                  properties['members'] = {};
                  properties['members']['ips-signature'] = members;
                  this.model.set(properties);
                  this.model.save();
                }
            },
             getRowIds: function (setIdsSuccess, setIdsError, tokens, parameters) {
                var baseUrl = '/api/juniper/sd/ips-signature-management/item-selector/'+ this.delstore ;
               return new GridUtility().getRowIds(setIdsSuccess, setIdsError, tokens, parameters, baseUrl);
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

        return IpsSigStaticGroupFormView;
    });