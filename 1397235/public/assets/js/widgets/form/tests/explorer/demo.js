define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/form/tests/explorer/formConf',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, FormWidget,formConf,PrintModule,Clipboard){
    var FormView = Backbone.View.extend({

        events: {
            "click #generate": "generate"
        },

        initialize: function (config) {
            this.render(config);
        },

        render: function (config) {
            var formElement = $('#widget-demo');
            var getButtons = function(){
                var buttons = [];
                    switch(config.form_button){
                        case "button_right":
                        case "button_left":
                            buttons = formConf.button1;
                            break;
                        case "button_active":
                            buttons.push(formConf.button2[0]);
                            break;
                        case "button_inactive":
                            buttons.push(formConf.button2[1]);
                            break;
                        default:
                            break;
                    }
                return buttons;
            };
            var getElements = function(){
                var elements =[];
                var type = "";
                for(prop in config){
                    if(prop.startsWith("element_type")){
                        type=config[prop];
                        elements.push(formConf.element[type]); 
                    }
                }
                return elements;
            };
            var getSections = function(){
                section = [];
                switch(config.form_section){
                    case "section_standard":
                        section.push(formConf.section[0]);
                        break;
                    case "section_toggle":
                        section.push(formConf.section[1]);
                        break;
                    case "section_collapsible":
                        section.push(formConf.section[2]);
                        break;
                    case "section_custom":
                        var sec = formConf.section[3];
                        sec.elements = getElements();
                        section.push(sec);
                    default:
                        break;
                }
                return section;
            };
            var element = {
                "title": config.form_title,
                "form_id": (config.form_id == "")? "fid1": config.form_id,
                "form_name": config.form_name,
                "title-help": {
                    "content": config.form_help,
                    "ua-help-identifier": "alias_for_title_ua_event_binding"
                },
                "err_div_id": (config.form_error_div_id == "")?"eid1":config.form_error_div_id,
                "err_div_message": config.form_error_div_message,
                "err_div_link":config.form_error_div_link,
                "err_div_link_text":config.form_error_div_text,
                "err_timeout": config.form_error_timeout,
                "valid_timeout": config.form_valid_timeout,
                "buttonsAlignedRight": (config.form_button == "button_right")?true:false,
                "unlabeled": (config.form_button == "button_left")? true:false
            };
            if(config.form_footer_checkbox){
                _.extend(element, {
                    "footer": formConf.footer
                });
            }
            if(config.form_cancel_link_checkbox){
                _.extend(element, {
                    "cancel_link": formConf.cancel
                });
            }
            _.extend(element, {
                "buttons": getButtons()
            });
            _.extend(element, {
                "sections": getSections()
            });
            var conf = {
                elements: element,
                values:{},
                container: formElement
            }
            this.form = new FormWidget(conf);
            this.form.build();
            //configuring text area
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(element)+"\n}" );

            textAreaButton.click(function(){
                $('#obj').find('#error').empty();
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                try{
                    var jstr = JSON.parse(str);
                    var conf = {
                        elements: jstr,
                        values:{},
                        container:formElement
                    }
                    var form = new FormWidget(conf);
                    form.build();
                }
                catch(err){
                    $('#obj').find('#error').append(err);
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                } 
            });
            var clipboard = new Clipboard('#copyButton');
            clipboard.on('success', function(e) {
                console.info('copied');                    
            });
            clipboard.on('error', function(e) {
                console.error('Not copied');
            });

            return this;
        },

        

        generate: function (){
            var form = this.$el.find('form');
            var values = null;
            if (this.form.isValidInput()){
                values = this.form.getValues();
            }
            console.log(values);
            

            
        }

    });

    return FormView;
});