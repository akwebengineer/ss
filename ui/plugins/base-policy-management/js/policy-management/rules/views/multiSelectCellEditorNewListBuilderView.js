/**
 * Cell editor view that provides a basic view of list builder on the overlay.
 * this class is launched on top of overlay & acts as a base class which other rule column editors can extend.
 *
 * @module CellEditorView
 * @author Omega Developer 
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './baseCellEditorView.js',
    'widgets/form/formWidget',
    '../conf/cellEditorFormConfiguration.js',
    '../../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../util/ruleGridConstants.js'
], function (Backbone, BaseCellEditor, FormWidget, CellEditorFormConfiguration, BaseListBuilder, RuleGridConstants) {
    var CellEditorView = BaseCellEditor.extend({

        initialize: function () {
            // initialize the variables based on extended editor views, if missing default the variables
            this.context = this.options.context;
            this.policyObj = this.options.policyObj;

            this.editorListBuilderObject = this.options.editorListBuilder && this.options.editorListBuilder.listBuilderObject !== undefined ? this.options.editorListBuilder.listBuilderObject : BaseListBuilder;
            var cellEditorFormConfiguration = new CellEditorFormConfiguration(this.context);
            this.editorFormConfig = this.options.editorForm && this.options.editorForm.editorFormConfig ? this.options.editorForm.editorFormConfig : cellEditorFormConfiguration.getConfig();
            var editorFormElements = {
                'addNewButtonElementID': 'add-new-button',
                'listBuilderElementID': 'list-builder-element',
                'cancelButtonID': 'cancel',
                'okButtonID': 'save'
            };
            this.editorFormElements = this.options.editorForm && this.options.editorForm.editorFormElements ? this.options.editorForm.editorFormElements : editorFormElements;
            this.editorFormMsgBundle = this.options.editorForm && this.options.editorForm.editorFormMsgBundle ? this.options.editorForm.editorFormMsgBundle : undefined;
        },

        render: function () {
            // Modify the title & description according to each editor
            if (this.editorFormMsgBundle && this.editorFormMsgBundle.title) {
                this.editorFormConfig.title = this.editorFormMsgBundle.title;
            }
            if (this.editorFormMsgBundle && this.editorFormMsgBundle.heading_text) {
                this.editorFormConfig.heading_text = this.editorFormMsgBundle.heading_text;
            }

            //build the form on editor view
            this.form = new FormWidget({
                "elements": this.editorFormConfig,
                "container": this.el
            });

            this.form.build();
            this.$el.addClass("security-management");

            this.updateFormValuesForEditor();
            this.bindEventHandlers();

            // launch the 'list builder' object either default OR as provided in the editor view configuration
            var listBuilderContainer = this.$el.find('#' + this.editorFormElements.listBuilderElementID);
            var selectedIds = this.getSelectedIds();
            this.addListBuilder(listBuilderContainer, selectedIds);

            return this;
        },

        updateFormValuesForEditor: function () {
            // This method is used to update the values as per data or business logic for the form elements rendered on view
            // Modify the name of buttons according to each editor view
            var addNewButtonElement = this.$el.find('#' + this.editorFormElements.addNewButtonElementID);
            addNewButtonElement.attr('value', this.context.getMessage('editor_addNewButton') + ' ' + this.editorFormConfig.title);
            this.addNewButtonFormatClass(addNewButtonElement);            
            var currentListLabelElement = this.$el.find('label[for=' + this.editorFormElements.listBuilderElementID + ']');
            currentListLabelElement.text(this.editorFormMsgBundle && this.editorFormMsgBundle.listBuilderLabel);

            // Set the 'Any' checkbox on editor based on grid cell value
            if (this._cellViewValues !== undefined && this._cellViewValues[0] === "Any") {
                this.$el.find('#radio_include_any').prop("checked", true);
                this.hideListBuilder(true);
            } 
        },

        addNewButtonFormatClass : function(buttonElement) {
            buttonElement.addClass("editorAddNewButton-align-right");
        },

        bindEventHandlers: function () {
            // Event handling for 'Any Checkbox' &  Cancel/OK buttons
            this.$el.find('#' + this.editorFormElements.okButtonID).unbind('click').bind('click', $.proxy(this.updateModel, this));
            this.$el.find('#' + this.editorFormElements.cancelButtonID).unbind('click').bind('click', $.proxy(this.closeOverlay, this));
            this.$el.find('#radio_include').unbind('click').bind('click', $.proxy(this.anyHandler, this));
            this.$el.find('#radio_include_any').unbind('click').bind('click', $.proxy(this.anyHandler, this));
            this.$el.find('#radio_exclude').unbind('click').bind('click', $.proxy(this.anyHandler, this));
        },

        addListBuilder: function (listBuilderContainer, selectedListValues) {
            // Get the list builder element on the overlay
            var self = this;

            // Use the Object (eg addressListBuilder) to build the list with
            this.listBuilder = new this.editorListBuilderObject({
                container: listBuilderContainer,
                context: this.context,
                policyObj: this.policyObj,
                selectedItems: selectedListValues,
                excludedTypes: this.getExcludedTypes()
            });

            this.listBuilder.build(function() {
                listBuilderContainer.find('.new-list-builder-widget').unwrap();
                // bind the event to launch the create object screens
                self.$el.find('#' + self.editorFormElements.addNewButtonElementID).unbind('click').bind('click', $.proxy(self.createNewValueInListBuilder, self));
            });
            listBuilderContainer.find('.new-list-builder-widget').unwrap();
        },

        getExcludedTypes: function() {
            return "['ANY']";
        },

        getIntentExtras : function() {
            return {};
        },

        createNewValueInListBuilder: function (e) {
            // launch the 'create object value' screens from objects
            if (this.options.editorListBuilder && this.options.editorListBuilder.addNewObject_mimeType) {
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: this.options.editorListBuilder.addNewObject_mimeType
                    }
                );
                var extras = this.getIntentExtras();
                if(extras && !$.isEmptyObject(extras))
                    intent.putExtras(extras);

                this.context.startActivityForResult(intent, $.proxy(this.updateNewValueInList, this));
            }
        },

        updateNewValueInList: function (resultCode, data) {
            var self = this;

            // Based on result inject the newly created value in list builder
            if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {

                if (this.$el.find('#radio_include_any').is(":checked")) {
                    this.hideListBuilder(true);
                } else {
                    // Add the newly created object in list of selected items.
                    self.listBuilder.refresh(function() {
                        self.listBuilder.selectItems([data]);
                    });

                }
            }
        },
        
        updateModel :function(e){
            this.editCompleted(e,this.model);
        },

        hideListBuilder: function (hide) {
   
            if (hide) {
                $(this.$el.find(".list-builder")).css('visibility', 'hidden');
            } else {
                this.$el.find(".list-builder").css('visibility', 'visible');
            }
        },

        anyHandler: function () {
            if (this.$el.find('#radio_include_any').is(":checked")) {
                this.hideListBuilder(true);
            } else {
                this.hideListBuilder(false);
            }
        },

        setCellViewValues: function (rowData) {
            // to set the values from the grid cell in this view
            this._cellViewValues = rowData.cellData;
            this._originalRowData = rowData.originalRowData;
            this.model = this.options.ruleCollection.get(rowData.originalRowData[RuleGridConstants.JSON_ID]);
        },

        getAnyObject: function(urlRoot) {
            return {};
        },

        getSelectedIds: function() {
            return [];
        }
    });

    return CellEditorView;
});
