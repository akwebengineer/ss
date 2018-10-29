/**
 *  Recent Filters View
 *  
 *  @module EventViewer
 *  @author Slipstream Developers <shinig@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'lib/template_renderer/template_renderer', 'text!../templates/recentFiltersView.html', 
	'../models/recentFiltersCollection.js'], 
function( Backbone, render_template, RecentFiltersTemplate, RecentFiltersCollection){

	var RecentFiltersView = Backbone.View.extend({

        events:{
            "click .ev-recent-filter-link": "onRecentFilterClick"
        },
		initialize:function(options){
			console.log(options);
			var me = this;
			me.options = options;
			category = me.options.eventCategory;
			this.render();			
		},

		render: function(){
			console.log('Recent filters view rendered');
			var me=this, 
				filterData = [], 
				filterObj = {},
                href;
                
            $.when(me.getRecentFilters()).done(function(collection){
                me.recentFiltersCollection = collection;
                collection.each(function(model, index){ 
                   href = '#'+ model.get('filter-name');                  	
                   filterData.push({
                		'href': href,
                        'name': model.get('filter-name'),
                		'text': model.get('filter-name'),
                        "filter-id": model.get('moid')
            		});
                   filterObj = {'recent-filters': filterData };

                });
                var recentFiltersHtml = render_template(RecentFiltersTemplate, filterObj);
                me.$el.append(recentFiltersHtml);
            });
            
          	return this;
		},
        onRecentFilterClick:function(event){
            console.log(event.currentTarget);
            var me=this;
            var selectedFilterId = parseInt($(event.currentTarget).attr('data-filterid'));
            var model = me.recentFiltersCollection.where({"moid": selectedFilterId})[0];
            me.$el.trigger("recentFilterSelected", model['attributes']);
        },
		/**
		 * Returns a jquery promise
		 **/
        getRecentFilters: function(){
            var me=this,
                onSuccess,
                onFailure,
                def = $.Deferred(),
                filterTag = me.getFilterTags(category);
            this.filters = new RecentFiltersCollection();

            this.filters.url = this.filters.url+'&tag='+filterTag;
           
            onSuccess = function (collection, response, options) {
                def.resolve(collection, response);
            };
           
            onFailure = function (collection, response, options) {
                console.log('Filters collection not fetched');
                def.reject();
            };
            
            me.filters.fetch({
                success: onSuccess,
                error: onFailure
            });
            
            return def.promise();
        },

        getFilterTags : function(key) {
             var filterTagsMap = {
                "FIREWALL": "firewall",
                "WEB-FILTERING" : "webfilter",
                "VPN" :  "vpn",
                "CONTENT-FILTERING" : "contentfilter",
                "ANTI-SPAM" :  "antispam",
                "ANTI-VIRUS" : "antivirus",
                "IPS" : "ips"
             };
             if(filterTagsMap[key] ) {
                    return  filterTagsMap[key];
             } else {
                 return key;
             }

        }

	});

	return RecentFiltersView;
});