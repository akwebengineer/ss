/**
 * Created by tgarg on 6/18/15.
 */

define(
    [
        'backbone',

        // views and widgets
        '../../../../ui-common/js/views/apiResourceView.js',
        'widgets/form/formWidget',
        'widgets/tabContainer/tabContainerWidget',

        // configuration
        '../conf/JobConfiguration.js',

        // job status panel
        './JobStatusPanel.js',

        // job details screen
        './JobDetailsPanel.js',

        // job summary panel
        './JobSummaryPanel.js',

        // views
       // './JobConfigurationTabView.js',
        './JobMessageTabView.js',

        'widgets/overlay/overlayWidget',
        '../../publish/views/deviceConfigurationFormView.js',
        'widgets/progressBar/progressBarWidget',
        '../../../../ui-common/js/common/utils/SmUtil.js',
        '../../../../ui-common/js/sse/smSSEEventSubscriber.js'
    ],

    function (Backbone, ResourceView, FormWidget, TabContainerWidget,
              JobConfiguration, JobStatusPanel, JobDetailsPanel, JobSummaryPanel,
             // ConfigView,
              MessageView, OverlayWidget, DeviceConfigurationView, ProgressBarWidget,SmUtil,
              SmSSEEventSubscriber) {


        var JobView = ResourceView.extend({

          //fix for PR 1152679. As Per audit trail #17
          remove : function() {
            try {
              if (this.activity) {
                this.activity.finish();
              }
            } catch (e) {
              console.log(e);
            }
            Backbone.View.prototype.remove.call(this);
          },

            /**Click events**/
            events: {
                'click #sd-job-close': "cancel",
                'click #sd-job-back': "back",
                'click .sd-multi-job': 'changeJobWindow'
            },

            /**Window mode - single or job chaining*/
            mode: {
                SINGLE: 0,
                MULTI: 1
            },

            /**
             * The constructor for the Job view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context and activity
             */
            initialize: function (options) {
                var me = this;

                me.smSSEEventSubscriber = new SmSSEEventSubscriber();
                me.options = options;

                ResourceView.prototype.initialize.call(me, options);

                me.jobsTO = options.jobInfo.job;

                // set the type of job mode
                me.jobWindowMode = (me.jobsTO instanceof Array && me.jobsTO.length > 1)
                    ? me.mode.MULTI : me.mode.SINGLE;

                // binding the grid action events.
                me.$el.bind("exportJobDetailsGridToCSV", function(){
                    var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_EXPORT,{
                                    mime_type: 'vnd.juniper.net.job.export'
                                });
                    intent.putExtras({data: {jobID: me.currentJobID}});
                                                                 
                    me.context.startActivity(intent);

                });

                /**
                *  Bind Download PDF Event. This will download import Summary from the job Page.
                *
                */
                me.$el.bind("downloadSummary", function(){
                var href ='/api/juniper/sd/job-result-management/' + me.currentJobID+ '/download-summary',link;
                //window.open('/api/juniper/sd/job-result-management/' + extras.data.jobID+ '/download-summary','_self');
                link = document.createElement('a');
                link.href = href;
                link.download = "SummaryReport.zip";
 
                //Dispatching click event.
                if (document.createEvent) {
                    var e = document.createEvent('MouseEvents');
                    e.initEvent('click' ,true ,true);
                    link.dispatchEvent(e);
                    return true;
                }
                });                
            },


            /**
             * Renders the form view in a overlay.
             *
             * returns this object
             */
            render: function () {
                var me = this,
                    isMultiJob = me.jobWindowMode === me.mode.MULTI,
                    jobConfiguration = new JobConfiguration(isMultiJob, me.context),
                    overlayElements = jobConfiguration.getValues(),
                    jobIDsForNotificationSubscribe = [];

                // add dynamic config based on type of screen
                me.addDynamicFormConfig(overlayElements);

                // create screen on a form
                me.jobScreen = new FormWidget({
                    container: me.el,
                    elements: overlayElements
                });

                // add security management class
                me.$el.addClass("security-management");

                // build the screen
                me.jobScreen.build();
                //After building the form make sure that form sections have height which will make the overlay to take max height
                //Here the height is the total of all the sections other than grid sections and header/footer etc etc  which need to be substracted from 
                //overlay height
                var toBePaddedHeight = new SmUtil().calculateGridHeightForOverlay((isMultiJob ? 190+131 : 190)) ;
                me.$el.find('#job_section_grid').css('height',  toBePaddedHeight+ 'px');
                
                // if it is multi job window
                if (isMultiJob) {
                    me.createMultiJobStatusScreen();

                    // set current job
                    me.currentJobID = me.jobsTO[0].id;

                    $(me.jobsTO).each(function (i) {
                        jobIDsForNotificationSubscribe.push('/api/space/job-management/jobs/'+ me.jobsTO[i].id);
                    });

                } else {
                    me.currentJobID = me.jobsTO.id;
                    jobIDsForNotificationSubscribe.push('/api/space/job-management/jobs/'+ me.jobsTO.id);
                    me.$el.find('#job_section_status').hide();
                }

                // display the summary screen
                me.createSummaryScreen();

                // display the details grid
                me.createDetailsGrid();

                // hide the back button
                me.$el.find('#sd-job-back').hide();
                me.$el.find('#job-section-message-cli').hide();

                // set tab widget
                me.setTabWidget();
                // subscribe for Notifications
                me.subscribeNotifications(jobIDsForNotificationSubscribe);
                // safe check for notification..
                me.reloadData();

                return me;
            },

             /**
             * [subscribeNotifications]
             * @return {SmSSEEventSubscriber obj} [ will subscribe for notifcation with job id]
             * triggers the getConfigJobResult as notication call back
             */
             subscribeNotifications : function (jobIDsForNotificationSubscribe) {
                //Subscribe to the SSE event
                var self = this, sseEventHandler, notificationSubscriptionConfig = {
                    'uri' : jobIDsForNotificationSubscribe,//['/api/space/job-management/jobs/'+ self.currentJobID ],
                    'autoRefresh' : true,
                    'callback' : function () {
                        self.reloadData();
                    }
                };
                    
                sseEventHandler = $.proxy(notificationSubscriptionConfig.callback, self);
                self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription(notificationSubscriptionConfig.uri, sseEventHandler);
                return self.sseEventSubscriptions;
            },
            /**
             * [unSubscribeNotification]
             */
             unSubscribeNotification: function(){
                // unsubscribe Notification for job details
                this.smSSEEventSubscriber.stopSubscription(this.sseEventSubscriptions);
            },

            /**
             * Add dynamic configuration based on window mode
             * @param formConfiguration
             */
            addDynamicFormConfig: function (formConfiguration) {
                var me = this, dynamicProperties = {};
                switch (me.jobWindowMode) {
                    case me.mode.MULTI:
                        dynamicProperties.title = me.context.getMessage('job_instance_title_multi');
                        break;

                    case me.mode.SINGLE:
                        dynamicProperties.title = me.context.getMessage('job_instance_title_single');
                        break;
                }
                _.extend(formConfiguration, dynamicProperties);
            },

            /**
             * It creates the multi job status screen
             */
            createMultiJobStatusScreen: function () {
                var me = this, jobStatusContainer;

                // get job status container
                jobStatusContainer = me.$el.find('.job-status').empty();

                me.statusPanel = new JobStatusPanel({
                    container: jobStatusContainer,
                    options: me.options,
                    parentView: me
                });

                me.statusPanel.createJobStatusPanel(me.jobsTO);

            },

            /**
             * Creates the center panel summary screen
             */
            createSummaryScreen: function () {
                var me = this, jobSummaryContainer;

                // get job summary container
                jobSummaryContainer = me.$el.find('.job-summary').empty();

                me.summaryPanel = new JobSummaryPanel({
                    container: jobSummaryContainer,
                    options: me.options,
                    parentView: me
                });

                // build the table
                me.summaryPanel.createJobSummaryPanel(me.currentJobID);
            },


            /**
             * Create bottom details grid
             */
            createDetailsGrid: function () {
                var me = this, jobObject,
                    jobDetailsGridContainer = me.$el.find('.job-grid-widget').empty(),
                    gridTitle = me.$el.find('#job_section_grid').find('.section_title');


                // create a grid
                me.gridPanel = new JobDetailsPanel({
                    container: jobDetailsGridContainer,
                    gridHeader: gridTitle,
                    options: me.options,
                    parentView: me
                });

                // get the job object
                jobObject = me.getJobObjectFromId(me.currentJobID);

                // build the grid
                me.gridPanel.createGrid(jobObject);

                // unwrap the element
                jobDetailsGridContainer.find('.job-grid-widget').unwrap();


            },
            /**
             * Called when OK button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            back: function (event) {
                var me = this;
                event.preventDefault();

                // show grid and hide back button
                me.$el.find('#job_section_grid').show();
                me.$el.find('#sd-job-back').hide();
                me.$el.find('#job_section_summary').show();
                me.$el.find('#job-section-message-cli').hide();

            },
            /**
             * @overridden view close 
             * [close description]
             * @return {[type]} [description]
             */
            close: function () {
               this.unSubscribeNotification();
            },
            /**
             * Called when OK button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function (event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            },

            /**
             * Refresh the job window
             */
            reloadData: function () {
                var me = this;
                // if all jobs are loaded, return. No need to refresh the panels
                if (me.isAllJobsLoaded) {
                    this.unSubscribeNotification();
                }

                if (me.jobWindowMode === me.mode.MULTI) {
                    me.statusPanel.reloadData();
                }

                me.summaryPanel.reloadData();

                // grid reload
                me.gridPanel.reloadData();

            },

            changeJobWindow: function (event) {
                var me = this, jobId;


                // get job id
                jobId = Number(event.target.innerHTML);

                // stop automatic job chaining
                me.statusPanel.stopChaining = true;


                if (this.currentJobID !== jobId) {
                    me.updateJobScreen(jobId);
                }
            },

            /**
             * Change the job screen
             * @param jobId Current job id
             */
            updateJobScreen: function (jobId) {
                var me = this, jobObject;

                me.currentJobID = jobId;
                me.summaryPanel.createJobSummaryPanel(jobId);

                // get the job object
                jobObject = me.getJobObjectFromId(jobId);
                me.gridPanel.createGrid(jobObject);

                // reset the elements visibility
                me.$el.find('#job_section_grid').show();
                me.$el.find('#sd-job-back').hide();
                me.$el.find('#job-section-message-cli').hide();

                // update tab widget if required
                me.setTabWidget();
            },

            /**s
             * Returns the job mo object from the job id
             * @param jobId
             * @returns {*}
             */
            getJobObjectFromId: function (jobId) {
                var me = this, jobObject;

                if(me.jobWindowMode === me.mode.SINGLE) {
                    return me.jobsTO;
                }

                me.jobsTO.forEach(function (element, index) {
                    if (me.jobsTO[index].id === jobId) {
                        jobObject = me.jobsTO[index];
                        return;
                    }
                });
                return jobObject;
            },

            /**
             * It sets the basic tab contents
             */
            setTabContents: function (index, rec, data) {
                var me = this, tabWidget;

                me.currentRecordForTab = rec;

                // set section title
                me.updateTabSectionTitle(index);

                // set url for views
                me.messageView.setMessageContentsFromRecord(rec, rec[data]);
                /*if (me.gridPanel.isConfigAvailable()) {
                    me.configView.setIFrameURLParams(rec);
                }*/

                me.$el.find('#job_section_grid').hide();
                me.$el.find('#sd-job-back').show();
                me.$el.find('#job-section-message-cli').show();

                // set tab visibility
                tabWidget = me.$el.find('.job-tab-widget');
//                tabWidget.tabs({active: index});
            },
            /**
             * It triggers the view configurtation overlay which internatlly takes care of fetching xml and cli conf..
             *
             */
            viewConfiguration: function(index, rec){
                //var self = this, jobId = rec['job-result-id'];
                var self = this, jobId = rec['job-instance-id'];
                if(jobId){

                    self.overlay = new OverlayWidget({
                        view: new DeviceConfigurationView({
                            activity: self,
                            jobId: jobId,
                            title: self.context.getMessage('device_view_configuration_title')+' '+rec['device-name'],
                            deviceIP : rec['security-device-id'],
                            devicemodid: rec['device-moid']
                        }),
                        //type: "x-large",
                        type: "large",
                        showScrollbar: true
                    });
                    self.overlay.build();
                    // build the progressBar widget, by setting the overlay container to the progressBar container.
                    self.progressBar = new ProgressBarWidget({
                        "container": self.overlay.getOverlayContainer(), // as per new progressbar changes get the overlay container and assign to the progressbar
                        "hasPercentRate": false,
                        "statusText": self.context.getMessage('device_view_configuration_progress_message')
                    }).build();
                }
            },
            /**
             * build the progressBar widget, by setting the overlay container to the progressBar container.
             */
            buildProgressBar: function(){
                var self = this;
                self.progressBar = new ProgressBarWidget({
                    "container": self.overlay.getOverlayContainer(), // as per new progressbar changes get the overlay container and assign to the progressbar
                    "hasPercentRate": false,
                    "statusText": self.context.getMessage('device_view_configuration_progress_message')
                }).build();
            },
            /**
             * Creates tab widge component
             */
            setTabWidget: function () {
                var me = this, tabs, tabWidgetContainer, tabContainerWidget;

                // check config tab if required
                //showConfig = false;//me.gridPanel.isConfigAvailable();

                // get tab containers
                tabWidgetContainer = this.$el.find('.job-tab-widget').empty();

                // create the view
                me.messageView = new MessageView({
                    context: this.activity.getContext()
                });

                /*me.configView = new ConfigView({
                    context: this.activity.getContext()
                });*/

                // set tab config
                tabs = [
                    {
                        id: "message",
                        name: me.gridPanel.panelConfig.tabTitle || me.context.getMessage('job_message_tab_title'),
                        content: me.messageView
                    }/*,
                    {
                        id: "cli",
                        name: me.context.getMessage('job_config_tab_title'),
                        content: me.configView
                    }*/
                ];

                // create wdget
                tabContainerWidget = new TabContainerWidget({
                    "container": tabWidgetContainer,
                    "tabs": tabs
                });
                tabContainerWidget.build();


                /*if (!showConfig) {
                    $(".job-tab-widget ul li:eq(1)").hide();
                } else {
                    // update section header on tab change
                    tabWidgetContainer.on("tabsactivate", function (event, ui) {
                        me.updateTabSectionTitle(ui.newTab.index());
                    });

                }*/

            },

            /**
             * It updates the tab section title based on device name and tab index
             */
            updateTabSectionTitle: function (index) {
                var me = this, tabSection, title, panelConfig;

                // get tab section
                tabSection = me.$el.find('#job-section-message-cli');
                panelConfig = me.gridPanel.panelConfig;

                // get title
                title = index === 0 ? panelConfig.errorPanelTitle : panelConfig.configGridTitle;

                if (me.currentRecordForTab) {
                    tabSection.find('.section_title h5').html(title + ' ' + (me.currentRecordForTab['device-name'] ||
                        me.currentRecordForTab['task-name']));
                }

            }

        });

        return JobView;

    }
);
