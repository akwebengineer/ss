define(['../gridView.js', './userVisInSightView.js', "./userApplicationListingView.js", 
	'widgets/overlay/overlayWidget', '../../../../ui-common/js/views/gridView.js'], 
	function(GridView, InSightView, ULV, overlayWidget, GridViewWidget){

	var UserVisGridView = GridView.extend({
		render:function(){
			var me=this;
			GridView.prototype.render.call(me);
			me.$el.find(".app-secure-grid-legend").hide();
			return me;
		},
		/**
		*override buildInSightView
		*/
		buildInSightView: function(){
			var me=this;
			inSightView = new InSightView(me.options);
			me.containers.inSightContainer.append(inSightView.render().$el);
			return me;
		},
		/**
		*override bindGridEvents
		*/
		bindGridEvents: function(){
			var me=this,hasUserJumped = me.options.filters && me.options.filters.filterBy && me.options.filters.filterBy.searchBy.length > 0;

			if(!hasUserJumped){
				me.$el.off("blockUserAction").on("blockUserAction", $.proxy(me.onBlockUser, me));	
			}
			else{ 
				me.$el.off("blockUserAction").on("blockUserAction", $.proxy(me.onUserJumpedBlockUsers, me));
			}
			
		},
		//
		getMimeTypeForJump: function(){
			return "vnd.juniper.net.appvisibility";
		},
		//
        getFilterKey: function(nameType){
        	nameType = nameType || "username";
        	return nameType === "IPV4" || nameType === "IPV6" ? this.filterUtil.LC_KEY.SOURCE_ADDRESS : this.filterUtil.LC_KEY.USER_NAME;
        },
		//
		onBlockUser: function(event, row){
			var self=this;
			if(row.selectedRows.length === 0){
				return;
			}
			var selectedUser = row.selectedRows[0]['name'],
				selectedUserType = row.selectedRows[0]['name-type'];
			var view = new ULV({
				selectedUser : selectedUser,
				selectedUserType : selectedUserType,
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

        onUserJumpedBlockUsers : function(){
            var self = this;
            self.handleBlock({
                context:this.context,
                selectedApplications : [{
                    name : self.options.filters.filterBy.searchBy
                }],
                startTime : self.options.filters.time.startTime,
                endTime : self.options.filters.time.endTime,
                selectedUsers : this.appVisGrid.getSelectedRows(),
                blockHeader : "Block User"
            });
        },

        handleBlock : function(input){
            var me=this,
                sourceName="user",
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
                console.log('-- Block Work Flow initialized from User-visibility --');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            this.options.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, this));
        },

        clearAllTokens:function(){
           console.log("clearing tokens");
           var me=this, 
                 intent = new Slipstream.SDK.Intent(
                        "slipstream.intent.action.ACTION_LIST",
                        { 
                            mime_type: "vnd.juniper.net.uservisibility"
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
		/**
		*override buildGridView
		*/
		buildGridView: function(){
			var me = this, time = me.options.filters.time,
				hasUserJumped = me.options.filters && me.options.filters.filterBy && me.options.filters.filterBy.searchBy.length > 0 || false,
				preferencesPath = me.options.context['ctx_name'] + ':' + me.configs.getUserVisGridConfig(time, me.options.filters["platform-device-ids"], hasUserJumped,$.proxy(me.clearAllTokens, me)).tableId;
				
			me.appVisGrid = new GridViewWidget({
				"preferencesPath": preferencesPath,
			    "el": me.containers.gridContainer,
			    "isAppendGridInfo": false,
				"conf": me.configs.getUserVisGridConfig(time, me.options.filters["platform-device-ids"], hasUserJumped,$.proxy(me.clearAllTokens, me)),
				"search": me.options.filters.filterBy && me.options.filters.filterBy.searchBy && me.options.filters.filterBy.searchBy.length > 0 ? [me.options.filters.filterBy.searchKey + " = " + me.options.filters.filterBy.searchBy] : "",
				"actionEvents":{
					"blockUserEvent": "blockUserAction"
				}
			}).render().gridWidget;
			//
			me.bindGridEvents();
			//
			return me;
		}
	});
	return UserVisGridView;
});