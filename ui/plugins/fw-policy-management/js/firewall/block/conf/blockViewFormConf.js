/**
 *  A configuration object for Block Application Policy form
 *
 *  @author Tashi Garg<tgarg@juniper.net>
 *  @copyright Juniper Networks, Inc. 2016
 * */
define([],
    function () {

        var Configuration = function (context) {

            this.getValues = function (option) {
                /**
                 *  construct Form buttons based on publish or update option
                 *  returns actionButtons array of elements
                 */
                this.constructFinalActionButton = function (option) {
                    var actionButtons = [];

                    if (option.hasSaveButton) {
                        actionButtons.push({
                            "id": "saveButton",
                            "name": "save",
                            "value": context.getMessage("action_save")
                        });
                    }

                    if (option.hasPublishButton) {
                        actionButtons.push({
                            "id": "publishButton",
                            "name": "Publish",
                            "value": context.getMessage("publish_context_menu_title")
                        });
                    }

                    actionButtons.push({
                        "id": "updateButton",
                        "name": "Publish and Update",
                        "value": context.getMessage("update_context_menu_title")
                    });

                    return actionButtons;

                };


                return {
                    "form_id": "block_app_policy_form",
                    "on_overlay": true,
                    "title-help": option.help,
                    "title": option.title,
                    "sections": [
                        {
                            "heading_text": option.blockMessage +  ' Click on the policy to view these changes.',
                            "elements": [
                                {
                                    "element_text": true,
                                    "id": "app-secure-block-grid",
                                    "class": "app-secure-block-grid fw-policy-management",
                                    "name": "app-secure-block-grid"
                                },

                                {
                                    "element_description": true,
                                    "id": "x_publish_update_schedule",
                                    "class": "publish_update_schedule",
                                    "name": "schedulerLabel"
                                }
                            ]
                        }

                    ],
                    "buttonsAlignedRight": true,
                    "buttons": this.constructFinalActionButton(option),
                    "cancel_link": {
                        "id": "cancelBlockApp",
                        "value": context.getMessage('cancel')
                    }
                };

            };

        };

        return Configuration;
    }
);
