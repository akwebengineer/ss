/**
 * View to select from the list of URL category
 * 
 * @module UrlCategorySelectionView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    'backbone',
    'widgets/form/formWidget',
    '../conf/urlCategorySelectionFormConfiguration.js',
    '../widgets/urlCategoryListBuilder.js',
    'text!../templates/utmCreateButton.html',
    '../views/utmUtility.js'
], function (Backbone, FormWidget, FormConfiguration, UrlCategoryListBuilder, ButtonTemplate, UTMUtility) {
    // types of action list
    var ACTION_TYPE_DENY = "deny",
        ACTION_TYPE_LOG_AND_PERMIT = "log-and-permit",
        ACTION_TYPE_PERMIT = "permit",
        ACTION_TYPE_QUARANTINE = "quarantine",
        PROFILE_TYPE_CUSTOM = "CUSTOM",
        PROFILE_TYPE_WEBSENSE = "JUNIPER_ENHANCED",
        PROFILE_TYPE_SURF_CONTROL = "SURF_CONTROL",
        TYPE_VALUE_ALL = "all",
        TYPE_VALUE_WEBSENSE = "websense";

    var CREATE_CAPABILITY = "createURLCategory";

    var UrlCategorySelectionView = Backbone.View.extend({
        events: {
            'click #utm-url-category-save': "submit",
            'click #utm-url-category-cancel': "cancel"
        },
        submit: function(event) {
            var self = this;

            event.preventDefault();

            var saveSelectedItems = function(data) {
                var urlCategoryList = data["url-category-lists"]["url-category-list"] || [];
                var items = [];
                urlCategoryList.forEach(function (object) {
                    items.push({
                        label: object.name,
                        value: object.id
                    });
                });
                var conf = {
                        title: self.context.getMessage('utm_url_category_selection_confirmation_dialog_title'),
                        question: self.context.getMessage('utm_url_category_selection_confirmation_dialog_question'),
                        yesEvent: function() {
                            self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, items);
                            self.activity.finish();
                            self.listBuilder.destroy();
                            self.activity.overlay.destroy();
                        },
                        noEvent: function() {
                            return;
                        }
                };

                for (var i=0; i<items.length; i++) {
                    if (self.isSelectedByOthers(items[i])) {
                        self.createConfirmationDialog(conf);

                        return;
                    }
                }

                self.activity.setResult(Slipstream.SDK.BaseActivity.RESULT_OK, items);
                self.activity.finish();
                self.listBuilder.destroy();
                self.activity.overlay.destroy();
            };
            this.listBuilder.getSelectedItems(saveSelectedItems);
        },
        cancel: function(event) {
            event.preventDefault();
            if (this.listBuilder)
                this.listBuilder.destroy();
            this.activity.overlay.destroy();
        },
        close: function() {
            if (this.currentView && this.currentView.listBuilder) {
                this.currentView.listBuilder.destroy();
            }
        },
        initialize: function(options) {
            this.activity = options.activity;
            this.context = options.activity.getContext();
            _.extend(this, UTMUtility);
            var param = {};
            param[CREATE_CAPABILITY] = [CREATE_CAPABILITY];
            this.RBAC_HASH = this.buildRbacHash(param);
        },

        createUrlCategoryAction: function () {
            var self = this;
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE,
                {
                    mime_type: 'vnd.juniper.net.utm-url-category'
                }
            );
            this.context.startActivityForResult(intent, function(resultCode, data) {
                if (resultCode === Slipstream.SDK.BaseActivity.RESULT_CANCELLED) {
                    return false;
                }

                self.listBuilder.refresh(function() {
                    self.listBuilder.selectItems([data]);
                });
            });
        },

        createUrlCategoryButton: function() {
            var createUrlCategoryBtn = this.$el.find("#utm-url-category-create-button-place");

            var btnData = {
                id: "utm-url-category-create-button",
                value: this.context.getMessage('utm_url_category_selection_form_create_button')
            };

            createUrlCategoryBtn.html(Slipstream.SDK.Renderer.render(ButtonTemplate, btnData));
            if (this.RBAC_HASH[CREATE_CAPABILITY]) {
                createUrlCategoryBtn.bind("click", $.proxy(this.createUrlCategoryAction, this));
            } else {
                createUrlCategoryBtn.find("input[type='submit']").addClass("disabled");
            }
        },
        isSelectedByOthers: function(item) {
            var options = this.activity.getIntent().getExtras();

            for (var i=0; i<options.selectedItemsByOthers.length; i++) {
                if (String(item.value) === String(options.selectedItemsByOthers[i].value)) {
                    return true;
                }
            }

            return false;
        },
        render: function() {
            var self = this;
            var formConfiguration = new FormConfiguration(this.context);
            var formElements = formConfiguration.getValues();
            var options = this.activity.getIntent().getExtras();

            // Set action information in the head of URL category selection view
            var actionInfo = "";
            switch (options.action) {
                case ACTION_TYPE_DENY:
                    actionInfo = this.context.getMessage('utm_web_filtering_summary_title_deny');
                    break;

                case ACTION_TYPE_LOG_AND_PERMIT:
                    actionInfo =  this.context.getMessage('utm_web_filtering_summary_title_log_and_permit');
                    break;

                case ACTION_TYPE_PERMIT:
                    actionInfo = this.context.getMessage('utm_web_filtering_summary_title_permit');
                    break;

                case ACTION_TYPE_QUARANTINE:
                    actionInfo = this.context.getMessage('utm_web_filtering_summary_title_quarantine');
                    break;
            }
            formElements.sections[0].heading = this.context.getMessage('utm_url_category_selection_form_information', [actionInfo]);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements
            });
            this.form.build();

            // build url category listbuilder
            var urlCategoryContainer = self.$el.find('#utm-url-category-selection');
            urlCategoryContainer.attr("readonly", "");

            var selectedItems = [];
            if (options.selectedItems) {
                selectedItems = options.selectedItems.map(function(item) {
                    return item.value;
                });
            }

            var excludedProfileType = PROFILE_TYPE_SURF_CONTROL;
            if(options.profileType === PROFILE_TYPE_SURF_CONTROL){
                excludedProfileType = PROFILE_TYPE_WEBSENSE;
                this.$el.find('#utm-url-category-selection-websense').next().html(self.context.getMessage('utm_url_category_selection_surf_control'));
            }

            this.listBuilder = new UrlCategoryListBuilder({
                context: self.context,
                container: urlCategoryContainer,
                selectedItems: selectedItems,
                id: "utm-url-category-list",
                excludedProfileType: excludedProfileType
            });

            this.listBuilder.build(function() {
                urlCategoryContainer.find('.new-list-builder-widget').unwrap();
            });
            this.$el.find("input[type=radio][name=utm-url-category-selection-filter]").click(function (){
                if (this.value === TYPE_VALUE_ALL) {
                    self.listBuilder.filterByTypes(excludedProfileType, 'ne');
                } else if (this.value === PROFILE_TYPE_CUSTOM.toLowerCase()) {
                    self.listBuilder.filterByTypes(PROFILE_TYPE_CUSTOM);
                } else if (this.value === TYPE_VALUE_WEBSENSE) {
                    self.listBuilder.filterByTypes(options.profileType);
                }
            });
            // Add "Create New URL Category" button
            this.createUrlCategoryButton();
            this.$el.addClass("security-management");
            return this;
        }
    });

    return UrlCategorySelectionView;
});