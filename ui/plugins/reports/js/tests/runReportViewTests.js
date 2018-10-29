/**
 * Unit test file for Run Now Report
 *
 * @module reports
 * @author shinig <shinig@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    "../../../reports/js/models/reportsModel.js",
    "../../../reports/js/views/runReportView.js",
    "../../../reports/js/reportsActivity.js",
    '../../../reports/js/service/reportsService.js',
    "../../../reports/js/utils/reportsManager.js",
    '../../../ui-common/js/common/utils/SmNotificationUtil.js'
    ], function(ReportsModel, RunReportView, ReportsActivity, ReportsService, ReportsManager, SmNotificationUtil) {

    describe("Unit test cases for Run Now Report functionality ", function() {

        var context, view, intent, model, stub, save,
            event = {
                 type: 'click',
                 preventDefault: function () {}
            };

        before(function() {
            activity = new Slipstream.SDK.Activity();

            context = sinon.stub(activity, 'getContext', function() {
                return new Slipstream.SDK.ActivityContext();
            });

            context.getMessage = function (key) {
                return key; // return as per requirement
            };
            context.getHelpKey = function (key) {
                return key; // return as per requirement
            };

            $.mockjax({
                url: "/api/space/user-management/users",
                type: 'GET',
                responseText: {"users":{"user": [{"@key":"1032","name":"super","primaryEmail":"super@juniper.net","firstName":"Open","lastName":"Space","roleType":"ALL_ACCESS"}]}}
            });

        });

        after(function() {
            context.restore();
        });


        describe("Run Now Report unit tests", function() {

            before(function(){
                model = new ReportsModel();
                view = new RunReportView({
                    activity: activity,
                    context: context,
                    model: model
                });
            });

            after(function() {
//                intent.restore();
            });

            it("Reports model exists ?", function() {
                model.should.exist;
            });

            it("runReport view exists ?", function() {
                view.should.exist;
            });

            it("runReport view rendered ?", function() {
                view.render();
            });

            it("view.formWidget should exist", function() {
                view.formWidget.should.exist;
            });

        });

        describe("Reports Activity unit tests for Run Now", function() {

            before(function(){
                model = new ReportsModel();
                reportsManager = new ReportsManager();
                smNotificationUtil = new SmNotificationUtil();
                screenId = 1234;
                activity = new ReportsActivity({
                    activity: activity,
                    context: context,
                    model: model,
                    reportsManager: new ReportsManager(),
                    screenID : screenId
                });
                $.mockjax({
                   url: "/api/juniper/seci/report-management/report-templates/1234",
                   type: 'GET',
                   responseText: "{'report-template':{'last-modified-time':1467957203000,'report-logo':{'logo-name':'defaultLogo','version':0,'def-type':'CUSTOM','file-name':'logo.png','id':'110'},'job-id':360462,'job-status':'Failure','policy-analysis-content':{},'bandwidth-template-content':{},'version':15,'sections':{'section':[{'section-title':'Top FW Denies','count':10,'time-duration':10800000,'filter-string':'event-type = RT_FLOW_SESSION_DENY','formatted-filter':{'case-sensitive':false,'filter':{'key':'event-type','operator':'EQUALS','value':['RT_FLOW_SESSION_DENY']}},'end-time':0,'section-description':'Top Firewall Denies by SourceIP By Count\n\t\t\t\t','aggregation':'source-address','start-time':0,'chart-type':'BAR','section-id':1,'time-unit':1,'display-table':false}]},'description':'Report for Top Firewall Denies by SourceIP By Count\n\t\t','id':'168','domain-id':2,'name':'Top FW Denies','scheduler':{'start-time':1467957202000,'schedule-type':'Weekly','re-occurence':1,'date-of-month':8,'end-time':10445221800000,'days-of-week':{'day-of-week':['Monday','Tuesday']}},'created-time':1467362594000,'last-generated-time':1467937403000,'def-type':'CUSTOM','last-modified-by-user-name':'super','job-failure-reason':'Report generated successfully. But failed to send it in an email. Reason : Email address are not configured','report-content-type':'LOG','uri':'/api/juniper/seci/report-management/report-templates/168'}}"
                });
            });

            after(function(){
                //
            });

            it("Reports Activity exists ?", function() {
                activity.should.exist;
            });

            it("Method called to get the PDF file name after executing Run Now", function() {
                var reportId = 1234, getReportDefinition, params, onSuccessRunReport = function() {};
                    getReportDefinition = sinon.stub(activity.reportsManager, 'getReportDefinition', function(){return true;});
                activity.onRunReport(reportId);
                getReportDefinition.calledOnce.should.be.equal(true);

                params = getReportDefinition.args[0];
                params[0].should.be.equal(1234);
                expect(params[1]).to.be.a('function');
                expect(params[2]).to.be.a('function');

//                params[1].should.be.equal("onSuccessRunReport");
//                params[2].should.equal('onErrorRunReport');
                getReportDefinition.restore();
            });

            it("Callback method to get the process updated to download the PDF report - getProgressUpdate ", function() {
                var getTaskProgressUpdate, onProgressUpdateSucsess = function() {}, onProgressUpdateError = function() {};
                getTaskProgressUpdate = sinon.stub(smNotificationUtil, 'getTaskProgressUpdate', function(screenId, onProgressUpdateSucsess, onProgressUpdateError){return true;});

                activity.getProgressUpdate();

                getTaskProgressUpdate.calledOnce.should.be.equal(false);
                params = getTaskProgressUpdate.args[0];
                getTaskProgressUpdate.restore();

            })
        });


        describe("Reports Service unit tests", function() {

            before(function(){
                service = new ReportsService();
                $.mockjax({
                    url: "/api/juniper/seci/report-management/run-report",
                    type: 'POST',
                    responseText: "{'preview-report-response':{'file-name':'Top_FW_Denies_2016-07-07T11:33:32.220Z.pdf'}}"
                });
            });

            after(function(){
                //
            });

            it("Reports service exists ?", function() {
                service.should.exist;
            });

            it("call runReportNow, to get the PDF file details for the requested report", function() {
                var postData = "{'report-template':{'id':'168','last-modified-time':1467870747000,'report-logo':{'logo-name':'defaultLogo','version':0,'def-type':'CUSTOM','file-name':'logo.png','id':'110'},'job-id':173,'job-status':'Failure','policy-analysis-content':{},'bandwidth-template-content':{},'version':14,'sections':{'section':[{'section-title':'Top FW Denies','count':10,'time-duration':10800000,'filter-string':'event-type = RT_FLOW_SESSION_DENY','formatted-filter':{'case-sensitive':false,'filter':{'key':'event-type','operator':'EQUALS','value':['RT_FLOW_SESSION_DENY']}},'end-time':0,'section-description':'Top Firewall Denies by SourceIP By Count\n\t\t\t\t','aggregation':'source-address','start-time':0,'chart-type':'BAR','section-id':1,'time-unit':1,'display-table':false}]},'description':'Report for Top Firewall Denies by SourceIP By Count\n\t\t','domain-id':2,'name':'Top FW Denies','scheduler':{'start-time':1467957202000,'schedule-type':'Weekly','re-occurence':1,'date-of-month':8,'end-time':10445221800000,'days-of-week':{'day-of-week':['Monday','Tuesday']}},'created-time':1467362594000,'last-generated-time':1467702100000,'def-type':'CUSTOM','last-modified-by-user-name':'super','job-failure-reason':'Report generated successfully. But failed to send it in an email. Reason : Email address are not configured','report-content-type':'LOG','uri':'/api/juniper/seci/report-management/report-templates/168'}}",
                    onSuccess = function() {};
                service.runReportNow(postData,  onSuccess);
            });
        });

    });

});

