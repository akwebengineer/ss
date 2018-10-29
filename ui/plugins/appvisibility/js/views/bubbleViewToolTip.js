/**
 * ToolTip View for Bubble Graph
 * @module BubbleToolTipView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define([
    "backbone", '../../../fw-policy-management/js/firewall/block/blockManager.js', "text!../templates/bubbleToolTip.html",
    "lib/template_renderer/template_renderer", "widgets/grid/gridWidget", "widgets/overlay/overlayWidget","../service/appSecureService.js", 
    "../conf/appSecureConfigs.js", "../../../ui-common/js/common/utils/filterUtil.js", "../utils/appVisUtil.js"
], function(Backbone, BlockManager, ToolTipTemplate ,TemplateRenderer, GridWidget,overlayWidget,AppSecureService, Config, FilterUtil, AppVisUtil){
    //
    var BubbleToolTipView = Backbone.View.extend({

        events : {
            "click #blockUserButton": "handleBlockUser",
            "click #blockApplicationButton": "handleBlockApplication",
            "click .view-all-users-link": "onViewAllUsers",
            "click .appVis-grid-hover-sessionJump": "jumpToEVonSessionCount",
            "click #appVis-session-count-link": "jumpToEVonSessionCount"
        },

        //
        initialize:function(options){
            var me=this;
            me.options = options;
            me.configs = new Config(options.context);
            me.service = new AppSecureService();
            me.blockManager = new BlockManager();
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
            var rowObjectName = rowObject.name,
                rowObjectNameType = rowObject["name-type"];
            return '<a class="appVis-grid-hover-sessionJump" data-nametype="' + rowObjectNameType + '" data-cell="'+rowObject.name+'">'+cellvalue+'</a>';
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
                "dataFilter" : me.filterUtil.LC_KEY.USER_NAME,
                "filterKey" : me.getFilterKey()
            };
            //
            var nameType = $(e.currentTarget).data("nametype");
            data["dataFilter"] = nameType === "IPV4" || nameType === "IPV6" ? me.filterUtil.LC_KEY.SOURCE_ADDRESS : data["dataFilter"];
            //
            me.appVisUtil.jumpToEVonSessionCount(e, options, data);
        },
        //
        getFilterKey: function(){
            return this.filterUtil.LC_KEY.APPLICATION;
        },
        //
        onViewAllUsers: function(event){
            var me=this, 
                intent = new Slipstream.SDK.Intent(
                        "slipstream.intent.action.ACTION_LIST",
                        { 
                            mime_type: "vnd.juniper.net.uservisibility"
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
                    "searchKey": "applications",
                    "searchBy": me.options.data.name,
                    "viewType": 1//0 for graphView, 1 for gridView
                }
            });
            me.options.context.startActivity(intent);
        },
        //
        buildTopUsersGrid:function(){
            var me=this,
                isRowsSelected=false;
            //
            me.containers.topUsersGrid.off("gridOnRowSelection").on("gridOnRowSelection", function(e, selectedRows){
                var selectedRowArr = selectedRows.selectedRows;
                isRowsSelected = selectedRowArr.length > 0;
                $("#blockApplicationButton").prop("disabled", isRowsSelected ? true : false);
                $("#blockUserButton").prop("disabled", isRowsSelected ? false : true);
                if(isRowsSelected){
                    $("#blockApplicationButton").addClass("disabled");
                    $("#blockUserButton").removeClass("disabled");
                }else{
                    $("#blockApplicationButton").removeClass("disabled");
                    $("#blockUserButton").addClass("disabled");
                }
                var arr=[],temp,selectedRowEquals;
                if(selectedRowArr.length >1){      //disabling block user in case of different name-type (user or IPV4)
                       for(var i =0;i<selectedRowArr.length ; i++){
                          arr.push(selectedRowArr[i]['name-type']);                      
                       }
                       temp = arr.sort();
                       selectedRowEquals = temp[0] === temp[temp.length - 1];
                       if(!selectedRowEquals){
                            $("#blockUserButton").addClass("disabled");
                            $("#blockUserButton").prop("disabled",true);
                       }
                }
            });
            //
            me.topUsersGrid = new GridWidget({
                "container": me.containers.topUsersGrid,
                "elements": {
                    "tableId":"app_secure_top_users_grid",
                    "numberOfRows":5,
                    "scroll": "true",
                    "height": 'auto',        
                    "multiselect": "true",
                    "repeatItems": "true", 
                    "contextMenu" :{},
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
                        "label":"User Name",
                        "width":"110px",
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                         },
                        "formatter": me.addToolTip
                    },
                    {
                        "index": "name-type",
                        "name": "name-type",
                        "label": "Inactive",
                        "hidden": true                        
                    },
                    {
                        "index":"volume",
                        "name":"volume",
                        "label":"Bandwidth",
                        "width":"100px",
                        "formatter":me.configs.convertBytesToClosestUnit
                    }, {
                        "index":"session-count",
                        "name":"session-count",
                        "label":"# of Sessions",
                        "width":"110px",
                        "formatter": me.formatSessionCount,
                        "unformat": function (cellValue, options, rowObject) {
                            return cellValue;
                        }
                    }]
                }
            }).build();
        },

        handleBlockApplication : function(){
            var self = this;
            self.handleBlock({
                context:self.context,
                selectedApplications : [{
                    name : self.options.data.name
                }],
                startTime : self.options.data.startTime,
                endTime : self.options.data.endTime,
                selectedUsers : [],
                blockHeader : "Block Application"
            });            
        },

        handleBlockUser : function(){
            var self = this;
            self.handleBlock({
                context:this.context,
                selectedApplications : [{
                    name : self.options.data.name
                }],
                startTime : self.options.data.startTime,
                endTime : self.options.data.endTime,
                selectedUsers : this.topUsersGrid.getSelectedRows(),
                blockHeader : "Block User"
            });
        },

        handleBlock : function(input){
            var me=this,
                sourceName=input.selectedUsers.length > 0 ? input.selectedUsers[0]['name-type'] : "User",
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
            sourceName = (sourceName === "User")? "user" :"source_ip";
                       
            input["sourceName"] = sourceName;
            input["sourceValues"] = sourceValues;
            //
            input["deviceIds"] = me.options.data["platform-device-ids"];
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
            this.options.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, me));
        },
        //
        render: function () {
            var me=this,
                onSuccess,
                onFailure;

            onSuccess = function(data){
                console.log(data);
                var response = data.response.result[0],
                    riskLevel = response['risk-level'] || "unknown",
                    riskSource,
                    html;
                switch(riskLevel.toLowerCase()){
                    case "low":
                        riskSource = "/installed_plugins/appvisibility/img/low.svg"
                        break;
                    case "moderate":
                        riskSource = "/installed_plugins/appvisibility/img/moderate.svg"
                        break;
                    case "high":
                        riskSource = "/installed_plugins/appvisibility/img/high.svg"
                        break;
                    case "critical":
                        riskSource = "/installed_plugins/appvisibility/img/critical.svg"
                        break;
                    case "unsafe":
                        riskSource = "/installed_plugins/appvisibility/img/unsafe.svg"
                        break;
                    case "unknown":
                        riskSource = "/installed_plugins/appvisibility/img/unknown.svg"
                        break;
                    default:
                        riskSource = "/installed_plugins/appvisibility/img/low.svg"
                        break;
                };
                //
                html = TemplateRenderer(ToolTipTemplate, {
                    "title": me.options.data.name,
                    "header":{
                        "sessions": response['session-count'],
                        "total-bytes": me.configs.convertBytesToClosestUnit(response.volume),
                        "blocks": response['number-of-blocks'],
                        "risk-level": response['risk-level'],
                        "category": response.category,
                        "characteristic": response.characteristics.toString() || "unknown",
                        "risk-source": riskSource
                    }
                });
                //
                me.gridData = response.users;
                //
                me.$el.append(html);
                //
                me.$el.addClass("appvisibility");
                //
                me.containers={
                    "mainContainer": me.$el,
                    "topUsersGrid": me.$el.find('.app-secure-top-users-tool-tip-grid-view')
                };
                //
                me.buildTopUsersGrid();
                me.trigger("toolTipDataSuccess");
            };
            //
            onFailure = function(){
                console.log("bubbleViewToolTip.js::render():Error");
            };
            me.service.getApplicationData(me.options.data.name, me.options.data.startTime, me.options.data.endTime, me.options.data["platform-device-ids"], onSuccess, onFailure);
            return this;
        }
        //
    });
    //
    return BubbleToolTipView;
});