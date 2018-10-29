/**
* ReportsManager is a library of reusable functions.
*
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../service/reportsService.js',
    '../models/reportsModel.js'
], function(ReportsService, ReportsModel) {
    
    var ReportsManager = function() {
        var me = this;

        //Loads the reports model from the reports model
        me.getReportDefinition = function(reportId, onSuccess, onError){
            var me = this,
                reportsModel = new ReportsModel();
            //Set the report id to the model.
            reportsModel.set('id', reportId);

            onError = function(response){
                console.log("Report definition failed");
            };
            //
            reportsModel.fetch({
                success: onSuccess,
                error: onError
            });
            //
        };
        //
        me.sendReport = function(reportId, handleEmptyRecipients, onSuccess, onError) {
            var me = this,
                reportsFetchSuccess,
                reportsFetchError,
                service = new ReportsService();

            reportsFetchSuccess = function(model) {
                sendReportRecipientsLength = model.get('additional-emails') ? model.get('additional-emails').length : 0;
                if(sendReportRecipientsLength > 0) {
                    reportsModelJson = '{"report-template":' + JSON.stringify(model.attributes) + '}';
                    service.fetchSendReportInfo(reportsModelJson, onSuccess);
                }
                else {
                    handleEmptyRecipients();
                }
            };

            reportFetchError = function(){
                console.log("reportsActivity::modSendReport() - Error");
            };

            me.getReportDefinition(reportId, reportsFetchSuccess, reportsFetchError);
        };

    };
    return ReportsManager;
});