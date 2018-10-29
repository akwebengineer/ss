define([
    'explorer/widgets/js/form',
    'widgets/tooltip/tooltipWidget'
], function(FormView,TooltipWidget){
    var formExt = FormView.extend({

        
        addMoreCode: function(){
            var matcherConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var matcherFunc  = "<pre>function (params, data) {\n \
            if ($.trim(params.term) === '') {\n\
                return data;\n\
            }\n\
            if (data.text.indexOf(params.term) > -1) {\n\
                var modifiedData = $.extend({}, data, true);\n\
                modifiedData.text += ' (matched)';\n \
                return modifiedData;\n\
            }\n\
            return null;\n\
            }</pre>";

            this.tooltipWidgetMatcher = new TooltipWidget({
                "elements": matcherConfig,
                //"container": this.$el.find('#matcher').children().find('label'),
                "container": this.$el.find('#setMatcher'),
                "view": matcherFunc
            });
            this.tooltipWidgetMatcher.build();

            // onChange tooltip
            var changeConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var changeFunc  = "<pre>function(data) {\n\
                alert('data changed');\n\
            }</pre>";

            this.tooltipWidgetChange = new TooltipWidget({
                "elements": changeConfig,
                "container": this.$el.find('#onChange'),
                "view": changeFunc
            });
            this.tooltipWidgetChange.build();

            //template result tooltip
            var templateResultConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var templateResultFunc  = '<pre>function (data){\n\
                if (!data.id) {\n\
                    return data.text;\n\
                }\n\
                var mySelect = data.text;\n\
                var $myCustomHtml = $("<span><img src="/assets/images/error.png"/> " + mySelect + "</span>");\n\
                return $myCustomHtml;\n\
            }</pre>';
            this.tooltipWidgetTemplateResult = new TooltipWidget({
                "elements": templateResultConfig,
                "container": this.$el.find('#templateResult'),
                "view": templateResultFunc
            });
            this.tooltipWidgetTemplateResult.build();

            //template selector tooltip
             var templateSelectionConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var templateSelectionFunc  = '<pre>function (data) {  \n return data.name || data.text; \n}</pre>';
            this.tooltipWidgetTemplateSelection = new TooltipWidget({
                "elements": templateSelectionConfig,
                "container": this.$el.find('#templateSelection'),
                "view": templateSelectionFunc
            });
            this.tooltipWidgetTemplateSelection.build();
        }
        
       

    });


    return formExt;
});