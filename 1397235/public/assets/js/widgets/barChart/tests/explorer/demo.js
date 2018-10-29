/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/barChart/barChartWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, BarChartWidget,PrintModule,Clipboard){
    var BarChartView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            var barChartElement = $('#widget-demo');
            //console.log(config[11].value);
            var getIntData = function(arr){
                var data =[];
                for(var ii =0;ii<arr.length; ii++){
                    data.push(parseInt(arr[ii]));
                }
                //console.log(data);
                return data;
            };
            var getStringData = function(arr){
                var data =[];
                for(var ii =0;ii<arr.length; ii++){
                    data.push(arr[ii].trim().replace(/^(\'|\")/,'').replace(/(\'|\")$/,''));
                }
                //console.log(data);
                return data;
            };            
            var makeLegend = function(legend){
                var legendArray = [];
                if(config[0].value == "staked-bar"){
                    return [];
                }
                if(legend != ""){
                    var sPattern = /^[0-9a-zA-Z\s]+(,\s*[0-9a-zA-Z\s]+)*$/;
                    var cPattern = /^(\{\s*name:\s*(\'|\")[0-9a-z\s]+(\'|\"),\s*color:\s*(\'|\")#?[0-9a-z\s]+(\'|\")\})(,\s*\1)*/i;
                    if(sPattern.test(legend)){
                        //simple comma seperated values
                        var splitLegend = legend.split(",")                       
                        for(var ii =0;ii<splitLegend.length; ii++){
                            legendArray.push({name:splitLegend[ii]});
                        }
                    }
                    else if(cPattern.test(legend)){
                        //{name:"some":color:"some"},{...}... pattern
                        var splitLegend = legend.split("},")
                        for(var ii =0;ii<splitLegend.length; ii++){
                            var parts = splitLegend[ii].match(/\s*\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\")\}?/i);
                            legendArray.push({name:parts[2],color:parts[5]});
                        }
                    }

                }
                return legendArray;
            };

            var makeData = function(data){
                var dataArray = [];
                if(config[0].value == "stacked-bar"){
                    var sbPattern =/^(\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\"),\s*y:\s*\[([0-9]+(,\s*[0-9]+)*)\]\s*\})(,\s*\1)*/i;
                    if(sbPattern.test(data)){
                        var splitData = data.split("},");
                        for(var ii =0;ii<splitData.length; ii++){
                            var parts = splitData[ii].match(/^\s*\{\s*name:\s*(\'|\")([0-9a-z\s]+)(\'|\"),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\"),\s*y:\s*\[([0-9]+(,\s*[0-9]+)*)\]\}?/i);
                            dataArray.push({name:parts[2],color:parts[5],y:getIntData(parts[7].split(","))});
                        }
                    }
                    return dataArray;
                }
                if(data != ""){
                    var sPattern = /^[0-9]+(,\s*[0-9]+)*$/;
                    var cPattern = /^(\{\s*y:\s*[0-9]+,\s*color:\s*(\'|\")#?[0-9a-z\s]+(\'|\")\})(,\s*\1)*/i;
                    var tPattern = /^(\{\s*y:\s*[0-9]+,\s*threshold:\s*\{\s*values:\s*\[([0-9]+(,\s*[0-9]+)*)?\],\s*colors:\s*\[((\"|\')#?[0-9a-z\s]+(\"|\')(,\s*(\"|\')#?[0-9a-z\s]+(\"|\'))*)?\]\}\})(,\s*\1)*/i;
                    if(sPattern.test(data)){
                        //simple comma seperated values
                        var splitData = data.split(",") ;                      
                        dataArray= getIntData(splitData);
                    }
                    else if(cPattern.test(data)){
                        //{y:some:color:"some"},{...}... pattern
                        var splitData = data.split("},");
                        for(var ii =0;ii<splitData.length; ii++){
                            var parts = splitData[ii].match(/\s*\{\s*y:\s*([0-9]+),\s*color:\s*(\'|\")(#?[0-9a-z\s]+)(\'|\")\}?/i);
                            dataArray.push({y:parseInt(parts[1]),color:parts[3]});
                        }
                    }
                    else if(tPattern.test(data)){
                        //{y:some:threshold:{value:[...],color[..]}},{...}... pattern
                        var splitData = data.split("},");
                        //console.log(splitData.length);
                        for(var ii =0;ii<splitData.length; ii++){
                            var parts = splitData[ii].match(/^\s*\{\s*y:\s*([0-9]+),\s*threshold:\s*\{\s*values:\s*\[([0-9]+(,\s*[0-9]+)*)?\],\s*colors:\s*\[((\"|\')#?[0-9a-z\s]+(\"|\')(,\s*(\"|\')#?[0-9a-z\s]+(\"|\'))*)?\]\}\}?/i);
                            //console.log(getStringData(parts[4].split(",")));
                            dataArray.push({y:parseInt(parts[1]),threshold:{values:(parts[2])?getIntData(parts[2].split(",")):[], colors:(parts[4])?getStringData(parts[4].split(",")):[]}});
                        }
                    }
                }
                return dataArray;
            };
            console.log(makeData(config[10].value));
            

            var options = {
                type: config[0].value,
                title: config[1].value,
                xAxisTitle: config[2].value,
                yAxisTitle: config[3].value,
                yAxisThreshold:(config[12].value == "")? []:getIntData(config[12].value.split(",")),
                yAxisLabelFormat: config[4].value,
                maxLabelSize: config[5].value,
                height: (config[6].value == "") ? null : config[6].value,
                width: (config[7].value == "") ? null : config[7].value,
                categories: (config[8].value == "")? []: getStringData(config[8].value.split(",")) ,
                tooltip: config[9].value.split(","),
                data: (config[10].value == "")? []:makeData(config[10].value),
                legend:(config[11].value == "")? []: makeLegend(config[11].value),
                color: config[13].value
            };

            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(options)+"\n}" );


            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                try{
                    var jstr = JSON.parse(str);
                    var conf = {
                        container: barChartElement,
                        options: jstr
                    }
                    var barChartWidgetObj = new BarChartWidget(conf);
                    barChartWidgetObj.build();
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
                container: barChartElement,
                options: options
            }
            var barChartWidgetObj = new BarChartWidget(conf);
            barChartWidgetObj.build();
            return this;
        }

    });

    return BarChartView;
});