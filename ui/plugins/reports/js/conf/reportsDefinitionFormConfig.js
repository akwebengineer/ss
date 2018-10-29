/**
 *  A configuration object with the parameters required to build
 *  a Report Definition
 *
 *  @module ReportsDefinition
 *  @author Shini <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([
], function () {

    var formConfig = function(context) {

        // Configuration elements for Report Form
        this.getReportFormConfig = function(reportType) {
            return {
                "form_id": "report-form",
                "form_name": "report-form",
                "err_div_id": "errorDiv",
                "err_timeout": "1000",
                "on_overlay": true,
                "sections": [
                {
                    "heading": context.getMessage("report_def_form_section_general"),
                    "section_id": "general-info",
                    "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "name",
                        "name": "name",
                        "value": "{{name}}",
                        "label": context.getMessage('report_def_form_name'),
                        "field-help": {
                            "content": context.getMessage('report_def_form_name_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "required": true,
                        "notshowvalid": true,
                        "error": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": context.getMessage('name_require_error')
                            },
                            {
                                "regexId": "regex1",
                                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9-_.:\/\\s]{0,62}$",
                                "error": context.getMessage('report_def_form_name_error_invalid')
                            }
                        ]
                    },{
                        "element_textarea": true,
                        "id": "description",
                        "name": "description",
                        "label": context.getMessage('report_def_form_description'),
                        "field-help": {
                            "content": context.getMessage('report_def_form_description_field_help'),
                            "ua-help-identifier": "alias_for_title_ua_event_binding"
                        },
                        "value": "{{description}}",
                        "pattern": "^.{1,1024}$",
                        "error": context.getMessage("report_def_form_desc_error_max_length")
                    }]
                }, 
                {
                    
                    "section_id": "report-create-content-section",
                    "elements": [
                          {
                            "element_text": true,
                            "id": "report_create_content_section",
                            "class": "report_create_content_section",
                            "name": "report_create_content_section",
                            "placeholder": context.getMessage('Loading ...')
                        }
                    ]
                }, 
                {
                    "heading": context.getMessage("report_def_form_section_schedule"),
                    "section_id": "schedule-info",
                    "elements": [
                        {
                           "element_description": true,
                           "id": "add-schedule",
                           "label": context.getMessage('report_def_form_schedule_report'),
                           "value": "<a href='#' id='scheduler'>Add Schedule</a>",
                          //"required": true,
                           "error": context.getMessage("report_def_form_add_schedule_error"),
                           "field-help": {
                               "content": context.getMessage('report_def_form_schedule_report_field_help'),
                               "ua-help-identifier": "alias_for_title_ua_event_binding"
                           }
                        }, {
                            "element_description": true,
                            "id": "schedule-type",
                            "label": context.getMessage("report_def_form_repeats_field"),
                            "value": "{{schedule-type}}",
                            "class": "hide schedule-type",
                            "post_validation": "isSchedulerEmpty"
                        },{
                            "element_description": true,
                            "id": "re-occurence",
                            "label": context.getMessage("report_def_form_every_field"),
                            "value": "{{re-occurence}}",
                            "class": "hide re-occurence"
                        },{
                            "element_description": true,
                            "id": "date-of-month",
                            "label": context.getMessage("report_def_form_on_the_field"),
                            "value": "{{date-of-month}}",
                            "class": "hide date-of-month"
                        },{
                            "element_description": true,
                            "id": "days-of-week",
                            "label": context.getMessage("report_def_form_on_field"),
                            "value": "{{days-of-week}}",
                            "class": "hide days-of-week"
                        },{
                           "element_description": true,
                           "id": "start-time",
                           "label": context.getMessage("report_def_form_start_date_field"),
                           "value": "{{start-time}}",
                           "class": "hide start-time"
                        },{
                          "element_description": true,
                          "id": "end-time",
                          "label": context.getMessage("report_def_form_end_date_field"),
                          "value": "{{end-time}}",
                          "class": "hide end-time"
                        },{
                           "element_description": true,
                           "label": "",
                           "value":  "<a id=\"edit-schedule\">edit</a>&nbsp;&nbsp|&nbsp;&nbsp<a id=\"delete-schedule\">delete</a>",
                           "class": "hide editLink"
                        }
                        ]
                    }, {
                        "heading": context.getMessage("report_def_form_section_email"),
                        "section_id": "email-info",
                        "elements": [
                        {
                            "element_description": true,
                            "id": "add-email",
                            "label": context.getMessage('report_def_form_email_recipients'),
                            "value": "<a>Add Email Recipients</a>",
                           // "required": true,
                            "field-help": {
                                "content": context.getMessage('report_def_form_email_recipients_field_help'),
                                "ua-help-identifier": "alias_for_title_ua_event_binding"
                            }
                        },
                        {
                            "element_description": true,
                            "id": "additional-email-ids",
                            "label": context.getMessage("report_def_form_recipients_field"),
                            "value": "{{additional-emails}}",
                            "class": "hide emails",
                            "error": context.getMessage("report_def_form_add_email_error")
                        },
                        {
                            "element_description": true,
                            "id": "email-subject",
                            "label": context.getMessage("report_def_form_subject_field"),
                            "value": "{{email-subject}}",
                            "class": "hide subject"
                        },
                        {
                            "element_description": true,
                            "id": "comments",
                            "label": context.getMessage("report_def_form_comments_field"),
                            "value": "{{comments}}",
                            "class": "hide comments"
                        },
                        {
                            "element_description": true,
                            "label": "",
                            "value": "<a id=\"edit-email\">edit</a>&nbsp;&nbsp|&nbsp;&nbsp<a id=\"delete-email\">delete</a>",
                            "class": "hide editEmailLink"
                        }
                        ]
                    }],

                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "save-report",
                        "name": "save-report",
                        "value": context.getMessage('ok')
                    }/*,
                    {
                        "id": "send-report",
                        "name": "send-report",
                        "value": "Send Report Now"
                    },
                    {
                        "id": "preview-pdf",
                        "name": "preview-pdf-report",
                        "value": "Preview as PDF"
                    }*/
                ],
                 "cancel_link": {
                    "id": "cancel-report",
                    "name": "cancel-report",
                    "value": context.getMessage('cancel')
                }
            }
        };
    }
    return formConfig;
})