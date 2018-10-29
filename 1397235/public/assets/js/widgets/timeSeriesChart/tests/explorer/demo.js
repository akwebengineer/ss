/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, TimeSeriesChartWidget,PrintModule,Clipboard){
    var TimeSeriesChartView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            var timeSeriesChartElement = $('#widget-demo')
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
            var getPoints = function(points){
            	var pointArray = [];
            	if(points != ""){
            		var splitPoint = points.split("],");
            		for(var ii = 0; ii<splitPoint.length; ii++){
            			var parts = splitPoint[ii].match(/\[([0-9\.]+),\s*([0-9\.]+)\]?/i);
            			pointArray.push(getFloatData([parts[1],parts[2]]));
            		}
            	}
            	return pointArray;
            }
            var makeData = function(data){
                var dataArray = [];
                if(data != ""){
                    var pattern =/^(\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\"),\s*points:\s*\[(\[[0-9\.]+,\s*[0-9\.]+\](\s*,\[[0-9\.]+,\s*[0-9\.]+\])*)\]\s*\})(,\s*\1)*/i;
                    if(pattern.test(data)){
                        var splitData = data.split("},");
                        for(var ii =0;ii<splitData.length; ii++){
                        	//console.log(splitLine[ii]);
                            var parts = splitData[ii].match(/^\s*\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\"),\s*points:\s*\[(\[[0-9\.]+,\s*[0-9\.]+\](\s*,\[[0-9\.]+,\s*[0-9\.]+\])*)\]\s*\}?/i);
                            //console.log(parts);
                            dataArray.push({name:parts[2],color:parts[5],points:getPoints(parts[7])});
                        }
                    }
                }
                return dataArray;
            };  

           //console.log(makeData(config[4].value));
            var options = {
                title: config[0].value,
                yAxisTitle: config[1].value,
                yAxisThreshold: {
                    value: config[2].value,
                    color: (config[3].value == "")? []: getStringData(config[3].value.split(","))
                },
                timeRangeSelectorEnabled: (config[4] && config[4].name == "trSelector") ? true : false,
                presetTimeRangesEnabled: ( config[5] || (config[4] && config[4].name =="ptRanges")) ? true : false,
                data: makeData(config[4].value)
            };
            console.log(options);
            var conf = {
                container: timeSeriesChartElement,
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
                        container: timeSeriesChartElement,
                        options: jstr
                    }
                    var timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
            		timeSeriesChartWidgetObj.build(); 
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
            var timeSeriesChartWidgetObj = new TimeSeriesChartWidget(conf);
            timeSeriesChartWidgetObj.build();        
            return this;
        }

    });

    return TimeSeriesChartView;
});