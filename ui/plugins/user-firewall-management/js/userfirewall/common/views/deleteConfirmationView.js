/**
 * A form with a job information for generic use.
 *
 * @module jobInformationFrom
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'backbone.syphon',
    'widgets/confirmationDialog/confirmationDialogWidget'
], function (Backbone, FormWidget, Syphon, ConfirmationDialog) {

    var JobInformationFrom = Backbone.View.extend({

        events: {
            'click #delete': "submit",
            'click #close_delete_view': "closeView"
        },

        initialize: function(options) {
            this.conf = options;
            this.context = this.conf.context;
            this.question = this.conf.question;
            this.title = this.conf.title;
            this.callBack = this.conf.callBack;
        },
        /**
         *
         * @returns {JobInformationFrom}
         */
        render: function() {
            var formElements = {
                "title": this.title,
                "form_id": "delete-confirmation-form",
                "form_name": "delete-confirmation-form",
                "on_overlay": true,
                "sections": [
                    {
                        "section_id": "delete-confirmation-content",
                        "elements": [
                            {
                                "label": this.context.getMessage("delete_from"),
                                "element_radio": true,
                                "id": "delete-object",
                                "values": [
                                    {
                                        "id": "delete_from_sd",
                                        "name": "delete_from_device",
                                        "label": this.context.getMessage("delete_from_sd_inventory"),
                                        "value": false,
                                        "checked": true
                                    },
                                    {
                                        "id": "delete_from_device_and_sd",
                                        "name": "delete_from_device",
                                        "label": this.context.getMessage("delete_from_device_and_sd_inventory"),
                                        "value": true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "buttonsAlignedRight": true,
                "cancel_link": {
                    "id": "close_delete_view",
                    "value": this.context.getMessage('cancel')
                },
                "buttons": [
                    {
                        "id": "delete",
                        "name": "ok",
                        "value": this.context.getMessage('ok')
                    }
                ]
            };

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();
            return this;
        },
        /**
         *
         */
        submit: function(){
            var formValue = Syphon.serialize(this);
            this.createConfirmationDialog(formValue['delete_from_device']);
        },
        /**
         *
         * @param event
         */
        closeView: function(event) {
            if (event) {
                event.preventDefault();
            }
            this.conf.activity.deleteOverlay.destroy();
        },
        /**
         *
         * @param option
         */
        createConfirmationDialog: function(deleteFromDevice) {

            var self = this;
            deleteFromDevice = (deleteFromDevice === 'true'? true:false);
            self.confirmationDialogWidget = new ConfirmationDialog({
                title: self.title,
                question: self.question + (deleteFromDevice ? self.context.getMessage('delete_warning'): ""),
                yesButtonLabel: self.context.getMessage('yes'),
                noButtonLabel: self.context.getMessage('no'),
                yesButtonCallback: function() {
                    self.callBack(deleteFromDevice);
                    self.confirmationDialogWidget.destroy();
                    self.closeView();
                },
                noButtonCallback: function() {
                    self.confirmationDialogWidget.destroy();
                },
                yesButtonTrigger: 'yesEventTriggered',
                noButtonTrigger: 'noEventTriggered',
                xIcon: true
            });

            this.confirmationDialogWidget.build();
            // custom modify the delete confirmation with red border and red button
            $('.overlayBg').addClass('user-firewall-management');
            $('.overlay-wrapper').addClass('delete-confirmation-border-red');
            $('.yesButton').addClass('delete-warning-yes-button-red');

        },
    });

    return JobInformationFrom;
});
