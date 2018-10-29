/**
 * A set of views generated from the form widget and its configuration object to be used in the accordion widget
 *
 * @module AccordionItemView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/accordion/tests/conf/formConfiguration',
    'widgets/form/formWidget'
], function (Backbone, formConfiguration, FormWidget) {

    var AccordionItemView = {};

    var addContent = function (context, contentConfiguration) {
        var configuration = contentConfiguration;
        if (_.isFunction(contentConfiguration)) {
            configuration = contentConfiguration (context.options.inputId);
        }
        configuration = _.extend({
            "form_id": context.options.formId
        }, configuration);
        var events = {
            "validated": {
                "handler": [context.options.updateSaveButton]
            }
        };
        var form = new FormWidget({
            "elements": configuration,
            "container": context.$el,
            "events": events
        }).build();
        return form;
    };

    var updateState = function (form, originalValues) {
        if (form.isValidInput()) {
            if (!_.isEqual(form.getValues(), originalValues)) {
                return {
                    icon: "configured",
                    state: "configured",
                    tooltip: "View state: Section configured"
                };
            } else {
                return {
                    icon: "unconfigured",
                    state: "unconfigured",
                    tooltip: "View state: Item unconfigured"
                };
            }
        }
        return {
            icon: "critical_alert",
            state: "error",
            tooltip: "View state: Some errors were found"
        };
    };

    var updateDescription = function (values) {
        var description = '';
        values.forEach(function (elementValue) {
            if (elementValue.value) {
                description += elementValue.name + ": " + elementValue.value + ", ";
            }
        });
        if (description) {
            return description.slice(0, -2);
        }
        return "Section was not updated";
    };

    AccordionItemView.view1 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form1);
            this.values = this.form.getValues();
            return this;
        },
        updateDescription: function () {
            var values = this.form.getValues(),
                updatedDescription = updateDescription(values);
            if (updateDescription(values)) {
                return updatedDescription;
            }
        },
        updateState: function () {
            return updateState(this.form, this.values);
        },
        getValues: function () {
            if(this.form && this.form.isValidInput()) {
                return this.form.getValues(true);
            }
        }
    });

    AccordionItemView.view2 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form2);
            this.values = this.form.getValues();
            return this;
        },
        updateDescription: function () {
            var values = this.form.getValues(),
                updatedDescription = updateDescription(values);
            if (updateDescription(values)) {
                return updatedDescription;
            }
        },
        updateState: function () {
            return updateState(this.form, this.values);
        },
        getValues: function () {
            if(this.form && this.form.isValidInput()) {
                return this.form.getValues(true);
            }
        }
    });

    AccordionItemView.view3 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form3);
            this.values = this.form.getValues();
            return this;
        },
        updateDescription: function () {
            var values = this.form.getValues(),
                updatedDescription = updateDescription(values);
            if (updateDescription(values))
                return updatedDescription;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        },
        getValues: function () {
            if(this.form && this.form.isValidInput()) {
                return this.form.getValues(true);
            }
        }
    });

    AccordionItemView.view4 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form4);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view5 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form5);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view6 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form6);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view7 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form8);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view8 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form7);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view9 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form9);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view10 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form10);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.view11 = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.form11);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    AccordionItemView.dynamic = Backbone.View.extend({
        render: function () {
            this.form = addContent(this, formConfiguration.dynamicSection);
            this.values = this.form.getValues();
            return this;
        },
        updateState: function () {
            return updateState(this.form, this.values);
        }
    });

    return AccordionItemView;
});