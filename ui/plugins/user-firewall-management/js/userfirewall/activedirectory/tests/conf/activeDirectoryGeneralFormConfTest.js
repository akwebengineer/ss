/**
 * UT for Active Directory General Form Configuration
 *
 * @module activeDirectoryGeneralFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/activeDirectoryGeneralFormConf.js'
], function (Conf ) {

    var conf,
        getMessage,
        context = new Slipstream.SDK.ActivityContext(),
        NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        AUTH_ENTRY_TIMEOUT_MIN_VAL = 10,
        AUTH_ENTRY_TIMEOUT_MAX_VAL = 1440,
        WMI_TIMESTAMP_MIN_VAL = 3,
        WMI_TIMESTAMP_MAX_VAL = 120;

    describe('Active Directory General Form Configuration UT', function () {
        before(function () {
            conf = new Conf(context, 'EDIT');
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Active Directory General Form Configuration object is created properly', function () {
            conf.should.exist;
        });
        it('Checks if the Active Directory General Form Configuration object is created properly', function () {
            var ele = conf.nameElement();
            _.isUndefined(ele).should.be.equal(false);
            ele['element_description'].should.be.equal(true);
            ele['name'].should.be.equal("name");
            ele['label'].should.be.equal("name");
            ele['id'].should.be.equal("active_directory_name");
        });

        it('Checks if the Active Directory General Form Configuration object is created properly', function () {
            conf = new Conf(context, 'CREATE');
            var ele = conf.nameElement();
            _.isUndefined(ele).should.be.equal(false);
            ele['element_multiple_error'].should.be.equal(true);
            ele['name'].should.be.equal("name");
            ele['label'].should.be.equal("name");
            ele['id'].should.be.equal("active_directory_name");
            ele['required'].should.be.equal(true);
            ele['error'].should.be.equal('active_directory_name_error');
            ele['notshowvalid'].should.be.equal(true);

            ele['pattern-error'][0].pattern.should.be.equal('validtext');
            ele['pattern-error'][0].error.should.be.equal('name_require_error');

            ele['pattern-error'][1].pattern.should.be.equal('length');
            ele['pattern-error'][1].error.should.be.equal('maximum_length_error');
            ele['pattern-error'][1]['max_length'].should.be.equal(NAME_MAX_LENGTH);
            ele['pattern-error'][1]['min_length'].should.be.equal(NAME_MIN_LENGTH);

            ele['pattern-error'][2].regexId.should.be.equal('regex1');
            ele['pattern-error'][2].pattern.should.be.equal('^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$');
            ele['pattern-error'][2].error.should.be.equal('active_directory_name_error');
        });


        it('Checks the getValues with Edit Mode', function () {
            var formConf = conf.getValues();
            formConf['form_id'].should.be.equal('active-directory-general-form');
            formConf['form_name'].should.be.equal('active-directory-general-form');
            formConf['add_remote_name_validation'].should.be.equal('active_directory_name');
        });

        describe('Check form sections 0 and elements', function () {

            var section, nameElement;

            before(function () {
                section = conf.getValues().sections[0];
                nameElement = sinon.stub(conf, 'nameElement', function(){return {};});
            });
            after(function(){
                nameElement.restore();
            });
            it('Checks section values', function () {
                section.heading.should.be.equal('active_directory_general_title');
                section['section_id'].should.be.equal('active_directory_domain_info');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the description element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_description') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_textarea'].should.be.equal(true);
                ele['name'].should.be.equal("description");
                ele['label'].should.be.equal("description");
                ele['max_length'].should.be.equal(DESCRIPTION_MAX_LENGTH);
                ele['post_validation'].should.be.equal("descriptionValidator");
            });
            it('Checks if the on-demand-probe element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_on_demand_probe') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_checkbox'].should.be.equal(true);
                ele['label'].should.be.equal("active_directory_on_demand_probe");
                ele['values'][0].name.should.be.equal('on-demand-probe');
                ele['values'][0].id.should.be.equal("on-demand-probe");
                ele['values'][0].label.should.be.equal("checkbox_enable");
                ele['values'][0].value.should.be.equal('{{on-demand-probe}}');
                ele['values'][0].checked.should.be.equal(false);
            });
        });

        describe('Check form sections 1 and elements', function () {

            var section, nameElement;

            before(function () {
                section = conf.getValues().sections[1];
                nameElement = sinon.stub(conf, 'nameElement');
            });
            after(function(){
                nameElement.restore();
            });
            it('Checks section values', function () {
                section.heading.should.be.equal('active_directory_timeout');
                section['section_id'].should.be.equal('active_directory_timeout');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the authentication-time-out element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'authentication-time-out') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['name'].should.be.equal("authentication-time-out");
                ele['value'].should.be.equal("{{authentication-time-out}}");
                ele['label'].should.be.equal("active_directory_authentication_timeout");
                ele['pattern'].should.be.equal('^0$|^([1-9][0-9])$|^([1-9][0-9]{2})$|^(1[0-3][0-9]{2})$|^(14[0-3][0-9])$|^(1440)$');
                ele['error'].should.be.equal("authentication-timeout-help");
                ele['field-help'].content.should.be.equal("authentication-timeout-tooltip");
            });
            it('Checks if the wmi-time-out element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'wmi-time-out') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['label'].should.be.equal("active_directory_wmi_timeout");
                ele['name'].should.be.equal('wmi-time-out');
                ele['value'].should.be.equal("{{wmi-time-out}}");
                ele['pattern'].should.be.equal('^([3-9])$|^([1-9][0-9])$|^(1[0-1][0-9])$|^120$');
                ele['error'].should.be.equal('wmi-timeout-help');
            });
        });
        describe('Check form sections 2 and elements', function () {

            var section, nameElement;

            before(function () {
                section = conf.getValues().sections[2];
                nameElement = sinon.stub(conf, 'nameElement');
            });
            after(function(){
                nameElement.restore();
            });
            it('Checks section values', function () {
                section.heading.should.be.equal('active_directory_filter');
                section['section_id'].should.be.equal('active_directory_filter');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the active_directory_include_address_check element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_include_address_check') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_checkbox'].should.be.equal(true);
                ele['label'].should.be.equal("");
                ele['values'][0].id.should.be.equal('active_directory_include_address_enable');
                ele['values'][0].label.should.be.equal("address_include");
                ele['values'][0].value.should.be.equal("enable");
                ele['values'][0].checked.should.be.equal(false);
            });
            it('Checks if the active_directory_include_address_list element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_include_address_list') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['label'].should.be.equal("");
                ele['name'].should.be.equal('include_address_list');
                ele['placeholder'].should.be.equal('loading');
                ele['class'].should.be.equal('hide active_directory_include_list list-builder listBuilderPlaceHolder');


            });
            it('Checks if the active_directory_include_address_list element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_include_address_list1') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal('include_address_list1');
                ele['placeholder'].should.be.equal('loading');
                ele['class'].should.be.equal('hide active_directory_include_list1 list-builder listBuilderPlaceHolder');
                ele['inlineButtons'][0].id.should.be.equal('add-new-include-address-button');
                 ele['inlineButtons'][0].class.should.be.equal('slipstream-primary-button slipstream-secondary-button editorAddNewButton-align-right');
                 ele['inlineButtons'][0].name.should.be.equal('add-new-include-address-button');
                 ele['inlineButtons'][0].value.should.be.equal('active_directory_add_new_button');

            });
            it('Checks if the active_directory_include_address_check element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_exclude_address_check') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_checkbox'].should.be.equal(true);
                ele['label'].should.be.equal("");
                ele['values'][0].id.should.be.equal('active_directory_exclude_address_enable');
                ele['values'][0].label.should.be.equal("address_exclude");
                ele['values'][0].value.should.be.equal("enable");
                ele['values'][0].checked.should.be.equal(false);
            });
            it('Checks if the active_directory_include_address_list element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_exclude_address_list') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['label'].should.be.equal("");
                ele['name'].should.be.equal('exclude_address_list');
                ele['placeholder'].should.be.equal('loading');
                ele['class'].should.be.equal('hide active_directory_exclude_list list-builder listBuilderPlaceHolder');

            });
            it('Checks if the active_directory_include_address_list element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_exclude_address_list1') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal('exclude_address_list1');
                ele['placeholder'].should.be.equal('loading');
                ele['class'].should.be.equal('hide active_directory_exclude_list1 list-builder listBuilderPlaceHolder');
                ele['inlineButtons'][0].id.should.be.equal('add-new-exclude-address-button');
                 ele['inlineButtons'][0].class.should.be.equal('slipstream-primary-button slipstream-secondary-button editorAddNewButton-align-right');
                 ele['inlineButtons'][0].name.should.be.equal('add-new-exclude-address-button');
                 ele['inlineButtons'][0].value.should.be.equal('active_directory_add_new_button');

            });
        });

    });
});