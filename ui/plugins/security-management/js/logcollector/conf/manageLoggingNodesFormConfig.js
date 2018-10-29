define([], function () {

  var Configuration = function(context) {
     
    this.getValues = function() {
     
       return{
                "form_id": "manage_logging_nodes_form",
                "form_name": "manage_logging_nodes_form",
                "title": "Log Collector",
                "title-help": {
                    "content": "Log Collector",
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "sections": [
                          {
                              "elements": [
                                  {
                                      "element_text": true,
                                      "id": "manage-logging-nodes-grid",
                                      "class": "manageloggingnodesgrid",
                                      "name": "manage-logging-nodes-grid"
                                     
                                  }
                              ]
                          }
                      ]
       };
    };
  };   
    return Configuration;
});