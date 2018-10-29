/**
 * Landing page for App Visibility
 *
 * @module AppSecureLandingPage
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

 define(['backbone', 'text!../templates/appSecureLandingPage.html', '../views/graphView.js', 'widgets/timeRange/timeRangeWidget',
 	'lib/template_renderer/template_renderer', 'widgets/dropDown/dropDownWidget', '../conf/appSecureConfigs.js', '../service/appSecureService.js', 
 	'widgets/overlay/overlayWidget', './customTimeView.js', 'widgets/tabContainer/tabContainerWidget', '../views/deviceSelectionView.js', "../utils/appVisConstants.js", "widgets/tooltip/tooltipWidget", "text!../templates/helpToolTip.html"], 
 	function(Backbone, AppSecureLandingPageTemplate, GraphView, TimeRangeWidget, template_renderer, DropDownWidget, Config, AppSecureService, OverlayWidget, CustomTimeView, TabContainerWidget, DeviceSelectionView, Constants, TooltipWidget, HelpTemplate){
 	var AppSecureLandingPage = Backbone.View.extend((function(){
 		return{
 			//
 			events:{
 				"change .app-secure-time-span-filter": "onTimeSpanChange",
 				"change .app-secure-group-by-filter": "onGroupByChange",
 				"click .app-secure-container-links": "onViewClick",
 				"click .app-secure-device-links": "onDeviceSelectionClick",
 				"click .app-secure-time-display-edit": "onEditCustomTimeRange"
 			},
 			//
 			initialize: function(options){
 				console.log('App Secure Landing Page initialized');
 				var me=this,
 					extras={},
 					selectedTime;
 				me.activity = options.activity;
 				extras = me.activity.getExtras();
 				me.context = options.activity.getContext();
 				me.configs = new Config(me.context);
 				me.service = new AppSecureService();
 				selectedTime = me.configs.getSelectedTime("7");//default to 1 day instead of 15 min
 				me.defaultFilters = {
 					"device-ids": "",//listSelector works on this
 					"platform-device-ids": "",//sdlr works on this
					"time":{
						"isCustom": false,
						"startTime": selectedTime.startTime,
						"endTime": selectedTime.endTime,
						"selectedTimeSpanId": "7" //Last 1 day
					},
					"groupBy": "0"
 				},
 				me.mergedFilters = $.extend({}, options.filters, me.defaultFilters);
 				//
 				if(extras){
 					me.mergedFilters = $.extend({}, me.mergedFilters, extras);
 				}
 			},
 			//
 			getToolTipView: function(help){
                var tooltipView  = template_renderer(HelpTemplate,{
                    'help-content':help['content'],
                    'ua-help-text':help['ua-help-text'],
                    'ua-help-identifier':help['ua-help-identifier']
                });
                return $(tooltipView);
 			},

 			addToolTipHelp: function(){
 				var me=this;
                new TooltipWidget({
                    "elements": {
                    	"interactive": true,
                    	"maxWidth": 300,
                    	"minWidth": 300,
                    	"position": "right"
                    },
                    "container": me.containers.mainContainer.find('.app-vis-title-help'),
                    "view": me.getToolTipView(me.options.landingPageHelpTitle)
                }).build();
 			},
 			//
 			render:function(){
 				console.log('App Secure Landing Page rendered');
 				var me=this,
 					appSecureLandingPageHtml = template_renderer(AppSecureLandingPageTemplate, {
	 					"header":{
	 						"title": me.options.landingPageTitle
	 					},
	 					"graph-view": true
					});
 				//
 				me.currentViewIndex = 0;
 				//
 				me.$el.addClass("appvisibility");
 				me.$el.append(appSecureLandingPageHtml);
 				//
 				me.containers={
					"mainContainer": me.$el,
					"systemStatusContainer": me.$el.find(".app-secure-system-status-error")
 				};
 				//
 				me.addToolTipHelp();
 				me.validateAppVisSystemStatus();
 				me.buildShowBy();
				me.buildGraphAndChartView();
				me.buildTimeSpan();
				me.buildDevicesLabel();
				//
 				return this;
 			},
 			//
 			validateAppVisSystemStatus: function(){
 				var me=this,
 					onSuccess,
 					onError;
 				//
 				onSuccess = function(response){
 					var errorCode = response.response['error-code'];
 					//
 					if(errorCode === Constants.ERROR_CODES.ERROR_CODE_000){//everything works fine
 						me.containers.systemStatusContainer.hide();
 					}else{
 						me.containers.systemStatusContainer.html(me.configs.getErrorDescription(errorCode))
 						me.containers.systemStatusContainer.show();
 					}
 					//
 				}
 				//
 				onError = function(){
 					console.log("Error in getting the App Vis system status");
 				}
 				me.service.getAppVisSystemStatus(onSuccess, onError);
 			},
 			//
 			updateDateDisplay:function(){
 				var me=this;
 				me.containers.mainContainer.find(".app-secure-time-display").text(me.getTimeRangeToDisplay({
 					"startTime": me.mergedFilters.time.startTime,
 					"endTime": me.mergedFilters.time.endTime
 				}));
 				//
 				if(new Date(me.mergedFilters.time.startTime).getMinutes() === 0){
					me.containers.mainContainer.find(".app-secure-time-display-edit").show();
 				}else{
 					me.containers.mainContainer.find(".app-secure-time-display-edit").hide();
 				}
 				//
 			},
 			//display custom time in an overlay
 			showCustomTimeOverlay: function(startTime, endTime){
 				var me=this,
 					customView = new CustomTimeView({"context": me.context, "timeRange":{
 						"startTime": startTime,
 						"endTime": endTime
 					}}),
 					conf = {
                    	view: customView,
	                    okButton: true,
	                    type:'xsmall'
                	};
                //
	            me.overlayWidgetObj = new OverlayWidget(conf);
	            me.overlayWidgetObj.build();
	            customView.$el.find(".app-secure-custom-time-error").hide();
	           	//
	           	me.overlayWidgetObj.getOverlay().$el.find('#ok').on('click', function(event){
	           		var customTime = customView.getTime(),
                        start = customTime.startTime.getTime(), end = customTime.endTime.getTime();
                    if(start > end){
                        customView.$el.find(".app-secure-custom-time-error").show();
                        setTimeout(function(){
                            customView.$el.find(".app-secure-custom-time-error").hide();
                        }, 3000);
                        return false;
                    } else {
	           			$.extend(me.mergedFilters, {"time":{
	           				"isCustom": true,
							"startTime": customTime.startTime.getTime(),
							"endTime": customTime.endTime.getTime(),
							"selectedTimeSpanId": "8"//8 is for custom
						}});
		 				//
		 				me.containers.mainContainer.find(".app-secure-time-display").show();
		 				me.updateDateDisplay();
		 				//
		 				if(me.currentViewIndex === 0){
		 					me.graphView.refresh(me.mergedFilters);	
		 				}else{
		 					me.gridView.render();
		 				}
		 			}
	 				//
	           	});
	           	//
 			},
 			//
 			buildDevicesLabel: function(){
 				var me = this,
 					selectedDeviceIDs = me.mergedFilters["device-ids"],
 					devicesLabel="";
 				devicesLabel = selectedDeviceIDs === "" ? "All Devices" : "Selective Devices(" + selectedDeviceIDs.split(",").length + ")";
 				me.containers.mainContainer.find("#uSelectedDevices").html(devicesLabel);
 				return me;
 			},
 			//
 			onDeviceSelectionClick: function(event){
 				console.log("device selcetion clicked");
 				var me=this,
 					deviceSelectionView,
 					overLayConf,
 					cancelOverLay,
 					getSelectedItems,
 					overlayWidget;
 				//
				applySelectedDevices = function(selectedDevicesIDs, selectedPltFormDeviceIDs){
					var devicesLabel="";
					$.extend(me.mergedFilters, {"device-ids": selectedDevicesIDs, "platform-device-ids": selectedPltFormDeviceIDs});
	 				me.buildDevicesLabel();
	 				if(me.currentViewIndex === 0){
	 					me.graphView.refresh(me.mergedFilters);
	 				}else{
	 					me.gridView.render();
	 				}
	 				//
				};
				// 				
 				cancelOverLay = function(){
					overlayWidget.destroy();
 				};
 				//
 				getSelectedItems = function(data){
					overlayWidget.destroy();
					var selectedIds="",
						selectedPlatformIds="",
						totalCount = data.devices.device.length;
					if(totalCount > 0){
						data.devices.device.forEach(function(element){
							selectedIds = selectedIds === "" ? element['id'].toString() : selectedIds + "," + element['id'];
							element['plt-ids'].forEach(function(platFormElement){
								selectedPlatformIds = selectedPlatformIds === "" ? platFormElement['id'].toString() : selectedPlatformIds + "," + platFormElement['id'];
							});
						});
					}else{
						selectedIds="";
					}
					applySelectedDevices(selectedIds, selectedPlatformIds);
 				};
 				//
 				deviceSelectionView = new DeviceSelectionView({
 					"context": me.context,
 					"cancelOverlay":cancelOverLay,
 					"getSelectedItems": getSelectedItems,
 					"selectedDeviceIDs":me.mergedFilters['device-ids'] === "" ? [] : me.mergedFilters['device-ids'].split(",")
 				});
 				overLayConf = {
                	"view": deviceSelectionView,
                	"type":"medium",
                	"showScrollBar": true
 				};
 				//
	            overlayWidget = new OverlayWidget(overLayConf);
	            overlayWidget.build();
	            //
 			},
 			//
 			onViewClick:function(event){
 				var me=this,
 					linkId=$(event.currentTarget).data("linkid");
 				//
 				$(me.containers.mainContainer.find(".app-secure-container-links")).each(function(){
 					$(this).addClass("app-secure-container-links-de-selected");
 				});
 				//
 				$(event.currentTarget).removeClass("app-secure-container-links-de-selected").addClass("app-secure-container-links-selected");
 				me.currentViewIndex = linkId;
 				if(linkId === 0){//graphView
 					me.containers.mainContainer.find(".app-secure-group-by-container").show();
					me.containers.mainContainer.find('.app-secure-graph-grid-view').empty().append(me.graphView.render().el);
 				}else{
 					me.containers.mainContainer.find(".app-secure-group-by-container").hide();
 					me.containers.mainContainer.find('.app-secure-graph-grid-view').empty().append(me.gridView.render().el);
 				}
 			},
	        getTimeRangeToDisplay: function(timeRange){
	          var displayTime="",
	          	  hoursFormat="HH:mm A";
	          //
	          if(new Date(timeRange.startTime).getHours() === 0){
				hoursFormat = "";
	          }
	          //
	          if(new Date(timeRange.startTime).getDate() === new Date(timeRange.endTime).getDate() && new Date(timeRange.startTime).getMonth() === new Date(timeRange.endTime).getMonth() && new Date(timeRange.startTime).getYear() === new Date(timeRange.endTime).getYear()){//same date
	              displayTime = Slipstream.SDK.DateFormatter.format(timeRange.startTime, "MM-DD-YYYY");
	              if(hoursFormat.length > 0){
		              displayTime = displayTime + "," + " From " + Slipstream.SDK.DateFormatter.format(timeRange.startTime, hoursFormat)
		              displayTime = displayTime + " to " + Slipstream.SDK.DateFormatter.format(timeRange.endTime, hoursFormat)
	              }
	          }else{
	          	if(hoursFormat.length > 0){
	          		displayTime = "From " + Slipstream.SDK.DateFormatter.format(timeRange.startTime, "MM-DD-YYYY " + hoursFormat) + " to " + Slipstream.SDK.DateFormatter.format(timeRange.endTime, "MM-DD-YYYY " + hoursFormat);	
	          	}else{
	          		displayTime = "From " + Slipstream.SDK.DateFormatter.format(timeRange.startTime, "MM-DD-YYYY") + " to " + Slipstream.SDK.DateFormatter.format(timeRange.endTime, "MM-DD-YYYY");
	          	}
	          };
	          //
	          return displayTime;
	        },
			onEditCustomTimeRange: function(event){
				var me=this;
				me.showCustomTimeOverlay(me.mergedFilters.time.startTime, me.mergedFilters.time.endTime);
			},
 			onTimeSpanChange: function(event){
 				var me=this,
 					selectedTime = me.configs.getSelectedTime(event.currentTarget.value);
 				//
 				if(selectedTime.isCustom === true){
					me.showCustomTimeOverlay(selectedTime.startTime, selectedTime.endTime);
 				}else{
					$.extend(me.mergedFilters, {"time":{
						"isCustom": false,
						"startTime": selectedTime.startTime,
						"endTime": selectedTime.endTime,
						"selectedTimeSpanId": event.currentTarget.value
					}});
	 				//
	 				if(me.currentViewIndex === 0){
	 					me.graphView.refresh(me.mergedFilters);
	 				}else{
	 					me.gridView.render();
	 				}
	 				//
	 				me.containers.mainContainer.find(".app-secure-time-display").hide();
	 				me.updateDateDisplay();
	 			}
 			},
 			//
 			onGroupByChange: function(event){
 				var me=this,
 					selectedGroup = event.currentTarget.value;
 				//
				$.extend(me.mergedFilters, {"groupBy": selectedGroup});
 				//
 				me.graphView.refresh(me.mergedFilters);
 			},
 			//
 			buildTimeSpan: function(){
 				var me=this,
 					timeSpanData = me.configs.getTimeSpanData();
 				//set the selected item in the drop down by looking in to selectedTimeSpanId. Default is 7 (last 1 day)
 				for (var i = 0, len = timeSpanData.length; i < len; i++){
 					if(timeSpanData[i]["id"] === me.mergedFilters.time.selectedTimeSpanId){
 						timeSpanData[i]["selected"] = true;
 						break;
 					}
 				}
 				//
	            me.timeSpanDropDown = new DropDownWidget({
		                "container": me.containers.mainContainer.find('.app-secure-time-span-filter'),
		                "data": timeSpanData
		            }).build();
	           	//
	           	if(me.mergedFilters.time && me.mergedFilters.time.isCustom){
					me.containers.mainContainer.find(".app-secure-time-display").show();	           		
	           	}
				//
	            me.updateDateDisplay();
 			},
 			//
 			buildShowBy: function(){
 				var me=this;
	            me.groupByDropDown = new DropDownWidget({
	                "container": me.containers.mainContainer.find('.app-secure-group-by-filter'),
	                "data": me.configs.getGroupByFilterData()['data']
	            }).build();
 			},
 			//
 			buildGraphAndChartView: function(){
 				//
 				var me=this;
 				//
 				me.graphView = new GraphView({
 											"activity": me.activity,
 											"context": me.context,
 											"filters":me.mergedFilters,
 											"url": me.options.url,
 											"toolTipView": me.options.toolTipView,
 											"graphTitle": me.options.graphTitle
 										});
 				//
 				me.gridView = new me.options.gridView({
 											"activity": me.activity,
 											"context": me.context,
 											"filters":me.mergedFilters
 										});
	            me.tabs = [{
	                            id:"graphview_tab",
	                            name:"Chart View",
	                            content: me.graphView
	                        }, {
	                            id:"gridview_tab",
	                            name:"Grid View",
	                            content: me.gridView
	                        }];
				//	       
	            me.tabContainerWidget = new TabContainerWidget({
	                                            "container": me.containers.mainContainer.find('.app-secure-graph-grid-view'),
	                                            "tabs": me.tabs
	                                        });
	            //
	            //me.tabContainerWidget.build();
	            //
	            if(me.mergedFilters.filterBy && me.mergedFilters.filterBy.viewType === 1){
	            	me.containers.mainContainer.find(".app-secure-container-links.app-secure-container-links-de-selected").trigger("click");
	            }else{
	            	me.containers.mainContainer.find('.app-secure-graph-grid-view').append(me.graphView.render().el);
	            }
	            //
 			}
 		}
 	})());
 	return AppSecureLandingPage;
 });