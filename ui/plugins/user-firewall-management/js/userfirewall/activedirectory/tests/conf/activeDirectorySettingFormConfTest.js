/**
 * UT for Active Directory Settings Form Configuration
 *
 * @module activeDirectorySettingsFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/activeDirectorySettingsFormConf.js'
], function (Conf ) {

    var conf,getMessage, context = new Slipstream.SDK.ActivityContext();

    describe('Active Directory Settings Form Configuration UT', function () {
        before(function () {
            conf = new Conf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Active Directory Settings Form Configuration object is created properly', function () {
            conf.should.exist;
        });


        it('Checks the getValues with Edit Mode', function () {
            var formConf = conf.getValues();
            formConf['form_id'].should.be.equal('active-directory-settings-form');
            formConf['form_name'].should.be.equal('active-directory-settings-form');
        });

        describe('Check form elements', function () {

            var elements;

            before(function () {
                elements = conf.getValues().sections[0].elements;
            });

            it('Checks if the assemble element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.id === 'active_directory_domain_settings') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['name'].should.be.equal("active_directory_domain_settings");
                ele['class'].should.be.equal("active_directory_domain_settings");
            });

        });

    });
});