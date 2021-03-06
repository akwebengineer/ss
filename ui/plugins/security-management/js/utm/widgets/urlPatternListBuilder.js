/**
 * ListBuilder for URL pattern selection
 *
 * @module UrlPatternListBuilder
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    '../../../../sd-common/js/common/widgets/baseNewListBuilder.js',
    '../conf/urlPatternListBuilderConfiguration.js',
    '../models/urlPatternListBuilderModel.js'
], function (Backbone, ListBuilder, ListBuilderConf, ListBuilderModel) {

    var UrlPatternListBuilder = ListBuilder.extend({

        initialize: function (options) {
            this.listBuilderModel = new ListBuilderModel();
            ListBuilder.prototype.initialize.call(this, options);
        },

        addDynamicFormConfig: function(elements) {
            var self = this;

            elements.search.url = function (currentPara, value){
                console.log(value);
                var updatedPara = {};
                if (value) {
                    updatedPara._search = value;
                } else {
                    delete currentPara._search;
                }
                return _.extend(currentPara, updatedPara);
            };

            return elements;
        },

        initListBuilderConf: function() {
            var self = this;

            var formConfiguration = new ListBuilderConf(this.context);
            var elements = formConfiguration.getValues(this.listBuilderModel);

            this.elements = this.addDynamicFormConfig(elements);
        }
    });

    return UrlPatternListBuilder;
});