/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/progressBar/progressBarWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, ProgressBarWidget,PrintModule,Clipboard){
    var ProgressBarView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            
            var progress = 0.0;
            var time = (config[2].value == "")?15000: config[2].value ;
            var timeStep = (config[3].value == "")?300: config[3].value ;
            var progressStep = timeStep/time;
            var completionText = config[1].value;
            var progressBarElement = $('#widget-demo');
            progressBarElement.empty();
            progressBarElement.addClass("widget-box");
            $('#obj').find('#static-content').empty();
            //console.log(config);
            conf ={
                container: progressBarElement,
                statusText: config[0].value,
                hasPercentRate: (config[4].value =="determinate") ? true : false
                //hasPercentRate:true
            };
            var timeFunc = function(){ 
                    if (progress >= 1.0){
                        progressBar.setStatusText(completionText);
                        progressBar.hideTimeRemaining();
                        clearInterval(setTime);
                    }
                    progressBar.setProgressBar(progress);
                    progressBar.setTimeRemaining(time);
                    progressBar.hideTimeRemaining();
                    progress += progressStep;
                    time -= timeStep;
                    
                };
            var progressBar = new ProgressBarWidget(conf).build();
            //print the config
            
            $('#obj').css( "display", "block" );
                var objectDisplayElementTextArea = $('#obj').find('#obj-content');
                var textAreaButton = $('#obj').find('#submitButton');
                objectDisplayElementTextArea.val("");
                var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
                
                objectDisplayElementTextArea.css("height",h)
                console.log(conf);
                objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain({statusText:conf.statusText,hasPercentRate:conf.hasPercentRate})+"\n}" );
               //show the button
                
                var clipboard = new Clipboard('#copyButton');

                clipboard.on('success', function(e) {
                    console.info('copied');                    
                });
                clipboard.on('error', function(e) {
                    console.error('Not copied');
                });
                textAreaButton.click(function(){
                    var str = objectDisplayElementTextArea.val().replace('\n','').replace(' ','');
                    $('#obj').find('#static-content').empty();
                    try{
                        var jstr = JSON.parse(str);
                        
                        jstr.container =progressBarElement;
                        progressBarElement.empty();
                        $('#obj').find('#static-content').empty();
                        if(jstr.hasPercentRate){
                            progress = 0.0;
                            time = 15000 ;
                            timeStep = 300;
                            progressStep = timeStep/time;
                            completionText = "done";
                            var setTime = setInterval(timeFunc, timeStep);
                            $('#obj').find('#static-content').append("<br><span class='bold'>completionText= </span>" + completionText);
                            $('#obj').find('#static-content').append("<br><span class='bold'>time= </span>" + time);
                            $('#obj').find('#static-content').append("<br><span class='bold'>timeStep= </span>" + timeStep);
                            $('#obj').find('#static-content').append("<br><span class='bold'>progress= </span>" + progress);
                            $('#obj').find('#static-content').append("<br><span class='bold'>progressStep= </span>" + progressStep);
                            $('#obj').find('#static-content').append(new PrintModule().printObj({func:timeFunc})); 
                            $('#obj').find('#static-content').append("<br><span class='bold'>setInterval</span>(func, timeStep)");
                        }
                        var progressBar = new ProgressBarWidget(jstr).build();
                    }
                    catch(err){
                        $('#obj').find('#error').empty();
                        $('#obj').find('#error').append("error in configuration <br> widget could not update");
                    }
                    
                    
                });
            if(config[4].value =="determinate"){
                //console.log("here");
                
                var setTime = setInterval(timeFunc, timeStep);

                
                $('#obj').find('#static-content').empty();
                $('#obj').find('#static-content').append("<br><span class='bold'>completionText= </span>" + completionText);
                $('#obj').find('#static-content').append("<br><span class='bold'>time= </span>" + time);
                $('#obj').find('#static-content').append("<br><span class='bold'>timeStep= </span>" + timeStep);
                $('#obj').find('#static-content').append("<br><span class='bold'>progress= </span>" + progress);
                $('#obj').find('#static-content').append("<br><span class='bold'>progressStep= </span>" + progressStep);
                $('#obj').find('#static-content').append(new PrintModule().printObj({func:timeFunc})); 
                $('#obj').find('#static-content').append("<br><span class='bold'>setInterval</span>(func, timeStep)");
                

            }  
            return this;
        }

    });

    return ProgressBarView;
});