/**
 * UT for Access Profile General Form Configuration
 *
 * @module policyGeneralFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/ldapOptionsFormConf.js'
], function (LdapOptionsFormConf ) {

    var conf,getMessage, context = new Slipstream.SDK.ActivityContext();
    var RETRY_INTERVAL_MAX = 4294967295,
        RETRY_INTERVAL_MIN = 60;

    describe('Access Profile Ldap Options Form Configuration UT', function () {
        before(function () {
            conf = new LdapOptionsFormConf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile Ldap Options Form Configuration object is created properly', function () {
            conf.should.exist;
        });


        it('Checks the getValues with Edit Mode', function () {
            var formConf = conf.getValues();
            formConf['form_id'].should.be.equal('access_profile_ldap_optionsl_form');
            formConf['form_name'].should.be.equal('access_profile_ldap_optionsl_form');
            formConf['add_remote_name_validation'].should.be.equal('access_profile_name');
        });

        describe('Check form elements', function () {

            var elements;

            before(function () {
                elements = conf.getValues().sections[0].elements;
            });

            it('Checks if the assemble element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.id === 'access_profile_assemble_lable') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_checkbox'].should.be.equal(true);
                ele['values'][0].id.should.be.equal("access_profile_assemble");
                ele['values'][0].name.should.be.equal("assemble");
            });

            it('Checks if the common-name element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'common-name') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_assemble_common_name');
                ele['class'].should.be.equal("access_profile_assemble_common_name");
            });

            it('Checks if the base-dn element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'base-dn') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_base_distinguished_name');
            });

            it('Checks if the revert-interval element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'revert-interval') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_revert_interval');
                ele['min_value'].should.be.equal(RETRY_INTERVAL_MIN);
                ele['max_value'].should.be.equal(RETRY_INTERVAL_MAX);
            });

            it('Checks if the search-filter element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'search-filter') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_search_filter');

            });

            it('Checks if the admin-search element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.id === 'access_profile_admin_search_label') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_checkbox'].should.be.equal(true);
                ele['values'][0].id.should.be.equal("access_profile_admin_search");
                ele['values'][0].name.should.be.equal("admin-search");
            });

            it('Checks if the admin-dn element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'admin-dn') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['required'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_distinguished_name');
                ele['class'].should.be.equal('access_profile_distinguished_name');
            });

            it('Checks if admin-password element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'admin-password') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_password'].should.be.equal(true);
                ele['required'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_password');
                ele['class'].should.be.equal('access_profile_password');
                ele['pattern-error'][0]['pattern'].should.be.equal('length');
                ele['pattern-error'][0]['min_length'].should.be.equal('1');
                ele['pattern-error'][0]['error'].should.be.equal('Required');
            });



        });

    });
});