/**
 * Form configuration required to render UTM Anti-Virus general form using the FormWidget.
 *
 * @module UTM Anti-Virus general Form Configuration
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {

    var Configuration = function(context) {

          var NAME_MAX_LENGTH = 29,
          NAME_MIN_LENGTH = 1,
          DESCRIPTION_MAX_LENGTH = 255;

          this.getValues = function() {
              return {
                "form_id": "anti_virus_general_form",
                "form_name": "anti_virus_general_form",
                "add_remote_name_validation": 'name',
                "sections": [
                  {
                    "elements": [
                    {
                        "element_multiple_error": true,
                        "id": "name",
                        "name": "name",
                        "value": "{{name}}",
                        "label": context.getMessage('name'),
                        "required": true,
                        "pattern-error": [
                            {
                                "pattern": "validtext",
                                "error": context.getMessage('name_require_error')
                            },
                            {
                                "pattern": "length",
                                "max_length": NAME_MAX_LENGTH,
                                "min_length": NAME_MIN_LENGTH,
                                "error": context.getMessage("maximum_length_error", [NAME_MAX_LENGTH])
                            }
                        ],
                        "error": true,
                        "notshowvalid": true,
                        "post_validation": "blankNameValidator",
                        "field-help": {
                            "content": context.getMessage('utm_antivirus_name_tooltip')
                        }
                    },
                    {
                        "element_textarea": true,
                        "id": "description",
                        "name": "description",
                        "value": "{{description}}",
                        "label": context.getMessage('description'),
                        "max_length": DESCRIPTION_MAX_LENGTH,
                        "post_validation": "lengthValidator",
                        "field-help": {
                            "content": context.getMessage('utm_antivirus_description_tooltip')
                        }
                    },
                    {
                        "element_dropdown": true,
                        "id": "dropdown_engine_type",
                        "name": "dropdown_engine_type",
                        "label": context.getMessage('utm_antivirus_engine_type'),
                        "values": [
                            {
                                "label": context.getMessage('utm_antivirus_profile_type_kaspersky'),
                                "value": "KASPERSKY"
                            },
                            {
                                "label": context.getMessage('utm_antivirus_profile_type_juniper_express'),
                                "value": "JUNIPER_EXPRESS"
                            },
                            {
                                "label": context.getMessage('utm_antivirus_profile_type_sophos'),
                                "value": "SOPHOS"
                            }
                        ],
                        "field-help": {
                            "content": context.getMessage('utm_antivirus_engine_type_tooltip')
                        }
                    }]
                  }
                ]
              };
          };
    };
  return Configuration;
});

