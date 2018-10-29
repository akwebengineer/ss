/**
 * A module that launches create active directory wizard - General Information Page.
 *
 * @module activeDirectoryGeneralInformationView
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/


define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    '../conf/activeDirectoryGeneralFormConf.js',
    '../../../../../ui-common/js/common/utils/validationUtility.js',
    '../../../../../object-manager/js/objects/widgets/addressListBuilder.js',
    '../../constants/userFirewallConstants.js'
], function (Backbone, Syphon, FormWidget, FormConf, ValidationUtility, ListBuilder, Constants) {

    var FormView = Backbone.View.extend({
        events: {
            'change #active_directory_include_address_enable': 'handleChangeEvent',
            'change #active_directory_exclude_address_enable': 'handleChangeEvent',
            'click #add-new-include-address-button': 'addNewIncludeAddress',
            'click #add-new-exclude-address-button': 'addNewExcludeAddress'
        },

        /**
         * Initialize the view
         * @returns {FormView}
         */
        initialize: function () {
            this.context = this.options.context;
            this.model = this.options.model;
            this.wizardView = this.options.wizardView;

            // Add validations methods
            _.extend(this, ValidationUtility);

            return this;
        },

        /**
         *
         * Renders the form
         * @returns {FormView}
         */
        render: function () {
            var formConfiguration = new FormConf(this.context, this.wizardView.formMode),
                formElements = formConfiguration.getValues();
            this.wizardView.addRemoteNameValidation(formElements);
            this.updateModelWithDefaultVaule();
            // add form
            this.formWidget = new FormWidget({
                "container": this.el,
                elements: formElements,
                values: this.model.attributes
            });
            this.formWidget.build();

            this.updateFormElements();

            this.constructAddressLists();

            this.setModelAttributes();

            return this;
        },
        /**
         * only in create flow handle this defalt values
         */
        updateModelWithDefaultVaule: function(){
            if(this.wizardView.formMode !== 'EDIT'){
                this.model.set({
                    'authentication-time-out' : Constants.ACTIVE_DIRECTORY.DEFAULTS.AUTHENTICATION_TIME_OUT,
                    'wmi-time-out': Constants.ACTIVE_DIRECTORY.DEFAULTS.WMI_TIME_OUT
                });
            }
        },
        /**
         * It sets the model attributes for the checkboxes
         */
        setModelAttributes: function () {
            var self = this, data, el;
            data = self.model.attributes;

            if (!_.isEmpty(data)) {
                self.$el.find('#on-demand-probe').prop('checked', data['on-demand-probe']);

                if (data['include-filter-addresses'] && !_.isEmpty(data['include-filter-addresses']['address-reference'])) {
                    self.$el.find('#active_directory_include_address_enable').prop('checked', true);
                    self.$el.find('.active_directory_include_list').closest('.row').toggleClass('hide');
                    self.$el.find('.active_directory_include_list1').closest('.row').toggleClass('hide');
                }

                if (data['exclude-filter-addresses'] && !_.isEmpty(data['exclude-filter-addresses']['address-reference'])) {
                    self.$el.find('#active_directory_exclude_address_enable').prop('checked', true);
                    self.$el.find('.active_directory_exclude_list').closest('.row').toggleClass('hide');
                    self.$el.find('.active_directory_exclude_list1').closest('.row').toggleClass('hide');
                }
            }
        },


        /**
         * Returns title. No title required
         * @returns {string}
         */
        getTitle: function () {
            return '';
        },


        /**
         * Sets the form data
         * @returns {{}|*}
         */
        getFormData: function () {
            this.formData = {};
            this.formLabel = {};
            var self = this;
            this.$el.find('form label').each(function (i, ele) {
                self.formLabel[ele.getAttribute('for')] = this.textContent;
            });

            this.$el.find('form :input').each(function (i, ele) {
                if (ele.type != "submit") {
                    if (ele.type != "radio" && ele.type != "checkbox") {
                        self.formData[ele.id] = $(ele).val();
                    } else if (ele.checked) {
                        self.formData[ele.id] = $(ele).val();
                    }
                }
            });
            return this.formData;
        },


        /**
         * Returns summary info
         * @returns {Array}
         */
        getSummary: function () {
            var summary = [];
            var self = this;


            this.getFormData();
            var formLabelHashmap = this.formLabel;
            var formDataHashmap = this.formData;

            for (var key in formLabelHashmap) {
                var value = '', label = '';
                switch (key) {

//                    // No need to add password
                    case 'on-demand-probe':

                        // add domain controller after Password
                        summary.push({
                            label: self.context.getMessage('active_directory_on_demand_probe'),
                            value: formDataHashmap[key]
                        });
                        summary.push({
                            label: self.context.getMessage('active_directory_timeout'),
                            value: ' '
                        });


                        continue;

                    case 'wmi-time-out':
                        summary.push({
                            label: formLabelHashmap[key],
                            value:formDataHashmap[key]
                        });
                        summary.push({
                            label: self.context.getMessage('active_directory_filter'),
                            value: ' '
                        });



                        continue;
                    case 'active_directory_include_address_enable':
                    case 'active_directory_exclude_address_enable':

                        continue;

                    case 'active_directory_include_address_list':
                        var addressObj = self.model.get('include-filter-addresses'), length;
                        if (addressObj) {
                            length = addressObj['address-reference'].length;
                            if (length > 0) {
                                value  = length === 1 ? addressObj['address-reference'][0].name :
                                    addressObj['address-reference'][0].name + ' (+' + (length - 1) +')'
                            } else {
                                continue;
                            }
                        }

                        label =  self.context.getMessage('address_include');
                        break;

                    case 'active_directory_exclude_address_list':
                        var addressObj = self.model.get('exclude-filter-addresses'), length;
                        if (addressObj) {
                            length = addressObj['address-reference'].length;
                            if (length > 0) {
                                value  = length === 1 ? addressObj['address-reference'][0].name :
                                    addressObj['address-reference'][0].name + ' (+' + (length - 1) +')'
                            } else {
                                continue;
                            }
                        }

                        label =  self.context.getMessage('address_exclude');
                        break;

                    default:
                        label = formLabelHashmap[key];
                        value = formDataHashmap[key];
                        break;
                }

                summary.push({
                    label: label,
                    value: _.escape(value)
                });
            }

            return summary;

        },


        /**
         * Sets the data in model before page changes. Blokc navigation of the form is invalid
         * @param currentStep
         * @param requestedStep
         * @returns {boolean}
         */
        beforePageChange: function (currentStep, requestedStep) {



            if (currentStep > requestedStep) {
                return true; // always allow to go back
            }
            var self = this;
            if (!this.formWidget.isValidInput()) {
                console.log('form is invalid');
                return false;
            }
            // include address list
            if(!self.excludeAddressFetchTriggered && self.$el.find('#active_directory_exclude_address_enable').prop('checked')){
                self.excludeAddressFetchTriggered= true;
                // fetch the list of selected exclude addresess form the list bulder (Fetches from server getSelected API call)
                self.excludeAddressListBuilder.getSelectedItems($.proxy(self.getExcludeAddressSelectedItemsSelectedCallBack, self,requestedStep));
            } else if(!self.$el.find('#active_directory_exclude_address_enable').prop('checked')){
                self.excludeAddressCompleted= true;
            }
            if(!self.includeAddressFetchTriggered && self.$el.find('#active_directory_include_address_enable').prop('checked')) {
                self.includeAddressFetchTriggered= true;
                // fetch the list of selected include addresess form the list bulder (Fetches from server getSelected API call)
                self.includeAddressListBuilder.getSelectedItems($.proxy(self.getIncludeAddressSelectedItemsSelectedCallBack, self, requestedStep));
            } else if(!self.$el.find('#active_directory_include_address_enable').prop('checked')){
                self.includeAddressCompleted= true;
            }
            // validate address if required
            // if selected device fetch is completed then move to requested page
            if(self.excludeAddressCompleted && self.includeAddressCompleted){
                self.excludeAddressCompleted = false;
                self.includeAddressCompleted = false;
                self.excludeAddressFetchTriggered= false;
                self.includeAddressFetchTriggered= false;

                self.model.set(this.getPageData());

                return true;
            }


            return false;
        },
        /**
         * fetch the list of selected excluded addresess form the list bulder (Fetches from server getSelected API call)
         * @param requestedStep
         * @param results
         */
        getExcludeAddressSelectedItemsSelectedCallBack : function(requestedStep, results){
            var self = this;
            self.model.set({
                "exclude-filter-addresses": self.getAddressList(results)
            });
            // update the fetch selected Devices flag and then go to the requested step page.
            self.excludeAddressCompleted = true;
            self.wizardView.wizard.gotoPage(requestedStep);
        },
        /**
         * fetch the list of selected included addresess form the list bulder (Fetches from server getSelected API call)
         * @param requestedStep
         * @param results
         */
        getIncludeAddressSelectedItemsSelectedCallBack : function(requestedStep, results){
            var self = this;
            self.model.set({
                "include-filter-addresses": self.getAddressList(results)
            });
            // update the fetch selected Devices flag and then go to the requested step page.
            self.includeAddressCompleted = true;
            self.wizardView.wizard.gotoPage(requestedStep);
        },

        /**
         * Returns the page data which need to be set in the model before moving to the next page
         */
        getPageData: function () {
            var self = this, properties, data = {}, fetchIncludeAddress = false, fetchExcludeAddress = false, selectedListBuilder;

            properties = Syphon.serialize(this);
            // initilize with default uundefined
            if(this.wizardView.formMode === this.wizardView.MODE_EDIT){
                data['name'] = self.model.get('name');
            }else {
                data['name'] = properties['name'];
            }
            data['description'] = properties['description'];
            data['on-demand-probe'] = properties['on-demand-probe'];

            data['wmi-time-out'] = undefined;
            data['authentication-time-out'] = undefined;

            // check if the authentication timeout is specified or not
            if (!_.isEmpty(properties['authentication-time-out'])) {
                data['authentication-time-out'] = Number(properties['authentication-time-out']);
            }

            // check if the wmi timeout is specified or not
            if (!_.isEmpty(properties['wmi-time-out'])) {
                data['wmi-time-out'] = Number(properties['wmi-time-out']);
            }

            // exclude address list is check box not enabled
            if (!self.$el.find('#active_directory_include_address_enable').prop('checked')) {
                data['include-filter-addresses'] = undefined;
            }

            if (!self.$el.find('#active_directory_exclude_address_enable').prop('checked')) {
                data['exclude-filter-addresses'] = undefined;
            }
            return data;

        },


        /**
         * Handles checkbox change event
         * @param event
         */
        handleChangeEvent: function (event) {
            var elId, elIdButton;
            if (event.target.id === 'active_directory_include_address_enable') {
                elId = 'active_directory_include_list';
                elIdButton = 'active_directory_include_list1';
            } else if (event.target.id === 'active_directory_exclude_address_enable') {
                elId = 'active_directory_exclude_list';
                elIdButton = 'active_directory_exclude_list1';
            }

            this.$el.find('.' + elId).closest('.row').toggleClass('hide');
            this.$el.find('.' + elIdButton).closest('.row').toggleClass('hide');
        },


        /***
         * It updates the UI elements based on settings.
         * Need to be called after the data is set in the form if edit mode.
         */
        updateFormElements: function () {
            this.$el.find('input#authentication-time-out').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_minutes') + '<span');

            this.$el.find('input#wmi-time-out').parent().after(
                    '<span class= "elementlink">' + this.context.getMessage('time_unit_seconds') + '<span');
        },


        getSelectedItems: function (key) {
            var self = this, addresses = self.model.get(key), selectedItems = [];
            if (addresses && addresses['address-reference']) {
                addresses['address-reference'] = [].concat(addresses['address-reference']);
                selectedItems = addresses['address-reference'].map(function (item) {
                    return item.id;
                });
            }

            return selectedItems;
        },

        getAddressList: function(data) {
            var returnList = [];
            if (data && data.addresses && data.addresses.address) {
                _.each(data.addresses.address, function(addr) {
                    returnList.push({
                        name: addr.name,
                        id: addr.id,
                        'address-type': addr['address-type']
                    });
                });
            }
            return {
                'address-reference': returnList
            };
        },

        /**
         * create list builder with address
         * assign to the respective container
         */
        constructAddressLists: function () {
            this.selectedIncludeAddress = {};
            this.selectedExcludeAddress = {};

            var self = this,
                includeAddressesContainer,
                excludeAddressesContainer,
                DNS = 'DNS',
                WILDCARD = 'WILDCARD',
                POLYMORPHIC = 'POLYMORPHIC',
                DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
                ANY = 'ANY',
                ANY_IPV4 = 'ANY_IPV4',
                ANY_IPV6 = 'ANY_IPV6';

            includeAddressesContainer = self.$el.find('#active_directory_include_address_list');
            includeAddressesContainer.attr("readonly", "");


            this.includeAddressListBuilder = new ListBuilder({
                context: this.context,
                container: includeAddressesContainer,
                selectedItems: this.getSelectedItems('include-filter-addresses'),
                excludedTypes: [POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, ANY, ANY_IPV4, ANY_IPV6, WILDCARD, DNS],
                id: 'active_directory_include_address_lists'
            });
            this.selectedIncludeAddress = self.model.get('include-filter-addresses');


            this.includeAddressListBuilder.build(function () {
                includeAddressesContainer.find('.new-list-builder-widget').unwrap();
            });


            excludeAddressesContainer = self.$el.find('#active_directory_exclude_address_list');
            excludeAddressesContainer.attr("readonly", "");


            this.excludeAddressListBuilder = new ListBuilder({
                context: this.context,
                container: excludeAddressesContainer,
                selectedItems: this.getSelectedItems('exclude-filter-addresses'),
                excludedTypes: [POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, ANY, ANY_IPV4, ANY_IPV6, WILDCARD, DNS],
                id: 'active_directory_exclude_address_lists'
            });
            this.selectedExcludeAddress = self.model.get('exclude-filter-addresses');

            this.excludeAddressListBuilder.build(function () {
                excludeAddressesContainer.find('.new-list-builder-widget').unwrap();
            });


        },

        /**
         * Add new address and include in Include Address list
         * @param e
         */
        addNewIncludeAddress: function() {
            this.addNewAddress(this.includeAddressListBuilder);
        },

        /**
         * Add new address and include in Exclude Address list
         * @param e
         */
        addNewExcludeAddress: function() {
            this.addNewAddress(this.excludeAddressListBuilder);
        },

        /**
         * Add new address in the system
         * @param listBuilder
         */
        addNewAddress: function(listBuilder) {
            var self = this;
            // Access address view
            var intent = new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE, {
                "mime_type": "vnd.juniper.net.addresses"
            });

            intent.putExtras({addressTypes: ['host','network','range', 'group']});
            this.context.startActivityForResult(intent, function(resultCode, data) {

                // Add the newly created object in list of selected items.
                listBuilder.refresh(function() {
                    listBuilder.selectItems([data]);
                });

            });
        }



    });

    return FormView;
});