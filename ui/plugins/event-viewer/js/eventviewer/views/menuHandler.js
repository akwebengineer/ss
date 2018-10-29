/**
 *  A handler for EV Menu options
 *  
 *  @module EventViewer
 *  @author athreyas<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['widgets/overlay/overlayWidget', './settingsFormView.js', './savedFiltersView.js',  "./exportCSVView.js", 'widgets/overlay/overlayWidget',
	'../../../../ui-common/js/common/utils/SmNotificationUtil.js', '../../../../ui-common/js/common/utils/SmProgressBar.js'
], function (overlayWidget, SettingsForm, SavedFiltersView, ExportCSVView, OverlayWidget, SmNotificationUtil, SmProgressBar) {

    var MenuFunctions = function(context) {
    	var smNotificationUtil = new SmNotificationUtil();

    	this.settingsWizardFn = function(){
            var me = this;
            if(me.configs.timeZone.toUpperCase() == "UTC"){
              	me.utcTimeSelection = true;
              	me.localTimeSelection = false;
            } else {
              	me.utcTimeSelection = false;
              	me.localTimeSelection = true;
            }

            var selections = {
                resolveIPSelection : me.configs.resolveIP,
                logsPlaceHolder : me.configs.logsToView,
                utcTimeSelection : me.utcTimeSelection,
                localTimeSelection : me.localTimeSelection
            }, 
          	settingsView = new SettingsForm({"context": me.context, "selections": selections}),
          	conf = {
            	view: settingsView,
            	cancelButton: true,
            	okButton: true,
            	type: 'small'
        	};
            //
            me.overlayWidgetObj = new overlayWidget(conf);
            me.overlayWidgetObj.build();
            //
            me.overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(event){
              	var timeZone = settingsView.getTimeZone(), 
                	isResolveIP = settingsView.isResolveIP(), 
                	numLogs = settingsView.getNumberOfLogs();
              	if(numLogs > 1000 || numLogs < 1){
                	return false;
              	} else {
                	me.configs.timeZone = timeZone;
                	me.configs.resolveIP = isResolveIP;
                	me.configs.logsToView = numLogs;
                	me.refreshContentView();
              	}
            });
        };

        this.exportCSVMenuFn = function(){
	      	console.log("CSV Export Function");
			var me = this, filters = "", size = "-1", uri = [], reqBody,
				start = this.currentTimeRange.startTime.getTime(), 
	        	end = this.currentTimeRange.endTime.getTime();
	        	
		    me.screenID = Math.floor(Math.random() * 1000);

		    reqBody = {
	            "time-interval": this.configs.getRequestFormatTimeString(start) + "/" + this.configs.getRequestFormatTimeString(end),
	         	"size": size,
	         	"job-id": me.screenID
	        };

	      	if(this.configs.request.filters){
	      		filters = this.configs.request.filters;
	        	var reqFilters = {
                    	"filters" : filters
                	};
                reqBody = $.extend({}, reqBody, reqFilters);
			}

			var postData = {
				"request" : reqBody
			}

            uri = ['/api/juniper/sd/task-progress/' + "$" + me.screenID];
            $.proxy(smNotificationUtil.subscribeNotifications, me)(uri, $.proxy(menuHandler.getProgressUpdate, me));

            onSuccessGetCSVfileName = function(response) { // PDF file is created.
                me.fileName = response.responseText;
            };
            
            me.progressBarOverlay =  new SmProgressBar({
                "container": me.$el,
                "hasPercentRate": true,
                "handleMask": true,
				"isSpinner": false,
                "statusText": me.context.getMessage('export_csv_status_text')
            });
            me.progressBarOverlay.build();    
            me.service.getCSVfileName(postData, onSuccessGetCSVfileName);            
        };

        this.getProgressUpdate = function() {
	        var self = this;

	        onProgressUpdateSucsess = function(data, status){
	            var progress = 0;
                if(data['task-progress-response']) {
                    progress = data['task-progress-response']['percentage-complete']/100;
                    self.progressBarOverlay.setStatusText(data['task-progress-response']['current-step']);
                    self.progressBarOverlay.setProgressBar((data['task-progress-response']['percentage-complete'])/100);
                    if(progress >= 1){
                        self.progressBarOverlay.destroy();

                        onSuccessGetCSVfileName = function(response){
                         	var href = "/api/juniper/ecm/log-scoop/download-csv?file-name=" + self.fileName,  
                         	exportCSVView = new ExportCSVView({
                         		"activity": self,
                            	"context": self.context, 
                            	"filePath" : href
                        	}),
                    		conf = {
	                            view: exportCSVView,
	                            cancelButton: false,
	                            okButton: false,
	                            type: 'small'
	                        };

	                        self.exportCSVWidget = new OverlayWidget(conf);
	                        self.exportCSVWidget.build();
	                    }

                        onError = function(){
                        	console.log("getCSVfile() - Error");
                        };

                        self.service.getCSVfile(self.fileName, onSuccessGetCSVfileName, onError);
                        smNotificationUtil.unSubscribeNotifications();                           
                    }
				} 
	        };

	        onProgressUpdateError = function(){
	            console.log("ID retrival failed");
	        };
			
			smNotificationUtil.getTaskProgressUpdate(("$"+ self.screenID), onProgressUpdateSucsess, onProgressUpdateError)
        };

		// Calls Create Filter on Overlay
	    this.createFilterOverlayFn = function(){
	        var me = this,
	            startTime = 0, endTime = 0,
	            duration = 0, timePeriod = '',
	            filtersArr = me.evGrid.getSearchWidgetInstance().getAllTokens(),
	            filterString = me.configs.getFilterString(filtersArr) || "",
	            aggPoint = me.configs.aggPoint? this.configs.aggPoint : this.groupByDropDown.getValue(),
	            category = me.configs.category,
	            selectedFilterId = me.filterManagement['filter-id'],
	            selectedFilterName = me.filterManagement['filter-name'],
	            tags =  me.configs.getCategoryFilterString(category);
	        //
	        console.log("Selected Time Range --> " + me.selectedTimeRange);
	        //
	        if(me.currentTimeRange) {
	            startTime = me.currentTimeRange.startTime,
	            startTime = new Date(startTime).getTime(),
	            endTime = me.currentTimeRange.endTime,
	            endTime = new Date(endTime).getTime();
	        }
	        if (startTime && endTime != 0) {
	            duration    = endTime - startTime;
	            if(duration < 300000) { duration = 300000; }
	            timePeriod = "Last " + this.configs.millisToDaysHoursMinutes(duration);
	            var timeSpanDet = this.configs.preciseTimeSpan(0, duration),
                    unit        = timeSpanDet["unit"];
	        }

            if(filterString == "") {
	            new Slipstream.SDK.Notification().setText("Please enter filter string").setType('error').notify();
	            return false;
	        } else {
	            var filterObj   = {
	               "aggregation": aggPoint,
	               "time-unit": unit,
	               "start-time": startTime,
	               "end-time": endTime,
	               "duration": duration,
	               "tags" :category,
	               "filter-tags" :tags,
	               "time-period": timePeriod,
	               "filter-string": filterString,
	               "formatted-filter": this.getFormattedFilter(),
	               "id" : selectedFilterId,
	               "filter-name" : selectedFilterName
	            };
	        }
	        if(selectedFilterId){
	        	var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_CREATE',{
		            mime_type: 'vnd.juniper.net.eventlogs.alleventcategories.modifyfilter'
		        });
	        } else {
	        	var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_CREATE',{
		            mime_type: 'vnd.juniper.net.eventlogs.alleventcategories.createfilter'
		        });
	        }
	        intent.putExtras({eventCategory:me.configs.category, filterObj:filterObj, filterMgmt: me.filterManagement});
	        this.context.startActivity(intent);
	    };

	    // Create Alert Wizard
	    this.createAlertWizardFn = function(){
	        console.log("Create Alert Wizard is selected");
	        var me = this,
	            duration = 1, timePeriod = '',
	            aggPoint = this.configs.aggPoint? this.configs.aggPoint : this.groupByDropDown.getValue() || "",
	            filtersArr = me.evGrid.getSearchWidgetInstance().getAllTokens(),
	            filterString = me.configs.getFilterString(filtersArr) || "";
	        if(me.currentTimeRange) {
	            var startTime = me.currentTimeRange.startTime,
	                endTime = me.currentTimeRange.endTime;
	        } if (startTime && endTime != 0 ) {
	            duration    = endTime.getTime() - startTime.getTime();
	            if(duration < 300000) { duration = 300000; }
	            if(duration > 86400000) { duration = 86400000;}
	            timePeriod = "Last " + this.configs.millisToDaysHoursMinutes(duration);
	            var timeSpanDet = this.configs.preciseTimeSpan(0, duration),
                    unit        = timeSpanDet["unit"];
	        }
	        if(aggPoint == "" || aggPoint == "none") {
	            new Slipstream.SDK.Notification().setText("Please choose an aggregation point").setType('error').notify();
	            return false;
	        } else if(filterString == "") {
	            new Slipstream.SDK.Notification().setText("Please choose a filter string").setType('error').notify();
	            return false;
	        } else {
	            var filterObj   = {
	                "aggregation": aggPoint,
	                "duration": duration,
	                "durationUnit": unit,
	                "timePeriod": timePeriod,
	                "filterString": filterString,
	                "formattedFilter": this.getFormattedFilter()
	            };
	        }
	      	var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_CREATE',{
	          	mime_type: 'vnd.juniper.net.eventlogs.alleventcategories.createalert'
	      	});
	      	intent.putExtras({filterObj:filterObj});
			this.context.startActivity(intent);
	    };

	    // Create Report Wizard
	    this.createReportWizardFn = function(){
	        var me = this,
	            duration = 1, timePeriod = '',
	            aggPoint = this.configs.aggPoint? this.configs.aggPoint : this.groupByDropDown.getValue() || "",
	            filtersArr = me.evGrid.getSearchWidgetInstance().getAllTokens(),
	            filterString = me.configs.getFilterString(filtersArr) || "",
	            filterObj = me.configs.getFilters(filtersArr) || "";
	     	if(me.currentTimeRange) {
	        	var startTime = me.currentTimeRange.startTime,
	             	endTime = me.currentTimeRange.endTime;
	     	} 
	     	if(startTime && endTime != 0 ) {
	        	duration    = endTime.getTime() - startTime.getTime();
	        	if(duration < 300000) { 
	        		duration = 300000; 
	        	}
	            timePeriod = "Last " + this.configs.millisToDaysHoursMinutes(duration);
	            var timeSpanDet = this.configs.preciseTimeSpan(0, duration),
                    unit        = timeSpanDet["unit"];
	        }
	        if(aggPoint == "" || aggPoint == "none") {
	            new Slipstream.SDK.Notification().setText("Please choose an aggregation point").setType('error').notify();
	            return false;
	        } else if(filterString == "") {
	            new Slipstream.SDK.Notification().setText("Please enter filter string").setType('error').notify();
	            return false;
	        } else {
	            var filterObj   = {
	                "aggregation": aggPoint,
	                "duration": duration,
	                "durationUnit": unit,
	                "timePeriod": timePeriod,
	                "filterString": filterString,
	                "formattedFilter": this.getFormattedFilter()
	            };
	        }

	        var intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_CREATE',{
	            mime_type: 'vnd.juniper.net.eventlogs.alleventcategories.createreport'
	        });
	        intent.putExtras({filterObj:filterObj});

	        this.context.startActivity(intent);
	    };

	    // Displays Saved filters on overlay
	    this.showSavedFiltersFn = function(){
	        var me = this,
            savedFiltersView = new SavedFiltersView({
                eventCategory:me.configs.category,
                context:me.context,
                activity: me
            }),
            conf = {
                view: savedFiltersView,
                showScrollbar: true,
                type: 'large'
            };
	        //
	        me.overlayWidgetObj = new overlayWidget(conf);
	        me.overlayWidgetObj.build();
	        if(!me.overlayWidgetObj.getOverlayContainer().hasClass("event-viewer")){
	            me.overlayWidgetObj.getOverlayContainer().addClass("event-viewer");
	        }
	        //listen for the recent filter selected and destroy the overlay
	        savedFiltersView.$el.on("recentFilterSelected", function(event, selectedRecentFilter){
	            me.overlayWidgetObj.destroy();
	            var selectedFilterStr = selectedRecentFilter['filter-string'],
	                selectedFilterId = selectedRecentFilter['id'],
	                selectedFilterName = selectedRecentFilter['filter-name'],
	                filterObj = {
	                    "filter-id" : selectedFilterId,
	                    "filter-string" : selectedFilterStr,
	                    "filter-name" : selectedFilterName
	                };
	                $.ajax({
	                    url: '/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id='+selectedFilterId,
	                    method: "PUT"
	                });
	            me.setFilter(filterObj);
	        });

	        //listen for the saved filter selected action
	        savedFiltersView.$el.on("savedFiltersSelected", function(event, selectedFilter){
	            me.overlayWidgetObj.destroy();
	            if(selectedFilter) {
	            var selectedFilterStr = selectedFilter['filter-string'],
	                selectedFilterId = selectedFilter['id'],
	                selectedFilterName = selectedFilter['filter-name'],
	                filterObj = {
	                    "filter-id" : selectedFilterId,
	                    "filter-string" : selectedFilterStr,
	                    "filter-name" : selectedFilterName
	                };
	                $.ajax({
	                    url: '/api/juniper/seci/filter-management/filter-usage-by-user?event-filter-id='+selectedFilterId,
	                    method: "PUT"
	                });
	            me.setFilter(filterObj);
	            }
	        });
	    };

	    this.clearFiltersFn = function() {
	        var mimeType =  (typeof this.activity.intent.data.mime_type ==='undefined') ? this.activity.intent.data : this.activity.intent.data.mime_type,
	            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_LIST', {
	            mime_type: mimeType
	        }),
	        request = {
	            'timeRange': {
	                'startTime': new Date().getTime() - 7200000/4,
	                'endTime': new Date()
	            },
	            'filters': {},
	            'aggregation-attributes': "none"
	        };
	        intent.putExtras(request);
	        this.context.startActivity(intent);
	    };

    };

    return MenuFunctions;
});