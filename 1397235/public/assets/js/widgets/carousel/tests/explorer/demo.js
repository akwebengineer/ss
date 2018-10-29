/*
Creates the widget on the demo page using form values 
*/
define([
    'backbone',
    'widgets/carousel/carouselWidget',
    'widgets/carousel/tests/view/cardsView',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, CarouselWidget, CardsView,PrintModule,Clipboard){
    var CarouselView = Backbone.View.extend({

        initialize: function (config) {
        	var itemArray = [];
        	var items=config.slice(2);
        	for(var jj=0;jj<items.length; jj++){
                if(items[jj].name.search("item")!= -1){
                    itemArray.push(items[jj].value);
                }
        	}
           this.multipleItems = this.makeItems(itemArray);
            this.render(config);
        },
        makeItems: function(viewArray){
        	var multipleItems =[];
            this.printableItems = [];
            var view = null;
            var viewName = "";
            for(var ii=0;ii<viewArray.length;ii++){
            	console.log(viewArray[ii]);
            	switch(viewArray[ii]){
            		case 'view1':
            			view = new CardsView.view1();
            			viewName = 'view1';
            			break;
            		case 'view2':
            			view = new CardsView.view2();
            			viewName = 'view2';
            			break;
            		case 'view3':
            			view = new CardsView.view3();
            			viewName = 'view3';
            			break;
            		case 'view4':
            			view = new CardsView.view4();
            			viewName = 'view4';
            			break;
            		case 'view5':
            			view = new CardsView.view5();
            			viewName = 'view5';
            			break;
            		case 'view6':
            			view = new CardsView.view6();
            			viewName = 'view6';
            			break;
            		case 'view7':
            			view = new CardsView.view7();
            			viewName = 'view7';
            			break;
            		case 'view8':
            			view = new CardsView.view8();
            			viewName = 'view8';
            			break;
            		case 'view9':
            			view = new CardsView.view9();
            			viewName = 'view9';
            			break;
            		case 'view10':
            			view = new CardsView.view10();
            			viewName = 'view10';
            			break;
            		default:
            			view = new CardsView.view1();
            			viewName = 'view1//';
            			console.log("wrong view");
            			break;
            	}
            	multipleItems.push({id:"card"+ii, content: view});
            	this.printableItems.push({id:"card"+ii, content: viewName});
            }
            return multipleItems;
        },
        render: function (config) {
        	var self = this;
        	var carouselElement = $('#widget-demo');
            $('#obj').find('#error').empty();
            var makeResponsiveObject = function(obj){
                var responsiveArray = [];
                var ii = 0;
                while(ii< obj.length){
                    responsiveArray.push({breakpoint:(obj[ii].value == "")?0:parseInt(obj[ii].value),settings:{slidesToShow:(obj[ii+1].value == "")?0:parseInt(obj[ii+1].value),slidesToScroll:(obj[ii+2].value == "")?0:parseInt(obj[ii+2].value)}});
                    ii +=3;
                }
                return responsiveArray;
            };
            //console.log(makeResponsiveObject(config.slice(4)));
            var responsiveStart = this.multipleItems.length+2;
        	var conf = {
        		container: carouselElement,
        		items: this.multipleItems,
        		height: config[0].value,
        		numberOfSlides: parseInt(config[1].value),
                responsive: makeResponsiveObject(config.slice(responsiveStart))
        	}
        	carouselElement.empty();
        	carouselElement.removeClass("carousel-widget max-width-items slick-initialized slick-slider");
            new CarouselWidget(conf).build();
            //configyration box
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            //var h = parseInt($('#test_form_widget').css( "height" )) - 150 ; //form of variable size in this case is cutting off the widget
            objectDisplayElementTextArea.css("height","200")
            //make a printable configuration object
            //console.log(conf);
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain({items:this.printableItems,height:conf.height,numberOfSlides:conf.numberOfSlides, responsive: conf.responsive})+"\n}" );
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
                $('#obj').find('#error').empty();
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                try{
                    var jstr = JSON.parse(str);
                    
                    //console.log(jstr);
                    var newConf = {
                    	container: carouselElement,
		        		height: jstr.height,
		        		numberOfSlides: jstr.numberOfSlides,
                        responsive :jstr.responsive
                    };
                    var itemArray = [];
		        	for(var jj=0;jj<jstr.items.length; jj++){
		        		itemArray.push(jstr.items[jj].content);
		        	}
                    var multipleItems = self.makeItems(itemArray);
                    newConf.items = multipleItems;
                    //console.log(newConf);
                 	carouselElement.empty();
                 	carouselElement.removeClass("carousel-widget max-width-items slick-initialized slick-slider");
            		new CarouselWidget(newConf).build();
                }
                catch(err){
                    
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                	//$('#obj').find('#error').append(err);
                }  
            });
            return this;
        }

    });

    return CarouselView;
});
