/**
 * A view to manage firewall policy - Device page
 *
 * @module DevicesView
 * @author Vinamra <vinamra@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    '../../../../../base-policy-management/js/policy-management/devices/views/basePolicyDeviceGridView.js',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget'
], function (BasePolicyDeviceGridView, OverlayWidget, FormWidget) {

    var FirewallPolicyDeviceView = BasePolicyDeviceGridView.extend({
        getMimeType: function () {
            return 'vnd.juniper.net.firewall.devices';
        },

        initialize: function (options) {
            var self = this;

            self.activity = options.activity;

            options.actionEvents = {
                changeList: "launchBlockApplication"
            };

            this.$el.bind(options.actionEvents.changeList, function (eventName, selectedItems) {
                if ($.isEmptyObject(selectedItems) || !$.isArray(selectedItems.selectedRowIds)) {
                    return;
                }
                self.handleChangeList(selectedItems.selectedRowIds[0]);
            });

            BasePolicyDeviceGridView.prototype.initialize.call(this, options);
        },

        /**
         * Below is the dummy code that need to be removed before merging to main branch.
         * This is a fake launch point for launching the application similar to block application
         * to view the changes and perform save/publish/update
         */
        handleChangeList: function () {
            var self = this, formView;

            var formView = Backbone.View.extend({
                events: {
                    'click #ok': "submit",
                    'click #cancel': "cancel"
                },

                render: function () {
                    this.form = new FormWidget({
                        "elements": {
                            "title": 'Enter UUID',
                            "on_overlay": true,
                            "sections": [
                                {
                                    "section_id": "enter_uuid",
                                    "elements": [
                                        {
                                            "element_text": true,
                                            "id": "UUID_FIELD"
                                        }
                                    ]
                                }
                            ],
                            "cancel_link": {
                                "value": self.context.getMessage('cancel'),
                                id: 'cancel'
                            },
                            "buttons": [
                                {
                                    "name": "ok",
                                    "value": self.context.getMessage('ok'),
                                    id: 'ok'
                                }
                            ]
                        },
                        "container": this.el
                    });
                    this.form.build();
                    return this;
                },

                cancel: function (event) {
                    event.preventDefault();

                    self.overlay.destroy();
                },

                submit: function (event) {
                    event.preventDefault();
                    self.overlay.destroy();
                    self.handleUUID(this.$el.find('input')[0].value);
                }
            });

            self.overlay = new OverlayWidget({
                view: new formView(),
                type: 'small'
            });
            self.overlay.build();
        },

        /**
         * Actual code begins here
         *
         * @param uuid
         */
        handleUUID: function (uuid) {
            var self = this, input, intent;
            input = {
                blockHeader: "View Change List",
                UUID: uuid,
                selectedApplications: [],
                selectedUsers: [],
                sourceValues: []
            };
            onAnalysisComplete = function(resultCode, jobId) {
                console.log('******************* Rule Analysis Complete *******************');
                console.log(jobId);
            }

            intent = new Slipstream.SDK.Intent('slipstream.intent.action.ACTION_RULES_CHANGELIST', {
                mime_type: 'vnd.juniper.net.firewall.rules.changelist'
            });
            intent.putExtras(input);
            self.activity.context.startActivityForResult(intent, $.proxy(onAnalysisComplete, self));

        }
    });

    return FirewallPolicyDeviceView;
});
