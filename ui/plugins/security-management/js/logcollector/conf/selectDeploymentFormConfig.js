define([], function () {

  var Configuration = function(context,view) {
     
    this.getValues = function() {
     
       return{
                "form_id": "add_logging_node_form",
                "form_name": "add_logging_node_form",
                "sections": [
                         {
                            "section_id": "select_deployment",
                            "elements": [
                                {
                                    "element_dropdown": true,
                                    "id": "log_collector_type",
                                    "name": "log_collector_type",
                                    "label": context.getMessage('log_collector_type'),
                                    "onChange": function(event) {                                  
                                        view.fetchDeploymentTypeDropDown();
                                     },
                                    "values": [                                       
                                       
                                        {
                                            "label": context.getMessage('sdlc'),
                                            "value": 1
                                        },
                                         {
                                            "label": context.getMessage('jsa'),
                                            "value": 0
                                        }
                                    ]
                                },
                                {
                                    "element_dropdown": true,
                                    "id": "deployment_type",
                                    "name": "deployment_type",
                                    "label": context.getMessage('deployment_type'),
                                    "values": [{
                                            "label": "Single Node",
                                            "value": 1,
                                            "id":"1",
                                            "text": "Single Node"                                           
                                        },{
                                            "label": "Two Nodes",
                                            "value": 2,
                                            "id":"2",
                                            "text": "Two Nodes"
                                        },
                                        {
                                            "label": "Three Nodes",
                                            "value": 3,
                                            "id":"3",
                                            "text": "Three Nodes"
                                        },
                                        {
                                            "label": "Four Nodes",
                                            "value": 4,
                                            "id":"4",
                                            "text": "Four Nodes"
                                        },
                                        {
                                            "label": "Five Nodes",
                                            "value": 5,
                                            "id":"5",
                                            "text": "Five Nodes"
                                        },
                                        {
                                            "label": "Six Nodes",
                                            "value": 6,
                                            "id":"6",
                                            "text": "Six Nodes"
                                        }]
                                }
                            ]
                          }
                         
                      ]
       };
    };
  };   
    return Configuration;
});
