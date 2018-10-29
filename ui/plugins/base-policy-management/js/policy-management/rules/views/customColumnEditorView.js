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
    '../conf/customColumnEditorFormConfiguration.js',
    '../util/ruleGridConstants.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    './descriptionEditorView.js'
], function (FormWidget, Syphon, BaseGridCellEditor,CustomColumnEditorFormConfiguration,
    PolicyManagementConstants,ValidationUtility, DescriptionEditorView) {
    var CustomColumnEditorView = DescriptionEditorView.extend({
      
        getEditorFormConfiguration : function () {
          return new CustomColumnEditorFormConfiguration(this.context);
        },
        updateFormValuesForEditor : function() {         
          var me = this, /*columnName = me.options.columnName,*/ customColData = me.model.get('custom-column-data');
          if(!customColData) {
            customColData = {};
          } else {
            customColData = JSON.parse(customColData);
          }
          me.$el.find('#description').val(customColData[me.options.id] || "");
        },
        getFormElementValues : function () {

          var me = this, columnName = me.options.columnName, formValues = {
            'title' : columnName + me.context.getMessage('sm.services.rule.custom_column.title'),
            'label' : columnName,
            'description_regex' : me.options.pattern,
            'help_regex' : me.options.pattern,
            'error' : me.context.getMessage("sm.services.rule.custom_column.pattern_error").replace('{}',me.options.pattern)
          };
          return formValues;
        },
        /*validateForm : function(){
          var me = this, value = this.$el.find('#description').val();
          if(new RegExp(me.options.pattern).test(value)) {
            return true;
          }
          me.form.showFormError(me.context.getMessage("sm.services.rule.custom_column.pattern_error").replace('{}',me.options.pattern));
          return false;
        },*/

        updateModelData: function (e) {           
            var self = this,
            values = Syphon.serialize(this),
            isFormValid = self.form.isValidInput(),
            customColData = self.model.get('custom-column-data');
            if(!isFormValid) {
              return;
            }
            if(!customColData) {
              customColData = {};
            } else {
              customColData = JSON.parse(customColData);
            }
            customColData[self.options.id] = values.description; 
            self.model.set('custom-column-data', JSON.stringify(customColData));
            this.editCompleted(e,this.model);
        }

    });

    return CustomColumnEditorView;
});