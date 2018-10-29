/**
 * A object for some common methods in UTM features.
 *
 * @module UtmUtility
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'backbone.syphon'
], function (Backbone, Syphon) {

    var contentTypeIdArr = [
            'block-content-type-activex',
            'block-content-type-exe',
            'block-content-type-http-cookie',
            'block-content-type-java-applet',
            'block-content-type-zip'
        ];

    var ContentFilteringUtility  = {

        /**
         * Used to get data from each page in content filtering.
         */
        getPageData: function(page) {
            var self = this,
                jsonDataObj = {},
                properties = Syphon.serialize(this);

            if(page === this.pages.general_information || page === this.pages.all){
                jsonDataObj = {
                    "name" : properties["name"],
                    "description": properties["description"],
                    "notification-options" : {
                      "notification-type" : _.isEmpty(properties["notification-type"]) ? void(0) : properties["notification-type"],
                      "notify-mail-sender" : properties["notify-mail-sender"] ,
                      "custom-notification-message" : properties["custom-notification-message"]
                    }
                };
            }

            if(page === this.pages.protocol_command || page === this.pages.all){
                if(properties["permit-command-list"]){
                    jsonDataObj["permit-command-list"] = {};
                    jsonDataObj["permit-command-list"]["permit-command"] = properties["permit-command-list"].split(/\s*,\s*/);
                }else{
                    jsonDataObj["permit-command-list"] = null;
                }

                if(properties["block-command-list"]){
                    jsonDataObj["block-command-list"] = {};
                    jsonDataObj["block-command-list"]["block-command"] = properties["block-command-list"].split(/\s*,\s*/);
                }else{
                    jsonDataObj["block-command-list"] = null;
                }
            }

            if(page === this.pages.content_type || page === this.pages.all){
                var contentTypeValueArr = [];
                $.each(contentTypeIdArr, function(index, type) {
                    if(properties[type]){
                        contentTypeValueArr.push(self.$el.find('#' + type).val());
                    }
                 });
                if(contentTypeValueArr.length > 0){
                    jsonDataObj["block-content-type-list"] = {};
                    jsonDataObj["block-content-type-list"]["block-content-type"] = contentTypeValueArr;
                }else{
                    jsonDataObj["block-content-type-list"] = null;
                }
            }

            if(page === this.pages.file_extension || page === this.pages.all){
                if(properties["block-file-extension-list"]){
                    jsonDataObj["block-file-extension-list"] = {};
                    jsonDataObj["block-file-extension-list"]["block-file-extension"] = properties["block-file-extension-list"].split(/\s*,\s*/);
                }else{
                    jsonDataObj["block-file-extension-list"] = null;
                }
            }

            if(page === this.pages.mime || page === this.pages.all){
                if(properties["block-mime-list"]){
                    jsonDataObj["block-mime-list"] = {};
                    jsonDataObj["block-mime-list"]["block-mime"] = properties["block-mime-list"].split(/\s*,\s*/);
                }else{
                    jsonDataObj["block-mime-list"] = null;
                }

                if(properties["block-mime-exception-list"]){
                    jsonDataObj["block-mime-exception-list"] = {};
                    jsonDataObj["block-mime-exception-list"]["block-mime-exception"] = properties["block-mime-exception-list"].split(/\s*,\s*/);
                }else{
                    jsonDataObj["block-mime-exception-list"] = null;
                }
            }
            return jsonDataObj;
        },

        /**
         * Used to set data to each page in content filtering.
         */
        setPageData: function(page) {
            var self = this;

            if(page === this.pages.general_information || page === this.pages.all){
                // Set value for dropdown list and checkbox
                if(this.model.get('notification-options')) {
                    // used both in modify view and general step of creation wizard
                    this.form.getInstantiatedWidgets()["dropDown_notification-type"]["instance"].setValue(this.model.get('notification-options')['notification-type']);
                    this.$el.find('#custom-notification-message').val(this.model.get('notification-options')['custom-notification-message']);
                    this.$el.find('#notify-mail-sender').prop('checked',this.model.get('notification-options')['notify-mail-sender']);
                }
            }

            if(page === this.pages.protocol_command || page === this.pages.all){
                // Set value for textarea
                if(this.model.get('permit-command-list')) {
                    var permitCommands = this.model.get('permit-command-list')['permit-command'];
                    if($.isArray(permitCommands)){
                        this.$el.find('#permit-command-list').val(permitCommands.join(', '));
                    }else{
                        this.$el.find('#permit-command-list').val(permitCommands);
                    }
                }
                if(this.model.get('block-command-list')) {
                    var blockCommands = this.model.get('block-command-list')['block-command'];
                    if($.isArray(blockCommands)){
                        this.$el.find('#block-command-list').val(blockCommands.join(', '));
                    }else{
                        this.$el.find('#block-command-list').val(blockCommands);
                    }
                }
            }

            if(page === this.pages.content_type || page === this.pages.all){
                if(this.model.get('block-content-type-list') && this.model.get('block-content-type-list')['block-content-type']){
                    var contentTypes = this.model.get('block-content-type-list')['block-content-type'];
                    if(! $.isArray(contentTypes)){
                        contentTypes = [contentTypes];
                    }
                    $.each(contentTypeIdArr, function(index, type) {
                        var radio = self.$el.find('#' + type);
                        if($.inArray(radio.val(), contentTypes) >= 0){
                            radio.prop('checked',true);
                        }
                     });
                }
            }

            if(page === this.pages.file_extension || page === this.pages.all){
                // Set value for textarea
                if(this.model.get('block-file-extension-list')) {
                    var fileExtensions = this.model.get('block-file-extension-list')['block-file-extension'];
                    if($.isArray(fileExtensions)){
                        this.$el.find('#block-file-extension-list').val(fileExtensions.join(', '));
                    }else{
                        this.$el.find('#block-file-extension-list').val(fileExtensions);
                    }
                }
            }

            if(page === this.pages.mime || page === this.pages.all){
                // Set value for textarea
                if(this.model.get('block-mime-list')) {
                    var blockMimes = this.model.get('block-mime-list')['block-mime'];
                    if($.isArray(blockMimes)){
                        this.$el.find('#block-mime-list').val(blockMimes.join(', '));
                    }else{
                        this.$el.find('#block-mime-list').val(blockMimes);
                    }
                }
                if(this.model.get('block-mime-exception-list')) {
                    var blockMimeExceptions = this.model.get('block-mime-exception-list')['block-mime-exception'];
                    if($.isArray(blockMimeExceptions)){
                        this.$el.find('#block-mime-exception-list').val(blockMimeExceptions.join(', '));
                    }else{
                        this.$el.find('#block-mime-exception-list').val(blockMimeExceptions);
                    }
                }
            }
        },

        /**
         * Used to add validation to current page and set other effects.
         */
        decoratePage: function(page, formElements) {
            var blurItemIdArr = [];
            if(page === this.pages.general_information || page === this.pages.all){
                this.$el.addClass("security-management");
            }

            if(page === this.pages.protocol_command || page === this.pages.all){
                blurItemIdArr.push('permit-command-list');
                blurItemIdArr.push('block-command-list');
            }

            if(page === this.pages.file_extension || page === this.pages.all){
                blurItemIdArr.push('block-file-extension-list');
            }

            if(page === this.pages.mime || page === this.pages.all){
                blurItemIdArr.push('block-mime-list');
                blurItemIdArr.push('block-mime-exception-list');
            }

            if(blurItemIdArr.length > 0){
                this.bindBlur(blurItemIdArr, function(comp){
                    this.separateValuesWithBlank(comp);
                });
            }

            if(page != this.pages.content_type){
                this.addSubsidiaryFunctions(formElements);
            }
        },

        /**
         * Used to check whether values in mandatory fields exist
         */
        mandatoryFieldsValidation: function(values) {
            if($.isEmptyObject(values['permit-command-list']) && $.isEmptyObject(values['block-command-list'])
                    && $.isEmptyObject(values['block-content-type-list'])
                    && $.isEmptyObject(values['block-file-extension-list'])
                    && $.isEmptyObject(values['block-mime-list']) && $.isEmptyObject(values['block-mime-exception-list'])){
                return false;
            }
            return true;
        }
    };

    ContentFilteringUtility.pages = {
        'general_information': '1',
        'protocol_command': '2',
        'content_type': '3',
        'file_extension': '4',
        'mime': '5',
        'all': '0'
    };

    return ContentFilteringUtility;
});