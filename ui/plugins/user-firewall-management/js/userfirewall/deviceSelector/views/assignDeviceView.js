/**
 * A view implementing general form workflow for create Access Profile wizard.
 *
 * @module PolicyGeneralFormView
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(['backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../confs/assignDeviceFormConf.js',
    './userFwDeviceListBuilder.js'
], function(Backbone, Syphon, FormWidget, Form, DevicesListBuilder) {

    var FormView = Backbone.View.extend({
        /**
         * Initialize Backbone view
         * @param options
         */
        initialize: function(options) {
            this.wizardView = this.options.wizardView;
            this.context = this.options.context;
            return this;
        },
        /**
         * builds form view
         * @returns {FormView}
         */
        render: function(){
            var self = this,
                formConfiguration = new Form(self.context),
                formElements = formConfiguration.getValues({help:self.wizardView.assignDeviceToolTip});
            if(self.wizardView.formMode === self.wizardView.MODE_EDIT){
                //add a check box in edit workflow for user input Delete from Device:
                formElements.sections[1].elements = [{
                        "element_checkbox": true,
                        "id": "delete_from_device_id",
                        "label": this.context.getMessage('unassign_from_sd_delete_from_device'),
                        "values": [
                            {
                                "id": "delete_from_device",
                                "name": "delete-from-device",
                                "label": this.context.getMessage("enable"),
                                "checked": self.model.attributes['delete-from-device']
                            }
                        ]
                    },
                    {
                        "element_description": true,
                        class:"un_assign_warning",
                        "value": "<span class ='elementinput-ldap-server-grid'><div class='icon_warning'></div> " + this.context.getMessage("device_warning") + "</span>"
                    }
                ];
            }
            self.formWidget = new FormWidget({
                "container": self.el,
                elements: formElements
            });
            self.formWidget.build();
            // to display the warning message in a single line.
            self.$el.find('.un_assign_warning > .elementinput').addClass('elementinput-ldap-server-grid');
            self.addDeviceListBuilder();

            return self;
        },

        /**
         * title for wizard page
         * @returns Title form getMessage
         */
        getTitle: function(){
            return this.context.getMessage('user_firewall_assign_device') ;
        },
        addDeviceListBuilder: function () {
            var me = this;
            var listContainer = this.$el.find('#user_firewall_device_selector');
            listContainer.attr("readonly", "");

            me.listBuilder = new DevicesListBuilder({
                context: me.context,
                container: listContainer
            });

            me.listBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();
                me.listBuilder.setSelectedItems(me.model.get("device-list")? me.model.get("device-list")['device-lite']:[]);
            });
        },
        /**
         * builds data for summary view screen
         * @returns {Array}
         */
        getSummary: function() {
            var summary = [], self = this, selectedDevices = self.model.get("device-list")['device-lite'];
            if(selectedDevices && selectedDevices.length > 0){
                summary.push({
                    label: self.context.getMessage('user_firewall_assign_device'),
                    value: ' '
                });
                summary.push({
                    label: self.context.getMessage('devices'),
                    value: selectedDevices[0].name + (selectedDevices.length>1 ? " (+"+(selectedDevices.length -1) +")" : "")
                });

            }

            return summary;
        },
        /**
         * fetch the list of selected device form the list bulder (Fetches from server getSelected API call)
         * @param requestedStep
         * @param deviceResults
         */
        deviceGetSelectedItemsCallBack : function(requestedStep, deviceResults){
            var self = this,
                formData = Syphon.serialize(self);
            if(self.wizardView.formMode === self.wizardView.MODE_EDIT) {
                self.model.set({ "delete-from-device": formData['delete-from-device']});
            }
            self.model.set({
                "device-list": {
                    "device-lite" : deviceResults.devices.device
                }
            });
            // update the fetch selected Devices flag and then go to the requested step page.
            self.isFetchSelectedDevicesCompleted = true;
            self.wizardView.wizard.gotoPage(requestedStep);
        },
        /**
         *
         * @param currentStep
         * @param requestedStep
         * @returns {boolean}
         */
        beforePageChange: function(currentStep, requestedStep) {
            var self = this;
            // if selected device fetch is completed then move to requested page
            if(self.isFetchSelectedDevicesCompleted){
                self.isFetchSelectedDevicesCompleted = false;
                return true;
            }
            // fetch the list of selected device form the list bulder (Fetches from server getSelected API call)
            self.listBuilder.getSelectedItems($.proxy(self.deviceGetSelectedItemsCallBack, self,requestedStep));

            return false;
        }
    });
    return FormView;
});
