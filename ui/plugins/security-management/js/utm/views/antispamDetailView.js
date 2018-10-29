/**
 * Detail View of a Anti-Spam profile
 *
 * @module PolicyDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var formatActionObject = function (value, context) {
        if (value === 'TAG_SUBJECT')  return context.getMessage('utm_antispam_grid_action_tag_subject');
        if (value === 'TAG_HEADER')  return context.getMessage('utm_antispam_grid_action_tag_header');
        if (value === 'BLOCK_EMAIL')  return context.getMessage('utm_antispam_grid_action_block_email');
        if (value === 'NONE')  return context.getMessage('utm_antispam_grid_action_none');
        if (typeof value === 'undefined')  return '';
    };

    var PolicyDetailView = DetailView.extend({

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
                'label': this.context.getMessage('utm_antispam_default_sbl_server'),
                'value': values['default-sbl-server'] ? this.context.getMessage('enabled') : this.context.getMessage('disabled')
            });
            eleArr.push({
                'label': this.context.getMessage('utm_antispam_default_action'),
                'value': formatActionObject(values['default-action'], this.context)
            });
            eleArr.push({
                'label': this.context.getMessage('utm_antispam_custom_tag'),
                'value': values['tag-string']
            });
            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_antispam_fetch_error';
            this.objectTypeText = this.context.getMessage('antispam_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            return this;
        }
    });

    return PolicyDetailView;
});