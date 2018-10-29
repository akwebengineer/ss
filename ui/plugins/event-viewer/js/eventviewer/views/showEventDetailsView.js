/**
 *  Show event details - context menu option
 *  
 *  @module EventViewer
 *  @author Anupama<athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
 define(['backbone', 
       'text!../templates/showEventDetails.html', 
       'lib/template_renderer/template_renderer', 
       '../service/eventViewerService.js', 
       "text!../../../../ui-common/js/common/templates/helpToolTip.html",
       "widgets/tooltip/tooltipWidget", 
       "../../../../ui-common/js/common/utils/filterUtil.js"],
 	function(Backbone, showEventDetailsTemplate, TemplateRenderer, EventViewerService,HelpTemplate,TooltipWidget, FilterUtil){

	var ShowEventDetailsView = Backbone.View.extend({
		initialize:function(options){
			this.data = options.data;
			this.service = new EventViewerService({});
			this.filterUtil =  new FilterUtil();
			return this;
		},
		onSuccess:function(resp){
			var me = this, localTime = new Date(me.data.timestamp).toLocaleString(),
				utcTime = new Date(me.data.timestamp).toUTCString(), showEventDetailsHTML,heading,
				srcHostName = "", natSrcHostName = "", dstHostName = "", natDstHostName = "";

			var response = resp.responseJSON.addresses.address, length = response.length;
			for(var i = 0; i < length; i++){
				if(response[i]['ip-address'] == me.data[me.filterUtil.LC_KEY.SOURCE_ADDRESS]){
					srcHostName = response[i].name;
				}
				if(response[i]['ip-address'] == me.data[me.filterUtil.LC_KEY.DESTINATION_ADDRESS]){
					dstHostName = response[i].name;
				}
				if(response[i]['ip-address'] == me.data[me.filterUtil.LC_KEY.NAT_SOURCE_ADDRESS]){
					natSrcHostName = response[i].name;
				}
				if(response[i]['ip-address'] == me.data[me.filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS]){
					natDstHostName = response[i].name;
				}
			}
			showEventDetailsHTML = TemplateRenderer(showEventDetailsTemplate, {
                "title": me.options.context.getMessage("show_event_details"),
                "title-help":{
                     "content" : me.options.context.getMessage("log_details_title_help"),
                     "ua-help-text":me.options.context.getMessage("more_link"),
                     "ua-help-identifier":me.options.context.getHelpKey("EVENT_LOG_DETAILED_VIEW_USING")
                },
                "eventTypeLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.EVENT_TYPE)), 
                "eventType": me.data[me.filterUtil.LC_KEY.EVENT_TYPE],
				"appLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.APPLICATION)), 
				"app": me.data[me.filterUtil.LC_KEY.APPLICATION],
				"dstIpLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.DESTINATION_ADDRESS)), 
				"dstIp": me.data[me.filterUtil.LC_KEY.DESTINATION_ADDRESS],
				"dstPortLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.DESTINATION_PORT)), 
				"dstPort": me.data[me.filterUtil.LC_KEY.DESTINATION_PORT],
				"eventCategoryLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.EVENT_CATEGORY)), 
				"eventCategory": me.data[me.filterUtil.LC_KEY.EVENT_CATEGORY],
				"logSrcLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.HOST)), 
				"logSrc": me.data[me.filterUtil.LC_KEY.HOST],
				"logIdLabel" : "Event ID", 
				"logId": me.data.id,
				"severityLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.THREAT_SEVERITY)), 
				"severity": me.data[me.filterUtil.LC_KEY.THREAT_SEVERITY],
				"srcIpLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SOURCE_ADDRESS)), 
				"srcIp": me.data[me.filterUtil.LC_KEY.SOURCE_ADDRESS],
				"srcPortLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SOURCE_PORT)), 
				"srcPort": me.data[me.filterUtil.LC_KEY.SOURCE_PORT],
				"hostNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SYSLOG_HOST_NAME)), 
				"hostName": me.data[me.filterUtil.LC_KEY.SYSLOG_HOST_NAME],
				"localTimeLabel": "Local Time", 
				"localTime": localTime,
				"utcTimeLabel": "UTC Time", 
				"utcTime": utcTime,
				"userNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.USER_NAME)), 
				"userName": me.data[me.filterUtil.LC_KEY.USER_NAME],
				"dstZoneLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.DESTINATION_ZONE_NAME)), 
				"dstZone": me.data[me.filterUtil.LC_KEY.DESTINATION_ZONE_NAME],
				"nestedAppLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NESTED_APPLICATION)), 
				"nestedApp": me.data[me.filterUtil.LC_KEY.NESTED_APPLICATION],
				"protocolIdLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.PROTOCOL_ID)), 
				"protocolId": me.data[me.filterUtil.LC_KEY.PROTOCOL_ID],
				"reasonLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.REASON)), 
				"reason": me.data[me.filterUtil.LC_KEY.REASON],
				"rolesLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.ROLES)), 
				"roles": me.data[me.filterUtil.LC_KEY.ROLES], 
				"serviceLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SERVICE_NAME)), 
				"service": me.data[me.filterUtil.LC_KEY.SERVICE_NAME],
				"srcZoneLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SOURCE_ZONE_NAME)), 
				"srcZone": me.data[me.filterUtil.LC_KEY.SOURCE_ZONE_NAME],
				"policyNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.POLICY_NAME)), 
				"policyName": me.data[me.filterUtil.LC_KEY.POLICY_NAME],
				"natSrcIpLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NAT_SOURCE_ADDRESS)), 
				"natSrcIp" : me.data[me.filterUtil.LC_KEY.NAT_SOURCE_ADDRESS],
				"natSrcPortLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NAT_SOURCE_PORT)), 
				"natSrcPort" : me.data[me.filterUtil.LC_KEY.NAT_SOURCE_PORT],
				"natDstIpLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS)), 
				"natDstIp" : me.data[me.filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS],
				"natDstPortLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NAT_DESTINATION_PORT)), 
				"natDstPort" : me.data[me.filterUtil.LC_KEY.NAT_DESTINATION_PORT],
				"srcAddrLabel" : "Address", 
				"srcAddr" : srcHostName,
				"dstAddrLabel" : "Address", 
				"dstAddr" : dstHostName,
				"natSrcAddrLabel" : "NAT Address", 
				"natSrcAddr" : natSrcHostName,
				"natDstAddrLabel" : "NAT Address", 
				"natDstAddr" : natDstHostName,
				"srcCountryLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SOURCE_COUNTRY_NAME)), 
				"srcCountry" : me.data[me.filterUtil.LC_KEY.SOURCE_COUNTRY_NAME],
				"dstCountryLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.DESTINATION_COUNTRY_NAME)), 
				"dstCountry" : me.data[me.filterUtil.LC_KEY.DESTINATION_COUNTRY_NAME],
				"urlLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.URL)), 
				"url" : me.data[me.filterUtil.LC_KEY.URL],
				"attackNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.ATTACK_NAME)), 
				"attackName" : me.data[me.filterUtil.LC_KEY.ATTACK_NAME],
				"sessionIDLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SESSION_ID_32)), 
				"sessionID" : me.data[me.filterUtil.LC_KEY.SESSION_ID_32],
				"ruleNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.RULE_NAME)), 
				"ruleName" : me.data[me.filterUtil.LC_KEY.RULE_NAME],
				"lsysNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME)), 
				"lsysName" : me.data[me.filterUtil.LC_KEY.LOGICAL_SYSTEM_NAME],
				"utmCategoryLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.NAME)), 
				"utmCategory" : me.data[me.filterUtil.LC_KEY.CATEGORY],
				
				"objNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.OBJECT_NAME)), 
				"objName" : me.data[me.filterUtil.LC_KEY.OBJECT_NAME],
				"profileNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.PROFILE_NAME)), 
				"profileName" : me.data[me.filterUtil.LC_KEY.PROFILE_NAME],
				"pathNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.PATH_NAME)), 
				"pathName" : me.data[me.filterUtil.LC_KEY.PATH_NAME],
				"natSrcRuleNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME)), 
				"natSrcRuleName" : me.data[me.filterUtil.LC_KEY.SOURCE_NAT_RULE_NAME],
				"natDstRuleNameLabel" : me.options.context.getMessage(me.filterUtil.getUIKey(me.filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME)), 
				"natDstRuleName" : me.data[me.filterUtil.LC_KEY.DESTINATION_NAT_RULE_NAME]
            });
			me.$el.append(showEventDetailsHTML);
			if(!me.$el.hasClass("event-viewer")){
				me.$el.addClass("event-viewer");
			}
            heading = {
                "title-help":{
                     "content" : me.options.context.getMessage("log_details_title_help"),
                     "ua-help-text":me.options.context.getMessage("more_link"),
                     "ua-help-identifier":me.options.context.getHelpKey("EVENT_LOG_DETAILED_VIEW_USING")
                }
            };
            me.addToolTipHelp(heading['title-help']);

		},

		render:function(){
			var me = this, ipList = [];
			ipList.push(me.data[me.filterUtil.LC_KEY.SOURCE_ADDRESS]);
			ipList.push(me.data[me.filterUtil.LC_KEY.DESTINATION_ADDRESS]);
			ipList.push(me.data[me.filterUtil.LC_KEY.NAT_SOURCE_ADDRESS]);
			ipList.push(me.data[me.filterUtil.LC_KEY.NAT_DESTINATION_ADDRESS]);
			me.service.resolveIPAddresses(ipList, me.onSuccess.bind(me));
			return this;
		},
       addToolTipHelp: function(help){
            var me=this;
            new TooltipWidget({
                "elements": {
                    "interactive": true,
                    "maxWidth": 300,
                    "minWidth": 300,
                    "position": "right"
                },
                "container": me.$el.find('.ua-field-help'),
                "view": me.getToolTipView(help)
            }).build();
        },
        getToolTipView: function(help){
            var tooltipView  = TemplateRenderer(HelpTemplate,{
                'help-content':help['content'],
                'ua-help-text':help['ua-help-text'],
                'ua-help-identifier':help['ua-help-identifier']
            });
            return $(tooltipView);
        }
	});

	return ShowEventDetailsView;
});