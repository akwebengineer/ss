/**
* Model for Scheduler Widget.
*
* @module Common (Scheduler Widget)
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define(['backbone'], function(Backbone){
	var SchedulerModel = Backbone.Model.extend({
		defaults:{
			"scheduler": {
				"start-time": new Date(),
				"schedule-type": "",
				"re-occurence": 0,
				"date-of-month": "",
				"end-time": new Date(),
				"days-of-week": {
	            	"day-of-week": [],
	            	"uri": "",
	            	"total": ""
	            }
            }
		}
	})
	return SchedulerModel;
});