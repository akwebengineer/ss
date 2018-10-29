/**
 * UT for Deploy Xml Cli Config View
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../views/updateView.js',
    '../../../constants/userFirewallConstants.js',
    'widgets/overlay/overlayWidget',
     '../../conf/updateGridConf.js'
], function (UpdateView,UserFwConstants,OverlayWidget,UpdateGridConf) {

    var view, getMessage, context = new Slipstream.SDK.ActivityContext(), activity = new Slipstream.SDK.Activity();

    describe('Update View UT', function () {

         before(function () {
            activity.context = context;
            view = new UpdateView({
                               activity: activity,
                               context: context,
                               selectedDevices:{
                               objType: 'ACTIVE_DIRECTORY',
                               data:{objId : '1234'}
                               }
                           });
            getMessage = sinon.stub(context, 'getMessage');
        });
        after(function () {
            getMessage.restore();
        });
        it('Checks if the Update View object is created properly', function () {
        view.should.exist;
        });
        describe('Checks render of Update View', function () {
              var createUpdateDeviceGrid;
              before(function () {
                  createUpdateDeviceGrid = sinon.stub(view, 'createUpdateDeviceGrid');
              });
              after(function () {
                  createUpdateDeviceGrid.restore();
              });
              it('Checks render 0', function () {
                  view.render();
                  createUpdateDeviceGrid.called.should.be.equal(true);
              });
        });
    });

     describe('Checks Deploy of Update View', function () {
          var createConfirmationDialog;
          before(function () {
              createConfirmationDialog = sinon.stub(view, 'createConfirmationDialog');
          });
          after(function () {
              createConfirmationDialog.restore();
          });
          it('Checks deploy 0', function () {
               view.gridWidget = {
                                 getSelectedRows:function(value){
                                        return {allRowIds : '123'};
                                 }
                           };
              view.objType = "ACTIVE_DIRECTORY";
              view.deploy();
              createConfirmationDialog.called.should.be.equal(true);
          });
           it('Checks deploy 1', function () {
             view.gridWidget = {
                               getSelectedRows:function(value){
                                      return {allRowIds : '',
                                      selectedRowIds:''
                                      };
                               }
                         };
               view.objType = "ACCESS_PROFILE";
            view.deploy();
               createConfirmationDialog.called.should.be.equal(true);
        });
    });


     describe('Checks Final Submit of Update View', function () {
     var option, showJobInformation,stub;
      beforeEach(function () {
      option = {event:{preventDefault: function () {}}};
       view.gridWidget = {
                         getSelectedRows:function(value){
                                return {allRowIds : '123'};
                         }
                   };
       view.activity.overlay = {destroy: function(){console.log('destroyed');}}
        sinon.spy(view.activity.overlay, "destroy");
         view.closeOverlay({
           preventDefault: function () {
           }
         });
          view.objId = 1234;
         showJobInformation =  sinon.stub(view.userFwUtil, 'showJobInformation');
       });
        afterEach(function () {
             showJobInformation.restore();
             $.mockjax.clear();
         });
          it('Checks deploy success 0', function (done) {
              $.mockjax({
                  url: UserFwConstants['ACCESS_PROFILE'].DEPLOY_URL.replace('{0}',1234),
                  type: 'POST',
                  status: 200,
                  headers:{
                      'accept': UserFwConstants['ACCESS_PROFILE'].DEPLOY_ACCEPT,
                      'content-type': UserFwConstants['ACCESS_PROFILE'].DEPLOY_CONTENT_TYPE
                  },
                  responseText: {task:{id:123}},
                  response : function (settings, done2) {
                      done2();
                      showJobInformation.called.should.be.equal(true);
                      done();
                  }
              });

              view.finalSubmit(option);
          });

          it('Checks deploy error 1', function (done) {
            $.mockjax({
                url: UserFwConstants['ACCESS_PROFILE'].DEPLOY_URL.replace('{0}',1234),
                type: 'POST',
                headers:{
                    'accept': UserFwConstants['ACCESS_PROFILE'].DEPLOY_ACCEPT,
                    'content-type': UserFwConstants['ACCESS_PROFILE'].DEPLOY_CONTENT_TYPE
                },
                status: 500,
                responseText: {test:true},
                response : function (settings, done2) {
                   done2();
                   done();
               }
            });
            view.finalSubmit(option);
        });
    });


    describe('Checks createUpdateDeviceGrid of Update View', function () {
              var getUpdateDevicesGridConfig;
              before(function () {
                    configs = new UpdateGridConf(this.context,this);
                 getUpdateDevicesGridConfig = sinon.stub(configs, 'getUpdateDevicesGridConfig');
              });
              after(function () {
                  getUpdateDevicesGridConfig.restore();
              });
              it('Checks createUpdateDeviceGrid 0', function () {
                  view.createUpdateDeviceGrid();
              });
        });

    describe('Checks onGridDataLoadCheckForDevices of Update View', function () {
              it('Checks onGridDataLoadCheckForDevices 0', function () {
              view.onGridDataLoadCheckForDevices('');
              view.onGridDataLoadCheckForDevices({});
              });
        });

    describe('Checks createConfirmationDialog of Update View', function () {
        var bindEvents;
        before(function () {
            bindEvents = sinon.stub(view,'bindEvents');
        });
        after(function () {
            bindEvents.restore();
        });
        it('Checks createConfirmationDialog 0', function () {
            view.createConfirmationDialog({});
            bindEvents.called.should.be.equal(true);
            view.confirmationDialogWidget.should.exist;
        });
    });

    describe('Checks bindEvents of Update View', function () {
        var finalSubmit, noevent = {noEvent:function(){}};
        before(function () {
            finalSubmit = sinon.stub(view,'finalSubmit');
            view.confirmationDialogWidget = {
                vent: {
                    on: function(text, val){
                        val();
                    }
                }
            };
        });
        after(function () {
            finalSubmit.restore();
        });
        it('Checks bindEvents 0', function () {

            view.bindEvents(noevent);
            finalSubmit.called.should.be.equal(true);
        });
    });

     describe('Checks methods for objType ACCESS_PROFILE of Update View', function () {
          it('Checks objType ACCESS_PROFILE 0', function () {
          var result;
          view.objType = "ACCESS_PROFILE";
          result = view.getDeployOverlayTitle();
          result.should.be.equal("[update_access_profile_title]");
          result = view.getDeployOverlayTitleHelp();
          result['content'].should.be.equal("[update_access_profile_title_help]");
          result = view.getWarningMessage();
          result.should.be.equal("[update_access_profile_warning]");
          });
    });

      describe('Checks deviceViewConfiguration of Update View', function () {
                var getDeployConfig;
                before(function () {
                    getDeployConfig = sinon.stub(view,'getDeployConfig');
                });
                after(function () {
                    getDeployConfig.restore();
                });
                it('Checks deviceViewConfiguration 0', function () {
                    view.deviceViewConfiguration({id:'123',
                                                name:'dev-1',
                                                objectId:'2345'
                                             });
                     getDeployConfig.called.should.be.equal(true);
                });
          });


   describe('Checks getDeployConfig of Update View', function () {
                  var buildProgressBar;
                  before(function () {
                      buildProgressBar = sinon.stub(view,'buildProgressBar');
                  });
                  after(function () {
                      buildProgressBar.restore();
                  });
                  it('Checks getDeployConfig 0', function () {
                      view.progressBar = { destroy: function(){}};
                      view.getDeployConfig({deviceName:'dev-1'});
                      buildProgressBar.called.should.be.equal(true);
                  });
            });
      describe('Checks buildProgressBar of Update View', function () {
                var getOverlayContainer;
                before(function () {
                    view.overlay = new OverlayWidget({view:view});
                    getOverlayContainer = sinon.stub(view.overlay,'getOverlayContainer',function(){
                                        return $('<div></div>') ;});
                });
                after(function () {
                    getOverlayContainer.restore();
                });
                it('Checks buildProgressBar 0', function () {
                    view.buildProgressBar();
                });
          });


});