define([
    'backbone',
    'backbone.syphon'
], function (Backbone, Syphon) {

    var JobMessageTabView = Backbone.View.extend({

        initialize: function (options) {
            var me = this;

            // set context
            me.context = options.context;
        },

        /**
         * It sets the message tab contents
         * @param rec - Row record
         * @param contents Message contents
         */
        setMessageContentsFromRecord: function (rec, contents) {
            var me = this, messageText = '', warnings,i,warningsArray;

            if (contents) {
                messageText = contents;
            } else {
                // set error message
                if (rec['error-message'] && rec['error-message'] !== "") {
                    messageText += (rec['status'] === me.context.getMessage('FAILED') ? ('<font color = "#eb2125">[' + me.context.getMessage('job_instance_error_text') + ']</font> ')
                        : "") + rec['error-message'] + '</br></br>';
                }
                // set warning message
                if (rec['warning-messages.warning-message'] && rec['warning-messages.warning-message'] !== "") {
                    warnings = rec['warning-messages.warning-message'];
                    warningsArray = warnings.split("#&&#");
                    for (i in warningsArray) {
                        messageText += '<font color = "#F8AC19">[' + me.context.getMessage('job_instance_warning_text') + '] </font>' + warningsArray[i] + '</br>';
                    }
                }
                // set other message
                if (rec['message']) {
                    messageText += rec['message'];
                }
                if (rec['rpc-response']){
                	var rpcResponse = rec['rpc-response'];
                	var rpc = rpcResponse.replace(/(&gt;\n&lt;)/g, '&gt;<br />&lt;');
                	messageText += '<div class ="rpcResponse"><span style="cursor: pointer;"><p>'+
                	me.context.getMessage('view-full-error-message') + 
                	'<u>'+
                	me.context.getMessage('click-here')
                	+'</u></p></span></div><div class ="rpcDisplay" style="display:none">'+
                	rpc
                	'</div>';
                }
            }

            if(!messageText) {
                messageText = me.context.getMessage('job_no_message_text');
            }

            // add the message to the tab body
            me.$el.html('<div>' + messageText + '</div>');
            
            $(".rpcResponse").click(function(){
                $(".rpcDisplay").hide();
            });
            $(".rpcResponse").click(function(){
                $(".rpcDisplay").show();
            });
        }


    });

    return JobMessageTabView;
});