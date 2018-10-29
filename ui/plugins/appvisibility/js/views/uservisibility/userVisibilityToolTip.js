/**
 * ToolTip View for Bubble Graph for user visibility
 * @module BubbleToolTipView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define([
    "backbone", "text!../../templates/uservisibility/userVisibilityToolTip.html", "lib/template_renderer/template_renderer", 
    "../../../../ui-common/js/common/utils/filterUtil.js", "widgets/grid/gridWidget", "widgets/overlay/overlayWidget",
    "../../service/appSecureService.js", "../../conf/appSecureConfigs.js", "../../utils/appVisUtil.js"
], function(Backbone, ToolTipTemplate, TemplateRenderer, FilterUtil, GridWidget, overlayWidget,AppSecureService, Config, AppVisUtil){
    //
    var UserVisToolTipView = Backbone.View.extend({

        events : {
            "click #blockUserButton": "handleBlockUser",
            "click #blockApplicationButton": "handleBlockApplication",
            "click .view-all-applications-link": "onViewAllApplications",
            "click .appVis-grid-hover-sessionJump": "jumpToEVonSessionCount",
            "click #appVis-session-count-link": "jumpToEVonSessionCount"
        },

        //
        initialize:function(options){
            var me=this;
            me.options = options;
            me.configs = new Config(options.context);
            me.service = new AppSecureService();
            me.filterUtil = new FilterUtil();
            me.appVisUtil = new AppVisUtil();
            me.render();
        },
        //
        addToolTip:function (cellvalue, options, rowObject){
            return '<span class="tooltip" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</span>';
        },
        //
        formatSessionCount : function(cellvalue, options, rowObject){
            return '<a class="appVis-grid-hover-sessionJump" data-cell="'+rowObject.name+'">'+cellvalue+'</a>';
        },
        //
        jumpToEVonSessionCount: function(e){
            var me = this, options = {
                "time" : {
                    "startTime" : me.options.data.startTime,
                    "endTime" : me.options.data.endTime
                },
                "name" : me.options.data.name,
                "context" : me.options.context
            }, data = {
                "dataFilter" : this.filterUtil.LC_KEY.APPLICATION,
                "filterKey" : me.getFilterKey()
            };
            me.appVisUtil.jumpToEVonSessionCount(e, options, data);
        },
        //
        getFilterKey: function(){
            var me =this;
            return me.options.data["name-type"] === "IPV4" || me.options.data["name-type"] === "IPV6" ? me.filterUtil.LC_KEY.SOURCE_ADDRESS : me.filterUtil.LC_KEY.USER_NAME;                       
        },
        //
        onViewAllApplications: function(event){
            var me=this, 
                intent = new Slipstream.SDK.Intent(
                        "slipstream.intent.action.ACTION_LIST",
                        { 
                            mime_type: "vnd.juniper.net.appvisibility"
                        }
                );
            intent.putExtras({
                "platform-device-ids": me.options.data["platform-device-ids"],
                "device-ids": me.options.data["device-ids"],
                "time":{
                    "isCustom": me.options.data.isCustom,
                    "startTime": me.options.data.startTime,
                    "endTime": me.options.data.endTime,
                    "selectedTimeSpanId": me.options.data.selectedTimeSpanId
                },
                "filterBy":{
                    "searchKey": me.options.activity.activityName === "SourceIpVisibilityActivity" ? "sourceips": "users",
                    "searchBy": me.options.data.name,
                    "viewType": 1//0 for graphView, 1 for gridView
                }
            });
            me.options.context.startActivity(intent);
        },        
        buildTopAppsGrid:function(){
            var me=this;
            //
            me.containers.topAppsGrid.off("gridOnRowSelection").on("gridOnRowSelection", function(e, selectedRows){
                isRowsSelected = selectedRows.selectedRows.length > 0;
                $("#blockApplicationButton").prop("disabled", isRowsSelected ? false : true);
                $("#blockUserButton").prop("disabled", isRowsSelected ? true : false);
                if(isRowsSelected){
                    $("#blockApplicationButton").removeClass("disabled");
                    $("#blockUserButton").addClass("disabled");
                }else{
                    $("#blockApplicationButton").addClass("disabled");
                    $("#blockUserButton").removeClass("disabled");
                }                
            });            
            //
            me.topAppsGrid = new GridWidget({
                "container": me.containers.topAppsGrid,
                "elements": {
                    "tableId":"app_secure_top_apps_grid",
                    "numberOfRows":5,
                    "scroll": "true",
                    "height": 'auto',        
                    "multiselect": "true",
                    "repeatItems": "true", 
		            "contextMenu": {},
                    "footer": false,
                    "onSelectAll":false,
                    "getData":function(){
                        var gridData = Array.isArray(me.gridData) ? me.gridData : [me.gridData];
                        $(this).addRowData('', gridData);
                    },
                    "type": 'GET',
                    "jsonId": "id",
                    "columns": [{
                        "index":"name",
                        "name":"name",
                        "label":"Application",
                        "width":"120px",
                        "unformat": function (cellValue, options, rowObject) {
                             return cellValue;
                         },
                        "formatter": me.addToolTip
                    },{
                        "index":"volume",
                        "name":"volume",
                        "label":"Bandwidth",
                        "formatter": me.configs.convertBytesToClosestUnit,
                        "width":"80px"
                    },{
                        "index":"session-count",
                        "name":"session-count",
                        "label":"# Of Sessions",
                        "width":"100px",
                        "formatter": me.formatSessionCount,
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        }
                    }]
                }
            }).build();
        },

        handleBlockUser : function(){
            var self = this;
            self.handleBlock({
                context:this.context,
                selectedUsers : [{
                    name : self.options.data.name
                }],
                startTime : self.options.data.startTime,
                endTime : self.options.data.endTime,
                selectedApplications : [],
                blockHeader : self.options.context.getMessage('block_application_button')
            });
        },

        handleBlockApplication : function(){
            var self = this;
            self.handleBlock({
                context:this.context,
                selectedUsers : [{
                    name : self.options.data.name
                }],
                startTime : self.options.data.startTime,
                endTime : self.options.data.endTime,
                selectedApplications : this.topAppsGrid.getSelectedRows(),
                blockHeader : self.options.context.getMessage('block_user_button')
            });
        },
        //
        handleBlock : function(input){
            var me=this,
                sourceName=me.options.activity.activityName === "SourceIpVisibilityActivity" || me.options.data["name-type"] === "IPV4" ? "source_ip" : "user",
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
            input["deviceIds"] = me.options.data["platform-device-ids"];
            input["lookupEventApptrack"] = true;
            //
            onAnalysisComplete = function(resultCode, jobId) {
                console.log('-- Block Work Flow initialized from User-visibility --');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            this.options.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, this));
        },

        render: function () {
            var me=this,
                onSuccess,
                onFailure;

            onSuccess = function(data){
                console.log(data);
                var response = data.response.result[0],
                    html;
                html = TemplateRenderer(ToolTipTemplate, {
                    "title": me.options.data.name,
                    "header":{
                        "sessions": response['session-count'],
                        "total-bytes": me.configs.convertBytesToClosestUnit(response.volume)
                    }
                });
                //               


                me.gridData = response.applications;
                //
                me.$el.append(html);

                //
                me.$el.addClass("appvisibility");
                //
                me.containers={
                    "mainContainer": me.$el,
                    "topAppsGrid": me.$el.find('.app-secure-top-apps-tool-tip-grid-view')
                };
                //
                me.buildTopAppsGrid();
                /*
                if(me.isValidIPAddress() === true){                  
                    me.$el.find("#blockUserButton").hide();
                }*/
                me.trigger("toolTipDataSuccess");               
                                    

            };
            //
            onFailure = function(){
                console.log("userVisibilityToolTip.js::render():Error");
            };
            //
            me.service.getUserData(me.options.data.name, me.options.data.startTime, me.options.data.endTime, me.options.data["platform-device-ids"], onSuccess, onFailure);
            return this;
        }


        //
    });
    //
    return UserVisToolTipView;
});