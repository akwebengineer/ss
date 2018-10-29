/**
 *Launch overlay to get input from user when Diffserv Marking is selected in Actiion Editor
 * @copyright Juniper Networks, Inc. 2015
 */
 define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget'
],
function(Backbone, Syphon, OverlayWidget,FormWidget) {

    var CodePointView = Backbone.View.extend({

        events: {
            'click #ok': "submit",
            'click #cancel': "cancel"
        },
       
        initialize: function(options) {
            this.parentInstance = options.parentInstance;
            this.currentRule = options.currentRule;
            this.context = options.context;
            this.selectedAction = options.selectedAction;
        },
        
        render: function() {
            var formElement = {
                  "title": this.context.getMessage('ips_rulegrid_action_code_point'),
                  "title-help": {
                        "content": this.context.getMessage("ips_rulegrid_action_code_point"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                  "form_id" : "code-point-form",
                  "form_name" : "code-point-form",
                  "err_div_message": this.context.getMessage("form_error"),
                  "err_div_link": "http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
                  "err_div_link_text": "Enter code point help",
                  "err_timeout": "1000",
                  "valid_timeout": "5000",
                  "on_overlay": true,
                  "sections":[
                      {
                          "elements":[
                            {
                                "element_number": true,
                                "id": "code-point",
                                "name": "code-point",
                                "label": this.context.getMessage("ips_rulesgrid_code_point"),
                                "required" : true,
                                "min_value":"0",
                                "max_value":"63",
                                "value": "0",
                                "error": "Please enter a number between 0 and 63"
                            }
                          ]
                      }
                  ],
                  "buttonsAlignedRight": true,
                  "buttons": [
                      {   
                          "id": "ok",
                          "name": "ok",
                          "value": this.context.getMessage('ok')
                      }
                  ],
                  "cancel_link": {
                    "id": "cancel",
                    "value": this.context.getMessage("cancel")
                }  
            };
            this.formWidget = new FormWidget({
                "elements": formElement,
                "container": this.el
            });
            this.formWidget.build();
            this.populateForm();
            return this;
        },

        populateForm: function(){
            var self = this;
            if(!_.isEmpty(self.currentRule)){
                var actionData = self.currentRule.get('action-data');
                if(!_.isEmpty(actionData) && actionData['dscpcode']){
                  self.$el.find('#code-point').val(actionData['dscpcode']);
               }
            }
        },

        submit: function(event) {
          event.preventDefault();
          if(this.formWidget.isValidInput(this.$el.find('form'))) {        
            var data = Syphon.serialize(this);
            this.currentRule.set({"action-data":{"dscpcode" :data['code-point'],"action":this.selectedAction}});
            this.parentInstance.ruleCollection.modifyRule(this.currentRule);  
            this.parentInstance.Overlay.destroy();
          }
        },
        
        cancel: function(event) {
            event.preventDefault();
            this.parentInstance.Overlay.destroy();
        }
    });

    return CodePointView;

});