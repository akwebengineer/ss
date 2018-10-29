/**
 * UT for Access Profile LDAP Server Grid Configuration
 *
 * @module ldapServerGridConfigurationTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/ldapServerFormConf.js'
], function (LdapServerFormConf ) {

    var conf, values, getMessage, context = new Slipstream.SDK.ActivityContext();
    var PORT_MIN = 1,
        PORT_MAX = 65535,
        RETRY_MIN = 1,
        RETRY_MAX = 10,
        TIMEOUT_MIN = 3,
        TIMEOUT_MAX = 90;

    describe('Access Profile LDAP Server Form Configuration UT', function () {

        before(function () {
            conf = new LdapServerFormConf(context);
            values = conf.getValues();
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile LDPA Server Form Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks form defaults', function () {
            values['form_id'].should.be.equal('access_profile_ldap_server_form');
            values['form_name'].should.be.equal("access_profile_ldap_server_form");
            values['on_overlay'].should.be.equal(true);
        });

        describe('Check table elements', function () {

            var elements;

            before(function () {
                elements = conf.getValues().sections[0].elements;
            });

            it('Checks if the address element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'address') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_multiple_error'].should.be.equal(true);
                ele['required'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_address');
            });

            it('Checks if the retry element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'retry') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_retry');
                ele['min_value'].should.be.equal(RETRY_MIN);
                ele['max_value'].should.be.equal(RETRY_MAX);
            });

            it('Checks if the port element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'port') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_port');
                ele['min_value'].should.be.equal(PORT_MIN);
                ele['max_value'].should.be.equal(PORT_MAX);
            });

            it('Checks if the routing-instance element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'routing-instance') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_text'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_routing_instance');

            });

            it('Checks if the source-address element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'src-address') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_ip'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_source_address');

            });

            it('Checks if the time-out element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'time-out') {
                        ele = eachele;
                    }
                });
                _.isUndefined(ele).should.be.equal(false);
                ele['element_number'].should.be.equal(true);
                ele['id'].should.be.equal('access_profile_timeout');
                ele['min_value'].should.be.equal(TIMEOUT_MIN);
                ele['max_value'].should.be.equal(TIMEOUT_MAX);
            });

        });

    });
});