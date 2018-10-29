/**
 * RuleName editor view
 *
 * @module RuleNameEditorView
 * @author Vinamra Jaiswal <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'widgets/form/formWidget',
    'backbone.syphon',
    './baseCellEditorView.js',
    '../conf/ruleGridNameEditorFormConfiguration.js',
    '../util/ruleGridConstants.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js'
], function (FormWidget, Syphon, BaseGridCellEditor,RuleNameEditorFormConfiguration,
    PolicyManagementConstants,ValidationUtility) {
    var RuleNameEditorView = BaseGridCellEditor.extend({

        events: {
            'click #btnOk': 'updateModelData',
            'click #linkCancel': 'closeOverlay'
        },

        initialize: function () {
            _.extend(this, ValidationUtility);
            this.context = this.options.context;
            this.pattern = this.options.pattern;
            this.error = this.options.error;
            this.nameEditorFormConfiguration = new RuleNameEditorFormConfiguration(this.context);
        },

        render : function(){
            var self = this;

            self.form = new FormWidget({
                "elements": self.nameEditorFormConfiguration.getElements(),
                "container": self.el
            });

            self.form.build();
            this.$el.find('#name').width(360);
            this.$el.find('#name').bind('validateRuleName', $.proxy(this.validateRuleName, this, 'name'));            
            self.updateFormValuesForEditor();
            return self;
        },

        getValuesFromEditor: function () {
           
        },

        updateDataOnGridAndCache: function (e) {
            
        },

        saveEditorValuesToCache: function (updatedValuesForAPICall) {
            
        },

        validateRuleName: function(id) {
            // Work around it until the framework adds direct support for supplying a validation callback function
            var comp = this.$el.find('#'+id);
            this.$el.find('label[for='+id+']').parent().removeClass('error');
            comp.parent().removeClass('error');

            comp.attr("data-validation", "validtext");

            // Change the validation pattern according to different binding selected
            var v = comp.val();
            var re = this.pattern;
            if (!re.test(v)) {
                this.showErrorMessage(id, this.context.getMessage(this.error));
                comp.parent().find("small[class*='error']").addClass('elementinput');
            }
        },

        showErrorMessage: function(id, message) {
            var comp = this.$el.find('#'+id);
            var errorTarget = comp[0].id + '-error';
            var errorObj = $('#' + errorTarget);

            comp.attr("data-invalid", "").parent().addClass('error');
            comp.parent().prev().addClass('error');

            if(errorObj.length === 0){
                var html = '<small class="error errorimage" id="'+ errorTarget + '">' + message + '</small>';
                comp.after(html);
            }else{
                errorObj.text(message);
            }

            this.$el.find('label[for='+id+']').parent().addClass('error');
        },

        validateForm : function(){
            return this.isFormValid('rulesgrid_editor_name_form');
        },

        updateFormValuesForEditor : function() {
            this.$el.find('#name').val(this.model.get('name'));
        },

        updateModelData: function (e) {
            var self = this;
            var values = Syphon.serialize(this);
            var isFormValid = self.validateForm();
            if(!isFormValid) {
              return;
            }
            self.model.set({
              'name': values.name
            });
            this.editCompleted(e,this.model);
        },

        setCellViewValues: function (list) {
            // to get the values from the grid cell in this view
            this.rowData = list.originalRowData;
            this.model = this.options.ruleCollection.get(list.originalRowData[PolicyManagementConstants.JSON_ID]);
        }

    });

    return RuleNameEditorView;
});