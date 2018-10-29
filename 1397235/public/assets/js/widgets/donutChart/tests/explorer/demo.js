/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/donutChart/donutChartWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, DonutChartWidget,PrintModule,Clipboard){
    var DonutChartView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            var donutChartElement = $('#widget-demo');
            console.log(config);
            var getStringData = function(arr){
                data =[];
                for(var ii =0;ii<arr.length; ii++){
                    data.push(arr[ii].trim().replace(/^(\'|\")/,'').replace(/(\'|\")$/,''));
                }
                //console.log(data);
                return data;
            };   
            var makeData = function(data){
            	var dataArray = [];
            	if(data != ""){
            		var pattern =/(\[\s*(\'|\")[0-9a-z\s]*(\'|\")\s*,\s*[0-9]+\s*\])(,\s*\1)*/i;
            		if(pattern.test(data)){
            			var splitData = data.split("],");
                        for(var ii =0;ii<splitData.length; ii++){
                        	//console.log(splitData[ii]);
                            var parts = splitData[ii].match(/\s*\[\s*(\'|\")([0-9a-z\s]*)(\'|\")\s*,\s*([0-9]+)\s*\]?/i);
                            dataArray.push([parts[2],parseInt(parts[4])]);
                        }
            		}
            	}
            	return dataArray;
            }         
			console.log(makeData(config[1].value));
            var options = {
                donut: {
                    name: config[0].value,
                    data: (config[1].value == "")? []:makeData(config[1].value),
                    showInLegend: (config[3])? true:false
                },
                colors: (config[2].value == "")? null: getStringData(config[2].value.split(","))
            };
  
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(options)+"\n}" );
           

            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace(' ','');
                try{
                    var jstr = JSON.parse(str);
                    var conf = {
                        container: donutChartElement,
                        options: jstr
                    }
                    //console.log(jstr);
                    var donutChartWidgetObj = new DonutChartWidget(conf);
                    donutChartWidgetObj.build();
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }
                
                
            });
            //show the button

                var clipboard = new Clipboard('#copyButton');

                clipboard.on('success', function(e) {
                    console.info('copied');                    
                });
                clipboard.on('error', function(e) {
                    console.error('Not copied');
                });
            var conf = {
                container: donutChartElement,
                options: options
            }           
            var donutChartWidgetObj = new DonutChartWidget(conf);
            donutChartWidgetObj.build();
            return this;
        }

    });

    return DonutChartView;
});
