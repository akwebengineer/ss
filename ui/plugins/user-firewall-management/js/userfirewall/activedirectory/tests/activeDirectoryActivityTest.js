/**
 * UT for Active Directory  Activity
 *
 * @module ActiveDirectoryActivityTest
 * @author tgarg <tgarg@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../activeDirectoryActivity.js',
    '../../../../../ui-common/js/gridActivity.js',
    '../../constants/userFirewallConstants.js'
], function (Activity, GridActivity, Constants) {

    var activeDirectoryProfileActivity;

    describe('Active Directory Activity UT', function () {
        before(function () {
            activeDirectoryProfileActivity = new Activity();
        });

        it('Checks if the activity object is created properly', function () {
            activeDirectoryProfileActivity.should.exist;
            activeDirectoryProfileActivity.should.be.instanceof(GridActivity);
        });


        it('Checks the capabilities are defined properly: create', function () {
            _.contains(activeDirectoryProfileActivity.capabilities.create.rbacCapabilities,
                Constants.ACTIVE_DIRECTORY.CAPABILITIES.CREATE).should.be.equal(true);
        });

        it('Checks the capabilities are defined properly: edit', function () {
            _.contains(activeDirectoryProfileActivity.capabilities.edit.rbacCapabilities,
                Constants.ACTIVE_DIRECTORY.CAPABILITIES.EDIT).should.be.equal(true);
        });

       /* it('Checks the capabilities are defined properly: delete', function () {
            _.contains(activeDirectoryProfileActivity.capabilities.delete.
                rbacCapabilities, Constants.ACTIVE_DIRECTORY.CAPABILITIES.DELETE).should.be.equal(true);
        });*/

        it('Checks the capabilities are defined properly: clone', function () {
            _.contains(activeDirectoryProfileActivity.capabilities.clone.
                rbacCapabilities, Constants.ACTIVE_DIRECTORY.CAPABILITIES.CREATE).should.be.equal(true);
        });

        it('Checks the getDeleteObjectAcceptType', function () {
            activeDirectoryProfileActivity.getDeleteObjectAcceptType().should.be.equal(Constants.DELETE.ACCEPT);
        });

        describe('active directory Activity UT', function () {
            var showJobInformation, notify;

            before(function () {
                activeDirectoryProfileActivity.view ={'notify': function(){}};
                activeDirectoryProfileActivity.getContext = function(){ return {getMessage: function(){}}};
                showJobInformation = sinon.stub(activeDirectoryProfileActivity.userFwUtils, 'showJobInformation', function(val){ return val;});
                notify = sinon.stub(activeDirectoryProfileActivity.view, 'notify');
            });
            after(function () {
                showJobInformation.restore();
                notify.restore();
            });

            it('Checks the onDeleteSuccess', function () {
                activeDirectoryProfileActivity.onDeleteSuccess({task:{id:123}});
                showJobInformation.called.should.be.equal(true);
                showJobInformation.args[0][0].should.be.equal(123);
                notify.called.should.be.equal(true);
            });
        });

       describe('Checks the bindEvents of active directory Activity', function () {
           var bindDeployEvent,call, bindDeleteyEvent;
           before(function () {
               call = sinon.stub(GridActivity.prototype.bindEvents,'call');
               bindDeployEvent = sinon.stub(activeDirectoryProfileActivity,'bindDeployEvent');
               bindDeleteyEvent = sinon.stub(activeDirectoryProfileActivity,'bindDeleteEvent');
           });
           after(function () {
               call.restore();
               bindDeployEvent.restore();
               bindDeleteyEvent.restore();
           });
            it('Checks the bindEvents 0', function () {
               activeDirectoryProfileActivity.bindEvents();
                bindDeployEvent.called.should.be.equal(true);
                bindDeleteyEvent.called.should.be.equal(true);
           });

         });

        describe('Checks the bindDeployEvent of active directory Activity', function () {
         var bind,onDeployActiveDirectoryEvent;
         before(function () {
              activeDirectoryProfileActivity.view = {actionEvents:{deployEvent:''},
                                                     $el:{
                                                     bind:function(){
                                                     }}
                                                     };
             bind = sinon.stub(activeDirectoryProfileActivity.view.$el,'bind');
            onDeployActiveDirectoryEvent = sinon.stub(activeDirectoryProfileActivity,'onDeployActiveDirectoryEvent');
         });
         after(function () {
             bind.restore();
             onDeployActiveDirectoryEvent.restore();
         });
          it('Checks the bindDeployEvent 0', function () {

             activeDirectoryProfileActivity.bindDeployEvent();
         });

        });

         describe('Checks the onDeployActiveDirectoryEvent of active directory Activity', function () {
         var context = new Slipstream.SDK.ActivityContext(),startActivity;
          before(function () {
             activeDirectoryProfileActivity.context = context;
             startActivity = sinon.stub(activeDirectoryProfileActivity.context,'startActivity');
          });
          after(function () {
              startActivity.restore();
          });

           it('Checks the onDeployActiveDirectoryEvent 0', function () {
               activeDirectoryProfileActivity.view = {gridWidget:{getSelectedRows:function(){
                         return [{id:'123'}]
                         }}};
              activeDirectoryProfileActivity.onDeployActiveDirectoryEvent();
          });

         });
        describe('Checks the setButtonStatus of active directory Activity', function () {
            var isDisabledEditButton, isDifferentDomain;
            beforeEach(function () {
                isDisabledEditButton = sinon.stub(activeDirectoryProfileActivity,'isDisabledEditButton');
                isDifferentDomain = sinon.stub(activeDirectoryProfileActivity,'isDifferentDomain');
            });
            afterEach(function () {
                isDisabledEditButton.restore();
                isDifferentDomain.restore();
            });

            it('Checks the setButtonStatus 0 ', function () {
                activeDirectoryProfileActivity.setButtonStatus({selectedRows:{length:1}}, function(){});
                isDisabledEditButton.called.should.be.equal(true);
                isDifferentDomain.called.should.be.equal(true);
            });

            it('Checks the setButtonStatus 1', function () {
                activeDirectoryProfileActivity.setButtonStatus({selectedRows:{length:2}}, function(){});
                isDisabledEditButton.called.should.be.equal(true);
                isDifferentDomain.called.should.be.equal(true);
            });
        });

        describe('Checks bindDeleteEvent of Active Directory Activity', function () {
            var bind;
            beforeEach(function () {
                activeDirectoryProfileActivity.view = {
                    $el: {
                        bind: function(){}
                    }
                };
                bind = sinon.stub(activeDirectoryProfileActivity.view.$el, 'bind');
            });
            afterEach(function () {
                bind.restore();
            });

            it('Checks the bindDeleteEvent ', function () {
                activeDirectoryProfileActivity.bindDeleteEvent();
                bind.called.should.be.equal(true);
            });
        });

        describe('Checks onDeleteActiveDirectoryEvent of Active Directory Activity', function () {
            var showDeleteConfirmation;
            beforeEach(function () {
                showDeleteConfirmation = sinon.stub(activeDirectoryProfileActivity.userFwUtils, 'showDeleteConfirmation');
            });
            afterEach(function () {
                showDeleteConfirmation.restore();
            });

            it('Checks the onDeleteActiveDirectoryEvent ', function () {
                activeDirectoryProfileActivity.onDeleteActiveDirectoryEvent();
                showDeleteConfirmation.called.should.be.equal(true);
            });
        });

        describe('Checks onDeleteAD of Active Directory Activity', function () {
            var onDelete, getSelectedRows;
            beforeEach(function () {
                activeDirectoryProfileActivity.view = {
                    gridWidget: {
                        getSelectedRows: function(){}
                    }
                };
                onDelete = sinon.stub(activeDirectoryProfileActivity, 'onDelete');
                getSelectedRows = sinon.stub(activeDirectoryProfileActivity.view.gridWidget, 'getSelectedRows', function(){return{}});
            });
            afterEach(function () {
                onDelete.restore();
                getSelectedRows.restore();
            });

            it('Checks the onDeleteAD ', function () {
                activeDirectoryProfileActivity.onDeleteAD();
                onDelete.called.should.be.equal(true);
                getSelectedRows.called.should.be.equal(true);
            });

            it('Checks the getDeleteObjectsUrl ', function () {
                _.isUndefined(activeDirectoryProfileActivity.getDeleteObjectsUrl()).should.be.equal(false);
            });
        });

    });
});