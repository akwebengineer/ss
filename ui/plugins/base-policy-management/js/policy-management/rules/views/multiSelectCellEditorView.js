/**
 * Cell editor view that provides a basic view of list builder on the overlay.
 * this class is launched on top of overlay & acts as a base class which other rule column editors can extend.
 *
 * @module CellEditorView
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @author Mamata <mamatad@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    './baseCellEditorView.js',
    'widgets/form/formWidget',
    '../conf/cellEditorFormConfiguration.js',
    '../../../../../sd-common/js/common/widgets/baseListBuilder.js',
  '../util/ruleGridConstants.js'
], function (Backbone, BaseCellEditor, FormWidget, CellEditorFormConfiguration, BaseListBuilder, RuleGridConstants) {
    var CellEditorView = BaseCellEditor.extend({

        initialize: function () {
            // initialize the variables based on extended editor views, if missing default the variables
            this.context = this.options.context;

            this.editorListBuilderObject = this.options.editorListBuilder && this.options.editorListBuilder.listBuilderObject != undefined ? this.options.editorListBuilder.listBuilderObject : BaseListBuilder;
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
            var self = this;

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
            this.addListBuilder(listBuilderContainer, this._cellViewValues);

            return this;
        },

        updateFormValuesForEditor: function () {
            // This method is used to update the values as per data or business logic for the form elements rendered on view
            // Modify the name of buttons according to each editor view
            var addNewButtonElement = this.$el.find('#' + this.editorFormElements.addNewButtonElementID);
            addNewButtonElement.attr('value', this.context.getMessage('editor_addNewButton') + ' ' + this.editorFormConfig.title);
            addNewButtonElement.addClass("editorAddNewButton-align-right");
            var currentListLabelElement = this.$el.find('label[for=' + this.editorFormElements.listBuilderElementID + ']');
            currentListLabelElement.text(this.editorFormMsgBundle && this.editorFormMsgBundle.listBuilderLabel);

            // Set the 'Any' checkbox on editor based on grid cell value
            if (this._cellViewValues!== undefined && this._cellViewValues[0] == "Any") {
                this.$el.find('#radio_include_any').prop("checked", true);
                this.disableListBuilder(true);
            } 
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
                policyObj: this.options.policyObj
            });

            $.when(this.listBuilder.build())
                .done(function () {
                    self.anyObjectDetails = self.listBuilder.removeAvailableItems(['Any']);
                    listBuilderContainer.children().attr('id', self.editorFormElements.listBuilderElementID);
                    if (selectedListValues !== undefined) {
                        if (!(selectedListValues[0] == 'Any')) {
                            // if 'Any' value is not passed from grid, call setSelectedItems on list builder | enhanced for ui performance
                            self.listBuilder.setSelectedItems(selectedListValues);
                        } else {
                            // disable the list builder based on if  'Any' is selected by default
                            self.disableListBuilder(true);
                        }
                    }
                    listBuilderContainer.find('.list-builder-widget').unwrap();
                    // bind the event to launch the create object screens
                    self.$el.find('#' + self.editorFormElements.addNewButtonElementID).unbind('click').bind('click', $.proxy(self.createNewValueInListBuilder, self));
                })
                .fail(function () {
                    console.log('Failed to fetch Object list');
                });
        },

        createNewValueInListBuilder: function (e) {
            // launch the 'create object value' screens from objects
            if (this.options.editorListBuilder && this.options.editorListBuilder.addNewObject_mimeType) {
                var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                    {
                        mime_type: this.options.editorListBuilder.addNewObject_mimeType
                    }
                );
                this.context.startActivityForResult(intent, $.proxy(this.updateNewValueInList, this));
            }
        },

        updateNewValueInList: function (resultCode, data) {
            // Based on result inject the newly created value in list builder
            if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {

                var newCreatedObject = [{
                    "label": data.name,
                    "value": data.name,
                    "valueDetails": data["domain-name"] != undefined ? data["domain-name"] : "",
                    "extraData": JSON.stringify(data)
                }];

                if (this.$el.find('#radio_include_any').is(":checked")) {
                    // if 'Any' checkbox is selected, then add the newly created object in list of available items.
                    this.listBuilder.addAvailableItems(newCreatedObject);
                    this.disableListBuilder(true);
                } else {
                    // Add the newly created object in list of selected items.
                    this.listBuilder.addSelectedItems(newCreatedObject);
                }
            }
        },

        updateModel :function(e){
            this.editCompleted(e,this.model);
        },

        getListBuilderSelectedItems: function () {
            // get the selected values from list builder
            var selectedItems = this.listBuilder.getSelectedItems();
            var selectedData = [];
            for (var index = 0; index < selectedItems.length; index++) {
                selectedData.push(selectedItems[index].value);
            }
            return selectedData;
        },

        disableListBuilder: function (disable) {
            // Disable the listBuilder so that user can not interact with the list builder : need to get disable from the widget
            if (disable) {
                this.$el.find(".list-builder-widget").find(':input').prop('disabled', true);
            } else {
                this.$el.find(".list-builder-widget").find(':input').prop('disabled', false);
            }
        },

        anyHandler: function () {
            if (this.$el.find('#radio_include_any').is(":checked")) {
                //clear the selected values from right & add to left
                var selectedListItems = this.listBuilder.getValueList(this.listBuilder.getSelectedItems());
                // if there are none selected, no need to call removeSelectedItems on list builder | enhanced for ui performance
                var removedItems = selectedListItems.length && this.listBuilder.removeSelectedItems(selectedListItems);
                // if there are none removed items, no need to call addAvailableItems on list builder | enhanced for ui performance
                removedItems && this.listBuilder.addAvailableItems(removedItems);
                // Disable the listBuilder so that user can not interact with the list builder
                this.disableListBuilder(true);
            } else {
                // Enable the listBuilder so that user can interact with the list builder
                this.disableListBuilder(false);
            }
        },

        setCellViewValues: function (rowData) {
          // to set the values from the grid cell in this view
          this._cellViewValues = rowData.cellData;
          this._originalRowData = rowData.originalRowData;
          this.model = this.options.ruleCollection.get(rowData.originalRowData[RuleGridConstants.JSON_ID]);
        }
    });

    return CellEditorView;
});