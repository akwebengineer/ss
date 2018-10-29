
/**
 * UT for Update Grid Conf
 *
 * @module deploy
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2016
 **/

define([
    '../../conf/updateGridConf.js',
    '../../../constants/userFirewallConstants.js'
], function (UpdateGridConf, Constants ) {

    var conf, values,option, getMessage, update, context = new Slipstream.SDK.ActivityContext();

    describe('Update Form Configuration UT', function () {
        before(function () {
            update = {objType:'ACTIVE_DIRECTORY',objId:'1234'};
            conf = new UpdateGridConf(context,update);
            option = {objId: '12345', objType:'ACTIVE_DIRECTORY',activity:{onGridDataLoadCheckForDevices:function(data){
                                                                                      return "completed"}}};
            getMessage = sinon.stub(context, 'getMessage', function(value){
                return value;
            });
        });

        after(function () {
            getMessage.restore();
        });

        it('Checks if the Update Grid Configuration object is created properly', function () {
            conf.should.exist;
        });

        it('Checks Grid Conf default Values', function () {
            values = conf.getUpdateDevicesGridConfig(option);
            values['tableId'].should.be.equal('update_affected_device_grid');
            values['numberOfRows'].should.be.equal(50);
            values['scroll'].should.be.equal(true);
            values['repeatItems'].should.be.equal(true);
            values['multiselect'].should.be.equal(true);
            values['jsonRoot'].should.be.equal('devices.device');
            values['filter-help']['ua-help-identifier'].should.be.equal('ID_UA_PAGE_ZONEPOLICIES_CFG');
            values['filter']['searchUrl'].should.be.equal(true);
            values['jsonRecords']({'devices':{'@total':2}});
            values['ajaxOptions']['complete']({responseJSON:{devices:{device:"dev-1"}}});

        });
         describe('check SetShowHideColumnSelection', function(){
            var resp;
            it('Checks the heck SetShowHideColumnSelection check 0', function () {
                resp = conf.setShowHideColumnSelection("");
                resp.should.be.equal("");
            });
            it('Checks the heck SetShowHideColumnSelection check 1', function () {
                resp = conf.setShowHideColumnSelection("test");
                resp.should.be.equal("test");
            });
        });

          describe('Check getFilterHelp', function(){
                    var resp;
                    it('Checks the getFilterHelp 0', function () {
                        resp = conf.getFilterHelp();
                        resp.should.be.equal("Search based on Name and Device IP only");
                    });
          });

          describe('Check getConnectionStatus', function(){
              var resp;
              it('Checks the getConnectionStatus 0', function () {
                  resp = conf.getConnectionStatus("");
                  resp.should.be.equal("<div class='image-transparent'>&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
              });
               it('Checks the getConnectionStatus 1', function () {
                    resp = conf.getConnectionStatus("test");
                    resp.should.be.equal("<div class='image-transparent'>&nbsp&nbsp&nbsp&nbsp&nbsptest</div>");
                });
        });

        describe('Check getConfigurationStatus', function(){
              var resp;
              it('Checks the getConfigurationStatus 0', function () {
                  resp = conf.getConfigurationStatus("");
                  resp.should.be.equal("<div class=image-transparent>&nbsp&nbsp&nbsp&nbsp&nbsp</div>");
              });
               it('Checks the getConfigurationStatus 1', function () {
                    resp = conf.getConfigurationStatus("In Sync");
                    resp.should.be.equal("<div class=icon_device_managed_status_in_sync>&nbsp&nbsp&nbsp&nbsp&nbspIn Sync</div>");
                });
                 it('Checks the getConfigurationStatus 2', function () {
                    resp = conf.getConfigurationStatus("In RMA");
                    resp.should.be.equal("<div class=icon_device_managed_status_in_sync>&nbsp&nbsp&nbsp&nbsp&nbspIn RMA</div>");
                });
                 it('Checks the getConfigurationStatus 3', function () {
                    resp = conf.getConfigurationStatus("Sync Failed");
                    resp.should.be.equal("<div class=icon_device_managed_status_sync_failed>&nbsp&nbsp&nbsp&nbsp&nbspSync Failed</div>");
                });
                 it('Checks the getConfigurationStatus 4', function () {
                    resp = conf.getConfigurationStatus("Out Of Sync");
                    resp.should.be.equal("<div class=icon_device_managed_status_sync_failed>&nbsp&nbsp&nbsp&nbsp&nbspOut Of Sync</div>");
                });
                  it('Checks the getConfigurationStatus 5', function () {
                    resp = conf.getConfigurationStatus("Reactivate Failed");
                    resp.should.be.equal("<div class=icon_device_managed_status_sync_failed>&nbsp&nbsp&nbsp&nbsp&nbspReactivate Failed</div>");
                });
        });
      describe('Check selectAll', function(){
            var resp;
            before(function () {
            getRowIds = sinon.stub(conf.gridUtility, 'getRowIds', function(setIdsSuccess, setIdsError, searchData, deviceListQueryParams, url){
                            return url;
                        });
            });
            after(function () {
                getRowIds.restore();
            });
            it('Checks the selectAll 0', function () {
                resp = conf.selectAll("","","","");
            });
            it('Checks the selectAll 1', function () {
                resp = conf.selectAll("","","",{_search:"test"});
            });
       });

     describe('Check getDeviceFetchURL ', function(){
           var resp;
         it('Checks the getDeviceFetchURL 0', function () {
               resp = conf.getDeviceFetchURL();
               resp.should.be.equal("/api/juniper/sd/active-directory-management/active-directories/12345/devices");
           });
      });

       describe('Check viewConfigurationLinkConstructor  ', function(){
             var resp;
           it('Checks the viewConfigurationLinkConstructor 0', function () {
                 var options = {id:'123', name:'asfd', 'connection-status':'up'};
                 resp = conf.viewConfigurationLinkConstructor("","",options);
                 resp.should.be.equal("<a onclick=deviceViewConfiguration(123,'asfd','1234')>View</a>");
             });
           it('Checks the viewConfigurationLinkConstructor 1', function () {
                var options = {id:'123', name:'asfd', 'connection-status':'down'};
                resp = conf.viewConfigurationLinkConstructor("","","",options);
                resp.should.be.equal("Not Available");
            });
        });
    });
});