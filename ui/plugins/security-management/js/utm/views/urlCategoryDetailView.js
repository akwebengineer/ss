/**
 * Detail View of URL Category
 *
 * @module UrlCategoryDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var UrlCategoryDetailView = DetailView.extend({

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
                'label': this.context.getMessage('utm_url_category_detail_select'),
                'id': "url_category_detail_view_list",
                'value': this.formatUrlDetail()
            });

            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'utm_url_category_fetch_error';
            this.objectTypeText = this.context.getMessage('url_category_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);

            var formatURL = this.$el.find('#url_category_detail_view_list label').html().replace(/,/g, ",<br/>");
            this.$el.find('#url_category_detail_view_list label').html(formatURL);

            return this;
        },

        formatUrlDetail:function () {
            var patternStr = "";
            var patterns = this.model.attributes['url-patterns'];
            if (patterns && patterns["url-pattern"]) 
            {
                patterns["url-pattern"] = [].concat(patterns["url-pattern"]);
                var patternObj = patterns["url-pattern"];
                for (var i=0; i<patternObj.length; i++) {
                    if (i < patternObj.length - 1 )
                    {
                        patternStr += patternObj[i].name + ', ';
                    } else {
                        patternStr += patternObj[i].name;
                    }
                }
            }

            return patternStr;
        }
    });

    return UrlCategoryDetailView;
});