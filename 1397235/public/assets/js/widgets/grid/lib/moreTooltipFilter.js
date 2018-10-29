/**
 * A library that binds filter functionality to grid tooltip
 *
 * @module MoreTooltipFilter
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */


define(['widgets/grid/conf/i18nGridConfiguration'], function(i18nGridConfiguration){
	var MoreTooltipFilter = function() {

		/**
		 * Method that returns filtered data based on the input string
		 * @param  {Object}   filterconf   
		 *         						- {Object} filterconf.data: Original data in the tooltip that will be filtered
		 *               				- {String} filterconf.filterString: String input by the user that will be used in teh RegExp
		 *                   			- {Function} filterconf.callback: Optional callback function that will be called to get filtered data for remote filtering
		 * @return {Object} Returns filtered data
		 * @inner
		 */
		
		this.filter = function(filterconf) {
			var tooltipData,
			noData = i18nGridConfiguration.moreTooltip.no_data;          
			if (filterconf.callback) {
				tooltipData = filterconf.callback(filterconf.filterString, filterconf.data);
			}
			else {				
                var regex = new RegExp(filterconf.filterString);                                        
                tooltipData = _.filter(filterconf.data, function(obj){                       
                    return regex.test(obj["label"]["unformat"]);
                });
			}

			if (tooltipData.length === 0){
				tooltipData.push({key: noData, label: {formatter: noData, unformat: noData}});
			}			

            return tooltipData;
		};
	}

	return MoreTooltipFilter;
});
