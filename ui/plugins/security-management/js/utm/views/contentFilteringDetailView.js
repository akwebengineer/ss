/**
 * Detail View of a Content Filtering profile
 *
 * @module contentFilteringDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var getNotificationTypeValue = function(value, context) {
        switch (value) {
            case "MESSAGE":
                return context.getMessage("utm_content_filtering_notification_type_message");
                break;
            case "PROTOCOL":
                return context.getMessage("utm_content_filtering_notification_type_protocol");
                break;
            default:
                return "";
        }
    };

    var getListValues = function (list) {
        if (list && $.isArray(list)) {
            return list.join(", ");
        } else {
            return list;
        }
    };

    var getContentTypeValues = function(list, context) {
        var newList = [];
        if(!$.isEmptyObject(list)){
            newList = list.map(function(item) {
                switch (item) {
                    case "ACTIVEX":
                        return context.getMessage("utm_content_filtering_block_content_type_activex");
                        break;
                    case "EXE":
                        return context.getMessage("utm_content_filtering_block_content_type_exe");
                        break;
                    case "HTTP_COOKIE":
                        return context.getMessage("utm_content_filtering_block_content_type_http_cookie");
                        break;
                    case "JAVA_APPLET":
                        return context.getMessage("utm_content_filtering_block_content_type_java_applet");
                        break;
                    case "ZIP":
                        return context.getMessage("utm_content_filtering_block_content_type_zip");
                        break;
                    default:
                        return "";
                }
            });
        }
        return newList.join(", ");
    }

    var ContentFilteringDetailView = DetailView.extend({

        getFormConfig: function() {
            var sectionsArray = [],
                values = this.model.attributes;

            // General info, display name and description even if value is empty
            var eleArr = [];
            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            sectionsArray.push({
                "heading_text": this.context.getMessage("utm_content_filtering_title_general_information"),
                elements: eleArr
            });
            // notification info
            if (values["notification-options"]) {
                var eleArr = [],
                    tempValue = values["notification-options"];
                eleArr.push({
                    'label': this.context.getMessage('utm_content_filtering_notify_mail_sender'),
                    'value': tempValue["notify-mail-sender"] ? "true" : "false"
                });
                if (tempValue["notification-type"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_notification_type'),
                        'value': getNotificationTypeValue(tempValue["notification-type"], this.context)
                    });
                }
                if (tempValue["custom-notification-message"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_custom_notification_message'),
                        'value': tempValue["custom-notification-message"]
                    });
                }
                sectionsArray.push({
                    "heading_text": this.context.getMessage("utm_content_filtering_title_notification_options"),
                    elements: eleArr
                });
            }
            //command protocols
            if (values["permit-command-list"] || values["block-command-list"]) {
                var eleArr = [];
                if (values["block-command-list"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_block_command_list'),
                        'value': getListValues(values["block-command-list"]["block-command"])
                    });
                }
                if (values["permit-command-list"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_permit_command_list'),
                        'value': getListValues(values["permit-command-list"]["permit-command"])
                    });
                }
                sectionsArray.push({
                    "heading_text": this.context.getMessage("utm_content_filtering_protocol_commands"),
                    elements: eleArr
                });
            }
            // content type
            if (values["block-content-type-list"]) {
                var eleArr = [];
                eleArr.push({
                    'label': this.context.getMessage('utm_content_filtering_block_content_type'),
                    'value': getContentTypeValues(values["block-content-type-list"]["block-content-type"], this.context)
                });
                sectionsArray.push({
                    "heading_text": this.context.getMessage("utm_content_filtering_content_types"),
                    elements: eleArr
                });
            }
            // file extension
            if (values["block-file-extension-list"]) {
                var eleArr = [];
                eleArr.push({
                    'label': this.context.getMessage('utm_content_filtering_block_file_extension_list'),
                    'value': getListValues(values["block-file-extension-list"]["block-file-extension"])
                });
                sectionsArray.push({
                    "heading_text": this.context.getMessage("utm_content_filtering_file_extensions"),
                    elements: eleArr
                });
            }
             // mime type
            if (values["block-mime-exception-list"] || values["block-mime-list"]) {
                var eleArr = [];
                if (values["block-mime-exception-list"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_block_mime_exception_list'),
                        'value': getListValues(values["block-mime-exception-list"]["block-mime-exception"])
                    });
                }
                if (values["block-mime-list"]) {
                    eleArr.push({
                        'label': this.context.getMessage('utm_content_filtering_block_mime_list'),
                        'value': getListValues(values["block-mime-list"]["block-mime"])
                    });
                }
                sectionsArray.push({
                    "heading_text": this.context.getMessage("utm_content_filtering_mime"),
                    elements: eleArr
                });
            }
            var config = {
                sections : sectionsArray
            };
            return config;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_content_filtering_fetch_error';
            this.objectTypeText = this.context.getMessage('utm_content_filtering_grid_title');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            return this;
        }
    });

    return ContentFilteringDetailView;
});