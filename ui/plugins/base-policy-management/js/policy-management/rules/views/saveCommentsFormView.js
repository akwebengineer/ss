/**
 *
 * @copyright Juniper Networks, Inc. 2015
 */
 define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../../../../../ui-common/js/common/utils/validationUtility.js'
],
function(Backbone, Syphon, OverlayWidget,FormWidget,ValidationUtility) {

    var ShowCommentsView = Backbone.View.extend({

        events: {
            'click #ok': "submit",
            'click #cancel': "cancel"
        },
       
        initialize: function(options) {
            _.extend(this, ValidationUtility);
            this.parentView = options.parentView;
            this.context = options.parentView.context;
        },
        
        render: function() {
            var formElement = {
                  "title": this.context.getMessage('save_comments'),
                  "title-help": {
                        "content": this.context.getMessage('save_comments_title_help'),
                        "ua-help-identifier": "alias_for_title_ua_event_binding"
                    },
                  "heading_text": this.context.getMessage('save_comments_description'),  
                  "form_id" : "save-comments-form",
                  "form_name" : "save-comments-form",
                  "err_div_id": "errorDiv",
                  "err_div_message": this.context.getMessage("form_error"),
                  "err_div_link_text": this.context.getMessage("save_commnets_form"),
                  "err_timeout": "1000",
                  "valid_timeout": "5000",
                  "on_overlay": true,
                  "sections":[
                      {
                          "section_id": "comments_form_sec",
                          "section_class": "section_class",
                          "elements":[
                              {
                                  "element_textarea": true,
                                  "id": "comments",
                                  "name": "comments",
                                  "value": "",
                                  "label": this.context.getMessage('comments'),
                                  "max_length": 2048,
                                  "rows": 7,
                                  "post_validation": "descriptionValidator",
                                  "placeholder": ""
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
            this.addSubsidiaryFunctions(formElement);
            return this;
        },
      
        submit: function(event) {
          event.preventDefault();
          var isFormValid = this.validateForm();
            if(!isFormValid) {
              return;
          }
          this.parentView.ruleCollection.savePolicy(this.$el.find('#comments').val());
          this.parentView.Overlay.destroy();
        },

        cancel: function(event) {
          event.preventDefault();
          this.parentView.Overlay.destroy();
        },

        validateForm : function(){
            return this.isTextareaValid();
        }
    });

    return ShowCommentsView;

});