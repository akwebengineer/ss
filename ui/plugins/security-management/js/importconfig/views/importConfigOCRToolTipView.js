/**
 *@author: nareshu
 *Tooltip view to show ocr record details.
 *
 */

define([
    'backbone',
    '../conf/importConfigOCRToolTipConf.js',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var FormView = Backbone.View.extend({

        events: {
            'click #show_tooltip_ok': 'closeToolTip',
        },

        initialize: function(options) {
            this.data = options.data;
            this.activity = options.parentView;
            return this;
        },        

        render: function () {
            this.form = new FormWidget({
                "elements": formConf.ocr,
                "container": this.el,
                "values": this.data
            });
            this.form.build();
            return this;
        },

       

        closeToolTip: function (event) {
            event.preventDefault();
             this.activity.toolTipOverlay.destroy();

        }

    });

    return FormView;
});