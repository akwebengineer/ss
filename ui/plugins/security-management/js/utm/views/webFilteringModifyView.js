/**
 * View to modify a Web Filtering profile
 *
 * @module WebFilteringModifyView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/webFilteringModifyFormConfiguration.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    './utmUtility.js'
], function (Backbone, Syphon, FormWidget, ModifyForm, ResourceView, UTMUtility) {
    // Engine Type
    var ENGINE_TYPE_JUNIPER_ENHANCED = "JUNIPER_ENHANCED",
        ENGINE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        ENGINE_TYPE_WEBSENSE_REDIRECT = "WEBSENSE",
        ENGINE_TYPE_LOCAL = "LOCAL";
    // Action
    var ACTION_LOG_AND_PERMIT = "LOG_AND_PERMIT",
        ACTION_BLOCK = "BLOCK",
        ACTION_PERMIT = "PERMIT",
        ACTION_QUARANTINE = "QUARANTINE";
    // types of action list
    var ACTION_TYPE_DENY = "deny",
        ACTION_TYPE_LOG_AND_PERMIT = "log-and-permit",
        ACTION_TYPE_PERMIT = "permit",
        ACTION_TYPE_QUARANTINE = "quarantine";
    // action type array
    var ACTION_TYPES = [
            ACTION_TYPE_DENY,
            ACTION_TYPE_LOG_AND_PERMIT,
            ACTION_TYPE_PERMIT,
            ACTION_TYPE_QUARANTINE
        ];
    // action mapping
    var actionNames = [
           {
               type: ACTION_TYPE_DENY,
               value: ACTION_BLOCK
           },
           {
               type: ACTION_TYPE_LOG_AND_PERMIT,
               value: ACTION_LOG_AND_PERMIT
           },
           {
               type: ACTION_TYPE_PERMIT,
               value: ACTION_PERMIT
           },
           {
               type: ACTION_TYPE_QUARANTINE,
               value: ACTION_QUARANTINE
           }
    ];
    var WebFilteringModifyView = ResourceView.extend({
        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            this.successMessageKey = 'utm_web_filtering_create_success';
            this.editMessageKey = 'utm_web_filtering_edit_success';
            this.fetchErrorKey = 'utm_web_filtering_fetch_error';
            this.fetchCloneErrorKey = 'utm_web_filtering_fetch_clone_error';
            // extent some common utils for input validation
            _.extend(this, UTMUtility);
        },

        events: {
            'click #utm-webfiltering-save': "submit",
            'click #utm-webfiltering-cancel': "cancel",
            'click #enable-global-reputation': 'showGlobalReputation'
        },

        submit: function(event) {
            event.preventDefault();

            if (! this.form.isValidInput() ||
                ! this.isFormValid("general-form") ||
                ! this.isTextareaValid() ||
                ! this.isFormValid("fallback-option-form")) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);
            this.setModifyData(properties);
            this.bindModelEvents();
            this.beforeSave();
            this.model.save();
        },

        render: function() {
            var self = this;
            var formConfiguration = new ModifyForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();
            // Add validation for some input fields
            this.addSubsidiaryFunctions(formElements);
            // Initialize input fields
            this.initModifyFormData();

            return this;
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_web_filtering_edit');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_web_filtering_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initModifyFormData: function() {
            // set general information
            this.initGeneralInfo();
            // show input fields according to engine type
            this.showAdvancedInput();
            // set URL category action lists
            this.initUrlCategoryActionLists();
            // set fallback options
            this.initFallbackOptions();
        },
        initGeneralInfo: function() {
            // set "Engine Type" dropdown
            this.$el.find("#engine-type").val(this.model.get("profile-type") || ENGINE_TYPE_JUNIPER_ENHANCED);
            // set "Safe Search" checkbox
            if (this.model.get("safe-search") === false) {
                this.$el.find("#safe-search").attr("checked", false);
            } else {
                this.$el.find("#safe-search").attr("checked", true);
            }
        },
        initUrlCategoryActionLists: function() {
            for (var i=0; i<ACTION_TYPES.length; i++) {
                var action = ACTION_TYPES[i];
                var addUrlCategoryBtn = this.$el.find("#utm-webfiltering-url-category-"+action);
                addUrlCategoryBtn.bind("click", {action: action}, $.proxy(this.createAction, this));
            }
            this.initActionList();

            if (this.model.get('profile-type') === ENGINE_TYPE_WEBSENSE_REDIRECT ||
                this.model.get('profile-type') === ENGINE_TYPE_LOCAL) {
                this.$el.find("#action-list-form").hide();
            } else {
                this.$el.find("#action-list-form").show();

                if (this.model.get('profile-type') === ENGINE_TYPE_SURF_CONTROL) {
                    this.$el.find(".quarantine-action-list-settings").hide();
                }
            }

            this.$el.find("#action-list-form").find("textarea").attr("readonly", "");
        },
        initFallbackOptions: function() {
            // set "Fallback Action" dropdown
            var widgets = this.form.getInstantiatedWidgets();
            widgets["dropDown_fallback-default-action"]["instance"].setValue(this.model.get('fallback-default-action') || ACTION_LOG_AND_PERMIT);
            // set "Default Action" dropdown
            if (this.model.get('profile-type') === ENGINE_TYPE_SURF_CONTROL ||
                this.model.get('profile-type') === ENGINE_TYPE_LOCAL) {
                this.$el.find("#default-action option[value='"+ACTION_QUARANTINE+"']").remove();
            }
            widgets["dropDown_default-action"]["instance"].setValue(this.model.get("default-action") || ACTION_LOG_AND_PERMIT);

            if (this.model.get("profile-type") == ENGINE_TYPE_JUNIPER_ENHANCED) {
                this.$el.find("#global-reputation-action-form").show();
            } else {
                this.$el.find("#global-reputation-action-form").hide();

                return;
            }

            if (!$.isEmptyObject(this.model.get("site-reputation-actions"))) {
                this.model.set("enable-global-reputation", true);
                this.$el.find("#enable-global-reputation").attr("checked", true);
            } else {
                this.model.set("enable-global-reputation", false);
                this.$el.find("#enable-global-reputation").attr("checked", false);
            }

            var fallbackOptions = this.model.get("site-reputation-actions");
            if (fallbackOptions && fallbackOptions['very-safe']) {
                widgets["dropDown_very-safe"]["instance"].setValue(fallbackOptions['very-safe']);
            } else {
                widgets["dropDown_very-safe"]["instance"].setValue(ACTION_PERMIT);
            }

            if (fallbackOptions && fallbackOptions['moderately-safe']) {
                widgets["dropDown_moderately-safe"]["instance"].setValue(fallbackOptions['moderately-safe']);
            } else {
                widgets["dropDown_moderately-safe"]["instance"].setValue(ACTION_LOG_AND_PERMIT);
            }

            if (fallbackOptions && fallbackOptions['fairly-safe']) {
                widgets["dropDown_fairly-safe"]["instance"].setValue(fallbackOptions['fairly-safe']);
            } else {
                widgets["dropDown_fairly-safe"]["instance"].setValue(ACTION_LOG_AND_PERMIT);
            }

            if (fallbackOptions && fallbackOptions['suspicious']) {
                widgets["dropDown_suspicious"]["instance"].setValue(fallbackOptions['suspicious']);
            } else {
                widgets["dropDown_suspicious"]["instance"].setValue(ACTION_QUARANTINE);
            }

            if (fallbackOptions && fallbackOptions['harmful']) {
                widgets["dropDown_harmful"]["instance"].setValue(fallbackOptions && fallbackOptions['harmful']);
            } else {
                widgets["dropDown_harmful"]["instance"].setValue(ACTION_BLOCK);
            }

            this.showGlobalReputation();
        },
        initActionList: function() {
            var actionSetForType = {};

            if (this.model.get("url-category-action-list")) {
                var actionList = this.model.get("url-category-action-list")["url-category-action"] || [];
                actionList = [].concat(actionList);

                for (var i=0; i<ACTION_TYPES.length; i++) {
                    actionSetForType[ACTION_TYPES[i]+"-action-list"] = [];
                }

                for (i=0; i<actionList.length; i++) {
                    for (var j=0; j<actionNames.length; j++) {
                        if (actionList[i].action === actionNames[j].value) {
                            actionSetForType[actionNames[j].type+"-action-list"].push({
                                label: actionList[i]["url-category-list"].name,
                                value: actionList[i]["url-category-list"].id
                            });
                            break;
                        }
                    }
                }
            }

            for (var k=0; k<ACTION_TYPES.length; k++) {
                this.model.set(ACTION_TYPES[k] + "-action-list",
                        actionSetForType[ACTION_TYPES[k]+"-action-list"]);
                this.showSelectedList(ACTION_TYPES[k]);
            }
        },
        isEditMode: function(action) {
            if (this.model.get(action + "-action-list") &&
                this.model.get(action + "-action-list").length > 0) {
                return true;
            } else {
                return false;
            }
        },
        setSelectedList: function(action, data) {
            // Set selected items for the list
            this.model.set(action + "-action-list", data);
            // Remove duplicate selected items in other lists
            for (var i=0; i<ACTION_TYPES.length; i++) {
                if (ACTION_TYPES[i] !== action) {
                    this.removeDuplicate(ACTION_TYPES[i], data);
                }

                this.showSelectedList(ACTION_TYPES[i]);
            }
        },
        removeDuplicate: function(action, data) {
            var list = this.model.get(action + "-action-list");
            var resultList = [];

            if (list && list.length>0) {
                for (var i=0; i<list.length; i++) {
                    var duplicate = false;

                    for (var j=0; j<data.length; j++) {
                        if (list[i].value == data[j].value) {
                            duplicate = true;
                            break;
                        }
                    }

                    if (!duplicate) {
                        resultList.push(list[i]);
                    }
                }
            }

            this.model.set(action + "-action-list", resultList);
        },
        getSelectedItemsByOthers: function(action) {
            var selectedItems = [];

            for (var i=0; i<ACTION_TYPES.length; i++) {
                if (ACTION_TYPES[i] !== action) {
                    selectedItems = selectedItems.concat(this.model.get(ACTION_TYPES[i] + "-action-list"));
                }
            }

            return selectedItems;
        },
        showSelectedList: function(action) {
            var list = this.model.get(action + "-action-list");

            // Display selected items in the textarea
            if (list) {
                var listStr = "";

                for (var i=0; i<list.length; i++) {
                    listStr += list[i].label + "\n";
                }

                this.$el.find("#utm-webfiltering-"+action+"-action-list").val(listStr);
            }

            // Reset add URL category button name
            if (this.isEditMode(action)) {
                this.$el.find("#utm-webfiltering-url-category-"+action).val(this.context.getMessage("utm_web_filtering_url_category_button_edit"));
            } else {
                this.$el.find("#utm-webfiltering-url-category-"+action).val(this.context.getMessage("utm_web_filtering_url_category_button_create"));
                this.model.set(action + "-action-list", []);
            }
        },
        createAction: function(event) {
            var self = this;
            // Access URL category selection view
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_SELECT, {
                    "mime_type": "vnd.juniper.net.utm-url-category"
                }),
                action = event.data.action,
                extras = {action: action};

            if (this.isEditMode(action)) {
                // set selected items in URL category selection view
                extras.selectedItems = this.model.get(action + "-action-list");
            }

            // the items that have been selected by other action lists
            extras.selectedItemsByOthers = this.getSelectedItemsByOthers(action);
            extras.profileType = this.model.get('profile-type');

            intent.putExtras(extras);
            this.context.startActivityForResult(intent, function(resultCode, data) {
                console.log('got result from select');
                console.log(data);

                self.setSelectedList(action, data);
            });

            return this;
        },
        showAdvancedInput: function() {
            this.$el.find("#engine-type").attr("readonly", "");
            var selectedType = this.model.get("profile-type");

            switch(selectedType) {
                case ENGINE_TYPE_JUNIPER_ENHANCED:
                    this.$el.find(".local-settings").hide();
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").show();
                    break;

                case ENGINE_TYPE_SURF_CONTROL:
                    this.$el.find(".local-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".surf-control-settings").show();
                    break;

                case ENGINE_TYPE_WEBSENSE_REDIRECT:
                    this.$el.find(".local-settings").hide();
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").hide();
                    this.$el.find(".websense-redirect-settings").show();
                    break;

                case ENGINE_TYPE_LOCAL:
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".local-settings").show();
                    break;

                default:
                    this.$el.find(".local-settings").hide();
                    this.$el.find(".surf-control-settings").hide();
                    this.$el.find(".websense-redirect-settings").hide();
                    this.$el.find(".juniper-enhanced-settings").show();
            }
        },
        showGlobalReputation: function() {
            if(this.$el.find("#enable-global-reputation").is(':checked')) {
                this.$el.find(".global-reputation-settings").show();
            } else {
                this.$el.find(".global-reputation-settings").hide();
            }
        },
        setModifyData: function(properties) {
            // Set json data for general information according to engine type
            switch(properties["profile-type"]) {
                case ENGINE_TYPE_JUNIPER_ENHANCED:
                    this.saveGeneralInfoData("juniper-enhanced-settings", properties);
                    // Set "safe-search" checkbox
                    this.model.set("safe-search", properties["safe-search"]);
                    break;

                case ENGINE_TYPE_SURF_CONTROL:
                    this.saveGeneralInfoData("surf-control-settings", properties);
                    break;

                case ENGINE_TYPE_WEBSENSE_REDIRECT:
                    this.saveGeneralInfoData("websense-redirect-settings", properties);
                    break;

                case ENGINE_TYPE_LOCAL:
                    this.saveGeneralInfoData("local-settings", properties);
                    break;
            }

            // Set json data for URL categories
            var urlCategoryList = [];
            for (var i=0; i<actionNames.length; i++) {
                this.editUrlCategoryJsonData(actionNames[i], urlCategoryList);
            }

            this.model.set("url-category-action-list", {"url-category-action": urlCategoryList});
            // Set json data for fallback options
            this.model.set("enable-global-reputation", properties["enable-global-reputation"]);
            if (this.model.get("enable-global-reputation")) {
                this.model.set("site-reputation-actions", {
                    "moderately-safe": properties["moderately-safe"],
                    "harmful": properties["harmful"],
                    "suspicious": properties["suspicious"],
                    "very-safe": properties["very-safe"],
                    "fairly-safe": properties["fairly-safe"]
                });
            } else {
                this.model.unset('site-reputation-actions');
            }
            this.model.set("fallback-default-action", properties["fallback-default-action"]);
            this.model.set("default-action", properties["default-action"]);

            // Set timeout
            if (!properties.timeout) {
                this.model.unset("timeout");
            } else {
                this.model.set("timeout", properties.timeout);
            }
        },
        /**
         * Save general information data
         */
        saveGeneralInfoData: function(class_type, properties) {
            var sections = this.form.conf.elements.sections;
            var generalInfoSectionId = "general-form";

            for (var i=0; i<sections.length; i++) {
                if (generalInfoSectionId === sections[i].section_id) {
                    for (var j=0; j<sections[i].elements.length; j++) {
                        var element = sections[i].elements[j];
                        // Common inputs should be saved
                        if (!element.class && element.name) {
                            this.model.set(element.name, properties[element.name]);
                        // Inputs with the specified class should be saved
                        } else if (element.class.indexOf(class_type) != -1 && element.name && properties[element.name]) {
                            this.model.set(element.name, properties[element.name]);
                        // Unrelated inputs should not be saved
                        } else if (element.name) {
                            this.model.unset(element.name);
                        }
                    }
                    break;
                }
            }
        },
        editUrlCategoryJsonData: function(action, urlCategoryList) {
            var list = this.model.get(action.type+"-action-list");

            if (list && list.length > 0) {
                for (var i=0; i<list.length; i++) {
                    urlCategoryList.push(
                        {
                            "action": action.value,
                            "url-category-list": {
                                id: list[i].value,
                                name: list[i].label
                            }
                        }
                    );
                }
            }

            return urlCategoryList;
        }
    });

    return WebFilteringModifyView;
});