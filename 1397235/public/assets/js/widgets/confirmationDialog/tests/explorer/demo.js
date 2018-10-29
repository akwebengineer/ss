/*
Creates the widget on the demo page using form values 
*/

define([
    'backbone',
    'widgets/confirmationDialog/confirmationDialogWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, ConfirmationDialogWidget,PrintModule,Clipboard){
    var ConfirmationDialogAppView = Backbone.View.extend({

        initialize: function (config) {
            
            var self = this;

            // use either the callback or the trigger. Here both are used only as an example
            var yesButtonCallback = function(doNotShowAgain) {
                
                self.confirmationDialogWidget.destroy();
            };

            var noButtonCallback = function() {
                
                self.confirmationDialogWidget.destroy();
            };

            var cancelLinkCallback = function() {
                
                self.confirmationDialogWidget.destroy();
            };

            var conf = {
                title: (config) ? config[0].value: "Test Confirmation Dialog",
                question: (config) ? config[1].value: "Are you sure you want to do this?",
                yesButtonLabel: (config) ? config[2].value: "Yes",
                noButtonLabel: (config) ? config[3].value: "No",
                cancelLinkLabel: 'Cancel',
                kind: (config[4] && config[4].name == "checkbox_warning") ? 'warning': 'null',
                doNotShowAgainMessage: 'Do not show this message again',
                xIcon: ( config[5] || (config[4] && config[4].name =="checkbox_xIcon")) ? true : false
                
            };

             $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            
            objectDisplayElementTextArea.css("height",h)
            //console.log(typeof h);
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(conf)+"\n}" );


            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace(' ','');
                try{
                    var jstr = JSON.parse(str);
                    jstr.yesButtonCallback = yesButtonCallback;
                    jstr.noButtonCallback = noButtonCallback;
                    jstr.cancelLinkCallback = cancelLinkCallback;
                    var confirmationDialogWidget = new ConfirmationDialogWidget(jstr);
                    confirmationDialogWidget.build();
 
                }
                catch(err){
                    //$('#obj').find('#error').append(err);
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

            conf.yesButtonCallback = yesButtonCallback;
            conf.noButtonCallback = noButtonCallback;
            conf.cancelLinkCallback = cancelLinkCallback;
            this.confirmationDialogWidget = new ConfirmationDialogWidget(conf);


            this.render();
        },

        render: function () {

            this.confirmationDialogWidget.build();

            return this;
        }
    });

    return ConfirmationDialogAppView;
});