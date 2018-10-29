/**
 * Detail View of a Zone Set
 *
 * @module ZoneSetDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {
    var ZoneSetDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                values = this.model.attributes;

            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            eleArr.push({
                'label': this.context.getMessage('zone_set_zones'),
                'id': 'zones-value'
            });
            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'zone_set_fetch_error';
            this.objectTypeText = this.context.getMessage('zoneset_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            this.afterBuild();
            return this;
        },

        // add zone details afert render, otherwise the html tags will be encoded and displayed apparently
        afterBuild: function() {
            this.$el.find("#zones-value").html(this.formatZoneList());
        },

        formatZoneList:function () {
            var zones = this.model.get('zones');
            zones = _.pluck(zones, "value");
            return "<label>" + zones.join("<br><br>") + "</label>";
        }
    });

    return ZoneSetDetailView;
});