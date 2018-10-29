/**
 * UT for Active Directory Domain settings Form Configuration
 *
 * @module activeDirectoryDomainSettingsFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/activeDirectoryDomainSettingsFormConf.js'
], function (Conf ) {

    var conf,getMessage, context = new Slipstream.SDK.ActivityContext();
    var RETRY_INTERVAL_MAX = 4294967295,
        RETRY_INTERVAL_MIN = 60,
        NAME_MAX_LENGTH = 64,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255,
        USERNAME_MAX_LENGTH = 64,
        USERNAME_MIN_LENGTH = 1,
        PASSWORD_MAX_LENGTH = 128,
        PASSWORD_MIN_LENGTH = 1,
        PORT_RANGE_MIN_VALUE = 1,
        PORT_RANGE_MAX_VALUE = 65535,
        EVENT_LOG_SCANNING_RANGE_MIN_VALUE = 5,
        EVENT_LOG_SCANNING_RANGE_MAX_VALUE = 60,
        INITIAL_TIMESTAMP_MIN_VAL = 1,
        INITIAL_TIMESTAMP_MAX_VAL = 168;;

    describe('Active Directory Domain Settings Options Form Configuration UT', function () {
        before(function () {
            conf = new Conf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Active Directory Domain Settings Options Form Configuration object is created properly', function () {
            conf.should.exist;
        });


        it('Checks the getValues with Edit Mode', function () {
            var formConf = conf.getValues();
            formConf['form_id'].should.be.equal('active-directory-general-form');
            formConf['form_name'].should.be.equal('active-directory-general-form');
            formConf['add_remote_name_validation'].should.be.equal('active_directory_name');
            formConf['buttonsAlignedRight'].should.be.equal(true);
            formConf['cancel_link'].id.should.be.equal('domain-settings-cancel');
            formConf['cancel_link'].value.should.be.equal('cancel');
            formConf['buttons'][0].id.should.be.equal('domain-settings-save');
            formConf['buttons'][0].name.should.be.equal('save');
            formConf['buttons'][0].value.should.be.equal('ok');
        });
        describe('Check form sections 0 and elements', function () {

            var section;

            before(function () {
                section = conf.getValues().sections[0];
            });

            it('Checks section values', function () {
                section['section_id'].should.be.equal('active_directory_domain_info');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the domain-name element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_name') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_multiple_error'].should.be.equal(true);
                ele['name'].should.be.equal("domain-name");
                ele['label'].should.be.equal("active_directory_title_domain_name");
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

            it('Checks if the domain-description element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_description') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_textarea'].should.be.equal(true);
                ele['name'].should.be.equal("domain-description");
                ele['value'].should.be.equal("{{domain-description}}");
                ele['label'].should.be.equal("description");
                ele['max_length'].should.be.equal(DESCRIPTION_MAX_LENGTH);
                ele['post_validation'].should.be.equal("descriptionValidator");
            });

            it('Checks if the user-name element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_username') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_multiple_error'].should.be.equal(true);
                ele['name'].should.be.equal("user-name");
                ele['label'].should.be.equal("active_directory_domain_username");
                ele['required'].should.be.equal(true);
                ele['error'].should.be.equal(true);
                ele['notshowvalid'].should.be.equal(true);

                ele['pattern-error'][0].pattern.should.be.equal('length');
                ele['pattern-error'][0].error.should.be.equal('maximum_length_error');
                ele['pattern-error'][0]['max_length'].should.be.equal(USERNAME_MAX_LENGTH);
                ele['pattern-error'][0]['min_length'].should.be.equal(USERNAME_MIN_LENGTH);

                ele['pattern-error'][1].pattern.should.be.equal('validtext');
                ele['pattern-error'][1].error.should.be.equal('name_require_error');
            });

            it('Checks if the user-password element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_password') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_password'].should.be.equal(true);
                ele['name'].should.be.equal("user-password");
                ele['label'].should.be.equal("active_directory_domain_password");
                ele['required'].should.be.equal(true);
                ele['error'].should.be.equal(true);
                ele['notshowvalid'].should.be.equal(true);

                ele['pattern-error'][0].pattern.should.be.equal('length');
                ele['pattern-error'][0].error.should.be.equal('maximum_length_error');
                ele['pattern-error'][0]['max_length'].should.be.equal(PASSWORD_MAX_LENGTH);
                ele['pattern-error'][0]['min_length'].should.be.equal(PASSWORD_MIN_LENGTH);

                ele['pattern-error'][1].pattern.should.be.equal('validtext');
            });

            it('Checks if the active_directory_domain_controller element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_controller') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal("active_directory_domain_controller");
                ele['label'].should.be.equal("active_directory_domain_controller_title");
            });

        });

        describe('Check form sections 1 and elements', function () {

            var section;

            before(function () {
                section = conf.getValues().sections[1];
            });

            it('Checks section values', function () {
                section['section_id'].should.be.equal('active_directory_group_mapping');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the active_directory_domain_ldap element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_ldap') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal("active_directory_domain_ldap");
                ele['label'].should.be.equal("");
            });

            it('Checks if the active_directory_domain_ldap element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'baseDN') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['name'].should.be.equal("base");
                ele['label'].should.be.equal("active_directory_base");
                ele['error'].should.be.equal("active_directory_base_require");
            });
        });

        describe('Check form sections 2 and elements', function () {

            var section;

            before(function () {
                section = conf.getValues().sections[2];
            });

            it('Checks section values', function () {
                section['heading'].should.be.equal('active_directory_ip_mapping_title');
                section['section_id'].should.be.equal('active_directory_user_mapping');
                section['progressive_disclosure'].should.be.equal('expanded');
            });

            it('Checks if the active_directory_discovery_method element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'active_directory_discovery_method') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal("active_directory_discovery_method");
                ele['value'].should.be.equal("active_directory_discovery_method_value");
                ele['label'].should.be.equal("active_directory_discovery_method");
            });
            it('Checks if the event_log_scanning_interval element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'event_log_scanning_interval') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['name'].should.be.equal("event-log-interval");
                ele['label'].should.be.equal("active_directory_event_log_scanning_interval_label");
                ele['min_value'].should.be.equal(EVENT_LOG_SCANNING_RANGE_MIN_VALUE);
                ele['max_value'].should.be.equal(EVENT_LOG_SCANNING_RANGE_MAX_VALUE);
                ele['post_validation'].should.be.equal("rangeValidate");
            });
            it('Checks if the active_directory_domain_ldap element if defined', function () {
                var ele;
                _.each(section.elements, function (eachele) {
                    if (eachele.id === 'initial_event_log_timestamp_interval') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['name'].should.be.equal("event-log-time-span");
                ele['label'].should.be.equal("active_directory_initial_event_log_timespan_label");
                ele['min_value'].should.be.equal(INITIAL_TIMESTAMP_MIN_VAL);
                ele['max_value'].should.be.equal(INITIAL_TIMESTAMP_MAX_VAL);
                ele['post_validation'].should.be.equal("rangeValidate");
            });
        });

    });
});