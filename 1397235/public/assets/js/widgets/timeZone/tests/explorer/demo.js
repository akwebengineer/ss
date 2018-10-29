/*
Creates the widget on the demo page using form values 
*/

define([
    'jquery',
    'backbone',
    'widgets/timeZone/timeZoneWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function($, Backbone, TimeZoneWidget,PrintModule,Clipboard){
  var TimeZoneView = Backbone.View.extend({

 
    initialize: function () {
    	var widgetElement = $('#widget-demo');
      widgetElement.empty();
      var inside = '<form id="my_form" class="form-pattern">\
          <div class="row" id="main-sample-content">\
            <div class="elementlabel left">\
              <label class="left inline required">TimeZone</label>\
            </div>\
            <div class="elementinput left styleselect">\
              <div id="time">\
              </div>\
            </div>\
          </div>\
        </form>'
        widgetElement.append(inside);
      var  timeZoneElement = widgetElement.find("#time");
    	var conf ={
    		container: timeZoneElement
    	};
     	this.timeZoneWidget = new TimeZoneWidget(conf);
      	this.render();
      	
        //the config area
          $('#obj').css( "display", "block" );
          $('#obj').find('#obj-content').css( "display", "none" );
          $('#obj').find('#submitButton').css( "display", "none");
          $('#obj').find('#copyButton').css( "display", "none");
          $('#obj').find('.section_description').css( "display", "none");
          $('#obj').find('#static-content').empty();
          $('#obj').find('#static-content').append("conf={");
          $('#obj').find('#static-content').append(new PrintModule().printObj({container:"#time"})); 
          $('#obj').find('#static-content').append("<br>}");
      return this;
    },

    render: function () {
      this.timeZoneWidget.build();
      return this;
    }
  });

  return TimeZoneView;
});