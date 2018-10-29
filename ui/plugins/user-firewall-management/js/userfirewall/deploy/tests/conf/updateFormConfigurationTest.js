/**
 * UT for Update Form Conf
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/updateFormConfiguration.js',
    '../../../constants/userFirewallConstants.js'
], function (UpdateFormConfiguration, Constants ) {

    var conf, values,option, getMessage,  context = new Slipstream.SDK.ActivityContext();

    describe('Update Form Configuration UT', function () {
        before(function () {
            conf = new UpdateFormConfiguration(context);
            option = {titleHelp: 'titleHelp', title:'title', headingText:'heading'};
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
            values = conf.getValues(option);
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Update Form Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks Form default Values', function () {
            values['form_id'].should.be.equal('update_user_firewall_form');
            values['form_name'].should.be.equal('update_user_firewall_form');
            values['on_overlay'].should.be.equal(true);
            values['title-help'].should.be.equal('titleHelp');
            values['err_div_id'].should.be.equal('errorDivPublishWarning');
            values['err_div_message'].should.be.equal('form_error');
            values['err_div_link'].should.be.equal('http://www.juniper.net/techpubs/en_US/junos12.1x46/topics/task/configuration/j-web-basic-settings.html');
            values['err_div_link_text'].should.be.equal('fw_policy_create');
            values['err_timeout'].should.be.equal('10000');
            values['valid_timeout'].should.be.equal('10000');
            values['title'].should.be.equal('title');
            values['buttonsAlignedRight'].should.be.equal(true);
            values['cancel_link']['id'].should.be.equal('linkDeployCancel');
            values['cancel_link']['value'].should.be.equal('cancel');
        });

        it('Checks Form Section', function () {
            values['sections'][0]['heading_text'].should.be.equal('heading');
            values['sections'][0]['elements'][0]['element_text'].should.be.equal(true);
            values['sections'][0]['elements'][0]['id'].should.be.equal('update-common-grid');
            values['sections'][0]['elements'][0]['class'].should.be.equal('updatecommongrid');
            values['sections'][0]['elements'][0]['name'].should.be.equal('update-common-grid');
            values['sections'][0]['elements'][0]['placeholder'].should.be.equal('loading');

        });
       it('Checks Form Buttons', function () {
        values['buttons'][0]['id'].should.be.equal('btnDeploy');
        values['buttons'][0]['name'].should.be.equal('Update');
        values['buttons'][0]['value'].should.be.equal('deploy_context_menu_title');

        });
    });
});