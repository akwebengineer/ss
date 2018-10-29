/**
 * A Filters Grid Form Config to render the Filters Grid
 *
 * @module LogReportsDefinition
 * @author Shini <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "show_filters",
                    "form_name": "show_filters",
                    "err_div_id": "errorDiv",
                    "err_timeout": "1000",
                    "on_overlay": true,
                    "title": "Use Data Criteria From Filter",
                    "title-help": {
                        "content": "Use the Add Saved Filters page to select the filter from the list of previously saved filters from the Event Viewer. Filters with empty groups are not displayed",
                        "ua-help-identifier": "alias_for_ua_event_binding"
                    },
                    "sections": [
                    {
                        "elements": [
                        {
                            "element_text": true,
                            "id": "show_all_filters",
                            "class": "showAllFilters",
                            "name": "show_all_filters",
                            "placeholder": context.getMessage('Loading ...')
                        }]
                    }],

                    "buttonsAlignedRight": true,
                    "buttonsClass":"buttons_row",
                    "cancel_link": {
                        "id": "show-filters-cancel",
                        "value": context.getMessage('cancel')
                    },
                    "buttons": [
                        {
                            "id": "show-filters-save",
                            "name": "create",
                            "value": context.getMessage('ok')
                        }
                    ]
                };

            };

        };

        return Configuration;
    }
);
