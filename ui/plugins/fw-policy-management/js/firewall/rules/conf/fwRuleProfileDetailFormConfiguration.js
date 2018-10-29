/**
 * A form configuration object which contains all the information about the policy profile.
 *
 * @module fwRuleProfileDetailFormConfiguration
 * @author Judy Nguyen <jnguyen@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([], function () {
    // var profileDetailConfiguration = function (context, policyObj) {

        var profileDetailConfiguration = {};

        profileDetailConfiguration.list = {
                "title":  "Policy Profile",
                "form_id": "profile-detail-form",
                "form_name": "profile-detail-form",
                //  "title-help": {
                //     "content": context.getMessage("fw_rules_edit_profile"),
                //     "ua-help-identifier": "alias_for_title_edit_profile_binding"
                // },
                // "err_div_id": "errorDiv",
                // "err_div_message": context.getMessage("form_error"),
                // "err_div_link_text": context.getMessage("fw_rules_edit_profile"),
                // "err_timeout": "1000",
                // "valid_timeout": "5000",              
                "on_overlay": true,
                "sections": [
                    {
                        "heading_id": "profile_detail_heading_text",
                        "heading_text": ""
                    }
                ],
                // "buttonsAlignedRight": true,
                "buttons": [
                    {
                        "id": "okProfileDetail",
                        "name": "okProfileDetail",
                        "value": "OK"
                    }
                ]
                // "cancel_link": {
                //     "id": "cancel",
                //     "value": context.getMessage("cancel")
                // }
//            }
        };
//    };

    return profileDetailConfiguration;

});
