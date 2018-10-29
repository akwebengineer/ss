/**
 * A view that uses the form Widget to render a form from a configuration object
 * The configuration file contains the title, labels, element types, validation types and a iframe.
 *
 * @module ReportSummary config view
 * @author nareshu <nareshu@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    '../conf/reportSummaryConfiguration.js'
],  function(Backbone, 
        reportConfig){

        var ReportSummaryView = Backbone.View.extend({

            initialize: function(options) {
                this.message = options.message;
                this.page = options.page;
                this.deviceId = options.deviceId;               
                this.managedServices = options.model;
                this.dataObject = options.dataObject;
                this.uuid = this.dataObject.uuid;
                return this;
            },

            render: function() { 
                this.getSummaryReport();
                return this;
            },

            getTitle: function(){
                return "";
            },

            getSummaryReport: function() {    
                var self = this;            
                $.ajax({
                    "url": '/api/juniper/sd/policy-management/import/summary-report?uuid='+self.uuid,
                    "type": 'get',  
                    "contentType": 'text/html',                    
                    "processData": false,
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Get Summary Report - Success");
                        self.$el.html(data);
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });
            }

        });

    return ReportSummaryView;

});