/**
 * Bubble Legend for App Visibility
 *
 * @module BubbleLegend
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define(["d3"], function(d3){
	var BubbleLegend = function(conf){
		var me=this;
		/**
		conf.data = [{"name": "Low", "fill": #EEEEEE}, {"name": "Moderate", "fill": #000000}]
		*/
		me.conf=  conf;//conf.container will hold this legend
		//
		me.sortRisk = function(){
			me.conf.data.forEach(function(element, index){
				var name = element.compare;
				switch (name.toLowerCase()){
					case "critical":
						element.sortIndex = 6;
						break;
					case "high":
						element.sortIndex = 5;
						break;
					case "unsafe":
						element.sortIndex = 4;
						break;
					case "moderate":
						element.sortIndex = 3;
						break;
					case "low":
						element.sortIndex = 2;
						break;
					case "unknown":
						element.sortIndex = 1;
						break;
				};
			});

			me.conf.data.sort(function(a, b) {
				if(a.sortIndex && b.sortIndex){
					return a.sortIndex - b.sortIndex;	
				}
			});
		};
		//
		me.build = function(){
			//
			var container = d3.select(me.conf.container),
				height = 25,
				data = me.conf.data,
				svgContainer,
				legendGroup;
			//
			me.sortRisk();
			//
			d3.select(me.conf.container).select('svg').remove();
			svgContainer = container.append('svg').attr("height", 20).attr("width", "100%");
			//
			legendGroup = svgContainer.append('g');
			//
			legendGroup.selectAll('text')
					   .data(data)
					   .enter()
					   .append("text")
					   .attr("y", 15)
					   .style("display", "block")
					   .text(function(d){
					   		return d.name;
					   })
			//
			var prev_x_pos = 0;
			var x_pos_array = [];
			//
			legendGroup.selectAll("text")
					   .attr("x", function(d, i){
					   		var padding=25;
					   		x_pos = me.conf.container.clientWidth - this.getComputedTextLength() - prev_x_pos;
					   		prev_x_pos = this.getComputedTextLength() + prev_x_pos + padding;
					   		x_pos_array.push(x_pos);
					   		return x_pos;
					   })
			//
			legendGroup.selectAll('rect')
					   .data(data)
					   .enter()
					   .append("rect")
					   .attr("width", 10)
					   .attr("height", 10)
					   .attr("y", 6)
					   .attr("stroke", function(d){
							return d.fill;
					   })
					   .attr("stroke-width", 1)
					   .attr("x", function(d, i){
					   		return x_pos_array[i] - 15;
					   })
					   .style("fill", function(d){
					   		return d.fill;
					   })
			//		   
		}
	}
	//
	return BubbleLegend;
})