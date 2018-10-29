/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/form/formWidget',
    'widgets/listBuilderNew/tests/conf/formConfiguration',
    'widgets/listBuilderNew/tests/dataSample/testingSample',
    'mockjax',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, ListBuilderWidget, listBuilderConf, FormWidget, formConf, testingSample, mockjax,PrintModule,Clipboard){
    var ListBuilderView = Backbone.View.extend({


        initialize: function (config) {
            this.mockApiResponse();
            var createLink = function (cellvalue, options, rowObject){
                return '<a class="cellLink" data-cell="'+cellvalue+'">'+cellvalue+'</a>';
             },
            onChangeSelected = function (e, data){
                    console.log("onChangeSelected triggered");
                    console.log(data);
                },
            getColumns = function(){
                var columnName = [];
                var column = [];
                for(prop in config){
                    if (prop.startsWith("column")){
                        columnName.push(config[prop]);
                    }
                }
                for(var ii=0;ii<columnName.length;ii++){
                    if(config[columnName[ii]+"_option_addFormatter_Checkbox"]){
                    column.push({"index":columnName[ii],"name":columnName[ii],"label":config[columnName[ii] + "_label"],"width":parseInt(config[columnName[ii] + "_width"]),"hidden":(config[columnName[ii]+"_option_hidden_Checkbox"])? true:false,"formatter":createLink});
                    }
                    else{
                    column.push({"index":columnName[ii],"name":columnName[ii],"label":config[columnName[ii] + "_label"],"width":parseInt(config[columnName[ii] + "_width"]),"hidden":(config[columnName[ii]+"_option_hidden_Checkbox"])? true:false});
                    }
                }
                return column;
            },
            getSort =function(){
                var sort = [];
                if(config.sort_col){
                    sort.push({"column":config.sort_col,"order":config.order_radio})
                }
                return sort;
            },
            getListElements = function(prop){
                var eleObj =null;
                var data = config[prop];
                var url ="";
                switch(data){
                    case 'd1':
                        url= "/api/get-data";
                        break;
                    case 'd2':
                        url= "/api/get-data2";
                        break;
                    case 'd3':
                        url= "/api/get-data3";
                        break;
                    case 'd4':
                        url= "/api/get-data4";
                        break;
                    case 'd5':
                        url= "/api/get-dataP2";
                        break;
                    case 'd6':
                        url= "/api/get-dataP3";
                        break;
                    case 'd7':
                        url= "/api/get-dataP4";
                        break;
                    case 'd8':
                        url= "/api/get-dataP5";
                        break;
                    case 'd9':
                        url= "/api/get-dataP9";
                        break;
                    default:
                        url = null;
                        break;
                };
                if (url){
                    eleObj ={
                        "url":url,
                        "jsonRoot": "addresses.address",
                        "totalRecords": "addresses.@total",
                        "title": prop
                    }
                }
                return eleObj;
            };
            
            var conf = {
                "pageSize": parseInt(config.pageSize),
                "jsonId": config.jsonId,
                "height": config.height,
                "id": config.listId,  
                "loadonce":(config.loadOnce_Checkbox)? true:false,

            };
            var cols = getColumns();
            _.extend(conf, {
                "jsonId": cols[0].name
            });
            _.extend(conf, {
                "columns": cols
            });
            _.extend(conf, {
                "sorting": getSort()
            });
            _.extend(conf, {
                    "availableElements": getListElements("availableElements")
                });
            var selEle = getListElements("selectedElements");
            if((config.onChangeSelected_Checkboxx)){
                _.extend(conf, {
                    onChangeSelected: onChangeSelected
                });
            }
            if(selEle){
                _.extend(conf, {
                    "selectedElements": selEle 
                });
            }
            
            //console.log(conf);
            this.render(conf);
        },

        render: function (conf) {
            var self = this;
            var listContainer = $('#widget-demo');
            listContainer.empty();
            $('#obj').find('#static-content').empty();
            var w =((this.getWidth(conf.columns) + 27)*2) +65;
            listContainer.css("width",w);

            this.listBuilder = new ListBuilderWidget({
                container:listContainer,
                elements:conf,
                rowTooltip: this.rowTooltip
            });
            this.listBuilder.build();

            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 250 ;  
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(conf)+"\n}" );
            $('#obj').find('#static-content').append(new PrintModule().printObj({rowTooltip:this.rowTooltip}));
            textAreaButton.click(function(){
                listContainer.empty();
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                try{
                    var jstr = JSON.parse(str);
                    var w =((self.getWidth(jstr.columns) + 27)*2) +65;
                    listContainer.css("width",w);
                    var list = new ListBuilderWidget({
                        container:listContainer,
                        elements:jstr,
                        rowTooltip: this.rowTooltip
                    });
                    list.build();
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


            return this;
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = testingSample;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addresses;
                }
            });
            $.mockjax({
                url: '/api/get-data2',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addresses2;
                }
            });
            $.mockjax({
                url: '/api/get-data3',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addresses3;
                }
            });
            $.mockjax({
                url: '/api/get-data4',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addresses4;
                }
            });
            $.mockjax({
                url: '/api/get-dataP2',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addressesPage2;
                }
            });
            $.mockjax({
                url: '/api/get-dataP3',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addressesPage3;
                }
            });
            $.mockjax({
                url: '/api/get-dataP4',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addressesPage4;
                }
            });
            $.mockjax({
                url: '/api/get-dataP5',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addressesPage5;
                }
            });
            $.mockjax({
                url: '/api/get-dataP6',
                dataType: 'json',
                responseTime: 10,
                response: function(settings){
                    this.responseText = data.addressesPage6;
                }
            });
        },

        getWidth :function(colArray){
            var total = 0;
            for(var ii=0;ii<colArray.length;ii++){
                if(!colArray[ii].hidden){
                    total += parseInt(colArray[ii].width);
                }
            }
            return total;
        },
        rowTooltip: function (rowData, renderTooltip){
            var moreData = [];
            moreData.push({title:rowData["domain-name"]});
            moreData.push({label:rowData.name});
            renderTooltip(moreData);  
        }

    });

    return ListBuilderView;
});