/**
 * Export CSV Overlay View
 *
 * @module ExportCSV
 * @author Anupama <athreyas@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['backbone', 'widgets/form/formWidget', '../conf/exportCSVFormConfig.js'], 
    function(Backbone, FormWidget,  ExportCSVFormConfig){

    var ExportCSVView = Backbone.View.extend({

        events: {
            'click #export_csv_cancel': "destroyOverlay",
        },

        initialize: function(options){
            this.activity = options.activity;
            this.context = options.context;
            this.filePath = options.filePath;
        },
        
        render: function(){
            var me = this, exportCSVFormConfig = new ExportCSVFormConfig(me.context),
                formElements = exportCSVFormConfig.getValues();
            
            me.formWidget = new FormWidget({
                "elements": formElements,
                "container": me.el
            });

            me.formWidget.build();
            me.$el.find("#export_csv").html("<a download href=" + me.filePath + ">Download CSV file</a>");
            return me;
        },

        destroyOverlay : function(event){
            event.preventDefault();
            var me = this;
            me.activity.exportCSVWidget.destroy()
        }
    });
    return ExportCSVView;
});