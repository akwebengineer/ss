/**
 * Created by ramesha on 11/6/15.
 */
define(
    [
        'backbone',
        'widgets/form/formWidget',
        '../../../ui-common/js/views/apiResourceView.js',
        '../conf/alarmEventsDetailedConfiguration.js',
        'widgets/grid/gridWidget',
        '../models/alarmsModel.js'
    ],
    function(Backbone, FormWidget, ResourceView, alarmEventsDetailedConfiguration,
              GridWidget, AlarmsModel) {

        var alarmEventsView = ResourceView.extend({
            events: {
                'click #sd-alarm-cancel': "cancel"
            },
            initialize: function(options) {

                this.activity = options.activity;
                this.context = options.activity.context;
                this.model = options.model;
                this.selectedRows = this.model.selectedRows;
            },
               /**
                 * Populating Event Details into the form
                 */
            render: function() {
                var me = this,eventId,i,l,
                formConfiguration = new alarmEventsDetailedConfiguration(this.context),
                formElements = formConfiguration.getValues();
                me.alarmEventValues = {};
                eventId = this.model.eventId;

                for(i=0; l= this.model.attributes.events.events.length, i<l;i++){
                    if(eventId === this.model.attributes.events.events[i].eventId) {
                        me.alarmEventValues = this.model.attributes.events.events[i];
                    }
                }
                for (i=0; l = me.alarmEventValues.attributes.length,i<l ;i++){
                    me.alarmEventValues.attributes[i].eventName = me.alarmEventValues.name;
                    var dynamicElements =  {
                          "element_description": true,
                          "name":  "name",
                          "label": me.alarmEventValues.attributes[i].name,
                          "class": "eventClass",
                          "value":  me.alarmEventValues.attributes[i].value
                    };
                    formElements.sections[0].elements.push(dynamicElements);

                    me.form = new FormWidget({
                         "container": this.el,
                         "elements": formElements,
                         "values": me.alarmEventValues.attributes[i]
                    });
            }
                   me.form.build();
              return me;
            },
            /**
             * Called when Cancel button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function(event) {
                event.preventDefault();
                this.activity.activity.overlay.destroy();
            }
        });

        return alarmEventsView;

    }
);
