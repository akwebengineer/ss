/*
Creates the widget on the demo page using form values 
*/



define([
    'backbone',
    'widgets/dropDown/dropDownWidget',
    'widgets/dropDown/tests/model/remoteData',
    'text!widgets/dropDown/tests/dataSample/applicationSimple.json',
    'text!widgets/dropDown/tests/dataSample/applicationShort.json',
    'text!widgets/dropDown/tests/dataSample/application.json',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, DropDownWidget, RemoteData, applicationSimple, applicationShort, application,PrintModule,Clipboard){
    var DropDownView = Backbone.View.extend({


        

        widgets: {},

        initialize: function (config) {
            new RemoteData(); 
            $('#widget-demo').empty();
            $('#obj').find('#static-content').empty();
            $('#widget-demo').append('<select id="dropdownWidget"></select>');
            this.container = $('#dropdownWidget');
            this.render(config);
        },

        render: function (config) {
            var self = this;
            var getData = function(id){
                var data = null;
                if(id == "full"){
                    data = application;
                }
                else if(id == "simple"){
                    data = applicationSimple;
                }
                else if(id == "short"){
                    data = applicationShort;
                }
                else{
                    data = "remote"
                }
                return data;
            }
            this.data = getData(config.data);
            var conf = {
                container: this.container,
                showCheckboxes: (config.enabled_checkbox)? true: false,
                allowClearSelection:(config.enabled_clear)? true: false,
                placeholder: config.placeholder,
                enableSearch:(config.enableSearch)? true: false
            };
            if(this.data == "remote"){
                conf.remoteData =  {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",

                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){console.log("call succeeded" + JSON.stringify(data.data))},
                    "error": function(){console.log("error while fetching data")}
                }
            }
            else{
                conf.data = this.data;
            }
            if(config.setMatcher){
                conf.matcher = this.newMatcher;
            }
            if(config.onChange){
                conf.onChange = this.setValCb;
            }
            if(config.templateCheckbox1){
                conf.templateResult = self.templateResult;
            }
            if(config.templateCheckbox2){
                conf.templateSelection = this.formatSelection;
            }
            if(typeof config.MSmaximumSelectionLength !== "undefined"){ // if this exists means the section was opened
                conf.multipleSelection ={
                    maximumSelectionLength: (config.MSmaximumSelectionLength == "")?0:parseInt(config.MSmaximumSelectionLength)
                }
                if(config.enabled_tagsMS){
                    conf.multipleSelection.createTags = true;
                }
                if(config.enabled_clearMS){
                    conf.multipleSelection.allowClearSelection = true;
                }
            }
            if(config.set_init){
                if(config.data == "short"){
                    conf.initValue = {
                        "id": "tcp",
                        "text": "tcp"
                    }
                }else if(config.data == "full"){
                    conf.initValue = {
                        "id": "esp",
                        "text": "esp"
                    }

                }else if(config.data == "simple"){
                    conf.initValue ={
                        "id": "tftpnew",
                        "text": "junos-tftp-new"
                    }

                }else if(config.data == "remote"){
                    conf.initValue = {
                        "id": "rtsp",
                        "text": "junos-rtsp"
                    }
                }
            }
            console.log(conf);
             this.dropDown = new DropDownWidget(conf);
             this.dropDown.build();   

             //config box
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 150 ;
            objectDisplayElementTextArea.css("height",h) ;        
            //create an object here form conf which has all the properties except container
            var printableConf = {};
            var staticConf = {};
            var keys= Object.keys(conf);
            for(var ii=0; ii< keys.length; ii++){
                if(keys[ii] != "container"){
                    if(keys[ii] == "data"){
                        var objData = JSON.parse(conf[keys[ii]]);
                        printableConf[keys[ii]] = objData;
                    }
                    else if(keys[ii] == "onChange" || keys[ii] == "templateResult" || keys[ii]== "templateSelection" || keys[ii]== "matcher"){
                        staticConf[keys[ii]] = conf[keys[ii]];
                    }
                    else{
                        printableConf[keys[ii]] = conf[keys[ii]];
                    }   
                }  
            }
            //console.log(printableConf);
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(printableConf)+"\n}" );
            $('#obj').find('#static-content').append(new PrintModule().printObj(staticConf));

            textAreaButton.click(function(){
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                $('#widget-demo').empty();
                
                $('#widget-demo').append('<select id="dropdownWidget"></select>');
                this.container = $('#dropdownWidget');
                try{
                    var jstr = JSON.parse(str);
                    jstr.container = this.container;
                    //adding static function
                    if(staticConf.setMatcher){
                        jstr.matcher = this.newMatcher;
                    }
                    if(staticConf.onChange){
                        jstr.onChange = this.setValCb;
                    }
                    if(staticConf.templateCheckbox1){
                        jstr.templateResult = self.templateResult;
                    }
                    if(staticConf.templateCheckbox2){
                        jstr.templateSelection = this.formatSelection;
                    }

                    console.log(jstr);
                    var dropDown = new DropDownWidget(jstr);
                    dropDown.build();
                    
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    //$('#obj').find('#error').append(err);
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }     
            });
            //copy button
            var clipboard = new Clipboard('#copyButton');
            clipboard.on('success', function(e) {
                console.info('copied');                    
            });
            clipboard.on('error', function(e) {
                console.error('Not copied');
            });


            return this;
        },



        formatSelection: function (data) {            
                return data.name || data.text;
        },

        newMatcher: function (params, data) {
            if ($.trim(params.term) === '') {
                return data;
            }
            if (data.text.indexOf(params.term) > -1) {
                var modifiedData = $.extend({}, data, true);
                modifiedData.text += ' (matched)'; 
                return modifiedData;
            }
            return null;
        },

        templateResult: function (data){
            if (!data.id) {
                return data.text;
            }
            var mySelect = data.text;
            var $myCustomHtml = $("<span><img src='/assets/images/error.png'/> " + mySelect + "</span>");
            return $myCustomHtml;
        },

        setValCb: function(data) {
            alert("data changed");
        }


    });

    return DropDownView;
});