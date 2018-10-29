/**
 * Download PDF Report Overlay View
 *
 * @module DownloadPDFReport
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['backbone',
    'widgets/form/formWidget',
    '../conf/downloadReportFormConfig.js'
    ], 
    function(Backbone,
        FormWidget,
        DownloadReportFormConfig
        ){

    

    var DownloadReportView = Backbone.View.extend({

        
        events: {
             'click #download_pdf_cancel': "destroyOverlay",
        },

        initialize: function(options){
            this.activity = options.activity;
            this.context = options.context;
            this.filePath = options.filePath;
        },
        
        render: function(){
            var me = this, downloadReportFormConfig = new DownloadReportFormConfig(me.context);
            
            formElements = downloadReportFormConfig.getValues();
            
            me.formWidget = new FormWidget({
            "elements": formElements,
            "container": me.el
            });

            me.formWidget.build();
            me.$el.find("#download_pdf").html("<a download href=" + me.filePath + ">Download PDF Report</a>");
            return me;
        },

        destroyOverlay : function(event){
            event.preventDefault();
            var me = this;
            me.activity.downloadPDFWidget.destroy()
         }

    });

    return DownloadReportView;
})