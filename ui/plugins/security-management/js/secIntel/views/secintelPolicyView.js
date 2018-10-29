/**
 * View to create a security intelligence policy
 *
 * @module SecintelPolicyView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/overlay/overlayWidget',
    '../conf/secintelPolicyFormConfiguration.js',
    '../models/secintelProfileCollection.js',
    '../models/customAddressListCollection.js',
    '../views/customAddressListSummaryView.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    'text!widgets/form/templates/partialDropdown.html',
    'text!../../utm/templates/utmTextAreaErrorMessage.html'
], function (Syphon, FormWidget, OverlayWidget, Form, ProfileCollection, AddressListCollection, AddressListView, ResourceView, OptionsTemplate, ErrorTemplate) {
    var GLOBAL_BLACK_LIST_TAG = 'Global Black',
        GLOBAL_WHITE_LIST_TAG = 'Global White',
        WEBAPPSECURE_FILTER = 'WebAppSecure',
        COMMANDANDCONTROL_FILTER = 'CommandAndControl';

    var SecintelPolicyView = ResourceView.extend({

        events: {
            'click #secintel-policy-save': "submit",
            'click #secintel-policy-cancel': "cancel",
            'click #secintel-policy-global-white-list': "showGlobalWhiteList",
            'click #secintel-policy-global-black-list': "showGlobalBlackList",
            'change #secintel-policy-profile-commandandcontrol': "onChange",
            'change #secintel-policy-profile-webappsecure': "onChange"
        },

        // This tag is for preventing more than one overlays opened meanwhile
        isCustomAddressListOverlayExisted: false,

        showGlobalWhiteList: function() {
            if(!this.isCustomAddressListOverlayExisted){
                this.getCustomAddressList(GLOBAL_WHITE_LIST_TAG);
                this.isCustomAddressListOverlayExisted = true;
            }
        },

        showGlobalBlackList: function() {
            if(!this.isCustomAddressListOverlayExisted){
                this.getCustomAddressList(GLOBAL_BLACK_LIST_TAG);
                this.isCustomAddressListOverlayExisted = true;
            }
        },

        onChange: function(event){
            var dropdown = $(event.target), section = dropdown.parent().parent().parent();
            if(dropdown.val() && section.hasClass('error')){
                section.removeClass('error');
            }
        },

        getCustomAddressList: function(type) {
            var self = this;
            var onFetch = function (collection, response, options) {
                collection.models.every(function(model) {
                    if(model.get('name').indexOf(type) > -1){
                        var view = new AddressListView({
                            parentView: self,
                            model: model
                        });
                        self.overlay = new OverlayWidget({
                            view: view,
                            type: 'medium',
                            showScrollbar: true
                        });
                        self.overlay.build();
                        return false;
                    }
                    return true;
                });
            };
            var onError = function(collection, response, options) {
                console.log('collection not fetched');
            };
            self.addressListCollection.fetch({
                success: onFetch,
                error: onError
            });
        },

        submit: function(event) {
            var self = this,
                jsonDataObj = {},
                profileArr = [],
                commandandcontrolObj = this.$el.find('#secintel-policy-profile-commandandcontrol'),
                webappsecureObj = this.$el.find('#secintel-policy-profile-webappsecure'),
                section = commandandcontrolObj.parent().parent().parent(),
                message = '';

            event.preventDefault();

            if (! this.form.isValidInput()) {
                console.log('form is invalid');
                return;
            }

            if(!commandandcontrolObj.val() && !webappsecureObj.val()){
                message = this.context.getMessage('secintel_policy_none_profile_error');
                section.addClass("error");
                if(section.find('.errorimage').length == 0){
                    section.append(Slipstream.SDK.Renderer.render(ErrorTemplate, {error: message})).show();
                }
                return;
            }

            var properties = Syphon.serialize(this);
            jsonDataObj = {
                'name' : properties['name'],
                'description': properties['description']
            };
            if(properties['secintel-policy-profile-commandandcontrol']){
                profileArr.push({'id': properties['secintel-policy-profile-commandandcontrol']});
            }
            if(properties['secintel-policy-profile-webappsecure']){
                profileArr.push({'id': properties['secintel-policy-profile-webappsecure']});
            }
            if(profileArr.length > 0){
                jsonDataObj['secintel-profiles'] = {'secintel-profile': profileArr};
            }
            this.bindModelEvents();
            this.model.set(jsonDataObj);
            this.model.save();
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('secintel_policy_grid_create');
                    break;
            }
            _.extend(formConfiguration, dynamicProperties);
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);
            this.successMessageKey = 'secintel_policy_create_success';
            this.profileCollection = new ProfileCollection();
            this.addressListCollection = new AddressListCollection();
        },

        render: function() {
            var self = this;
            var paramArr = [];

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
                'id': 'secintel-policy-profile-webappsecure',
                'filter': WEBAPPSECURE_FILTER
            });

            paramArr.push({
                'id': 'secintel-policy-profile-commandandcontrol',
                'filter': COMMANDANDCONTROL_FILTER
            });

            //  Workaround until dropdown list widget can get remote data
            this.getDropdownListData(paramArr);
            return this;
        },

        getDropdownListData: function (paramArr) {
            var self = this;
            $.each(paramArr, function(index, param) {
                var urlFilter = {
                        property: 'category',
                        modifier: 'eq',
                        value: param.filter
                    };
                var onFetch = function (collection, response, options) {
                        var optionList = [],
                        options = '',
                        dropdowns = self.$el.find('#' + param.id),
                        profiles = response['secintel-profiles']['secintel-profile'];

                    if (profiles) {
                        if (!$.isArray(profiles)) {
                          profiles = [profiles];
                        }

                        profiles.forEach(function(profile) {
                            var nameStr = profile.name + (profile['domain-name'] ? ' (' + profile['domain-name'] + ')' : '');
                            optionList.push({
                                'label': nameStr,
                                'value': profile.id
                            });
                        });
                        options = Slipstream.SDK.Renderer.render(OptionsTemplate, {'values': optionList});
                        dropdowns.each(function() {
                            $(this).append(options);
                        });
                    }
                };
                var onError = function(collection, response, options) {
                    console.log('collection not fetched');
                };
                self.profileCollection.fetch({
                    url: self.profileCollection.url(urlFilter),
                    success: onFetch,
                    error: onError
                });
            });
        }
    });

    return SecintelPolicyView;
});