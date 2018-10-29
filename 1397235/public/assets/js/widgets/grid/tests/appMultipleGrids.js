/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, ZonePoliciesAddView, ZonePoliciesModel, firewallPoliciesData, mockjax){
    var GridView = Backbone.View.extend({

        events: {
            "click .getSelection": "getSelection"
        },

        initialize: function () {
            this.mockApiResponse();
            //inline css and parent availability are tested so this page can be rendered in the grid test page and in Slipstream
            this.$el.css("height", "inherit");
            if (this.$el.parent().length) { //only for grid test page
                this.render();
            }
        },

        render: function () {
            var smallGrid0 = _.extend({}, configurationSample.smallGrid);
            new GridWidget({
                container: this.el,
                elements: _.extend(smallGrid0, {
                    "title": "Multiple Grid Sample Page for Height in Percentage (50%-20%-30%)",
                    "height": "50%"
                })
            }).build();

            var smallGrid1 = _.extend({}, configurationSample.smallGrid);
            delete smallGrid1.title;
            new GridWidget({
                container: this.el,
                elements: _.extend(smallGrid1, {
                    "subTitle": "Small Grid 1",
                    "footer": false,
                    "height": "20%"
                })
            }).build();

            var smallGrid2 = _.extend({}, configurationSample.smallGrid);
            delete smallGrid2.title;
            new GridWidget({
                container: this.el,
                elements: _.extend(smallGrid2 , {
                    "subTitle": "Small Grid 2",
                    "footer": true,
                    "height": "30%"
                })
            }).build();

            return this;
        },

        getSelection: function(){
            console.log(this.grid.getSelectedRows());
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    console.log('parameters in the mockjack request: ' + settings.data);
                    if (typeof settings.data == 'string'){
                        var urlHash = {},
                            seg = settings.data.split('&');
                        for (var i=0;i<seg.length;i++) {
                            if (!seg[i]) { continue; }
                            var s = seg[i].split('=');
                            urlHash[s[0]] = s[1];
                        }
                        switch(urlHash['_search']){
                            case "PSP":
                                this.responseText = firewallPoliciesData.firewallPoliciesFiltered;
                                break;
                            case "NoData":
                                this.responseText = firewallPoliciesData.noDataResponse;
                                break;
                            default:
                                this.responseText = firewallPoliciesData.firewallPoliciesAll;
                        }
                    }
                    else {
                        this.responseText = firewallPoliciesData.firewallPoliciesAll;
                    }
                },
                responseTime: 10
            });
            $.mockjax({
                url: /^\/api\/data-sample\/client\/([a-zA-Z0-9\-\_]+)$/,
                urlParams: ["client"],
                response: function(settings) {
                    var client = settings.urlParams.client,
                        clients = ["test","test2","test3"];
                    this.responseText = "true";
                    if ($.inArray(client, clients) !== -1) {
                        this.responseText = "false";
                    }
                },
                responseTime: 100
            });
        }

    });

    return GridView;
});