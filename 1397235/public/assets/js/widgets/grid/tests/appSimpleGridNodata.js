/**
 * A view that uses a configuration object to render a grid widget
 *
 * @module GridView
 * @author Arvind Kannan <arvindkannan@juniper.net>
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */

define([
    'backbone',
    'widgets/grid/gridWidget',
    'widgets/grid/conf/configurationSample',
    'widgets/grid/conf/configurationSampleTree',
    'widgets/grid/tests/view/createPolicyView',
    'widgets/grid/tests/view/gridOverlayView',
    'widgets/grid/tests/models/zonePoliciesModel',
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/view/quickView',
    'widgets/grid/tests/dataSample/rbac',
    'text!widgets/grid/tests/templates/noResultsExample.html',
    'text!widgets/grid/tests/templates/noResultsContent.html',
    'widgets/grid/tests/view/noSearchResultView',
    'mockjax'
], function(Backbone, GridWidget, configurationSample, configurationSampleTree, ZonePoliciesAddView, GridOverlayView, ZonePoliciesModel, firewallPoliciesData, QuickView, rbacData, noResultsExampleTpl, nrTemplate, NoSearchResultView, mockjax){
    var GridView = Backbone.View.extend({

        events:{
            "click #addUser1": "addUser"
        },

        initialize: function () {
            this.mockApiResponse();
            this.actionEvents = {
                addRecord: {
                    capabilities : ['CreateRecord'],
                    name: "addRecord"
                },
                addUser1: {
                    capabilities : ['CreateUser'],
                    name: "addUser1"
                }
            };
            this.bindGridEvents();
            this.render();
        },

        render: function () {
            var self = this;

            function doRefresh() {
                console.log("custom refresh method");
                self.gridWidget.reloadGrid();
            }

            this.$el.append(noResultsExampleTpl);
            this.simpleGridNoResultDefaultMessage();
            this.simpleGridNoResultMessageString();
            this.mvcGridNoResultMessageView();
            this.treeGridNoResultMessageHTMLTemplate();
            this.simpleGridDataLoadErrorMessage();

            return this;
        },
        getGridConfiguration: function () {
          return $.extend(true, {}, configurationSample.simpleGrid);
        },

        simpleGridNoResultDefaultMessage: function() {
            var simpleDefaultMessageGridExtendedConf = {
                "title": "Grid Sample Page To Demonstrate Empty Grid State",
                "subTitle": "Example 1: SIMPLE Grid that displays default message when there exists no users",
                "url": "/api/get-no-data",
                "height": "10%",
                "noResultMessage":
                    {
                        "title":"No users added yet.",
                        "description":"Users you add here will have access to the device via CLI. You can assign<br/>appropriate roles (and choose authentication method below) for users you add here<br/> <a href='#'>Learn more...</a>",
                        "buttons":[{
                            "key": "addRecord",
                            "id": "addRecord",
                            "value": "Add Record",
                            "isInactive": true  // The button is a secondary type but RBAC has it on false, so it will be rendered with display none.
                        },{
                            "key": "addUser1",
                            "value": "Add User"
                        }]
                    }
            };
            this.gridWidget1 = new GridWidget({
                container: this.$el.find('#grid1'),
                elements: $.extend(this.getGridConfiguration(), simpleDefaultMessageGridExtendedConf),
                actionEvents:this.actionEvents,
                rbacData: rbacData
            }).build();
        },
        addUser: function(){
            this.gridWidget1.addRow(firewallPoliciesData.oneRow);
        },

        simpleGridNoResultMessageString: function () {
            var simpleGridExtendedConf = {
                "title": "",
                "subTitle": "Example 2: SIMPLE Grid that has no data, empty state displayed from String",
                "url": "/api/get-no-data",
                "noResultMessage": "<div class='no-content-wrapper'><div class='grid-no-content-title'>There are no records to display.</div><div class='grid-no-content-description'>(This information was a string, passed in the grid configuration)</div></div>",
                "height": "10%"
            };
            this.gridWidget2 = new GridWidget({
                container: this.$el.find('#grid2'),
                elements: $.extend(this.getGridConfiguration(), simpleGridExtendedConf)
            }).build();
        },

        mvcGridNoResultMessageView: function() {
            var modelViewGridExtendedConf = {
                "title": "",
                "subTitle": "Example 3: MVC Grid that has no data, empty state displayed from VIEW",
                "url": "/api/get-no-data",
                "noResultMessage": function(){
                    return new NoSearchResultView(); //a view or html
                },
                "height": "150"
            };
            this.gridWidget3 = new GridWidget({
                container: this.$el.find('#grid3'),
                elements: $.extend(configurationSample.modelViewGrid, modelViewGridExtendedConf)
            }).build();
        },

        treeGridNoResultMessageHTMLTemplate: function() {
            var configurationSampleTreeExtendedConf = {
                "title": "",
                "subTitle": "Example 4: TREE Grid that has no data, empty state displayed from TEMPLATE",
                "url": "/api/get-error-data",
                "jsonRoot": "",
                "noResultMessage": nrTemplate,
                "jsonRecords": function (data) {
                    return 0;
                },
                "height": "40%"
            };
            $.extend(configurationSampleTree.treeGrid, configurationSampleTreeExtendedConf);
            this.gridWidget4 = new GridWidget({
                container: this.$el.find('#grid4'),
                elements: configurationSampleTree.treeGrid
            }).build();
        },

        simpleGridDataLoadErrorMessage: function() {
            var simpleErrorGridExtendedConf = {
                "title": "",
                "subTitle": "Example 5: SIMPLE Grid that displays error message when data could not be retrieved",
                "url": "/api/get-no-data",
                "height": "20%"
            };
            this.gridWidget5 = new GridWidget({
                container: this.$el.find('#grid5'),
                elements: $.extend(this.getGridConfiguration(), simpleErrorGridExtendedConf)
            }).build();
        },

        bindGridEvents: function () {
            var self = this;
            this.$el
                .bind(this.actionEvents.addUser1.name, function(e){
                    console.log("~~~~~~ADD USER~~~~~~");
                })
                .bind(this.actionEvents.addRecord.name, function(e){        // because of RBAC, the event won't be triggered
                    console.log("~~~~~~ADD RECORD~~~~~~");
                });
        },


        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-no-data',
                dataType: 'json',
                response: function(settings) {
                    this.responseText = {};
                },
                responseTime: 10
            });
        }
    });

    return GridView;
});