/**
 * Composite View for InSight Bar
 * @module InSightBarCompositeView
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
*/
define(['marionette', 'text!../templates/topUsers.html', "text!../templates/topRisks.html", "text!../templates/topCharacteristic.html", "text!../templates/topCategory.html", "text!../templates/topApps.html", 'text!../templates/inSightBarCompositeTemplate.html'], function(Marionette, TopUsersTemplate, TopRisksTemplate, TopCharTemplate, TopCatTemplate, TopAppsTemplate, CompositeTemplate){
	var InSightBarCompositeView = Marionette.CompositeView.extend({
		//itemView: ItemView,
		template: CompositeTemplate,
		itemViewContainer:".app-visibility-item-view-wrapper",
		//
		buildItemView: function(item, ItemViewType, itemViewOptions){
		    var options = _.extend({model: item}, itemViewOptions),
		    	template;
		    switch(item.get("type")){
		    	case "toprisks":
		    		ItemViewType = Marionette.ItemView.extend({template: TopRisksTemplate});
		    		break;
		    	case "topusers":
		    		ItemViewType = Marionette.ItemView.extend({template: TopUsersTemplate});
		    		break;
		    	case "topapps":
		    		ItemViewType = Marionette.ItemView.extend({template: TopAppsTemplate});
		    		break;
		    	case "topcat":
		    		ItemViewType = Marionette.ItemView.extend({template: TopCatTemplate});
		    		break;
		    	case "topchar":
		    		ItemViewType = Marionette.ItemView.extend({template: TopCharTemplate});
		    		break;
		    };
		    var view = new ItemViewType(options);
		    return view;
		},
		//
		templateHelpers: function(){
			return{
				"title": this.options.title
			}
		}
		//
	});
	return InSightBarCompositeView;
})