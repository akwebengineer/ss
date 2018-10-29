/**
 * SwimLane module that builds a swimlane using a configuration object data property.
 * The configuration object includes a container, where the widget will be rendered.
 * @module SwimLaneWidget
 * @author Dharmendran Arumugam <adharmendran@juniper.net>
 * sample data
	{
 	"swimlane-categories":[{
		"swimlane-category":"Firewall",
	    "time-lines":[{
			"color": "blue",
			"name": "All",
			"time-line":[{
				"time":date,
				"value":1000
			},{
				"time":date,
				"value":1000
			}]
	    }, {
			"color": "red",
			"name": "Blocked",
			"time-line":[{
				"time":date,
				"value":1000
			},{
				"time":date,
				"value":1000
			}]
	    }]
	 }]
	}
* @copyright Juniper Networks, Inc. 2015
*/
define(['d3', 'widgets/tooltip/tooltipWidget', 'backbone'], function(d3, ToolTipWidget, Backbone){

	var SwimLaneWidget = function(options){
		var me=this,
			TOTAL_NUMBER_OF_TIME_LINES = 40,
			CATEGORY_WIDTH_IN_PERCENTAGE = 20,
			CATEGORY_WIDTH_IN_PIXEL = 250,
			COUNT_WIDTH_IN_PERCENTAGE = 10,
			SWIMLANE_HEIGHT = 105,//45,
			FILL_COLOR = "#FFFFFF",
			TIME_LINE_WIDTH_IN_PERCENTAGE = (100/*100 percent*/ - CATEGORY_WIDTH_IN_PERCENTAGE - COUNT_WIDTH_IN_PERCENTAGE) / TOTAL_NUMBER_OF_TIME_LINES;
		//
		//options must contain container, selector and data
		me.conf = options;
		//containers in swimlane widget
		me.containers = {
			"swimlanecategory": "swimlane-widget-event-category",
			"swimlanecount": "swimlane-widget-event-count",
			"swimlanetimeline": "swimlane-widget-time-line"
		};
		me.renderPeakValues = function(){
			var peakValueMap={};
			//
			var peakValueContainerGroup = me.rootGroup
										  .selectAll(".peak-value-container")
										  .data(function(d){
										  		var maxArray=[],
										  			returnMaxArray;
												d['time-lines'].forEach(function(timelines){
													maxArray.push(d3.max(timelines['time-line'], function(d1){
														peakValueMap[d1.value] = d1.time;
														return d1.value;
													}));
												});
												returnMaxArray = d3.max(maxArray);
												return [returnMaxArray];
										  })
										  .enter()
										  .append("g")
										  .attr("transform", function(d){
										  	var xPos = me.xDomain(peakValueMap[d]) + 250;//3 is the radius of the dot
										  	return "translate(" +  xPos + ", 0)";
										  });
			//										  
			peakValueContainerGroup.append("rect")
			.attr("class", "peak-value-rect")
			.attr("height", 15)
			.attr("rx", 2)
			.attr("ry", 2)
			.attr("fill", "#E7E7E7")
			.attr("x", 5)
			.attr("pointer-events", "none")
			.attr("display", function(d){
				return d > 0 ? "inline" : "none";
			});
			//
			peakValueContainerGroup.append("text")
			.attr("class", "peak-value-text")
			.attr("x", 5)
			.attr("y", 10)
			//.attr("font-family", "Arial")
			//.attr("font-size", "10")
			//.attr("fill", "#000")
			//.attr("pointer-events", "none")
			.attr("display", function(d){
				return d > 0 ? "inline" : "none";
			})
			.text(function(d){
				return d;
			});
			//
			peakValueContainerGroup.selectAll("rect")
			.attr("width", function(d){
				return this.parentNode.getBBox().width;
			})
			//
            peakValueContainerGroup.append("circle")
            .attr("class", "peak-value-dot")
		   //.attr("fill", "#000")
		   .attr("r", 2)
		   .attr("cx", 0)
		   .attr("cy", 8)
		   .attr("opacity", 0.5)
		   //.attr("pointer-events", "none")
		   .attr("display", function(d){
				return d > 0 ? "inline" : "none";
		   })
			//
		};
		//renders time series
		me.renderSwimlaneTimeLine = function(){
			var me=this;
			me.seriesData = [];
			var width = d3.select(me.conf.container).node().clientWidth - CATEGORY_WIDTH_IN_PIXEL;
			width = width < 0 ? CATEGORY_WIDTH_IN_PIXEL : width;
			var height = SWIMLANE_HEIGHT;
			//define x axis in time scale	
			var x = d3.time.scale().range([0, width])
			var y = d3.scale.linear().range([height , 0]);
			//
			var xAxisDateBoundaries = [me.conf.timeRange.startTime, me.conf.timeRange.endTime];
			//set the boundaries for x and y.
			x.domain(xAxisDateBoundaries);
			me.xDomain = x;
			//
			var minArray=[];
			var maxArray=[];
			//

			me.conf.data['swimlane-categories'].forEach(function(swimlanecat){
				me.seriesData[swimlanecat['event-category-id']] = [];
				swimlanecat['time-lines'].forEach(function(timelines){
					me.seriesData[swimlanecat['event-category-id']].push(timelines);
					/*minArray.push(d3.min(timelines['time-line'], function(d1){
						return 0;//d1.value;
					}));
					maxArray.push(d3.max(timelines['time-line'], function(d2){
						return d2.value;
					}));*/
				})
			});
			//
			//var yAxisValueBoundaries = [0, d3.max(maxArray) + (d3.max(maxArray) * 0.10)];//give a tolerance of 10%
			//
			//y.domain(yAxisValueBoundaries);
			var swimLaneTimeLineContainer = me.rootGroup.selectAll("." + me.containers.swimlanetimeline)
											.data(function(d){
												return d['time-lines'];
											})
											.enter()
											.append("g")
											.attr("transform", "translate(250, 0)");
			//
           	var timeLine = swimLaneTimeLineContainer.append("path")
												.style("fill", function(d){
													return d['color'];
												})
												.style("opacity", function(d){
													return 0.7;
												})
												.style("stroke", function(d){
													return d['color'];
												})
												.style("stroke-width", "1.5px")
											
												.attr("d", function(d){
													//
													minArray=[];
													maxArray=[];
													//
        									   		for(var series in me.seriesData){
        									   			if(series === this.parentNode.parentNode.__data__['event-category-id']){
            									   			me.seriesData[series].forEach(function(catTimeLines){
            									   				var isSuper = catTimeLines['isSuper'];
            									   				if(isSuper){
																	minArray.push(d3.min(catTimeLines['time-line'], function(d1){
																		return 0;//d1.value;
																	}));
																	maxArray.push(d3.max(catTimeLines['time-line'], function(d2){
																		return d2.value;
																	}));
																	var yAxisValueBoundaries = [0, d3.max(maxArray) + (d3.max(maxArray) * 0.10)];//give a tolerance of 10%
																	//
																	y.domain(yAxisValueBoundaries);
            									   				}
            									   				//
            									   			});
        									   			};
        									   		};
        									   		//
													/*
													//define the y domain - take the min val and max val across series..
													var yAxisValueBoundaries = [d3.min(d['time-line'], function(d1){
														return d1.value;
													}), d3.max(d['time-line'], function(d2){
														return d2.value;
													})];
													//													
													y.domain(yAxisValueBoundaries);
													//*/
													/*
													var line = d3.svg.line()
													    //.interpolate("basis")
													    .x(function(d) { 
													    	return x(d.time);
													    })
													    .y(function(d) { 
													    	return y(d.value); 
													    });*/
													//				
													var area = d3.svg.area()
														.interpolate("cardinal")
													    .x(function(d) { 
													    	return x(d.time); 
													    })
													    .y0(function(d) { 
													    	return SWIMLANE_HEIGHT; 
													    })
													    .y1(function(d) { 
													    	return y(d.value); 
													    });									
													//
													return area(d['time-line']);
												})    				
      											.attr("class", "time-series");
      		d3.select(me.conf.container).selectAll(".swim-lane").on("mouseover", function(d){
				d3.select(this).selectAll(".time-line-dots").style("opacity", 1);
				d3.select(this).selectAll(".peak-value-dot").style("opacity", 0);
				d3.select(this).selectAll(".peak-value-text").style("opacity", 0);
				d3.select(this).selectAll(".peak-value-rect").style("opacity", 0);
      		});

      		d3.select(me.conf.container).selectAll(".swim-lane").on("mouseout", function(d){
				d3.select(this).selectAll(".time-line-dots").style("opacity", 0);
				d3.select(this).selectAll(".peak-value-dot").style("opacity", 0.5);
				d3.select(this).selectAll(".peak-value-text").style("opacity", 1);
				d3.select(this).selectAll(".peak-value-rect").style("opacity", 1);
      		});
            
            //add circles to the timeline       											
            var circles = swimLaneTimeLineContainer.selectAll("dot")
            									   .data(function(d){
            									   		return d['time-line'];
            									   })
            									   .enter()
            									   .append("circle")
            									   .attr("class", "time-line-dots")
            									   .style("opacity", 0)
            									   .style("fill", function(d){
            									   		return this.parentNode.__data__['color'];
            									   })
            									   .attr("r", function(d){
            									   		var hoveredTime = new Date(d.time),
            									   			circleRadius = 5,
            									   			html,
            									   			totalEvents = 0;
            									   			totalEventsSeriesArray = [];
            									   		//sum up all the event counts in the series
            									   		for(var series in me.seriesData){
            									   			if(series === this.parentNode.parentNode.__data__['event-category-id']){
	            									   			me.seriesData[series].forEach(function(catTimeLines){
	            									   				var seriesColor = catTimeLines['color'];
	            									   				var isSuper = catTimeLines['isSuper'];
            									   					catTimeLines['time-line'].forEach(function(timeObject){
		            									   				if(new Date(timeObject.time).getTime() === hoveredTime.getTime()){
																			totalEvents += isSuper ? timeObject.value : 0;//if it is a child do not add to the totalEvents
				            									   			totalEventsSeriesArray.push({
				            									   				"name": series,
				            									   				"color": seriesColor,
				            									   				"count": timeObject.value
				            									   			});
		            									   				};
            									   					});
	            									   			});
            									   			};
            									   		};
            									   		//
            									   		var seriesHtml="";
            									   		totalEventsSeriesArray.forEach(function(series){
            									   			var circle = "<svg width='10' height='10'><circle fill=" + series.color + " r='5' cx='5' cy='5'></circle></svg>";
															seriesHtml += "<div style='float: left; padding-right: 10px; vertical-align:middle; text-align:center'>" + circle + " " + series.count + "</div>";
            									   		})
            									   		//
            									   		html = "<div><label style='color: #999; font-weight:normal'>" + hoveredTime + "</label><label style='color:#05A4FF'>" + totalEvents + " Events</label>" + seriesHtml + "</div>";
														new ToolTipWidget({
														                "elements": {
																	        "position": 'top',
																	        "interactive": false
															            },
														                "container": $(this),
														                "view": html
														}).build();
            									   		return circleRadius;
            									   })
            									   .attr("cx", function(d){
            									   		return x(d.time);
            									   })
            									   .attr("cy", function(d){
														minArray=[];
														maxArray=[];
														//
	        									   		for(var series in me.seriesData){
	        									   			if(series === this.parentNode.parentNode.__data__['event-category-id']){
	            									   			me.seriesData[series].forEach(function(catTimeLines){
	            									   				var isSuper = catTimeLines['isSuper'];
	            									   				if(isSuper){
																		minArray.push(d3.min(catTimeLines['time-line'], function(d1){
																			return 0;//d1.value;
																		}));
																		maxArray.push(d3.max(catTimeLines['time-line'], function(d2){
																			return d2.value;
																		}));
																		var yAxisValueBoundaries = [0, d3.max(maxArray) + (d3.max(maxArray) * 0.10)];//give a tolerance of 10%
																		//
																		y.domain(yAxisValueBoundaries);
	            									   				}
	            									   				//
	            									   			});
	        									   			};
	        									   		};
														return y(d.value);
            									   })
            									   .on("mouseover", function(d){
            									   		//d3.select(this).style("opacity", 1);
            									   })
            									   .on("mouseout", function(d){
            									   		//d3.select(this).style("opacity", 0);
            									   })


		};
		//
		me.renderSwimLaneCategory = function(){
			var swimLaneCategoryContainer = me.rootGroup.selectAll("." + me.containers.swimlanecategory),
				categoryTextYPos = 45,
				width = d3.select(me.conf.container).node().clientWidth - CATEGORY_WIDTH_IN_PIXEL;
			//
			width = width < 0 ? CATEGORY_WIDTH_IN_PIXEL : width;
			swimLaneCategoryContainer.append('rect')
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", CATEGORY_WIDTH_IN_PIXEL)
			.attr("height", SWIMLANE_HEIGHT)
			.attr("class", "event-category")
			.on('click', function(d, i){
			       me.trigger("swimlanecategoryclick", d["event-category-id"]);
			})
			//rectangle container for path
			swimLaneCategoryContainer.append('rect')
			.attr("width", width)
			.attr("height", SWIMLANE_HEIGHT)
			.attr("class", "event-category-timeline-container")
			.attr("transform", "translate(" + CATEGORY_WIDTH_IN_PIXEL + ", 0)");
			//
			swimLaneCategoryContainer.append('text')
			.attr("x", 20)
			.attr("y", function(d){
				//return d['time-lines'].length > 1 ? categoryTextYPos : categoryTextYPos + 5;
				return categoryTextYPos;
			})
			.attr("class", "event-category-text")
			//.attr("href", "#")
			.text(function(d){
				return d['swimlane-category'];
			});
			//
			var prev_x_pos=20;
			var xPosArray=[];
			//
			swimLaneCategoryContainer.selectAll(".legend-text")
			.data(function(d){
				return d['time-lines'];
			})
			.enter()
			.append("text")
			.attr("y", categoryTextYPos + 19)
			.attr("class", "swimlane-legend-text")
			.text(function(d){
				return d["showLegend"] ? d.name : "";
			})
			.attr("x", function(d, i){
				var xPos = i === 0 ? 35 : prev_x_pos;
				prev_x_pos = xPos + this.getComputedTextLength() + 35;
				if(i === 0){
					xPosArray[this.parentNode.__data__['swimlane-category']] = [];
				}
				xPosArray[this.parentNode.__data__['swimlane-category']].push(xPos)
				return xPos;
			});
			//
			swimLaneCategoryContainer.selectAll(".legend-rect")
			.data(function(d){
				return d['time-lines']
			})
			.enter()
			.append("rect")
			.style("fill", function(d){
				return d["showLegend"] ? d['color'] : 'none';
			})
			.attr("width", 10)
			.attr("height", 10)
			.attr("x", function(d, i){
				return xPosArray[this.parentNode.__data__['swimlane-category']][i] - 15;
			})
			.attr("y", categoryTextYPos + 10);
			//
			/*
			.enter()
			.append("rect")
			.style("fill", function(d){
				return d['color'];
			})
			.attr("width", 10)
			.attr("height", 10)
			.attr("x", function(d, i){
				return (i * 20) + 10;
			})
			.attr("y", 35);*/
			//
			/*
			.append("rect")
			.style("fill", function(d){
				return d['color'];
			})
			.attr("width", 10)
			.attr("height", 10)
			.attr("x", function(d, i){
				return i * 20;
			})
			.attr("y", 35)*/
		};
		//
		me.build = function(swimLaneData){
			var swimLaneContainer = d3.select(me.conf.container),
				data = swimLaneData || me.conf.data,
				swimLanes = swimLaneContainer.selectAll('div').data(data['swimlane-categories'])
															  .enter().append('div').attr("class", "swim-lane");
			me.conf.data = data;										  
			var svgContainer = swimLanes.append('svg').attr("width", "100%").attr("height", SWIMLANE_HEIGHT);//.style("border-bottom", "1px solid #CCC")//.attr("viewBox", "0 0 1600 50");
			me.rootGroup = svgContainer.append("g").attr("class", "root-group");
			me.rootGroup.append("g").attr("class", "swim-lane-category-group").append("a").attr("class", me.containers.swimlanecategory)//.attr("xlink:href", "#");
			me.renderSwimLaneCategory();
			me.renderSwimlaneTimeLine();
			me.renderPeakValues();
			return me;//for chaining
		}
		//
	}
	_.extend(SwimLaneWidget.prototype, Backbone.Events);
	return SwimLaneWidget;
});