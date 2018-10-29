/**
 * extending jobview with minimun action implementation
 *
 * @module user firewall management job view
 * @author vinayms
 * @copyright Juniper Networks, Inc. 2016
 */
define(
    [
        'widgets/overlay/overlayWidget',
        './JobView.js',
        './userFwdeployConfFormView.js'
    ],

    function (OverlayWidget, JobView, DeployConfigurationFormView) {


        var JobView = JobView.extend({

            /**
             *  used by user firewall manager job to display error message
             * @param index
             * @param job
             */
            setUserFwManagementTabContents: function(index, job){
                var me = this, tabWidget, msg = job['xml-data-reply'];

                me.currentRecordForTab = job;

                // set section title
                me.updateTabSectionTitle(index);

                // set url for views
                me.messageView.setMessageContentsFromRecord({}, me.formatXMLtoHTML(msg));

                me.$el.find('#job_section_grid').hide();
                me.$el.find('#sd-job-back').show();
                me.$el.find('#job-section-message-cli').show();

                // set tab visibility
                tabWidget = me.$el.find('.job-tab-widget');

            },
            // prepraing data for displaying as HTML
            /**
             * sample input:
             * "Failed to validate the device configuration.Response from Device:
             <xnm:warning xmlns=\"http:\/\/xml.juniper.net\/xnm\/1.1\/xnm\" xmlns:xnm=\"http:\/\/xml.juniper.net\/xnm\/1.1\/xnm\">\n
             <source-daemon>mgd<\/source-daemon>\n<filename>\/config\/license\/JUNOS722660.lic<\/filename>\n<line-number>1<\/line-number>\n
             <message>JUNOS722660: license is for device: [CX3315AN0027], serial number of device is: [CX5015AF0029]<\/message>\n
             <rpc-error>\n<error-type>application<\/error-type>\n<error-tag>invalid-value<\/error-tag>\n<error-severity>error<\/error-severity>\n
             <error-path>[edit access profile ap ldap-server host1 routing-instance]<\/error-path>\n
             <error-message>mgd: referenced routing-instance must be defined<\/error-message>\n<error-info>\n
             <bad-element>routing-instance Juniper-WF<\/bad-element>\n<\/error-info>\n<\/rpc-error>\n<rpc-error>\n
             <error-type>protocol<\/error-type>\n<error-tag>operation-failed<\/error-tag>\n<error-severity>error<\/error-severity>\n
             <error-message>\ncommit failed: (statements constraint check failed)\n<\/error-message>\n<\/rpc-error>"

             output:
             "Failed to validate the device configuration.Response from Device:
             &#060;xnm:warning xmlns="http://xml.juniper.net/xnm/1.1/xnm" xmlns:xnm="http://xml.juniper.net/xnm/1.1/xnm"&#062;<br/>
             &#060;source-daemon&#062;mgd&#060;/source-daemon&#062;<br/>&#060;filename&#062;/config/license/JUNOS722660.lic&#060;/filename&#062;<br/>
             &#060;line-number&#062;1&#060;/line-number&#062;<br/>&#060;message&#062;JUNOS722660: license is for device: [CX3315AN0027], serial number of device is: [CX5015AF0065]&#060;/message&#062;<br/>
             &#060;/xnm:warning&#062;<br/>&#060;xnm:warning xmlns="http://xml.juniper.net/xnm/1.1/xnm" xmlns:xnm="http://xml.juniper.net/xnm/1.1/xnm"&#062;<br/>
             &#060;source-daemon&#062;mgd&#060;/source-daemon&#062;<br/>&#060;filename&#062;/config/license/JUNOS722661.lic&#060;/filename&#062;<br/>
             &#060;line-number&#062;1&#060;/line-number&#062;<br/>&#060;message&#062;JUNOS722661: license is for device: [CX3315AN0027], serial number of device is: [CX5015AF0065]&#060;/message&#062;<br/>
             &#060;error-severity&#062;error&#060;/error-severity&#062;<br/>&#060;error-path&#062;[edit access profile ap ldap-server host1 routing-instance]&#060;/error-path&#062;<br/>
             &#060;error-message&#062;mgd: referenced routing-instance must be defined&#060;/error-message&#062;<br/>&#060;error-info&#062;<br/>
             &#060;bad-element&#062;routing-instance Juniper-WF&#060;/bad-element&#062;<br/>&#060;/error-info&#062;<br/>&#060;/rpc-error&#062;<br/>
             &#060;rpc-error&#062;<br/>&#060;error-type&#062;protocol&#060;/error-type&#062;<br/>&#060;error-tag&#062;operation-failed&#060;/error-tag&#062;<br/>
             &#060;error-severity&#062;error&#060;/error-severity&#062;<br/>&#060;error-message&#062;<br/>commit failed: (statements constraint check failed)<br/>
             &#060;/error-message&#062;<br/>&#060;/rpc-error&#062;"
             * @param msg
             * @returns {*}
             */
            formatXMLtoHTML: function(msg){
                // prepraing data for displaying as HTML
                if(msg){
                    msg = msg.replace(/</g, "&#060;");
                    msg = msg.replace(/>/g, "&#062;");
                    msg = msg.replace(/&#062;&#060;/g, "&#062;<br/>&#060;");
                    msg = msg.replace(/\n/g, "<br/>");
                    msg = msg.replace(/&#060;rpc-reply/g, "<br/>&#060;rpc-reply");
                    // highlight error msg with red.
                    msg = msg.replace(/&#060;rpc-error&#062;/g, "<font color='red'>&#060;rpc-error&#062;");
                    msg = msg.replace(/&#060;\/rpc-error&#062;/g, "&#060;/rpc-error&#062;</font>");
                }
                return msg;
            },
            /**
             *   triggered on click of view configuration action of user firewall management job
             */
            userFwManagmentDeviceViewConf: function(selectedDevice){
                var options= {},
                    self = this,
                    selectedDevices = [selectedDevice];
                if (selectedDevices.length>0){
                    options={
                        jobId: selectedDevices[0]['id'],
                        deviceName: selectedDevices[0]['name'],
                        objType: (self.jobsTO['job-type'] && self.jobsTO['job-type'].includes("Active Directory")) ? 'activeDirectory' : 'accessProfile'
                    };
                    self.getDeployConfig(options);
                }
            },
            /**
             * build preview conf overlay
             * @param options
             */
            getDeployConfig:function(options){
                var self = this;
                self.overlay = new OverlayWidget({
                    view: new DeployConfigurationFormView({
                        activity: self,
                        title: self.context.getMessage('device_view_configuration_title')+' '+options.deviceName,
                        jobId: options.jobId,
                        objType: options.objType
                    }),
                    type: "large",
                    showScrollbar: true
                });
                self.overlay.build();
                self.buildProgressBar();
            }

        });

        return JobView;

    }
);
