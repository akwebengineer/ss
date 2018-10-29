/**
 * A view to manage log stats page
 *
 * @module LogStatisticsView
 * @author aslam a<aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    '../../../../../ui-common/js/views/gridView.js',
    'widgets/timeSeriesChart/timeSeriesChartWidget',
    './../conf/logStatisticsGridConfig.js',
    'widgets/grid/gridWidget',
    './../conf/logStatisticsFormConfig.js',
    'widgets/form/formWidget',
    './../../service/logService.js',
    'text!./../../templates/logStatsView.html',
    'lib/template_renderer/template_renderer',
    'text!../../../../../ui-common/js/common/templates/helpToolTip.html',
    'widgets/tooltip/tooltipWidget'
    ], function (GridView, 
             TimeSeriesChartWidget,
             LogStatisticsGridConfig, 
             GridWidget, 
             LogStatisticsFormConfig,
             FormWidget,
             LogService,
             logStatsViewTemplate,
             render_template,
             HelpTemplate,
             TooltipWidget){

    var LogStatisticsView = GridView.extend({


       events:{ 

                     "click #generate-dump" : "generateDump",
                     "click #logStatRefresh" : "refreshStatGrid"


       },

       generateDump: function(){

               // have to implement

       },

       initialize: function(options) {

                     this.context = options.context;
                     return this;
        },
      
       render:function(){

                        var me = this, graphTitles = [],service = new LogService();
                        graphTitles.push({
                            'graph-title': "EPS Trend"
                        });
                        graphObj = {'ev-log-views': graphTitles,
                                   'title-help' : {"content":this.context.getMessage("log_stat_toolitp"),
                                   "ua-help-text": this.context.getMessage("more_link"),
                                   "ua-help-identifier": this.context.getHelpKey("LOG_MGMT_STATISTIC_TROUBLESHOOTING")},
                            'last-updated-time': ""
                        };
                        
                        logStatisticsHtml = render_template(logStatsViewTemplate, graphObj);
                        me.$el.append(logStatisticsHtml);
                        me.addToolTipHelp(graphObj['title-help']);
                        onStatSuccess = function(response){
                        me.buildGrid(response, me);
                        };

                        service.logStats(onStatSuccess);               
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
            var tooltipView  = render_template(HelpTemplate,{
                'help-content':help['content'],
                'ua-help-text':help['ua-help-text'],
                'ua-help-identifier':help['ua-help-identifier']
            });
            return $(tooltipView);
        },

       buildGrid : function(data , me){

                       var seriesData = [];
                       var totalRecords = data["overall-eps-list"]["total"];
                       var seriesObj = {};
                       seriesObj.points = [];
                       seriesObj.name = "Average EPS";
                       for(var i=(totalRecords-1); i>=0; i--){

                       seriesObj.points.push([

                            data["overall-eps-list"]["overall-eps"][i]["date"],
                            data["overall-eps-list"]["overall-eps"][i]["total-eps"]

                        ]);
                        

                       };
                       seriesData.push(seriesObj);
                     
                       var options = {

                     //  title: 'Average EPS Per Day',
                     //  yAxisTitle: 'Events',
                       timeRangeSelectorEnabled : false,
                       presetTimeRangesEnabled : false,
     
                         data: seriesData
                       };

                       var formConfig = new LogStatisticsFormConfig(me.context),
                       formElements = formConfig.getValues();
                       gridConfig = new LogStatisticsGridConfig(me.context),
                       gridElements = gridConfig.generalConfig();

                       var gridContainer1 =  me.$el.find(".ev-first-bar-chart-view");
                       var timeRangeWidgetObj = new TimeSeriesChartWidget({
                
                       container: gridContainer1,
                       options: options
                
                       });
                       timeRangeWidgetObj.build();
                       this.$el.find(".ev-monitors-main-view .ev-monitors-graph-view").css("width" , "inherit");
                      
                       me.formWidget = new FormWidget({
                       "elements": formElements,
                       "container": me.$el.find('.ev-second-bar-chart-view')
                       });

                       me.formWidget.build();
                       if(seriesData[0] != undefined && seriesData[0]["points"][totalRecords-1] != undefined &&
                          seriesData[0]["points"][totalRecords-1][0] != undefined){
                       me.$el.find("#lastUpdated").html("Last Updated " + new Date(seriesData[0]["points"][totalRecords-1][0]) +"  Chart is updated hourly");}
                       var gridContainer2 = me.$el.find('.statistics_troubleshooting_list').empty();

                       me.gridWidget = new GridWidget({
                       container:gridContainer2,
                       actionEvents: {},
                       elements: gridElements
                       });
 
                       me.gridWidget.build();
                       // var downloadStats = me.$el.find('.download_troubleshooting_dump').empty();
                       // downloadStats.append( "<div class='slipstream-content-title'>Download troubleshooting logs</div>" );
                       // me.$el.find(".statistics_graph").append("<br></br>");
                      // me.$el.find('.slipstream-content-title').css({"margin-bottom" :"0px"});



       },

       refreshStatGrid : function(){

                       var me = this;
                       me.gridWidget.reloadGrid()
                      
       }

    });

    return LogStatisticsView;
});
