/**
 *Launch overlay to get input from user when Constant String rule name is selected.
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

    var RuleNameTemplateConstantView = Backbone.View.extend({

        events: {
            'click #ok': "submit",
            'click #cancel': "cancel"
        },
       
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.parentElementId = options.parentElementId;
        },
        
        render: function() {
            var formElement = {
                  "title": this.context.getMessage('rule_name_template_constant'),
                  "title-help": {
                        "content": this.context.getMessage("rule_name_template_constant_info"),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                  "form_id" : "rule-name-tempalte-constant-configuration",
                  "form_name" : "rule-name-tempalte-constant-configuration",
                  "on_overlay": true,
                  "sections":[
                      {
                          "elements":[
                              {
                                  "element_textarea": true,
                                  "id": "constantString",
                                  "name": "constantString",
                                  "value": "",
                                  "label": "Constant String"
                              }
                          ]
                      }
                  ],
                  "buttonsAlignedRight": true,
                  "buttons": [
                      {
                          "id": "cancel",
                          "name": "cancel",
                          "value": this.context.getMessage('cancel')
                      },
                      {   
                          "id": "ok",
                          "name": "ok",
                          "value": this.context.getMessage('ok')
                      }
                  ]  
            };
            this.formWidget = new FormWidget({
                "elements": formElement,
                "container": this.el
            });
            this.formWidget.build();
            return this;
        },
      
        submit: function(event) {
          event.preventDefault();
          this.parentView.updateRowIdRuleNameMapString(this.parentElementId, this.$el.find('#constantString').val());
          this.parentView.Overlay.destroy();
        },
        
        cancel: function(event) {
            event.preventDefault();
            this.parentView.Overlay.destroy();
        }
    });

    return RuleNameTemplateConstantView;

});