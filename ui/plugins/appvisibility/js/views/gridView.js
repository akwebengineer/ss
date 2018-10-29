/**
 * Grid View Landing page for App Vis
 * @module AppVisGridView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', 'text!../templates/gridView.html', 'lib/template_renderer/template_renderer', './inSightView.js', "../utils/appVisUtil.js",
	'../conf/appSecureConfigs.js', "../service/appSecureService.js", "../views/appDetailView.js", "../views/applicationUserListingView.js", 
	'widgets/overlay/overlayWidget', '../../../ui-common/js/views/gridView.js', "../../../ui-common/js/common/utils/filterUtil.js"],
	function(Backbone, GridViewTemplate, TemplateRenderer, InSightView, AppVisUtil, Configs, 
		AppVisibilityService, AppDetailView, ALV, overlayWidget, GridView, FilterUtil){
	//
	var AppVisGridView = Backbone.View.extend({

		events: {
            "click .app-vis-jump-to-link": "jumpToAppOrUsers",
            "click .appVis-grid-sessionJump": "jumpToEVonSessionCount"
        },
        //
		initialize: function(options){
			var me=this;
			me.configs = new Configs(options.context);
			me.options = options;
			me.service = new AppVisibilityService();
			me.filterUtil = new FilterUtil();
			me.appVisUtil = new AppVisUtil();
		},
		//
		render: function(){
			var me = this,
				html = TemplateRenderer(GridViewTemplate, {
					"app-vis-legend": true
				});
			//
			me.$el.empty();
			me.$el.append(html);
			//
			me.containers = {
				"mainContainer": me.$el,
				"inSightContainer": me.$el.find(".app-secure-insight-view"),
				"gridContainer": me.$el.find(".app-secure-grid-view")
			};
			//
			me.buildInSightView();
			//			
			me.buildGridView();
			return me;
		},
		//
		getMimeTypeForJump: function(){
			return "vnd.juniper.net.uservisibility";
		},
		//
		jumpToAppOrUsers: function(e){
            var me = this, linkValue = $(e.target).attr('data-cell'), 
            	intent = new Slipstream.SDK.Intent(
                    "slipstream.intent.action.ACTION_LIST",
                    { 
                        mime_type: me.getMimeTypeForJump()
                    }
                ),
                sourceKey = "applications";
            //
            if(me.options.activity.activityName === "SourceIpVisibilityActivity"){
            	sourceKey = "sourceips";
            }else if(me.options.activity.activityName === "UserVisibilityActivity"){
				sourceKey = "users";
            }
            //
            intent.putExtras({
                "time":{
                    "isCustom": me.options.filters.time.isCustom,
                    "startTime": me.options.filters.time.startTime,
                    "endTime": me.options.filters.time.endTime,
                    "selectedTimeSpanId": me.options.filters.time.selectedTimeSpanId
                },
                "filterBy":{
                	"searchKey": sourceKey,
                    "searchBy": linkValue,
                    "viewType": 1//0 for graphView, 1 for gridView
                }
            });
            me.options.context.startActivity(intent);
        },
        //
        jumpToEVonSessionCount: function(e){
        	var me = this, options = {
        		"time" : {
        			"startTime" : me.options.filters.time.startTime,
        			"endTime" : me.options.filters.time.endTime
        		},
        		"context" : me.options.context
        	}, data = {
        		"dataFilter" : me.getFilterKey($(e.currentTarget).data("nametype"))
        	};
        	//
        	this.appVisUtil.jumpToEVonSessionCount(e, options, data);
		},
        //
        getFilterKey: function(nameType){
        	nameType = nameType || "application";
        	return this.filterUtil.LC_KEY.APPLICATION;
        },
        //		
		buildInSightView: function(){
			var me=this,
				inSightView = new InSightView(me.options);
			//
			me.containers.inSightContainer.append(inSightView.render().$el);
			return me;
		},
		//
		bindGridEvents: function(){
			var me=this,hasUserJumped = me.options.filters && me.options.filters.filterBy && me.options.filters.filterBy.searchBy.length > 0;
			me.$el.off("showDetailViewAction").on("showDetailViewAction", $.proxy(me.onShowDetailViewEvent, me));
			if(!hasUserJumped){
				me.$el.off("blockApplicationAction").on("blockApplicationAction", $.proxy(me.onBlockApplication, me));
			}
			else{
				me.$el.off("blockApplicationAction").on("blockApplicationAction", $.proxy(me.onUserJumpedBlockApplication, me));
			}
			
		},
		//
		onBlockApplication: function(event, row){
			var self=this;
			if(row.selectedRows.length === 0){
				return;
			}
			var selectedApplication = row.selectedRows[0]['name'];
			var view = new ALV({
				selectedApplication : selectedApplication,
				timeInterval :  self.options.filters.time,
				parent: self,
				activity : self.options.activity,
				context : self.options.context
			}),
			conf = {
            	view: view,
            	type: 'medium'
        	};
	        self.overlayWidgetObj = new overlayWidget(conf);
	        self.overlayWidgetObj.build();					
		},

		// In case of hasUserJumped true
		onUserJumpedBlockApplication: function(event) {
			 var self = this;
            self.internalBlock({
                context:this.context,
                selectedApplications : [{
                    name : self.options.filters.filterBy.searchBy
                }],
                startTime : self.options.filters.time.startTime,
                endTime : self.options.filters.time.endTime,
                selectedUsers : this.appVisGrid.getSelectedRows(),
                blockHeader : "Block Application"
            });           
        },

        internalBlock: function(input){
            var me=this,
                sourceName="application",
                sourceValues="";
            //
            _.each(input.selectedUsers, function(selectedUser){
                sourceValues += selectedUser["name"] + ",";
            });
            //
            if(sourceValues.length > 0){// trim the trailing comma
                sourceValues = sourceValues.substring(0, sourceValues.length-1);
            };
            //            
            input["sourceName"] = sourceName;
            input["sourceValues"] = sourceValues;
            //
            input["deviceIds"] = me.options.filters['platform-device-ids'];
            input["lookupEventApptrack"] = true;
            //
            onAnalysisComplete = function(resultCode, jobId) {
                console.log('-- Block Work Flow initialized from App-visibility --');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            this.options.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, this));
        },


		//displays detail view of application
		onShowDetailViewEvent: function(event, row){
			var me=this,
				onSuccess,
				onError,
				selectedApplicationId = parseInt(row.selectedRows[0]['app-id']);//get the id
			//
			onSuccess = function(model, response){
				var detailView = new AppDetailView({
					model: model,
					activity:me
				}),
				conf = {
            		view: detailView,
            		//okButton: true,
            		type: 'small'
        		};
	            //
	            me.overlayWidgetObj = new overlayWidget(conf);
	            me.overlayWidgetObj.build();				
				//
			};
			//
			onError = function(model, response){
				console.log("Error in getting the application details");
			};
			//
			if(selectedApplicationId > 0){
				me.service.getApplicationDetails(selectedApplicationId, onSuccess, onError);
			}else{
				new Slipstream.SDK.Notification()
					.setText("No details exists for the selected application")
					.setType("warning")
					.notify();
			}
			//
		},

		clearAllTokens:function(){
        	console.log("clearing tokens");
        	var me=this, 
                intent = new Slipstream.SDK.Intent(
                        "slipstream.intent.action.ACTION_LIST",
                        { 
                            mime_type: "vnd.juniper.net.appvisibility"
                        }
                );
            var extras = $.extend({}, me.options.filters, {
               "filterBy":{
                    "searchKey": "",
                    "searchBy": "",
                    "viewType": 1//0 for graphView, 1 for gridView
                }               
           }); 
            intent.putExtras(extras);
            me.options.context.startActivity(intent);
        },
      
		//
		buildGridView: function(){
			var me = this, time = me.options.filters.time,
				hasUserJumped = me.options.filters && me.options.filters.filterBy && me.options.filters.filterBy.searchBy.length > 0 || false,
				preferencesPath = me.options.context['ctx_name'] + ':' + me.configs.getGridConfig(time, me.options.filters['platform-device-ids'], hasUserJumped,$.proxy(me.clearAllTokens, me)).tableId;

			me.appVisGrid = new GridView({
				"preferencesPath": preferencesPath,
			    "el": me.containers.gridContainer,
			    "isAppendGridInfo": false,
				"conf": me.configs.getGridConfig(time, me.options.filters['platform-device-ids'], hasUserJumped,$.proxy(me.clearAllTokens, me)),
				"search": me.options.filters.filterBy && me.options.filters.filterBy.searchBy && me.options.filters.filterBy.searchBy.length > 0 ? [me.options.filters.filterBy.searchKey + " = " + me.options.filters.filterBy.searchBy] : "",
				"actionEvents":{
					"quickViewEvent": "showDetailViewAction",
					"blockApplicationEvent": "blockApplicationAction"
				}
			}).render().gridWidget;
			me.bindGridEvents();
			return me;
		}
	});
	return AppVisGridView;
	//
});
