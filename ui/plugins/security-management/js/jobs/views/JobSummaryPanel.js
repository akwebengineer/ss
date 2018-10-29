/**
 *
 */
define(
    [
        'backbone',
        // summary template
        'text!../template/jobSummaryTemplate.html',
        '../../../../sd-common/js/common/utils/TimeKeeper.js'
    ],
    function (Backbone, SummaryTemplate,TimeKeeper) {
        /**
         * Creates job summary panel class
         * @param configuration
         * @constructor
         */
        var JobSummaryPanel = function (configuration) {
            this.configuration = configuration;
            this.context = configuration.parentView.context;
        };
        /**
         * defines instance functions
         */
        $.extend(JobSummaryPanel.prototype, {
            /**
             * creates the job summary panel
             * @param id: Job Id
             */
            createJobSummaryPanel: function (id) {
                this.jobID = id;
                this.fetchJobDetails();
            },
            /**
             * Fetch the job summary details
             */
            fetchJobDetails: function () {
                var me = this;
                $.ajax({
                    url: '/api/space/job-management/jobs/' + this.jobID + '?fields=(job-type,id,name,owner,job-state,job-status,percent-complete,scheduled-start-time,start-time,end-time)',
                    "headers": {
                        "Accept": 'application/vnd.net.juniper.space.job-management.job+json;version=3;q=0.03',
                        "x-date" : TimeKeeper.getXDate( )
                    },
                    dataType: "json",
                    success: function (data) {
                        // update the template
                        me.loadDataInTemplate(data);
                    }
                });
            },
            /**
             * Fetch job device Assignment status.
             *
             */  

             fetchDeviceAssign : function(parentView){
                var me = this,
                    policyTypeMapping ={
                        "DCPolicy":"Firewall Policy",
                        "IPSPolicy" : "IPS Policy",
                        "DCNATPOLICY" : "NAT Policy"
                    }

                 $.ajax({
                    url: '/api/juniper/sd/job-result-management/'+this.jobID+'/messages',
                    "headers" :{
                        "accept": 'application/vnd.juniper.sd.job-result-management.messages+json;version=1;q=0.01'
                    }, 
                  
                    "success": function( data, textStatus, jQxhr ) {
                        console.log("Assignment Status :"+ data);
                        var noteText = "",assigned = "", unassigned ="", messages, i, j, message;
                            messages = data.JobMessages.messages;
                            for(i =0;i<messages.length;i++){
                                message = messages[i].value;
                                message = JSON.parse(message);

                                if(message){
                                    if(message.key === "Import_UnAssign_device"){
                                        for(j=0;j<message.parameters.length;j=j+2){
                                            unassigned += message.parameters[j+1] +" ("+policyTypeMapping[message.parameters[j]]+") ";
                                        }
                                    }
                                    else if(message.key === "Import_Assign_device"){
                                        for(j=0;j<message.parameters.length;j=j+2){
                                            assigned +=message.parameters[j+1] +" ("+policyTypeMapping[message.parameters[j]]+") ";
                                        }
                                    }
                                }
                            }
                        
                        if(assigned!==""){
                             noteText = '<h6 style="color:#0000FF;"> Device Assigned Policies :'+assigned+'</h6>';
                        } 
                     
                        if(unassigned!==""){
                             noteText += '<h6 style="color:#0000FF;"> Device UnAssigned Policies :'+unassigned+'</h6>';
                        }
                       
                        parentView.$el.find('.job-summary-note').html(noteText);
                    },
                    complete : function(data){
                        console.log("Assignment Status :" + data);
                    },
                    "error": function( jqXhr, textStatus, errorThrown ) {
                        console.log( errorThrown );
                    }
                });
             },

            /**
             * It loads the data in the template and attach it to the container
             * @param data
             *          Data to be loaded in the container
             */
            loadDataInTemplate: function (data) {
                var me = this, container, message, response, parentView, noteText, summaryDownloadfield,fwSummaryDownloadfield,natSummaryDownloadfield;

                // get the container
                container = this.configuration.container;

                // empty the container
                container.empty();

                // for Imort job details, download summary button will be disable by default it should be enable only if the job status is done
                if(data.job['job-state'] && data.job['job-state'].toLowerCase() === "done") {
                    summaryDownloadfield = $(me.configuration.parentView.gridPanel.configuration.container).find('#downloadSummary');
                    if(summaryDownloadfield){
                        $(summaryDownloadfield).find('input:button').removeClass('disabled');
                    }
                }

                //update response to handle template rendering
                response = me.updateResponse(data.job);

                // build the template
                message = Slipstream.SDK.Renderer.render(SummaryTemplate, response);

                // update the template in the container
                me.configuration.container.append(message);

                // check if reload is required. only when the percent-complete is not 100
                parentView = me.configuration.parentView;
                if (data.job['percent-complete'] === 100 ) {
                    if (data.job['job-type'] && data.job['job-type'].indexOf('Import') === 0 ) {
                        me.fetchDeviceAssign(parentView);
                    }
                } 
            },
            /**
             * Updates the response in accordance to the template
             */
            updateResponse: function (job) {
                var me = this;

                if (job['percent-complete'] === 100 && job['job-state'] === "DONE") {
                    job['job-state'] = me.context.getMessage(job['job-status']);
                    // put icon here based on status
                    job.jobStateIconClass = job['job-status'] === 'SUCCESS' ? 'jobIconSuccess' : 'jobIconFailure';
                } else if (job['job-status'] === 'FAILURE') {
                    job.jobStateIconClass = 'jobIconFailure';
                    job['job-state'] = me.context.getMessage(job['job-status'])
                }else {
                    job['job-state'] = me.context.getMessage(job['job-state']);
                    job.jobStateIconClass = '';
                }

                return job;
            },
            /**
             * Refresh data -> Will be called on reload notification
             */
            reloadData: function () {
                this.fetchJobDetails();
            }
        });
        return JobSummaryPanel;
    }
);