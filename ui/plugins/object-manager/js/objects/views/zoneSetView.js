/**
 * View to create a ZoneSet
 * 
 * @module ZoneSetView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../widgets/zoneListBuilder.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../conf/zoneSetFormConfiguration.js',
    '../../../../ui-common/js/common/utils/validationUtility.js'
], function (Backbone, Syphon, FormWidget, ListBuilder, ResourceView, ZoneSetForm, ValidationUtility) {

    var ZoneSetView = ResourceView.extend({

        events: {
            'click #zone-set-save': "submit",
            'click #zone-set-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var self = this;
            // Check is form valid
            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);

            var saveSelectedItems = function(data) {
                var members = [];
                if($.isEmptyObject(data["zone-list"].zones)){
                    console.log('listbuilder has no selections');
                    self.form.showFormError(self.context.getMessage("zone_set_zone_empty_error"));
                    return;
                }

                var selectedItems = [].concat(data["zone-list"].zones);
                selectedItems.forEach(function (object) {
                    members.push({value: object.name});
                });

                properties.zones = members;

                self.bindModelEvents();
                self.model.set(properties);
                self.model.save(null, {
                    success: function(model, response) {
                        self.listBuilder.destroy();
                    }
                });
            };
            this.listBuilder.getSelectedItems(saveSelectedItems);
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);

            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('zone_set_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('zone_set_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('zone_set_clone');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            _.extend(this, ValidationUtility);

            this.successMessageKey = 'zone_set_create_success';
            this.editMessageKey = 'zone_set_edit_success';
            this.fetchErrorKey = 'zone_set_fetch_error';
            this.fetchCloneErrorKey = 'zone_set_fetch_clone_error';
        },

        render: function() {
            var self = this;
            var formConfiguration = new ZoneSetForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            // Workaround until listBuilder is integrated with form widget
            var zoneContainer = self.$el.find('#zone-set-zones');

            var selectedItems = [];
            if (self.model.get('zones')) {
                selectedItems = selectedItems.concat(self.model.get('zones'));
                selectedItems = selectedItems.map(function(item) {
                    return item.value;
                });
            }

            this.listBuilder = new ListBuilder({
                context: self.context,
                container: zoneContainer,
                selectedItems: selectedItems,
                id: "zone-set-zone-list"
            });

            this.listBuilder.build(function() {
                zoneContainer.find('.new-list-builder-widget').unwrap();
            });

            this.$el.addClass(this.context['ctx_name']);
            return this;
        }

    });

    return ZoneSetView;
});
