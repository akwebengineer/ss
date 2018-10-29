/**
 * InSight View that displays 5 widgets - Top Users, Apps, Risks, Category, Characteristics
 * @module InSightBarCompositeView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['backbone', './inSightBarCompositeView.js', 'text!../templates/inSightView.html', 
	'lib/template_renderer/template_renderer', "../service/appSecureService.js", "../conf/appSecureConfigs.js", 
	"text!../templates/noDataTemplateInSightBar.html"], function(Backbone, InSightBarCompositeView, InSightTemplate, TemplateRenderer, AppVisibilityService, AppVisConfigs, NoDataTemplate){
	//
	var InSightView = Backbone.View.extend({
		//
		initialize:function(options){
			console.log("insight view initialized");
			var me=this;
			me.options = options;
			me.service = new AppVisibilityService();
			me.configs = new AppVisConfigs(options.context);
		},
		render:function(){
			var me=this,
				html = TemplateRenderer(InSightTemplate)
			me.$el.remove();
			me.$el.append(html);
			//
			me.containers =  {
				"mainContainer":me.$el,
				"topUsersContainer": me.$el.find(".app-visibility-top-users-container"),
				"topAppsContainer": me.$el.find(".app-visibility-top-apps-container"),
				"topRisksContainer": me.$el.find(".app-visibility-top-risks-container"),
				"topCategoryContainer": me.$el.find(".app-visibility-top-category-container"),
				"topCharcteristicContainer": me.$el.find(".app-visibility-top-characteristic-container")
			};
			//
			me.buildTopUsersView();
			me.buildTopAppsView();
			me.buildTopRisksView();
			me.buildTopCatView();
			me.buildTopCharView();
			//
			return me;
		},
		//
        displayNoData: function(container) {
            var me = this,
            	noData = TemplateRenderer(NoDataTemplate, {message: me.options.context.getMessage('app_vis_no_data')});
            container.find(".app-visibility-item-view-wrapper").empty().append(noData);
        },		
		buildTopRisksView: function(){
			var me=this;
			me.buildTopNView("/risk-level/session-count", true, "toprisks", function(data){
				//	
				me.containers.topRisksContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_risks_title")}).render().$el);	
				//
				if(data.length === 0){
					me.displayNoData(me.containers.topRisksContainer);	
				}
				//
			});
		},
		buildTopUsersView:function(){
			var me=this;
			me.buildTopNView("/user/volume", false, "topusers", function(data){
				me.containers.topUsersContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_users_title")}).render().$el);	
				if(data.length ===0 ){
					me.displayNoData(me.containers.topUsersContainer);
				}
			});
		},
		//
		buildTopAppsView:function(){
			var me=this;
			me.buildTopNView("/application/volume", false, "topapps", function(data){
				me.containers.topAppsContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_apps_title")}).render().$el);
				if(data.length ===0 ){
					me.displayNoData(me.containers.topAppsContainer);
				}
			});
		},
		//		
		buildTopCatView:function(){
			var me=this;
			me.buildTopNView("/category/volume", false, "topcat", function(data){
				me.containers.topCategoryContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_cat_title")}).render().$el);
				if(data.length ===0 ){
					me.displayNoData(me.containers.topCategoryContainer);
				}
			});
		},		
		buildTopCharView:function(){
			var me=this;
			me.buildTopNView("/characteristic/volume", false, "topchar", function(data){
				me.containers.topCharcteristicContainer.append(new InSightBarCompositeView({collection:data, "title": me.options.context.getMessage("app_secure_insight_top_char_title")}).render().$el);
				if(data.length ===0 ){
					me.displayNoData(me.containers.topCharcteristicContainer);
				}
			});
		},
		buildTopNView: function(url, isCount, type, buildView){
			var me=this,
				isCount = isCount || false,
				url = url + "?start=0&limit=5&start-time=" + me.options.filters.time.startTime + "&end-time=" + me.options.filters.time.endTime,
				TopNModel = Backbone.Model.extend({}),
				TopNList = Backbone.Collection.extend({model: TopNModel}),
				topList = new TopNList(),
				riskImgMap = {
					"low": "/installed_plugins/appvisibility/img/low.svg",
					"moderate": "/installed_plugins/appvisibility/img/moderate.svg",
					"high": "/installed_plugins/appvisibility/img/high.svg",
					"unsafe": "/installed_plugins/appvisibility/img/unsafe.svg",
					"critical": "/installed_plugins/appvisibility/img/critical.svg",
					"unknown": "/installed_plugins/appvisibility/img/unknown.svg"
				},
				onSuccess,
				onError;
			//
			url = url + (me.options.filters['platform-device-ids'] !== "" ? "&device-ids=" + me.options.filters['platform-device-ids'] : "");
			//
			onSuccess = function(collection, response){
				//var i=0;
				collection.each(function(model){
					var topNModel,
						name = model.get("name") || "UNKNOWN";
					topNModel = new TopNModel({
							"type": type,
							"name": name,
							"value": isCount ? model.get("value") : me.configs.convertBytesToClosestUnit(model.get("value")),
							"valuefortitle": isCount ? model.get("value") : me.configs.convertBytesToClosestUnit(model.get("value")).replace(" ", ""),
							"imgsource":riskImgMap[name.toLowerCase()]
						});
					topList.add(topNModel);
				});
				buildView(topList);
			};
			//
			onError = function(collection, response){
				console.log("inSightView.js::buildTopAppsView():Error");
			};
			//
			me.service.getTopNData(url, onSuccess, onError);
			//
		}
	});
	//
	return InSightView;
	//
})