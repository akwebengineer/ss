/**
 * Created by nareshu on 8/17/15.
 */

define(
	[
		'backbone',
		'../conf/importConfigServicesGridConfiguration.js',
		'widgets/grid/gridWidget',
    '../../../../ui-common/js/common/utils/SmProgressBar.js',
    '../conf/importconfigServicesFormConfiguration.js',
    '../../../../ui-common/js/common/utils/SmUtil.js',
    'widgets/form/formWidget'
	],
	function(Backbone, ImportConfigServicesGridConfiguration, GridWidget, SmProgressBar, ImportConfigServicesFormConfiguration, SmUtil, FormWidget ) {
		var ImportConfigServicesView = Backbone.View.extend({

            events: {
                'click a[class="Juniper_space_sm_imports_navigateToSigDBWorkspace_SigDB"]': "navigateToSigDB",
                'click a[class="Juniper_space_sm_imports_navigateToSigDBWorkspace_SigInstall"]': "navigateToSigDB",
            },

			initialize: function(options) {
				this.context = options.context;
				this.dataObject = options.dataObject;
                this.activity = options.activity;
                this.wizardView = options.wizardView;
                this.apis = options.apis;
               
				return this;
			},
      /**
       * On reload of grid data make the service selection by default only in case of Roll back work flow 
       */
      onGridDataLoad : function() {
        if(this.wizardView.contextType === 'IMPORT') {
          return;
        }
        var me = this, gridTable = me.$el.find("#services-ilp"), ids = me.getDataIds(gridTable);
        me.importConfigServicesGrid.toggleRowSelection(ids, 'selected');
      },

            getDataIds : function(gridTable) {
                return gridTable.jqGrid('getDataIDs');
            },
			render: function() {
                
			    this.$el.empty();
                this.dataObject.isIpsMismatch = false;
                this.progressBar =  new SmProgressBar({
                         "container": this.activity.overlay.getOverlayContainer(),
                         "hasPercentRate": false,
                         "isSpinner" : true,
                         "statusText": "Fetching Managed Services"
                         });
                
                var importConfigServicesGridConf = new ImportConfigServicesGridConfiguration(this),
                servicesFormConf = new ImportConfigServicesFormConfiguration(this.context), gridConfig;
                this.formWidget = new FormWidget({
                    "elements" : servicesFormConf.getValues(),
                    "container" : this.el
                });
                this.formWidget.build();
                this.gridContainer =  this.$el.find('.servicesgridplaceholder').empty();
                this.messageContainer = this.$el.find('.servicesactionbuttonsplaceholder').empty();
                this.messageContainer.hide();
                //Adding the event before grid is build to ensure event is never missed
                this.gridContainer.on('gridLoaded', $.proxy(this.onGridDataLoad, this));
                gridConfig = importConfigServicesGridConf.getValues();
                //Here the height is the total of all the sections other than grid sections and header/footer etc etc  which need to be subtracted from 
                //overlay height Note that Here 180 is also considered as grid header/footer height subtracted from the grid container height
                var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(404) ;
                gridConfig['height'] = toBePaddedHeight + 'px';
                //remove the buttons row div
                this.$el.find('#services-form').find('.buttons.row').hide();
                this.importConfigServicesGrid = new GridWidget({
                    container: this.gridContainer,
                    elements: gridConfig
                });

                this.createGrid();

                this.postInitiated = false;
                this.dataObject.lastScreen = 1 ;
                return this;
			},

            /**
             * Build the grid
             */
            createGrid: function() {
                this.importConfigServicesGrid.build();
            },

            navigateToSigDB: function(event) {
                var self = this,
                tooltip = $(event.target).attr('datacell'),

                title = $(event.target).attr('title'),

                values = {},
                intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_LIST,
                {
                    mime_type: 'vnd.juniper.net.signature-database'
                }
                );
                intent.putExtras(values);
                self.context.startActivity(intent);
                self.activity.overlay.destroy();
            },

			getTitle: function() {
			    return "";
			},

            close: function(){
                console.log('servies view close..');
                if(this.activity.overlay.progressBar){
                    this.activity.overlay.progressBar.destroy();
                }
                this.unSubscribeNotificationOnClose();
            },

			beforePageChange: function(currentStep, step) {
                var selectedServices = this.getSelectedRows(),
                self = this, disAllowImport = false;
                if(selectedServices.length ==0){
                    this.formWidget.showFormError(this.context.getMessage('managed_services_grid_warning_selection'));
                    return false;
                }

                if(this.dataObject.isIpsMismatch){

                    for(var i=0;i<selectedServices.length;i++){
                           if(selectedServices[i]["service-type"] ==="IPSPOLICY"){
                            disAllowImport = true;
                            break;
                           }
                       }
                    if(disAllowImport){       
                    this.showIpsMismatchMsg();
                    return;
                    }
                }
                

               if((!this.postInitiated)&&step==1) {
                    this.postInitiated = true;
                    //this.$el.empty();
                    
                    console.log("Selected Services :"+ selectedServices.length);
                    this.progressBar =  new SmProgressBar({
                        "container": this.activity.overlay.getOverlayContainer(),
                        "hasPercentRate": false,
                        "isSpinner" : true,
                        "statusText": "Processing",
                        "progressBarTimeOutCallBack":  $.proxy(this.destroyProgressBar, this)
                    });
                    this.activity.overlay.progressBar = this.progressBar;
                    this.progressBar.build();
                    this.wizardView.showMask(this.progressBar);
                   
                    this.dataObject.readyForNext = false;
                    this.apis.postManagedServices(this);
                    
                }
                return this.dataObject.readyForNext;
			},

            getSelectedRows: function() {
              return   this.importConfigServicesGrid.getSelectedRows();
            },

            destroyProgressBar : function(){
                var self = this;
                self.activity.overlay.destroy();
            },
            unSubscribeNotificationOnClose : function(){
                console.log('Clear default notification..');
            },

            showIpsMismatchMsg : function(){
                    //this.gridContainer = this.$el.find('.servicesgridplaceholder').empty();
                    // this.gridContainer.hide();
                     this.messageContainer = this.$el.find('.servicesactionbuttonsplaceholder').empty();
                     this.messageContainer.hide();
                     this.formWidget.showFormError(this.context.getMessage('services_grid_error_mismatch'));
                    },

            showNoRecordsMsg : function(){
                     this.gridContainer = this.$el.find('.servicesgridplaceholder').empty();
                     this.gridContainer.hide();
                     this.messageContainer = this.$el.find('.servicesactionbuttonsplaceholder').empty();
                     this.messageContainer.hide();
                     //this.messageContainer.html("<html>No Conflicts to show</hmtl>");
                     this.formWidget.showFormError(this.context.getMessage('services_grid_warning_noservices'));
                    },

            /**
             * Summarize the current Page Information
             */


            getSummary: function(){
                var self = this;
                var summaries =[];
                if(this.wizardView.contextType=="IMPORT"){
                summaries.push({"label":"Selected Device","value": self.dataObject.selectedRecord["name"]});
                summaries.push({"label":"Selected Device IP","value": self.dataObject.selectedRecord["device-ip"]});
                 }
                else{
                 summaries.push({"label":"Selected Policy","value": self.dataObject.selectedRecord["name"]});
                 summaries.push({"label":"Selected Version","value": self.dataObject.params.version});
               
                }

                if(self.dataObject.ocrSummaries){
                summaries = summaries.concat(self.dataObject.ocrSummaries);
                }
                console.log("Summaries :"+summaries );
                return summaries;

            }


		});
		return ImportConfigServicesView;
	}
);