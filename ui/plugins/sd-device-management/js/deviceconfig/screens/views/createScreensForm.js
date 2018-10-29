/**
 * Created by ramesha on 11/12/15.
 */
define(['backbone.syphon',
        'widgets/form/formWidget',
        'widgets/overlay/overlayWidget',
        'widgets/listBuilder/listBuilderWidget',
        '../../../../../space-device-management/js/device/configuration/grid/abstractGridConfigurationEditorView.js',
        '../conf/createScreensConfigurationCreateForm.js',
        '../../../../../space-device-management/js/device/configuration/models/baseWizardModel.js',
        'widgets/scheduleRecurrence/lib/customValidator',
        '../../../util/deviceConfigValidationUtility.js',
        '../../util/deviceConfigUtil.js'],
        function( Syphon, FormWidget, OverlayWidget, ListBuilderWidget, AbstractGridConfigurationEditorView, CreateScreensConfigurationCreateForm, BaseWizardModel,
        CustomValidator,ValidateUtility, deviceConfigUtil) {
            var DeviceConfigUtil = new deviceConfigUtil();
            var createScreensForm = ValidateUtility.extend({
            events : {
                'click #device-screens-save' : 'saveScreen',
                'click #device-screens-cancel' : 'closeDeviceScreenConfigurationOverlay'
            },
            initialize : function() {
                this.activity = this.options.activity;
                this.items = this.options.activity.items;
                this.context = this.activity.context;
                this.values = this.options.values;
                this.mode = this.options.mode;
                this.selectedDeviceScreenRowId = 0;
                this.metaData = this.activity.metaData;
                if(this.mode === "edit"){
                 this.selectedDeviceScreenRowId = this.options.values["row-id"];
                }
                this.deviceId = this.activity.deviceId;
                this.sessionId = this.activity.sessionId;
                this.schemaVersion = this.activity.schemaVersion;
                this.parentRoutePath = this.activity.parentRoutePath;
                this.screenPath = this.activity.baseScreenPath;
                this.isLsys = this.activity.isLsys;
                this.options = {
                    'deviceId' : this.deviceId,
                    'sessionId' : this.sessionId,
                    'schemaVersion' : this.schemaVersion,
                    'username' : this.username
                };
            },

        render : function() {
      var self = this, i, l, createScreensConfiguration, validateObject = {},check,valueObject = {
        "add_edit_form_title" : self.context.getMessage('juniper.sd.deviceconfig.screen.form.add_title')
      }, simpleChecks = [ 'alarm-without-drop', 'land', 'tear-drop', 'fragment', 'ping-death', 'large', 'block-frag', 'syn-ack-ack-proxy', 'winnuke', 'bad-option', 'security-option', 'unknown-protocol', 'strict-source-route-option', 'source-route-option', 'timestamp-option', 'stream-option', 'loose-source-route-option', 'record-route-option', 'syn-frag', 'syn-fin', 'fin-no-ack', 'tcp-no-flag', 'spoofing' ],

      complexValues = [ 'syn-ack-ack-proxy', 'syn-flood', 'icmp_flood', 'udp_flood', 'icmp_ip-sweep', 'udp_udp-sweep', 'port-scan', 'tcp-sweep' ], textValues = [ 'source-ip-based', 'destination-ip-based', 'alarm-threshold', 'attack-threshold', 'source-threshold', 'destination-threshold', 'timeout', 'syn-ack-ack-proxy_threshold', 'icmp_flood_threshold', 'udp_flood_threshold', 'icmp_ip-sweep_threshold', 'tcp-sweep_threshold', 'udp_udp-sweep_threshold', 'port-scan_threshold' ],
      synValues = ['alarm-threshold','attack-threshold','source-threshold','destination-threshold','timeout'];

      if (self.mode === "edit") {
        valueObject = {
          "add_edit_form_title" : self.context.getMessage('juniper.sd.deviceconfig.screen.form.edit_title')
        };
        self.values.add_edit_form_title = valueObject.add_edit_form_title;
        valueObject = self.values;
      }

      /*
       * Schema Validation code
       *
       */
      for (i = 0; i < self.items.length; i++) {
        for (j in self.metaData['/' + this.screenPath + '/' + self.items[i]]) {
          if (typeof (self.metaData['/' + this.screenPath + '/' + self.items[i]][j]) == "object" && j.indexOf("white-list") === -1 && j.indexOf("apply-groups") === -1 && j.indexOf("ipv6") === -1 && j.indexOf("icmpv6") === -1) {
            validateObject[j.split("/" + this.screenPath + '/')[1] + '-Meta'] = self.metaData['/' + this.screenPath + '/' + self.items[i]][j];
          }
        }
      }
      validateObject['name-Meta'] = self.metaData['/' + this.screenPath]['/' + this.screenPath + '/name'];
      validateObject['description-Meta'] = self.metaData['/' + this.screenPath]['/' + this.screenPath + '/description'];
      validateObject['alarm-without-drop-Meta'] = self.metaData['/' + this.screenPath]['/' + this.screenPath + '/alarm-without-drop'];

      valueObject['name-regex'] = validateObject['name-Meta'].regex;
      valueObject['description-regex'] = validateObject['description-Meta'].regex;

      for (i in validateObject) {
        valueObject[i.split("Meta")[0] + 'min-length'] = validateObject[i]['min-range'];
        valueObject[i.split("Meta")[0] + 'max-length'] = validateObject[i]['max-range'];
        valueObject[i.split("Meta")[0] + 'hidden'] = validateObject[i]['applicable'] ? "" : "hide";
      }
      valueObject['name-min-length'] = validateObject['name-Meta']['min-length'];
      valueObject['description-min-length'] = validateObject['description-Meta']['min-length'];
      valueObject['name-max-length'] = validateObject['name-Meta']['max-length'];
      valueObject['description-max-length'] = validateObject['description-Meta']['max-length'];

      /*
       * Populating Values and validations into the form....
       *
       */
      this.context.valueObject = valueObject;
      createScreensConfiguration = new CreateScreensConfigurationCreateForm(this.context);
      self.formWidget = new FormWidget({
        "elements" : createScreensConfiguration.getValues(self),
        "container" : self.el,
        "values" : valueObject
      });

      $.when(self.formWidget.build()).done(function() {
        var hideSubnet = self.$el.find('#device_screen_id');
        hideSubnet.unwrap().remove();
        self.$el.find('[for="device_screen_id"]').unwrap().remove();
      });
      /*
       * Filling the form with earlier values from the response
       *
       */
      if (self.mode === "edit") {
        for (i = 0, l = simpleChecks.length; i < l; ++i) {
          if (self.values[simpleChecks[i] + '_inactive'] !== true) {
            self.$el.find('#' + simpleChecks[i]).prop('checked', self.values[simpleChecks[i]]);
          }
        }
        for (i = 0, l = textValues.length; i < l; ++i) {
          if (self.values[textValues[i] + '_inactive'] !== true) {
            self.$el.find('#' + textValues[i]).val(self.values[textValues[i]]);
          }
        }
        for (i = 0, l = complexValues.length; i < l; ++i) {
          if (self.values[complexValues[i] + '_inactive'] !== true) {
            self.$el.find('#' + complexValues[i]).prop('checked', self.values[complexValues[i]].value);
          }
        }
      }
       /*
       * Show and Hide text fields on change of checkboxes
       *
       */

    for(i=0,l = complexValues.length ;i < l ; i++){
      check = self.$el.find("#"+complexValues[i]).prop("checked");
        if(check){
           if(complexValues[i] === "syn-flood"){
               self.synValuesShowHide(synValues,complexValues,check);
           }else{
                self.$el.find("#"+complexValues[i]+"_threshold").show();
           }
        } else {
                if(complexValues[i] === "syn-flood"){
                   self.synValuesShowHide(synValues,complexValues,check);
                }else{
                    self.$el.find("#"+complexValues[i]+"_threshold").hide();
                }
        }
    }
    self.$el.find("#syn-ack-ack-proxy,#syn-flood,#icmp_flood,#udp_flood,#icmp_ip-sweep,#udp_udp-sweep,#port-scan,#tcp-sweep").on('change',function() {
       check = this.checked;
        if(check){
            if(this.id === "syn-flood"){
             self.synValuesShowHide(synValues,complexValues,check);
           }else{
                self.$el.find("#"+this.id+"_threshold").show();
           }
        }
        else {
                if(this.id === "syn-flood"){
                self.synValuesShowHide(synValues,complexValues,check);
                }else{
                    self.$el.find("#"+this.id+"_threshold").hide();
                }

            }
        });
      return self;
    },
    synValuesShowHide : function (synValues,complexValues,check)
    {
         for (j = 0 ;j < synValues.length ; j++ ){
             if(check){
                this.$el.find("#"+synValues[j]).parent().siblings().show();
                this.$el.find("#"+synValues[j]).show();
             }
            else {
                this.$el.find("#"+synValues[j]).parent().siblings().hide();
                this.$el.find("#"+synValues[j]).hide();
             }
        }
    },
    saveScreen : function(event) {
      var self = this, params, inputData, input, name, description, alarm_without_drop, inputFields, inputString, field, fieldObj, genericDataItems = [];
      event.preventDefault();
      if (self.formWidget.isValidInput(self.$el.find('form')) && self.$el.find("input[data-invalid]").length === 0) {
        params = Syphon.serialize(self);
        inputData = {};
        input = {};
        name = params["name"].valueOf();
        description = params["description"].valueOf();
        alarm_without_drop = params["alarm-without-drop"].valueOf();
        inputFields = [ name, description, alarm_without_drop ];
        inputString = [ 'name', 'description', 'alarm-without-drop' ];

        var i, errorText = self.customFormValidation(name, self.screenPath, self.selectedDeviceScreenRowId, self), needToBeConfigured = false;
        if (errorText === "") {
          for (i = 0; i < inputFields.length; i++) {
            field = inputFields[i];
            needToBeConfigured = false;
            if (self.mode === 'create' && field) {
              needToBeConfigured = true;
            } else if (self.mode === 'edit') {
              if (self.values[inputString[i] + '_inactive'] === true) {
                if (field) {
                  needToBeConfigured = true;
                }
              } else if (typeof field === "boolean") {
                if(field !== DeviceConfigUtil.getBooleanValue( self.values[inputString[i]] ) ) {
                  needToBeConfigured = true;
                }
              } else {
                if(field !== DeviceConfigUtil.getStringValue( self.values[inputString[i]] ) ) {
                  needToBeConfigured = true;
                }
              }
            }
            if (needToBeConfigured) {
              fieldObj = {
                "value" : field,
                "schema-path" : inputString[i],
                "inactive" : false
              };
              genericDataItems.push(fieldObj);
            }
          }

          inputData[self.screenPath + "[@rowId=\"" + self.selectedDeviceScreenRowId.toString() + "\"]"] = genericDataItems;
          input['xpath-list'] = inputData;
          input.success = self.onAddDeviceScreenSuccess;
          input.failure = self.onAddDeviceScreenFailure;
          input.self = self;
          input.key = self.selectedDeviceScreenRowId;
          input.params = params;
          input['original-row'] = self.values;
          input['disable-validation'] = true;
          self.activity.flushData(input);
        } else {
          CustomValidator.addError(self.$el.find('#name'), errorText);
        }
      }
    },
    onAddDeviceScreenSuccess : function(self, request, response) {
      var responseJson = response["complete-response"], key, record, rowId, params, inputData = {}, input = {}, exceptionList, synFloodList, i, field, n, path1, path, schema, fieldObj, needToBeConfigured;
      self = request.self;
      if (responseJson) {
        if (self.mode === 'create') {
          for (key in responseJson) {
            if (responseJson.hasOwnProperty(key)) {
              record = key;
              rowId = self.isLsys ? record.split("\"")[3] : record.split("\"")[1];
              self.newlyAddedRowId = rowId;
            }
          }
        } else {
          rowId = self.selectedDeviceScreenRowId;
        }

        params = request.params;
        input.name = params.name;
        input.description = params.description;
        delete params['name'];
        delete params['description'];
        delete params['alarm-without-drop'];
        exceptionList = [ 'tcp/syn-ack-ack-proxy', 'icmp/flood', 'udp/flood', 'tcp/port-scan', 'tcp/syn-flood', 'udp/udp-sweep', 'tcp/tcp-sweep', 'icmp/ip-sweep' ];
        synFloodList = [ 'alarm-threshold', 'attack-threshold', 'source-threshold', 'destination-threshold', 'timeout', 'threshold' ];

        for (i in params) {
          if (params.hasOwnProperty(i)) {
            needToBeConfigured = false;
            fieldObj = undefined;
            field = params[i];
            n = i.lastIndexOf("/");
            path1 = i.substring(0, n);
            path = path1 ? "/" + path1 : path1;
            schema = i.substring(n + 1);

            if (exceptionList.indexOf(path1) !== -1 || synFloodList.indexOf(path1) !== -1 || path1 === "limit-session") {
              if (field.length > 0) {
                field = parseInt(field);
              }
            }

            if (self.mode === 'create' && field) {
              needToBeConfigured = true;
            } else if (self.mode === 'edit') {
              if (self.values.temp[i + '_inactive'] === true) {
                if (field) {
                  needToBeConfigured = true;
                }
              } else if (typeof field === "boolean") {
                if(field !== DeviceConfigUtil.getBooleanValue( self.values.temp[i] ) ) {
                  needToBeConfigured = true;
                }
              } else {
                if(field !== DeviceConfigUtil.getStringValue(self.values.temp[i])) {
                  needToBeConfigured = true;
                }
              }
            }

            if (needToBeConfigured === true) {

              if (exceptionList.indexOf(i) !== -1) {
                fieldObj = {
                  "schema-path" : schema,
                  "inactive" : false
                };
                if (field === true) {
                  fieldObj['value'] = field;
                }
              } else if (synFloodList.indexOf(schema) !== -1) {
                if (params[path1] === true) {
                  fieldObj = {
                    "value" : field,
                    "schema-path" : schema,
                    "inactive" : false
                  };
                } else {
                  fieldObj = undefined;
                }
              } else {
                if (field !== undefined) {
                  fieldObj = {
                    "value" : field,
                    "schema-path" : schema,
                    "inactive" : false
                  };
                }
              }
            }

            if (fieldObj !== undefined && fieldObj.inactive === false) {
              if (inputData[self.screenPath + "[@rowId=\"" + rowId + "\"]" + path]) {
                inputData[self.screenPath + "[@rowId=\"" + rowId + "\"]" + path].push(fieldObj);
              } else {
                inputData[self.screenPath + "[@rowId=\"" + rowId + "\"]" + path] = [ fieldObj ];
              }
            }
          }
        }
      }

      input['xpath-list'] = inputData;
      if (self.mode === "edit") {
        input.success = self.onEditDeviceScreenSuccess;
        input.failure = self.onEditScreenFailure;
      }
      if (self.mode === "create") {
        input.success = self.onDeviceScreenAdvancedOptionsSuccess;
        input.failure = self.onAddDeviceScreenFailure;
      }
      input.self = self;
      input.params = params;
      input['original-row'] = self.values;
      input['disable-validation'] = true;
      self.activity.flushData(input);
      self.activity.overlay.destroy();
    },
    onEditDeviceScreenSuccess : function(self, request, response) {
      var params, originalRow, deviceScreenObject = {}, deviceScreenGridWidget;
      self = request.self;
      params = request.params;
      originalRow = request['original-row'];
      deviceScreenObject["name"] = request.name;
      deviceScreenObject["description"] = request.description;
      deviceScreenGridWidget = self.activity.deviceScreenGridWidget;
      deviceScreenGridWidget.editRow(originalRow, deviceScreenObject);
    },
    onDeviceScreenAdvancedOptionsSuccess : function(self, request, response) {
      var rowId, deviceScreenObject = {}, gridTable;
      params = request.params;
      self = request.self;
      rowId = self.newlyAddedRowId;
      gridTable = self.activity.deviceScreenGridWidget;

      deviceScreenObject["row-id"] = rowId;
      deviceScreenObject["name"] = request.name;
      deviceScreenObject["description"] = request.description;

      gridTable.addRow(deviceScreenObject, 'last');
    },
    onEditScreenFailure : function(self, request, response) {
      self.closeDeviceScreenConfigurationOverlay(event);
    },
    onAddDeviceScreenFailure : function(self, request, response) {
      self.closeDeviceScreenConfigurationOverlay(event);
    },
    closeDeviceScreenConfigurationOverlay : function(event) {
      event.preventDefault();
      this.activity.overlay.destroy();
    }
  });
  return createScreensForm;
});
