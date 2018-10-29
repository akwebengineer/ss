/**
 * Created by wasima on 8/29/15.
 */


define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    'widgets/form/formValidator',
    'widgets/overlay/overlayWidget',       
    '../conf/comparePolicyGridConfiguration.js',
    '../conf/comparePolicyViewConfiguration.js',
    '../../../../../ui-common/js/common/widgets/progressBarForm.js',
    '../conf/comparePolicyResultConfiguration.js',
    '../views/comparePolicyResultView.js',
    '../../../../../ui-common/js/sse/smSSEEventSubscriber.js',
    '../../policies/views/basePolicyGridView.js'
],
function(Backbone, Syphon, FormWidget, GridWidget, FormValidator, OverlayWidget,
        CompareConf,CompareViewConfig, ProgressBarForm,ResultConfig,ResultView,
        SmSSEEventSubscriber,BasePolicyGridView) {

    var CompareFormView = BasePolicyGridView.extend({

        events: {
            'click #compare-policy-save': "submit",
            'click #compare-policy-cancel': "cancel"
        },
       
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.validator = new FormValidator();
            this.params = options.params;
            this.policyManagementConstants = this.params.policyManagementConstants;
            this.selectedObj = options.obj;
            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
            this.sseEventSubscriptions = null;
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();//"$TestScreen:123456";
            this.collection =this.params.collection;
            this.filterSearchSortOptions= {
                FILTER : undefined,
                SEARCH : undefined,
                SORT : undefined
            };
        },

        close : function() {
          this.unSubscribeNotifications();
        },

        unSubscribeNotifications: function(){
          if(this.smSSEEventSubscriber && this.sseEventSubscriptions) {
            this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
            this.smSSEEventSubscriber = null;
            this.sseEventSubscriptions = null;
          }
        },
        
        render: function() {
            var me = this;

            this.context.id = "comparePolicies";
            this.context.text = "Compare With";

            var formConfig = new CompareViewConfig(this.context,this.selectedObj),
                    formElements = formConfig.getValues();
            this.formWidget = new FormWidget({
                "elements": formElements,
                "container": this.el
            });
            this.formWidget.build();

            this.$el.find("#policy-name").html('<label>' + this.handleParse(this.selectedObj.name) + '</label>');

            me.comparePolicyGrid();
            return me;
        },

        handleParse : function(str){
                var self = this;
                var finalStr = self.reverseString(str);
                 finalStr = finalStr.split("<");
                 finalStr = finalStr[1];
                 finalStr = finalStr.split(">");
                 finalStr = finalStr[0];
                 finalStr = self.reverseString(finalStr);
                 return finalStr;
        },

        reverseString : function(s){
            var o = '';
            for (var i = s.length - 1; i >= 0; i--)
                  o += s[i];
                 return o;
        },
        
        comparePolicyGrid: function() {

            var self=this;
            var gridContainer = this.$el.find('.comparePolicy').empty();
            self.conf= this.params.gridConf.getPolicyGridConfiguration();
            self.conf.tableId="ComparePolicyGridView";
            self.conf.title= undefined;
            self.conf.singleselect = "true";
            self.conf.footer = false;
            self.conf.onSelectAll= false;
            self.conf.height = "200px";

            var tempColumns = self.conf.columns;
            self.conf.columns= _.reject(tempColumns, function(el) {
              var elName = el['name'];
              return (!(elName === 'id' || elName === 'domain-name' || elName === 'sequence-number'
                         || elName === 'icons' || elName === 'name'));
              });
            self.conf.columns.push({
                "index": "description",
                "name": "description",
                "sortable":false,
                "label": self.context.getMessage("grid_column_description"),
                "width": 200
            });

            // add search
            self.conf.filter = this.addSearchFilter();
            self.conf.filter.showFilter = undefined; // quick filter not required

            // enable sorting
            self.conf.customSortCallback = ($.proxy(self.handleSorting,self));

            self.bindModelEvents();
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: self.conf
            });
            $.when(this.gridWidget.build()).done(function(response) {
              self.gridWidgetObject = response;
            });

           self.collection.fetch({url :self.collection.url()});
            this.$el.find('#compare-policy-save').addClass("disabled");
            this.$el.find('.comparePolicy').bind("gridOnRowSelection", function(e, selectedRows){
                if(selectedRows.numberOfSelectedRows==1){
                   self.$el.find('#compare-policy-save').removeClass("disabled");
                }else{
                   self.$el.find('#compare-policy-save').addClass("disabled"); 
                }
            });    
            return this;
        },

        getPolicies : function(collection) {
          var self= this;
            var temppolicies = _.pluck(collection.toJSON(), 'policy');
            var policies= _.reject(temppolicies, function(el) { 
                       return (el.id == self.selectedObj.id);
                    });
          return policies;
        },  

       
        submit: function(event) {
           //Start Compare Job to save the contents with ignoring unchanged rules.
            this.ignoreUnchangedRules = true;
            //initializing eventSubscriber
            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
            //Start compare job without unchanged rules            
            this.startCompareJob();
        },

        downloadDiff: function(ignoreUnchangedRules) {
            //Start Compare Job to download the diff with unchanged rules.
            this.ignoreUnchangedRules = ignoreUnchangedRules;
            //Generating a new UUID for download file
            this.screenId = Slipstream.SDK.Utils.url_safe_uuid();
            //initializing eventSubscriber
            this.smSSEEventSubscriber = new SmSSEEventSubscriber();
            //Start compare job with unchanged rules
            this.startCompareJob();
        },

        subscribeNotifications : function () {
            //Subscribe to the SSE event
            var self = this;
            var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;
            var sseEventHandler, notificationSubscriptionConfig = {
                'uri' : [self.policyManagementConstants.TASK_PROGRESS_URL+ screenID ],
                'autoRefresh' : true,
                'callback' : function () {
                    self.getProgressUpdate();
                }
            };
                
            sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
            return self.sseEventSubscriptions;
        },

        getProgressUpdate : function() {
             var self = this;    
             var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;        
             $.ajax({
                url: self.policyManagementConstants.TASK_PROGRESS_URL+ screenID,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': self.policyManagementConstants.TASK_PROGRESS_ACCEPT
                },               
                success: function(data, status) {  
                    var progress = 0;
                    if(data['task-progress-response']) {
                        progress = data['task-progress-response']['percentage-complete']/100;
                        if(progress == 1 && self.compareProgressFlag == 0)
                        {
                            self.compareProgressFlag = 1;
                            self.progressBar._progressBar.setStatusText('Complete');
                            self.progressBar._progressBar.hideTimeRemaining();
                            self.progressBarOverlay.destroy();
                            self.unSubscribeNotifications();
                            //Show compare result View
                            self.compareUUID = screenID;
                            if(self.ignoreUnchangedRules) {
                                self.showCompareResultView();
                            } else{
                                location.href = self.policyManagementConstants.POLICY_DIFF_DOWNLOAD_URL + self.compareUUID + ".zip";
                            }
                        }
                        else {
                            if(self.progressBar) {
                                self.progressBar._progressBar.setStatusText(data['task-progress-response']['current-step']);
                                self.progressBar._progressBar.setProgressBar(progress);  
                            }    
                        }    
                    } 
                    else 
                        self.progressBar._progressBar.setProgressBar(progress);          
                },
                error: function() {
                    self.unSubscribeNotifications();
                    console.log("Id retrival failed");
                }
            });
        },

        showProgressBar: function() {
            var self = this;
            var firstString = self.handleParse(self.selectedObj.name);
            var secondString = self.handleParse(self.gridWidget.getSelectedRows()[0].name);

            var title = self.ignoreUnchangedRules ? 'Compare Policy' : "Download Policy Diff";

            this.progressBar = new ProgressBarForm({
                title: title,
                statusText: "Comparing '"+ firstString+"' with '"+secondString+"'",
                hasPercentRate: true
            });
           
            this.progressBarOverlay = new OverlayWidget({
                view: this.progressBar,
                type: 'small',
                height : "680px",
                showScrollbar: false
            });
            this.progressBarOverlay.build();

            this.compareProgressFlag = 0;
        },

        startCompareJob : function() {
          var self = this;
          self.subscribeNotifications();
	        var screenID = self.screenId[0]!='$'?('$'+self.screenId):self.screenId;
            var first = this.selectedObj.id;
            var postCompareData = {
              "compare-policy-request": {
                  "original-policy-id": first,
                  "revised-policy-id": self.gridWidget.getSelectedRows()[0].id,
                  "ignore-unchanged-rules":self.ignoreUnchangedRules,
                  "screen-id": screenID,
                  "browser-id": ""
                }
            };

            self.showProgressBar();

            $.ajax({
                url: self.policyManagementConstants.POLICY_COMPARE_URL,
                type: 'post',
                headers: {
                   'content-type': self.policyManagementConstants.POLICY_COMPARE_CONTENT_TYPE
                },
                data: JSON.stringify(postCompareData),
                success: function(data, status) {            
                  //self.compareUUID = data;
                },
                error: function() {
                  self.unSubscribeNotifications();
                  console.log("Id retrival failed");
                }
            });
        },

        showCompareResultView : function() {
            var self = this;

            var formConfig = new ResultConfig(self.context),
             formElements = formConfig.getValues();

            var overlayGridForm = new ResultView({
                parentView: self,
                params :{
                  compareId :self.compareUUID,
                  compareResultURL : self.policyManagementConstants.POLICY_COMPARE_RESULT_URL
                }
             }); 
            this.htmlOverlay = new OverlayWidget({
                view: overlayGridForm,
                type: 'xlarge',
                okButton: true,
                title:self.context.getMessage("compare_policy")

            });
           this.htmlOverlay.build();
        },

        cancel: function(event) {
            event.preventDefault();
            this.activity.overlay.destroy();
        }
    });
    return CompareFormView;

}
);
