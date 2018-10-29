/**
 * UT for Access Profile General Form Configuration
 *
 * @module policyGeneralFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/policyGeneralFormConf.js'
], function (PolicyGeneralFormConf ) {

    var policyGeneralFormConf, getMessage, context = new Slipstream.SDK.ActivityContext();
    var NAME_MAX_LENGTH = 63,
        NAME_MIN_LENGTH = 1,
        DESCRIPTION_MAX_LENGTH = 255;

    describe('Access Profile General Form Configuration UT', function () {
        before(function () {
            policyGeneralFormConf = new PolicyGeneralFormConf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });
        after(function(){
            getMessage.restore();
        });

        it('Checks if the Access Profile General Form Configuration object is created properly', function () {
            policyGeneralFormConf.should.exist;
        });

        describe('Access Profile General Form Configuration UT', function () {
            var getNameElement;
            before(function () {
                getNameElement = sinon.stub(policyGeneralFormConf, 'getNameElement');
            });

            after(function () {
                getNameElement.restore();
            });

            it('Checks the getValues with Edit Mode', function () {
                policyGeneralFormConf.getValues(true);
                getNameElement.called.should.be.equal(true);
            });

            it('Checks the getValues with Create Mode', function () {
                policyGeneralFormConf.getValues(false);
                getNameElement.called.should.be.equal(true);
            });
        });
        describe('Access Profile General Form Configuration UT', function () {
            var getNameElement, elements;
            before(function () {
                getNameElement = sinon.stub(policyGeneralFormConf, 'getNameElement');
                elements = policyGeneralFormConf.getValues(true);
            });

            after(function () {
                getNameElement.restore();
            });

            it('Checks the getValues of form conf', function () {
                getNameElement.called.should.be.equal(true);
                elements['form_id'].should.be.equal('access_profile_general_form');
                elements['form_name'].should.be.equal('access_profile_general_form');
                elements['add_remote_name_validation'].should.be.equal('access_profile_name');

            });

            it('Checks the getValues of all elements section 0', function () {
                var section = elements.sections[0].elements[1];
                section['element_textarea'].should.be.equal(true);
                section['id'].should.be.equal('access_profile_description');
                section['name'].should.be.equal('description');
                section['max_length'].should.be.equal(DESCRIPTION_MAX_LENGTH);
                section['post_validation'].should.be.equal('lengthValidator');
                section['label'].should.be.equal('description');
                getNameElement.called.should.be.equal(true);

            });

            it('Checks the getValues of all elements section 1', function () {
                var section = elements.sections[1];
                section.heading.should.be.equal('access_profile_authentication_order');
                section.elements[0]['element_dropdown'].should.be.equal(true);
                section.elements[0]['id'].should.be.equal('access_profile_authentication_order1');
                section.elements[0]['name'].should.be.equal('authentication-order1');
                section.elements[0]['enableSearch'].should.be.equal(true);
                section.elements[0]['allowClearSelection'].should.be.equal(false);
                section.elements[0]['label'].should.be.equal('access_profile_authentication_order1');

                section.elements[1]['element_dropdown'].should.be.equal(true);
                section.elements[1]['id'].should.be.equal('access_profile_authentication_order2');
                section.elements[1]['name'].should.be.equal('authentication-order2');
                section.elements[1]['enableSearch'].should.be.equal(true);
                section.elements[1]['allowClearSelection'].should.be.equal(false);
                section.elements[1]['label'].should.be.equal('access_profile_authentication_order2');

                getNameElement.called.should.be.equal(true);

            });
            it('Checks the getValues of all elements section 2', function () {
                var section = elements.sections[2];
                section.heading.should.be.equal('access_profile_ldap_server_title');
                section.elements[0]['element_description'].should.be.equal(true);
                section.elements[0]['id'].should.be.equal('access_profile_ldap_server');
                section.elements[0]['name'].should.be.equal('access_profile_ldap_server');
                section.elements[0]['class'].should.be.equal('access_profile_ldap_server');
                getNameElement.called.should.be.equal(true);
            });

        });

        it('Checks the getNameElement with Create Mode', function () {
            var resp = policyGeneralFormConf.getNameElement(false);
            resp['element_multiple_error'].should.be.equal(true);
            resp['id'].should.be.equal('access_profile_name');
            resp['name'].should.be.equal('name');
            resp['required'].should.be.equal(true);
            resp['error'].should.be.equal('access_profile_name_error');
            resp['notshowvalid'].should.be.equal(true);
            resp['label'].should.be.equal('access_profile_name');
            resp['pattern-error'][0].pattern.should.be.equal("validtext");
            resp['pattern-error'][0].error.should.be.equal("name_require_error");
            resp['pattern-error'][1].pattern.should.be.equal("length");
            resp['pattern-error'][1].error.should.be.equal("maximum_length_error");
            resp['pattern-error'][1]['max_length'].should.be.equal(NAME_MAX_LENGTH);
            resp['pattern-error'][1]['min_length'].should.be.equal(NAME_MIN_LENGTH);

            resp['pattern-error'][2].error.should.be.equal("access_profile_name_error");
            resp['pattern-error'][2]['pattern'].should.be.equal("^[a-zA-Z0-9][a-zA-Z0-9-_.:\/]{0,62}$");
            resp['pattern-error'][2]['regexId'].should.be.equal("regex1");
        });
        it('Checks the getNameElement with Edit Mode', function () {
            var resp = policyGeneralFormConf.getNameElement(true);
            resp['element_description'].should.be.equal(true);
            resp['id'].should.be.equal('access_profile_name');
            resp['name'].should.be.equal('name');
            resp['label'].should.be.equal('access_profile_name');
        });

    });
});