/*
1.base form view for all forms in demo tab of the explorer
2.To add events or more code for a widget, 
this has to be extended in a file called formExtend.js in explorer folder in the particular widget.
3.This file should never be modified
*/
define([
    'backbone',
    'widgets/form/formWidget', 
], function(Backbone, FormWidget){
    var FormView = Backbone.View.extend({

        events: {
            "click #generate": "generate"
        },

        initialize: function (opt) {
            //console.log("in forms initialize");
            this.widgetPath = opt.wPath ;
            this.option = opt.bool;
            this.confPath =opt.cPath;     
            this.render();
        },

        render: function () {
            var self = this;
            //console.log("in render");
            require([this.confPath],function(formConf){
                self.form = new FormWidget({
                    "elements": formConf.elements,
                    "values": formConf.values,
                    "container": self.el
                });
                self.form.build();
                self.addMoreCode();
            });
            return this;
        },

        

        generate: function (){
            var self = this;
            var form = this.$el.find('form');
            this.values = null;
            if (this.form.isValidInput()){
                this.values = this.form.getValues(this.option);
            }
            console.log(this.values);
            require([this.widgetPath],function(widgetView){
               self.widget = new widgetView(self.values)
             });
        },
        addMoreCode: function(){

        }    

    });

    return FormView;
});