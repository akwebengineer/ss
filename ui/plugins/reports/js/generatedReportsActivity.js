/**
 * Created by wasima on 11/5/15.
 */

/**
 *
 * @module Generated Reports Activity
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    '../../ui-common/js/gridActivity.js',
    './conf/generatedReportsGridConfiguration.js',
    './service/reportsService.js',
    './models/generatedReportsModel.js'
], function(GridActivity, GridConfiguration,ReportsService, Model) {

    var GeneratedReportActivity = function() {
        this.capabilities = {    
            "delete":{
                rbacCapabilities: ["DeleteReport"]
            },
            "select": {}
        };
        this.model = Model;
        this.fileName = null;
        this.gridConf = GridConfiguration;
        

        this.bindEvents = function() {
            var me = this;       
            GridActivity.prototype.bindEvents.call(this);
            this.events.downloadPDFEvent = "downloadPDFEvent";
            this.view.$el.bind(this.events.downloadPDFEvent, $.proxy(this.downloadPDF, this));
        };

        this.onListIntent = function() {
            var me= this,
                view = this.getView();
            me.setContentView(view);
            me.view.$el.find("#generated_reports").on("gridLoaded", function(){
                $('.cellLink').off("click").on('click',function(d){
                    var fileName = $(d.currentTarget).html();
                    me.downloadPDF(fileName);
                })
            });
        };

        this.downloadPDF = function(fileName) {
            var me = this;
            service = new ReportsService();

            onSuccessGetPDFfile = function(response) {
                var me = this;
                if (response.status == 200) { 
                   location.href = "/api/juniper/seci/report-management/download-pdf?file-name=" + fileName;
                }
            }

            onErrorGetPDFfile = function() {
                new Slipstream.SDK.Notification().setText("Failed to get PDF File").setType('info').notify();
            }
            service.getPDFfile(fileName, onSuccessGetPDFfile, onErrorGetPDFfile);
        };

    };
    var me = this;
    GeneratedReportActivity.prototype = new GridActivity();

    return GeneratedReportActivity;
});
