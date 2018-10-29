/**
 * Description editor view
 *
 * @module descriptionEditorView
 * @author Sandhya B <sandhyab@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/form/formWidget',
    'backbone.syphon',
    './baseCellEditorView.js',
    '../conf/descriptionEditorFormConfiguration.js',
    '../util/ruleGridConstants.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js'
], function (FormWidget, Syphon, BaseGridCellEditor,DescriptionEditorFormConfiguration,
    PolicyManagementConstants,ValidationUtility) {
    var DescriptionEditorView = BaseGridCellEditor.extend({

        events: {
            'click #btnOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            _.extend(this, ValidationUtility);
            this.context = this.options.context;
            this.editorFormConfiguration = this.getEditorFormConfiguration();
            this.formElementValues = this.getFormElementValues ();
        },
        getEditorFormConfiguration : function () {
          return new DescriptionEditorFormConfiguration(this.context);
        },
        getFormElementValues : function () {
          return {};
        },
        render : function(){
            var self = this;

            self.form = new FormWidget({
                "elements": self.editorFormConfiguration.getElements(),
                "container": self.el,
                "values" : self.formElementValues
            });

            self.form.build();
            self.addSubsidiaryFunctions(self.editorFormConfiguration.getElements());
            self.updateFormValuesForEditor();
            return self;
        },

        getValuesFromEditor: function () {
           
        },

        updateDataOnGridAndCache: function (e) {
            
        },

        saveEditorValuesToCache: function (updatedValuesForAPICall) {
            
        },

        validateForm : function(){
            return this.isTextareaValid();
        },

        updateFormValuesForEditor : function() {
            this.$el.find('#description').val(this.model.get('description'));
        },

        updateModelData: function (e) {
            var self = this;
            var values = Syphon.serialize(this);
            var isFormValid = self.validateForm();
            if(!isFormValid) {
              return;
            }
            self.model.set({
              'description': values.description
            });
            this.editCompleted(e,this.model);
        },

        setCellViewValues: function (list) {
            // to get the values from the grid cell in this view
            this.rowData = list.originalRowData;
            this.model = this.options.ruleCollection.get(list.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return DescriptionEditorView;
});