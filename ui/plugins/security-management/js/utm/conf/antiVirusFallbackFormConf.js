/**
 * Form configuration required to render the UTM Anti-Virus Fallback Options form using the FormWidget.
 *
 * @module UTM Anti-Virus Fallback Options Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var Configuration = function(context) {
        var CONTENT_SIZE_MIN = 20,
        CONTENT_SIZE_MAX = 40000;
        
        this.getValues = function() {
            return {
              "form_id": "anti-virus-fallback-form",
              "form_name": "anti-virus-fallback-form",
              "sections": [
               {
                "heading_text": context.getMessage('utm_antivirus_fallback_heading_text'),
                "elements": [
                {
                    "element_dropdown": true,
                    "id": "dropdown_content_size",
                    "name": "dropdown_content_size",
                    "label": context.getMessage('utm_antivirus_content_size'),
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }],
                    "field-help": {
                        "content": context.getMessage('utm_antivirus_content_size_tooltip')
                    }
                }, 
                {
                    "element_integer": true,
                    "id": "anti_virus_content_size_limit",
                    "name": "anti_virus_content_size_limit",
                    "value": "{{scan-options.content-size-limit}}",
                    "post_validation": "rangeValidator",
                    "minValue": CONTENT_SIZE_MIN,
                    "maxValue": CONTENT_SIZE_MAX,
                    "label": context.getMessage('utm_antivirus_content_size_limit'),
                    "help": context.getMessage("utm_antivirus_size_limit_help"),
                    "error": context.getMessage('integer_error'),
                    "field-help": {
                        "content": context.getMessage('utm_antivirus_content_size_limit_tooltip')
                    }
                    
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_engine_error",
                    "name": "dropdown_engine_error",
                    "label": context.getMessage('utm_antivirus_engine_error'),
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }],
                    "field-help": {
                        "content": context.getMessage('utm_antivirus_engine_error_tooltip')
                    }
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_password",
                    "name": "dropdown_password",
                    "label": context.getMessage('utm_antivirus_password'),
                    "class": "kaspersky-type-specific-settings",
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }]
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_corrupt",
                    "name": "dropdown_corrupt",
                    "label": context.getMessage('utm_antivirus_corrupt'),
                    "class": "kaspersky-type-specific-settings",
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }]
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_decompress",
                    "name": "dropdown_decompress",
                    "label": context.getMessage('utm_antivirus_decompress'),
                    "class": "kaspersky-type-specific-settings",
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }]
                },
                {
                    "element_dropdown": true,
                    "id": "dropdown_default_action",
                    "name": "dropdown_default_action",
                    "label": context.getMessage('utm_antivirus_default_action'),
                    "allowClearSelection": true,
                    "placeholder": context.getMessage("utm_dropdown_placeholder_common"),
                    "values": [{
                        "label": context.getMessage('utm_antivirus_log_and_permit'),
                        "value": "LOG_AND_PERMIT"
                    }, {
                        "label": context.getMessage('utm_antivirus_block'),
                        "value": "BLOCK"
                    }, {
                        "label": context.getMessage('utm_antivirus_permit'),
                        "value": "PERMIT"
                    }],
                    "field-help": {
                        "content": context.getMessage('utm_antivirus_default_action_tooltip')
                    }
                },
                {
                    "element_textarea": true,
                    "id": "anti_virus_file_extension",
                    "name": "anti_virus_file_extension",
                    "value": "{{scan-options.scan-file-extension}}",
                    "label": context.getMessage('utm_antivirus_file_extension'),
                    "class": "kaspersky-type-specific-settings",
                    "post_validation": "fileExtensionListValidator",
                    "placeholder": context.getMessage('utm_antivirus_file_extensions_placeholder'),
                    "help": context.getMessage('utm_antivirus_file_extension_help')
                }]
              }]
             };
           };
        };
        return Configuration;
});

