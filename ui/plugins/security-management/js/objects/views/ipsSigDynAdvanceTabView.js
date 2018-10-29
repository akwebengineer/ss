/*
 *ipsSigDynAdvanceTabView.js
 *@author dkumara <dkumara@juniper.net>
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/ipsSigDynAdvanceFormConfiguration.js',
    '../../objects/widgets/ipsSigCategoryListBuilder.js',
    '../../objects/widgets/ipsSigServiceListBuilder.js',
    'widgets/dropDown/dropDownWidget'
], function(Backbone, Syphon, FormWidget, GridWidget, IPSSigDynAdvanceFormConfiguration, CategoryListBuilder, ServListBuilder, DropDownWidget) {

    var IPSSigDynAdvanceTabView = Backbone.View.extend({
        initialize: function(options) {
            this.context = options.context;
            this.customGridData = new Backbone.Collection();
        },

        render: function() {
            var self = this;

            var formConfiguration = new IPSSigDynAdvanceFormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();


            
            this.populateipsSigDynCategoryListBuilder();
            this.createSeverityMultipleSelectDropDown();
            this.modifyForm();

            return this;
        },

        searchListObjectValue: function (members, listObject){

            var selectedMemberValue = [];
            for (var i = 0; i < members.length; i++) {
                for (var j=0; j < listObject.length; j++) {
                   if (listObject[j].label.trim()=== members[i].trim()) {
                   selectedMemberValue.push(listObject[j].value); 
                   break;
                   }
                }
            }
            return selectedMemberValue;
        },



        populateipsSigDynCategoryListBuilder: function() {
            var self1 = this;
            var ipsSigsCategoryContainer = this.$el.find('#ips-sig-dyn-category-set');
            ipsSigsCategoryContainer.attr("readonly", "");

            this.categoryListBuilder = new CategoryListBuilder({
                container: ipsSigsCategoryContainer,
            });
            self1.categoryListBuilderObj = self1.categoryListBuilder.build();
            self1.categoryListBuilderObj.done(function() {
                    ipsSigsCategoryContainer.children().attr('id', 'ips-sig-dyn-category-set');
                    ipsSigsCategoryContainer.find('.list-builder-widget').unwrap();
                    if (self1.options.values) {
                            var members = self1.options.values.categories;
                            var result = self1.searchListObjectValue (members,self1.categoryListBuilder.getAvailableItems());
                            self1.categoryListBuilder.setSelectedItems(result);            
                    }
                    
                    self1.populateipsSigDynServiceListBuilder();
                }
            );
        },
        populateipsSigDynServiceListBuilder: function() {
            var self = this;
            var ipsSigsservContainer = this.$el.find('#ips-sig-dyn-service-set');
            ipsSigsservContainer.attr("readonly", "");

            this.servListBuilder = new ServListBuilder({

                container: ipsSigsservContainer,

            });

            $.when(self.servListBuilder.build()).done(function() {
                ipsSigsservContainer.children().attr('id', 'ips-sig-dyn-service-set');
                ipsSigsservContainer.find('.list-builder-widget').unwrap();
                if (self.options.values) {
                            var members = self.options.values.services;
                            var result = self.searchListObjectValue (members,self.servListBuilder.getAvailableItems());
                            self.servListBuilder.setSelectedItems(result);

                    }

            });
        },
        createSeverityMultipleSelectDropDown: function(){

          var self = this,
              severityContainer = self.$el.find('.severity-container');
              self.severityData = [{
                  "id": "Info",
                  "text": "Info"
                },
                {
                  "id": "Major",
                  "text": "Major"
                },
                {
                  "id": "Critical",
                  "text": "Critical"
                },
                {
                  "id": "Minor",
                  "text": "Minor"
                },
                {
                  "id": "Warning",
                  "text": "Warning"
                }];

          self.severityDropDown = new DropDownWidget({
              "container": severityContainer,
              "data": self.severityData,
              "multipleSelection": {
                  maximumSelectionLength: 4,
                  createTags: false,
                  allowClearSelection: true
              },
              "enableSearch": true,
              "showCheckboxes": false,
              "placeholder": this.context.getMessage('select_option')
          });
          self.severityDropDown.build();
  
        },
     
        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm: function() {
            var me =this;
        var severityTemp = [];
        if(this.options.values && this.options.values.dynSeverity !==undefined && this.options.values.dynSeverity ) {
                   $.each(this.options.values.dynSeverity.split(','),function(index, value){
                         if(value) {
                            if(value.trim().indexOf('Info')> -1){
                                severityTemp.push("Info");
                            }else if(value.trim().indexOf('Major') > -1){
                                severityTemp.push("Major");
                            }else if(value.trim().indexOf('Critical') > -1){
                                severityTemp.push("Critical");
                            }else if(value.trim().indexOf('Minor') > -1){
                                severityTemp.push("Minor");
                            }else if(value.trim().indexOf('Warning') > -1){
                                severityTemp.push("Warning");
                            }
                        }
                        me.severityDropDown.setValue(severityTemp);
                    });
                }
        },

        getViewData: function() {
            if (this.form && this.form.isValidInput()) {
                var data = Syphon.serialize(this);
                data['services'] = this.getSelectedServiceList().toString();
                data['categories'] = this.getSelectedCategoryList().toString();
                if(this.severityDropDown.getValue()!==null){
                    data['severityVal'] = this.severityDropDown.getValue().toString();
                }
                console.log("Logging data");
                console.log(data);
                return data;
            }
        },

        getSelectedServiceList: function(){
            var me =this;
            var selectedServiceItems = me.servListBuilder.getSelectedItems();
            var members=[];         
                selectedServiceItems.forEach(function (object) {
                    members.push(object.label);
                });
                return members;
        },
        getSelectedCategoryList: function(){
            var me =this;
            var  selectedCategoryItems = me.categoryListBuilder.getSelectedItems();
            var members=[];         
                selectedCategoryItems.forEach(function (object) {
                    members.push(object.label);
                });
                return members;
        }
   });

    return IPSSigDynAdvanceTabView;
});