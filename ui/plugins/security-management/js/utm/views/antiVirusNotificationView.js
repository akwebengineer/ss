  /**
 * A view implementing notification form workflow for create UTM Anti-Virus Profile wizard.
 * @module antiVirusNotificationView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/antiVirusNotificationFormConf.js',
    '../views/antiVirusStepView.js'
], function(Backbone, Syphon, FormWidget, Form, StepView) {

    var FormView = StepView.extend({
        events: {
            'click #checkbox_fallback_deny': "fallbackDenyChange",
            'click #checkbox_fallback_non_deny': "fallbackNonDenyChange",
            'click #checkbox_virus_detection': "virusDetectionChange"
        },

        render: function(){
            var formConfiguration = new Form(this.context);
            this.form = new FormWidget({
                "container": this.el,
                elements: formConfiguration.getValues(),
                values: this.model.attributes
            });
            this.form.build();

            this.$el.addClass("security-management");


            // bind some validation for current page
            this.notificationInfoValidation(formConfiguration.getValues());

            // get values from model for form elements
            this.getNotificationInfo();

            return this;
     },

     getTitle: function(){
         return this.context.getMessage('utm_antivirus_notification_heading');
     },

    getSummary: function() {
        var summary = [];

        summary.push({
          label: this.context.getMessage('utm_antivirus_notification_heading'),
          value: ' '
        });

        summary.push({
            label: this.context.getMessage('utm_antivirus_fallback_deny_heading'),
            value: (this.$el.find("#checkbox_fallback_deny").is(':checked')) ? this.context.getMessage('enabled') : this.context.getMessage('disabled') 
          });

        summary.push({
            label: this.context.getMessage('utm_antivirus_fallback_non_deny_heading'),
            value: this.$el.find("#checkbox_fallback_non_deny").is(':checked') ? this.context.getMessage('enabled') : this.context.getMessage('disabled')
          });

        summary.push({
            label: this.context.getMessage('utm_antivirus_virus_detected_heading'),
            value: this.$el.find("#checkbox_virus_detection").is(':checked') ? this.context.getMessage('enabled') : this.context.getMessage('disabled')
          });
        return summary;
    },

    beforePageChange: function() {
        if (! this.form.isValidInput() || ! this.isTextareaValid()) {
             console.log('form is invalid');
             return false;
         }

        var properties = Syphon.serialize(this);
        var notifyInfo = this.setNotificationInfo(properties);
        this.model.set(notifyInfo);

        return true;
    },

    notificationInfoValidation: function(formElements) {
        this.addSubsidiaryFunctions(formElements);
    },

    getNotificationInfo: function() {
        // set each section content initial state disable.
        this.fallbackDenySectionShow(false);
        this.fallbackNonDenySectionShow(false);
        this.virusDetectionSectionShow(false);
        var widgets = this.form.getInstantiatedWidgets();

        // Set value for page items "Fallback Deny" section
        if (this.model.get('fallback-block-notification-options')) {

            if(this.model.get('fallback-block-notification-options')['allow-email']) {
                this.$el.find('#checkbox_allow_mail').prop('checked',true);
            }

            if(this.model.get('fallback-block-notification-options')['display-host-name']) {
                this.$el.find('#checkbox_display_hostname').prop('checked',true);
            }

            if(this.model.get('fallback-block-notification-options')['fallback-block-notification-option']) {
                  var isChecked = this.model.get('fallback-block-notification-options')['fallback-block-notification-option']['notify-mail-sender'];
                  this.$el.find('#checkbox_fallback_deny').prop('checked',isChecked);
                  this.fallbackDenySectionShow(isChecked);

                  var fallbackNotificationType = this.model.get('fallback-block-notification-options')['fallback-block-notification-option']['notification-type'];
                  widgets["dropDown_dropdown_fallback_notify_type"]["instance"].setValue(fallbackNotificationType);
            }
        }

        // Set value for page items "Fallback Non-Deny" section
        if (this.model.get('fallback-non-block-notification-options'))
        {
          var isChecked = this.model.get('fallback-non-block-notification-options')['notify-mail-sender'];
          this.$el.find('#checkbox_fallback_non_deny').prop('checked',isChecked);
          this.fallbackNonDenySectionShow(isChecked);
        }

        // Set value for page items "Virus Detected" section
        if (this.model.get('virus-detection-notification-options'))
        {
          var isChecked = this.model.get('virus-detection-notification-options')['notify-mail-sender'];
          this.$el.find('#checkbox_virus_detection').prop('checked',isChecked);
          this.virusDetectionSectionShow(isChecked);

          var virusNotificationType = this.model.get('virus-detection-notification-options')['notification-type'];
          widgets["dropDown_dropdown_virus_notify_type"]["instance"].setValue(virusNotificationType);
        }
        
    },

    setNotificationInfo: function(properties) {
        var jsonDataObj = {};

        // for Fallback Deny Option
        jsonDataObj["fallback-block-notification-options"] = {};

        jsonDataObj["fallback-block-notification-options"]["fallback-block-notification-option"] = {};
        jsonDataObj["fallback-block-notification-options"]["fallback-block-notification-option"]["notify-mail-sender"] = properties["checkbox_fallback_deny"];

        // data will be saved only when checkbox is chosen status
        if (properties["checkbox_fallback_deny"])
        {
            if (properties["fallback_deny_mail"])
            {
                jsonDataObj["fallback-block-notification-options"]["administrator-email-address"] = properties["fallback_deny_mail"];
            }
            if (properties["checkbox_allow_mail"])
            {
                jsonDataObj["fallback-block-notification-options"]["allow-email"] = properties["checkbox_allow_mail"];
            }
            if (properties["checkbox_display_hostname"])
            {
                jsonDataObj["fallback-block-notification-options"]["display-host-name"] = properties["checkbox_display_hostname"];
            }
    
            jsonDataObj["fallback-block-notification-options"]["fallback-block-notification-option"]["custom-notification-message"] = properties["fallback_deny_message"];
            jsonDataObj["fallback-block-notification-options"]["fallback-block-notification-option"]["notification-type"] = properties["dropdown_fallback_notify_type"];
            jsonDataObj["fallback-block-notification-options"]["fallback-block-notification-option"]["custom-notification-subject"] =properties["fallback_deny_subject"];
        }

        // for Fallback Non-Deny Option
        jsonDataObj["fallback-non-block-notification-options"] = {};
        jsonDataObj["fallback-non-block-notification-options"]["notify-mail-sender"] = properties["checkbox_fallback_non_deny"];

        // data will be saved only when checkbox is chosen status
        if (properties["checkbox_fallback_non_deny"])
        {
            jsonDataObj["fallback-non-block-notification-options"]["custom-notification-message"] = properties["fallback_non_deny_message"];
            jsonDataObj["fallback-non-block-notification-options"]["custom-notification-subject"] =properties["fallback_non_deny_subject"];
        }

        // for Virus Detection Option
        jsonDataObj["virus-detection-notification-options"] = {};
        jsonDataObj["virus-detection-notification-options"]["notify-mail-sender"] = properties["checkbox_virus_detection"];

        if (properties["checkbox_virus_detection"])
        {
            jsonDataObj["virus-detection-notification-options"]["notification-type"] = properties["dropdown_virus_notify_type"];
            jsonDataObj["virus-detection-notification-options"]["custom-notification-message"] = properties["virus_detected_message"];
            jsonDataObj["virus-detection-notification-options"]["custom-notification-subject"] =properties["virus_detected_subject"];
        }

        return jsonDataObj;
    },

    fallbackDenyChange: function() {
        var isChecked = this.$el.find('#checkbox_fallback_deny').is(':checked');
        this.fallbackDenySectionShow(isChecked);
    },

    fallbackDenySectionShow: function(isShow) {
        if (isShow)
        {
            this.$el.find(".fallback-deny-settings").show();
        } else {
            this.$el.find(".fallback-deny-settings").hide();
        }
    },

    fallbackNonDenyChange: function() {
        var isChecked = this.$el.find('#checkbox_fallback_non_deny').is(':checked');
        this.fallbackNonDenySectionShow(isChecked);
    },

    fallbackNonDenySectionShow: function(isShow) {
        if (isShow)
        {
           this.$el.find(".fallback-non-deny-settings").show();
        } else {
           this.$el.find(".fallback-non-deny-settings").hide();
        }
    },

    virusDetectionSectionShow: function(isShow) {
        if (isShow)
        {
            this.$el.find(".virus-detected-settings").show();
        } else {
            this.$el.find(".virus-detected-settings").hide();
        }
    },

    virusDetectionChange: function() {
        var isChecked = this.$el.find('#checkbox_virus_detection').is(':checked');
        this.virusDetectionSectionShow(isChecked);
    }

  });

  return FormView;
});