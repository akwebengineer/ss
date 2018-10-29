define(['../gridView.js',
      './sourceIpVisInSightView.js',
      '../../views/uservisibility/userApplicationListingView.js',
      'widgets/overlay/overlayWidget',
      '../../../../ui-common/js/views/gridView.js'],
	function(GridView, InSightView, ULV, overlayWidget, GridViewWidget){

		var SourceIPVisGridView = GridView.extend({
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
				var me=this;
				me.$el.off("blockIPAction").on("blockIPAction", $.proxy(me.onBlockIP, me));
			},
			//
			getMimeTypeForJump: function(){
				return "vnd.juniper.net.appvisibility";
			},
			//
	        getFilterKey: function(nameType){
	        	nameType = nameType || "IPV4";
	        	return this.filterUtil.LC_KEY.SOURCE_ADDRESS;
	        },
			//
			onBlockIP: function(event, row){
				var self=this;
				if(row.selectedRows.length === 0){
					return;
				}
				var selectedUser = row.selectedRows[0]['name'];
				var view = new ULV({
					selectedUser : selectedUser,
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
			//
			/**
			*override buildGridView
			*/
			buildGridView: function(){
				var me = this, time = me.options.filters.time,
					hasUserJumped = me.options.filters && me.options.filters.filterBy && me.options.filters.filterBy.searchBy.length > 0 || false,
					preferencesPath = me.options.context['ctx_name'] + ':' + me.configs.getIpVisGridConfig(time, me.options.filters["platform-device-ids"], hasUserJumped).tableId;
			

				me.appVisGrid = new GridViewWidget({
					"preferencesPath": preferencesPath,
				    "el": me.containers.gridContainer,
				    "isAppendGridInfo": false,
					"conf": me.configs.getIpVisGridConfig(time, me.options.filters["platform-device-ids"], hasUserJumped),
					"actionEvents":{
						"blockIPEvent": "blockIPAction"
					}
				}).render().gridWidget;
				//
				me.bindGridEvents();
				//
				return me;
			}
		});
		return SourceIPVisGridView;
});