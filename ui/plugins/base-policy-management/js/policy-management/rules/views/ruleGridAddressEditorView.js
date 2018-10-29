/**
 * Address editor view that extends from base cellEditor & is used to select address & add new address for Source & Destination editors
 *
 * @module AddressEditorView
 * @author Omega developer
 * @copyright Juniper Networks, Inc. 2015
 */

define([
    './multiSelectCellEditorNewListBuilderView.js',
    '../conf/addressEditorFormConfiguration.js',
    '../../../../../object-manager/js/objects/widgets/addressListBuilder.js',
    '../models/urlFilters.js',
    '../util/ruleGridConstants.js'
], function (MultiSelectCellEditorView, AddressEditorFormConfiguration, AddressListBuilder, URLFilters, RuleGridConstants) {
    var AddressEditorView = MultiSelectCellEditorView.extend({

        events: $.extend(MultiSelectCellEditorView.prototype.events, {
            "click #radio_include": 'buildIncludeList',
            "click #radio_exclude": 'buildExcludeList'
        }),

        initialize: function () {
            this.context = this.options.context;
            this.addressEditorFormConfiguration = this.getAddressFormConfiguration();
            
            this.options.editorListBuilder = {
                'listBuilderObject': AddressListBuilder.extend({showDefaultObjects: true}),
                'addNewObject_mimeType': 'vnd.juniper.net.addresses'
            };

            this.options.editorForm = {
                'editorFormConfig': this.addressEditorFormConfiguration.getConfig(this.getAddressSelectionHelp()),
                'editorFormElements': {
                    'addNewButtonElementID': 'add-new-button',
                    'listBuilderElementID': 'list-builder-element',
                    'cancelButtonID': 'cancel',
                    'okButtonID': 'save'
                },
                'editorFormMsgBundle': {
                    'title': this.getTitle(),
                    'heading_text': this.getHeadingText()
                }
            };

            MultiSelectCellEditorView.prototype.initialize.apply(this);
        },

        updateFormValuesForEditor: function () {
            // This method is used to update the values as per data or business logic for the form elements rendered on view
            var addressExcludeList = this.getExcluded();

            if (addressExcludeList === true) {
                this.$el.find('#radio_exclude').prop('checked', true);
                this.$el.find('#radio_include').prop('checked', false);
                this.$el.find('#radio_include_any').prop('checked', false);
            } else {
                this.$el.find('#radio_include').prop('checked', true);
                this.$el.find('#radio_include_any').prop('checked', false);
                this.$el.find('#radio_exclude').prop('checked', false);
            }
            var addressArr = this.getAddresses();
            this._cellViewValues = this.getNameArray(addressArr);

            MultiSelectCellEditorView.prototype.updateFormValuesForEditor.apply(this);
        },

        getNameArray : function(objectArr) {
            var i = 0, nameArr = [], len  = 0;

            if (objectArr === undefined || objectArr === null) {
                return [];
            }
            
            len  = objectArr.length;
            if (len) {
                for (i = 0; i < len; i++) {
                    nameArr.push(objectArr[i].name);
                }
            } else {
                nameArr.push(objectArr.name);
            }

            return nameArr;
        },

        getSelectedIds : function() {

            var idArr = [],
                len = 0,
                i = 0,
                addressesArr = this.getAddresses();
            
            if (_.isEmpty(addressesArr)) {
                return idArr;
            }    
            len  = addressesArr.length;

            if (len) {
                for (i = 0; i < len; i++) {
                    if (addressesArr[i].name !== "Any") {
                        idArr.push(addressesArr[i].id);
                    }
                }
            } else {
                if ( addressesArr.name !== "Any") {
                    idArr.push(addressesArr.id);
                }
            }

            return idArr;
        },

        buildIncludeList: function () {
            var urlFilter = this.getURLFilter(false);

            this.hideListBuilder(false);
            this.listBuilder.setFilter(urlFilter); 
        },

        buildExcludeList: function () {
            var urlFilter = this.getURLFilter(true);
            this.hideListBuilder(false);
            this.listBuilder.setFilter(urlFilter); // Build the list builder along with filters in url
        },

        getURLFilter: function(excluded) {

            var urlFilter = [];

            if (excluded) {
                if (this.options.policyObj['policy-type'] === "GROUP" || this.options.policyObj['policy-type'] === "GLOBAL") {
                    urlFilter = URLFilters.addressExcludeFilterForGroupPolicy;
                } else if (this.options.policyObj['policy-type'] === "DEVICE") {
                    urlFilter = URLFilters.addressExcludeFilterForDevicePolicy;
                }
            } else {
                if (this.options.policyObj['policy-type'] === "GROUP" || this.options.policyObj['policy-type'] === "GLOBAL") {
                    urlFilter = URLFilters.addressIncludeFilterForGroupPolicy;
                } else if (this.options.policyObj['policy-type'] === "DEVICE") {
                    urlFilter = URLFilters.addressIncludeFilterForDevicePolicy;
                }
            }
            return urlFilter;
        },

        getExcludedTypes: function() {
            var urlFilter = this.getURLFilter(this.getExcluded()), 
                urlFilterStringArr = [],
                i = 0;

            for (i = 0; i < urlFilter.length; i++) {
                urlFilterStringArr.push(urlFilter[i].value);
            }
            return urlFilterStringArr;
        },

        updateModel: function (e) {

            var self = this;

            self.valuesForAPICall = [];
            self.excludedAddress = false;

            if (this.$el.find('#radio_include_any').is(":checked")) {
                self.getAnyObject(self.listBuilder.listBuilderModel.urlRoot, e);

            } else {
                this.listBuilder.getSelectedItems(function(response) {
                    var selectedItems = response.addresses.address;

                    if ($.isEmptyObject(selectedItems)) {
                        if (self.emptyAddressNotAllowed()) {
                            self.form.showFormError(self.context.getMessage("address_empty_error"));
                            return;
                        } else {
                            if (self.$el.find('#radio_exclude').is(":checked")) {
                                self.excludedAddress = true;
                            }
                            self.setAddress([], self.excludedAddress);
                        }
                    } else {
                        if (!$.isArray(selectedItems)){
                            selectedItems = [selectedItems];
                        }
                        for (var index = 0; index < selectedItems.length; index++) {
                            var apiCallObject = self.formatDataForAPICall(selectedItems[index]);
                            self.valuesForAPICall.push(apiCallObject);
                            if (self.$el.find('#radio_exclude').is(":checked")) {
                                self.excludedAddress = true;
                            }
                        }
                        if (self.valuesForAPICall.length > 0) {
                            self.setAddress(self.valuesForAPICall, self.excludedAddress);
                        }
                    }

                    MultiSelectCellEditorView.prototype.updateModel.apply(self,[e]);
                });
            }
        },

        emptyAddressNotAllowed : function(){
            return true;
        },

        formatDataForAPICall: function (selectedValueData) {
            // get the necessary values that need to be sent to backend API for saving to cache
            var apiCallObject =
            {
                "href": selectedValueData["href"],
                "id": selectedValueData["id"],
                "domain-id": selectedValueData["domain-id"],
                "domain-name": selectedValueData["domain-name"],
                "name": selectedValueData["name"],
                "address-type": selectedValueData["address-type"]
            };
            return apiCallObject;
        },

        getAnyObject: function(urlRoot, e) {
            var self = this;

            $.ajax({
                url : urlRoot + RuleGridConstants.AVAIL_ADDRESS,
                type:'GET',
                data: RuleGridConstants.ANY_ADDRESS_FILTER, 

                beforeSend:function(request){
                    request.setRequestHeader('Accept', RuleGridConstants.ADDRESS_ACCEPT);
                },
                success :function(data){
                    self.anyObjectDetails = data.addresses.address; 
                    if (self.anyObjectDetails && self.anyObjectDetails[0]) {   
                        var apiCallObject = self.formatDataForAPICall(self.anyObjectDetails[0]);
                        self.valuesForAPICall.push(apiCallObject);
                        self.setAddress(self.valuesForAPICall, self.excludedAddress);

                        MultiSelectCellEditorView.prototype.updateModel.apply(self,[e]);
                    }
                },
                error: function() {
                    console.log('Any address is not fetched successfully');
                }
            });
        },

        getAddressFormConfiguration: function() {
           return new AddressEditorFormConfiguration(this.context);
        },

        getAddressSelectionHelp: function() {
            return "select_address_help";
        }
    });

    return AddressEditorView;
});
