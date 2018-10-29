/**
 *  A configuration object for Update User Firewall form
 *  
 *  @module pUser Firewall form
 *  @author svaibhav
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function(option) {

            this.constructFinalActionButton = function(){
                var actionButtons = [],
                updateBtn = {
                    "id": "btnDeploy",
                    "name": "Update",
                    "value": context.getMessage("deploy_context_menu_title")
                };
                actionButtons.push(updateBtn);
                return actionButtons;
            }
                return {
                    "form_id": "update_user_firewall_form",
                    "form_name": "update_user_firewall_form",
                    "on_overlay": true,
                    "title-help": option.titleHelp,
                    "err_div_id": "errorDivPublishWarning",
                    "err_div_message": context.getMessage("form_error"),
                    "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                    "err_div_link_text": context.getMessage("fw_policy_create"),
                    "err_timeout": "10000",
                    "valid_timeout": "10000",
                    "title": option.title,
                    "sections": [
                        {
                          "heading_text": option.headingText,
                          "elements": [
                              {
                                  "element_text": true,
                                  "id": "update-common-grid",
                                  "class": "updatecommongrid",
                                  "name": "update-common-grid",
                                  "placeholder": context.getMessage('loading')

                              }
                          ]
                      }
                    ],
                  "buttonsAlignedRight": true,
                    "buttons": this.constructFinalActionButton(),
                    "cancel_link": {
                        "id": "linkDeployCancel",
                        "value": context.getMessage('cancel')
                    }
                };

            };

        };

        return Configuration;
    }

);
