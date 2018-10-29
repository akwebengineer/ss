/**
 * A form with a progress bar for generic use
 *
 * @module progressBarForm
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/progressBar/progressBarWidget'
], function (Backbone, FormWidget, ProgressBarWidget) {
    var defaultConf = {
        title: '',
        statusText: ''
    };

    var ProgressBarForm = Backbone.View.extend({
        initialize: function(options) {
            this.conf = _.extend(defaultConf, options);
            this._progressBar = null;
            this.close = this.conf.close;
        },
        render: function() {
            var formElements = {
                    "title": this.conf.title,
                    "form_id": "progress-form",
                    "form_name": "progress-form",
                    "on_overlay": true,
                    "sections": [
                        {
                            "section_id": "progress-bar",
                            "section_class": "progress-bar",
                            "elements": [
                            ]
                        }
                    ]
            };

            // Adding buttons to progress form if required
            if (this.conf.buttons) {
                formElements.buttonsAlignedRight = true;
                formElements.buttonsClass = "buttons_row";
                formElements.buttons = this.conf.buttons;
            }

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();
            this.$el.addClass("security-management");

            this.conf.container = this.$el.find("#progress-bar");
            this._progressBar = new ProgressBarWidget(this.conf).build();

            return this;
        },
        setStatusText: function(text) {
            if (this._progressBar) {
                this._progressBar.setStatusText(text);
            }
        },
        destroy: function() {
            if (this._progressBar) {
                this._progressBar.destroy();
            }
        }
    });

    return ProgressBarForm;
});
