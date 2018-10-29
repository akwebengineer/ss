/**
 *  Map View
 *  
 *  @module EventViewer
 *  @author dharma<adharmendran@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(['backbone', 'marionette', './baseEventViewerView.js', 'text!../templates/mapView.html',
		'widgets/map/mapWidget',
    	'widgets/map/models/CountriesMap'
	], function(Backbone, Marionette, BaseEventViewerView, MapViewTemplate, MapWidget, CountriesMap){

	var MapView = BaseEventViewerView.extend({
        //
        mapWidget : null,
		render: function(){
			var me=this,
				config = me.options;
			me.$el.append(MapViewTemplate);

            var geoJsonCountries = new CountriesMap().get('geoJsonCountries');

            me.mapWidgetObj = new MapWidget({
                'container': me.$el.find(".ev-map-view-container"),
                'geoJsonObject' : geoJsonCountries,
                'dataPropertyKey'  : 'threatEventCount',
                options:{
                    'highlightCountryStyle' : {
                        weight          : 1,
                        color           : '#FFF',        // outline color on highlight
                        dashArray       : '2',
                        fillOpacity     : 0.7,
                        fillColor       : '#95C1E7'        // fill color on highlight
                    },
                    'zoomLevel'        : 1.65,
                    'minZoom'          : 1.5,
                    'defaultCountryStyle' : {
                        weight          : 1,
                        opacity         : 1,
                        color           : '#FFF',         // outline color
                        dashArray       : '2',
                        fillOpacity     : 0.7
                    }
                }
			});
			me.mapWidgetObj.build();	
            setTimeout(function(){
                me.mapWidgetObj.invalidateSize();
            }, 2000);
			return me;
		}
	});

	return MapView;
})