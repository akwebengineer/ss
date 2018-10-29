/**
 * UT for Export Rules Form Configuration
 *
 * @author Tashi Garg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/exportRulesViewConf.js'
], function (Conf ) {

    var conf,
        getMessage,
        context = new Slipstream.SDK.ActivityContext();

    describe('Export Rules View Configuration UT', function () {
        before(function () {
            conf = new Conf(context);
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Export Rules View Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks the elements', function () {
            var formConf = conf.getExportRulesFormElements();
            formConf['form_id'].should.be.equal('export_rules_confirmation');
            formConf['on_overlay'].should.be.equal(true);
            formConf['cancel_link'].should.exist;
            formConf['buttons'].should.exist;
            formConf['buttons'][0].id.should.be.equal('exportRules');
            formConf['cancel_link'].id.should.be.equal('cancelExportRules');
            formConf['buttonsAlignedRight'].should.be.equal(true);
        });


    });
});
