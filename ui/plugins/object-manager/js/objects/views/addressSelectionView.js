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
    '../conf/addressSelectionFormConfiguration.js',
    '../widgets/addressListBuilder.js'
], function (Backbone, FormWidget, FormConfiguration, ListBuilder) {
    
    var AddressSelectionView = Backbone.View.extend({
        events: {
            'click #address-save': "submit",
            'click #address-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var items = this.listBuilder.getSelectedItems();
            this.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, items);
            this.activity.finish();

            this.activity.overlay.destroy();
        },
        
        cancel: function(event) {
            event.preventDefault();
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
            var container = self.$el.find('#address-selection');
            this.listBuilder = new ListBuilder({
                container: container,
                list: {
                    selectedElements: options.selectedItems
                }
            });
            // Also, can set selected items after build, e.g. self.listBuilder.setSelectedItems(['tftp']);
            $.when(this.listBuilder.build())
                .done(function() {
                    container.children().attr('id', 'address-selection');
                    container.find('.list-builder-widget').unwrap();
                  })
                  .fail(function() {
                      console.log('Failed to fetch address list');
                  });

            return this;
        }
    });

    return AddressSelectionView;
});