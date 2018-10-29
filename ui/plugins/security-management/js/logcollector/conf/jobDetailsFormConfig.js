/**
 * A  Grid Form Config to render the Node Job Details
 *
 * @module LogReportsDefinition
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([],
    function() {

        var Configuration = function(context) {

            this.getValues = function() {

                return {
                    "form_id": "log_node_job_details",
                    "title": "Node Job Details",
                    "form_name": "log_node_job_details",
                    "on_overlay": true,
                    "sections": [
                    {
                        "elements": [
                        {
                            "element_text": true,
                            "id": "log_job_details_list",
                            "class": "log_job_details_list",
                            "name": "log_job_details_listt",
                            "placeholder": context.getMessage('Loading ...')
                        }
                       

                        ]
                    }],
                   "buttonsAlignedRight": true,
                   "buttons": [ 
                    {
                        "id": "device_navigate",
                        "name": "device_navigate",
                        "value": context.getMessage('log_configure_device')
                    },                  
                    {
                        "id": "node_job_details_ok",
                        "name": "node_job_details_ok",
                        "value": context.getMessage('ok')
                    }
                    ]
                };

            };

        };

        return Configuration;
    }
);
