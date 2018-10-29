/** Detail View
 *  
 *  @module EventViewer
 *  @author Anupama<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 **/
define(['backbone', 'marionette', './baseEventViewerView.js', '../../../../ui-common/js/views/gridView.js', 'text!../templates/detailView.html', 
    'text!../templates/gridWidgetInjectorTemplate.html', 'lib/template_renderer/template_renderer', 'widgets/dropDown/dropDownWidget',
    'widgets/overlay/overlayWidget', '../models/aggListCollection.js', './detailAggCollectionView.js', './contextMenuHandler.js', './menuHandler.js', 
    '../../../../ui-common/js/common/utils/filterManager.js', '../../../../sd-common/js/common/widgets/filterWidget/conf/filterConfig.js', "../utils/eventViewerConstants.js"],
  	function(Backbone, Marionette, BaseEventViewerView, GridView, DetailViewTemplate, InjectorTemplate, render_template, DropDownWidget, 
    	overlayWidget, AggCollection, AggCollectionView, ContextMenuHandler, MenuHandler, FilterManager, FilterConfig, Constants){

		var DetailView = BaseEventViewerView.extend({
		  	//
		    events: {
		      	"click .ev-threat-checkbox": "filterThreatsClick",
		    },
		    //
		    initialize : function(options){
		    	BaseEventViewerView.prototype.initialize.call(this, options);
		    	//
		    	var me = this;
				//
		    	DetailViewModel = Backbone.Model.extend({
				    defaults : {
				        aggregation: me.options.filter.aggregation || "none",
				        selectedAggData: "",
				        showThreats: false,
				        eventCategory: me.options.eventCategory,
				        currentTimeRange: me.currentTimeRange || me.options.filter.timeRange,
				        filterList: [],
				        andFilterList: [],
				        orFilterList: [],
				        filtersForSearchBar: me.options.filter.filters || ''
				    }
			    });
			    DetailViewModel.prototype.save = function() { 
			    	this.trigger('sync'); 
			    }

			    me.model = new DetailViewModel();
			    me.listenTo(me.model, "sync", me.refreshContentView);
			    //
			    var eventCategory = me.model.get("eventCategory");
			    if(eventCategory == Constants.EVENT_VIEWER_CATEGORIES.ev_category_all_events || eventCategory == Constants.EVENT_VIEWER_CATEGORIES.ev_category_ips || 
			    		eventCategory == Constants.EVENT_VIEWER_CATEGORIES.ev_category_anti_virus || eventCategory == Constants.EVENT_VIEWER_CATEGORIES.ev_category_anti_spam){
			        me.enableFilterThreatsOption = true;
			    } else {
			        me.enableFilterThreatsOption = false;
			    }
			    //
			    var categoryFilterStr = this.configs.getCategoryFilterString(eventCategory);
			    if(categoryFilterStr && categoryFilterStr != 'all'){
			        me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_CATEGORY, categoryFilterStr));
			    }
			    //
			    me.filterConfig = new FilterConfig(me.context);
			    me.configs.category = me.model.get('eventCategory');

			    if((!jQuery.isEmptyObject(me.model.get("filtersForSearchBar"))) || (me.model.get("aggregation") != "none")){
					me.firstRender = true;
				}
			},
			//
		    filterThreatsClick : function(event){
		    	var me = this, checkbox = event.currentTarget;
		    	if(checkbox.checked){
		      		me.model.set("showThreats", true);
		      		var threatsFilterStr = this.configs.getCategoryThreatString(me.model.get("eventCategory"));
	        		me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_TYPE, threatsFilterStr));
		    	} else {
		      		me.model.set("showThreats", false);
		    	}
		    	me.model.save();
			},
			//
			updateTimeRangeDisplay : function(){
		        var me=this;
		        me.containers.timeRangeDisplayContainer.html(me.configs.getTimeRangeToDisplay(me.model.get("currentTimeRange")));
		    },
			//
            isEmpty: function(el){
                return !$.trim(el.html());
            },
            //			
			refreshContentView : function(data){
				var me = this;
				if(me.isEmpty(me.$el.find(".ev-detail-view"))) return;
				if(me.currentTimeRange){
					me.model.set("currentTimeRange", me.currentTimeRange);
				}
				me.updateTimeRangeDisplay();

				if(!me.firstRender && data && data.filter && data.filter.timeRange && me.model.get("aggregation") !== "none"){	//change in time range then trigger aggregation to refresh
					me.onAggChangeFn();
				} else {
					if(!me.firstRender){
						me.setPostData();
						me.evGrid.reloadGrid({
		          			rowIndex : 1,                               //always view from first record on refresh
		          			numberOfRows : this.configs.logsToView      //pagination should be based on 'number of logs to view' option from settings
		        		});
				        me.firstRender = false;
					}
				}
				console.log("Table refreshed");
		        me.model.set("filterList", []);
	          	me.model.set("andFilterList", []);
	          	me.model.set("orFilterList", []);
			},
			//
			setPostData : function(){
				var me = this, 
				postData = {
			        "request":{
			          	"time-interval": this.configs.getRequestTime(me.model.get("currentTimeRange").startTime, me.model.get("currentTimeRange").endTime),
			          	"size": this.configs.logsToView,
			          	"resolve-addresses": this.configs.resolveIP,
			          	"case-sensitive": false
			        }
			    };

			    var categoryFilterStr = this.configs.getCategoryFilterString(me.model.get("eventCategory"));
			    if(categoryFilterStr && categoryFilterStr != 'all'){
			        me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_CATEGORY, categoryFilterStr));
			    }

			    if(me.model.get("showThreats")){
		      		var threatsFilterStr = this.configs.getCategoryThreatString(me.model.get("eventCategory"));
	        		me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_TYPE, threatsFilterStr));
	        	}

			    if(me.model.get("aggregation") && me.model.get("aggregation") !== "none"/* && me.model.get("selectedAggData")*/){
			    	me.model.get("filterList").push(this.configs.formFilterString(me.model.get("aggregation"), me.model.get("selectedAggData")));
			    }

			    if(me.model.get("filterList").length > 0 || me.model.get("andFilterList").length > 0 || me.model.get("orFilterList").length > 0){
	        		var filters = me.configs.getFilterStructure(me.model.get("filterList"), me.model.get("andFilterList"), me.model.get("orFilterList"));
	        	}

	        	if(filters){
			        var postDataFilters = {
			          	"filters" : filters
			        };
			        postData.request = $.extend({}, postData.request, postDataFilters);
			    }
			    this.configs.postData = postData;
			},
			//
			getFormattedFilter: function () {
		        var filtersArr = this.evGrid.getSearchWidgetInstance().getAllTokens(),
		            filterObj = this.configs.getFilters(filtersArr) || "",
		            jsonDataObj,
		            formattedAndFilter = filterObj[0],
		            formattedOrFilter  = filterObj[1];

		        jsonDataObj = this.configs.getFilterStructure([], formattedAndFilter, formattedOrFilter);
		        return jsonDataObj;
		    },
			//
			buildAggregationDropDown : function(){
				var me = this;
				me.containers.groupByContainer = gridWidgetHeaderContainer.find(".ev-group-by");
		        //
		        me.groupByDropDown = new DropDownWidget({
		          	"container": me.containers.groupByContainer,
		          	"data": me.filterConfig.getGroupByDropDown(true),
		          	onChange : $.proxy(me.onAggChangeFn, me)
		        }).build();
		        //
		        me.groupByDropDown.setValue(me.model.get("aggregation"));
		    },
		    //
		    onAggChangeFn : function(event){
		        var me = this;
		        if(me.firstRender){
		        	me.firstRender = false;
		        } else {
		        	if(this.groupByDropDown.getValue()){
			        	me.model.set("aggregation", this.groupByDropDown.getValue());
			        	if(me.model.get("aggregation") == "none"){
			          		me.model.set("selectedAggData", "");
			          	}
			        }
			        
			        if(me.model.get("aggregation") != "none"){  
				        me.$el.find("div[class='ev-aggregated-graph-view']").show();
				        var reqdTimeString = this.configs.getRequestTime(me.model.get("currentTimeRange").startTime, me.model.get("currentTimeRange").endTime),
				        	aggPostData = this.configs.getAggPostData(me.model.get("aggregation"), reqdTimeString);

				        var filtersArr = me.evGrid.getSearchWidgetInstance().getAllTokens(),
				            filterObj = me.configs.getFilters(filtersArr) || "",
				            jsonDataObj,
				            formattedAndFilter = filterObj[0],
				            formattedOrFilter  = filterObj[1],
				            andFiltersLength = formattedAndFilter.length,
				            orFiltersLength = formattedOrFilter.length;

				        for(var i = 0; i < andFiltersLength; i++){
				        	me.model.get("andFilterList").push(formattedAndFilter[i]);
				        }

				        for(var j = 0; j < orFiltersLength; j++){
				        	me.model.get("orFilterList").push(formattedOrFilter[j]);
				        }
				        
				        var categoryFilterStr = this.configs.getCategoryFilterString(me.model.get("eventCategory"));
					    if(categoryFilterStr && categoryFilterStr != 'all'){
					        me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_CATEGORY, categoryFilterStr));
					    }

					    if(me.model.get("showThreats")){
				      		var threatsFilterStr = this.configs.getCategoryThreatString(me.model.get("eventCategory"));
			        		me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_TYPE, threatsFilterStr));
			        	}

				        var filtersToApply = me.configs.getFilterStructure(me.model.get("filterList"), me.model.get("andFilterList"), me.model.get("orFilterList")) || me.getFormattedFilter();
				        if(filtersToApply){
		            		var postDataFilters = {
		              			"filters" : filtersToApply
		            		};
		            		aggPostData.request = $.extend({}, aggPostData.request, postDataFilters);
		          		} 

						this.service.fetchAggregatedData(aggPostData, $.proxy(me.onFetchAggDataSuccess, me));
				    } else {
				        me.$el.find("div[class='ev-aggregated-graph-view']").hide();
				        me.model.save();
				    }
		        }
			},
		    //
		    setFilterSuccess : function(data){
	          	var me = this, response = data.responseJSON['event-filter'],
	              startTime = response['starttime'],
	              endTime = response['endtime'];
	          
	          	if(startTime == 0) {
	             	startTime = new Date() - 7200000;
	             	endTime = new Date().getTime();
	          	}

	          	var setTime = {
	              	'timeRange': {
	                  	'startTime': new Date(startTime),
	                  	'endTime': new Date(endTime)
	              	}
	          	};

	          	me.addFiltersToSearchBar(response['filter-string']);
	          	me.configs.startTime = startTime;
	          	me.configs.endTime = endTime;

	          	me.model.set("filterList", []);
	          	me.model.set("andFilterList", []);
	          	me.model.set("orFilterList", []);
	          	me.model.set("currentTimeRange", setTime.timeRange);
	          	me.model.set("aggregation", response['aggregation']);
	          	if(me.model.get("aggregation") == "none"){
	          		me.model.set("selectedAggData", "");
	          		me.model.save();
	          	}

	          	var filterObj = response['formatted-filter'];
	          	if(filterObj){
	          		if(filterObj.or){
		          		ORfiltersLen = filterObj.or.length;
		          		if(ORfiltersLen){                       //"OR" filters
		            		for(i = 0; i < ORfiltersLen; i++){
		              			me.model.get("orFilterList").push(this.configs.formFilterString(filterObj.or[i].filter.key, filterObj.or[i].filter.value, filterObj.or[i].filter.operator));
		            		}
		          		}      
		        	}

		        	if(filterObj.and){
		          		ANDfiltersLen = filterObj.and.length;
		          		if(ANDfiltersLen){                      //"AND" filters
		            		for(i = 0; i < ANDfiltersLen; i++){
		                		if(typeof filterObj.and[i].or !== 'undefined' && filterObj.and[i].or.length > 0) {
		                  			for(var j = 0; j < filterObj.and[i].or.length; j++){
		                    			me.model.get("orFilterList").push(this.configs.formFilterString(filterObj.and[i].or[j].filter.key, filterObj.and[i].or[j].filter.value, filterObj.and[i].or[j].filter.operator));
		                  			}
		                		} else if(typeof filterObj.and[i].and !== 'undefined' && filterObj.and[i].and.length > 0){
		                  			for(var k = 0; k < filterObj.and[i].and.length; k++){
		                    			me.model.get("andFilterList").push(this.configs.formFilterString(filterObj.and[i].and[k].filter.key, filterObj.and[i].and[k].filter.value, filterObj.and[i].and[k].filter.operator));
		                  			}
		                		} else {
		                    		me.model.get("andFilterList").push(this.configs.formFilterString(filterObj.and[i].filter.key, filterObj.and[i].filter.value, filterObj.and[i].filter.operator));
		                		}
		            		}
		          		}   
		        	} else {
		          		me.model.get("filterList").push(filterObj);       //single filter
		        	}
	          	}
	          	
				me.groupByDropDown.setValue(me.model.get("aggregation"));
				me.setEVTimeRange(setTime.timeRange);
	          	me.updateTimeRangeDisplay();
	       	},
	       	//
	       	setEVTimeRange : function(timeRange){
	       		this.activity.eventViewer.buildTimeRange(timeRange);
	       	},
		    //
		    setFilter : function(filterObj){
		      	var me = this, postData,
		          appliedFilter = '<span style="color: #333; font: 12px">Applied Filter: </span><span style="font-weight: bold; font-size: 0.75rem;">'+filterObj["filter-name"]+'</span>';
		      	
		      	me.filterManagement['filter-id'] = filterObj["filter-id"];
		      	me.filterManagement['filter-string'] = filterObj["filter-string"];
		      	me.filterManagement['filter-name'] = filterObj["filter-name"];
		      	me.$el.find('.ev-applied-filter').html(appliedFilter);
				
				me.service.fetchFilterData(filterObj["filter-id"], $.proxy(me.setFilterSuccess,me));
		    },
		    //
		    getDetailAggViewList : function(keys, values){
			    var aggList = [];
			    $.each(keys, function (index, value){
			        aggList.push({
			          key: keys[index],
			          value: values[index]
			     	});
			    });
			    var listCollection =  new AggCollection(aggList),
			    	detailAggListCollectionView = new AggCollectionView({collection:listCollection}); 
			    return detailAggListCollectionView;
		    },
		    //
		    onFetchAggDataSuccess : function(data){
		    	var me = this, aggPointData, resp = data.responseJSON.response.result;
	      		me.containers.aggregatedGraphContainer.empty();
	      		//
	      		if(resp.length > 0){
	        		me.$el.find("div[class='ev-aggregated-graph-view']").show();
	        		aggPointData = resp.key || resp[0].key;
	        		
	        		var len = resp.length, i, keys = [], values = [];
	        		for(i = 0; i < len; i++){
	          			keys[i] = resp[i].key;
	          			values[i] = resp[i].value;
	        		}

	        		var detailAggViewList = me.getDetailAggViewList(keys, values);
	        		me.containers.aggregatedGraphContainer.append(detailAggViewList.render().$el);

	        		var lastValue = me.containers.aggregatedGraphContainer.find('.ev-aggregated-data')[len - 1];
	        		$(lastValue).addClass("ev-aggregated-data-last");

	        		var defaultSelected = me.containers.aggregatedGraphContainer.find('.ev-aggregated-data')[0];
	        		$(defaultSelected).addClass("ev-aggregated-data-selected");
	        		me.preSelection = defaultSelected;

	        		me.containers.aggregatedGraphContainer.find('.ev-aggregated-data').click(function(event){
			          	me.aggListClickEvent(event, this);
			        });
				} else {
	        		me.$el.find("div[class='ev-aggregated-graph-view']").hide();
	      		}
	      		//
	      		aggPointData = me.getAggregationData(aggPointData); 
	          	me.model.set("selectedAggData", aggPointData);
	          	me.model.save();
	      	},
	      	//
	      	aggListClickEvent: function(event, selected){
	      		var me = this, aggPointData;
	      		event.preventDefault();
	          	$(me.preSelection).removeClass("ev-aggregated-data-selected");
	          	$(selected).addClass('ev-aggregated-data-selected');
	          	me.preSelection = selected;
	          	aggPointData = selected.title.split("(")[0];
	          	aggPointData = me.getAggregationData(aggPointData);  
	          	me.model.set("selectedAggData", aggPointData);
	          	me.model.save();
	      	},
	      	//
	      	getAggregationData: function(aggPointData){
	      		var me = this, aggData = aggPointData;
	      		if(me.configs.resolveIP && (me.model.get("aggregation") == me.filterUtil.LC_KEY.DESTINATION_ADDRESS || me.model.get("aggregation") == me.filterUtil.LC_KEY.SOURCE_ADDRESS || 
	          	  me.model.get("aggregation") == me.filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS || me.model.get("aggregation") == me.filterUtil.LC_KEY.NAT_SOURCE_ADDRESS)){
	            	me.configs.getResolvedIP(aggPointData, function(resolvedIP){
	              		aggData = resolvedIP;
	              	});
	          	}
	          	return aggData;
	      	},
	      	//
	      	addFiltersToSearchBar: function(filterObj){
			    var filterList;
			    if(typeof(filterObj) == "string"){
			        filterList = this.configs.getFilterTokens(filterObj);
			    } else {
			        filterList = this.configs.getFilterList(filterObj, true);
			    }
			      
			    filterList = this.filterUtil.getLCLabels(this.context, filterList);
			    this.evGrid.getSearchWidgetInstance().removeAllTokens();
			    if(filterList != '' )
			    {
			    	this.evGrid.getSearchWidgetInstance().addTokens(filterList);
			    }
			    //this.evGrid.getSearchWidgetInstance().addTokens(filterList);
		    },
		    //
		    buildEVGrid : function(){
				var me = this;
				me.setPostData();
				$.when(me.filterConfig.getFilterList()).done(function(filterMenu){
			        var preferencesPath = me.context['ctx_name'] + ':' + me.configs.getGridConfig().tableId + ':' + me.model.get('eventCategory');
			        //
			        me.evGrid = new GridView({
			          "el": me.containers.gridWidgetContainer,
			          "preferencesPath": preferencesPath,
			          "isAppendGridInfo": false,
			          "conf": me.configs.getGridConfig(filterMenu, me.filterConfig.getOperatorsList()),
			          "dontPersistAdvancedSearch": me.options.dontPersistAdvancedSearch === true ? true : false,
			          "actionEvents": {
				            "showRawLogs" : "showRawLogsFn",
				            "showEventDetails" : "showEventDetailsFn",
				            "showExactMatch" : "showExactMatchFn",
				            "filterOnCellData" : "filterOnCellDataFn",
				            "excludeCellData" : "excludeCellDataFn",
				            "settingsWizard" : "settingsWizardFn",
				            "createAlertWizard" : "createAlertWizardFn", 
				            "createReportWizard" : "createReportWizardFn",
				            "exportCSVMenu" : "exportCSVMenuFn",  
				            "createFilter" : "createFilterOverlayFn",
				            "savedFilters" : "showSavedFiltersFn",
				            "clearFilters" : "clearFiltersFn",
				            "showPolicyFirewall" : "showPolicyFirewallFn",
				            "showPolicyNATSource" : "showPolicyNATSourceFn",
				            "showPolicyNATDestination" : "showPolicyNATDestinationFn",
				            "createExemptRule": "createExemptRuleFn"
				        }
			        }).render().gridWidget;
			        //
			        me.addFiltersToSearchBar(me.model.get("filtersForSearchBar"));
			        me.addActionEventsForGrid();
			        me.containers.aggregatedGraphContainer.hide();
			        //
			        gridWidgetHeaderContainer = me.$el.find(".action-filter-wrapper");
			        gridWidgetHeaderContainer.prepend(render_template(InjectorTemplate, {
			          "filter-threats": me.enableFilterThreatsOption
			        }));
			        //
			        me.buildAggregationDropDown();
		      	});
			},
			//
			addActionEventsForGrid : function(){
				var me = this;
				contextMenuHandler = new ContextMenuHandler(me.context);
	      		menuHandler = new MenuHandler(me.context);
				me.$el.off("showRawLogsFn").on("showRawLogsFn", $.proxy(contextMenuHandler.showRawLogsFn, me));
		        me.$el.off("showEventDetailsFn").on("showEventDetailsFn", $.proxy(contextMenuHandler.showEventDetailsFn, me));
		        me.$el.off("showExactMatchFn").on("showExactMatchFn", $.proxy(contextMenuHandler.showExactMatchFn, me));
		        me.$el.off("filterOnCellDataFn").on("filterOnCellDataFn", $.proxy(contextMenuHandler.filterOnCellDataFn, me));
		        me.$el.off("excludeCellDataFn").on("excludeCellDataFn", $.proxy(contextMenuHandler.excludeCellDataFn, me));
		        me.$el.off("showPolicyFirewallFn").on("showPolicyFirewallFn", $.proxy(contextMenuHandler.showPolicyFirewallFn, me));
		        me.$el.off("showPolicyNATSourceFn").on("showPolicyNATSourceFn", $.proxy(contextMenuHandler.showPolicyNATFn, me, "Source NAT"));
		        me.$el.off("showPolicyNATDestinationFn").on("showPolicyNATDestinationFn", $.proxy(contextMenuHandler.showPolicyNATFn, me, "Destination NAT"));
		        me.$el.off("createExemptRuleFn").on("createExemptRuleFn", $.proxy(contextMenuHandler.createExemptRuleFn, me));

		        me.$el.off("settingsWizardFn").on("settingsWizardFn", $.proxy(menuHandler.settingsWizardFn, me));
		        me.$el.off("exportCSVMenuFn").on("exportCSVMenuFn", $.proxy(menuHandler.exportCSVMenuFn, me));
		        me.$el.off("createFilterOverlayFn").on("createFilterOverlayFn", $.proxy(menuHandler.createFilterOverlayFn, me));
		        me.$el.off("createAlertWizardFn").on("createAlertWizardFn", $.proxy(menuHandler.createAlertWizardFn, me));
		        me.$el.off("createReportWizardFn").on("createReportWizardFn", $.proxy(menuHandler.createReportWizardFn, me));
		        me.$el.off("showSavedFiltersFn").on("showSavedFiltersFn", $.proxy(menuHandler.showSavedFiltersFn, me));
		        me.$el.off("clearFiltersFn").on("clearFiltersFn", $.proxy(menuHandler.clearFiltersFn, me));
			},
			//
			fetchAggData : function(data){
				var me = this, resp = data.responseJSON.response.result;
				if(resp.length > 0){
					me.$el.find("div[class='ev-aggregated-graph-view']").show();
					me.model.set("selectedAggData", resp.key || resp[0].key);
				} else {
					me.$el.find("div[class='ev-aggregated-graph-view']").hide();
				}
				me.buildEVGrid();
				me.onFetchAggDataSuccess(data);
			},
			//
			render : function(){
				var me = this;
				
				me.model.set("filterList", []);
	          	me.model.set("andFilterList", []);
	          	me.model.set("orFilterList", []);
				//
			    var categoryFilterStr = me.configs.getCategoryFilterString(me.model.get("eventCategory"));
			    if(categoryFilterStr && categoryFilterStr != 'all'){
			        me.model.get("filterList").push(me.configs.formFilterString(me.filterUtil.LC_KEY.EVENT_CATEGORY, categoryFilterStr));
			    }
			    //
				var ANDfilters, ANDfiltersLen, ORfilters, ORfiltersLen, AndOrFilters;

			    AndOrFilters = this.configs.getAndOrFilters(me.model.get("filtersForSearchBar"));
			    ANDfilters = AndOrFilters[0];
			    ORfilters = AndOrFilters[1];

			    if(ANDfilters){
			        ANDfiltersLen = ANDfilters.length;
			    }
			    if(ORfilters){
			        ORfiltersLen = ORfilters.length;
			    }

			    if(ANDfiltersLen){
			        for(i = 0; i < ANDfiltersLen; i++){
			            me.model.get("andFilterList").push(this.configs.formFilterString(ANDfilters[i].filter.key, ANDfilters[i].filter.value, ANDfilters[i].filter.operator));
			        }
			    }
			          
			    if(ORfiltersLen){
			        for(i = 0; i < ORfiltersLen; i++){
			          	me.model.get("orFilterList").push(this.configs.formFilterString(ORfilters[i].filter.key, ORfilters[i].filter.value, ORfilters[i].filter.operator));
			        }
			    }
			    //
				me.$el.append(render_template(DetailViewTemplate, {
			        "grid":true,
			        "aggregated-graph-view":true
			    }));
			    //
			    me.containers = {
			        groupByContainer: me.$el.find('.ev-group-by'),
			        gridWidgetContainer: me.$el.find('.ev-detail-view-body'),
			        aggregatedGraphContainer: me.$el.find('.ev-aggregated-graph-view'),
			        timeRangeDisplayContainer: me.$el.find(".ev-time-range-display")
			    };
			    //
			    me.updateTimeRangeDisplay();
			    //If there is an aggregation set in case of jump
				if(me.model.get("aggregation").toLowerCase() !== "none"){
					var reqdTimeString = this.configs.getRequestTime(me.model.get("currentTimeRange").startTime, me.model.get("currentTimeRange").endTime),
						aggPostData = this.configs.getAggPostData(me.model.get("aggregation"), reqdTimeString);
	
					var filtersToApply = me.configs.getFilterStructure(me.model.get("filterList"), me.model.get("andFilterList"), me.model.get("orFilterList"));
					if(filtersToApply){
						var postDataFilters = {
							"filters" : filtersToApply
						};
						aggPostData.request = $.extend({}, aggPostData.request, postDataFilters);
					} 
					this.service.fetchAggregatedData(aggPostData, $.proxy(me.fetchAggData, me));
				} else {
					me.buildEVGrid();
				}
			    me.currentTimeRange = me.model.get("currentTimeRange");
			    return me;
			}
	  	});
	return DetailView;
});