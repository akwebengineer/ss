/**
 * View to select from the list of services
 * 
 * @module ServiceSelectionView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/serviceSelectionFormConfiguration.js',
    '../widgets/serviceListBuilder.js'
], function (Backbone, FormWidget, FormConfiguration, ServiceListBuilder) {
    var ServiceSelectionView = Backbone.View.extend({
        events: {
            'click #service-save': "submit",
            'click #service-cancel': "cancel"
        },
        submit: function(event) {
            var self = this;
            event.preventDefault();
            var saveSelectedItems = function(data) {
                var members = [];
                if($.isEmptyObject(data.services.service)){
                    console.log('listbuilder has no selections');
                    return;
                }
                var selectedItems = [].concat(data.services.service);
                selectedItems.forEach(function (object) {
                    members.push({name: object.name});
                });
                self.listBuilder.destroy();
                self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, members);
                self.activity.finish();
                self.activity.overlay.destroy();
            };
            this.listBuilder.getSelectedItems(saveSelectedItems);
        },
        cancel: function(event) {
            event.preventDefault();
            this.listBuilder.destroy();
            this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_CANCELLED);
            this.activity.finish();
            this.activity.overlay.destroy();
        },
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
        },

        render: function() {
            var self = this;
            var formConfiguration = new FormConfiguration(this.context);
            this.form = new FormWidget({
                container: this.el,
                elements: formConfiguration.getValues()
            });
            this.form.build();
            // build service listbuilder
            var options = this.activity.getIntent().getExtras();
            var serviceContainer = self.$el.find('#service-selection');
            serviceContainer.attr("readonly", "");
            this.listBuilder = new ServiceListBuilder({
                container: serviceContainer,
                context: this.context,
                selectedItems: options.selectedItems
            });
            this.listBuilder.build(function() {
                serviceContainer.find('.new-list-builder-widget').unwrap();
            });

            return this;
        }
    });

    return ServiceSelectionView;
});