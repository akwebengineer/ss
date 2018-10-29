/**
 * The overlay for custom column
 * @author Ashish<sriashish@juniper.net>
 * @module Custom Column
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',    
    'widgets/form/formWidget',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/customColumnCreateFormConfiguration.js',
    '../../constants/basePolicyManagementConstants.js'
   
], function (Backbone, Syphon, FormWidget,ResourceView,CustomColumnFormConfig,PolicyManagementConstants) {
    
    var MODE_CREATE = 'create',
        MODE_EDIT = 'edit';      

    var CustomColumnFormView = ResourceView.extend({

        events: {
            'click #custom-column-save': "saveCustomColumn",           
            'click #custom-column-cancel': "cancel"         
        },

        cancel: function(event) {
            //event.preventDefault();
            this.parentView.overlay.destroy();
        },

        initialize: function(options) {
            var self = this;
            this.parentView = options.parentView;
            
            this.context = options.parentView.context;
            this.params = options.params;
            this.model = options.model;
                                   
            if (this.params.formMode == MODE_EDIT) {
                  this.rowId = options.params.id;
                  this.originalRow = options.params.originalRow;
            }
        },

        render: function() {
            var formConfiguration = new CustomColumnFormConfig(this.context);            
            var formElements = formConfiguration.getValues();
            
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.customColumnFlatValues
            });
            this.form.build();           
                  
            if(this.params.formMode === MODE_EDIT) {
                 var customColumnName = this.params.flatValues['name'];
                 var customColumnRegex = this.params.flatValues['regex'];
                 this.$el.find('#customColumn-name').val(customColumnName);
                 this.$el.find('#regex').val(customColumnRegex);                     
            } 
            return this;
        },
        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            switch (this.params.formMode) {
                case MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('custom_column_name_edit');          
                    break;
                case MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('custom_column_name_add');                    
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        // Operation on OK button
        saveCustomColumn: function(event) {                   
            var me = this,             
            customColumnName = me.$el.find('#customColumn-name').val(),
            customColumnRegex = me.$el.find('#regex').val();
           
              if(me.validateForm(customColumnName,customColumnRegex) === true){
            
              me.model.set({
                'regex' : customColumnRegex,
                'name' : customColumnName
              });
              me.model.save(null, {
                success: function (model, response, options) {
                  me.onSuccess();                      
                },
                error: function (model, response, options) {
                  me.onErr(response.responseText);                                                    
                }
              });
              this.parentView.overlay.destroy();  
             }
           else
           {
             me.form.showFormError(me.errorMessage);
           } 
        },
        onSuccess: function() { 
          var me = this, name = me.model.get('name'), 
          msg = me.params.formMode === MODE_EDIT ? me.context.getMessage('sm.services.custom_column.create_modify_msg') : me.context.getMessage('sm.services.custom_column.create_success_msg');
          msg = msg.replace('{}', name);
          me.parentView.loadCustomColumnGrid(); 
          me.parentView.notify('success', msg);
        },

        onErr: function(text) { 
                
        var me = this; 
          var jsonResponse = JSON.parse(text);          
          me.parentView.notify('error',jsonResponse.message);
          console.log("Custom Column grid not able to load");        
        },

        validateForm: function(name,regex) { 
        var me = this; 
            if((me.validateName(name) === true)&&(me.validateRegex(regex) === true))               
              return true;
        },

        validateName: function(name) {  
            var me = this, testName = name.length < 33 && /^[a-zA-Z0-9\s._\-]+$/.test(name);
            if(testName === false) {
              me.errorMessage = me.context.getMessage("sd.publish.customColumnName.name_error");
            }
            return testName;
        },

         validateRegex: function(regex) {
            if(regex.length > 255) {
              this.errorMessage = this.context.getMessage("sd.publish.customColumnName.regex_error");
              return false;
            }
            try{
              var regexp = new RegExp(regex);
              regexp.compile();
              return true;
             } catch(excp){
              this.errorMessage = this.context.getMessage("sd.publish.customColumnName.regex_error");
              return false;
            }
          }
       
    }); 

    return CustomColumnFormView;
});