/*
Creates the widget on the demo page using form values 
*/

define([
    'backbone',
    'widgets/lineChart/lineChartWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, LineChartWidget,PrintModule,Clipboard){
    var LineChartView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            var lineChartElement = $('#widget-demo');
            lineChartElement.empty();
            console.log(config);
            var getStringData = function(arr){
                var data =[];
                for(var ii =0;ii<arr.length; ii++){
                    data.push(arr[ii].trim().replace(/^(\'|\")/,'').replace(/(\'|\")$/,''));
                }
                //console.log(data);
                return data;
            }; 
            var getFloatData = function(arr){
                var data =[];
                for(var ii =0;ii<arr.length; ii++){
                    data.push(parseFloat(arr[ii]));
                }
                //console.log(data);
                return data;
            };
            var makeLine = function(line){
                var lineArray = [];
                if(line != ""){
                    var pattern =/^(\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*data:\s*\[([0-9\.]+(,\s*[0-9\.]+)*)\]\s*\})(,\s*\1)*/i;
                    if(pattern.test(line)){
                        var splitLine = line.split("},");
                        for(var ii =0;ii<splitLine.length; ii++){
                        	//console.log(splitLine[ii]);
                            var parts = splitLine[ii].match(/^\s*\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*data:\s*\[([0-9\.]+(,\s*[0-9\.]+)*)\]\}?/i);
                            //console.log(getIntData(parts[4].split(",")));
                            lineArray.push({name:parts[2],data:getFloatData(parts[4].split(","))});
                        }
                    }
                }
                return lineArray;
            };
            //console.log(makeLine(config[6].value));
            var options = {
            	title:config[0].value,
                xAxisTitle: config[1].value,
                yAxisTitle: config[2].value,
                categories: (config[4].value == "")? []: getStringData(config[4].value.split(",")),
                maxLabelSize: config[3].value,
                colors:(config[5].value == "")? null: getStringData(config[5].value.split(",")),
                legend: {
                    enabled: (config[7].value == "notEnabled")? false : true,
                    position: (config[7].value == "enabledB")? 'bottom' :'right' 
                },
                markers: {
                    enabled: (config[8] && config[8].name == "enabled") ? true : false,
                    multiple: ( config[9] || (config[8] && config[8].name =="multiple")) ? true : false //multiple marker symbols eg. circle, square, triangle
                },
                // Line chart data
                lines: (config[6].value == "")? []:makeLine(config[6].value),
            };
            //console.log(options);
            var conf = {
                container: lineChartElement,
                options: options
            }
       
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
                        container: lineChartElement,
                        options: jstr
                    }
                    var lineChartWidgetObj = new LineChartWidget(conf);
                    lineChartWidgetObj.build();
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
            var lineChartWidgetObj = new LineChartWidget(conf);
            lineChartWidgetObj.build();

            return this;
        }

    });

    return LineChartView;
});
