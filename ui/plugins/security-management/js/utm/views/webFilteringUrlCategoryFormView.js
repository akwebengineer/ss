  /**
 * A view implementing URL category form workflow for create web filtering profile wizard.
 *
 * @module WebFilteringUrlCategoryFormView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */
define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/webFilteringUrlCategoryFormConf.js',
    '../views/webFilteringStepView.js'
], function(Backbone, Syphon, FormWidget, Form, StepView) {
    // Engine Type
    var ENGINE_TYPE_JUNIPER_ENHANCED = "JUNIPER_ENHANCED",
        ENGINE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        ENGINE_TYPE_WEBSENSE_REDIRECT = "WEBSENSE";
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

    var FormView = StepView.extend({
        render: function(){
            var formConfiguration = new Form(this.context);
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formConfiguration.getValues(),
                values: this.model.attributes
            });
            this.formWidget.build();

            this.$el.addClass("security-management");

            this.afterBuild();

            return this;
        },

        afterBuild: function() {
            for (var i=0; i<ACTION_TYPES.length; i++) {
                this.createUrlCategoryButton(ACTION_TYPES[i]);
            }

            this.initComponent();
        },

        initComponent: function() {
            this.model.set("wizard_reset_flag", true);

            if (this.model.get('profile-type') === ENGINE_TYPE_WEBSENSE_REDIRECT) {
                this.$el.find("#inapplicable-information-form").show();
                this.$el.find("#action-list-form").hide();
            } else {
                this.$el.find("#inapplicable-information-form").hide();
                this.$el.find("#action-list-form").show();

                if (this.model.get('profile-type') === ENGINE_TYPE_SURF_CONTROL) {
                    this.$el.find(".quarantine-action-list-settings").hide();
                }
            }

            this.$el.find("#action-list-form").find("textarea").attr("readonly", "");
        },

        createUrlCategoryButton: function(action) {
            var addUrlCategoryBtn = this.$el.find("#utm-webfiltering-url-category-"+action);
            addUrlCategoryBtn.bind("click", {action: action}, $.proxy(this.createAction, this));

            this.showSelectedList(action);
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

        getTitle: function(){
            return "";
        },

        getSummary: function() {
            var summary = [];
            var self = this;

            if (this.model.get("profile-type") == ENGINE_TYPE_JUNIPER_ENHANCED || 
                this.model.get("profile-type") == ENGINE_TYPE_SURF_CONTROL) {
                summary.push({
                    label: self.context.getMessage('utm_web_filtering_title_url_category_information'),
                    value: ' '
                });

                summary.push({
                    label: self.context.getMessage('utm_web_filtering_summary_title_deny'),
                    value: self.context.getMessage('utm_web_filtering_summary_title_category_selected', [this.model.get("deny-action-list").length])
                });

                summary.push({
                    label: self.context.getMessage('utm_web_filtering_summary_title_log_and_permit'),
                    value: self.context.getMessage('utm_web_filtering_summary_title_category_selected', [this.model.get("log-and-permit-action-list").length])
                });

                summary.push({
                    label: self.context.getMessage('utm_web_filtering_summary_title_permit'),
                    value: self.context.getMessage('utm_web_filtering_summary_title_category_selected', [this.model.get("permit-action-list").length])
                });
            }

            if (this.model.get("profile-type") == ENGINE_TYPE_JUNIPER_ENHANCED) {
                summary.push({
                    label: self.context.getMessage('utm_web_filtering_summary_title_quarantine'),
                    value: self.context.getMessage('utm_web_filtering_summary_title_category_selected', [this.model.get("quarantine-action-list").length])
                });
            }

            return summary;
        },

        beforePageChange: function() {

            return true;
        }
    });
    return FormView;
});