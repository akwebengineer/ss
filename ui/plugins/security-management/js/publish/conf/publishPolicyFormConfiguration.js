/**
 *  A configuration object for Publish Policy form
 *  
 *  @module publish policy form
 *  @author vinay<vinayms@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function(option) {
            /**
             *  construct Form buttons based on publish or update option
             *  returns actionButtons array of elements
             */
            this.constructFinalActionButton = function(){
                var actionButtons = [],
                publishBtn = {
                    "id": "btnPublish",
                    "name": "Publish",
                    "value": context.getMessage("publish_context_menu_title")
                },
                updateBtn = {
                   "id": "btnPublishUpdate",
                   "name": "Publish and Update",
                   "value": context.getMessage("publish_update_button_text")
                };
                if(option.isUpdate){
                    actionButtons.push(updateBtn);
                }else{
                    actionButtons.push(publishBtn);
                }
                
                return actionButtons;
            }


                return {
                    "form_id": "publish_policy_form",
                    "form_name": "publish_policy_form",
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
                            "elements": [
                                {
                                    "element_description": true,
                                    "id": "publish_update_schedule",
                                    "class": "publish_update_schedule",
                                   // "class": "hide schedulerLabel",
                                    "name": "schedulerLabel"/*,
                                    "value": "",
                                    "label": context.getMessage('policy_schedule_later_time')*/
                                }
                            ]
                        },
                        {
                          "heading_text": option.headingText,
                          "elements": [
                              {
                                  "element_text": true,
                                  "id": "publish-common-grid",
                                  "class": "publishcommongrid",
                                  "name": "publish-common-grid",
                                  "placeholder": context.getMessage('loading')

                              }
                          ]
                      }
                    ],
                  "buttonsAlignedRight": true,
                    "buttons": this.constructFinalActionButton(),
                    "cancel_link": {
                        "id": "linkPublishCancel",
                        "value": context.getMessage('cancel')
                    }
                };

            };

        };

        return Configuration;
    }

);
