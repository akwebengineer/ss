/*
Creates the widget on the demo page using form values 
*/

define([
    'backbone',
    'widgets/spinner/spinnerWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, SpinnerWidget,PrintModule,Clipboard){
    var SpinnerView = Backbone.View.extend({

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            //initialization
            var progress = 0.0;
            var time = (config[2].value == "")?15000: config[2].value ;
            var timeStep = (config[3].value == "")?300: config[3].value ;
            var progressStep = timeStep/time;
            var completionText = config[1].value;
            var spinnerElement = $('#widget-demo');
            spinnerElement.addClass("widget-box");
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            conf ={
                container: spinnerElement,
                statusText: config[0].value,
                hasPercentRate: (config[4].value =="determinate") ? true : false
            };
            var timeFunc = function(){ 
                    if (progress >= 1.0){
                        spinner.setStatusText(completionText);
                        spinner.hideTimeRemaining();
                        clearInterval(setTime);
                    }
                    spinner.setSpinnerProgress(progress);
                    spinner.setTimeRemaining(time);
                    spinner.hideTimeRemaining();
                    progress += progressStep;
                    time -= timeStep;
                    
                };

            //creating spinner
            spinnerElement.empty();
            var spinner = new SpinnerWidget(conf).build();

            //the config area
            $('#obj').css( "display", "block" );
            $('#obj').find('#static-content').empty();
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;    
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain({statusText:conf.statusText,hasPercentRate:conf.hasPercentRate})+"\n}" );
            
            //button event in config area
            //copy button
            var clipboard = new Clipboard('#copyButton');
            clipboard.on('success', function(e) {
                console.info('copied');                    
            });
            clipboard.on('error', function(e) {
                console.error('Not copied');
            });
            //submit button
            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace(' ','');
                $('#obj').find('#static-content').empty();
                try{
                    var jstr = JSON.parse(str);    
                    jstr.container =spinnerElement;
                    spinnerElement.empty();
                    var spinner = new SpinnerWidget(jstr).build();
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
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    //$('#obj').find('#error').append(err);
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }            
            });

            //if spinner is determinate as selected in form 
            if(config[4].value =="determinate"){
                
                $('#obj').find('#static-content').append("<br><span class='bold'>completionText= </span>" + completionText);
                $('#obj').find('#static-content').append("<br><span class='bold'>time= </span>" + time);
                $('#obj').find('#static-content').append("<br><span class='bold'>timeStep= </span>" + timeStep);
                $('#obj').find('#static-content').append("<br><span class='bold'>progress= </span>" + progress);
                $('#obj').find('#static-content').append("<br><span class='bold'>progressStep= </span>" + progressStep);
                $('#obj').find('#static-content').append(new PrintModule().printObj({func:timeFunc})); 
                $('#obj').find('#static-content').append("<br><span class='bold'>setInterval</span>(func, timeStep)");
                
                var setTime = setInterval(timeFunc, timeStep);
                
            }  
            return this;
        }

    });

    return SpinnerView;
});
