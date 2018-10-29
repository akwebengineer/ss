/**
 * UT for Access Profile Device Selector Grid Configuration
 *
 * @module assignDeviceFormConfTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../confs/assignDeviceFormConf.js'
], function (Conf) {

    var conf, values, getMessage, context = new Slipstream.SDK.ActivityContext();

    describe('Access Profile Device Selector Form Configuration UT', function () {

        before(function () {
            conf = new Conf(context);
            values = conf.getValues({help:''});
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Access Profile Device Selector Form Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks form defaults', function () {
            values['form_id'].should.be.equal('access_profile_device_selector_form');
            values['form_name'].should.be.equal("access_profile_device_selector_form");
        });

        describe('Check table elements', function () {

            var elements;

            before(function () {
                elements = conf.getValues({help:''}).sections[0].elements;
            });

            it('Checks if the address element if defined', function () {
                var ele;
                _.each(elements, function (eachele) {
                    if (eachele.name === 'user_firewall_device_selector') {
                        ele = eachele;
                    }
                });

                _.isUndefined(ele).should.be.equal(false);
                ele['element_description'].should.be.equal(true);
                ele['class'].should.be.equal('list-builder listBuilderPlaceHolder');
                ele['id'].should.be.equal('user_firewall_device_selector');
                ele['label'].should.be.equal('device');
            });

        });

    });
});