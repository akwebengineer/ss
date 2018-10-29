/**
 * Detail View of a device profile
 *
 * @module DeviceProfileDetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../ui-common/js/views/detailView.js'
], function (Backbone, DetailView) {

    var DeviceProfileDetailView = DetailView.extend({

        getFormConfig: function() {
            var conf = {},
                eleArr = [],
                sectionArr = [],
                section = {},
                values = this.model.attributes;

            // General information
            section.heading_text = this.context.getMessage('utm_device_title_general_information');
            eleArr.push({
                'label': this.context.getMessage('name'),
                'value': values.name
            });
            eleArr.push({
                'label': this.context.getMessage('description'),
                'value': values.description
            });
            if (values.devices && values.devices.device) {
                var deviceArr = [].concat(values.devices.device);
                var selectedDevices = deviceArr.map(function(item) {
                    return  item.name;
                });
                eleArr.push({
                    'label': this.context.getMessage('utm_device_devices'),
                    'value': selectedDevices.join(',')
                });
            }
            section.elements = eleArr;
            sectionArr.push(section);

            // antispam profile
            eleArr = [];
            section = {};
            if(values['as-address-white-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_as_address_white_list'),
                    'value': values['as-address-white-list'].name
                });
            }
            if(values['as-address-black-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_as_address_black_list'),
                    'value': values['as-address-black-list'].name
                });
            }
            if(! $.isEmptyObject(eleArr)){
                section.elements = eleArr;
                section.heading_text = this.context.getMessage('utm_device_title_anti_spam');
                sectionArr.push(section);
            }

            // antivirus profile
            eleArr = [];
            section = {};
            if(values['av-mime-white-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_av_mime_white_list'),
                    'value': [].concat(values['av-mime-white-list']['av-mime']).join(', ')
                });
            }
            if(values['av-mime-exception-white-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_av_mime_exception_white_list'),
                    'value': [].concat(values['av-mime-exception-white-list']['av-mime-exception']).join(', ')
                });
            }
            if(values['av-url-category-white-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_av_url_white_list'),
                    'value': values['av-url-category-white-list'].name
                });
            }
            if(! $.isEmptyObject(eleArr)){
                section.elements = eleArr;
                section.heading_text = this.context.getMessage('utm_device_title_anti_virus');
                sectionArr.push(section);
            }

            // web filtering profile
            eleArr = [];
            section = {};
            if(values['wf-url-category-white-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_wf_url_white_list'),
                    'value': values['wf-url-category-white-list'].name
                });
            }
            if(values['wf-url-category-black-list']){
                eleArr.push({
                    'label': this.context.getMessage('utm_device_wf_url_black_list'),
                    'value': values['wf-url-category-black-list'].name
                });
            }
            if(! $.isEmptyObject(eleArr)){
                section.elements = eleArr;
                section.heading_text = this.context.getMessage('utm_device_title_web_filtering');
                sectionArr.push(section);
            }


            conf.sections = sectionArr;
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);

            this.fetchErrorKey = 'utm_device_fetch_error';
            this.objectTypeText = this.context.getMessage('device_profile_type_text');
        },

        render: function() {
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            return this;
        }
    });

    return DeviceProfileDetailView;
});
