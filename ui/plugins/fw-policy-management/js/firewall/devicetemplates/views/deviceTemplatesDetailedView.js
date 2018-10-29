/**
 * Detail View of an device template
 *
 * @module DeviceTemplateDetailedView
 * @author Damodhar M <mdamodhar@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    '../../../../../ui-common/js/views/detailView.js',
    '../common/constant/deviceTemplatesConstant.js'
], function (Backbone, DetailView,DeviceConstant) {
    var DeviceTemplatesDetailedView = DetailView.extend({
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
                'label': this.context.getMessage('device_templates_label_devicefamily'),
                'value': "J/SRX/LN"
            });
            eleArr.push({
                'label': this.context.getMessage('device_templates_label_deviceversion'),
                'value': values['os-version']
            });
            eleArr.push({
                'label': this.context.getMessage('device_templates_label_templateeditor')
            }); 
            conf.sections = [{elements: eleArr}];
            return conf;
        },

        initialize: function(options) {
            DetailView.prototype.initialize.call(this, options);
            this.fetchErrorKey = 'device_templates_fetch_error';
            this.objectTypeText = this.context.getMessage('device_templates_text');
        },

        render: function() {
            this.gettemplateconfiguration();
            // Get form configuration
            var conf = this.getFormConfig();
            // Render form
            this.renderForm(conf);
            this.$el.addClass("security-management");
            this.$el.find('#text_description_0_4').children().remove();
            this.$el.find('#text_description_0_4').append('<div style="width: 548px;height: 338px;border: 1px solid #ccc;padding: 5px;" class="receiverDisplay"></div><input type="hidden" id="receiverMessage" name="recevierMessage"/>');
            this.$el.find("#text_description_0_4" ).css( "font-size", "12px" );
            return this;
        },
        /*Fetch Template Config in Edit Mode*/
        gettemplateconfiguration: function() {
            var self = this;
            $.ajax({
                url: '/api/space/config-template-management/config-templates/'+this.model.get('id') +'/versions/'+this.model.get('current-version')+'/configuration',
                method: 'GET',
                dataType: 'json',
                headers: {
                    'accept': DeviceConstant.TEMPLATE_SHOW_DETAILS_ACCEPT_TYPE,
                    'Content-Type': DeviceConstant.TEMPLATE_SHOW_DETAILS_CONTENT_TYPE
                },
                success: function(data, status) {
                    if (data && data['template-config-cli']) {
                        if (data['template-config-cli']['cli'] != "") {
                            //self.$el.find('#receiverMessage').val(data['template-config-cli']['cli']);
                            self.$el.find('.receiverDisplay').html(data['template-config-cli']['cli']);
                        }
                    }
                },
                error: function(jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }

    });

    return DeviceTemplatesDetailedView;
});