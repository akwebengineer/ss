/*
Creates the widget on the demo page using form values 
*/

define([
    'backbone',
    'widgets/datepicker/datepickerWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function (Backbone, DatepickerWidget,PrintModule,Clipboard) {
    var DatepickerView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
        	
            var widgetElement = $('#widget-demo');
            widgetElement.empty();
            $('#obj').find('#static-content').empty();
            widgetElement.append('<input type="text" id="datepicker_test" data-widget="datepicker">');
            var dateElement = widgetElement.find("input[data-widget='datepicker']");
            var userDate =null,
            month =[],
            day =[],
            year =[];
            //set Date
            month.push((config[1].value)? parseInt(config[1].value): null);
            day.push((config[2].value)? parseInt(config[2].value): null);
            year.push((config[3].value)? parseInt(config[3].value): null);
            //min date
            month.push((config[4].value)? parseInt(config[4].value): null);
            day.push((config[5].value)? parseInt(config[5].value): null);
            year.push((config[6].value)? parseInt(config[6].value): null);
            //max date
            month.push((config[7].value)? parseInt(config[7].value): null);
            day.push((config[8].value)? parseInt(config[8].value): null);
            year.push((config[9].value)? parseInt(config[9].value): null);
            
			var confObj = {
                dateFormat: (config[0].value)? config[0].value:null,
                container: dateElement
            };
            
            this.datepickerWidgetObj = new DatepickerWidget(confObj);
            this.datepickerWidgetObj.build();
            console.log(confObj);
            //setting the text area
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain({dateFormat:confObj.dateFormat})+"\n}" );

            // setting the copy button
            var clipboard = new Clipboard('#copyButton');
            clipboard.on('success', function(e) {
                console.info('copied');                    
            });
            clipboard.on('error', function(e) {
                console.error('Not copied');
            });

            textAreaButton.click(function(){
                
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                $('#obj').find('#static-content').empty();
                try{
                    widgetElement.empty();
                    widgetElement.append('<input type="text" id="datepicker_test" data-widget="datepicker">');
                    var dateElement = widgetElement.find("input[data-widget='datepicker']");
                    var jstr = JSON.parse(str);
                    jstr.container =dateElement;
                    console.log(jstr);
                    var datepickerWidgetObj = new DatepickerWidget(jstr);
                    datepickerWidgetObj.build();
                    
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }  
            });
            

            if(day[0]!= null && month[0] != null && year[0] != null ){
            	userDate =new Date();
            	userDate.setDate(day[0]);
            	userDate.setMonth(month[0]-1);
            	userDate.setUTCFullYear(year[0]);
            	console.log(userDate);
            	this.datepickerWidgetObj.setDate(userDate);
                $('#obj').find('#static-content').append("this.datepickerWidgetObj.setDate("+userDate+")<br>");
            }
            if(day[1]!= null && month[1] != null && year[1] != null ){
            	userDate =new Date();
            	userDate.setDate(day[1]);
            	userDate.setMonth(month[1]-1);
            	userDate.setUTCFullYear(year[1]);
            	console.log(userDate);
            	this.datepickerWidgetObj.minDate(userDate);
                $('#obj').find('#static-content').append("this.datepickerWidgetObj.minDate("+userDate+")<br>");
            }
            if(day[2]!= null && month[2] != null && year[2] != null ){
            	userDate =new Date();
            	userDate.setDate(day[2]);
            	userDate.setMonth(month[2]-1);
            	userDate.setUTCFullYear(year[2]);
            	console.log(userDate);
            	this.datepickerWidgetObj.maxDate(userDate);
                $('#obj').find('#static-content').append("this.datepickerWidgetObj.maxDate("+userDate+")<br>");
            }
            return this;
        }

    });

    return DatepickerView;
});