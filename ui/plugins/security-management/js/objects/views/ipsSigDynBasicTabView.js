/*
 *ipsSigDynBasicTabView.js
 *@author dkumara <dkumara@juniper.net>
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/ipsSigDynBasicFormConfiguration.js',
    'widgets/dropDown/dropDownWidget'
], function (Backbone, Syphon, FormWidget, GridWidget, IPSSigDynBasicFormConfiguration,DropDownWidget){ 

    var IPSSigDynBasicTabView = Backbone.View.extend({
        initialize : function(options){
            this.context = options.context;
            this.customGridData = new Backbone.Collection(); 
            this.formMode =options.formMode;

        },

        render : function(){
            var self = this;

            var formConfiguration = new IPSSigDynBasicFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();
            this.createMathAssMultipleSelectDropDown();
            this.createPerfImpactMultipleSelectDropDown();
            this.createObjTypeMultipleSelectDropDown();
            return this;
               
        },

        createMathAssMultipleSelectDropDown: function(){

          var self = this,
              mathAssConatainer = self.$el.find('.math-ass-container');
              self.mathAssData = [{
                  "id": "rarely",
                  "text": "High"
                },
                {
                  "id": "occasionally",
                  "text": "Medium"
                },
                {
                  "id": "frequently",
                  "text": "Low"
                },
                {
                  "id": "none",
                  "text": "Unknown"
                }];

          self.mathAssDropDown = new DropDownWidget({
              "container": mathAssConatainer,
              "data": self.mathAssData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.mathAssDropDown.build();
  
        },

        createPerfImpactMultipleSelectDropDown: function(){

          var self = this,
              perfImpactConatainer = self.$el.find('.perf-impact-container');
              self.perfImpactData = [{
                  "id": "9",
                  "text": "High"
                },
                {
                  "id": "5",
                  "text": "Medium"
                },
                {
                  "id": "1",
                  "text": "Low"
                },
                {
                  "id": "0",
                  "text": "Unknown"
                }];

          self.perfImpactDropDown = new DropDownWidget({
              "container": perfImpactConatainer,
              "data": self.perfImpactData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.perfImpactDropDown.build();
  
        },

        createObjTypeMultipleSelectDropDown: function(){

          var self = this,
              objTypeContainer = self.$el.find('.obj-type-container');
              self.objTypetData = [{
                  "id": "signature",
                  "text": "Signature"
                },
                {
                  "id": "anomaly",
                  "text": "Protocol Anomaly"
                }];

          self.ObjTypeDropDown = new DropDownWidget({
              "container": objTypeContainer,
              "data": self.objTypetData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.ObjTypeDropDown.build();
  
        },

        /*
            Incase of modify fill the form values with the data of the selected profile
        */
        modifyForm : function(data){

        },

        //set the defaults for the fields
        setDefaults : function(){
 
        },
        getViewData: function() {
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);
                if(this.mathAssDropDown.getValue()!==null){
                    data['mathAssurance'] = this.mathAssDropDown.getValue().toString();
                }
                if(this.perfImpactDropDown.getValue()!==null){
                    data['perfImpact'] = this.perfImpactDropDown.getValue().toString();
                }
                if(this.ObjTypeDropDown.getValue()!==null){
                    data['objType'] = this.ObjTypeDropDown.getValue().toString();
                }
                console.log("Logging data");
                console.log(data);
                return data;
            }
        }


    });

    return IPSSigDynBasicTabView;
});