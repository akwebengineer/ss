/**
 * A configuration object with the parameters required to build
 * a form for assign to assign to domain result form
 *
 * @module AssignToDomainResultFormConf
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
], function () {

    var Configuration = function(option) {

        this.getValues = function() {
            var context = option.context,
                objectTypeText = option.objectTypeText,
                domainTrack = option.domainTrack,
                resultMessageKey = option.resultMessageKey;

            return {
                "form_id": "assign-to-domain-result-form",
                "form_name": "assign-to-domain-result-form",
                "title": context.getMessage('assign_to_domain_title', [objectTypeText]),
                "on_overlay": true,
                "sections": [
                    {
                         "section_id": "assign-to-domain-tree-section",
                         "heading_text": context.getMessage(resultMessageKey, [objectTypeText, domainTrack]),
                         "elements": [
                              {
                                  "element_description": true,
                                  "id": "assign-to-domain-result-success",
                                  "label": context.getMessage("assign_to_domain_result_success_message", [objectTypeText]),
                                  "value": "{{successful}}"
                              },
                              {
                                  "element_description": true,
                                  "id": "assign-to-domain-result-fail",
                                  "label": context.getMessage("assign_to_domain_result_failure_message", [objectTypeText]),
                                  "value": "{{failed}}"
                              },
                              {
                                  "element_description": true,
                                  "id": "assign-to-domain-result-view-audit-log",
                                  "label": "",
                                  "value": ""
                              }
                         ]
                    }
                ],
                "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "result-close",
                        "name": "close",
                        "value": context.getMessage('close')
                    }
                ]
            };
        };
    };

    return Configuration;
});