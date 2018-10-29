define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/applicationUserListingConfig.js',
    'widgets/overlay/overlayWidget',
    'widgets/grid/gridWidget',
    '../service/appSecureService.js',
    '../conf/appSecureConfigs.js'
    ],
    function(Backbone, FormWidget, FormConfig,overlayWidget,GridWidget,AppSecureService,AppSecureConfigs){
    var ALV = Backbone.View.extend({

        events: {
            'click #applicationuserblock-view-close': "cancel",
            'click #applicationuserblock-view-blockusers': "blockUsers",
            'click #applicationuserblock-view-blockapplication': "blockApplication"
        },

        initialize: function(options){
            var self=this;
            self.options = options;
            self.context = options.context;
            self.activity = options.activity;
            self.timeInterval = options.timeInterval;
            self.configs = new AppSecureConfigs();
            self.parent = options.parent;
            self.selectedApplication = options.selectedApplication;
        },

        render: function() {
            var self = this;
            formWidget = new FormWidget({
                container: self.el,
                elements: new FormConfig(self.context).getValues(),
                values: {
                    name :  self.selectedApplication
                }
            }).build();
            self.buildGrid();
            return self;
        },

        buildGrid: function () {
            var self = this;
            var gridContainer = this.$el.find('#block_users_grid_list').empty();

            var gridConfig = self.getGridConfig();
            self.usersGrid = new GridWidget({
                container: gridContainer,
                elements: gridConfig,
                actionEvents:{
                }
            }).build();
            gridContainer.addClass("appvisibility");
            gridContainer.find(".grid-widget").addClass("elementinput-long-block-users-app-grid");

            self.$el.find("#applicationuserblock-view-blockusers").addClass("disabled");
            self.$el.find("#applicationuserblock-view-blockusers").prop("disabled",true);

            gridContainer.bind("gridOnRowSelection", function(e, selectedRows){
            var selectedRowArr = selectedRows.selectedRows,    
            isRowsSelected = selectedRowArr.length > 0;
                $("#applicationuserblock-view-blockusers").prop("disabled", isRowsSelected ? false : true);
                $("#applicationuserblock-view-blockapplication").prop("disabled", isRowsSelected ? true : false);
            if(isRowsSelected){    
            //if(selectedRows.numberOfSelectedRows !== 0){
                $("#applicationuserblock-view-blockusers").removeClass("disabled");
                $("#applicationuserblock-view-blockapplication").addClass("disabled");
            }else{
                $("#applicationuserblock-view-blockusers").addClass("disabled");
                $("#applicationuserblock-view-blockapplication").removeClass("disabled");

            }

            
            var arr=[],temp,selectedRowEquals;
                if(selectedRowArr.length >1){      //disabling block user in case of different name-type (user or IPV4)
                       for(var i =0;i<selectedRowArr.length ; i++){
                          arr.push(selectedRowArr[i]['name-type']);                      
                       }
                       temp = arr.sort();
                       selectedRowEquals = temp[0] === temp[temp.length - 1];
                       if(!selectedRowEquals){
                            $("#applicationuserblock-view-blockusers").addClass("disabled");
                            $("#applicationuserblock-view-blockusers").prop("disabled",true);
                       }
                }






            });
           


            self.timeInterval.startTime = 0;
            var url = "/api/juniper/appvisibility/application-statistics/application-detail?application-name=" 
                + self.selectedApplication + "&start-time=" + self.timeInterval.startTime 
                + "&end-time=" + self.timeInterval.endTime;
           
            $.ajax({
                "url": url,
                "type":"GET",
                context : self
            }).done(self.onSuccess).fail(self.onFailure);
            //self.bindGridEvents();
        },

        onSuccess : function(data){
            var self = this;
            var users = data.response.result[0]['users'];
            if(users.length > 5){
                users.splice(5, users.length - 5);
            }
            var grid = self.usersGrid;
            _.each(users,function(user){
                grid.addRow({
                   'name' : user.name,'name-type' : user['name-type'], 'volume' : user.volume, 'session-count' : user['session-count']
                });
            });
        },

        onFailure : function(){

        },

        cancel : function(event){
             if(event){
                event.preventDefault();
                this.parent.overlayWidgetObj.destroy();
            }
        },


        getGridConfig : function(){
            var self = this;
            return{
                "tableId":"block_users_grid_list",
                "numberOfRows":5,
                "scroll": "true",
                "height": "auto",
                "multiselect" : true,
                "onSelectAll":false,
                "showWidthAsPercentage": false,
                "contextMenu" : {},
                "columns": [{
                    "index":"name",
                    "name":"name",
                    "label":'User Name',
                    "width": 150
                },{
                    "index": "name-type",
                    "name": "name-type",
                    "label": "Inactive",
                    "hidden": true 
                },
                {
                    "index":"volume",
                    "name":"volume",
                    "label":'Bandwidth',
                    "formatter": self.configs.convertBytesToClosestUnit,
                    "width": 150
                },{
                    "index":"session-count",
                    "name":"session-count",
                    "label":'# of Sessions',
                    "width": 150
                }]
            }
        },

        blockUsers: function(event) {
            var self = this;            
            self.internalBlock({
                selectedApplications : [{
                    name : this.selectedApplication
                }],
                startTime : self.options.timeInterval.startTime,
                endTime : self.options.timeInterval.endTime,
                selectedUsers : self.usersGrid.getSelectedRows(),
                blockHeader : "Block Users"
            });  
        },

        blockApplication: function(event) {
            var self = this;            
            self.internalBlock({
                selectedApplications : [{
                    name : this.selectedApplication
                }],
                startTime : self.options.timeInterval.startTime,
                endTime : self.options.timeInterval.endTime,
                selectedUsers : self.usersGrid.getSelectedRows(),
                blockHeader : "Block Application"
            }); 
        },
        

        internalBlock: function(input){
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
            sourceName = (sourceName === "User")? "user" :"source_ip";
            //            
            input["sourceName"] = sourceName;
            input["sourceValues"] = sourceValues;
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
        }


        /*internalBlock: function(event, selectedApplications,selectedUsers) {
            var self = this;
            if(event){
                event.preventDefault();
                this.parent.overlayWidgetObj.destroy();
                self.options.activity = this.activity;
                self.blockManager.startBlockWorkFlow({
                    "input":{
                        selectedApplications : selectedApplications, 
                        selectedUsers : selectedUsers, 
                        startTime : self.timeInterval.startTime, 
                        endTime : self.timeInterval.endTime,
                        blockHeader : 'Block Application'                        
                    },
                    "options": self.options,
                    "context": self.options.context
                });
            };
        }*/

    });
    return ALV;
});