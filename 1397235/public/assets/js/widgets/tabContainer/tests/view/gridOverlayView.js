/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and buttons of the form
 *
 * @module GridOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/tabContainer/tests/conf/formConfiguration',
    'widgets/form/formWidget'
], function(Backbone, formConf, FormWidget){
    var GridOverlayView = Backbone.View.extend({

        render: function () {
           this.form = new FormWidget({
                "elements": formConf.GridSampleOnOverlay,
                "container": this.el
            });
            this.form.build();
            return this;
        },

        getViewData: function (){
            var viewData = {};
            if (this.form.isValidInput()){
                var values = this.form.getValues();
                for (var i=0; i<values.length; i++){
                    viewData[values[i].name] = values[i].value;
                }
            }
            return viewData;
        },

        isValidTabInput: function(){
            return this.form.isValidInput();
        }

    });

    return GridOverlayView;
});