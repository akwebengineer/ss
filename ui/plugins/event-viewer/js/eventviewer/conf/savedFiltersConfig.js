/**
 *  A configuration object with the parameters required to build
 *  Saved Filters and Recent Filters
 *
 *  @module EventViewer
 *  @author Shini<shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([ ],
	function () {

 	var formConfig = function(context) {

        this.getValues = function() {

            return {
        	    "title" : context.getMessage('ev_saved_filter_form_title'),
                "title-help": {
                    "content": context.getMessage('ev_saved_filter_form_title_help'),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("EVENT_LOG_SAVED_FILTER_VIEWING")
                },
                "form_id": "saved_and_recent_filters_form_config",
                "form_name": "saved_and_recent_filters_form_config",
                "on_overlay": true,
                "sections": [
                {
                    "section_id": "category-element",
                    "section_class": "ev-category-section",
                    "elements": [
                    {
                        "element_description": true,
                        "id": "category",
                        "name": "category",
                        "label": context.getMessage('ev_saved_filter_form_category') ,
                        "value": "{{category}}"
                    }
                ]}, {
                    "section_id": "recent-filters-element",
                    "section_class": "ev-recent-filters-section",
                    "elements": [{
                        "element_description": true,
                        "id": "recent_filters",
                        "name": "recent_filters",
                        "label": context.getMessage('ev_saved_filter_form_recently_used')
                    }]
                }, {
                    "section_id": "saved-filters-element",
                    "section_class": "ev-saved-filters-section",
                    "elements": [{
                        "element_text": true,
                        "id": "saved_filters_grid_list",
                        "class": "saved-filters-grid-container",
                        "name": "saved_filters_grid_list"
                    }]
				}],

                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "apply-filter",
                        "name": "apply-filter",
                        "value": context.getMessage('ok')
                    }
                ],
                 "cancel_link": {
                    "id": "cancel-filter",
                    "name": "cancel-filter",
                    "value": context.getMessage('cancel')
                }
            }
        };
    };

    return formConfig;
});


