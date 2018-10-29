/**
 * UT for User Fireall Util Test
 *
 * @module userFwUtilTest
 * @author Vinay M S <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/
define(
    ['../utils/userFwUtil.js'],
    function (Util) {
        var util, context = new Slipstream.SDK.ActivityContext();

        describe('Check User FW Util UT', function () {
            before(function () {
                util = new Util();
            });
            describe('Check User FW Util UT', function(){

                it('Checks showJobInformation', function () {
                    util.overlay = {destroy:function(){}};
                    util.showJobInformation(123, context, function(){});
                    util.overlay.exist;
                });
            });

            describe('Check User FW Util UT', function(){

                it('Checks showDeleteConfirmation 0', function () {
                    var showOverlay =  sinon.stub(util, 'showOverlay', function(){
                        return {
                            getOverlayContainer : function(){
                                return {
                                    hasClass: function(){ return false;},
                                    addClass: function(){}
                                }
                            }
                        }
                    })
                    util.overlay = {destroy:function(){}};
                    util.showDeleteConfirmation('ACTIVE_DIRECTORY', context, function(){});
                    showOverlay.called.should.be.equal(true);
                    showOverlay.restore();
                });

                it('Checks showDeleteConfirmation 1', function () {
                    var showOverlay =  sinon.stub(util, 'showOverlay', function(){
                        return {
                            getOverlayContainer : function(){
                                return {
                                    hasClass: function(){ return false;},
                                    addClass: function(){}
                                }
                            }
                        }
                    })
                    util.overlay = {destroy:function(){}};
                    util.showDeleteConfirmation('ACCESS_PROLIFE', context, function(){});
                    showOverlay.called.should.be.equal(true);
                    showOverlay.restore();
                });
            });

        });
    }
);