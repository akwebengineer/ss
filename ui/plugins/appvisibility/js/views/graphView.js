/**
 * Graph View for App Vis Landing Page
 * contains bubble graph and bar graphs
 * one below the other
 * @module GraphView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'text!../templates/graphView.html', 'lib/template_renderer/template_renderer',
	 'widgets/dropDown/dropDownWidget', '../conf/appSecureConfigs.js',
	 "../utils/appVisConstants.js",
	 '../widgets/bubbleWidget.js', './topNGenericBarWidget.js', 
	 "../widgets/bubbleLegend.js",
	 "../service/appSecureService.js",
	 "widgets/progressBar/progressBarWidget",
	 "text!../templates/noDataTemplate.html",
	 "text!../templates/noDataTemplateBubble.html"
	], function(Backbone, GraphViewTemplate, template_renderer, DropDownWidget, Config, Constants, BubbleWidget, TopNGenericBarWidget, BubbleLegend, AppSecureService, ProgressBarWidget, NoDataTemplate, NoDataTemplateBubble){

	var GraphView = Backbone.View.extend({
		//
		initialize: function(options){
			console.log('Graph View initialized');
			var me=this;
			me.options = options;
			me.configs = new Config(options.context);
			me.service = new AppSecureService();
			me.colorCodeByField = "risk-level";
		},
		//
		render: function(){
			console.log('Graph View rendered');
			var me=this,
				graphViewHTML = template_renderer(GraphViewTemplate, {
 					"filter": true,
 					"bubble": true,
 					"otherwidgets": false,
 					"graphTitle": me.options.graphTitle,
 					"legend": (me.options.activity.intent.data.mime_type === "vnd.juniper.net.uservisibility") || (me.options.activity.intent.data.mime_type === "vnd.juniper.net.sourceipvisibility") ? false: true,
 					"group-by": (me.options.activity.intent.data.mime_type === "vnd.juniper.net.uservisibility") || (me.options.activity.intent.data.mime_type === "vnd.juniper.net.sourceipvisibility") ? false: true
 				});
 			me.$el.empty();
			me.$el.append(graphViewHTML);
			//
			me.containers={
				"mainContainer":me.$el,
				"bubbleChartContainer": me.$el.find('.app-secure-bubble-chart'),
				"bubbleLegendContainer": me.$el.find('.app-secure-bubble-chart-legend'),
				"topAppsByCategoryContainer": me.$el.find(".app-secure-top-apps-by-category"),
				"topAppsByCharacteristicContainer": me.$el.find(".app-secure-top-users-by-app")
			};
			//NoDataTemplateBubble
			me.buildBubbleView(me.options.filters);
			//
			//me.buildTopAppsByCategoryView(me.options.filters);
			//
			//me.buildTopAppsByCharacteristicView(me.options.filters);
			//NoDataTemplateBubble
			me.buildColorCodeByDropDown();
			//
			return this;
		},
        displayNoData: function(container) {
            var me = this;
            var noData = template_renderer(NoDataTemplate, {message: me.options.context.getMessage('app_vis_no_data')});
            container.empty();
			container.append(noData);
        },
        displayNoDataForBubble: function(container){
            var me = this;
            var noData = template_renderer(NoDataTemplateBubble, {message: me.options.context.getMessage('app_vis_no_data')});
            container.empty();
			container.append(noData);
        },
		//dynamically generate the end point url
		//refreshes the bubble data
		refresh: function(filters){
			var me=this;
			//
			me.buildBubbleView(filters);
			//
			//me.buildTopAppsByCategoryView(filters);
			//
			//me.buildTopAppsByCharacteristicView(filters);
			//				
		},
		//
		buildTopAppsByCategoryView: function(filters){
			var me=this,
				config = me.configs.getConfigsForTopAppsByCategory(filters.groupBy),
				onSuccess,
				onError,
				progressBar,
				url = "/category" + me.configs.getSelectedGroupBy(filters.groupBy)['url'] + "?start=0&limit=5&start-time=" + filters.time.startTime + "&end-time=" + filters.time.endTime,
				isCount = url.indexOf("/session-count") > -1 ? true : false;
			//
			//progressBar = me.displayProgressBar(me.containers.topAppsByCategoryContainer, 'Loading Categories...');
			//
			onSuccess = function(collection, response, options){
				config.categories=[];
				config.data=[];
				config.tooltip=[];
				//
				if(collection.length === 0){
					me.displayNoData(me.containers.topAppsByCategoryContainer);
				}else{
					collection.each(function(model){
						config.categories.push(model.get("name"));
						config.data.push(model.get("value"));
						config.tooltip.push(model.get("name") + ": " + (isCount ? model.get("value") : me.configs.convertBytesToClosestUnit(model.get("value"))));
					});
					//
					me.topAppsByCategoryView = new TopNGenericBarWidget({
						"el": me.containers.topAppsByCategoryContainer,
						"context": me.options.context,
						"barConfig": config
					});
					//progressBar.destroy();
				}
			};
			//
			onError = function(collection, response, options){
				console.log("top apps by category view collection failed");
				//progressBar.destroy();
			};
			//
			me.service.getTopNData(url, onSuccess, onError);
		},
		//
		buildTopAppsByCharacteristicView: function(filters){
			var me=this,
				config = me.configs.getConfigsForTopAppsByCharacteristics(filters.groupBy),
				progressBar,
				url = "/characteristic" + me.configs.getSelectedGroupBy(filters.groupBy)['url'] + "?start=0&limit=5&start-time=" + filters.time.startTime + "&end-time=" + filters.time.endTime,
				isCount = url.indexOf("/session-count") > -1 ? true : false;
			//
			//progressBar = me.displayProgressBar(me.containers.topAppsByCharacteristicContainer, 'Loading Characteristics...');
			onSuccess = function(collection, response, options){
				config.categories=[];
				config.data=[];
				config.tooltip=[];
				//
				if(collection.length === 0){
					me.displayNoData(me.containers.topAppsByCharacteristicContainer);				
				}else{
					collection.each(function(model){
						config.categories.push(model.get("name"));
						config.data.push(model.get("value"));
						config.tooltip.push(model.get("name") + ": " + (isCount ? model.get("value") : me.configs.convertBytesToClosestUnit(model.get("value"))));
					});
					//
					me.topUsersByAppView = new TopNGenericBarWidget({
						"el": me.containers.topAppsByCharacteristicContainer,
						"context": me.options.context,
						"barConfig": config
					});
					//
					//progressBar.destroy();
				}
			};
			//
			onError = function(collection, response, options){
				console.log("top apps by category view collection failed");
				//progressBar.destroy();
			};
			//
			me.service.getTopNData(url, onSuccess, onError);
			//
		},
		//		
		buildLegend: function(){
			var me = this;
			//
			new BubbleLegend({
				"container": me.containers.bubbleLegendContainer[0],
				"data": me.bubbleWidget.getLegendData()
			}).build();
			//
		},
		displayProgressBar: function(container, message){
	        var progressBar = new ProgressBarWidget({
	                            "container": container,
	                            "statusText": message
	                        }).build();
	        return progressBar;
		},
		//
		buildBubbleView:function(filters){
			var me=this,
				url="",
				onSuccess,
				onError,
				progressBar;
			//
			url = me.options.url + me.configs.getSelectedGroupBy(filters.groupBy)['url'];
			url = url + "?start=0&limit=50&start-time=" + filters.time.startTime + "&end-time=" + filters.time.endTime;
			url = url + (filters['platform-device-ids'] !== "" ? "&device-ids=" + filters['platform-device-ids'] : "");
			//
			//progressBar = me.displayProgressBar(me.containers.bubbleChartContainer, 'Loading Applications...');
			onSuccess = function(collection, response){
				var bubbleData = response.response.result;
				//
				if(collection.length === 0){
					me.displayNoDataForBubble(me.containers.bubbleChartContainer);
				}else{
					if(bubbleData.length > 50){
						bubbleData.splice(50, bubbleData.length - 50);//back end does not support paging. stop gap for now	
					}
					//
					me.bubbleWidget = new BubbleWidget({
						container: me.containers.bubbleChartContainer[0],
						data:bubbleData,
						
						toolTipFunctionBefore: function(origin, continueToolTip, data){
							console.log(data);
							//
							var toolTipView = new me.options.toolTipView({
								"context": me.options.context,
								"activity": me.options.activity,
								"data":{
									"name": data.name,
									"name-type": data["name-type"],
									"platform-device-ids": (filters['platform-device-ids'] !== "" ? filters['platform-device-ids'] : ""),
									"device-ids": (filters['device-ids'] !== "" ? filters['device-ids'] : ""),
									"startTime": filters.time.startTime,
									"endTime": filters.time.endTime,
									"isCustom": filters.time.isCustom,
									"selectedTimeSpanId": filters.time.selectedTimeSpanId
								}
							});
							//
							toolTipView.on("toolTipDataSuccess", function onToolTipDataSuccess(){
								origin.tooltipster('content', $(this.el));
								continueToolTip();
							});
							//
						},
						colorCodeByData:me.configs.getColorCodes(),//pass the field and corresponding color code
						colorCodeByField:me.colorCodeByField//pass the field against which color coding should happen
					});

					me.bubbleWidget.build({
						"selectedGraph": me.selectedGraph ? me.selectedGraph : Constants.GRAPH_TYPES.BUBBLE_GRAPH
					});
					//
					me.buildLegend();
					//
					//progressBar.destroy();
				}
			}
			onError = function(collection, response){
				console.log('app secure bubble collection not fetched');
			}
			me.service.getBubbleData(url, onSuccess, onError);
		},
		//
		buildColorCodeByDropDown: function(){
			var me=this,
				onColorCodeChangeFn;
			//
			onColorCodeChangeFn = function(event){
				var colorCodeByField;
				me.buildingGroupDropDown=false;
				//
				me.selectedGroupBy = event.currentTarget.value;
				switch(event.currentTarget.value){
					case "0"://risk
						colorCodeByField="risk-level";
						break;
					case "1"://category
						colorCodeByField="category";
						break;
					case "2"://characteristic
						colorCodeByField="characteristics";
						break;

				};
				//
				me.colorCodeByField = colorCodeByField;
				//
				if(me.bubbleWidget && !me.buildingGroupDropDown){
					me.refresh(me.options.filters);
				}
			};
			//
			me.buildingGroupDropDown = true;
			me.groupByDropDown = new DropDownWidget({
				"container": me.containers.mainContainer.find('.app-secure-view-by-filter'),
				"data": me.configs.getColorCodeByData()['data'],
				"onChange":onColorCodeChangeFn
			}).build();
			//
			if(me.options.activity.intent.data.mime_type === "vnd.juniper.net.appvisibility" || me.options.activity.intent.data === "vnd.juniper.net.appvisibility"){//for user visiblity and ip visibility do not set the value
				me.groupByDropDown.setValue(me.selectedGroupBy || "0");	
			}
			//
			me.buildingGroupDropDown=false;
			//
			var onGraphChangeFn = function(event){
				me.selectedGraph = event.currentTarget.value;
				if(me.bubbleWidget && !me.buildingGraphDropDown){
					me.refresh(me.options.filters);
				};
			};
			//
			me.buildingGraphDropDown = true;
			me.graphDropDown = new DropDownWidget({
				"container": me.containers.mainContainer.find('.app-secure-view-by-graph-options'),
				"onChange": onGraphChangeFn,
				"data": [ {"id": Constants.GRAPH_TYPES.BUBBLE_GRAPH, "text": "Bubble Graph"},{"id":Constants.GRAPH_TYPES.HEAT_MAP, "text": "Heat Map"},{"id":Constants.GRAPH_TYPES.ZOOM_BUBBLE_GRAPH, "text":"Zoomable Bubble Graph"}]
			}).build();
			//
			me.graphDropDown.setValue(me.selectedGraph || Constants.GRAPH_TYPES.BUBBLE_GRAPH);
			me.buildingGraphDropDown = false;
		}
	});

	return GraphView;
})