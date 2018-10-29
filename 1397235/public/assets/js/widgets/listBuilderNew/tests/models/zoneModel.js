/**
 * A Backbone model and collection that uses sample data to represent Zone
 *
 * @module ZoneModel
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'backbone'
], function(Backbone) {

    /**
     * Zone Model and Collection definition
     */
    var ZoneModel = {};
    ZoneModel.zone ={},

    ZoneModel.zone.model =  Backbone.Model.extend({});

    ZoneModel.zone.availableCollection =  Backbone.Collection.extend({
        url: './dataSample/availableZone.json',
        model: ZoneModel.zone.model
    });
    ZoneModel.zone.availableCollection2 =  Backbone.Collection.extend({
        url: './dataSample/availableZone_pageTwo.json',
        model: ZoneModel.zone.model
    });

    ZoneModel.zone.selectedCollection =  Backbone.Collection.extend({
        url: './dataSample/selectedZone.json',
        model: ZoneModel.zone.model
    });

    ZoneModel.zone.filteredCollection =  Backbone.Collection.extend({
        url: './dataSample/filterZone.json',
        model: ZoneModel.zone.model
    });

    return ZoneModel;
});