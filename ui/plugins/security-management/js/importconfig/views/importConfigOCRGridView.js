/**
 * Created by nareshu on 8/17/15.
 */
define(
	[
		'backbone',
		'../conf/importOCRGridConfiguration.js',
		'widgets/grid/gridWidget',
		'../conf/importconfigOCRFormConfiguration.js',
		'widgets/form/formWidget',
		'./importConfigOCRToolTipView.js',        
        'widgets/overlay/overlayWidget',
        'widgets/progressBar/progressBarWidget',
        '../../../../ui-common/js/common/utils/SmUtil.js',
        '../../../../ui-common/js/common/utils/SmProgressBar.js'
	],
	function(Backbone, ImportConfigOCRGridConfiguration, GridWidget, ImportConfigOCRFormConfiguration,FormWidget, OCRTooltipView, OverlayWidget ,ProgressBarWidget, SmUtil, SmProgressBar  ) {
		var ImportConfigOCRView = Backbone.View.extend({

			events: {
	            'click a[name="tooltipView"]': "showObjectTooltip"
	       	},

			initialize: function(options) {


				this.context = options.context;
                this.dataObject = options.dataObject;
                this.uuid = this.dataObject.uuid;

                this.activity = options.activity;
                this.wizardView = options.wizardView;
                this.apis = options.apis;
                this.conflictMap = {};
                this.completed = false;
                this.page = "ocr";


                this.actionTypes = {
		            "RENAME_NEW":"Rename Object",
		            "KEEP_OLD" : "Keep Existing Object",
		            "KEEP_NEW" : "Overwrite with New Object"
     		  	};
     		  	this.actionKeys = {
     		  		"Rename Object" : "RENAME_NEW",
		            "Keep Existing Object" : "KEEP_OLD",
		            "Overwrite with New Object" : "KEEP_NEW"
     		  	};



 				return this;
			},


			render: function() {

				var self = this ,totalRecords,
				ocrFormConf = new ImportConfigOCRFormConfiguration(this.context);
				if(this.dataObject.lastScreen===3){
					this.wizardView.wizard.gotoPage(0);
					return;
				}
				this.dataObject.conflicts = [];
				if(this.dataObject.lastScreen==1){
					this.completed = false;
				}
				// construct the form layout for OCR screen
				this.formWidget = new FormWidget({
				    "elements" : ocrFormConf.getValues(),
				    "container" : this.el
				});
				this.progressBar =  new SmProgressBar({
					"container": this.activity.overlay.getOverlayContainer(),
					"hasPercentRate": false,
					"isSpinner" : true,
					"statusText": "Update Conflicts",
					"progressBarTimeOutCallBack": $.proxy(self.onProgressBarTimeOut, self)
                });



				this.formWidget.build();
				//this.apis.getConflicts(this);
				// buid the Publish device grid
				if(this.completed==true){
					this.showNoRecordsMsg();

				}
				else{
					this.createImportOCRGrid();

				}
				//this.containers = this.$el.find('.objectNameToolTip');

				this.dataObject.lastScreen = 2;
				return this;
			},

            onProgressBarTimeOut: function(){
                var self = this;
                self.activity.overlay.destroy();
             },

			unSubscribeNotificationOnClose : function(){
				console.log('Clear default notification..');
			},

			showNoRecordsMsg : function(){
					 this.messageContainer = this.$el.find('.ocractionbuttonsplaceholder').empty();
					 this.messageContainer.hide();
					 //this.messageContainer.html("<html>No Conflicts to show</hmtl>");
					 this.formWidget.showFormError(this.context.getMessage('ocr_grid_warning_noconflicts'));
					},

			showObjectTooltip: function(event) {
				var self = this,
	            tooltip = $(event.target).attr('datacell'),

	            title = $(event.target).attr('title'),

	            values = {};
	            values.title = $.parseJSON(title);
	            tooltip = $.parseJSON(tooltip);

	            if(tooltip){
	                this.tooltipFormView =  new OCRTooltipView({
	                	parentView: this,
	                    data: values
                   	});
                    this.toolTipOverlay = new OverlayWidget({
	                        view: this.tooltipFormView,
	                        type: "medium"
	                    });
	                  	this.toolTipOverlay.build();
	                toolTipContainer = this.tooltipFormView.$el.find(".tooltipInfo").empty();
                    //this.getToolTipInfo(toolTipContainer);

                    toolTipContainer.html(unescape(tooltip));

	            }
      		  },

			createImportOCRGrid: function(){
				var me = this,
                gridContainer = me.$el.find('.ocrgridplaceholder').empty(),gridConfig,

                importConfigOCRGridConf = new ImportConfigOCRGridConfiguration(me);
                me.$el.find('.ocractionbuttonsplaceholder').empty();
                me.actionEvents =
                		{
                    	"renameobject" : "renameObjectAction",
                    	"overwrite" : "overwriteObjectAction",
                    	"keepobject" : "KeepObjectAction",
                    	};

                me.gridContainer = gridContainer;
                //Here the height is the total of all the sections other than grid sections and header/footer etc etc  which need to be subtracted from
                //overlay height Note that Here 180 is also considered as grid header/footer height subtracted from the grid container height
                var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay(430) ;
                gridConfig = importConfigOCRGridConf.getValues(this.uuid);
                gridConfig['height'] = toBePaddedHeight + 'px';
                //remove the buttons row div
                this.$el.find('#ocr-form').find('.buttons.row').hide();
                me.importConfigOCRGrid = new GridWidget({
                    container: gridContainer,
                    elements: gridConfig,
                    actionEvents: me.actionEvents

                });

	           this.createGrid();


	            // binding the grid action events.
           		me.bindEvents();

	            me.internalGrid = gridContainer.find('.gridTable');

			},

            /**
             * Build the grid
             */
            createGrid: function() {
                this.importConfigOCRGrid.build();
            },

			cacheOCRData: function(){
				var me = this;
			    var records = me.importConfigOCRGrid.getAllVisibleRows();
	            var rowCount = records.length;
	            if(rowCount>0){
	            	for(var i=0; i<rowCount;i++){
	            		var record = records[i];
	            		record.permittedResolutions = me.dataObject.ocrRecords[i];
	            		me.conflictMap[record.id] = record;
	            	}

	            }
			},

			isActionPermitted: function(permittedResolution,currAction){

				var me = this, approve = false;

					if(permittedResolution && currAction){
						
						for(var j=0;j<permittedResolution.length;j++){
							if(permittedResolution[j]["resolution-name"]===currAction){
								approve = true;
								break;
							}
						}
						return approve;
					}
					else{
						return false;
					}

			},
			isApproved : function (rowId, action) {
			  var me = this, permittedResolution = me.conflictMap[rowId]["permitted-resolutions"]["object-resolution-action"],
        approveAction = me.isActionPermitted(permittedResolution, action);
			  return approveAction;
			},
			bindEvents : function() {
      var me = this;
      me.$el.bind(me.actionEvents.renameobject, function(e, selected) {
        var selectedRows = selected.selectedRows;
        for (var i = 0; i < selectedRows.length; i++) {
          var changedRow = selectedRow = selectedRows[i], approveAction = me.isApproved(selectedRow.id, "RENAME_NEW");
          if (approveAction === true) {
            changedRow['resolution'] = "RENAME_NEW";
            me.importConfigOCRGrid.removeEditModeOnRow();
            me.importConfigOCRGrid.editRow(selectedRow, changedRow);
          }
        }
      });

      me.$el.bind(me.actionEvents.overwrite, function(e, selected) {
        var selectedRows = selected.selectedRows;
        for (var i = 0; i < selectedRows.length; i++) {
          var changedRow = selectedRow = selectedRows[i], approveAction = me.isApproved(selectedRow.id, "KEEP_NEW");
          if (approveAction === true) {
            changedRow['resolution'] = "KEEP_NEW";
            var record = me.conflictMap[selectedRow.id];
            if (!(record["new-name"] === changedRow["new-name"])) {
              changedRow["new-name"] = record["new-name"];
            }
            me.importConfigOCRGrid.removeEditModeOnRow();
            me.importConfigOCRGrid.editRow(selectedRow, changedRow);
          }
        }
      });

      me.$el.bind(me.actionEvents.keepobject, function(e, selected) {
        var selectedRows = selected.selectedRows;
        for (var i = 0; i < selectedRows.length; i++) {
          var changedRow = selectedRow = selectedRows[i], approveAction = me.isApproved(selectedRow.id, "KEEP_OLD");
          if (approveAction == true) {
            changedRow['resolution'] = "KEEP_OLD";
            var record = me.conflictMap[selectedRow.id];
            if (!(record["new-name"] === changedRow["new-name"])) {
              changedRow["new-name"] = record["new-name"];
            }
            me.importConfigOCRGrid.removeEditModeOnRow();
            me.importConfigOCRGrid.editRow(selectedRow, changedRow);
          }
        }
      });

      /*
       * me.$el.bind(me.actionEvents.editobjectname, function(e, selectedRow){
       * if(selectedRow['selectedRows'][0]['resolution']==me.actionTypes['RENAME_NEW']){
       * var rowId = selectedRow['selectedRowIds'][0];
       * me.importConfigOCRGrid.addEditModeOnRow(rowId); } });
       */

    },
    close: function(){
        console.log('OCR view close..');
        if(this.activity.overlay.progressBar){
			this.activity.overlay.progressBar.destroy();
		}
        this.unSubscribeNotificationOnClose();
    },

			
			save:  function(columnName, data) {
          
        	},

			beforePageChange: function(currentStep, nextStep) {
				var self = this, conflicts;
				if(!self.completed && nextStep==2){
					//this.gridContainer.hide();
					 self.progressBar = new SmProgressBar({
                     "container": this.activity.overlay.getOverlayContainer(),
                     "hasPercentRate": false,
                     "isSpinner" : true,
                     "statusText": "Update Conflicts",

                     });
                	
					self.progressBar.build();
					self.activity.overlay.progressBar = this.progressBar;
					self.wizardView.showMask(self.progressBar);
					conflicts = self.importConfigOCRGrid.getAllVisibleRows();
					  var rowCount = conflicts.length;
	           	
		            	for(var i=0; i<rowCount;i++){
		            		var record = conflicts[i];
		            		conflicts[i]["resolved-ref-ids"]=self.conflictMap[record.id]["resolved-ref-ids"];
		            		conflicts[i]["resolution"] = this.actionKeys[conflicts[i]["resolution"]];
		            	}
	            	
					self.dataObject.conflicts = conflicts;
					self.resolveConflicts();
				}
				else if(nextStep == 0){
					 //self.progressBar.destroy();
                     //self.wizardView.removeMask();
             		return true;
				}
				else{
        			self.progressBar.destroy();
                    self.wizardView.removeMask();
					return self.completed;
				}

			},

			resolveConflicts: function(){
			  var self = this;

			  if(self.dataObject.conflicts.length == 0 ){
			  	self.apis.getGenerateSummaryReport(self);

			  }
			  else{
			  data = {
                "object-conflicts": {
                	"object-conflict" : self.dataObject.conflicts
                	}
           		 };

			  $.ajax({
                "url": '/api/juniper/sd/policy-management/import/object-conflicts?uuid='+self.uuid,
                "type": 'post',
                "contentType": 'application/vnd.juniper.sd.policy-import-management.object-conflicts+json;version=1;charset=UTF-8',
                "processData": false,
                "data": JSON.stringify(data),
                "success": function( data, textStatus, jQxhr ) {
                    console.log("pushed conflicts - Success");
                    //self.callTheCallback(callbackJson, data);
                    // self.progressBar.destroy();
                     //self.deviceILP.wizard.gotoPage(3);
                     self.progressBar.setStatusText("Processing");
                     self.apis.calculateConflicts(self);
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                    self.progressBar.destroy();
                }
            });

			}
			},

			getTitle: function(){

				return "";
			},

			getSummary: function(){
				var self = this;
    			self.dataObject.lastScreen=3;

			}

		});
		return ImportConfigOCRView;
	}
);