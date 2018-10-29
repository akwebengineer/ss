/**
 * UT for Access Profile Activity
 *
 * @module accessProfileActivityTest
 * @author Vinay M S <vianyms@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../accessProfileActivity.js',
    '../../../../../ui-common/js/gridActivity.js',
    '../../constants/userFirewallConstants.js'
], function (Activity, GridActivity, Constants) {

    var accessProfileActivity;

    describe('Access Profile Activity UT', function () {
        before(function () {
            accessProfileActivity = new Activity();
        });

        it('Checks if the activity object is created properly', function () {
            accessProfileActivity.should.exist;
            accessProfileActivity.should.be.instanceof(GridActivity);
        });


        it('Checks the capabilities are defined properly: create', function () {
            _.contains(accessProfileActivity.capabilities.create.rbacCapabilities, Constants.ACCESS_PROFILE.CAPABILITIES.CREATE).should.be.equal(true);
        });

        it('Checks the capabilities are defined properly: edit', function () {
            _.contains(accessProfileActivity.capabilities.edit.rbacCapabilities, Constants.ACCESS_PROFILE.CAPABILITIES.EDIT).should.be.equal(true);
        });

       /* it('Checks the capabilities are defined properly: delete', function () {
            _.contains(accessProfileActivity.capabilities.delete.rbacCapabilities, Constants.ACCESS_PROFILE.CAPABILITIES.DELETE).should.be.equal(true);
        });*/
        it('Checks the capabilities are defined properly: clone', function () {
            _.contains(accessProfileActivity.capabilities.clone.rbacCapabilities, Constants.ACCESS_PROFILE.CAPABILITIES.CREATE).should.be.equal(true);
        });

        it('Checks the getDeleteObjectAcceptType', function () {
            accessProfileActivity.getDeleteObjectAcceptType().should.be.equal(Constants.DELETE.ACCEPT);
        });

        describe('Access Profile Activity UT', function () {
            var showJobInformation, notify;
            before(function () {
                accessProfileActivity.view ={'notify': function(){}};
                accessProfileActivity.getContext = function(){ return {getMessage: function(){}}};
                showJobInformation = sinon.stub(accessProfileActivity.userFwUtils, 'showJobInformation', function(val){ return val;});
                notify = sinon.stub(accessProfileActivity.view, 'notify');
            });
            after(function () {
                showJobInformation.restore();
                notify.restore();
            });

            it('Checks the onDeleteSuccess', function () {
                accessProfileActivity.view.notify
                accessProfileActivity.onDeleteSuccess({task:{id:123}});
                showJobInformation.called.should.be.equal(true);
                showJobInformation.args[0][0].should.be.equal(123);
                notify.called.should.be.equal(true);
            });
        });

      describe('Checks the bindEvents of Access Profile Activity', function () {
        var bindDeployEvent,call,bindDeleteEvent;
        before(function () {
            call = sinon.stub(GridActivity.prototype.bindEvents,'call');
            bindDeployEvent = sinon.stub(accessProfileActivity,'bindDeployEvent');
            bindDeleteEvent = sinon.stub(accessProfileActivity,'bindDeleteEvent');
        });
        after(function () {
            call.restore();
            bindDeployEvent.restore();
            bindDeleteEvent.restore();
        });
         it('Checks the bindEvents 0', function () {
            accessProfileActivity.bindEvents();
             bindDeployEvent.called.should.be.equal(true);
             bindDeleteEvent.called.should.be.equal(true);
        });

      });

     describe('Checks the bindDeployEvent of Access Profile Activity', function () {
      var bind,onDeployActiveDirectoryEvent;
      before(function () {
           accessProfileActivity.view = {actionEvents:{deployEvent:''},
                                                  $el:{
                                                  bind:function(){
                                                  }}
                                                  };
          bind = sinon.stub(accessProfileActivity.view.$el,'bind');
         onDeployActiveDirectoryEvent = sinon.stub(accessProfileActivity,'onDeployActiveDirectoryEvent');
      });
      after(function () {
          bind.restore();
          onDeployActiveDirectoryEvent.restore();
      });
       it('Checks the bindDeployEvent 0', function () {

          accessProfileActivity.bindDeployEvent();
      });

     });

      describe('Checks the onDeployActiveDirectoryEvent of Access Profile Activity', function () {
      var context = new Slipstream.SDK.ActivityContext(),startActivity;
       before(function () {
          accessProfileActivity.context = context;
          startActivity = sinon.stub(accessProfileActivity.context,'startActivity');
       });
       after(function () {
           startActivity.restore();
       });

        it('Checks the onDeployActiveDirectoryEvent 0', function () {
            accessProfileActivity.view = {gridWidget:{getSelectedRows:function(){
                      return [{id:'123'}]
                      }}};
           accessProfileActivity.onDeployActiveDirectoryEvent();
       });

      });

        describe('Checks the setButtonStatus of Access Profile Activity', function () {
            var isDisabledEditButton, isDifferentDomain;
            beforeEach(function () {
                isDisabledEditButton = sinon.stub(accessProfileActivity,'isDisabledEditButton');
                isDifferentDomain = sinon.stub(accessProfileActivity,'isDifferentDomain');
            });
            afterEach(function () {
                isDisabledEditButton.restore();
                isDifferentDomain.restore();
            });

            it('Checks the setButtonStatus 0 ', function () {
                accessProfileActivity.setButtonStatus({selectedRows:{length:1}}, function(){});
                isDisabledEditButton.called.should.be.equal(true);
                isDifferentDomain.called.should.be.equal(true);
            });

            it('Checks the setButtonStatus 1', function () {
                accessProfileActivity.setButtonStatus({selectedRows:{length:2}}, function(){});
                isDisabledEditButton.called.should.be.equal(true);
                isDifferentDomain.called.should.be.equal(true);
            });
        });

        describe('Checks bindDeleteEvent of Access Profile Activity', function () {
            var bind;
            beforeEach(function () {
                accessProfileActivity.view = {
                    $el: {
                        bind: function(){}
                    }
                };
                bind = sinon.stub(accessProfileActivity.view.$el, 'bind');
            });
            afterEach(function () {
                bind.restore();
            });

            it('Checks the bindDeleteEvent ', function () {
                accessProfileActivity.bindDeleteEvent();
                bind.called.should.be.equal(true);
            });
        });

        describe('Checks onDeleteAccessProfileEvent of Access Profile Activity', function () {
            var showDeleteConfirmation;
            beforeEach(function () {
                showDeleteConfirmation = sinon.stub(accessProfileActivity.userFwUtils, 'showDeleteConfirmation');
            });
            afterEach(function () {
                showDeleteConfirmation.restore();
            });

            it('Checks the onDeleteAccessProfileEvent ', function () {
                accessProfileActivity.onDeleteAccessProfileEvent();
                showDeleteConfirmation.called.should.be.equal(true);
            });
        });

        describe('Checks onDeleteAP of Access Profile Activity', function () {
            var onDelete, getSelectedRows;
            beforeEach(function () {
                accessProfileActivity.view = {
                    gridWidget: {
                        getSelectedRows: function(){}
                    }
                };
                onDelete = sinon.stub(accessProfileActivity, 'onDelete');
                getSelectedRows = sinon.stub(accessProfileActivity.view.gridWidget, 'getSelectedRows', function(){return{}});
            });
            afterEach(function () {
                onDelete.restore();
                getSelectedRows.restore();
            });

            it('Checks the onDeleteAP ', function () {
                accessProfileActivity.onDeleteAP();
                onDelete.called.should.be.equal(true);
                getSelectedRows.called.should.be.equal(true);
            });

            it('Checks the getDeleteObjectsUrl ', function () {
                _.isUndefined(accessProfileActivity.getDeleteObjectsUrl()).should.be.equal(false);
            });
        });

    });
});