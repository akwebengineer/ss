define([ 'backbone.syphon',
         'widgets/form/formWidget',
         'widgets/overlay/overlayWidget',
         'widgets/listBuilder/listBuilderWidget',
         'widgets/grid/gridWidget', 
         '../conf/createZoneFormConfiguration.js', 
         '../../../../../space-device-management/js/device/configuration/models/baseWizardModel.js',
         'widgets/confirmationDialog/confirmationDialogWidget',
         './zoneProtocolsView.js',
         '../../../util/deviceConfigValidationUtility.js',
         'widgets/scheduleRecurrence/lib/customValidator',
         '../../util/deviceConfigUtil.js'],
function( Syphon, FormWidget, OverlayWidget, ListBuilderWidget, GridWidget, ZoneFormConfiguration, BaseWizardModel, ConfirmationDialog, ZoneProtocolsView,ValidationUtility,CustomValidator, deviceConfigUtil) {
  var DeviceConfigUtil = new deviceConfigUtil();
  var createZoneForm = ValidationUtility.extend({
    events : {
      'click #device-config-zone-form-save' : 'saveZone',
      'click #device-config-zone-form-cancel' : 'closeDeviceZoneConfigurationOverlay'
    },
    initialize : function() {
      var self = this;
      self.activity = self.options.activity;
      self.context = self.activity.context;
      self.values = self.options.values;
      self.mode = self.options.mode;
      self.rowId = self.options.rowId;
      self.isUndefined = undefined;
      self.deviceId = self.activity.deviceId;
      self.sessionId = self.activity.sessionId;
      self.schemaVersion = self.activity.schemaVersion;
      self.parentRoutePath = self.activity.parentRoutePath;
      self.zonePath = self.activity.baseZonePath; 
      self.isLsys = self.activity.isLsys;
      self.thisZonePath = self.zonePath + '[@rowId="' + self.rowId.toString() + '"]';
      self.metaData = self.activity.metaData;
      self.options = {
        'deviceId' : self.deviceId,
        'sessionId' : self.sessionId,
        'schemaVersion' : self.schemaVersion,
        'username' : self.username
      };
      // If edit mode then fetch the record data from server
      if (self.mode === 'edit') {
        self.fetchZoneData();
      }
      self.arrayOfDeletePaths = [];
      self.arrayOfAddPaths = [];
    },
    simpleItemsList : [ 'name', 'description', 'application-tracking', 'screen', 'tcp-rst' ],
    //This is for reference about all the xpaths used in zones
    /*schemaMap : {
      '{}' : [ 'name', 'description', 'application-tracking', 'screen', 'tcp-rst' ],
      'interfaces{}' : [ 'name' ],
      'interfaces{}/host-inbound-traffic/system-services{}' : [ 'name', 'except' ],
      'interfaces{}/host-inbound-traffic/protocols{}' : [ 'name', 'except' ],
      'host-inbound-traffic/system-services{}' : [ 'name', 'except' ],
      'host-inbound-traffic/protocols{}' : [ 'name', 'except' ]
    },*/
    getExceptListInfo : function(items) {
      var exceptList = [], permitList = [], item, isExceptList = false, i, l, retVal = {}, exceptNode;
      for (i = 0, l = items.length; i < l; ++i) {
        item = items[i];
        if (item.inactive !== true) {
          // Check for except node
          exceptNode = item.except === true;
          if (exceptNode) {
            exceptList.push(item.name);
          } else {
            permitList.push(item.name);
          }
        }

      }
      // 'all' must be configured for except list
      if (-1 === $.inArray('all', permitList)) {
        exceptList = [];
      }
      if (exceptList.length > 0) {
        isExceptList = true;
        retVal = {
          'isExcept' : isExceptList,
          'list' : exceptList
        };
      } else {
        isExceptList = false;
        retVal = {
          'isExcept' : isExceptList,
          'list' : permitList
        };
      }

      return retVal;
    },
    onFetchFirstLevelDataSuccess : function(_self, request, response) {
      var self = request.self, filteredResponse = response['complete-response'], requestXpaths = request['xpath-list'], editZoneOriginalData = {}, 
      zoneLevelProtocols = [], zoneLevelSystemServices = [], tmpObj, interfaceCount, interfaceNames = [], i, j, l;
      console.log(arguments);

      //Zone level i.e. configuration/security/zones/security-zone[@rowId="7"]
      tmpObj = filteredResponse[requestXpaths[0]] || {};
      for (j = 0, l = self.simpleItemsList.length; j < l; ++j) {
        editZoneOriginalData[self.simpleItemsList[j]] = {
          'value' : tmpObj[self.simpleItemsList[j]].value,
          'inactive' : tmpObj[self.simpleItemsList[j]].inactive
        };
      }

      //Zone level protocols i.e. configuration/security/zones/security-zone[@rowId="7"]/host-inbound-traffic/protocols
      tmpObj = filteredResponse[requestXpaths[3]] || {};
      for (i in tmpObj) {
        if (tmpObj.hasOwnProperty(i) && i !== 'total-length') {
          zoneLevelProtocols[zoneLevelProtocols.length] = {
            'name' : tmpObj[i]['name'].value,
            'inactive' : tmpObj[i]['id'].inactive,
            'except' : tmpObj[i]['except'].value
          };
        }
      }
      editZoneOriginalData['protocols'] = zoneLevelProtocols;
      
      //Zone level services i.e. configuration/security/zones/security-zone[@rowId="7"]/host-inbound-traffic/system-services
      tmpObj = filteredResponse[requestXpaths[2]] || {};
      for (i in tmpObj) {
        if (tmpObj.hasOwnProperty(i) && i !== 'total-length') {
          zoneLevelSystemServices[zoneLevelSystemServices.length] = {
            'name' : tmpObj[i]['name'].value,
            'inactive' : tmpObj[i]['id'].inactive,
            'except' : tmpObj[i]['except'].value
          };
        }
      }
      
      editZoneOriginalData['system-services'] = zoneLevelSystemServices;

      //Zone's Interfaces
      tmpObj = filteredResponse[requestXpaths[1]] || {};
      interfaceCount = tmpObj['total-length'];
      for (i in tmpObj) {
        if (tmpObj.hasOwnProperty(i) && i !== 'total-length') {
          interfaceNames[interfaceNames.length] = { 
        	'name' :tmpObj[i]['name'].value,
        	'inactive' : tmpObj[i]['id'].inactive
          };
        }
      }
      editZoneOriginalData['interfaces'] = interfaceNames;
      self.editZoneOriginalData = editZoneOriginalData;
      //Now query for inbound traffic of each interface
      if (interfaceCount > 0) {
        self.fetchZoneInterfaceInboundTrafficData(interfaceNames);
      } else {
        self.renderUI();
      }

    },
    /**
     * Once we have the basic zone data i.e. interface counts in zone 
     * we make a query to server to fetch all individual interfaces. This is needed because server query requires the interface rowId
     */
    onFetchInterfaceLevelDataSuccess : function(_self, request, response) {
      var self = request.self, j, retData,intfName, filteredResponse = response['complete-response'], requestXpaths = request['xpath-list'], interfaceLevelProtocols = [], interfaceLevelSystemServices = [], tmpObj, interfaceNames = request.interfaceNames, i, l, k, rowData = {};

      for (j = 0, l = interfaceNames.length; j < l; ++j) {
    	intfName = interfaceNames[j].name; 
        rowData[intfName] = {};
        interfaceLevelProtocols = [];
        interfaceLevelSystemServices = [];
        k = j * 2;

        tmpObj = filteredResponse[requestXpaths[k]] || {};
        for (i in tmpObj) {
          if (tmpObj.hasOwnProperty(i) && i !== 'total-length') {
            interfaceLevelSystemServices[interfaceLevelSystemServices.length] = {
              'name' : tmpObj[i]['name'].value,
              'inactive' : tmpObj[i]['id'].inactive,
              'except' : tmpObj[i]['except'].value
            };
          }
        }

        tmpObj = filteredResponse[requestXpaths[k + 1]] || {};
        for (i in tmpObj) {
          if (tmpObj.hasOwnProperty(i) && i !== 'total-length') {
            interfaceLevelProtocols[interfaceLevelProtocols.length] = {
              'name' : tmpObj[i]['name'].value,
              'inactive' : tmpObj[i]['id'].inactive,
              'except' : tmpObj[i]['except'].value
            };
          }
        }

        retData = self.getExceptListInfo(interfaceLevelProtocols);
        rowData[intfName]['protocols'] = retData.list;
        rowData[intfName]['protocols-isexcept'] = retData.isExcept;
        rowData[intfName]['protocols-original-data'] = interfaceLevelProtocols;
        
        retData = self.getExceptListInfo(interfaceLevelSystemServices);
        rowData[intfName]['system-services'] = retData.list;
        rowData[intfName]['system-services-isexcept'] = retData.isExcept;
        rowData[intfName]['system-services-original-data'] = interfaceLevelSystemServices;

      }
      self.editZoneOriginalData['interfaces-traffic'] = rowData;
      console.log(self.editZoneOriginalData);
      self.renderUI();
    },
    /**
     * Once we have the basic zone data i.e. interface counts in zone 
     * we make a query to server to fetch all individual interfaces. This is needed because server query requires the interface rowId
     */
    fetchZoneInterfaceInboundTrafficData : function(interfaceNames) {
      var self = this, xpathList = [], i, j, paths = [ "host-inbound-traffic/system-services", "host-inbound-traffic/protocols" ];
      for (j = 1; j <= interfaceNames.length; ++j) {
        for (i = 0; i < paths.length; ++i) {
          xpathList.push(self.thisZonePath + '/' + 'interfaces[@rowId="' + j.toString() + '"]' + '/' + paths[i]);
        }
      }

      self.fetchConfigData(xpathList, self.onFetchInterfaceLevelDataSuccess, function() {
        console.log("Failed to get the edited zone config");
      }, {
        interfaceNames : interfaceNames
      });
    },
    //Fetch config data from server
    fetchConfigData : function(xpaths, success, failure, extraParams) {
      var self = this, input = {};
      input['success'] = success;
      input['failure'] = failure;
      input['xpath-list'] = xpaths;
      input['self'] = self;
      $.extend(input, extraParams);
      self.activity.getData(input);
    },
    //Fetch the edit zone data from server
    fetchZoneData : function() {
      var self = this, xpathList = [ self.thisZonePath ], paths = [ "interfaces", "host-inbound-traffic/system-services", "host-inbound-traffic/protocols" ], i , l;
      for (i =0, l = paths.length; i < l ; ++i) {
        xpathList.push(self.thisZonePath + '/' + paths[i]);
      }
      self.fetchConfigData(xpathList, self.onFetchFirstLevelDataSuccess, function() {
        console.log("Failed to get the edited zone config");
      });
    },

    renderScreens : function() {
      var self = this, xpathList = [ self.activity.devicePathConfiguration + "/security/screen/ids-option/name" ], input = {};
      input.success = function(self, request, responseData) {
        console.log(responseData);
        console.log("Fetching interfaces for zones");

        var id = "deviceconfig_zone_form_screen", i, screenCombo = self.$el.find("#" + id), eachScreen, allScreensObj = responseData['complete-response'][xpathList[0]];
        screenCombo.append(new Option("", ""));
        for (i in allScreensObj) {
          if (allScreensObj.hasOwnProperty(i) && i !== "total-length") {
            eachScreen = allScreensObj[i].name.value;
            screenCombo.append(new Option(eachScreen, eachScreen));
          }
        }
        if (self.mode === 'edit' && self.editZoneOriginalData['screen'].inactive !== true) {
          screenCombo.val(self.editZoneOriginalData['screen'].value);
        }
      };
      input.failure = function() {
        console.log("Failed to fetch the screens for zones");
      };
      input.self = self;
      input['xpath-list'] = xpathList;
      self.activity.getData(input);
    },
    renderListBuilder : function(id) {
      var self = this, listBuilderData = {}, listContainer = self.$el.find('#' + id), listBuilder;
      listBuilderData['availableElements'] = [];
      listBuilderData['selectedElements'] = [];
      listBuilder = new ListBuilderWidget({
        "list" : listBuilderData,
        "container" : listContainer
      });

      listBuilder.build();
      listContainer.children().attr('id', id);
      listContainer.find('.list-builder-widget').unwrap();
      return listBuilder;
    },
    renderInterfacesListBuilder : function() {
      var self = this, id = "interfaces-list-builder";
      self.interfaceListBuilder = self.renderListBuilder(id);

      self.$el.find('#' + id).children().find('#duallistbox-selected-list_interfaces-list-builder').on('selectedChangeEvent', function(e, obj) {
        console.log("This is test");
        self.refreshInterfaceInboundTrafficGridData(obj.event, obj.data);
      });
    },
    setValuesToInterfacesListBuilder : function() {
      var self = this, xpathList = [ self.activity.devicePathConfiguration + "/interfaces/interface/unit", self.activity.devicePathConfiguration + "/security/zones/security-zone/interfaces" ], input = {}, listBuilderData = {}, intfName;
      input.success = function(self, request, responseData) {
        console.log(responseData);
        console.log("Fetching interfaces for zones");

        var /*id = "interfaces-list-builder",*/ allInterfacesObj = responseData['complete-response'][xpathList[0]], i,j, l, eachInterface, allInterfaces = [], inAllZonesInterfacesObj = responseData['complete-response'][xpathList[1]], inAllZonesInterfaces = [], availableInterfaces = []/*, interfaceListContainer = self.$el.find('#' + id)*/;

        for (i in allInterfacesObj) {
          if (allInterfacesObj.hasOwnProperty(i) && i !== "total-length") {
            eachInterface = allInterfacesObj[i];
            if(eachInterface['interface/name'].inactive !== true) {
              allInterfaces[allInterfaces.length] = eachInterface['interface/name'].value + '.' + eachInterface['unit/name'].value;
            }
          }
        }

        for (i in inAllZonesInterfacesObj) {
          if (inAllZonesInterfacesObj.hasOwnProperty(i) && i !== "total-length") {
            eachInterface = inAllZonesInterfacesObj[i];
            if(eachInterface['interfaces/name'].inactive !== true) {
              inAllZonesInterfaces[inAllZonesInterfaces.length] = eachInterface['interfaces/name'].value;
            }
          }
        }

        availableInterfaces = $(allInterfaces).not(inAllZonesInterfaces).get();
        listBuilderData['availableElements'] = [];
        for (j = 0, l = availableInterfaces.length; j < l; ++j) {
          listBuilderData['availableElements'].push({
            "label" : availableInterfaces[j],
            "value" : availableInterfaces[j]
          });
        }
        listBuilderData['selectedElements'] = [];
        if (self.mode === 'edit') {
          for (j = 0, l = self.editZoneOriginalData['interfaces'].length; j < l; ++j) {
        	if(self.editZoneOriginalData['interfaces'][j].inactive !== true) {
        	  intfName = self.editZoneOriginalData['interfaces'][j].name;
            listBuilderData['selectedElements'].push({
              "label" : intfName,
              "value" : intfName
            });
        	}
          }
        }

        self.interfaceListBuilder.addAvailableItems(listBuilderData['availableElements']);
        self.interfaceListBuilder.addSelectedItems(listBuilderData['selectedElements']);
      };
      input.failure = function() {
        console.log("Failed to fetch the interfaces for zones");
      };
      self.fetchConfigData(xpathList, input.success, input.failure);
    },
    getLabelValueObjectArray : function(inputArray, key) {
      var i, l, retArr = [];
      for (i = 0, l = inputArray.length; i < l; ++i) {
    	if (inputArray[i].inactive !== true) {
    	  retArr[retArr.length] = {
            "label" : inputArray[i][key] || inputArray[i],
            "value" : inputArray[i][key] || inputArray[i]
          };
    	}
      }
      return retArr;
    },

    getListBuilderData : function(allList, inList, key) {
      var availableList = [], listBuilderData = {};
      availableList = $(allList).not(inList).get();
      listBuilderData['availableElements'] = this.getLabelValueObjectArray(availableList);
      listBuilderData['selectedElements'] = this.getLabelValueObjectArray(inList, key);
      return listBuilderData;
    },
    setValuesToHostInboundSystemservicesListBuilder : function() {
      var self = this, allSystemServices = self.activity.allSystemServices, listBuilderData, inZoneSystemServices = [], retData;
      
      if(self.mode === 'edit') {
    	retData = self.getExceptListInfo(self.editZoneOriginalData['system-services']);
    	inZoneSystemServices = retData.list;
        self.editZoneOriginalData['system-services-isexcept'] = retData.isExcept;  
      }
      
      listBuilderData = self.getListBuilderData(allSystemServices, inZoneSystemServices, 'name');
      self.systemServicesListBuilder.addAvailableItems(listBuilderData['availableElements']);
      self.systemServicesListBuilder.addSelectedItems(listBuilderData['selectedElements']);
      
      //Set the check box
      if(self.mode === 'edit') {
        self.$el.find('#deviceconfig_zone_form_system_services_isexcept').prop('checked', self.editZoneOriginalData['system-services-isexcept']);
      }
    },
    bindExceptCheckboxEvents : function (checkbox, listBuilder) {
      var self = this;
      checkbox.on('change', function (event) {
        var currentValue = $(event.target).prop('checked');
        if(currentValue === false) {
          self.createConfirmationDialog(event.target, listBuilder);
        }
      });
    },
    renderHostInboundSystemservicesListBuilder : function() {
      var self = this, id = "system-services-list-builder";
      self.systemServicesListBuilder = self.renderListBuilder(id);
      self.bindExceptCheckboxEvents(self.$el.find("#deviceconfig_zone_form_system_services_isexcept"), self.systemServicesListBuilder);
    },
    renderHostInboundProtocolsListBuilder : function() {
      var self = this, id = "protocols-list-builder";
      self.protocolsListBuilder = self.renderListBuilder(id);
      self.bindExceptCheckboxEvents(self.$el.find("#deviceconfig_zone_form_protocols_isexcept"), self.protocolsListBuilder);
    },
    saveValuesToHostInboundProtocolsListBuilder : function() {
      var self = this, allProtocols = self.activity.allProtocols, listBuilderData, retData, inZoneProtocols = [];

      if(self.mode === 'edit') {
      	retData = self.getExceptListInfo(self.editZoneOriginalData['protocols']);
      	inZoneProtocols = retData.list;
        self.editZoneOriginalData['protocols-isexcept'] = retData.isExcept;  
      }
      
      listBuilderData = self.getListBuilderData(allProtocols, inZoneProtocols, 'name');
      self.protocolsListBuilder.addAvailableItems(listBuilderData['availableElements']);
      self.protocolsListBuilder.addSelectedItems(listBuilderData['selectedElements']);
      
      //Set the check box
      if(self.mode === 'edit') {
        self.$el.find('#deviceconfig_zone_form_protocols_isexcept').prop('checked', self.editZoneOriginalData['protocols-isexcept']);
      }
    },
    getNamesFromObject : function(inputArr, _key) {
      var retArr = [], i, l = inputArr.length, key = _key ? _key : 'name';
      for (i = 0; i < l; ++i) {
        retArr[i] = inputArr[i][key];
      }
      return retArr;
    },
    addRowsToInterfaceTrafficGrid : function() {
      var self = this, intfName, interfaceTraffic, i, l, interfaceList = self.editZoneOriginalData['interfaces'], rowId , rowData = [], gridId = "zones-eachinterface-inbound-traffic-list", gridTable = self.$el.find('#' + gridId), container = self.interfaceGridContainer;

      // Remove all existing rows from grid
      gridTable.jqGrid('clearGridData');
      container.find(".grid-widget").addClass("elementinput-long");
      interfaceTraffic = self.editZoneOriginalData['interfaces-traffic'];
      for (i = 0, l = interfaceList.length; i < l; ++i) {
        if(interfaceList[i].inactive !== true) {
          intfName = interfaceList[i].name; 
          rowId = intfName.split('/').join('_');
          rowId = rowId.replace('.', '_');
          rowData[i] = {
            'row-id' : rowId,
            'system-services' : interfaceTraffic[intfName]['system-services'],
            'system-services-isexcept' : [interfaceTraffic[intfName]['system-services-isexcept']],
            'protocols' : interfaceTraffic[intfName]['protocols'],
            'protocols-isexcept' : [interfaceTraffic[intfName]['protocols-isexcept']],
            'name' : intfName
          };
          //gridTable.jqGrid('addRowData', rowId, rowData[i], 'last');
          self.interfaceGrid.addRow(rowData[i], 'last');
        }
    	
      }
    },

    refreshInterfaceInboundTrafficGridData : function(event, newInterfaces) {
      if (this.interfaceListBuilder === undefined) {
        return;
      }
      
      var self = this, i, l, interfaceList = newInterfaces, rowData = [], gridId = "zones-eachinterface-inbound-traffic-list", gridTable = self.$el.find('#' + gridId), rowId;

      self.interfaceGridContainer.find(".grid-widget").addClass("elementinput-long");
      for (i = 0, l = interfaceList.length; i < l; ++i) {
        rowId = interfaceList[i]['value'].split('/').join('_');
        rowId = rowId.replace('.', '_');
        if(event === 'select') {
          rowData[i] = {
              'row-id' : rowId,
              'name' : interfaceList[i]['value'],
              'system-services' : [],
              'system-services-isexcept' : [],
              'protocols' : [],
              'protocols-isexcept' : []
          };
          //gridTable.jqGrid('addRowData', rowId, rowData[i], 'last');
          self.interfaceGrid.addRow(rowData[i], 'last');
        } else {
          gridTable.jqGrid('delRowData', rowId);
        }
      }
    },

    renderInterfaceInboundTrafficGrid : function(gridConfig) {
      var self = this, container = self.$el.find("#deviceconfig_zone_form_interface_inbound_traffic_container"),

      viewConfig = {
        activity : this,
        'columnName' : 'system-services',
        type : "system-services",
        save : function(saveObj, isEditComplete) {
          container.trigger("updateCellOverlayView", saveObj);
          if(isEditComplete === true) {
            interfaceGrid.removeEditModeOnRow();
          }
        }
      }, protocolViewConfig = $.extend({}, viewConfig), interfaceGrid;
      protocolViewConfig.type = "protocols";
      protocolViewConfig['columnName'] = 'protocols';

      interfaceGrid = new GridWidget({
        "elements" : gridConfig,
        "container" : container,
        actionEvents : {},
        "cellOverlayViews" : {
          'system-services' : new ZoneProtocolsView(viewConfig),
          'protocols' : new ZoneProtocolsView(protocolViewConfig)
        }
      // 'actionEvents' : zonesGridConfig.getEvents(),
      // "options" : self.options
      });
      self.interfaceGrid = interfaceGrid;
      interfaceGrid.build();
      container.find(".grid-widget").addClass("elementinput-long");
      self.interfaceGridContainer = container;
    },
    setValuesToInterfaceTrafficGrid : function() {
      var self = this;
      if (self.mode === 'edit') {
        //Set rows for the grid
        self.addRowsToInterfaceTrafficGrid();
      }
    },
    render : function() {
      var self = this, zoneFormConfig, valueObject = {
        "add_edit_form_title" : self.context.getMessage('juniper.sd.deviceconfig.zone.form.add_title')
      }, nameMeta, descMeta, appTrackingMeta, tcpRstMeta, screenMeta;
      if (self.mode === "edit") {
        valueObject = {
          "add_edit_form_title" : self.context.getMessage('juniper.sd.deviceconfig.zone.form.edit_title')
        };
      }
      //based on meta data create the values for form
      
      nameMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/name'];
      descMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/description'];
      descMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/description'];
      appTrackingMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/application-tracking'];
      tcpRstMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/tcp-rst'];
      screenMeta = self.metaData['/'+this.zonePath]['/'+this.zonePath+'/screen'];
      valueObject['name-regex'] = nameMeta.regex;
      valueObject['description-regex'] = descMeta.regex;
      
      valueObject['description-hidden'] = descMeta.applicable === true ? "" :"hide";
      valueObject['app-tracking-hidden'] = appTrackingMeta.applicable === true ? "" :"hide";
      valueObject['tcp-rst-hidden'] = tcpRstMeta.applicable === true ? "" : "hide";
      valueObject['screen-hidden'] = screenMeta.applicable === true ? "" : "hide";
      
      valueObject['name-min-length'] = nameMeta['min-length'];
      valueObject['name-max-length'] = nameMeta['max-length'];
      valueObject['description-min-length'] = descMeta['min-length'];
      valueObject['description-max-length'] = descMeta['max-length'];
      this.context.valueObject = valueObject;

      zoneFormConfig = new ZoneFormConfiguration(this.context);

      
      
      self.formWidget = new FormWidget({
        "elements" : zoneFormConfig.getValues(self),
        "container" : self.el,
        "values" : valueObject
      });
      self.formWidget.build();
      self.$el.addClass("security-management");
      self.renderInterfacesListBuilder();
      self.renderHostInboundSystemservicesListBuilder();
      self.renderHostInboundProtocolsListBuilder();
      self.interfaceGridConfig = zoneFormConfig.getInterfaceInboundTrafficGridConfig();
      self.renderInterfaceInboundTrafficGrid(self.interfaceGridConfig);
      //Start putting values into the form if its in edit mode
      if (self.mode === 'create') {
        self.renderUI();
      }
      return self;
    },
    /**
     *  Create a confirmation dialog with basic settings
     *  Need to specify title, question, and event handle functions in "option"
     *  @params option Object
     */
    createConfirmationDialog: function(checkboxClicked, listBuilder) {
        var self = this, confirmationDialogWidget = null;
        confirmationDialogWidget = new ConfirmationDialog({
            title: self.context.getMessage('juniper.sd.deviceconfig.zone.form.confirm'),
            question: self.context.getMessage('juniper.sd.deviceconfig.zone.form.exceptSwitch.warning'),
            yesButtonLabel: self.context.getMessage('juniper.sd.deviceconfig.zone.form.yes'),
            noButtonLabel: self.context.getMessage('juniper.sd.deviceconfig.zone.form.no'),
            yesButtonCallback: function() {
              //Remove selections
              var oldSelections = listBuilder.getSelectedItems();
              listBuilder.removeSelectedItems(self.getNamesFromObject(oldSelections, 'value'));
              listBuilder.addAvailableItems(oldSelections);
              confirmationDialogWidget.destroy();
            },
            noButtonCallback: function() {
              var oldValue = !$(checkboxClicked).prop('checked');
              $(checkboxClicked).prop('checked', oldValue);
              confirmationDialogWidget.destroy();
            },
            xIcon: true
        });
        confirmationDialogWidget.build();
    },
    renderUI : function() {
      var self = this;
      self.renderScreens();
      self.setValuesToInterfacesListBuilder();
      self.setValuesToHostInboundSystemservicesListBuilder();
      self.saveValuesToHostInboundProtocolsListBuilder();
      self.setValuesToInterfaceTrafficGrid();
      if (self.mode === 'edit') {
        self.setSimpleValues();
      }
    },
    setSimpleValues : function() {
      var self = this;
      if(self.editZoneOriginalData['name'].inactive !== true) {
        self.$el.find("#name").val(self.editZoneOriginalData['name'].value);  
      }
      if(self.editZoneOriginalData['description'].inactive !== true) {
    	self.$el.find("#deviceconfig_zone_form_description").val(self.editZoneOriginalData['description'].value);  
      }
      if (self.editZoneOriginalData['application-tracking'].inactive !== true) {
    	self.$el.find('#deviceconfig_zone_form_application_tracking').prop('checked', self.editZoneOriginalData['application-tracking'].value);  
      }
      if(self.editZoneOriginalData['tcp-rst'].inactive !== true) {
    	self.$el.find('#deviceconfig_zone_form_tcp_rst').prop('checked', self.editZoneOriginalData['tcp-rst'].value);
      }
    },
    getComplexData : function (originalCount, newCount, typePath, getDataFunc, generateDeletePaths, _arrayOfInterfaceAddPaths, inactiveIndex) {
      var self = this, i, retArr = {}, tmpArr, tmpKey, arrayOfDeletePaths = self.arrayOfDeletePaths, arrayOfAddPaths = _arrayOfInterfaceAddPaths || self.arrayOfAddPaths;
      
      tmpArr = [];
      if(generateDeletePaths !== false) {
        for (i = 0; i < originalCount; i++) {
          //Dont use this index if its inactive
          if(-1 === $.inArray(i, inactiveIndex)) {
         // Delete items
            tmpArr[tmpArr.length] = {
              "schema-path" : 'deviceConfigMgr:/net.juniper.jmp.jpa.LogicalDevice:' + self.deviceId + ':' + self.sessionId + '/' + self.schemaVersion + ':' + typePath + '[@rowId="' + (i + 1).toString() + '"]'
            };
          }
        }
        if(tmpArr.length > 0) {
          arrayOfDeletePaths.push({
            "parent-data-path" : typePath,
            "items" : {
              "generic-data-item" : tmpArr
            }
          });
        }
      }
      
      
      //Now add fresh
      for (i = 0; i < newCount; ++i) {
        tmpArr =  getDataFunc(i);
        if(tmpArr === null) {
          continue;
        }
        tmpKey = typePath + '[@rowId="0"]';
        arrayOfAddPaths.push({
          'parent-data-path' : tmpKey,
          'items' : {
            'generic-data-item' : tmpArr
          }
        });
      }
      return retArr;
    },
    
    getTrafficConfigObject : function (name, isExcept) {
      if(isExcept && name === 'all') {
        return null;
      }
      var tmpArr = [];
      tmpArr[0] = {
        "value" : name,
        "schema-path" : 'name',
        "inactive" : false
      };
      if(isExcept) {
        tmpArr[1] = {
            "value" : isExcept,
            "schema-path" : 'except',
            "inactive" : false
          };  
      }
      return tmpArr;
    },
    getInactiveIndicies : function (originalData, currentSelections, key) {
      var i,j,l,ll, inactiveIndicies = [];
      for (i = 0, l = originalData.length; i < l; ++i) {
        if(originalData[i].inactive === true) {
          //Check if its present in the current selections or not
          for(j = 0 , ll = currentSelections.length; j < ll;++j) {
            if(key === null ? currentSelections[j] : currentSelections[j][key] === originalData[i].name) {
              break;
            }
          }
          if(j === ll) {
            inactiveIndicies[inactiveIndicies.length] = i;
          }
        }
      }
      return inactiveIndicies;
    },
    getZoneInBoundTrafficData : function(selections, typePath, isExcept) {
      var self = this, originalCount = 0, type, tmpKey, getEditData, retData, originalData = [], inactiveIndicies = [];
      
      if (self.mode === 'edit') {
        type = typePath.split('/');
        type = type[type.length-1];
        originalCount = self.editZoneOriginalData[type].length;
        originalData = self.editZoneOriginalData[type];
      }
      getEditData = function (i) {
        return self.getTrafficConfigObject(selections[i].value, isExcept);
      };
      inactiveIndicies = self.getInactiveIndicies(originalData, selections, 'value');
      
      retData = self.getComplexData(originalCount, selections.length, (self.thisZonePath + typePath), getEditData, true, null, inactiveIndicies);
      if(isExcept && selections.length > 0) {
          tmpKey = self.thisZonePath + typePath + '[@rowId="0"]';
          self.arrayOfAddPaths.push({
            'parent-data-path' : tmpKey,
            'items' : {
              'generic-data-item' : self.getTrafficConfigObject('all', false)
            }
          });
      }
      return retData;
    },
    getInterfaceData : function() {
      var self = this, rows, l, thisZonePath = self.thisZonePath, arrayOfXPaths = {}, originalInterfaceCount = 0, getEditData, originalData = [], inactiveIndicies = [];

      if (self.mode === 'edit') {
        originalData = self.editZoneOriginalData['interfaces'];
        originalInterfaceCount = originalData.length;
      }

      rows = self.interfaceGrid.getAllVisibleRows();
      l = rows.length;
      
      getEditData = function (i) {
        return [ {
          "value" : rows[i].name,
          "schema-path" : 'name',
          "inactive" : false
        } ];
      };
      inactiveIndicies = self.getInactiveIndicies(originalData, rows, 'name');
      self.numberOfInactiveInterfacesDuringSave = inactiveIndicies.length;
      self.getComplexData(originalInterfaceCount, l, (thisZonePath + '/interfaces'), getEditData, true, self.arrayOfInterfaceAddPaths, inactiveIndicies);
      return arrayOfXPaths;
    },
    getInterfaceTrafficData : function () {
      var i,l, interfacePathObj, ll,inactiveIndex = [], tmpSystemServiceKey, tmpProtocolKey, self = this, rows = self.interfaceGrid.getAllVisibleRows(), tmpKey, arrayOfXPaths = {}, thisZonePath = self.thisZonePath , isExcept = false, originalCount = 0,systemServices = [], protocols= [],
      editFunction = function(j){
        return self.getTrafficConfigObject(systemServices[j], isExcept);
      },
      editFunctionProtocols = function(j){
        return self.getTrafficConfigObject(protocols[j], isExcept);
      };
      
      for (i = 0, l = rows.length; i < l; ++i) {
        //This 
        tmpKey = thisZonePath + '/interfaces' + '[@rowId="' + (i + 1 + self.numberOfInactiveInterfacesDuringSave).toString() + '"]';
        inactiveIndex = [];
        systemServices = rows[i]['system-services'];
        if (self.mode === 'edit' && self.editZoneOriginalData['interfaces-traffic']) {
          interfacePathObj = self.editZoneOriginalData['interfaces-traffic'][rows[i].name];
          if(interfacePathObj && interfacePathObj['system-services']) {
            originalCount =  interfacePathObj['system-services'].length;
            inactiveIndex = self.getInactiveIndicies(interfacePathObj['system-services-original-data'], systemServices, null);
          } else {
            originalCount = 0;
            inactiveIndex = [];
          }
        }
        isExcept = rows[i]['system-services-isexcept'][0] === "true";
        ll = systemServices.length;
        tmpSystemServiceKey = tmpKey + '/host-inbound-traffic/system-services';
        
        $.extend(arrayOfXPaths,self.getComplexData(originalCount, ll, tmpSystemServiceKey, editFunction, false, null, inactiveIndex));
        if(isExcept && ll > 0) {
            self.arrayOfAddPaths.push({
              'parent-data-path' : tmpSystemServiceKey + '[@rowId="0"]',
              'items' : {
                'generic-data-item' : self.getTrafficConfigObject('all', false)
              }
            });
        }
        
        inactiveIndex = [];
        protocols = rows[i]['protocols'];
        if (self.mode === 'edit' && self.editZoneOriginalData['interfaces-traffic']) {
          interfacePathObj = self.editZoneOriginalData['interfaces-traffic'][rows[i].name];
          if(interfacePathObj && interfacePathObj['protocols']) {
            originalCount =  interfacePathObj['protocols'].length;
            inactiveIndex = self.getInactiveIndicies(interfacePathObj['protocols-original-data'], protocols, null);
          } else {
            originalCount = 0;
            inactiveIndex = [];
          }
        }

        isExcept = rows[i]['protocols-isexcept'][0] === "true";
        ll = protocols.length;
        tmpProtocolKey = tmpKey + '/host-inbound-traffic/protocols';
        $.extend(arrayOfXPaths,self.getComplexData(originalCount, ll, tmpProtocolKey, editFunctionProtocols, false, null, inactiveIndex));
        if(isExcept && ll > 0) {
            self.arrayOfAddPaths.push({
              'parent-data-path' : tmpProtocolKey + '[@rowId="0"]',
              'items' : {
                'generic-data-item' : self.getTrafficConfigObject('all', false)
              }
            });
        }
      }
      return arrayOfXPaths;
    },
    
    onFirstSaveForZoneCreate : function(firstResponse) {
      console.log(firstResponse);
      // Parse the rowId after create
      // configuration/security/zones/security-zone[@rowId="7"]:

      var filterResponse = firstResponse['filtered-response'], newRowId, self = this, input1 = {}, tmpObj = {}, onAddPathsSuccess, 
      onAddInterfacePathsSuccess, onDeletePathSuccess;
      if(self.mode === 'edit') {
        newRowId = self.rowId;
      } else {
        for (newRowId in filterResponse) {
          if (filterResponse.hasOwnProperty(newRowId)) {
            newRowId = self.isLsys ? newRowId.split("\"")[3] : newRowId.split("\"")[1];
            break;
          }
        }
        self.thisZonePath = self.zonePath + '[@rowId="' + newRowId.toString() + '"]';  
      }
      
      $.extend(tmpObj, self.getZoneInBoundTrafficData(self.systemServicesListBuilder.getSelectedItems(), '/host-inbound-traffic/system-services', self.guiParams['system-services-isexcept']));
      $.extend(tmpObj, self.getZoneInBoundTrafficData(self.protocolsListBuilder.getSelectedItems(), '/host-inbound-traffic/protocols', self.guiParams['protocols-isexcept']));
      $.extend(tmpObj, self.getInterfaceData());
      $.extend(tmpObj, self.getInterfaceTrafficData());
      console.log(tmpObj);
      onAddPathsSuccess = function() {

        // Append the new row to grid
        var gridTable, deviceZoneObject = {}, guiParams = self.guiParams;
        gridTable = self.activity.zonesGrid;

        deviceZoneObject["row-id"] = newRowId;
        deviceZoneObject["name"] = guiParams["name"];
        deviceZoneObject["description"] = guiParams["description"];
        deviceZoneObject["screen"] = guiParams["screen"];
        deviceZoneObject["interfaces"] = JSON.stringify({
           "/security/zones/security-zone" :
           self.$el.find("#zones-eachinterface-inbound-traffic-list").jqGrid('getCol', 'name', false)
        });
        if (self.mode === 'create') {
          gridTable.addRow(deviceZoneObject, 'last');
        } else {
          gridTable.editRow({
            'row-id' : newRowId
          }, deviceZoneObject);
        }
        self.activity.overlay.destroy();
      
      };
      onAddInterfacePathsSuccess = function() {
        if (self.arrayOfAddPaths.length === 0) {
          onAddPathsSuccess();
        } else {
          self.makeAddPathsCall(self.arrayOfAddPaths, function() {
            onAddPathsSuccess();
          });
        }
      };
      
      onDeletePathSuccess = function () {
        //Make the add interfaces call
        if (self.arrayOfInterfaceAddPaths.length === 0) {
          onAddInterfacePathsSuccess();
        } else {
          self.makeAddPathsCall(self.arrayOfInterfaceAddPaths, function() {
            onAddInterfacePathsSuccess();
          });
        }
      };
      
      
      if ($.isEmptyObject(self.arrayOfDeletePaths) === false) {
        input1.success = function(self, request, response) {
          onDeletePathSuccess();
        };
        input1.failure = function(self, request, response) {
          console.log('failed to remove items');
        };
        input1['xpath-list'] = self.arrayOfDeletePaths;
        input1.self = self;
        //input1['disable-validation'] = true;
        self.activity.removeData(input1);
      } else {
        onDeletePathSuccess();
      }

    },
    makeAddPathsCall : function(arrayOfAddPaths, _successCallback) {
      var self = this, inputRequest = {
        "configuration" : {
          "data-service-name" : "deviceConfigMgr",
          "schema-version" : self.schemaVersion,
          "session-id" : self.sessionId,
          "data" : {
            "generic-data" : {
              "device-id" : self.deviceId,
              "parent-data-path-list" : arrayOfAddPaths
            }
          }
        }
      }, model1;

      model1 = new BaseWizardModel();

      model1.requestHeaders.contentType = "application/vnd.api.space.configuration-management.push-configuration+json;version=1;charset=UTF-8";
      $.when(model1.fetch({
        method : 'POST',
        data : JSON.stringify(inputRequest)
      })).done(function(model, response, options) {
        _successCallback();
      });
    },
    saveZone : function(event) {
      var self = this, /*syphonRegistry,*/guiParams, needToBeConfigured, tmpObj, input,i,l, simpleItem, eachItem, simpleItemsList = self.simpleItemsList, servicesList = [] ;
      event.preventDefault();
      if (self.formWidget.isValidInput(self.$el.find('form'))) {
        //Check if any-service is selected
        servicesList = self.getNamesFromObject(self.systemServicesListBuilder.getSelectedItems(), 'value');
        if(servicesList.length > 1 && -1 < $.inArray('any-service', servicesList)) {
          self.formWidget.showFormError(self.context.getMessage("juniper.sd.deviceconfig.zones.any-service.error"));
          return;
        }
        // Set the Syphon registration to take schema-path as key
        /*syphonRegistry = function($el) {
          return $el.prop("schema-path");
        };*/
        // Backbone.Syphon.KeyExtractors.registerDefault(syphonRegistry);
        guiParams = Syphon.serialize(self);
        self.guiParams = guiParams;
        console.log(guiParams);
        self.arrayOfAddPaths = [];
        self.arrayOfDeletePaths = [];
        self.arrayOfInterfaceAddPaths = [];

        var errorText = self.customFormValidation(self.guiParams.name,self.zonePath,self.rowId,self);
        if(errorText === ""){
        tmpObj = {};
        tmpObj[self.thisZonePath] = [];
        for (i = 0, l = simpleItemsList.length; i < l;  ++i) {
          simpleItem = simpleItemsList[i];
          needToBeConfigured = false;
          if(self.mode === 'create' && guiParams[simpleItem]) {
            needToBeConfigured = true;
          } else if (self.mode === 'edit') {
            if(self.editZoneOriginalData[simpleItem].inactive === true) {
              if(guiParams[simpleItem]) {
                needToBeConfigured = true;
              }
            }else if (typeof guiParams[simpleItem] === "boolean") {
              if(guiParams[simpleItem] !== DeviceConfigUtil.getBooleanValue( self.editZoneOriginalData[simpleItem].value ) ) {
                needToBeConfigured = true;
              }
            } else {
              if(guiParams[simpleItem] !== DeviceConfigUtil.getStringValue(self.editZoneOriginalData[simpleItem].value)) {
                needToBeConfigured = true;
              }
            }  
          }

          if(needToBeConfigured === true) {
            eachItem = {
              "value" : guiParams[simpleItem],
              "schema-path" : simpleItem,
              "inactive" : false
            };
            tmpObj[self.thisZonePath].push(eachItem);
          }
        }
        input = {};
        input['xpath-list'] = tmpObj;
        input.self = self;
        input.success = function(self, request, response) {
          // Parse the rowId after create
          self.onFirstSaveForZoneCreate(response);
        };
        input.failure = function() {
          console.log("Failed");
        };
        input['disable-validation'] = true;
        self.activity.flushData(input);
        }
        else{
            CustomValidator.addError(self.$el.find('#name'), errorText);
        }

        // Unregister own custom key specific to DC
        // Backbone.Syphon.KeyExtractors.unregister(syphonRegistry);
      }
    },
    closeDeviceZoneConfigurationOverlay : function(event) {
      event.preventDefault();
      this.activity.overlay.destroy();
    }
  });
  return createZoneForm;
});