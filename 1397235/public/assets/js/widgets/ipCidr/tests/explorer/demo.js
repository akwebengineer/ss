/*
Creates the widget on the demo page using form values 
*/

define([
    'backbone',
    'widgets/form/formWidget',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone,  FormWidget,PrintModule,Clipboard){
    var IpCidrFormWidgetView = Backbone.View.extend({


        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
        	var element = {
		        "form_id": "ip_cidr_test_form",
		        "form_name": "ip_cidr_test_form",
		        "err_div_id": "errorDiv",
		        "err_div_message": "One or more fields have errors. Update the fields highlighted below. For detailed information on possible values see",
		        "err_div_link":"http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html",
		        "err_div_link_text":"Configuring Basic Settings",
		        "err_timeout": "1000",
		        "valid_timeout": "5000",
		        "sections": [
		            {
		                "elements": [
		                    
		                    {
		                    	"element_ipCidrWidget": true,
		                    	"label": config[0].value,
						        "id": config[1].value,
						        "name": config[2].value,
						        "ip_placeholder": config[3].value,
						        "ip_value": config[4].value,
						        "ip_required": (config[19])? true :false,
						        "ip_tooltip": config[5].value,
						        "ip_error": config[6].value,
						        "cidr_label": config[7].value,
						        "cidr_id": config[8].value,
						        "cidr_name": config[9].value,
						        "cidr_placeholder": config[10].value,
						        "cidr_value": config[11].value,
						        "cidr_error": config[12].value,
						        "subnet_label": config[13].value,
						        "subnet_id": config[14].value,
						        "subnet_name": config[15].value,
						        "subnet_placeholder": config[16].value,
						        "subnet_value": config[17].value,
						        "subnet_error": config[18].value
		                    }

		                ]
		            }
		        ]
		    };
		    //console.log(element);
            var values = {};
            var ipCidrElement = $('#widget-demo');
            this.form = new FormWidget({
                "elements": element,
                "values": values,
                "container": ipCidrElement
            });

            this.form.build();
            

            //Configuration part
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ; 
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(element.sections[0].elements[0])+"\n}" );


            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                try{
                    var jstr = JSON.parse(str);
                    element.sections[0].elements[0] = jstr;
                    var form = new FormWidget({
		                "elements": element,
		                "values": values,
		                "container": ipCidrElement
		            });
                    form.build();
                    //console.log(element);
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }
                
                
            });
            //copy the button
            var clipboard = new Clipboard('#copyButton');
            clipboard.on('success', function(e) {
                console.info('copied');                    
            });
            clipboard.on('error', function(e) {
                console.error('Not copied');
            });

            return this;
        }

    });




    return IpCidrFormWidgetView;
});