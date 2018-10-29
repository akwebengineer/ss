/**
 * Detail View of a antivirus profile
 *
 * @module AntivirusDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var profileTypeFormatter = function(value, context) {
        if (value === 'KASPERSKY')  return context.getMessage('utm_antivirus_profile_type_kaspersky');
        if (value === 'JUNIPER_EXPRESS')  return context.getMessage('utm_antivirus_profile_type_juniper_express');
        if (value === 'SOPHOS')  return context.getMessage('utm_antivirus_profile_type_sophos');
        if (typeof value === 'undefined')  return '';
    };

    var actionFormatter = function(value, context) {
        if (value === 'LOG_AND_PERMIT')  return context.getMessage('utm_antivirus_log_and_permit');
        if (value === 'BLOCK')  return context.getMessage('utm_antivirus_block');
        if (value === 'PERMIT')  return context.getMessage('utm_antivirus_permit');
        if (typeof value === 'undefined')  return '';
    };

    var notifyTypeFormatter = function(value, context) {
        if (value === 'PROTOCOL')  return context.getMessage('utm_antivirus_protocol');
        if (value === 'MESSAGE')  return context.getMessage('utm_antivirus_message');
        if (typeof value === 'undefined')  return '';
    };

    var AntivirusDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                sectionArr = [],
                section = {},
                values = this.model.attributes;

            // General information
            section.heading_text = this.context.getMessage('utm_antivirus_general_heading');
            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            eleArr.push({
                'label': this.context.getMessage('utm_antivirus_engine_type'),
                'value': profileTypeFormatter(values['profile-type'], this.context)
            });
            if(values['trickling-timeout']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_timeout'),
                    'value': values['trickling-timeout'] + ' ' +  this.context.getMessage('utm_web_filtering_timeout_second')
                });
            }
            section.elements = eleArr;
            sectionArr.push(section);

            // scan options
            eleArr = [];
            section = {};
            if(values['scan-options'] && values['scan-options']['content-size-limit']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_content_size_limit'),
                    'value': values['scan-options']['content-size-limit'] + ' ' + this.context.getMessage('utm_antivirus_kilo_bytes')
                });
            }
            if(values['scan-options'] && values['scan-options']['scan-file-extension']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_file_extension'),
                    'value': [].concat(values['scan-options']['scan-file-extension']).join(', ')
                });
            }
            if(! $.isEmptyObject(eleArr)){
                section.elements = eleArr;
                section.heading_text = this.context.getMessage('utm_antivirus_scan_options');
                sectionArr.push(section);
            }

            // fallback options
            if(values['fallback-options']){
                eleArr = [];
                section = {};
                if(values['fallback-options']['fallback-option'] && values['fallback-options']['fallback-option']['default-action']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_default_action'),
                        'value': actionFormatter(values['fallback-options']['fallback-option']['default-action'], this.context)
                    });
                }
                if(values['fallback-options']['content-size']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_content_size'),
                        'value': actionFormatter(values['fallback-options']['content-size'], this.context)
                    });
                }
                if(values['fallback-options']['fallback-option'] && values['fallback-options']['fallback-option']['engine-error']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_engine_error'),
                        'value': actionFormatter(values['fallback-options']['fallback-option']['engine-error'], this.context)
                    });
                }
                if(values['fallback-options']['password-file']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_password'),
                        'value': actionFormatter(values['fallback-options']['password-file'], this.context)
                    });
                }
                if(values['fallback-options']['corrupt-file']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_corrupt'),
                        'value': actionFormatter(values['fallback-options']['corrupt-file'], this.context)
                    });
                }
                if(values['fallback-options']['decompress-layer']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_decompress'),
                        'value': actionFormatter(values['fallback-options']['decompress-layer'], this.context)
                    });
                }
                if(! $.isEmptyObject(eleArr)){
                    section.elements = eleArr;
                    section.heading_text = this.context.getMessage('utm_antivirus_fallback_heading');
                    sectionArr.push(section);
                }
            }

            eleArr = [];
            section = {};
            // notification options - fallback block
            if(values['fallback-block-notification-options']
                && values['fallback-block-notification-options']['fallback-block-notification-option']
                && values['fallback-block-notification-options']['fallback-block-notification-option']['notify-mail-sender']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_fallback_block'),
                    'value': '',
                    'id': 'fallback_block_label'
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_notify_sender'),
                    'value': this.context.getMessage('enabled')
                });
                if(values['fallback-block-notification-options']['fallback-block-notification-option']['notification-type']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_notify_type'),
                        'value': notifyTypeFormatter(values['fallback-block-notification-options']['fallback-block-notification-option']['notification-type'], this.context)
                    });
                }
                if(values['fallback-block-notification-options']['fallback-block-notification-option']['custom-notification-subject']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_subject'),
                        'value': values['fallback-block-notification-options']['fallback-block-notification-option']['custom-notification-subject']
                    });
                }
                if(values['fallback-block-notification-options']['fallback-block-notification-option']['custom-notification-message']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_message'),
                        'value': values['fallback-block-notification-options']['fallback-block-notification-option']['custom-notification-message']
                    });
                }
                if(values['fallback-block-notification-options']['display-host-name']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_display_hostname'),
                        'value': this.context.getMessage('enabled')
                    });
                }
                if(values['fallback-block-notification-options']['allow-email']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_allow_email'),
                        'value': this.context.getMessage('enabled')
                    });
                }
                if(values['fallback-block-notification-options']['administrator-email-address']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_email_address'),
                        'value': values['fallback-block-notification-options']['administrator-email-address']
                    });
                }
            }
            // notification options - fallback non-block
            if(values['fallback-non-block-notification-options']
                && values['fallback-non-block-notification-options']['notify-mail-sender']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_fallback_non_block'),
                    'value': '',
                    'id': 'fallback_non_block_label'
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_notify_sender'),
                    'value': this.context.getMessage('enabled')
                });
                if(values['fallback-non-block-notification-options']['custom-notification-subject']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_subject'),
                        'value': values['fallback-non-block-notification-options']['custom-notification-subject']
                    });
                }
                if(values['fallback-non-block-notification-options']['custom-notification-message']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_message'),
                        'value': values['fallback-non-block-notification-options']['custom-notification-message']
                    });
                }
            }
            // notification options - detection
            if(values['virus-detection-notification-options']
                && values['virus-detection-notification-options']['notify-mail-sender']){
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_virus_detection'),
                    'value': '',
                    'id': 'virus_detection_label'
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_antivirus_notify_sender'),
                    'value': this.context.getMessage('enabled')
                });
                if(values['virus-detection-notification-options']['notification-type']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_notify_type'),
                        'value': notifyTypeFormatter(values['virus-detection-notification-options']['notification-type'], this.context)
                    });
                }
                if(values['virus-detection-notification-options']['custom-notification-subject']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_subject'),
                        'value': values['virus-detection-notification-options']['custom-notification-subject']
                    });
                }
                if(values['virus-detection-notification-options']['custom-notification-message']){
                    eleArr.push({
                        'label': this.context.getMessage('utm_antivirus_nitification_message'),
                        'value': values['virus-detection-notification-options']['custom-notification-message']
                    });
                }
            }
            if(! $.isEmptyObject(eleArr)){
                section.elements = eleArr;
                section.heading_text = this.context.getMessage('utm_antivirus_notification_heading');
                sectionArr.push(section);
            }

            conf.sections = sectionArr;
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_antivirus_fetch_error';
            this.objectTypeText = this.context.getMessage('antivirus_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            return this;
        }
    });

    return AntivirusDetailView;
});
