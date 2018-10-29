/**
 * View to show custom address list summary
 *
 * @module CustomAddressListSummaryView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
     'backbone',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/customAddressListSummaryFormConf.js',
    '../conf/customAddressListGridConfiguration.js'
], function (Backbone, FormWidget, GridWidget, Form, AddressListGrid) {
    var GLOBAL_BLACK_LIST_TAG = 'Global Black',
        GLOBAL_WHITE_LIST_TAG = 'Global White';

    var CustomAddressListSummaryView = Backbone.View.extend({

        events: {
            'click #secintel-custom-address-list-close': "close"
        },

        close: function(event) {
            event.preventDefault();
            this.parentView.isCustomAddressListOverlayExisted = false;
            this.parentView.overlay.destroy();
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            if(this.model.get('name').indexOf(GLOBAL_BLACK_LIST_TAG) > -1){
                dynamicProperties.title = this.context.getMessage('secintel_policy_global_black_list');
            }else if(this.model.get('name').indexOf(GLOBAL_WHITE_LIST_TAG) > -1){
                dynamicProperties.title = this.context.getMessage('secintel_policy_global_white_list');
            }
            // Set label for global white/black list
            formConfiguration.sections[0].elements[4].label = dynamicProperties.title;
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.parentView.context;
        },

        render: function() {
            var self = this,
                paramArr = [];

            var formConfiguration = new Form(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            // If info source list exists
            if(this.model.get('info-source-list') && this.model.get('info-source-list')['info-source']){
                // Workaround until GridWidget is integrated with form widget
                this.addGridWidget('secintel-custom-address-lists', new AddressListGrid(this.context));
            }else{
                this.$el.find('.grid-widget').hide();
            }
            return this;
        },

        addGridWidget: function(id, gridConf) {
            var gridContainer = this.$el.find('#' + id);
            this.gridWidget = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues()
            });
            this.gridWidget.build();
            gridContainer.children().attr('id', id);
            gridContainer.find('.grid-widget').unwrap();

            var infoSourceList = this.model.get('info-source-list');
            if (infoSourceList && infoSourceList['info-source']) {
                infoSourceList['info-source'] = [].concat(infoSourceList['info-source']);
                infoSourceList['info-source'] = infoSourceList['info-source'].map(function(item) {
                    // Ensure name is a string
                    item.name = String(item.name);
                    return item;
                });
                this.gridWidget.addRow(infoSourceList['info-source'], 'last');
            }
        }
    });

    return CustomAddressListSummaryView;
});