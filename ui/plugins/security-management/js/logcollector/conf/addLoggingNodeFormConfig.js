define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "form_id": "add_logging_node_form",
                "form_name": "add_logging_node_form",
                "sections": [
                          {
                            "heading": "Node 1",
                            "section_id": "node_1",
                            "elements": [
                                    {
                                       "element_multiple_error": true,
                                       "id": "node_name1",
                                       "class": "tab-widget",
                                       "label": context.getMessage("log_node_name"),
                                       "required": true,
                                       "field-help":{
                                          "content" : context.getMessage("log_node_name_field_help")
                                       },
                                       "name": "node_name1",
                                       "pattern-error": [                                            
                                            {
                                                "pattern": "hasnotspace",
                                                "error": "Must not include a space."
                                            },
                                            {
                                               "pattern": "length", 
                                               "min_length":"1",                                                                                             
                                               "max_length":"32",
                                               "error": "Max length cannot excced 32 characters"

                                            }

                                        ],
                                        "error": true
                                    },
                                    {
                                        "element_ip": true,
                                        "id": "node1_ip",
                                        "name": "node1_ip",
                                        "label": context.getMessage('ip_address'),
                                        "placeholder": "IPv4 or IPv6",
                                        "required": true,
                                        "field-help":{
                                          "content" : context.getMessage("log_node_ipaddress_field_help")
                                       },
                                        "error": "Please enter a valid IP address"
                                    },
                                    {
                                        "element_description": true,
                                        "id": "node_1ip_type",
                                        "name": "node1_ip_type",
                                        "class":"log-collector-type",
                                        "label": ""
                                    },
                                    {
                                       "element_text": true,
                                       "id": "node_username1",
                                       "class": "tab-widget",
                                       "label": context.getMessage("log_node_user_name"),
                                       "required": true,
                                       "field-help":{
                                          "content" : context.getMessage("log_node_user_name_field_help")
                                       },
                                       "name": "node_username1"
                                    },
                                    {
                                        "element_password": true,
                                        "id": "node1_password",
                                        "name": "node1_password",
                                        "label": context.getMessage('password'),
                                        "error": false,
                                        "required": true,
                                        "notshowvalid": true,
                                        "field-help":{
                                          "content" : context.getMessage("log_node_password_field_help")
                                       },
                                        "inlineButtons": [{
                                    "id": "addMoreNode1",
                                    "class": "slipstream-primary-button slipstream-secondary-button",
                                    "name": "addMoreNode1",
                                    "value": context.getMessage('add_node')
                                    }],
                                    },
                                    {
                                        "element_checkbox": true,
                                        "id": "use_node_1_pasword",
                                        "values": [
                                          {
                                              "id": "use_node_1_pasword_status",
                                              "name": "use_node_1_pasword_status",
                                              "label": context.getMessage('use_node_1_pasword'),
                                              "value": "true",
                                              "checked": false
                                          }
                                          ]
                                    }
                            ]
                          }
                          
                      ]
       };
    };
  };   
    return Configuration;
});