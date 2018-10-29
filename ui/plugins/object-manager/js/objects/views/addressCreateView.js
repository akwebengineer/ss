/**
 * View to create a Address
 * 
 * @module AddressView
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'backbone',
    'widgets/form/formWidget',
    'widgets/form/formValidator',
    '../widgets/addressListBuilder.js',
    '../../../../ui-common/js/views/apiResourceView.js',
    '../models/addressCollection.js',
    '../models/addressDnsModel.js',
    '../conf/addressCreateFormConfiguration.js',
    '../../../../ui-common/js/common/utils/validationUtility.js',
    '../../../../ui-common/js/common/IPv6AddressUtil.js',
    '../../../../ui-common/js/common/utils/SmProgressBar.js'
], function (Backbone, FormWidget, FormValidator, ListBuilder, ResourceView, Collection, DnsModel, AddressForm, ValidationUtility, IPv6AddressUtil, SmProgressBar) {
    var IPADDRESS = 'IPADDRESS',
        DNS = 'DNS',
        RANGE = 'RANGE',
        NETWORK = 'NETWORK',
        WILDCARD = 'WILDCARD',
        GROUP = 'GROUP',
        POLYMORPHIC = 'POLYMORPHIC',
        DYNAMIC_ADDRESS_GROUP = 'DYNAMIC_ADDRESS_GROUP',
        ANY = 'ANY',
        ANY_IPV4 = 'ANY_IPV4', 
        ANY_IPV6 = 'ANY_IPV6';

    var dnsModel = new DnsModel();

    var AddressView = ResourceView.extend({

        events: {
            'click #address-save': "submit",
            'click #address-cancel': "cancel"
        },

        submit: function(event) {
            event.preventDefault();
            var self = this,
                objType  = this.$el.find('input[type=radio][name=address-object-type]:checked').val(),
                addressType = this.$el.find('#address-type').val(),
                members = [],
                properties = {},
                ele = '',
                spinner = new SmProgressBar({
                    "container": self.$el.find('.slipstream-content-wrapper'),
                    "hasPercentRate": false,
                    "isSpinner" : true,
                    "statusText": self.context.getMessage("save_conf")
                });

            // Check is form valid
            if (! this.form.isValidInput() || !this.isTextareaValid() || ! this.isFormValid("address-create-form")) {
                console.log('form is invalid');
                return;
            }

            if (addressType === RANGE){
                this.checkEndAddressGreater(true, this);
            }

            // Check if list builder is populated, not needed after listBuilder form integration
            properties['name'] = this.$el.find('#address-name').val();
            properties['description'] = this.$el.find('#address-description').val();

            var saveSelectedItems = function(data) {
                if($.isEmptyObject(data.addresses.address)){
                    console.log('listbuilder has no selections');
                    self.form.showFormError(self.context.getMessage("address_group_address_empty_error"));
                    return;
                }

                //Add spinner and spinner background to the overlay element
                spinner.showLoadingMask();

                var selectedItems = [].concat(data.addresses.address);
                selectedItems.forEach(function (object) {
                    members.push({name: object.name, id: object.id});
                });
                properties.members = {};
                properties.members.member = members;
 
                self.bindModelEvents();
                self.model.set(properties);
                self.model.save(null, {
                    success: function(model, response) {
                        self.listBuilder.destroy();
                    },
                    error: function(model, response) {
                        spinner.hideLoadingMask();
                    }
                });
            };

            if (objType === GROUP) {
                properties['address-type'] = objType;
                this.listBuilder.getSelectedItems(saveSelectedItems);
            }else{
                switch(addressType) {
                    case DNS:
                        properties['address-type'] = addressType;
                        properties['host-name'] = this.$el.find('#address-dns-name').val();
                        properties['address-version'] = "IPV4";
                        properties['ip-address'] = '';
                        break;
                    case RANGE:
                        properties['address-type'] = addressType;
                        ele = $('#address-range-start-address').clone().attr('data-ipVersion','4');
                        properties['address-version'] =  (this.validator.isValidValue('ip',ele[0])) ? "IPV4" : "IPV6";
                        properties['ip-address'] = this.$el.find('#address-range-start-address').val() + '-' + this.$el.find('#address-range-end-address').val();
                        properties['host-name'] = '';
                        break;
                    case NETWORK:
                        properties['address-type'] = addressType;
                        ele = $('#address-network-ip-address').clone().attr('data-ipVersion','4');
                        properties['address-version'] =  (this.validator.isValidValue('ip',ele[0])) ? "IPV4" : "IPV6";
                        properties['ip-address'] = this.$el.find('#address-network-ip-address').val() + '/' + this.$el.find('#address-network-mask').val();
                        properties['host-name'] = '';
                        break;
                    case WILDCARD:
                        properties['address-type'] = addressType;
                        properties['address-version'] =  "IPV4";
                        properties['ip-address'] = this.$el.find('#address-wildcard-ip-address').val() + '/' + this.$el.find('#address-wildcard-subnet').val();
                        properties['host-name'] = '';
                        break;
                    default:
                        properties['address-type'] = addressType;
                        ele = $('#address-ip-address').clone().attr('data-ipVersion','4');
                        properties['address-version'] =  (this.validator.isValidValue('ip',ele[0])) ? "IPV4" : "IPV6";
                        properties['host-name'] = this.$el.find('#address-host-name').val();
                        properties['ip-address'] = this.$el.find('#address-ip-address').val();
                        break;
                }

                //Add spinner and spinner background to the overlay element
                spinner.showLoadingMask();

                this.bindModelEvents();
                this.model.set(properties);
                this.model.save(null, {
                    error: function(model, response) {
                        spinner.hideLoadingMask();
                    }
                });
            }
        },

        initialize: function(options) {
            ResourceView.prototype.initialize.call(this, options);

            _.extend(this, ValidationUtility);

            this.activity = options.activity;
            this.context = options.activity.getContext();
            this.validator = new FormValidator();
            this.collection = new Collection;

            this.successMessageKey = 'address_create_success';
            this.editMessageKey = 'address_edit_success';
            this.fetchErrorKey = 'address_fetch_error';
            this.fetchCloneErrorKey = 'address_fetch_clone_error';
        },

        render: function() {
            var self = this,
                formConfiguration = new AddressForm(this.context),
                options = this.activity.getIntent().getExtras();
                formElements = formConfiguration.getValues(options);

            this.addDynamicFormConfig(formElements);
            this.addNetworkValidation(formElements);
            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.attributes
            });

            this.form.build();

            this.addSubsidiaryFunctions(formElements);

            this.$el.addClass(this.context['ctx_name']);
            
            //add the lookup link manually
            var addressHostIp = this.$el.find('#address-ip-address'),
                addressHostName = this.$el.find('#address-host-name');

            this.$el.find('#host-ip-link').click($.proxy(this.resolveIp, this, addressHostIp, addressHostName));
            this.$el.find('#host-name-link').click($.proxy(this.resolveHostName, this, addressHostIp, addressHostName));

            this.addressObjTypeChangeHandler(IPADDRESS);

            this.$el.find('input[type=radio][name=address-object-type]').click(function() {
                self.addressObjTypeChangeHandler(this.value);
            });

            this.$el.find('#address-type').change(function() {
                self.addressTypeChangeHandler(this.value);
            });

            this.$el.find('#address-range-end-address').bind('isEndAddressGreater', function(e, isValid) {
                self.checkEndAddressGreater(isValid, self);
            });
            

            //Edit Form
            if(this.formMode === this.MODE_EDIT || this.formMode === this.MODE_CLONE) {
                this.$el.find("label[for=address-object]").parent().parent().hide();
            }
            this.modifyForm();
            // For NAT pool create form
            if (options) {
                if (options.addressObject && options.addressObject.toLowerCase() === IPADDRESS.toLowerCase()) {
                    this.$el.find('input[type=radio][id=address-radio]').prop('checked', true);
                    this.$el.find('label[for=address-object]').parent().parent().hide();
                }
                if (options.addressObject && options.addressObject.toLowerCase() === GROUP.toLowerCase()) {
                    this.$el.find('input[type=radio][id=address-group-radio]').prop('checked', true);
                    this.$el.find('label[for=address-object]').parent().parent().hide();
                    this.updateFormValue(GROUP);
                }
            }
            return this;
        },

        resolveIp: function(addressHostIp, addressHostName) {
            var self = this;

            // no input
            if (!addressHostIp.val()) {
                return;
            }
            // input invalid
            if (typeof(addressHostIp.attr("data-invalid")) !== "undefined") {
                return;
            }

            // Look up host name according to input IP address
            dnsModel.clear();
            dnsModel.set({
                "dns-list": {
                    "ipAddress": addressHostIp.val()
                }
            });
            addressHostName.val("");
            dnsModel.save(null, {
                success: function(model, response) {
                    response = response["resolve-dns"]["dns-list"][0];
                    if (response.hostName && response.hostName !== "unresolved") {
                        addressHostName.val(response.hostName);
                    } else {
                        self.form.showFormError(self.context.getMessage('address_dns_lookup_error'));
                    }
                    // Validate input fields again
                    self.form.isValidInput();
                },
                error: function(model, response) {
                    console.log("error");
                }
            });
        },

        resolveHostName: function(addressHostIp, addressHostName) {
            var self = this;

            // no input
            if (!addressHostName.val()) {
                return;
            }
            // input invalid
            if (typeof(addressHostName.attr("data-invalid")) !== "undefined") {
                return;
            }

            // Look up IP address according to input host name
            dnsModel.clear();
            dnsModel.set({
                "dns-list": {
                    "hostName": addressHostName.val()
                }
            });
            addressHostIp.val("");
            dnsModel.save(null, {
                success: function(model, response) {
                    response = response["resolve-dns"]["dns-list"][0];
                    if (response.ipAddress && response.ipAddress !== "unresolved") {
                        addressHostIp.val(response.ipAddress);
                    } else {
                        self.form.showFormError(self.context.getMessage('address_dns_lookup_error'));
                    }
                    // Validate input fields again
                    self.form.isValidInput();
                },
                error: function(model, response) {
                    console.log("error");
                }
            });
        },

        addDynamicFormConfig: function(formConfiguration) {
            var dynamicProperties = {};
            ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
            switch (this.formMode) {
                case this.MODE_EDIT:
                    dynamicProperties.title = this.context.getMessage('address_edit');
                    break;
                case this.MODE_CREATE:
                    dynamicProperties.title = this.context.getMessage('address_create');
                    break;
                case this.MODE_CLONE:
                    dynamicProperties.title = this.context.getMessage('address_clone');
                    break;
            }

            _.extend(formConfiguration, dynamicProperties);
        },

        ip2Number : function (ip) {
            var d = ip.split('.');
            return ((((((+d[0])*256)+(+d[1]))*256)+(+d[2]))*256)+(+d[3]);
        },

        getData: function(){
            var self = this;
            var addressesContainer = self.$el.find('#address-group-addresses');
            addressesContainer.attr("readonly", "");

            var selectedItems = [];
            if (self.model.get('members')) {
                var members = self.model.get('members');
                if (members && members.member) {
                members.member = [].concat(members.member);
                    selectedItems = members.member.map(function(item) {
                        return item.id;
                    });
                }
            }

            var listBuilderConf = {
                    context: self.context,
                    container: addressesContainer,
                    selectedItems: selectedItems,
                    id: "address_list",
                    excludedTypes: [POLYMORPHIC, DYNAMIC_ADDRESS_GROUP, ANY, ANY_IPV4, ANY_IPV6],
                    excludedNames: []
                };

            if (self.formMode == self.MODE_EDIT) {
                listBuilderConf.excludedNames.push(self.model.get('name'));
            }

            self.listBuilder = new ListBuilder(listBuilderConf);

            self.listBuilder.build(function() {
                addressesContainer.find('.new-list-builder-widget').unwrap();
            });
            
        },

        addressObjTypeChangeHandler: function(value) {
            if (value === IPADDRESS) {
                this.$el.find('#address-form').show();
                this.$el.find('#address-type-section').show();
                this.$el.find('#address-group-form').children().hide();
            } else {
                //get data for the list builder on the address group page 
                if (!this.listBuilder) {
                    this.getData();
                }
                this.$el.find('#address-group-form').children().show();
                this.$el.find('#address-form').hide();
                this.$el.find('#address-type-section').hide().find('input').removeAttr('required');
            }
        },


        addressTypeChangeHandler: function(value){
            var self = this, row = '';

            switch(value) {
                case DNS:
                    row = this.$el.find('#address-dns-name').parents('.row:first');
                    break;
                case RANGE:
                    row = this.$el.find('#address-range-start-address').parents('.row:first');
                    break;
                case NETWORK:
                    row = this.$el.find('#address-network-ip-address').parents('.ip-cidr-widget:first');
                    break;
                case WILDCARD:
                    row = this.$el.find('#address-wildcard-ip-address').parents('.row:first');
                    break;
                default:
                    row = this.$el.find('#address-ip-address').parents('.row:first');
                    break;
            }

            row.siblings().hide().find('input').removeAttr('required');
            row.show().find('input').prop('required',true);

            if (value === NETWORK){
                row.find('#address-network-subnet').removeAttr('required');
            }

            if (value !== DNS && value !== NETWORK) {
                if (value && value !== IPADDRESS){
                    row.next().show().find('input').prop('required',true);
                }else{
                    row.next().show();
                }
            }
        },

        modifyForm: function(){
            var objType = this.model.get('address-type');
            objType = objType ? objType : IPADDRESS;
            if (objType === GROUP){
                this.$el.find('input[type=radio][name=address-object-type][value='+ objType + ']').prop('checked', true);
            }else{
                this.$el.find('input[type=radio][name=address-object-type][value='+ IPADDRESS + ']').prop('checked', true);
                this.addressTypeChangeHandler(objType);
            }
            this.updateFormValue(objType);
        },

        updateFormValue: function(value){
            switch(value) {
                case DNS:
                    this.$el.find('#address-dns-name').val(this.model.get('host-name'));
                    break;
                case RANGE:
                    var ip = this.model.get('ip-address').split('-');
                    this.$el.find('#address-range-start-address').val(ip[0]);
                    this.$el.find('#address-range-end-address').val(ip[1]);
                    break;
                case NETWORK:
                    var ip = this.model.get('ip-address').split('/');
                    var ipCidrWidgetInstance = this.form.getInstantiatedWidgets()['ipCidr_address-network-ip'].instance;
                    ipCidrWidgetInstance.setValues(ip[0], ip[1]);
                    break;
                case WILDCARD:
                    var ip = this.model.get('ip-address').split('/');
                    this.$el.find('#address-wildcard-ip-address').val(ip[0]);
                    this.$el.find('#address-wildcard-subnet').val(ip[1]);
                    break;
                case GROUP:
                    this.addressObjTypeChangeHandler(value);
                    break;
                default:
                    this.$el.find('#address-ip-address').val(this.model.get('ip-address'));
                    this.$el.find('#address-host-name').val(this.model.get('host-name'));
                    break;
            }
        },

        checkEndAddressGreater: function(isValid, self){
            var endAddress = this.$el.find('#address-range-end-address'), 
                ipEndAddress = endAddress.val(), 
                ipStartAddress = self.$el.find('#address-range-start-address').val(),
                endAddressValue = self.ip2Number(ipEndAddress),
                startAddressValue = self.ip2Number(ipStartAddress),
                error = endAddress.siblings('.error');

            if (isValid){
                if (startAddressValue > endAddressValue){
                    var EndAddressError = self.context.getMessage('address_end_address_error');
                    endAddress.parent().addClass("error").siblings().addClass("error");
                    error.show().text(EndAddressError);
                }else{
                    endAddress.parent().removeClass("error");
                    error.text(self.context.getMessage('address_range_ip_end_error'));
                }
            }
        },

        validateNetWork: function(ip, cidr, subnet, showErrorMessage) {
            var ipVal = ip.value,
                cidrVal = cidr.value,
                cidrType = cidr.getAttribute('data-validation'),
                errorMessage = this.context.getMessage('address_network_submask_error');
            var isValid = true;
            if(this.validator.isValidValue('ipv4v6',ip) && this.validator.isValidValue(cidrType, cidr)){
                if(this.validator.isValidValue('ipv4',ip)){
                    ipVal = this.ip2Number(ipVal);
                    var netval = ipVal << cidrVal;
                    isValid = netval ? false : true;
                }else if(this.validator.isValidValue('ipv6',ip)){
                    isValid = IPv6AddressUtil.validateIpv6Network(ipVal.toUpperCase(), cidrVal);
                }
            }
            if(! isValid){
                showErrorMessage(this.context.getMessage('address_network_submask_error'));
            }
        },

        addNetworkValidation: function(formConf){
            var sections = formConf.sections,
                i, j, elements, element, validationConf;
            for (i=0; sections && i<sections.length; i++){
                elements = sections[i].elements ||[];
                for (j=0; j < elements.length; j++){
                    element = elements[j];
                    if(element.id === 'address-network-ip'){
                        element.customValidationCallback = $.proxy(this.validateNetWork, this);
                        break;
                    }
                }
            }
        }
    });

    return AddressView;
});
