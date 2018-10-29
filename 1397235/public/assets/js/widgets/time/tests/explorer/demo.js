/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/time/timeWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function (Backbone, TimeWidget,PrintModule,Clipboard) {
    
    var TimeView = Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {
        	var WidgetElement = $('#widget-demo');
            WidgetElement.append("<form class='form-pattern'><div id='time'></div></form>");
            timeElement = WidgetElement.find("#time")
        	timeElement.empty();
        	var conf = {
        		container : timeElement
        	};
            this.time = new TimeWidget(conf).build();

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
        }
    });

    return TimeView;
});
