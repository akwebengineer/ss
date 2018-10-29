/*
creates vies for all 3 tabs.
Only 1 createview file for all the widgets in explorer. 
This file should not be modified
*/
define(
    [
    'backbone',
    'lib/template_renderer/template_renderer',
    'text!explorer/widgets/templates/widgetDemo.html',
    'text!explorer/widgets/templates/exampleTab.html',  
], 
function(Backbone, render_template ,widgetDemo,example){

    var CreateView = {};

    var addContent = function($container, template) {  
        $container.append((render_template(template)));  
    } ;


    CreateView.view1 = Backbone.View.extend({
        initialize: function (opt){
            this.demoDocPath = opt.path;
        },
        render: function () {   
            var self = this;
                require([this.demoDocPath], function(demoDoc){
                    self.$el.append(demoDoc);
                });         
            return this;
        }
    });
    CreateView.view2 = Backbone.View.extend({
        initialize: function (opt){
            this.widgetViewPath = opt.wPath; //widget
            this.formOpt = opt.fBool;
            this.extOpt = opt.eBool;
            this.confViewPath =opt.cPath
            this.formPath = opt.fPath;
        },
        render: function () {
            var self = this;
            addContent(this.$el, widgetDemo);
            if(this.extOpt){ //if form extention is needed,ext is in formPath
                require([this.formPath], function(FormExt){
                    //console.log("loaded extension");
                    new FormExt({
                        el:self.$el.find('#test_form_widget'),
                        wPath:self.widgetViewPath,
                        bool : self.formOpt ,
                        cPath : self.confViewPath
                    });
                });
            }
            else{ //if we go for default form, static path
                require(['explorer/widgets/js/form'], function(formView){
                    //console.log("loaded normal form");
                    new formView({
                        el:self.$el.find('#test_form_widget'),
                        wPath:self.widgetViewPath,
                        bool : self.formOpt ,
                        cPath : self.confViewPath
                    });   
                });
            }

            return this;
        }
    });
    CreateView.view3 = Backbone.View.extend({
        initialize: function (opt){
            this.exampleViewPath = opt.path;
        },
        render: function (examplePath) { 
            var self = this;
            addContent(this.$el, example);
            require([this.exampleViewPath], function(exampleView){
                new exampleView({
                   el: self.$el.find('#widget-example')
                });
            }); 
            return this;
        }
    });

    
    return CreateView;
});