/**
 * Created by ramesha on 11/3/15.
 */
define(
    [
        'backbone',
        'widgets/form/formWidget',
        '../../../ui-common/js/views/apiResourceView.js',
        '../conf/alarmDetailedConfiguration.js',
        'widgets/grid/gridWidget',
        '../conf/alarmGridDetailsConfiguration.js',
        'widgets/overlay/overlayWidget',
        './alarmsGridView.js'
    ],
    function(Backbone, FormWidget, ResourceView, AlarmDetailedConfiguration,GridWidget, AlarmDetailsGridConf, OverlayWidget,AlarmsDetailView) {

        var AlarmsDetailsView = ResourceView.extend({
            events: {
                 'click #sd-alarm-cancel': "cancel"
            },

            initialize: function(options) {

                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.model = options.model;

                this.successMessageKey = 'alarm_create_success';
                this.editMessageKey = 'alarm_edit_success';
                this.fetchErrorKey = 'alarm_fetch_error';
                this.fetchCloneErrorKey = 'alarm_fetch_clone_error';

                this.formMode=this.MODE_VIEW_GROUP;
                this.selectedRows = this.model.id;
            },
             render: function() {
                var me = this,
                 formConfiguration = new AlarmDetailedConfiguration(this.context),
                 formElements = formConfiguration.getValues(),
                 severity = this.model.attributes.alarmDetail.severity;
                 utcTime = this.model.attributes.alarmDetail.lastUpdated;
                 me.getSeverity(severity);
                 me.getLocalTime(utcTime);


                 me.appSigflatValues = this.model.attributes.alarmDetail;
                 me.form = new FormWidget({
                        "container": this.el,
                        "elements": formElements,
                        "values": me.appSigflatValues
                 });

                me.form.build();
                me.createAlarmEventsGrid();
                this.$el.find(".grid-widget").show();
              return me;
            },
            getSeverity : function(severity){
                switch(severity){
                case 1:
                    this.model.attributes.alarmDetail.severity = this.context.getMessage('alarms_severity_info');
                    break;
                case 2:
                    this.model.attributes.alarmDetail.severity = this.context.getMessage('alarms_severity_minor');
                    break;
                case 3:
                    this.model.attributes.alarmDetail.severity = this.context.getMessage('alarms_severity_major');
                    break;
                case 4:
                    this.model.attributes.alarmDetail.severity = this.context.getMessage('alarms_severity_critical');
                    break;
            }
            },
           getLocalTime : function(utcTime){
              this.model.attributes.alarmDetail.lastUpdated =  new Date(utcTime).toLocaleString();
            },
            /**
             *
             *Creating Alarm Events grid with elements and Action Events
             *
             *
             * */

            createAlarmEventsGrid: function() {
                var alarmGridContainer = this.$el.find('#alarm-events-grid'),
                    alarmDetailsGridConf = new AlarmDetailsGridConf(this.context);

                this.alarmEventsGrid = new GridWidget({
                    container: alarmGridContainer,
                    elements: alarmDetailsGridConf.getValues(this.model.id),
                    actionEvents: alarmDetailsGridConf.getEvents()
                }).build();

                alarmGridContainer.find("#alarm-events-grid").addClass("elementinput-long");
            //    alarmGridContainer.find('.grid-widget').unwrap();
                this.bindEvents(alarmDetailsGridConf.getEvents());
           },
             /**
                 *
                 *Binding Events for the grid
                 *
                 *
                 * */

           bindEvents: function(definedEvents) {

             if (definedEvents.quickViewEvent) {
                 this.$el.bind(definedEvents.quickViewEvent, $.proxy(this.showDetailsViewAction, this));
             }
           },
          /**
            *
            *Building Overlay for Events [showDetailsViewAction]
            *
            *
            * */

           showDetailsViewAction: function(e,row) {
               var self = this,model = this.model,view,onFetch,onError,
               intent = self.activity.createNewIntent(this.activity.getIntent(), self.activity.intent.action),
               id = this.model.id;
               this.model.url = this.model.urlRoot+'/'+id+'/events';
               this.model.eventId = row.selectedRows[0].eventId;

               view = new AlarmsDetailView({
                   activity: self,
                   model: model
               });
               onFetch = function() {
                   self.activity.buildOverlay(view, {"size": "large"});
               };
               onError = function() {
                   console.log('failed fetch');
                   view.notify('error', self.activity.getContext().getMessage(view.fetchErrorKey));
               };
               model.fetch({
                   success: onFetch,
                   error: onError
               });
           },
            /**
             * Called when Cancel button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function(event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            }
        });
        return AlarmsDetailsView;

    }
);
