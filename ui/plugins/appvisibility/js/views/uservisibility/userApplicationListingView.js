define([
    'backbone',
    'widgets/form/formWidget',
    "../../conf/userApplicationListingConfig.js",
    'widgets/overlay/overlayWidget',
    'widgets/grid/gridWidget',
    '../../conf/appSecureConfigs.js'
    ],
    function(Backbone, FormWidget, FormConfig, overlayWidget, GridWidget, AppSecureConfigs){
        var ULV = Backbone.View.extend({

        events: {
            'click #userapplicationblock-view-close': "cancel",
            'click #userapplicationblock-view-blockapplications': "blockApplications",
            'click #userapplicationblock-view-blockuser': "blockUser"
        },

        initialize: function(options){
            var self=this;
            self.options = options;
            self.context = options.context;
            self.activity = options.activity;
            self.timeInterval = options.timeInterval;
            self.selectedUser = options.selectedUser;
            self.selectedUserType = options.selectedUserType;
            self.parent = options.parent;
            self.configs = new AppSecureConfigs();
        },

        render: function() {
            var self = this,
                sourceNameView = self.options.activity.activityName === "SourceIpVisibilityActivity" ? "source_ip" : "user";
            formWidget = new FormWidget({
                container: self.el,
                elements: new FormConfig(self.context,sourceNameView).getValues(),
                values: {
                    name :  self.selectedUser
                }
            }).build();
            self.buildGrid();
            return self;
        },

        buildGrid: function () {
            var self = this;
            var gridContainer = this.$el.find('#block_applications_grid_list').empty();

            var gridConfig = self.getUserGridConfig();
            self.applicationsGrid = new GridWidget({
                container: gridContainer,
                elements: gridConfig,
                actionEvents:{
                }
            }).build();
            gridContainer.addClass("appvisibility");
            gridContainer.find(".grid-widget").addClass("elementinput-long-block-users-app-grid");
            
            self.$el.find("#userapplicationblock-view-blockapplications").addClass("disabled");
            self.$el.find("#userapplicationblock-view-blockapplications").prop("disabled",true);
            
            gridContainer.bind("gridOnRowSelection", function(e, selectedRows){
            var selectedRowArr = selectedRows.selectedRows,    
                isRowsSelected = selectedRowArr.length > 0;
                $("#userapplicationblock-view-blockapplications").prop("disabled", isRowsSelected ? false : true);
                $("#userapplicationblock-view-blockuser").prop("disabled", isRowsSelected ? true : false);
            if(isRowsSelected){         
            //if(selectedRows.numberOfSelectedRows !== 0){
                $("#userapplicationblock-view-blockapplications").removeClass("disabled");
                $("#userapplicationblock-view-blockuser").addClass("disabled");
            }else{
                $("#userapplicationblock-view-blockapplications").addClass("disabled");
                $("#userapplicationblock-view-blockuser").removeClass("disabled");

            }
            });

            var url = "/api/juniper/appvisibility/application-statistics/user-detail?user-name=" 
                + self.selectedUser + "&start-time=" + self.timeInterval.startTime 
                + "&end-time=" + self.timeInterval.endTime;
           
            $.ajax({
                "url": url,
                "type":"GET",
                context : self
            }).done(self.onSuccess).fail(self.onFailure);
        },

        cancel : function(event){
             if(event){
                event.preventDefault();
                this.parent.overlayWidgetObj.destroy();
            }
        },

        onSuccess : function(data){
            var self = this;
            var applications = data.response.result[0]['applications'];
            if(applications.length > 5){
                applications.splice(5, applications.length - 5);
            }
            var grid = self.applicationsGrid;
            _.each(applications,function(application){
                grid.addRow({
                   name : application.name, volume : application.volume, 'session-count' : application['session-count']
                });
            });
        },

        onFailure : function(){

        },


        getUserGridConfig : function(){
            var self = this;
            return{
                "tableId":"applications_grid_list",
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
                    "label":'Application Name',
                    "width": 150
                },{
                    "index":"bandwidth",
                    "name":"volume",
                    "label":'Volume',
                    "formatter": self.configs.convertBytesToClosestUnit,
                    "width": 150
                },{
                    "index":"session-count",
                    "name":"session-count",
                    "label":'# Session Count',
                    "width": 150
                }]
            }
        },        

        blockUser : function(){
            var self = this;
            self.internalBlock({
                selectedUsers : [{
                    'name' : self.selectedUser,
                    'name-type' : self.selectedUserType
                }],
               startTime : self.options.timeInterval.startTime,
                endTime : self.options.timeInterval.endTime,
                selectedApplications : [],
                blockHeader : self.options.context.getMessage('block_application_button')
            });
        },

        blockApplications : function(){
            var self = this;
            self.internalBlock({
                selectedUsers : [{
                    name : self.selectedUser
                }],
               startTime : self.options.timeInterval.startTime,
                endTime : self.options.timeInterval.endTime,
                selectedApplications : self.applicationsGrid.getSelectedRows(),
                blockHeader : "Block Application"
            });
        },
        //
        internalBlock : function(input){
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

    });
    return ULV;
});