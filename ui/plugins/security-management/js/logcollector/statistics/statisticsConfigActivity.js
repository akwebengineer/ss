/**
 * A module that works with Log Collector Configuration
 *
 * @module StatisticsConfigActivity
 * 
 **/
define([
    'backbone',
    '../../../../ui-common/js/gridActivity.js',
    './views/logStatisticsView.js',
], function(Backbone, 
            GridActivity, 
            LogStatisticsView) {


    var LogStatisticsConfigActivity = function() {

         GridActivity.call(this);
         this.getView = function () {;
            this.view = new LogStatisticsView({
              context: this.getContext()
            });
            this.bindEvents();
            return this.view;
        };
         
        this.model = Backbone.Model.extend({ 

        });
 
    };


    LogStatisticsConfigActivity.prototype = new GridActivity();

    return LogStatisticsConfigActivity;
});