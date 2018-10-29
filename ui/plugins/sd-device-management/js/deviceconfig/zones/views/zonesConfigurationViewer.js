define([ 'widgets/form/formWidget',
         'widgets/overlay/overlayWidget',
         '../../../../../space-device-management/js/device/configuration/forms/abstractConfigurationEditorFormView.js',
         '../../../../../space-device-management/js/device/configuration/grid/abstractGridConfigurationEditorView.js',
         '../conf/zonesGridConfiguration.js',
         './createZoneForm.js',
         '../../../../../space-device-management/js/device/configuration/models/baseWizardModel.js' ],
  function(FormWidget, OverlayWidget, AbstractConfigurationEditorFormView, AbstractGridConfigurationEditorView, ZonesGridConfiguration, ZoneForm, BaseWizardModel) {

  var ZonesGridConfigurationViewer = AbstractConfigurationEditorFormView.extend({

    initialize : function(options) {

      var self = this, i, l, xpaths = [], items = [ /*'name', 'description', 'application-tracking', 'screen', 'tcp-rst', */'host-inbound-traffic/system-services', 'host-inbound-traffic/protocols' ], requestObject;
      self.activity = this.options.activity;
      self.devicePathConfiguration = self.getRootConfiguration(self.activity.isLsysDevice);
      self.context = this.activity.context;
      self.baseZonePath = self.devicePathConfiguration + "/security/zones/security-zone";
      self.isLsys = self.activity.isLsysDevice;
      self.model = new BaseWizardModel();
      try {
        self.deviceId = self.activity.deviceId;
        self.sessionId = self.activity.sessionId;
        self.schemaVersion = self.activity.schemaVersion;
        self.supportMultiple = this.activity.supportMultiple;
        self.username = this.activity.user;
        self.options = {
          'deviceId' : this.deviceId,
          'sessionId' : this.sessionId,
          'schemaVersion' : this.schemaVersion,
          'supportMultiple' : this.supportMultiple,
          'username' : this.username
        };
        xpaths[0] = self.baseZonePath;
        for (i = 0, l = items.length; i < l; ++i) {
          xpaths[xpaths.length] = self.baseZonePath + "/" + items[i];
        }
        requestObject = {
          "xpath-list" : xpaths,
          requiredMetaDataField : ['name','description','xpath-string','min-range','max-range','regex','enum-values','min-length','max-length', 'applicable'],
          "success" : function(self, request, responseData) {
            console.log(responseData);
            var pathPrefix = "/" + self.baseZonePath;
            self.allProtocols = responseData['filtered-response'][pathPrefix + '/host-inbound-traffic/protocols'][pathPrefix + '/host-inbound-traffic/protocols/name']['enum-values'];
            self.allSystemServices = responseData['filtered-response'][pathPrefix + '/host-inbound-traffic/system-services'][pathPrefix + '/host-inbound-traffic/system-services/name']['enum-values'];
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
      var self = this, zonesGridConfig = new ZonesGridConfiguration(self), gridConfig, tabContainer;
      self.form = new FormWidget({
        container : self.el,
        elements : {
          "title" : "Zones",
          "title-help":{
             "content" : self.context.getMessage("zones_grid_title_help"),
             "ua-help-text":self.context.getMessage("more_link"),
             "ua-help-identifier": self.context.getHelpKey("SECURITY_DEVICES_ZONE_MODIFYING")
          },
          "on_overlay" : false,
          "form_id" : "zones_configuration_view",
          "sections" : [ {
            "section_id" : 'zones_grid_section',
            "elements" : []
          } ]
        }
      });

      self.form.build();
//      self.$el.find('#zones_configuration_view').css('height', '100%');
//      self.$el.find('#zones_configuration_view').parent().css('height', '100%');
      gridConfig = zonesGridConfig.getValues();
      tabContainer = $.find('.tabContainer-widget_allTabs');
      gridConfig['height'] = Math.floor(((($(tabContainer).outerHeight() - 643 ) / 1.02 )+ 335)) - 10 + "px"; //{335,643} {425,735}

      self.zonesGrid = new AbstractGridConfigurationEditorView({
        "elements" : gridConfig,
        "container" : self.$el.find('#zones_grid_section'),
        'actionEvents' : zonesGridConfig.getEvents(),
        "options" : self.options
      });

      $.when(self.zonesGrid.buildGrid(zonesGridConfig.getEvents())).done(function(model, repsonse, _options) {
        var grid = self.$el.find('#zones_grid_section')/*, options = {}*/;
        grid.unwrap();

        /*options['self'] = self;
        options['grid-id'] = 'zones-configuration-list';
        options['fetch-type'] = 'ALL';
        self.zonesGrid.updateDataItems(options);*/

        self.bindDeviceZoneGridEvents(zonesGridConfig.getEvents());
      });
      self.$el.find('#zones_grid_section').bind("gridOnRowSelection", function(e, selectedRows) {
        self.$el.find(".update").attr("disabled", "disabled");
      });

      return self;
    },

    bindDeviceZoneGridEvents : function(definedEvents) {
      var self = this;

      // create button for grid
      if (definedEvents.createEvent) {
        self.$el.bind(definedEvents.createEvent, $.proxy(self.createZoneAction, self));
      }

      // edit button for grid
      if (definedEvents.updateEvent) {
        self.$el.bind(definedEvents.updateEvent, $.proxy(self.editZoneAction, self));
      }
      // delete button for grid
      if (definedEvents.deleteEvent) {
        self.$el.bind(definedEvents.deleteEvent, $.proxy(self.deleteZoneAction, self));
      }
    },
    launchZoneForm : function(rowId, mode) {
      var self = this, view = new ZoneForm({
        activity : self,
        mode : mode,
        rowId : rowId
      });
      self.buildOverlay(view, "medium");
    },

    /**
     * This is create button click handler
     */
    createZoneAction : function(e, row) {
      var self = this;
      self.launchZoneForm(0, 'create');
    },

    /**
     * This is edit button click handler
     */
    editZoneAction : function(e, row) {
      var self = this, zonesGrid = self.zonesGrid, numberOfRecords = 0;
      if (zonesGrid.getSelectedRows()) {
        numberOfRecords = zonesGrid.getSelectedRows().length;
        if (numberOfRecords === 1) {
          self.launchZoneForm(row.originalRow["row-id"], 'edit');
        }
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

    deleteZoneAction : function(e, row) {
      var self = this, length, genericDataItemList, ii, genericDataItem, xpath, dataPathList, request;
      e.preventDefault();
      length = 0;
      if (row.deletedRows) {
        length = row.deletedRows.length;
        if (length > 0) {
          genericDataItemList = [];
          for (ii = 0; ii < length; ii++) {
            genericDataItem = {};
            xpath = self.baseZonePath + "[@rowId=\"" + row.deletedRows[ii]["row-id"] + "\"]";
            genericDataItem["schema-path"] = 'deviceConfigMgr:/net.juniper.jmp.jpa.LogicalDevice:' + self.deviceId + ':' + self.sessionId + '/' + self.schemaVersion + ':' + xpath;
            genericDataItemList.push(genericDataItem);
          }
          dataPathList = {
            "parent-data-path" : self.baseZonePath,
            "items" : {
              "generic-data-item" : genericDataItemList
            }
          };
          request = {};
          request.success = self.deleteZoneActionOnSuccess;
          request.failure = self.deleteZoneActionOnFailure;
          request.self = self;
          request.method = "DELETE";
          request['xpath-list'] = dataPathList;
          self.removeData(request);
        }
      }
    },

    deleteZoneActionOnSuccess : function(_self, request, response) {

      var self = request.self, options = {};

      options['self'] = self;
      options['grid-id'] = 'zones-configuration-list';
      options['fetch-type'] = 'ALL';
      self.zonesGrid.updateDataItems(options);
    },
    deleteZoneActionOnFailure : function(self, request, response) {
      console.log('failed to delete zones');
    }
  });
  return ZonesGridConfigurationViewer;
});
