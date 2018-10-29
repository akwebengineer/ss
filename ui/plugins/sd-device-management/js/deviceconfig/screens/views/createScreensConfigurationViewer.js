/**
 * Created by ramesha on 11/12/15.
 */

define([
        'widgets/form/formWidget',
        'widgets/overlay/overlayWidget',
        '../../../../../space-device-management/js/device/configuration/forms/abstractConfigurationEditorFormView.js',
        '../../../../../space-device-management/js/device/configuration/grid/abstractGridConfigurationEditorView.js',
        '../conf/createScreensConfiguration.js',
        './createScreensForm.js',
        '../../../../../space-device-management/js/device/configuration/models/baseWizardModel.js'],

         function(FormWidget, OverlayWidget, AbstractConfigurationEditorFormView, AbstractGridConfigurationEditorView,
         CreateScreensConfiguration, CreateScreensForm, BaseWizardModel) {

    var DeviceScreenGridConfigurationViewer = AbstractConfigurationEditorFormView.extend({

        initialize : function(options) {
            var self = this,xpaths = [];self.items = ['tcp','ip','icmp','udp','tcp/syn-ack-ack-proxy','icmp/flood',
            'udp/flood','tcp/syn-flood','icmp/ip-sweep','tcp/tcp-sweep','udp/udp-sweep','tcp/port-scan','limit-session'];
            self.activity = self.options.activity;
            self.devicePathConfiguration = self.getRootConfiguration(self.activity.isLsysDevice);
            self.context = self.activity.context;
            self.baseScreenPath = self.devicePathConfiguration + "/security/screen/ids-option";
            self.isLsys = self.activity.isLsysDevice;
            self.model = new BaseWizardModel();
            try {
                self.deviceId = self.activity.deviceId;
                self.sessionId = self.activity.sessionId;
                self.schemaVersion = self.activity.schemaVersion;
                self.supportMultiple = self.activity.supportMultiple;
                self.username = self.activity.user;
                self.options = {
                        'deviceId' : self.deviceId,
                        'sessionId' : self.sessionId,
                        'schemaVersion' : self.schemaVersion,
                        'supportMultiple' : self.supportMultiple,
                        'username' : self.username
                };
               xpaths[0] = self.baseScreenPath;
                    for (i = 0, l = self.items.length; i < l; ++i) {
                      xpaths[xpaths.length] = self.baseScreenPath + "/" + self.items[i];
               }
                 requestObject = {
                      "xpath-list" : xpaths,
                      requiredMetaDataField : ['name','description','xpath-string','min-range','max-range','regex','enum-values','min-length','max-length','applicable'],
                      "success" : function(self, request, responseData) {
                     //  console.log(responseData);
                     //   self.allProtocols = responseData['filtered-response']['/configuration/security/screen/ids-option/name'];
                     //   self.allSystemServices = responseData['filtered-response']['/configuration/security/screen/ids-option/name'];
                        self.metaData = responseData['filtered-response'];
                      },
                      "self" : self,
                      "failure" : function() {
                        console.log("Failed to fetch meta data");
                      }
                    };
                    self.getMetaData(requestObject);

            } catch (e) {
                console.log("error from routing instances form viewer :" + e);
            }
        },

        render : function() {
            var self = this, createScreenConfiguration = new CreateScreensConfiguration(self),screenGridConfiguration, tabContainer;
            self.form = new FormWidget({
                container : self.el,
                elements : {
                    "title" : "Screens",
                    "title-help":{
                        "content" : self.context.getMessage("screens_grid_title_help"),
                        "ua-help-text":self.context.getMessage("more_link"),
                        "ua-help-identifier": self.context.getHelpKey("SECURITY_DEVICES_SCREEN_MODIFYING")
                    },
                    "on_overlay" : false,
                    "form_id": "device_screen_form_id",
                    "sections" : [{
                        "section_id" : 'device_screen_id',
                        "elements" : []
                    }]
                }
            });

            self.form.build();

            screenGridConfiguration = createScreenConfiguration.getValues();
            tabContainer = $.find('.tabContainer-widget_allTabs');
            screenGridConfiguration['height'] = Math.floor(((($(tabContainer).outerHeight() - 643 ) / 1.02 )+ 335)) - 10 + "px"; //{335,643} {425,735}
            self.deviceScreenGridWidget = new AbstractGridConfigurationEditorView({
                "elements" : screenGridConfiguration,
                "container" : self.$el.find('#device_screen_id'),
                'actionEvents' : createScreenConfiguration.getEvents(),
                "options" : self.options
            });

            $.when(self.deviceScreenGridWidget.buildGrid(createScreenConfiguration.getEvents())).done(function(model, repsonse, options_args) {
                var grid = self.$el.find('#device_screen_id')/*,options = {}*/;
                grid.unwrap();

                /*options['self'] = self;
                options['grid-id'] = 'device-screen-configuration-list';
                options['fetch-type'] = 'ALL';
                self.deviceScreenGridWidget.updateDataItems(options);*/
                self.bindDeviceScreenGridEvents(createScreenConfiguration.getEvents());
            });
            self.$el.find('#device_screen_id').bind("gridOnRowSelection", function(e, selectedRows){
               self.$el.find(".update").attr("disabled","disabled");
            });

            return self;
        },

        bindDeviceScreenGridEvents : function(definedEvents) {
            var self = this;

            // create button for grid
            if (definedEvents.createEvent) {
                self.$el.bind(definedEvents.createEvent, $.proxy(self.createDeviceScreenAction, self));
            }

            // edit button for grid
            if (definedEvents.updateEvent) {
                self.$el.bind(definedEvents.updateEvent, $.proxy(self.updateDeviceScreenAction, self));
            }
            // delete button for grid
            if (definedEvents.deleteEvent) {
                self.$el.bind(definedEvents.deleteEvent, $.proxy(self.deleteDeviceScreenAction, self));
            }
        },

        /**
        * This is create button click handler
        */
        createDeviceScreenAction : function(e, row) {
            var self = this,view;

            self.parentRoutePath = self.baseScreenPath + "[@rowId=\"0\"]";
            model = this.model;
            view = new CreateScreensForm({
                activity : self,
                mode : 'create',
                model : model
            });

            self.buildOverlay(view,"medium");
        },

        updateDeviceScreenOnFailure : function(self, request, response){
	        var view;
            self.availableElements = undefined;

            view = new CreateScreensForm({
                activity : self,
                mode : 'edit',
                values : request["original-row"]
            });

            self.buildOverlay(view, "medium");
            //TODO need to handle failure
        },

        updateDeviceScreenOnSuccess : function(self, request, response){
            self = request.self;
            var data = response['complete-response'],
            constString = self.baseScreenPath + "[@rowId=\"" + request['original-row']['row-id'] + "\"]",originalRow = {},
            tcp,i,l,tcpSimpleItemsArray,tcpParentItemsArray,simpleItem,parentItem,ip,ipArray,icmp,icmpSimpleItemsArray,icmpParentItemsArray,
            udp,udpParentsItemsArray,limit,limitArray,synFloodValues,synFloodArray,view,generalItemsArray;

	        originalRow = request["original-row"];originalRow['temp']={};

	        generalItemsArray = ['name','description','alarm-without-drop'];

            for(i=0 ; i < generalItemsArray.length ; i++){
                generalItem = generalItemsArray[i];
                if(data[constString][generalItem] !== undefined){
                    originalRow[generalItem]= data[constString][generalItem]["value"];
                    originalRow[generalItem+'_inactive']= data[constString][generalItem].inactive;
                    originalRow['temp'][generalItem]= data[constString][generalItem]["value"];
                    originalRow['temp'][generalItem+'_inactive']= data[constString][generalItem].inactive;
                }
            }

            tcp = data[constString+"/tcp"];
            tcpSimpleItemsArray = ["fin-no-ack","land", "syn-fin", "syn-frag", "tcp-no-flag", "winnuke"];
            tcpParentItemsArray = ["port-scan", "syn-ack-ack-proxy","syn-flood","tcp-sweep"];
            for (i = 0 , l = tcpSimpleItemsArray.length; i < l ; ++i) {
                simpleItem = tcpSimpleItemsArray[i];
                originalRow[simpleItem] = tcp[simpleItem].value;
                originalRow[simpleItem+'_inactive'] = tcp[simpleItem].inactive;
                originalRow['temp']['tcp/'+simpleItem+'_inactive'] = tcp[simpleItem].inactive;
                originalRow['temp']['tcp/'+simpleItem] = tcp[simpleItem].value;
            }

            for (i = 0 , l = tcpParentItemsArray.length; i < l ; ++i) {
                parentItem = tcpParentItemsArray[i];
                originalRow[parentItem] = {value: tcp[parentItem].value ? true : false};
                originalRow[parentItem+'_inactive'] = {value: tcp[parentItem].inactive ? true : false};
                originalRow[parentItem+"_threshold"] = data[constString+"/tcp/"+parentItem]['value'];
                originalRow[parentItem+"_threshold_inactive"] = data[constString+"/tcp/"+parentItem].inactive;
                originalRow['temp']['tcp/'+parentItem] = tcp[parentItem].value ? true : false;
                originalRow['temp']['tcp/'+parentItem+'_inactive'] = tcp[parentItem].inactive ? true : false;
                originalRow['temp']['tcp/'+parentItem+"/threshold_inactive"] = data[constString+"/tcp/"+parentItem].inactive;
                originalRow['temp']['tcp/'+parentItem+"/threshold"] = data[constString+"/tcp/"+parentItem]['value'];
            }

            ip = data[constString+"/ip"];
            ipArray = ["tear-drop","block-frag","bad-option","security-option","unknown-protocol","strict-source-route-option","source-route-option","timestamp-option","stream-option","loose-source-route-option","record-route-option","spoofing"];


            for (i=0;i<ipArray.length;i++){
                if(ip[ipArray[i]] !== undefined){
                    originalRow[ipArray[i]] = ip[ipArray[i]]["value"];
                    originalRow[ipArray[i]+'_inactive'] = ip[ipArray[i]].inactive;
                    originalRow['temp']['ip/'+ipArray[i]] = ip[ipArray[i]]["value"];
                    originalRow['temp']['ip/'+ipArray[i]+'_inactive'] = ip[ipArray[i]].inactive;
                }
            }

            icmp = data[constString+"/icmp"];
            icmpSimpleItemsArray = ["fragment","ping-death","large"];
            icmpParentItemsArray = ["flood","ip-sweep"];

            for (i=0;i<icmpSimpleItemsArray.length;i++){
                simpleItem = icmpSimpleItemsArray[i];
                if(simpleItem !== undefined){
                    originalRow[simpleItem] = icmp[simpleItem]["value"];
                    originalRow[simpleItem+'_inactive'] = icmp[simpleItem].inactive;
                    originalRow['temp']['icmp/'+simpleItem] = icmp[simpleItem]["value"];
                    originalRow['temp']['icmp/'+simpleItem+'_inactive'] = icmp[simpleItem].inactive;
                }
            }
            for (i=0;i< icmpParentItemsArray.length;i++) {
                parentItem = icmpParentItemsArray[i];

                originalRow["icmp_"+parentItem] = {value :icmp[parentItem].value ? true : false};
                originalRow["icmp_"+parentItem+'_inactive'] = {value :icmp[parentItem].inactive ? true : false};
                originalRow["icmp_"+parentItem+"_threshold"] = data[constString+"/icmp/" + parentItem]['value'];
                originalRow["icmp_"+parentItem + "_threshold_inactive"] = data[constString+"/icmp/" + parentItem].inactive;
                originalRow['temp']["icmp/"+parentItem] = icmp[parentItem].value ? true : false;
                originalRow['temp']["icmp/"+parentItem+'_inactive'] = icmp[parentItem].inactive ? true : false;
                originalRow['temp']["icmp/"+parentItem+"/threshold"] = data[constString+"/icmp/" + parentItem]['value'];
                originalRow['temp']["icmp/"+parentItem + "/threshold_inactive"] = data[constString+"/icmp/" + parentItem].inactive;
            }

            udp = data[constString+"/udp"];
            udpParentsItemsArray = ["flood","udp-sweep"];
            for (i=0;i<udpParentsItemsArray.length;i++){
                parentItem = udpParentsItemsArray[i];

                originalRow["udp_"+parentItem] = {value :udp[parentItem].value ? true : false};
                originalRow["udp_"+parentItem+'_inactive'] = {value :udp[parentItem].inactive ? true : false};
                originalRow["udp_"+parentItem + "_threshold"] = data[constString+"/udp/" + parentItem]['value'];
                originalRow["udp_"+parentItem + "_threshold_inactive"] = data[constString+"/udp/" + parentItem].inactive;
                originalRow['temp']["udp/"+parentItem] = udp[parentItem].value ? true : false;
                originalRow['temp']["udp/"+parentItem+'_inactive'] = udp[parentItem].inactive ? true : false;
                originalRow['temp']["udp/"+parentItem + "/threshold"] = data[constString+"/udp/" + parentItem]['value'];
                originalRow['temp']["udp/"+parentItem + "/threshold_inactive"] = data[constString+"/udp/" + parentItem].inactive;
            }

            limit = data[constString+"/limit-session"];
            limitArray = ["source-ip-based","destination-ip-based"];
            for (i=0;i<limitArray.length;i++){
                if(limit[limitArray[i]] !== undefined){
                    originalRow[limitArray[i]] = limit[limitArray[i]]["value"];
                    originalRow[limitArray[i]+'_inactive'] = limit[limitArray[i]].inactive;
                    originalRow['temp']['limit-session/'+limitArray[i]] = limit[limitArray[i]]["value"];
                    originalRow['temp']['limit-session/'+limitArray[i]+'_inactive'] = limit[limitArray[i]].inactive;
                }
            }

            synFloodValues = data[constString+"/tcp/syn-flood"];
            synFloodArray = ["alarm-threshold","attack-threshold","source-threshold","destination-threshold","timeout"];
            for (i=0;i<synFloodArray.length;i++){
                if(synFloodValues[synFloodArray[i]] !== undefined){
                    originalRow[synFloodArray[i]] = synFloodValues[synFloodArray[i]]["value"];
                    originalRow['temp']["tcp/syn-flood/"+synFloodArray[i]] = synFloodValues[synFloodArray[i]]["value"];
                    originalRow[synFloodArray[i]+'_inactive']= synFloodValues[synFloodArray[i]].inactive;
                    originalRow['temp']['tcp/syn-flood/'+synFloodArray[i]+'_inactive']= synFloodValues[synFloodArray[i]].inactive;
                }
            }

            self.parentRoutePath = self.baseScreenPath + "[@rowId=\""+originalRow['row-id']+"\"]";
            view = new CreateScreensForm({
                activity : self,
                mode : 'edit',
                values : originalRow
            });
            self.buildOverlay(view, "medium");
        },
        /**
        * This is edit button click handler
        */
        updateDeviceScreenAction : function(e, row) {
            var self = this,deviceScreenGrid = self.deviceScreenGridWidget,numberOfRecords,rowId,xpathList,i,paths,xpathConstant,input = {};
            if (deviceScreenGrid.getSelectedRows()) {
                numberOfRecords = deviceScreenGrid.getSelectedRows().length;
            }
            rowId = row.originalRow["row-id"];
            if (numberOfRecords === 1) {
           //    var xpathList =["configuration/security/screen/ids-option["+rowId+"]"],input = {};
               xpathList =[self.baseScreenPath + "[@rowId=\""+rowId+"\"]/"];
               paths = ["tcp","ip","icmp","limit-session","udp","icmp/ip-sweep","tcp/syn-flood","tcp/tcp-sweep","udp/udp-sweep","tcp/port-scan","tcp/syn-ack-ack-proxy","icmp/flood","udp/flood"];
                for (i=0;i<paths.length;i++){
                xpathConstant = self.baseScreenPath + "[@rowId=\""+rowId+"\"]/"+paths[i];
                xpathList.push(xpathConstant);
                }
                input.success = self.updateDeviceScreenOnSuccess;
                input.failure = self.updateDeviceScreenOnFailure;
                input.self = self;
                input["original-row"] = row.originalRow;
                input['xpath-list'] = xpathList;
                self.getData(input);
            }
        },

        buildOverlay : function(view, type) {
            var self = this;

            type = (type === undefined) ? 'wide' : type;
            self.overlay = new OverlayWidget({
                view : view,
                type : type,
                showScrollbar : true
            });

            self.overlay.build();
        },


        deleteDeviceScreenAction : function(e, row) {
            var self = this, rowsLength = 0,genericDataItem = {},xpath,ii,genericDataItemList = [],dataPathList,request = {};
            e.preventDefault();
            if (row.deletedRows) {
                rowsLength = row.deletedRows.length;
                if (rowsLength > 0) {
                    for (ii = 0; ii < rowsLength; ii++) {
                        xpath = self.baseScreenPath + "[@rowId=\"" + row.deletedRows[ii]["row-id"] + "\"]";
                        genericDataItem = {
                        "schema-path" : 'deviceConfigMgr:/net.juniper.jmp.jpa.LogicalDevice:' + self.deviceId + ':' + self.sessionId + '/' + self.schemaVersion + ':' + xpath
                        }
                        genericDataItemList.push(genericDataItem);
                    }
                    dataPathList = {
                        "parent-data-path" : self.baseScreenPath,
                        "items" : {
                            "generic-data-item" : genericDataItemList
                        }
                    };
                    request.success = self.deleteScreenActionOnSuccess;
                    request.failure = self.deleteScreenActionOnFailure;
                    request.self = self;
                    request.method = "DELETE";
                    request['xpath-list'] = dataPathList;
                    self.removeData(request);
                }
            }
        },
        deleteScreenActionOnSuccess : function(_self, request, response) {

          var self = request.self, options = {};

          options['self'] = self;
          options['grid-id'] = 'device-screen-configuration-list';
          options['fetch-type'] = 'ALL';
          self.deviceScreenGridWidget.updateDataItems(options);
        },
        deleteScreenActionOnFailure : function(self, request, response) {
          console.log('failed to delete screens');
        }
    });
    return DeviceScreenGridConfigurationViewer;
});
