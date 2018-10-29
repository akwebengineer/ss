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
    'widgets/grid/tests/dataSample/firewallPoliciesData',
    'widgets/grid/tests/view/quickView',
    'mockjax',
    'widgets/grid/tests/view/sourceAddressView',
    'widgets/grid/tests/view/descriptionView',
    'widgets/grid/conf/searchConfiguration',
    'explorer/widgets/js/extra',
    'vendor/clipboard/clipboard.min'
], function(Backbone, GridWidget, firewallPoliciesData, QuickView,  mockjax,SourceAddressView,DescriptionView,searchConfiguration,PrintModule,Clipboard){
    var GridView = Backbone.View.extend({

        

        initialize: function (config) {
            this.mockApiResponse();

            this.gridContainer = $('#widget-demo');
            this.gridContainer.empty();
            this.configuration = {
                "title": config.grid_title,
                "title-help": {
                    "content": config.grid_title_help,
                    "ua-help-text": "More..",
                    "ua-help-identifier": "alias_for_ua_event_binding"
                },
                "refresh": {
                    tooltipText: config.grid_refresh_tooltip
                },
                "url": "/api/get-data", 
                "jsonRoot": "policy-Level1.policy-Level2.policy-Level3",
                "jsonId": "name",
                "showRowNumbers": (config.grid_showRowNumber_checkbox)? true: false,
                "multiselect": (config.grid_multiselect_checkbox)?true: false,
                "height": config.grid_height, 
                "scroll": (config.grid_scroll_checkbox)?true: false,
                "numberOfRows":parseInt(config.grid_no_of_rows),
                "jsonRecords": function(data) {
                    return parseInt(config.grid_max_rows);
                },
                "noResultMessage": config.grid_noResultAvailable_string,
                "deleteRow": {
                    "autoRefresh": (config.grid_delete_autoRefresh_checkbox)? true: false,
                },
                "sorting": [{
                    "column":config.grid_sort_col,
                    "order": (config.grid_order_radio == "grid_order_asc_radio")?"asc": "desc" 
                }],
                "actionButtons":{
                },
                
                "filter": {
                    searchUrl: (config.grid_searchUrl_checkbox)?true:false,
                    noSearchResultMessage : config.grid_noSearchResultMessage,
                    columnFilter: (config.grid_columnFilter_checkbox)? true: false,
                    showFilter: null
                }   
            };
            var optionMenu = {};
            if(config.grid_ColumnItem_checkbox || config.grid_customOptionMenu_checkbox){
                if(config.grid_ColumnItem_checkbox && config.grid_customOptionMenu_checkbox){
                    optionMenu = {
                        "showHideColumnsItem": {},
                        "customItems": [{
                            "label":"Custom option",
                            "key":"customOption"
                        }] 
                    };
                }
                else if(config.grid_ColumnItem_checkbox){
                    optionMenu = {
                        "showHideColumnsItem": {}
                    }

                }
                else{
                    optionMenu = {
                        "customItems": [{
                            "label":"Custom option",
                            "key":"customOption"
                        }]
                    };
                }
            }
            this.configuration.filter.optionMenu = optionMenu;
            if(config.grid_Filter_checkbox){
                var sFilter = {
                        quickFilters: [{
                        "label":"Only Juniper devices",
                        "key":"juniper"
                    },{
                        "label":"Only non-Juniper devices",
                        "key":"nonJuniper"
                    }]
                }
                this.configuration.filter.showFilter  =  sFilter; 
            }
            else{
                this.configuration.filter.showFilter = false;
            }
            if(config.grid_advancedSearch_checkbox){
                this.configuration.filter.advancedSearch= {
                    "filterMenu": searchConfiguration.filterMenu,
                    "logicMenu": searchConfiguration.logicMenu
                }
            }
            if(config.grid_dragNDrop_checkbox){
                this.configuration.dragNDrop ={
                    moveRow: {
                        afterDrop: function(sortingRow, previousRow, nextRow){console.log("row dragged");return true;}
                    }
                };
            }
            var contextMenu = {};
            if(config.grid_edit_checkbox){
                contextMenu.edit = "Edit Row"
            }
            if(config.grid_enable_checkbox){
                contextMenu.enable = "Enable Rule"
            }
            if(config.grid_disable_checkbox){
                contextMenu.disable = "Disable Rule"
            }
            if(config.grid_createBefore_checkbox){
                contextMenu.createBefore = "Create Row Before"
            }
            if(config.grid_createAfter_checkbox){
                contextMenu.createAfter = "Create Row Before"
            }
            if(config.grid_copy_checkbox){
                contextMenu.copy = "Copy"
            }
            if(config.grid_pasteBefore_checkbox){
                contextMenu.pasteBefore = "Paste row before"
            }
            if(config.grid_pasteAfter_checkbox){
                contextMenu.pasteAfter = "Paste row After"
            }
            if(config.grid_delete_checkbox){
                contextMenu.delete = "Delete"
            }
            if(config.grid_quickView_checkbox){
                contextMenu.quickView = "Quick View"
            }
            if(config.grid_clearAll_checkbox){
                contextMenu.clearAll = "Clear all"
            }
            if(config.grid_custom_checkbox){
                contextMenu.custom = [{ 
                    "label":"Custom item",
                    "key":"customItem" 
                }]
            }
            this.configuration.contextMenu = contextMenu ;
            var columns = [];
            if(config.column_action){
                var col = {
                        "index": "action",
                        "name": "action",
                        "label": "Action",
                        "width": 100,
                        "editCell":{
                            "type": "dropdown",
                            "values":[{
                                "label": "Permit",
                                "value": "permit"
                            },{
                                "label": "Deny",
                                "value": "deny"
                            }]
                        }
                    };
                    columns.push(col);
            }
            if(config.column_application){
                var col = {
                        "index": "application",
                        "name": "application",
                        "label": "Application Application",
                        "width": "100",
                        "collapseContent":true,
                        "createdDefaultValue":"any"
                    };
                    columns.push(col);
            }
            if(config.column_application_services){
                var col ={
                        "index": "application-services",
                        "name": "application-services",
                        "label": "Advanced Security",
                        "width": "260",
                        "collapseContent":{
                            "keyValueCell": true, 
                            "lookupKeyLabelTable":{
                                        "utm-policy": "UTM",
                                        "idp": "IDP",
                                        "application-firewall": "AppFW",
                                        "application-traffic-control": "AppTC"
                                    }
                        },
                        "searchCell": true
                    };
                columns.push(col);
            }
            if(config.column_date){
                var col ={
                        "index": "Date",
                        "name": "date",
                        "label": "Date",
                        "width": "100",
                        "searchCell":{
                            "type": "date"
                        },
                        "contextMenu": {
                            "copyCell": "Copy Cell",
                            "pasteCell": "Paste Row Before",
                            "searchCell": "Search Cell"
                        },
                        "sortable": false
                    };
                columns.push(col);
            }
            if(config.column_description){
                var col ={
                        "index": "description",
                        "name": "description",
                        "label": "Description",
                        "width": 140,
                        "sortable": false,
                        "collapseContent": {
                            "singleValue" : true
                        },
                        "searchCell": true
                    };
                columns.push(col);
            }
            if(config.column_destinationAddress){
                var col ={
                        "index": "DestinationAddress",
                        "name": "destination-address",
                        "label": "Destination Address",
                        "collapseContent":{
                        },
                        "width": "100",
                        "createdDefaultValue":"any",
                        "searchCell":{
                            "type": "number"
                        },
                        "header-help": {
                            "content": "Header help text",
                            "ua-help-text": "More..",
                            "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
                        }
                    };
                columns.push(col);
            }
            if(config.column_destinationZone){
                var col ={
                        "index": "destinationZone",
                        "name": "to-zone-name",
                        "label": "Destination Zone",
                        "createdDefaultValue":'untrust-inet',
                        "width": "100",
                        "editCell":{
                            "type": "input",
                            "pattern": "length",
                            "min_length":"2",
                            "max_length":"10",
                            "error": "Must be between 2 and 10 characters."
                        }
                    };
                columns.push(col);
            }
            if(config.column_inactive){
                var col ={
                        "index": "inactive",
                        "name": "inactive",
                        "label": "Inactive",
                        "hidden": true,
                        "showInactive":true
                    };
                columns.push(col);
            }
            if(config.column_name){
                var col ={
                        "name": "name",
                        "label": "Name",
                        "width": "400",
                        "formatter":function (cellvalue, options, rowObject){
                                return '<a class="cellLink" data-tooltip="'+cellvalue+'" title="'+cellvalue+'">'+cellvalue+'</a>';
                            },
                        "editCell":{
                            "type": "input",
                            "post_validation": "postValidation",
                            "pattern": "^[a-zA-Z0-9_\-]+$",
                            "error": "Enter alphanumeric characters, dashes or underscores"
                        },
                        "searchCell": true,
                        "contextMenu": {
                            "copyCell": "Copy Cell",
                            "pasteCell": "Paste Cell",
                            "searchCell": "Search Cell",
                            "custom":[{ //user should bind custom key events
                                "label":"Cell Menu 11",
                                "key":"cellMenu11"
                            },{
                                "label":"Cell Menu 12",
                                "key":"cellMenu12"
                            },{
                                "label":"Cell Sub Menu",
                                "key":"cellSubMenu1",
                                "items": [{
                                    "label":"Cell Sub Menu 11",
                                    "key":"cellSubMenu11"
                                },{
                                    "label":"Cell Sub Menu 12",
                                    "key":"cellSubMenu12"
                                }]
                            }]
                        }
                    };
                columns.push(col);
            }
            if(config.column_sourceZone){
                var col ={
                        "index": "sourceZone",
                        "name": "from-zone-name",
                        "label": "Source Zone",
                        "createdDefaultValue":'untrust-inet',
                        "width": "100",
                        "hidden": true,
                        "editCell":{
                                "type": "input",
                                "pattern": "^[a-zA-Z0-9_\-]+$",
                                "error":"Enter alphanumeric characters, dashes or underscores"
                            }
                    };
                columns.push(col);
            }
            if(config.column_sourceAddress){
                var col ={
                        "index": "sourceAddress",
                        "name": "source-address",
                        "label": "Source Address",
                        "width": "200",
                        "collapseContent":{
                        },
                        "createdDefaultValue":"any",
                        "searchCell": {
                            "type": 'dropdown',
                            "values":[{
                                "label": "IP_CONV_204.17.79.60",
                                "value": "1"
                            },{
                                "label": "IP_SEC_204.17.79.60 and IP_SEC_204.17.79.61",
                                "value": "close or client and server"
                            },{
                                "label": "IP_TRE_204.17.79.60",
                                "value": "3"
                            },{
                                "label": "IP_TRE_96.254.162.106",
                                "value": "4"
                            }]
                        },
                        "contextMenu": {
                            "copyCell": "Copy Cell",
                            "pasteCell": "Paste Cell",
                            "searchCell": "Search Cell",
                            "custom":[{ 
                                "label":"Cell Menu 21",
                                "key":"cellMenu21"
                            },{
                                "label":"Cell Menu 22",
                                "key":"cellMenu22"
                            },{
                                "label":"Cell Sub Menu",
                                "key":"cellSubMenu2",
                                "items": [{
                                    "label":"Cell Sub Menu 21",
                                    "key":"cellSubMenu21"
                                },{
                                    "label":"Cell Sub Menu 22",
                                    "key":"cellSubMenu22"
                                }]
                            }]
                        }
                    };
                columns.push(col);
            }
            this.configuration.columns = columns;
            var customButtons = [];
            if(config.grid_iconType_checkbox){
                var button = {
                    "icon_type": true,
                    "label": "Close",
                    "icon": {
                        default: "icon_archive_purge-bg",
                        hover: "icon_archive_purge_hover",
                        disabled: "icon_exit_filters_disable"
                    },
                    "disabledStatus": false,
                    "key": "testCloseGrid"
                };
                customButtons.push(button);
            }
            if(config.grid_buttonType_checkbox){
                var button = {
                    "button_type": true,
                    "label": "Publish",
                    "key": "testPublishGrid",
                    "disabledStatus": false //default status
                };
                customButtons.push(button);
            }
            if(config.grid_menuType_checkbox){
                var button = {
                    "menu_type": true,
                    "label":"Split Action",
                    "key":"subMenu",
                    "disabledStatus": false, //default status
                    "items": [{
                        "label":"SubMenu1 Menu1",
                        "key":"subMenu1"
                    },{
                        "label":"SubMenu1 Menu2",
                        "key":"subMenu2"
                    },{
                        "separator": "true"
                    },{
                        "label":"SubMenu1 Menu3",
                        "key":"subMenu3"
                    }]
                };
                customButtons.push(button);
            }
            this.configuration.actionButtons.customButtons = customButtons;
            console.log(this.configuration);
            this.actionEvents = {
                createEvent: "AddRow",
                updateEvent: "UpdateRow",
                deleteEvent: "DeleteRow",
                copyEvent: "CopyRow",
                pasteEvent:"PasteRow",
                statusEvent: "UpdateStatusRow",
                quickViewEvent:"QuickViewRow",
                clearAllEvent: "ClearAll",
                resetHitEvent:"ResetHitCount",
                disableHitEvent:"DisableHitCount",
                updateActionStatusEvent: "updateActionStatus",
                resetReloadGrid: "resetReloadGrid",
                selectRowEvent:"selectRowEvent",
                getSelectedRowsEvent:"GetSelectedRows",
                subMenu1: "SubMenu1",
                subMenu2: "SubMenu2",
                testPublishGrid:"testPublishGrid",
                testCloseGrid: "testCloseGrid",
                selectedEvent: "selectedEvent",
                cellMenu11:"cellMenu11",
                cellSubMenu11:"cellSubMenu11"
            };
            //this.cellOverlayViews = this.createViews();
            
            this.render(config);
        },
        createViews: function(){
             var view = new QuickView({
                        'rowData': {}
                    });
             return view;
        },
        render: function (config) {
            var self = this;
             $('#obj').find('#static-content').empty();
            var conf = {
                container: this.gridContainer,   
                elements: this.configuration           
            }
            if(config.grid_actionEvents_checkbox){
                _.extend(conf, {
                    actionEvents:this.actionEvents
                });
                //$('#obj').find('#static-content').append(new PrintModule().printObj({actionEvents: conf.actionEvents}));
            }
            // if(config.grid_cellOverlayViews_checkbox){
            //     _.extend(conf, {
            //         cellOverlayViews:this.cellOverlayViews
            //     });
            // }
            if(config.grid_cellTooltip_checkbox){
                _.extend(conf, {
                    cellTooltip:this.cellTooltip
                });
                $('#obj').find('#static-content').append(new PrintModule().printObj({cellTooltip: conf.cellTooltip}));
            }
            if(config.grid_onConfigUpdate_checkbox){
                _.extend(conf, {
                    onConfigUpdate: this.configUpdate
                });
                $('#obj').find('#static-content').append(new PrintModule().printObj({onConfigUpdate:conf.onConfigUpdate}));
            }
            this.gridWidget = new GridWidget(conf);
            this.gridWidget.build();

            //configuration box
            $('#obj').css( "display", "block" );
            var objectDisplayElementTextArea = $('#obj').find('#obj-content');
            var textAreaButton = $('#obj').find('#submitButton');
            objectDisplayElementTextArea.val("");
            var h = parseInt($('#test_form_widget').css( "height" )) - 350 ;  
            objectDisplayElementTextArea.css("height",h)
            objectDisplayElementTextArea.val("{"+ new PrintModule().printObjPlain(conf.elements)+"\n}" );
            
            textAreaButton.click(function(){
                self.gridContainer.empty();
                var str = objectDisplayElementTextArea.val().replace('\n','').replace('\t','');
                //console.log(str);
                try{
                    var jstr = JSON.parse(str);
                    var grid = new GridWidget({
                        container:self.gridContainer,
                        elements:jstr,
                        actionEvents:conf.actionEvents,
                        cellTooltip:conf.cellTooltip,
                        onConfigUpdate: conf.onConfigUpdate
                    });
                    grid.build();
                }
                catch(err){
                    $('#obj').find('#error').empty();
                    $('#obj').find('#error').append(err);
                    $('#obj').find('#error').append("error in configuration <br> widget could not update");
                }
                
                
             });
            //show the button

                var clipboard = new Clipboard('#copyButton');

                clipboard.on('success', function(e) {
                    console.info('copied');                    
                });
                clipboard.on('error', function(e) {
                    console.error('Not copied');
                });
            return this;
        },
        configUpdate: function(){
            console.log("Config updated");
        },
        cellTooltip: function (cellData, renderTooltip){
            console.log("in cellTooltip");
            renderTooltip(cellData.columnName +"="+cellData.cellId);
        },

        /* mocks REST API response for remote validation of an input value */
        mockApiResponse: function(){
            var data = firewallPoliciesData;
            $.mockjax({
                url: '/api/get-data',
                dataType: 'json',
                response: function(settings) {
                    this.responseText = firewallPoliciesData.firewallPoliciesAll;
                },
                responseTime: 10
            });
        }
    });

    return GridView;
});