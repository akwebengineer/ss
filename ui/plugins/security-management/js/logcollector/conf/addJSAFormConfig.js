define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "form_id": "add_jsa_form",
                "form_name": "add_jsa_form",
                "sections": [
                          {                            
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
                                                "error": context.getMessage("no_space")
                                            },                                            
                                            {
                                               "pattern": "length", 
                                               "min_length":"1",                                                                                             
                                               "max_length":"32",
                                               "error": context.getMessage("max_length_32")

                                            }
                                        ],
                                        "error": true
                                    },
                                    {
                                        "element_ip": true,
                                        "id": "node1_ip",
                                        "name": "node1_ip",
                                        "label": context.getMessage('ip_address'),
                                        "placeholder": context.getMessage('ipv4_ipv6'),
                                        "required": true,
                                        "field-help":{
                                          "content" : context.getMessage("log_node_ipaddress_field_help")
                                       },
                                        "error": context.getMessage('valid_ip')
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
                                       }
                                    }
                            ]
                          }
                          
                      ]
       };
    };
  };   
    return Configuration;
});