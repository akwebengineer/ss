/*creates teh top level tab widget. 
This file must not be modified*/
define([
    'backbone',
    'widgets/tabContainer/tabContainerWidget',
    'explorer/widgets/js/createView'
], function(Backbone, TabContainerWidget,CreateView){
    var TabContainerView = Backbone.View.extend({

        initialize: function () {
            this.docPath ="", this.widgetPath ="", this.examplePath ="", this.formBool = false, this.extBool = false;
            var param= "" , boolOpt = "", formOpt ="";
            this.widget = "";
            var param = window.location.hash.substring(1);
            var arr = param.split("&");
            this.widget = arr[0].substring(7,arr[0].length);
            boolOpt =arr[1].substring(8,arr[1].length);
            formOpt =arr[2].substring(8,arr[2].length);
            if(boolOpt=="obj"){
                this.formBool =true;
            }
            if(formOpt == "true"){
                this.extBool = true;
            }
            this.makeLinks();
            this.render();
        },

        render: function () {
            // console.log(this.docPath);
            // console.log(this.widgetPath);
            // console.log(this.examplePath);
            this.tabs = [
                        {
                            id:"doc",
                            name:"Documentation",
                            content: new CreateView.view1({path:this.docPath})
                        },
                        {
                            id:"demo",
                            name:"Demo",
                            content: new CreateView.view2({wPath:this.widgetPath, cPath:this.confPath, fPath:this.formPath, fBool:this.formBool, eBool:this.extBool })
                        },
                        {
                            id:"example",
                            name:"Example",
                            content: new CreateView.view3({path:this.examplePath})
                        }
                        ];
            var $navigationContainer = this.$el.find('#navigationTab');
            new TabContainerWidget({
                "container": $navigationContainer,
                "tabs": this.tabs,
                "height": "auto",
                "navigation":true
            }).build();
            return this;
        },
        makeLinks:function(){
            var name = this.widget;
            this.docPath = "text!widgets/"+name+"/tests/explorer/doc.html"; // path of demo doc - html file
            this.widgetPath = "widgets/"+name+"/tests/explorer/demo" ;//path of the widget
            this.confPath = "widgets/"+name+"/tests/explorer/formConf";// path of form configuration
            this.formPath = "widgets/"+name+"/tests/explorer/formExtend"; //path of form extension if needed
            this.examplePath ="widgets/"+name+"/tests/app"+ this.capitalizeFirstLetter(name); //path of main test file in widget folder
        },
        capitalizeFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }      

    });

    return TabContainerView;
});