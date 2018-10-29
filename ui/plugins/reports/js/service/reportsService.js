/**
* ReportsService handles interaction with data APIs.
*
* @module Reports
* @author Orpheus Brahmos <orpheus-brahmos-team@juniper.net>, <anshuls@juniper.net>
* @copyright Juniper Networks, Inc. 2015
**/

define([
    '../conf/reportsGridConfig.js',
    '../models/reportsModel.js'
], function(ReportsGridConfig, ReportsModel) {

	var ReportsService = function() {
		var me = this;

		me.fetchSendReportInfo = function(postData, onSuccess) {
			$.ajax({
				url: '/api/juniper/seci/report-management/send-report',
				type: 'POST',
				data: postData,
				dataType: 'json',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.report-management.send-report-response+json;version=1;q=0.01");
					xhr.setRequestHeader("Content-Type", "application/vnd.juniper.seci.report-management.report-template+json;version=1;charset=UTF-8");
				},
				complete: function(response, status) {
					onSuccess(response);
			    }
			});
		};

		me.getPDFfileName = function(postData, onSuccess) {
			$.ajax({
				url: '/api/juniper/seci/report-management/preview-report',
				type: 'POST',
				data: postData,
				dataType: 'json',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.report-management.preview-report-response+json;version=1;q=0.01");
					xhr.setRequestHeader("Content-Type", "application/vnd.juniper.seci.report-management.report-template+json;version=1;charset=UTF-8");
				},
				complete: function(response, status) {
					onSuccess(response);
			    }
			});
		};

		me.getPDFfile = function(fileName, onSuccess, onError) {
			$.ajax({
				url: '/api/juniper/seci/report-management/download-pdf?file-name=' + fileName,
				type: 'GET',
				cache: 'false',
				contentType : 'application/pdf',
				complete: function(response, status) {
					onSuccess(response);
			    },
			    error: function() {
			    	onError();
			    }
			});
		};

		me.getLogoImgFile = function(fileName, onSuccess, onError) {
			$.ajax({
				url: '/api/juniper/seci/report-management/download-logo?file-name=' + fileName,
				type: 'GET',
				cache: 'false',
				complete: function(response, status) {
					onSuccess(response);
			    },
			    error: function() {
			    	onError();
			    }
			});
		};

		me.logoUpload = function(imgData, onSuccess) {
			$.ajax({
				url: '/api/juniper/seci/report-management/report-logo/upload?companyName=juniper',
				type: 'POST',
				data: imgData,
				enctype: 'multipart/form-data',
				contentType: false,
				processData: false,
				beforeSend: function(xhr) {
					xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.upload-logo-response+json;version=1;q=0.01");
				},
				complete: function(response, status) {
					onSuccess(response);
			    }
			});
		};

		me.getFormatedFilter = function(filterID ,onSuccess, onError){

			$.ajax({
				url: '/api/juniper/seci/filter-management/filters/'+filterID,
				type: 'GET',
				cache: 'false',
				dataType:"json",
                beforeSend:function(xhr){
                    xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.filter-management.event-filter+json;version=1;q=0.01");
                },
				success: function(response, status) {
					onSuccess(response);
			    },
			    error: function() {
			    	onError();
			    }
			});

		};

		// Run Report Now
		me.runReportNow = function(postData, onSuccess) {

            $.ajax({
                url: '/api/juniper/seci/report-management/run-report',
                type: 'POST',
                data: postData,
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Accept", "application/vnd.juniper.seci.report-management.preview-report-response+json;version=1;q=0.01");
                    xhr.setRequestHeader("Content-Type", "application/vnd.juniper.seci.report-management.report-template+json;version=1;charset=UTF-8");
                },
                complete: function(response, status) {
                    onSuccess(response);
                }
            });
        };


	}

	return ReportsService;
});