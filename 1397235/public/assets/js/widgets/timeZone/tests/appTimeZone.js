/** 
 * A test view for running manual test using timezone widget.
 *
 * @author Jangul Aslam <jaslam@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'jquery',
    'backbone',
    'widgets/timeZone/timeZoneWidget',
    'es6!widgets/timeZone/react/tests/view/timeZoneComponentView',
    'lib/template_renderer/template_renderer',
    'text!widgets/timeZone/tests/templates/timeZoneExample.html',
], function($, Backbone, TimeZoneWidget, TimezoneComponentView, render_template, example){
  var TimeZoneView = Backbone.View.extend({

    initialize: function () {
      this.addContent(this.$el, example);
      this.timeZoneWidget = new TimeZoneWidget({'container': this.$el.find('#timezone-widget')});
      this.timeZoneComponentView = new TimezoneComponentView({$el: this.$el.find('#timezone-component')});

      !this.options.pluginView && this.render();

      return this;
    },
    
    render: function () {
      this.timeZoneWidget.build();
      this.timeZoneComponentView.render();

      return this;
    },

    addContent:function($container, template) {
        $container.append((render_template(template)));         
    }
  });

  return TimeZoneView;
});