/**
 * A view that uses a declarative form to render Time widget with in.
 * Validator library to validate the time
 *
 * @module TimeView
 * @author Jangul Aslam <jaslam@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/time/timeWidget',
    'text!widgets/time/tests/templates/declarativeTime.html',
    'widgets/form/formValidator'
], function (Backbone, TimeWidget, DeclarativeTemplate, FormValidator) {
    /**
     * Constructs a TimeView
     */
    var TimeView = Backbone.View.extend({

        events:{
            'click #setTime': 'setTime',
            'click #setPeriod': 'setPeriod',
            'click #setValue': 'setValue',
            'click #getValue': 'getValue'
        },

        initialize: function () {
            this.render();
        },

        render: function () {
            var form = this.$el.append(DeclarativeTemplate);
            this.timeWidget = new TimeWidget({
                "container": this.$el.find('#time_declarative'),
                "value" : "10:10:10", // instantiate widget with a given time,
                "label" : false // do not show the label on UI
            }).build();
            new FormValidator().validateForm(form);
            return this;
        },

        setTime: function(){
            this.timeWidget.setTime("11:11:11");
        },

        setPeriod: function(){
            this.timeWidget.setTimePeriod("AM");
        },

        setValue: function(){
            this.timeWidget.setValue("09:09:09 PM");
        },

        getValue: function(){
            console.log(this.timeWidget.getTime());
        }
    });

    return TimeView;
});