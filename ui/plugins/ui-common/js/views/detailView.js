/**
 * A view superclass for detail view
 *
 * @module DetailView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    'backbone',
    'widgets/form/formWidget'
], function (Backbone, FormWidget) {

    var cancelActivity = function(activity) {
        activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
        activity.finish();
        activity.overlay.destroy();
    };

    var htmlEncode = function (value){
        return $('<div/>').text(value).html();
    };

    var DetailView = Backbone.View.extend({

        events: {
            'click #detail-view-close': "close"
        },

        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
        },

        close: function(event) {
            if (event) {
                event.preventDefault();
                cancelActivity(this.activity);
            }
        },

        /**
         * Function to override when you need to get form elements
         */
        getFormConfig: function() {
        },

        renderForm: function(conf) {
            var objectTypeText = this.objectTypeText ? this.objectTypeText : '';
            if(conf.sections && conf.sections.length > 0){
                var sections = this.generateConf(conf.sections);
                var formElements = {
                        "title": conf.title ? conf.title : this.context.getMessage('detail_view_title', [objectTypeText]),
                        "on_overlay": true,
                        "title-help": {
                            "content": this.context.getMessage('show_detail_view_tooltip'),
                            "ua-help-text": this.context.getMessage('more_link'),
                            "ua-help-identifier": this.context.getHelpKey("POLICY_OBJECT_DETAIL_VIEW")
                        },
                        "form_id": "detail-view-form",
                        "form_name": "detail-view-form",
                        "sections": sections,
                        "buttonsAlignedRight": true,
                        "buttons": [
                            {
                                "id": "detail-view-close",
                                "name": "close",
                                "value": this.context.getMessage('close')
                            }
                        ]
                };

                this.form = new FormWidget({
                    container: this.el,
                    elements: formElements
                });

                this.form.build();
            }else{
                console.log('form configuration is not correct.');
            }
        },

        generateConf: function(sectionsParam) {
            var sections = [];
            for (var i=0; i<sectionsParam.length; i++) {
                var section = {}, elements = [];
                if(sectionsParam[i].heading){
                    section.heading = sectionsParam[i].heading;
                }
                if(sectionsParam[i].heading_text){
                    section.heading_text = sectionsParam[i].heading_text;
                }
                if(sectionsParam[i].section_id){
                    section.section_id = sectionsParam[i].section_id;
                }
                for (var j=0; j<sectionsParam[i].elements.length; j++) {
                    var eleParam = sectionsParam[i].elements[j],
                        element = {};
                    if(eleParam.label){
                        element = {
                            "element_description": true,
                            "id": eleParam.id? eleParam.id : "text_description_" + i + '_' + j,
                            "label": eleParam.label,
                            "value": htmlEncode(eleParam.value)
                        };
                        if(eleParam['class']){
                            element['class'] = eleParam['class'];
                        }
                        elements.push(element);
                    }
                }
                section.elements = elements;
                sections.push(section);
            }
            return sections;
        }
    });

    return DetailView;
});