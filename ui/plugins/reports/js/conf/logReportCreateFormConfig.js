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
                    "heading": context.getMessage("report_def_form_section_content"),
                    "section_id": "content_section_id",
                    "elements": [
                    {
                        "element_description": true,
                        "id": "add-data-criteria",
                        "label": '',
                        "name": "add-data-criteria",
                        "label": context.getMessage('reports_form_section_trigger'),
                        "value" : "Create content sections for the report by: <br />- Using the data criteria of filters from the Event Viewer<br />- Or by adding data criteria(Time Span, Group By, Filter By)<br /><a href='#' id='choose-filter'>Use data criteria from filters</a>",
                        "field-help": {
                            "content": context.getMessage('reports_form_section_trigger_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        }
                    }]
                };
            };
        };

        return Configuration;
    }
);
