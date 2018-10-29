/**
 * Detail View of URL Pattern
 *
 * @module UrlPatternDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var UrlPatternDetailView = DetailView.extend({

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
                'label': this.context.getMessage('utm_url_patterns_detail_url_list'),
                'id': "url_patterns_detail_view_list",
                'value': this.formatUrlList()
            });

            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'utm_url_patterns_fetch_error';
            this.objectTypeText = this.context.getMessage('url_pattern_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);

            var formatURL = this.$el.find('#url_patterns_detail_view_list label').html().replace(/,/g, ",<br/>");
            this.$el.find('#url_patterns_detail_view_list label').html(formatURL);

            return this;
        }, 

        formatUrlList:function () {
            var patternStr = "";
            var patterns = this.model.attributes['address-patterns'];
            if (patterns && patterns["address-pattern"]) 
            {
                patterns["address-pattern"] = [].concat(patterns["address-pattern"]);

                var patternArr= patterns["address-pattern"];
                patternStr = patternArr.join();
            }

            return patternStr;
        }
    });

    return UrlPatternDetailView;
});