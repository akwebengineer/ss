/**
 * View to create a device profile
 *
 * @module DeviceProfileView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/deviceProfileFormConfiguration.js',
    '../models/urlPatternsCollection.js',
    '../models/urlCategoryCollection.js',
    '../widgets/deviceListBuilder.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../views/utmUtility.js',
    'widgets/dropDown/dropDownWidget',
    '../../../../ui-common/js/common/dropdownCommonConstants.js'
], function (Backbone, Syphon, FormWidget, Form, UrlPatternsCollection,
        UrlCategoriesCollection, ListBuilder, ResourceView, UTMUtility,
        DropDownWidget, DropdownCommonConstants) {
    // Definition type -- custom
    var URLPATTERN_CREATE_CAPABILITY = "createURLPattern",
        URLCTG_CREATE_CAPABILITY = "createWebFiltering";

    var UTM_DEFINITION_TYPE_CUSTOM = 'CUSTOM',
        dropdownListNameArr = [
            'as-address-white-list',
            'as-address-black-list',
            'av-url-category-white-list',
            'wf-url-category-white-list',
            'wf-url-category-black-list'
        ],
        mimeObjArr = [
             {
                 'dataCatagory1':'av-mime-white-list',
                 'dataCatagory2':'av-mime'
             },
             {
                 'dataCatagory1':'av-mime-exception-white-list',
                 'dataCatagory2':'av-mime-exception'
             }
         ],
         mimeIdArr = [mimeObjArr[0].dataCatagory1, mimeObjArr[1].dataCatagory1];

    var CUSTOM = 'CUSTOM';

    // list of buttons
    var BUTTON_AS_CREATE_WHITE = "as-address-white-list-create",
        BUTTON_AS_CREATE_BLACK = "as-address-black-list-create",
        BUTTON_AV_CREATE_WHITE = "av-address-black-list-create",
        BUTTON_WF_CREATE_WHITE = "wf-address-white-list-create",
        BUTTON_WF_CREATE_BLACK = "wf-address-black-list-create",
        DROPDOWN_AS_WHITE = "as-address-white-list",
        DROPDOWN_AS_BLACK = "as-address-black-list",
        DROPDOWN_AV_WHITE = "av-url-category-white-list",
        DROPDOWN_WF_WHITE = "wf-url-category-white-list",
        DROPDOWN_WF_BLACK = "wf-url-category-black-list";

    // button id list array
    var PATTERN_BUTTON_ID_LIST = [
                       BUTTON_AS_CREATE_WHITE,
                       BUTTON_AS_CREATE_BLACK
                  ];

    var CATEGORY_BUTTON_ID_LIST = [
                           BUTTON_AV_CREATE_WHITE,
                           BUTTON_WF_CREATE_WHITE,
                           BUTTON_WF_CREATE_BLACK
                       ];
    // button id list array
    var PATTERN_DROPDOWN_ID_LIST = [
                       DROPDOWN_AS_WHITE,
                       DROPDOWN_AS_BLACK
                  ];

    var CATEGORY_DROPDOWN_ID_LIST = [
                           DROPDOWN_AV_WHITE,
                           DROPDOWN_WF_WHITE,
                           DROPDOWN_WF_BLACK
                       ];

    var DeviceProfileView = ResourceView.extend({

        events: {
            'click #utm-device-save': "submit",
            'click #utm-device-cancel': "cancel"
        },

        submit: function(event) {
            var self = this,
                jsonDataObj = {};

            event.preventDefault();

            if (! this.form.isValidInput() || ! self.isTextareaValid(this.$el)) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);
            jsonDataObj = {
                "name" : properties["name"],
                "description": properties["description"]
            };

            for (var i=0; i<PATTERN_DROPDOWN_ID_LIST.length; i++) {
                var patternDropdownId = PATTERN_DROPDOWN_ID_LIST[i];
                jsonDataObj[patternDropdownId] = {
                        'id': self.dropDown[patternDropdownId].getValue()
                }
            }

            for (var i=0; i<CATEGORY_DROPDOWN_ID_LIST.length; i++) {
                var categoryDropdownId = CATEGORY_DROPDOWN_ID_LIST[i];
                jsonDataObj[categoryDropdownId] = {
                        'id': self.dropDown[categoryDropdownId].getValue()
                }
            }

            var saveSelectedItems = function(data) {
                var devices = data["available-devices"].device || [];
                devices = [].concat(devices);
                var deviceArr = [];
                if(devices && devices.length > 0){
                    $.each(devices, function(index, device){
                        deviceArr.push({
                            "name": device.name,
                            "moid": device.moid
                        });
                    });
                }
                jsonDataObj.devices = {"device": deviceArr};

                $.each(mimeObjArr, function(index, obj) {
                    self.getDataFromMIME(jsonDataObj, properties, obj);
                });
                self.bindModelEvents();
                self.model.set(jsonDataObj);
                self.model.save(null, {
                    success: function(model, response) {
                        self.listBuilder.destroy();
                    }
                });
            };
            this.listBuilder.getSelectedItems(saveSelectedItems);
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('utm_device_create');
                    break;
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_device_edit');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_device_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.successMessageKey = 'utm_device_create_success';
            this.editMessageKey = 'utm_device_edit_success';
            this.fetchErrorKey = 'utm_device_fetch_error';
            this.fetchCloneErrorKey = 'utm_device_fetch_clone_error';
            
            this.urlCategoriesCollection = new UrlCategoriesCollection();
            this.urlPatternsCollection = new UrlPatternsCollection();
            // Extend the utility, so the validation and imitatePlaceholder for dropdown list can be reused.
            _.extend(this, UTMUtility);
	    this.dropDown = [];
            var param = {};
            
            param[URLPATTERN_CREATE_CAPABILITY] = [URLPATTERN_CREATE_CAPABILITY];
            param[URLCTG_CREATE_CAPABILITY] = [URLCTG_CREATE_CAPABILITY];
            this.RBAC_HASH = this.buildRbacHash(param);
        },

        render: function() {
            var self = this;
            var paramArr = [],
                createLaunchNewParamArr = [],
                deviceListBuilderId = 'utm-device-devices',
                selectedDevices = null;

            var formConfiguration = new Form(this.context);

            var formElements = formConfiguration.getValues();
            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            paramArr.push({
                'collection': this.urlPatternsCollection,
                'css': '.urlPatterns',
                'dataCatagory1':'url-patterns',
                'dataCatagory2':'url-pattern'
            });
            paramArr.push({
                'collection': this.urlCategoriesCollection,
                'css': '.urlCategories',
                'dataCatagory1':'url-category-lists',
                'dataCatagory2':'url-category-list'
            });

            // add click event hander for "Create New URL Pattern" and "Create New URL Category" buttons
            for (var i=0; i<PATTERN_BUTTON_ID_LIST.length; i++) {
                createLaunchNewParamArr.push({
                    'btnid': PATTERN_BUTTON_ID_LIST[i],
                    'dropdownId': PATTERN_DROPDOWN_ID_LIST[i],
                    'mimetype': 'vnd.juniper.net.utm-url-patterns',
                    'capability': URLPATTERN_CREATE_CAPABILITY,
                    'css': ".urlPatterns"
                });
            }

            for (var i=0; i<CATEGORY_BUTTON_ID_LIST.length; i++) {
                createLaunchNewParamArr.push({
                    'btnid': CATEGORY_BUTTON_ID_LIST[i],
                    'dropdownId': CATEGORY_DROPDOWN_ID_LIST[i],
                    'mimetype': 'vnd.juniper.net.utm-url-category',
                    'capability': URLCTG_CREATE_CAPABILITY,
                    'css': ".urlCategories"
                })
            }

            // add dropdown list for URL Pattern and URL category
            for (var i=0; i<PATTERN_DROPDOWN_ID_LIST.length; i++) {
                this.createUrlPatternDropDown(PATTERN_DROPDOWN_ID_LIST[i]);
            }

            for (var i=0; i<CATEGORY_DROPDOWN_ID_LIST.length; i++) {
                this.createUrlCategoryDropDown(CATEGORY_DROPDOWN_ID_LIST[i]);
            }

            this.createNewProfileButton(createLaunchNewParamArr);

            this.$el.addClass("security-management");
            // Bind blur event
            this.bindBlur(mimeIdArr, function(comp){
                this.separateValuesWithBlank(comp);
            });
            // Bind validation
            this.addSubsidiaryFunctions(formElements);

            for (var i=0; i<PATTERN_DROPDOWN_ID_LIST.length; i++) {
                var patternDropdownId = PATTERN_DROPDOWN_ID_LIST[i];
                if (this.model.get(patternDropdownId)) {
                    self.dropDown[patternDropdownId].setValue({
                        "id": this.model.get(patternDropdownId).id,
                        "text": this.model.get(patternDropdownId).name
                    });
                }
            }

            for (var i=0; i<CATEGORY_DROPDOWN_ID_LIST.length; i++) {
                var categoryDropdownId = CATEGORY_DROPDOWN_ID_LIST[i];
                if (this.model.get(categoryDropdownId)) {
                    self.dropDown[categoryDropdownId].setValue({
                        "id": this.model.get(categoryDropdownId).id,
                        "text": this.model.get(categoryDropdownId).name
                    });
                }
            }

            // Selected devices cannot be cloned.
            if (this.model.get('devices') && this.model.get('devices').device) {
                var deviceArr = [].concat(this.model.get('devices').device);
                selectedDevices = deviceArr.map(function(item) {
                    return self.getDeviceId(item.moid);
                });
            }

            $.each(mimeObjArr, function(index, obj) {
                self.setDataForMIME(obj);
            });

            // Workaround until ListBuilder is integrated with form widget
            this.addListBuilder(deviceListBuilderId, selectedDevices);

            return this;
        },

        addListBuilder: function(id, selectedDevices) {
            var listContainer = this.$el.find('#' + id),
                conf = {
                        context: this.context,
                        container: listContainer,
                        selectedItems: [],
                        // Only for UTM device profile list builder
                        profileId: this.model.get('id')
                };

            listContainer.attr("readonly", "");

            if (selectedDevices){
                conf.selectedItems = [].concat(selectedDevices);
            }

            this.listBuilder = new ListBuilder(conf);

            this.listBuilder.build(function() {
                listContainer.find('.new-list-builder-widget').unwrap();
            });
        },

        /**
         * Get address Id from device MOID ("net.juniper.jnap.sm.om.jpa.SecurityDeviceEntity:131072")
         */
        getDeviceId : function(value) {
            var index = value.indexOf(":") + 1;
            return value.substring(index, value.length);
        },

        createUrlCategoryDropDown : function(container,data,onchange) {
            var self = this;
            this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
            self.dropDown[container] = new DropDownWidget({
                "container": this.$el.find("."+container),
                "enableSearch": true,
                "placeholder": self.context.getMessage('select_an_option'),
                "remoteData": {
                    "headers": {
                        "accept" : this.urlCategoriesCollection.requestHeaders.accept
                    },
                    "url": this.urlCategoriesCollection.url({
                        property: 'profile-type',
                        modifier: 'eq',
                        value: CUSTOM}),
                    "numberOfRows": DropdownCommonConstants.PAGE_SIZE,
                    "jsonRoot": this.urlCategoriesCollection.jsonRoot,
                    "jsonRecords": function(data) {
                        return data['url-category-lists']['total']
                    },
                    "success": function(data){console.log("call succeeded")},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResult,
                "templateSelection": this.formatRemoteResultSelection
            });
            self.dropDown[container].build();
        },

        createUrlPatternDropDown : function(container,data,onchange) {
            var self = this;
            this.$el.find('#'+container).append('<select class="'+container+'" style="width: 100%"></select>');
            self.dropDown[container] = new DropDownWidget({
                "container": this.$el.find("."+container),
                "enableSearch": true,
                "placeholder": self.context.getMessage('select_an_option'),
                "remoteData": {
                    "headers": {
                        "accept" : this.urlPatternsCollection.requestHeaders.accept
                    },
                    "url": this.urlPatternsCollection.url(),
                    "numberOfRows": DropdownCommonConstants.PAGE_SIZE,
                    "jsonRoot": this.urlPatternsCollection.jsonRoot,
                    "jsonRecords": function(data) {
                        return data['url-patterns']['total']
                    },
                    "success": function(data){console.log("call succeeded")},
                    "error": function(){console.log("error while fetching data")}
                },
                "templateResult": this.formatRemoteResult,
                "templateSelection": this.formatRemoteResultSelection
            });
            self.dropDown[container].build();
        },

        formatRemoteResult: function (data) {
            var markup = data.name;
            return markup;
        },

        formatRemoteResultSelection: function (data) {
            return data.name || data.text;
        },

        getDataFromDropdownList: function(jsonDataObj, properties, name) {
            if(properties[name]){
                jsonDataObj[name] = {"id" : properties[name]};
            }else{
                jsonDataObj[name] = null;
            }
        },

        setDataForMIME: function(obj) {
            if(this.model.get(obj.dataCatagory1)) {
                var mimes = this.model.get(obj.dataCatagory1)[obj.dataCatagory2];
                if($.isArray(mimes)){
                    this.$el.find('#' + obj.dataCatagory1).val(mimes.join(', '));
                }else{
                    this.$el.find('#' + obj.dataCatagory1).val(mimes);
                }
            }
        },

        getDataFromMIME: function(jsonDataObj, properties, obj) {
            var dataCatagory1 = obj.dataCatagory1,
                dataCatagory2 = obj.dataCatagory2,
                mimeValue = {};
            if(properties[dataCatagory1]){
                mimeValue[dataCatagory2] = properties[dataCatagory1].split(/\s*,\s*/);
                jsonDataObj[dataCatagory1] = mimeValue;
            }else{
                jsonDataObj[dataCatagory1] = null;
            }
        },

        /**
         * Used to add create profile button.
         */
        createNewProfileButton: function(paramArr) {
            var self = this;
            $.each(paramArr, function(index, param) {
                var btnID = param.btnid,
                mimeType = param.mimetype,
                css = param.css,
                dropdownId = param.dropdownId;

                var addUrlCategoryBtn = self.$el.find("#"+btnID);
                if (self.RBAC_HASH && self.RBAC_HASH[param.capability]) {
                    addUrlCategoryBtn.bind("click", {"mimeType": mimeType, 'css': css, 'dropdownId': dropdownId}, $.proxy(self.createAction, self));
                } else {
                    addUrlCategoryBtn.addClass("disabled");
                    if (css.match(/urlpattern/i)) { // url pattern
                        self.$el.find("#as-address-white-list > option:eq(1)").hide();
                        self.$el.find("#as-address-black-list > option:eq(1)").hide();
                    } else { // url category
                        self.$el.find("#av-url-category-white-list > option:eq(1)").hide();
                        self.$el.find("#wf-url-category-white-list > option:eq(1)").hide();
                        self.$el.find("#wf-url-category-black-list > option:eq(1)").hide();
                    }
                }
            });
        },

        /**
         * Used to link to profile create views.
         */
        createAction: function(event) {
            var self = this;

            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                    "mime_type": event.data.mimeType
                });
            var dropdownId = event.data.dropdownId;

            this.context.startActivityForResult(intent, function(resultCode, data) {
                if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                    self.dropDown[dropdownId].setValue({
                        "id": data.id,
                        "text": data.name
                    });
                }
            });
            return this;
        }
    });

    return DeviceProfileView;
});