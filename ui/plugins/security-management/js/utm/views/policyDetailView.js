/**
 * Detail View of a UTM policy
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
        if (value === 'LOG_AND_PERMIT')  return context.getMessage('utm_policy_action_log_and_permit');
        if (value === 'BLOCK')  return context.getMessage('utm_policy_action_block');
        if (value === 'NONE')  return context.getMessage('utm_policy_action_none');
        if (typeof value === 'undefined')  return '';
    };

    var PolicyDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                sectionArr = [],
                section = {},
                values = this.model.attributes;
            var protocolArr = ['http','ftp-upload','ftp-download','imap','smtp','pop3'],
                profileArr = ['web-filtering-profile','anti-virus-profiles','anti-spam-profile','content-filtering-profiles'];

            section.heading_text = this.context.getMessage('utm_policy_title_general_information');
            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            section.elements = eleArr;
            sectionArr.push(section);

            eleArr = [];
            section = {};
            section.heading_text = this.context.getMessage('utm_policy_title_traffic_options');
            if(values['sessions-per-client']){
                eleArr.push({
                    'label': this.context.getMessage('utm_policy_connection_limit'),
                    'value': values['sessions-per-client']
                });
            }
            eleArr.push({
                'label': this.context.getMessage('utm_policy_action_label'),
                'value': formatActionObject(values['session-over-limit-action'], this.context)
            });
            section.elements = eleArr;
            sectionArr.push(section);

            for(var j = 0; j < profileArr.length; j++){
                var profile = profileArr[j];
                if(values[profile]){
                    var protocols = values[profile];
                    eleArr = [];
                    section = {};
                    if(profile === 'web-filtering-profile'){
                        section.heading_text = this.context.getMessage('web_filtering_type_text');
                        eleArr.push({
                            'label': this.context.getMessage('utm_policy_http'),
                            'value': protocols.name
                        });
                    }else if(profile === 'anti-spam-profile'){
                        section.heading_text = this.context.getMessage('antispam_type_text');
                        eleArr.push({
                            'label': this.context.getMessage('utm_policy_smtp'),
                            'value': protocols.name
                        });
                    }else{
                        if(profile === 'anti-virus-profiles'){
                            section.heading_text = this.context.getMessage('antivirus_type_text');
                        }else if(profile === 'content-filtering-profiles'){
                            section.heading_text = this.context.getMessage('content_filtering_type_text');
                        }
                        for(var i = 0; i < protocolArr.length; i++){
                            var protocol = protocolArr[i],
                                protocolFlag = protocol + '-profile';
                            if(protocols[protocolFlag] && protocols[protocolFlag].id){
                                var messageStr = protocol.replace('-', '_');
                                eleArr.push({
                                    'label': this.context.getMessage('utm_policy_' + messageStr),
                                    'value': protocols[protocolFlag].name
                                });
                            }
                        }
                    }

                    if(! $.isEmptyObject(eleArr)){
                        section.elements = eleArr;
                        sectionArr.push(section);
                    }
                }
            }
            conf.sections = sectionArr;
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_policy_fetch_error';
            this.objectTypeText = this.context.getMessage('utm_policy_type_text');
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