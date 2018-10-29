/**
 * NAT Address editor view extends from AddressEditorView
 * @module AddressEditorView
 * @author Swathi Nagaraj<swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/form/formWidget',
    '../../../../../base-policy-management/js/policy-management/rules/views/ruleGridAddressEditorView.js',
    '../../../../../base-policy-management/js/policy-management/rules/models/urlFilters.js',
    '../conf/ruleGridAddressEditorFormConfiguration.js'
], function (FormWidget, AddressEditorView, URLFilters, AddressEditorFormConfiguration) {
    var NATAddressEditorView = AddressEditorView.extend({
        initialize: function () {
            AddressEditorView.prototype.initialize.apply(this);
        },
        
        dynamicRenderElements : function() {
            this.$el.find("#nat_rulesgrid_editor_staticDstnAddress_form").hide();
            // launch the 'list builder' object either default OR as provided in the editor view configuration
            var listBuilderContainer = this.$el.find('#' + this.editorFormElements.listBuilderElementID);
            var selectedIds = this.getSelectedIds();
            this.addListBuilder(listBuilderContainer, selectedIds);
        },

        render: function () {
            
            // Modify the title & description according to each editor
            if (this.editorFormMsgBundle && this.editorFormMsgBundle.title) {
                this.editorFormConfig.title = this.editorFormMsgBundle.title;
            }
             this.editorFormConfig.heading_text = this.getHeadingText();

            //build the form on editor view
            this.form = new FormWidget({
                "elements": this.editorFormConfig,
                "container": this.el
            });

            this.form.build();

            this.$el.addClass("security-management");

            this.updateFormValuesForEditor();
            this.bindEventHandlers();

            this.dynamicRenderElements();

            return this;
        },

        emptyAddressNotAllowed : function(){
            return false;
        },

        getExcluded : function(){
           return false;
        },

        setExcluded :function(flag){

        },

        getAddressFormConfiguration: function() {
           return new AddressEditorFormConfiguration(this.context);
        },

        getExcludedTypes: function() {
            var urlFilter = URLFilters.addressFilterForNATPolicy, 
                urlFilterStringArr = [],
                i = 0;

            for (i = 0; i < urlFilter.length; i++) {
                urlFilterStringArr.push(urlFilter[i].value);
            }
            return urlFilterStringArr;
        },

        getIntentExtras : function() {
            return {addressTypes: ['host','range','network','other']};
        }
    });

    return NATAddressEditorView;
});
