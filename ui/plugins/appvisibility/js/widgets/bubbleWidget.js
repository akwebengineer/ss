/**
 * Bubble Widget for App Visibility
 *
 * @module BubbleWidget
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["d3", "widgets/tooltip/tooltipWidget", "./bubbleLegend.js"], function(d3, ToolTipWidget, BubbleLegend){

	var BubbleWidget = function(conf){
		var me=this,
			Constants={
		    	"GRAPH_TYPES":{
		    		"HEAT_MAP": "HEAT_MAP",
		    		"BUBBLE_GRAPH": "BUBBLE_GRAPH",
		    		"ZOOM_BUBBLE_GRAPH": "ZOOM_BUBBLE_GRAPH"
		    	},
		    	"MIN_BUBBLE_SIZE": 10,//min dia of the bubble
		    	"MAX_BUBBLE_SIZE": 500,
		    	"NAME_TYPES":{
		    		"IPV4": "IPV4"
		    	}
			};
		//
		me.conf = conf;//container, data
		//generate random colors for circles
		function getRandomColor() {
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++ ) {
		        color += letters[Math.floor(Math.random() * 16)];
		    }
		    return color;
		};
		/**
		refreshes the bubbles by color code field
		*/
		/*deprecated
		me.refreshColorCodes = function(colorCodeField){
			var me=this;
			me.legendData=[];
			me.conf.colorCodeByField = colorCodeField;
			me.build(me.proposal);
		};*/
		//
		me.addToolTip = function(data, container){
			new ToolTipWidget({
			                "elements": {
						        "position": 'right',
						        "interactive": true,
				                "functionBefore": function(origin, continueToolTip){
				                	me.conf.toolTipFunctionBefore(origin, continueToolTip, data);
				                }
				            },
			                "container": container,
			                "view": "<div>test</div>"//this is required to fire the functionBefore fn
			}).build();
		};
		//text color
		me.fillTextColor = function(data){
			var colorCodeByField = data[me.conf.colorCodeByField] || "unknown";
			colorCodeByField = colorCodeByField.toLowerCase();
			return me.conf.colorCodeByData[me.conf.colorCodeByField][colorCodeByField]["text-color"];
		};
		//fills the color	
		me.fillColor = function(data){
			var colorCodeByField = data[me.conf.colorCodeByField] || "unknown";
			colorCodeByField = colorCodeByField.toLowerCase();
			me.generateLegendData(data, me.conf.colorCodeByField);
			return me.conf.colorCodeByData[me.conf.colorCodeByField][colorCodeByField]["color"];
		};
		//
		me.refresh = function(data){
			me.conf.data = data;
			d3.select(me.conf.container).select('svg').remove();
			me.build();
		};
		//
		me.generateLegendData = function(d, colorCodeField){
	  		var nodeColorCodeField = d[colorCodeField] ? d[colorCodeField].toLowerCase() : "unknown";
	  		//
	  		if(!d.children && !me.isExists(me.legendData, "compare", nodeColorCodeField)){
				me.legendData.push({
					"name": me.conf.colorCodeByData[colorCodeField][nodeColorCodeField]["display"],//d[colorCodeField],
					"fill": me.conf.colorCodeByData[colorCodeField][nodeColorCodeField]["color"],
					"compare":nodeColorCodeField
				});
			}
			//
		};
		//
		me.isExists = function(array, column, value){

			var exists=false,
				filtered = $(array).filter(function(){
					return this[column].toLowerCase() == value.toLowerCase();
				});
			//
			if(filtered.length > 0){
				exists = true
			}else{
				exists = false;
			}
			//
			return exists;
		};
		//
		me.getLegendData = function(){
			var me=this;
			return me.legendData;
		};

		me.viewLastOctet = function(d){
			var truncatedName = name = d.name.toString().substring(0, d.r / 5),
								name;
							if(truncatedName !== d.name.toString()){
								if(d["name-type"]){
									if(d["name-type"] === Constants.NAME_TYPES.IPV4){
										var reverseTruncate = d.name.toString().substring(d.name.toString().length - truncatedName.length, d.name.toString().length);
										name = ".." + reverseTruncate.substring(2, reverseTruncate.length);
									}else{
										name = truncatedName.substring(0, truncatedName.length - 2) + "..";
									}
								}
								else{
									name = truncatedName.substring(0, truncatedName.length - 2) + "..";
								}
							}							
			return name;
		};
		//
		me.getGroupByData = function(dataArray){
			var newArray=[];
			//
			if(!$.isArray(dataArray)){
				dataArray = [dataArray];
			}
			//
			//sort the array before grouping
			dataArray.sort(function(a, b){
				return (b[me.conf.colorCodeByField] > a[me.conf.colorCodeByField]) ? 1 : ((b[me.conf.colorCodeByField] < a[me.conf.colorCodeByField]) ? -1 : 0);
			});
			//
			var currentData="-1";
			var groupByArray = [];
			//
			dataArray.forEach(function(element, index){
				if(currentData !== element[me.conf.colorCodeByField]){
					groupByArray = [];
					groupByArray.push(element);
					newArray.push(groupByArray);
				}else{
					groupByArray.push(element);
				}
				//
				currentData = element[me.conf.colorCodeByField];
			});
			//
			return newArray;
		};
		//work around for IE browser to get the text length
		me.getTextLength = function(text, font){
			var  o = $('<div>' + text + '</div>')
			            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': font})
			            .appendTo($('body')),
			     w = o.width();
			  o.remove();
			  return w;			
		};
		//
		me.buildBubbleGraph = function(){

			var bubbleContainer = d3.select(me.conf.container),
				data = !$.isArray(me.conf.data) ? [me.conf.data] : me.conf.data,
				width = me.conf.container.clientWidth,
				diameter = 500,
				height = 500;
			//
			var svg = bubbleContainer.append("svg")
			    .attr("width", width)
			    .attr("height", height);
			//
		    var center = {
		      x: width/2,
		      y: height/2
		    };
		    //
			data = {"children": data};
			var dataMax = d3.max(me.conf.data, function(d){return d.value;});
			var dataScale = d3.scale.linear().domain([0, dataMax]).range([Constants.MIN_BUBBLE_SIZE, Constants.MAX_BUBBLE_SIZE]);
			// Use the pack layout to initialize radius:
			var bubbleLayout = d3.layout.pack()
			    .size([diameter, diameter])
			    .sort(function(a, b){
			    	return b["value"] > a["value"];
			    })
			    .value(function(d) { 
			    	return dataScale(d.value); 
			    });
			//
			var nodes = bubbleLayout.nodes(data).filter(function(d) { return !d.children; });
			var force = d3.layout.force()
		    .nodes(nodes)
		    .gravity(-0.01)
		    .charge(function(d){
		    	return -Math.pow(d.value, 2.0) / 8;
		    })
		    .size([width, height]);
			//
			var dataMax = d3.max(data, function(d){
				return d.value;
			});
			//
			var nodes = svg.selectAll("circle")
		    		   .data(force.nodes())
		  			   .enter()
		  			   .append("circle")
		  			   .attr("r", function(d){
							me.addToolTip(d, $(this));
		  				   	return d.r;
		  			   })
		  			   .attr("fill", function(d) {
				      		return me.fillColor(d);
		  				});
			var texts = svg.selectAll("text")
						.data(force.nodes())
						.enter()
						.append("text")
						.style("font-family", function(d){
							return "Arial";
						})
						.style("font-size", function(d){
							return "12px";
						})
						.style("fill", function(d){
							return me.fillTextColor(d);
						})
						.style("pointer-events", function(d){
							return "none";
						})
						.text(function(d){
							return me.viewLastOctet(d);						
						})
			texts
			.style("display", function(d){
				var display="none";
				if(this.textContent.length > 2){
					display = "inline";
				}
				return display;
			});
		    var charge = function(d) {
		        return -Math.pow(d.r, 2.0) / 8;
			};
			//
			var move_towards_center = function(alpha) {
		        return function(d) {
		          d.x = d.x + (center.x - d.x) * (0.1 + 0.02) * alpha * 0.4625;
		          return d.y = d.y + (center.y - d.y) * (0.1 + 0.02) * alpha;
		        };
		    };
		    //
		    force.gravity(-0.01).charge(charge).friction(0.9).on("tick", function(e){
		  	  nodes.each(move_towards_center(e.alpha)).attr("cx", function(d) {
		            return d.x;
		          }).attr("cy", function(d) {
		            return d.y;
		          });
		  	  
		  	  texts.attr("x", function(d) {
		  	  	  var textLength=0,
		  	  	  	  offSet;
		  	  	  try{
					textLength = this.getComputedTextLength();
		  	  	  }catch(e){
		  	  	  	textLength = me.getTextLength(d.name, "12px Arial");
		  	  	  }
		  		  offSet = (textLength / 2) - d.x;
		          return d.x - d.x - offSet;
		        }).attr("y", function(d) {
		          return d.y + 5;
		        })
		  	  
		    });
		    //
		    force.start();
		    //
		};
		//
		me.build = function(proposal){
			//
			$(me.conf.container).empty();
			me.legendData = [];
			me.proposal = proposal;
			switch(proposal.selectedGraph){
				case Constants.GRAPH_TYPES.HEAT_MAP:
					me.buildHeatMap();
					break;
				case Constants.GRAPH_TYPES.ZOOM_BUBBLE_GRAPH:
					me.zoomableBubbleGraph();
					break;
				case Constants.GRAPH_TYPES.BUBBLE_GRAPH:
					me.buildBubbleGraph();
					break;
				default:
					me.buildBubbleGraph();
			};
		};
		//Zoomable bubble graph
		me.zoomableBubbleGraph = function(){
			var me=this,
				margin = 0,
			    outerDiameter = 500,
			    innerDiameter = outerDiameter - margin - margin;

			var x = d3.scale.linear()
			    .range([0, innerDiameter]);

			var y = d3.scale.linear()
			    .range([0, innerDiameter]);

			var dataMax = d3.max(me.conf.data, function(d){return d.value;});
			//
			var rScale = d3.scale.pow().exponent(0.5).domain([0, dataMax]).range([5, 80]);
			//
			var radiusScaleFunction = function(d){
				return rScale(d);
			};
			//
			var pack = d3.layout.pack()
			    .padding(2)
			    .size([innerDiameter, innerDiameter])
				//.radius(me.proposal.selectedFunction === undefined || me.proposal.selectedFunction === "0" ? null : null)
			    .value(function(d) { 
			    	return d.value;
			    })

			var svg = d3.select(me.conf.container).append("svg")
				.attr("class", "zoom-graph")
			    .attr("width", innerDiameter)
			    .attr("height", innerDiameter)
			  .append("g")
			    .attr("transform", "translate(" + margin + "," + margin + ")");

			  var groupedData = me.getGroupByData(me.conf.data);
			  //
			  var root = {"name": "data", "children": []};
			  //
			  var i=0;
			  groupedData.forEach(function(data){
			  	root.children.push({"name": "grouped" + i, "children": data});
			  	i = i+1;
			  });
			  //
			  var focus = root,
			      nodes = pack.nodes(root);

			  svg.append("g").selectAll("circle")
			      .data(nodes)
			      .enter()
			      .append("circle")
			      .attr("class", function(d) { 
			      	return d.parent ? d.children ? "build6-node" : "build6-node build6-node--leaf" : "build6-node build6-node--root"; 
			      })
			      //.transition()
			      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			      .attr("r", function(d) { 
					//add tooltip widget to each circle other than the root
					if(d.name !== "data" && d.parent !== root){
						me.addToolTip(d, $(this));
					}
			      	return d.r; 
			      })
			      .style("fill", function(d) { 
			      		if(d.hasOwnProperty("parent") === true && d.parent !== root ){
			      			return me.fillColor(d);
			      		}else{
			      			if(d.hasOwnProperty("parent") === false){
			      				return "#EEEEEE";
			      			}else if(d.parent === root){
								return "#CCCCCC";
			      			}
			      		}
			      })
			      .on("click", function(d) { return zoom(focus == d ? root : d); });
			  
			  var texts = svg.append("g").selectAll("text")
			      .data(nodes)
			      .enter().append("text")
			      .attr("class", "build6-label")
			      .attr("transform", function(d) { 
			      	return "translate(" + d.x + "," + d.y + ")"; 
			      })
			      .style("fill", function(d){
			      	return me.fillTextColor(d);
			      })
			      .text(function(d) { 
			      	return d.hasOwnProperty("parent") === false || d.parent === root ? "" : me.viewLastOctet(d);
			      });
			  //
			  texts
			  .style("display", function(d){
				var display="none";
				if(this.textContent.length > 2){
					display = "inline";
				}
				return display;
			  });
			  //
			  d3.select(me.conf.container)
			      .on("click", function() { zoom(root); });

			  function zoom(d, i) {
			    var focus0 = focus;
			    focus = d;

			    var k = innerDiameter / d.r / 2;
			    x.domain([d.x - d.r, d.x + d.r]);
			    y.domain([d.y - d.r, d.y + d.r]);
			    d3.event.stopPropagation();

			    var circleTransition = d3.select(".zoom-graph").selectAll("circle").transition()
			        .duration(d3.event.altKey ? 7500 : 750)
			        .attr("transform", function(d) { 
			        	return "translate(" + x(d.x) + "," + y(d.y) + ")"; 
			        });

			    circleTransition.filter("circle")
			        .attr("r", function(d) { 
			        	return k * d.r;
			        });

			    var textTransition = d3.select(".zoom-graph").selectAll("text").transition()
			        .duration(d3.event.altKey ? 7500 : 750)
			        .attr("transform", function(d) {
						return "translate(" + x(d.x) + "," + y(d.y) + ")"; 
			        });
			    //
			    /*
			    textTransition.filter("text")
			      .filter(function(d) { 
			      	return d.parent === focus || d.parent === focus0; 
			      })
		          .each("start", function(d) { 
		          	if (d.parent === focus) {
		          		this.style.display = "inline"; 
		          	}
		          })
		          .each("end", function(d) { 
		          	if (d.parent !== focus && (d.r) < k * 10){
		          		this.style.display = "none"; 	
		          	} 
		          });*/
		        //
			  }
		}
		//Heat map
		me.buildHeatMap = function(){

			var margin = {top: 0, right: 0, bottom: 0, left: 0},
			    width =  me.conf.container.clientWidth - margin.left - margin.right,
			    height = (width * 0.3) - margin.top - margin.bottom;

			me.legendData = [];

			var treemap = d3.layout.treemap()
			    .size([width, height])
			    .sticky(true)
			    .value(function(d) { return d.value; });
			$(me.conf.container).empty();
			var div = d3.select(me.conf.container).append("div")
			    .style("position", "relative")
			    .style("width", (width + margin.left + margin.right) + "px")
			    .style("height", (height + margin.top + margin.bottom) + "px")
			    .style("left", margin.left + "px")
			    .style("top", margin.top + "px");

			  var groupedData = me.getGroupByData(me.conf.data);
			  //
			  var root = {"name": "data", "children": []};
			  //
			  var i=0;
			  groupedData.forEach(function(data){
			  	root.children.push({"name": "asdf" + i, "children": data});
			  	i = i+1;
			  });
			  //
			  var divs = div.datum(root).selectAll(".node")
			      .data(treemap.nodes)
			      .enter().append("div")
			      .attr("class", "node")
			      .transition()
			      .duration(500)
			      .style("background", function(d) {
			      		me.addToolTip(d, $(this));
						return me.fillColor(d);
			      })
			      .text(function(d) {
			      	var displayName = true;
			      	//
			      	if(d.children){
			      		displayName = false;
			      	}else if(((d.dx -1) / 2 / 5) < 3){
			      		displayName = false;
			      	}else if(d.dy -1 < 25){
						displayName = false;
			      	}
			      	//
			      	return displayName ? d.name : null;
			      });
			  //
			  divs
			  .style("left", function(d) { 
			  	return d.x + "px"; 
			  })
		      .style("top", function(d) { 
		      	return d.y + "px"; 
		      })
		      .style("width", function(d) { 
		      	return Math.max(0, d.dx - 1) + "px"; 
		      })
		      .style("line-height", function(d){
		      	return Math.max(0, d.dy - 1) + "px";
		      })
		      .style("color", function(d){
	      		return me.fillTextColor(d);
		      })
		      .style("height", function(d) { 
		      	return Math.max(0, d.dy - 1) + "px"; 
		      });
		};
		//
	}
	return BubbleWidget;
});