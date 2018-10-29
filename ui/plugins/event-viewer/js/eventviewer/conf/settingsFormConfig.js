/**
 *  A configuration object with the parameters required to build 
 *  a EV settings Form
 *  
 *  @module Event Viewer
 *  @author Anupama <athreyas@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */

define([ ], 
	function () {

 	var formConfig = function(context) { 	

 		this.getValues = function() {
            return {		
				"title": context.getMessage("event_viewer_settings_title"),
                "title-help": {
                    "content": context.getMessage("event_viewer_settings_title_help"),
                    "ua-help-text":context.getMessage("more_link"),
                    "ua-help-identifier": context.getHelpKey("EVENT_LOG_SETTINGS_USING")
                },
			    "form_id": "settings_form",
			    "form_name": "settings_form",
			    "err_div_id": "errorDiv",	
			    "on_overlay": true,		    
			    "sections": [
			 	{
		     		"section_id": "general_id",
		            "elements": [
		            {
	                    "element_radio": true,
	                    "id": "timeZoneDisplay",
	                    "label": "Display Time Zone",
	                    "values": [
	                        {
	                            "id": "local",
	                            "name": "timeZone",
	                            "label": "Local",
	                            "value": "1",
	                            "checked": this.localTimeSelection
	                        },
	                        {
	                            "id": "utc",
	                            "name": "timeZone",
	                            "label": "GMT",
	                            "value": "2",
	                            "checked": this.utcTimeSelection		                            
	                        }
	                    ]
	                },
		            {
	                    "element_checkbox": true,
	                    "id": "resolveIP",
	                    "label": "Resolve IP with SD address objects",
	                    "values": [
	                        {
	                            "id": "resolveIP",
	                            "name": "resolveIP",
	                            "value": "false",
	                            "label": "",
	                            "checked": this.resolveIPSelection
	                        }
	                    ]
	            	}]
		    	}
		    	]
            }
		}
    };

    return formConfig;
});	
