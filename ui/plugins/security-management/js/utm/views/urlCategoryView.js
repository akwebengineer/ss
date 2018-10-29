/**
 * View to create a URL Category
 *
 * @module UrlCategoryView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../widgets/urlPatternListBuilder.js',
    '../conf/urlCategoryFormConfiguration.js',
    '../models/urlPatternsCollection.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    'text!../templates/utmCreateButton.html',
    './utmUtility.js'
], function (Backbone, Syphon, FormWidget, ListBuilder, UrlCategoryForm, PatternCollection, ResourceView, ButtonTemplate, UTMUtility) {
    var URLPATTERN_CREATE_CAPABILITY = "createURLPattern";

    var UrlCategoryView = ResourceView.extend({

        events: {
            'click #utm-urlcategory-save': "submit",
            'click #utm-urlcategory-cancel': "cancel"
        },

        submit: function(event) {
            var self = this;

            event.preventDefault();

            if (! this.form.isValidInput() || !this.isTextareaValid()) {
                console.log('form is invalid');
                return;
            }

            var properties = Syphon.serialize(this);

            var saveSelectedItems = function(data) {
                var patterns = [];
                // Check if list builder is populated, not needed after listBuilder form integration
                if($.isEmptyObject(data["url-patterns"]["url-pattern"])){
                    console.log('listbuilder has no selections');
                    self.form.showFormError(self.context.getMessage('utm_url_category_list_empty_error'));
                    return;
                }

                var selectedItems = [].concat(data["url-patterns"]["url-pattern"]);
                selectedItems.forEach(function (object) {
                    patterns.push(
                        {
                            id: object.id,
                            name: object.name
                        }
                    );
                });
                properties['url-patterns'] = {};
                properties['url-patterns']['url-pattern'] = patterns;

                self.bindModelEvents();
                self.model.set(properties);
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
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('utm_url_category_grid_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('utm_url_category_grid_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('utm_url_category_grid_clone');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.patternCollection = new PatternCollection();

            this.successMessageKey = 'utm_url_category_create_success';
            this.editMessageKey = 'utm_url_category_edit_success';
            this.fetchErrorKey = 'utm_url_category_fetch_error';
            this.fetchCloneErrorKey = 'utm_url_category_fetch_clone_error';

            _.extend(this, UTMUtility);
            var param = {}; //
            param[URLPATTERN_CREATE_CAPABILITY] = [URLPATTERN_CREATE_CAPABILITY];
            this.RBAC_HASH = this.buildRbacHash(param);
        },

        render: function() {
            var self = this;
            var formConfiguration = new UrlCategoryForm(this.context);
            var formElements = formConfiguration.getValues();

            this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            var createPatternBtn = this.$el.find('#utm-urlcategory-pattern'),
                btnData = {
                    id: 'utm-urlcategory-pattern-btn',
                    value: this.context.getMessage('utm_url_category_pattern_button')
                };

            createPatternBtn.html(Slipstream.SDK.Renderer.render(ButtonTemplate, btnData));

            if (this.RBAC_HASH[URLPATTERN_CREATE_CAPABILITY]) {
                var mimeType = "vnd.juniper.net.utm-url-patterns";
                createPatternBtn.bind("click", {"mimeType": mimeType}, $.proxy(this.createAction, this));
            } else {
                createPatternBtn.find("input[type='submit']").addClass("disabled");
            }

            this.addListBuilder();
            this.$el.addClass("security-management");
            return this;
        },

        createAction: function(event) {

            var self = this;

            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                    "mime_type": event.data.mimeType
                });

            this.context.startActivityForResult(intent, function(resultCode, data) {
                if (resultCode === Slipstream.SDK.BaseActivity.RESULT_OK) {
                    self.listBuilder.refresh(function() {
                        self.listBuilder.selectItems([data]);
                    });
                }
            });

            return this;
        },

        addListBuilder: function() {
            var self = this;
            var patternContainer = self.$el.find('#utm-urlcategory-patterns');
            var selectedItems = [];

            var patterns = self.model.get('url-patterns');

            if (patterns && patterns['url-pattern']) {
                selectedItems = selectedItems.concat(patterns['url-pattern']);
                selectedItems = selectedItems.map(function(item) {
                    return item.id;
                });
            }

            this.listBuilder = new ListBuilder({
                context: self.context,
                container: patternContainer,
                selectedItems: selectedItems,
                id: "utm-url-pattern-list"
            });

            this.listBuilder.build(function() {
                patternContainer.find('.new-list-builder-widget').unwrap();
            });
        }
    });

    return UrlCategoryView;
});