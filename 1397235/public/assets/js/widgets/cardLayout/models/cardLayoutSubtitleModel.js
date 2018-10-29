/**
 * A model representing the card layout subtitle.  The model has the attributes: content (subtitle value) and help (help icon)
 *
 * @module CardLayoutSubtitleModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone'
], /** @lends CardLayoutSubtitleModel*/
    function(Backbone) {

	var CardLayoutSubtitleModel = Backbone.Model.extend({
        defaults: {
            "content": "Card Layout",
            "help": {
	            "content": "Card Layout Tootltip",
	            "ua-help-identifier": "identifier"
       		 }
        }
    });

    return CardLayoutSubtitleModel;
});