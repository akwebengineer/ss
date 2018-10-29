define(['backbone', 'text!../templates/showRawLog.html', 'lib/template_renderer/template_renderer', "text!../../../../ui-common/js/common/templates/helpToolTip.html", "widgets/tooltip/tooltipWidget"], function(Backbone, showRawLogTemplate, TemplateRenderer,HelpTemplate,TooltipWidget){

	var ShowRawLogView = Backbone.View.extend({
		initialize:function(options){
			console.log("Raw Log info : " + options.message);
			this.rawLogInfo = options.message;
			return this;
		},

		render:function(){
			var me = this,heading, showRawLogHTML = TemplateRenderer(showRawLogTemplate, {
                "title": me.options.context.getMessage("show_raw_log_title"),
                "title-help":{
                     "content" : me.options.context.getMessage("show_raw_log_title_help"),
                     "ua-help-text":me.options.context.getMessage("more_link"),
                     "ua-help-identifier":me.options.context.getHelpKey("EVENT_LOG_RAW_VIEW_USING")
                },
				"message": me.rawLogInfo
			});
			this.$el.append(showRawLogHTML);
			if(!me.$el.hasClass("event-viewer")){
				me.$el.addClass("event-viewer");
			}
			heading = {
			  "title-help":{
                 "content" : me.options.context.getMessage("show_raw_log_title_help"),
                 "ua-help-text":me.options.context.getMessage("more_link"),
                 "ua-help-identifier":me.options.context.getHelpKey("EVENT_LOG_RAW_VIEW_USING")
              }
			};
            me.addToolTipHelp(heading['title-help']);

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

	return ShowRawLogView;
});