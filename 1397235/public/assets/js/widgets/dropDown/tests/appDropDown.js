/**
 * A view that uses the Drop Down Widget to render drop downs from a configuration object
 * The configuration object contains the container, options of the select, and other parameteres required to build the widget.
 *
 * @module DropDown View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/dropDown/dropDownWidget',
    'widgets/dropDown/tests/view/addView',
    'widgets/dropDown/tests/model/remoteData',
    'text!widgets/dropDown/tests/templates/dropDownExample.html',
    'widgets/dropDown/tests/dataSample/sampleData',
    'lib/template_renderer/template_renderer'
], function(Backbone, DropDownWidget, AddView, RemoteData, example, sampleData, render_template){
    var DropDownView = Backbone.View.extend({


        events: {
            'click #btn-setValRemote': 'addDropDownVal',
            'click #btn-getValRemote': 'getDropDownValRemote',
            'click #btn-setValLocal': 'setDropDownValLocal',
            'click #btn-getValLocal': 'getDropDownValLocal',
            'click #btn-disableItem': 'disableItem',
            'click #btn-enableItem': 'enableItem',
            'click #btn-disableDropdown': 'disableDropdown',
            'click #btn-enableDropdown': 'enableDropdown',
            'click #btn-disableSmallDropdown': 'disableSmallDropdown',
            'click #btn-enableSmallDropdown': 'enableSmallDropdown',
            'click #btn-disableItemMultiArr': 'disableDropDownValLocalMultiArr',
            'click #btn-enableItemMultiArr': 'enableDropDownValLocalMultiArr',
            'click #btn-setValLocalMultiArr': 'setDropDownValLocalMultiArr',
            'click #btn-setValLocalMultiObj': 'setDropDownValLocalMultiObj',
            'click #btn-getValLocalMultiObj': 'getDropDownValLocalMultiObj',
            'click #btn-openDropdown': 'openDropdown',
            'click #btn-closeDropdown': 'closeDropdown'
        },

        widgets: {},

        initialize: function () {
            this.addContent(this.$el, example);
            new RemoteData();
            this.containers = {
                basicNoData: this.$el.find('.basic-selection-nodata'),
                basicData: this.$el.find('.basic-selection-data'),
                basicDataSetValue: this.$el.find('.basic-selection-data-setValue'),
                basicTemplate: this.$el.find('.basic-template'),
                multipleEmpty: this.$el.find('.multiple-selection-empty'),
                multipleDefault: this.$el.find('.multiple-selection-default'),
                multipleDefaultTokens: this.$el.find('.multiple-selection-default-tokens'),
                simpleDataInfiniteScroll: this.$el.find('.simple-selection-infinite-scroll'),
                simpleMappingDataInfiniteScroll: this.$el.find('.simple-mapping-data-infinite-scroll'),
                remoteDropdownContainer: this.$el.find('.simple-selection-infinite-scroll-setVal'),
                remoteDropdownContainerReformattedURL: this.$el.find('.remote-data-formatter-url'),
                remoteDropdownContainerPostMethod: this.$el.find('.remote-data-post-method'),
                selectionWithSmallWidth: this.$el.find('.selection-small-width'),
                selectionWithMediumWidth: this.$el.find('.selection-medium-width'),
                selectionWithConfiguredWidth: this.$el.find('.selection-configured-width'),
                selectionWithLargeWidth: this.$el.find('.selection-large-width'),
                selectionWithSmallHeight: this.$el.find('.basic-selection-small-height'),
                multipleMaxHeight: this.$el.find('.multiple-selection-max-height')
            };
            !this.options.pluginView && this.render();
        },

        render: function () {
            var self = this;
            var dropdownTooltipTemplate = {
                "functionBefore": this.dropdownTooltip_template
            };

            var dropdownTooltipObj = {
                "functionBefore": this.dropdownTooltip
            };

            new DropDownWidget({
                "container": this.containers.basicNoData,
                "showCheckboxes": true,
                "allowClearSelection":true,
                "placeholder": "Select an option",
                "dropdownTooltip": dropdownTooltipTemplate
            }).build();


            new DropDownWidget({
                "container": this.containers.basicData,
                "data": sampleData.tooltipData,
                "enableSearch": true,
                "matcher": this.newMatcher,
                "onChange": this.setValCb ,
                "dropdownTooltip": true,
                "width": 'large'
            }).build();

            new DropDownWidget({
                "container": this.containers.selectionWithSmallWidth,
                "allowClearSelection":true,
                "placeholder": "Select an option",
                "width": 'small'
            }).build();

            new DropDownWidget({
                "container": this.containers.selectionWithMediumWidth,
                "allowClearSelection":true,
                "placeholder": "Select an option",
                "width": 'medium'
            }).build();

            new DropDownWidget({
                "container": this.containers.selectionWithLargeWidth,
                "allowClearSelection":true,
                "placeholder": "Select an option",
                "width": 'large'
            }).build();

            new DropDownWidget({
                "container": this.containers.selectionWithConfiguredWidth,
                "allowClearSelection":true,
                "placeholder": "Select an option",
                "width": 700
            }).build();

            self.widgets.smallSize = new DropDownWidget({
                "container": this.containers.selectionWithSmallHeight,
                "allowClearSelection":true,
                "height": "small",
                "width": "auto"
            }).build();

            self.widgets.basicDataSetValueWidget = new DropDownWidget({
                "container": this.containers.basicDataSetValue,
                "data": sampleData.confData,
                "enableSearch": true,
                "matcher": this.newMatcher,
                "width": 'large'
            });

            self.widgets.basicDataSetValueWidget.build();

            self.widgets.templateDropdownWidget = new DropDownWidget({
                "container": this.containers.basicTemplate,
                "data": sampleData.confData,
                "templateResult": self.templateResult,
                "dropdownTooltip": dropdownTooltipObj,
                "width": 'large'
            }).build();

            self.widgets.multiEmpty = new DropDownWidget({
                "container": this.containers.multipleEmpty,
                "data": sampleData.short,
                "multipleSelection": {
                    allowClearSelection: true
                },
                "showCheckboxes": true,
                "placeholder": "Select an option",
                "dropdownTooltip": dropdownTooltipObj,
                "width": 'large'
            });

            self.widgets.multiEmpty.build();

            this.$el.find("#resetData").on("click",function(){
                self.widgets.multiEmpty.addData(sampleData.twoFields, true);
            });
            this.$el.find("#appendData").on("click",function(){
                self.widgets.multiEmpty.addData(sampleData.short);
            });

            self.widgets.multipleDefault = new DropDownWidget({
                "container": this.containers.multipleDefault,
                "data": sampleData.confData,
                "multipleSelection": {
                    maximumSelectionLength: 2,
                    allowClearSelection: true
                },
                "placeholder": "Select an option",
                "width": 'large'
            });
            self.widgets.multipleDefault.build();

            self.widgets.multipleDefaultTokens = new DropDownWidget({
                "container": this.containers.multipleDefaultTokens,
                "data": sampleData.confData,
                "multipleSelection": {
                    maximumSelectionLength: 15,
                    createTags: true,
                    allowClearSelection: true
                },
                "placeholder": "Select an option",
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large'
            });

            self.widgets.multipleDefaultTokens.build();

            self.widgets.multipleMaxHeight = new DropDownWidget({
                "container": this.containers.multipleMaxHeight,
                "data": sampleData.confData,
                "multipleSelection": {
                    maximumSelectionLength: 15,
                    createTags: true,
                    allowClearSelection: true
                },
                "placeholder": "Select an option",
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large',
                "maxHeight": 60
            });

            self.widgets.multipleMaxHeight.build();

            new DropDownWidget({
                //example that shows the virtual scroll along with search.
                "container": this.containers.simpleDataInfiniteScroll,
                "enableSearch": true,
                "initValue": {
                    "id": 131074,
                    "text": "Any-IPv6"
                },
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",

                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){console.log("call succeeded")},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResult,
                "templateSelection": this.formatRemoteResultSelection,
                "onChange": this.setValCb,
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large'
            }).build();

            new DropDownWidget({
                //example that shows the virtual scroll along with mappingData.
                "container": this.containers.simpleMappingDataInfiniteScroll,
                "initValue": {
                    "id": 131074,
                    "text": "Any-IPv6"
                },
                "remoteData": {
                    "url": "/api/dropdown/getRemoteMappingData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",
                    "reformatData": this.reformatData,
                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){
                        console.log("call succeeded");
                        console.log(data);
                    },
                    "error": function(){console.log("error while fetching data")}
                },
                "onChange": this.setValCb,
                "width": 'large'
            }).build();

            self.widgets.remoteDropdown = new DropDownWidget({
                //example that shows loading data in dropdown using AJAX, setting inital value to the drop down and adding new values to the dropdown
                "container": this.containers.remoteDropdownContainer,
                "enableSearch": false,
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "numberOfRows": 10,
                    "jsonRoot": "data",
                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "success": function(data){console.log("call succeeded" + JSON.stringify(data.data))},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResultAddDropDownData,
                "templateSelection": this.formatRemoteResultSelection,
                "onChange": this.setValCb,
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large'
            });

            self.widgets.remoteDropdown.build();


            // Set Initial Value - An alternate way to initValue
            self.widgets.remoteDropdown.setValue({
                "id": "rtsp",
                "text": "junos-rtsp"
            });

            new DropDownWidget({
                //example that shows loading data in dropdown using AJAX, setting inital value to the drop down and adding new values to the dropdown
                "container": this.containers.remoteDropdownContainerReformattedURL,
                "enableSearch": false,
                "remoteData": {
                    "url": "/api/dropdown/getRemoteData",
                    "jsonRoot": "data",
                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "reformatURL": function(originalUrl) {
                        return {
                            size: 3
                        };
                    },
                    "success": function(data){console.info("call succeeded again" + JSON.stringify(data.data))},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResultAddDropDownData,
                "templateSelection": this.formatRemoteResultSelection,
                "onChange": this.setValCb,
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large'
            }).build();

            new DropDownWidget({
                //example that shows loading data in dropdown using AJAX, setting inital value to the drop down and adding new values to the dropdown
                "container": this.containers.remoteDropdownContainerPostMethod,
                "enableSearch": false,
                "remoteData": {
                    "url": "/api/dropdown/remoteDataPostCall",
                    "type": "POST",
                    "jsonRoot": "data",
                    "jsonRecords": function(data) {
                        return data.data;
                    },
                    "data": function (params) {
                        var _params = {
                            filter: "unos"
                        }
                        return _params;
                    },
                    "success": function(data){console.info("call succeeded again" + JSON.stringify(data.data))},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResultAddDropDownData,
                "templateSelection": this.formatRemoteResultSelection,
                "onChange": this.setValCb,
                "dropdownTooltip": dropdownTooltipTemplate,
                "width": 'large'
            }).build();

            return this;
        },
        reformatData: function(data){
            var formattedData = [];
            $.each( data, function( i, val ) {
                var obj = $.extend( {}, val );
                obj.id = val['uuid'];
                obj.text = val['name'];
                formattedData.push(obj);
            });

            return formattedData;
        },

        formatRemoteResult: function (data) {
            var markup = data.text;
            return markup;
        },

        formatRemoteResultSelection: function (data) {
            return data.name || data.text;
        },

        newMatcher: function (params, data) {
            // if there are no search terms, return all of the data
            if ($.trim(params.term) === '') {
                return data;
            }

            // params.term should be the term that is used for searching and data.text is the text that is displayed for the data object
            if (data.text.indexOf(params.term) > -1) {
                var modifiedData = $.extend({}, data, true);
                modifiedData.text += ' (matched)'; //return search with modified object
                return modifiedData;
            }

            // return 'null' if the term should not be displayed
            return null;
        },

        templateResult: function (data){
            if (!data.id) {
                return data.text;
            }
            var mySelect = data.text;
            var $myCustomHtml = $("<span><img src='/assets/images/error.png'/> " + mySelect + "</span>");
            return $myCustomHtml;
        },

        setDropDownValLocal: function() {
            var self = this;
            self.widgets.basicDataSetValueWidget.setValue("tcp");
        },

        getDropDownValLocal: function() {
            var self = this;
            console.dir(self.widgets.basicDataSetValueWidget.getValueObject());
        },

        disableItem: function() {
            this.widgets.basicDataSetValueWidget.disable("netbios");
        },

        enableItem: function() {
            this.widgets.basicDataSetValueWidget.enable(["netbios"]);
        },

        disableDropdown: function() {
            this.widgets.basicDataSetValueWidget.disable();
        },

        enableDropdown: function() {
            this.widgets.basicDataSetValueWidget.enable();
        },

        disableSmallDropdown: function() {
            this.widgets.smallSize.disable();
        },

        enableSmallDropdown: function() {
            this.widgets.smallSize.enable();
        },

        setDropDownValLocalMultiArr: function() {
            var self = this,
                data = ["ftp","tftp","rtsp"];

            self.widgets.multipleDefault.setValue(data);
        },

        disableDropDownValLocalMultiArr: function() {
            this.widgets.multipleDefault.disable("rtsp");
        },

        enableDropDownValLocalMultiArr: function() {
            this.widgets.multipleDefault.enable(["rtsp"]);
        },

        setDropDownValLocalMultiObj: function() {
            var self = this,
                data =     [{   "id": "ftp",
                    "text": "junos-ftp"
                },
                    {
                        "id": "tftp",
                        "text": "junos-tftp"
                    },
                    {
                        "id": "rtsp",
                        "text": "junos-rtsp"
                    }];
            self.widgets.multipleDefaultTokens.setValue(data);
        },

        getDropDownValLocalMultiObj: function() {
            var self = this;
            console.dir(self.widgets.multipleDefaultTokens.getValueObject());
        },

        formatRemoteResultAddDropDownData: function (data) {
            var markup = data.text;
            return markup;
        },

        setValCb: function(data) {
            console.log(data);
        },

        addDropDownVal: function (e) {
            var self = this;
            var dialog = new AddView({'save': _.bind(self.save, self)});
        },

        openDropdown: function (e) {
            this.widgets.templateDropdownWidget.toggleState(true);
        },

        closeDropdown: function (e) {
            this.widgets.templateDropdownWidget.toggleState(false);
        },

        save: function (data) {
            var self = this;
            self.widgets.remoteDropdown.setValue(data.dropdownData);
            $.ajax({
                method: "GET",
                url: '/api/dropdown/updateData',
                data: data.dropdownData,
                dataType: 'jsonp'
            });
        },

        getDropDownValRemote: function() {
            console.dir(this.widgets.remoteDropdown.getValueObject());
        },

        addContent:function($container, template) {
            $container.append((render_template(template)));
        },

        dropdownTooltip: function (dropdownData, renderTooltip){

            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/dropDown/tests/dataSample/applicationTooltipAjax.json',
                success: function(data) {

                    data.forEach(function(item) {
                        if(item['id'] == dropdownData) {
                            renderTooltip(item['tooltip_text']);
                        }
                    });
                }
            });

        },
        dropdownTooltip_template: function (dropdownData, renderTooltip){

            var tooltip_data = "<span> this is <br/> sample template </span>";
            renderTooltip(tooltip_data);
        }

    });

    return DropDownView;
});