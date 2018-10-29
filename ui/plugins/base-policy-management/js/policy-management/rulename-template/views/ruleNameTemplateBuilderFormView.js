/**
 *Launch create rule name template builder form
 * @copyright Juniper Networks, Inc. 2015
 */

define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/form/formValidator',
    'widgets/overlay/overlayWidget',       
    '../conf/ruleNameTemplateBuilderFormConfiguration.js',
    '../conf/ruleNameTemplateGridConf.js',
    'widgets/dropDown/dropDownWidget',
    './ruleNameTemplateConstantFormView.js',
    '../model/ruleNameTemplateModel.js',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../../constants/basePolicyManagementConstants.js',
    './templateNameFormView.js',
],

function(Backbone, Syphon, FormWidget, GridWidget, FormValidator, OverlayWidget,RuleNameTemplateBuilderFormConfiguration,
         RuleNameTemplateGridConf,DropDownWidget,RuleNameTemplateConstantFormView,RuleNameTemplateModel,
         ResourceView,PolicyManagementConstants,TemplateNameForm) {

    var RuleNameTemplateBuilderView = ResourceView.extend({

        ruleNameValueMap: {$action:"Action",const:"Constant String",$custom_string:"Custom String",$egress:"Egress",$ingress:"Ingress",$space_date:"Date (YYYYMMDD format)",$space_short_date:"Date Short (YYMMDD format)",$destination_zone:"Destination Zone",$rule_type:"Rule Type"
                              ,$source_identity:"Source Identity",$source_zone:"Source Zone",$space_time:"Time (HHmmss format)",$space_short_time:"Time Short (HHmm format)",$space_user_id:"User ID"},
        rowIdRuleNamemap: new Object(),

        events: {
            'click #btnTemplateOk': "submit",
            'click #linkPolicyCancel': "cancel"
        },
       
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.params = options.params;
            this.model= new RuleNameTemplateModel({
              urlRoot:options.params.url
            });
            this.validator = new FormValidator();
            this.ruleNames = options.params.ruletemplateNames;
            this.constantLength = options.params.constantLength;
        },
        
        render: function() {
            var ruleNameTemplateBuilderFormConf = new RuleNameTemplateBuilderFormConfiguration(this.context);

            this.$el.addClass("security-management"); 
            this.formWidget = new FormWidget({
                "elements": ruleNameTemplateBuilderFormConf.getValues(),
                "container": this.el
            });
            this.formWidget.build();
            this.buildTemplateGrid();
            this.bindRadioButtonChangeEvent();
            this.populateData();
            return this;
        },

        bindRadioButtonChangeEvent : function(){
          var self = this;
          self.$('#strict-mode-type').click(function() {
             if(self.$('#strict-mode-type').is(':checked')){
                self.$el.find('#weak-mode-type').attr("checked",false);
             }
          });
          self.$('#weak-mode-type').click(function() {
             if(self.$('#weak-mode-type').is(':checked')){
                self.$el.find('#strict-mode-type').attr("checked",false);
             }
          });

        },

        buildTemplateGrid: function(){
          var self = this;
          var templateGridConf = new RuleNameTemplateGridConf(this.context);
          var gridContainer = self.$el.find('.gridWidgetSmallPlaceHolder').empty();
          self.templateNameGridWidget = new GridWidget({
              container: gridContainer,
              actionEvents : templateGridConf.getEvents(),
              elements: templateGridConf.getValues()
          }).build();
          this.bindContextEvents(templateGridConf.getEvents());
        },

        bindContextEvents: function(definedEvents) {
            // create button for template name
            if (definedEvents.createEvent) {
                this.$el.bind(definedEvents.createEvent, $.proxy(this.addTemplateAction, this));
            }
            // edit button for template name
            if (definedEvents.updateEvent) {
                this.$el.bind(definedEvents.updateEvent, $.proxy(this.modifyTemplateAction, this));
            }
            // delete button for template name
            if (definedEvents.deleteEvent) {
                this.$el.bind(definedEvents.deleteEvent, $.proxy(this.deleteTemplateAction, this));
            }                
        },

                /**
         * @private
         *
         * This will popup a form to add Template.
         * This is invoked when the user clicks on the create button of the template name grid.
         * */
        addTemplateAction: function() {
            // Form for context create
            var overlayGridForm = new TemplateNameForm({
                parentView: this,
                params: {
                    formMode: "create",
                    ruleNames:this.ruleNames,
                    constantLength : this.constantLength, 
                }
            });            
            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'small',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        //Edit selected template name
        modifyTemplateAction: function(e, row) {
            // Form for context update
            var overlayGridForm = new TemplateNameForm({
                parentView: this,
                params: {
                    formMode: "edit",
                    flatValues: row.originalRow,
                    ruleNames:this.ruleNames, 
                    id: row.originalRow.slipstreamGridWidgetRowId,
                    originalRow : row.originalRow,
                    constantLength : this.constantLength,
                }
            });

            this.overlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'small',
                showScrollbar: true,
                xIconEl: true
            });
            this.overlay.build();

            return this;
        },

        populateData: function(){
          var self = this;
            self.model.fetch({
                success: function (collection, response, options) {
                  if(response && response['rule-name-template']) {
                      self.$el.find('#enableRuleNameTemplateCheckBox').attr("checked",response['rule-name-template']['enabled']);
                      if(response['rule-name-template']['strict']){
                        self.$el.find('#strict-mode-type').attr("checked",true);
                        self.$el.find('#weak-mode-type').attr("checked",false);
                      }else{
                        self.$el.find('#strict-mode-type').attr("checked",false);
                        self.$el.find('#weak-mode-type').attr("checked",true);
                      }
                      var templateString = response['rule-name-template']['template-content'];
                      if(templateString && templateString.trim().length > 0) {
                          var tableData = templateString.split("<->");
                          var rowTableData = self.processTemplateString(tableData,self);
                          for(var i=0; rowTableData.length > i;i++){
                            self.templateNameGridWidget.addRow(rowTableData[i],'last');
                          }
                          self.addRowIdRuleNameDataToMap(tableData,self);
                          self.$el.find('#tempBuild')[0].innerHTML='<label class="scheduler-label">'+templateString+'</label>';
                      }else{
                         self.$el.find('#tempBuild')[0].innerHTML='<label class="scheduler-label">'+self.context.getMessage('template_msg')+'</label>';
                      }

                  }
                },
                error: function (collection, response, options) {
                    console.log('Rule name template model not fetched');
                }
             });
        },

        //Below method process the tempate content and return the data to add in grid
        processTemplateString: function(tableData,self){
          var self = self;
          var processedData = [];
          for(var i= 0; tableData.length > i ; i++){
               var temp = tableData[i];
               temp = temp.replace("<","");
               temp = temp.replace(">","");
               if(temp.indexOf('$') === 0){
                 temp = this.ruleNameValueMap[temp];
                 var rowData = {"template_builder_column":temp};
                 processedData.push(rowData);
               }else if(temp.trim().length > 0){
                 temp = this.ruleNameValueMap['const'];
                 var rowData = {"template_builder_column":temp+" ("+tableData[i]+")"};
                 processedData.push(rowData);
               }
          }
          return processedData;
        },

      //Below method add rowid rowvalue info in rowIdRuleNamemap
      addRowIdRuleNameDataToMap: function(tableData,self){
          var self = self;
          var rows = self.$el.find('#sdTemplateGrid').children('tbody').children('tr');
          var processedData = [];
          //Started from i=1 as first row is accoupied by placeholder
          for(var i= 1; rows.length > i ; i++){
            self.rowIdRuleNamemap[rows[i].getAttribute("id")] = tableData[i-1];
          }
        },

        //Below piece of code update the rowIdRuleNameMap
        updateRowIdRuleNameMapString:function(rowId,rowValue) {
            var ids = [],
                rowIdRuleNamemap = this.rowIdRuleNamemap,
          
            //Using selected value of dropdown - without navigating away from grid
            ids = rowId.split("_");
            rowIdRuleNamemap[ids[0]] = rowValue;
            this.updateTemplateString();
        },

         //Below piece of code generates template string
        updateTemplateString: function(){
          var stbuilder='';         
          for(var m in this.rowIdRuleNamemap){   
              if(this.rowIdRuleNamemap[m].trim().length != 0){
                if(this.rowIdRuleNamemap[m].indexOf('$') === 0){
                    stbuilder =stbuilder+"<"+this.rowIdRuleNamemap[m]+">"+"<->";
                }
                else{                          
                    stbuilder =stbuilder+this.rowIdRuleNamemap[m]+"<->";
                }
                 
              }         
           }
           stbuilder = stbuilder.substring(0, stbuilder.length - 3);
           if(stbuilder.trim().length > 0){
            this.$el.find('#tempBuild')[0].innerHTML='<label class="scheduler-label">'+stbuilder+'</label>';
           }
           else{
             this.$el.find('#tempBuild')[0].innerHTML='<label class="scheduler-label">'+this.context.getMessage('template_msg')+'</label>';
           }
             
        },


        /**
         * call back handler delete event to update the local cache
         * 
         * @param  {e} event
         * @param  {[array]} array of selected objects for delete
         */
        deleteTemplateAction: function(e, selectedObj){        
          var me = this, i;
            for(i=0; i<selectedObj.selectedRows.selectedRowIds.length;i++){           
              delete me.rowIdRuleNamemap[selectedObj.selectedRows.selectedRowIds[i]];
           }
           me.updateTemplateString();
        },
        
        submit: function(event) {
           var self = this, enabled = "false", strict = "false", templatecontent;
           templatecontent = self.$el.find('#tempBuild').text();
           if(self.$('#enableRuleNameTemplateCheckBox').is(":checked")){
              enabled = "true";
           }
           if(self.$('#strict-mode-type').is(':checked')){
              strict = "true";
           }

           //If no templates selected then show error depends on rule name template enable check
           if(templatecontent === self.context.getMessage('template_msg')){
             //If rule name tenplate is enable show errors
             if(enabled === "true"){
               console.log('template rule name has no selections');
               self.formWidget.showFormError(self.context.getMessage("template_rule_name_empty_error"));
               return;
             }else{
               templatecontent = "";
             }
           }
           
           var postReqData = {
                  "rule-name-template":{
                      "enabled": enabled,
                      "template-content": templatecontent,
                      "strict": strict
                  }        
            }; 
           $.ajax( {
                 url: self.params.url,
                 type: "put",
                 dataType: "json",
                 headers: {
                  'content-type': PolicyManagementConstants.RULE_NAME_CONTENT_TYPE,
                  'accept': PolicyManagementConstants.RULE_NAME_ACCEPT_HEADER
                  },
                  data: JSON.stringify(postReqData),
           
                  success: function(data, status) { 
                        self.cancel();
                        //console.log("POST SUCCESSFUL");
                     },
                    error: function() {
                         //console.log("POST Failed");
                         self.cancel();
                     }
             } );
        },
        
        cancel: function() {
            //Clearing the temp rule Name Map
            for (var member in this.rowIdRuleNamemap) delete this.rowIdRuleNamemap[member];
              if(this.templateNameGridWidget){
                this.templateNameGridWidget.destroy();
              }
            this.activity.overlay.destroy();
         
        }
    });

    return RuleNameTemplateBuilderView;
}
);
