/**
 * A module that works with Alarms
 *
 * @module AlarmsActivity
 * @author Dharma<adharmendran@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    '../../ui-common/js/gridActivity.js',
    './conf/alarmsGridConfig.js',
    './models/alarmsModel.js',
    './views/alarmsView.js'
], function(GridActivity, GridConfiguration, Model,View) {
    /**
     * Constructs an AlarmsActivity.
     */
    var AlarmsActivity = function() {

        this.capabilities = {
          "showDetailView":
              {
                  view:View,
                  "size":"wide"
              }
        };
        this.gridConf = GridConfiguration;
        this.model = Model;
    }

    AlarmsActivity.prototype = new GridActivity();

    return AlarmsActivity;
});