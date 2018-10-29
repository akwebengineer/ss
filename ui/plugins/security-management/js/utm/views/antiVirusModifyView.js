/**
 * View to modify a Anti-Virus profile
 *
 * @module AntivirusModifyView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/antiVirusModifyFormConfiguration.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    './antiVirusGeneralView.js',
    './antiVirusFallbackView.js',
    './antiVirusNotificationView.js',
    './utmUtility.js',
    'widgets/tooltip/tooltipWidget',
    'text!../../../../sd-common/js/templates/utmScanOption.html'
], function (Backbone, Syphon, FormWidget, ModifyForm, ResourceView, GeneralView, FallbackView, NotificationView, UTMUtility, TooltipWidget, tooltipTpl) {

    var AntivirusModifyView = ResourceView.extend({
        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.successMessageKey = 'utm_antivirus_create_success';
            this.editMessageKey = 'utm_antivirus_edit_success';
            this.fetchErrorKey = 'utm_antivirus_fetch_error';
            this.fetchCloneErrorKey = 'utm_antivirus_fetch_clone_error';

            /*  Elements and model in modify form is almost same as that in create profile wizard,
             *  For modify form, in order to avoid duplicated code, below methods will reuse that in create profile wizard view.
             *  1. method to get date from model
             *  2. method to set data for model
             */
            var generalView = new GeneralView();
            var fallbackView = new FallbackView();
            var notificationView = new NotificationView();

            this.setGeneralInfo = generalView.setGeneralInfo;
            this.setFallbackInfo = fallbackView.setFallbackInfo;
            this.setNotificationInfo = notificationView.setNotificationInfo;

            this.getGeneralInfo = generalView.getGeneralInfo;
            this.getFallbackInfo = fallbackView.getFallbackInfo;
            this.getNotificationInfo = notificationView.getNotificationInfo;

            this.fallbackDenySectionShow = notificationView.fallbackDenySectionShow;
            this.fallbackNonDenySectionShow = notificationView.fallbackNonDenySectionShow;
            this.virusDetectionSectionShow = notificationView.virusDetectionSectionShow;

            // extent some common utils for input validation
            _.extend(this, UTMUtility);
        },  

        events: {
            'click #utm-antivirus-save': "submit",
            'click #utm-antivirus-cancel': "cancel",
            'click #checkbox_fallback_deny': "fallbackDenyChange",
            'click #checkbox_fallback_non_deny': "fallbackNonDenyChange",
            'click #checkbox_virus_detection': "virusDetectionChange"
        },

        submit: function(event) {
            event.preventDefault();

            if (! this.form.isValidInput() ||
                ! this.isTextareaValid() ||
                ! this.isFormValid("utm-antivirus-form")) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);
            var modifyData = this.setModifyData(properties);

            this.bindModelEvents();
            this.model.set(modifyData);
            this.beforeSave();
            this.model.save();
        },    

        render: function() {
            var self = this;
            var formConfiguration = new ModifyForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            // Add tooltip for scan option area
            var scan_option_help_data = {
                    summary: this.context.getMessage('utm_antivirus_scan_option_tooltip_summary'),
                    defalut_value1: this.context.getMessage('utm_antivirus_scan_option_tooltip_defalut_value1'),
                    defalut_value2: this.context.getMessage('utm_antivirus_scan_option_tooltip_defalut_value2')
                };

            var tooltipView = Slipstream.SDK.Renderer.render(tooltipTpl, scan_option_help_data);

           
            this.tooltipWidgetScanView = new TooltipWidget({
                "container": this.$el.find('#section_scan_option h5'),
                "view": tooltipView
            });
            this.tooltipWidgetScanView.build();

            // Add tooltip for content size limit
            var stringView  = this.context.getMessage('utm_antivirus_content_size_tooltip');
            this.tooltipWidgetContentView = new TooltipWidget({
                "container": this.$el.find('#anti_virus_content_size_limit'),
                "view": stringView
            });
            this.tooltipWidgetContentView.build();

          // It's a temporary workaround for label in the form widget
          this.$el.find('#text_label_fallback_block').hide();
          this.$el.find('#text_label_non_fallback_block').hide();
          this.$el.find('#text_label_virus_detection').hide();
          this.$el.find('#dropdown_engine_type').attr("readonly", true);

          this.$el.addClass("security-management");

          // Add unit for timeout(temporary workaround)
          var timeout_unit = "<span id='timeout_unit' class='optionselection inline'>"+ 
              "<label>"+this.context.getMessage('utm_web_filtering_timeout_second') +"</label></span>";
          this.$el.find("#timeout").parent().after(timeout_unit);

          // Add unit for content size(temporary workaround)
          var content_unit = "<span id='content_unit' class='optionselection inline'>"+ 
              "<label>"+this.context.getMessage('utm_antivirus_kilo_bytes') +"</label></span>";
          this.$el.find("#anti_virus_content_size_limit").parent().after(content_unit);

          //set width for section title in order to adjust location of tooltip(temporary workaround)
          this.$el.find("#section_scan_option h5").addClass("elementtime-row-right");

          this.ModifyFormValidation(formElements);
          this.setDefaultValueOfDropdowns();
          this.getModifyFormData();

          return this;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_antivirus_grid_edit');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_antivirus_grid_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        fallbackDenyChange: function() {
            var isChecked = this.$el.find('#checkbox_fallback_deny').is(':checked');
            this.fallbackDenySectionShow(isChecked);
        },

        fallbackNonDenyChange: function() {
            var isChecked = this.$el.find('#checkbox_fallback_non_deny').is(':checked');
            this.fallbackNonDenySectionShow(isChecked);
        },

        virusDetectionChange: function() {
            var isChecked = this.$el.find('#checkbox_virus_detection').is(':checked');
            this.virusDetectionSectionShow(isChecked);
        },

        setDefaultValueOfDropdowns: function() {
            var widgets = this.form.getInstantiatedWidgets();
            for(widget in widgets) {
                widgets[widget].instance.setValue(null);
            }
        },

        getModifyFormData: function() {
            this.getGeneralInfo();
            this.getFallbackInfo();
            this.getNotificationInfo();
        },

        setModifyData: function(properties) {
            var jsonDataObj = {};

            _.extend(jsonDataObj, this.setGeneralInfo(properties));
            _.extend(jsonDataObj, this.setFallbackInfo(properties));
            _.extend(jsonDataObj, this.setNotificationInfo(properties));

            // it is a modify page specific element
            jsonDataObj["trickling-timeout"] = properties["timeout"];

            return jsonDataObj;
        },

        ModifyFormValidation: function(formElements) {

            // Bind blur event
            this.bindBlur(['anti_virus_file_extension'], function(comp){
                this.separateValuesWithBlank(comp);
            });

            this.addSubsidiaryFunctions(formElements);
        }
    });

    return AntivirusModifyView;
});