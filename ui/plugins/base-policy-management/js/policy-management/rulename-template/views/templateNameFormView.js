/**
 * The overlay for template name
 * 
 * @module TemplateNameForm
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',    
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/templateNameFormConfiguration.js',   
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, FormValidator, ResourceView,TemplateNameFormConfig,DropDownWidget) {

    var MODE_CREATE = 'create',
        MODE_EDIT = 'edit';        

    var TemplateNameFormView = ResourceView.extend({

        ValueTemplateNameMap: {"Action":"$action","Constant String": "const","Custom String":"$custom_string","Egress":"$egress","Ingress":"$ingress","Date (YYYYMMDD format)":"$space_date","Date Short (YYMMDD format)":"$space_short_date","Destination Zone":"$destination_zone","Rule Type":"$rule_type"
                              ,"Source Identity":"$source_identity","Source Zone":"$source_zone","Time (HHmmss format)":"$space_time","Time Short (HHmm format)":"$space_short_time","User ID":"$space_user_id"},

        events: {
            'click #template-name-save': "saveTemplateName",           
            'click #template-name-cancel': "cancel"         
        },

        cancel: function(event) {
            event.preventDefault();
            this.parentView.overlay.destroy();
        },

        initialize: function(options) {
            var self = this;
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.params = options.params;
            this.validator = new FormValidator();
            this.ruleNames = options.params.ruleNames;
            this.constantLength = options.params.constantLength;

            if (this.params.formMode == MODE_EDIT) {
                this.templateFlatValues = this.params.flatValues;
                this.rowId = options.params.id;
                this.originalRow = options.params.originalRow;
            }
        },

        render: function() {
            var formConfiguration = new TemplateNameFormConfig(this.context,this.constantLength);
            
            var formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.templateFlatValues
            });
            this.form.build();
            this.templateNameDropDown = this.createDropDown('template-name',this.ruleNames); 
            //Hide constant string text initially
            this.$el.find(".templateNameConstant").hide();
                    
            if(this.params.formMode === MODE_EDIT) {
                var templateNameValue = this.templateFlatValues['template_builder_column'];
                //If Template is constant. Then select Constant string in dropdown and show constant string value in below text.
                if(templateNameValue.indexOf("Constant String") > -1){
                     this.templateNameDropDown.setValue("const");
                     this.$el.find(".templateNameConstant").show();
                     templateNameValue = templateNameValue.split("(");
                     templateNameValue = templateNameValue[1].split(")");   
                     this.$el.find('#template-name-constant').val(templateNameValue[0]); 

                }else{
                    this.templateNameDropDown.setValue(this.ValueTemplateNameMap[templateNameValue.trim()]);
                }             
                
            } 
            return this;
        },

        //Create dropdown for template names
        createDropDown: function(container,data,placeholder,onchange){
              var self = this;
              this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
              return new DropDownWidget({
                  "container": this.$el.find("."+container),
                  "data": JSON.stringify(data),
                  "placeholder": this.context.getMessage('select_option'),
                  "enableSearch": true,
                  "onChange": function(event) {                     
                         if(this.value == "const"){
                            self.$el.find(".templateNameConstant").show(); 
                         }else{
                            self.$el.find(".templateNameConstant").hide(); 
                         }                      
                   }
              }).build();
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            switch (this.params.formMode) {
                case MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('template_name_edit');              
                    break;
                case MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('template_name_add');                    
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },


        // Operation on OK button
        saveTemplateName: function(event) {
            event.preventDefault();
            var properties = Syphon.serialize(this);
            var templateName = this.templateNameDropDown.getValue();
            if(!$.isEmptyObject(templateName)){
                if(templateName == 'const'){
                    properties['template_builder_column'] = this.parentView.ruleNameValueMap[templateName]+" ("+properties['template-name-constant']+")";
                    templateName = properties['template-name-constant'];
                    //This validation needs to be done only when constant string is selected
                     if(!this.form.isValidInput(this.$el.find('form'))){
                        return;
                     }
                }else{
                    properties['template_builder_column'] = this.parentView.ruleNameValueMap[this.templateNameDropDown.getValue()];
                }
                if (this.params.formMode == MODE_EDIT) {
                     //Update the is field of row    
                     this.originalRow['id'] = this.originalRow['slipstreamGridWidgetRowId'];
                     //Edit row with propeties 
                     this.parentView.templateNameGridWidget.editRow(this.originalRow, properties);
                     //Update rowId rule name map
                     this.parentView.updateRowIdRuleNameMapString(this.rowId,templateName);
                }
                else {
                    //Add row in grid                
                    this.parentView.templateNameGridWidget.addRow(properties,'last');
                    var rows = this.parentView.$el.find('#sdTemplateGrid').children('tbody').children('tr');
                    //Get row id of added row
                    var rowId = rows[rows.length-1].getAttribute("id");
                    //Update rowid rule name map
                    this.parentView.updateRowIdRuleNameMapString(rowId,templateName);
                }
                this.parentView.overlay.destroy();
            }else{
                this.form.showFormError(this.context.getMessage('template_name_error'));
            }
        }                     
    }); 

    return TemplateNameFormView;
});