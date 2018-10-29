/**
 * A view that uses the formWidget to a produce a form from a configuration file
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module Application Elements Values Form View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/form/conf/configurationSample',
    'widgets/form/formWidget',
    'widgets/form/tests/view/formOverlayView',
    'widgets/form/tests/view/tabFormGridOverlayView',
    'widgets/form/tests/view/formTabFormGridOverlayView',
    'widgets/form/tests/models/zonePoliciesModel',
    'widgets/form/conf/dynamicConfigurationSample',
    'widgets/grid/gridWidget',
    'widgets/form/tests/conf/gridConfiguration',
    'mockjax'
], function(Backbone, formConf, FormWidget, FormOverlayView, TabFormGridOverlayView, FormTabFormGridOverlayView, ZonePoliciesModel, dynamicElementsConfiguration, GridWidget, GridConfiguration, mockjax){
    var FormView = Backbone.View.extend({

        events: {
            "click #insert_json_dropdown": "insertDropdownValuesFromJson",
            "click #get_values": "getValues",
            "click #get_isvalid": "getIsValid",
            "click #show_overlay": "showOverlay",
            "click .toggle_form_error": "toggleFormError",
            "click .toggle_form_info": "toggleFormInfo",
            "click #show_tab_overlay": "showTabFormOverlay",
            "click #show_form_tab_overlay": "showFormTabFormOverlay",
            "click #toggle_section": "toggleSection",
            "click #add_section_l": "addLastSection",
            "click #add_section": "addSection",
            "click #add_elements": "addElements",
            "click #remove_elements": "removeElements",
            "click #show_inline_error": "showInlineError",
            "click #hide_inline_error": "hideInlineError"
        },

        initialize: function () {
            this.mockApiResponse();
            !this.options.pluginView && this.render();
        },

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.elements,
                "values": formConf.values,
                "container": this.el
            });
            this.form.build();
            this.accessIntegratedWidget(); // gets access to integrated widgets
            this.addPostValidationEvents();
            return this;
        },

        // Example to show inline error corresponding to externally integrated widget
        showInlineError: function(){
            // Provide the id of the element
            this.form.showFormInlineError("text_grid"); // This will show a inline error beneath the integrated widget
        },

        // Hide inline error corresponding to externally integrated widget
        hideInlineError: function(){
            this.form.showFormInlineError("text_grid",false);
        },

        // Gets access to integrated widgets
        accessIntegratedWidget: function(){
            var integratedWidgets = this.form.getInstantiatedWidgets();

            // get the date set in the 'datepicker time widget'
            var datePickerInstance = integratedWidgets['datePicker_text_dateTime_date_Widget']; //"datePicker_" prefix plus the id of the date picker container
            if (_.isObject(datePickerInstance)) {
                var dateTimeWidgetDate = datePickerInstance.instance.getDate();
                console.log(dateTimeWidgetDate);
            }

            //bind grid events
            var gridContainerInstance = integratedWidgets['grid_text_grid']; //"grid_" prefix plus the id of the grid container
            if (_.isObject(gridContainerInstance)) {
                var gridInstance = gridContainerInstance.instance;
                gridInstance.conf.container
                    .bind("addEvent", function(e, addGridRow){
                        console.log(addGridRow);
                        console.log(gridInstance.getNumberOfRows());
                    })
                    .bind("editEvent", function(e, updatedGridRow){
                        console.log(updatedGridRow);
                    })
                    .bind("deleteEvent", function(e, deletedGridRows){
                        console.log(deletedGridRows);
                        console.log(gridInstance.getNumberOfRows());
                    });
            }
        },
        //Inserts JSON object's value to the dropdown
        insertDropdownValuesFromJson: function(){
            var formVal = this.form.insertDropdownContentFromJson('dropdown_field_3_s', [{"text":"label","id":"value"},{"text":"label1","id":"value1"}],true);
            console.log(formVal);
        },

        //tests if the form has passed client validation and provides the form value as an Array of Objects
        getValues: function (){
            var form = this.$el.find('form');
            var isValid = this.form.isValidInput();
            console.log("form validation: " + isValid);
            if (isValid){
                var values = this.form.getValues();
                console.log("form.getValues()outputs:");
                console.log(values);
            }
        },

        //tests if the form has passed client validation and provides the form value as an Object
        getIsValid: function (){
            var form = this.$el.find('form');
            var isValid = this.form.isValidInput();
            console.log("form validation: " + isValid);
            if (isValid){
                var values = this.form.getValues(true);
                console.log("form.getValues(true)outputs:");
                console.log(values);
            }
        },

        showOverlay: function (){
            var self = this;
            var view = new FormOverlayView({
                'model': new ZonePoliciesModel.zone.model(),
                'zone': new ZonePoliciesModel.zone.collection(),
                'address': new ZonePoliciesModel.address.collection(),
                'application': new ZonePoliciesModel.application.collection(),
                'save': _.bind(self.save, self)
            });
        },

        showTabFormOverlay: function (){
            new TabFormGridOverlayView();
        },

        showFormTabFormOverlay: function (){
            new FormTabFormGridOverlayView({
                "type" : "large"
            });
        },

        toggleFormError: function (){
            this.showFormError = !this.showFormError;
            this.form.showFormError("Updated Error Message", this.showFormError);
        },

        toggleFormInfo: function (){
            this.showFormInfo = !this.showFormInfo;
            this.form.showFormInfo("Updated: This device is being used by <i>root</i>. Please, refrain from using it.", this.showFormInfo);
        },

        toggleSection: function () {
            this.form.toggleSection("section_id_3");
            this.form.toggleSection("section_id_8");
            this.form.toggleSection("section_id_10");
            this.form.toggleRow("custom_callback_Obj");
        },

        addLastSection: function () {
            this.form.addSection(dynamicElementsConfiguration.section3);
        },

        addSection: function () {
            this.form.addSection(dynamicElementsConfiguration.section1, '#section_id_5', true);
            this.form.addSection(dynamicElementsConfiguration.section2, '#section_id_6');
        },

        addElements: function () {
            this.form.addElements(dynamicElementsConfiguration.elements1, '.text_string_class', true);
            this.form.addElements(dynamicElementsConfiguration.elements2, '.text_alphanumeric_class');
        },

        removeElements: function () {
            this.form.removeElements('.element_delete');
            this.form.removeElements('#section_id3');
        },

        save:  function(data) {
            console.log(data);
        },

        addPostValidationEvents: function (){
            this.$el.find('#text_area').bind("validTextarea", function(e, isValid){
//                console.log("the validation was completed and the result is: " + isValid);
            });
        },

        mockApiResponse: function(){
            /* mocks REST API implementation for remote validation with object validator of an input value */
            $.mockjax({
                url: /^\/form-test\/remote-validation\/object\/developer-first-generation\/([a-zA-Z0-9\-\_]*)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["Andrew","Vidushi","Dennis","Brian","Kyle","Miriam","Aslam","Kiran","Sujatha","Eva", "testRemote"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 10000
            });
            /* mocks REST API implementation for remote validation with callback */
            $.mockjax({
                url: /^\/form-test\/remote-validation\/callback\/developer-new-generation\/([a-zA-Z0-9\-\_]*)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["Sujatha","Andrew","Miriam","Vidushi","Eva","Sanket","Arvind","Viswesh","Swena", "testRemote"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 10000
            });

            /* mocks REST API implementation for form validation with callback */
            $.mockjax({
                url: /^\/form-test\/submit-callback\/spinner-build-test1\/$/,
                status: 500,
                response: function(settings) {
                    this.responseText = "true";
                },
                responseTime: 10000
            });

            /* mocks REST API implementation for form validation with callback */
            $.mockjax({
                url: /^\/form-test\/submit-callback\/spinner-build-test2\/$/,
                response: function(settings) {
                    this.responseText = "true";
                },
                responseTime: 10000
            });
        }



    });

    return FormView;
});