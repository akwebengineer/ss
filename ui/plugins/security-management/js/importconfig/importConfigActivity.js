/**
 * Created by vinutht on 6/22/15.
 */

/**
 * A module that works with import of device configuration.
 *
 * @module Import Config Activity
 * @author Slipstream Developers <spog_dev@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([ './views/importConfigWizardView.js', '../sdBaseActivity.js', '../../../ui-common/js/common/intentActions.js'],
         function(DeviceImportView, SDDeviceActivity, IntentActions) {
  /**
   * Constructs an Import Config Activity.
   */


  var ImportConfigActivity = function() {
    SDDeviceActivity.call(this);
    this.onStart = function() {
            console.log("Started SignatureDatabaseActivity");
            switch(this.getIntent().action) {
                case Slipstream.SDK.Intent.action.ACTION_IMPORT:
                    this.onImportIntent();
                    break;

                case IntentActions.ACTION_IMPORT_ZIP:
                    this.onImportZipIntent();
                    break;

                case IntentActions.ACTION_IMPORT_DEVICECHANGE:
                    this.onImportDeviceChangeIntent();
                    break;

                case IntentActions.ACTION_ROLLBACK:
                    this.onRollbackIntent();
                    break;
            }
    };

    
  this.onImportIntent = function(){  
      var extras = this.intent.getExtras(),
         model = extras.model,
         data =  extras.data,
         view = new DeviceImportView({
            activity : this,
            model : model,
            selectedRecord : {"id":data.sdDeviceIds},
            type : "IMPORT"
          }),
         options = {size:'large'};
      this.buildOverlay(view, options);
      view.init();
    };


      /**
       * Action on click of import zip file
       */
      this.onImportZipIntent = function(){
          var extras = this.intent.getExtras(),
              data =  extras.data,
              view = new DeviceImportView({
                  activity : this,
                  fileName : data.fileName,
                  serviceType : data.service,
                  type : "IMPORT_ZIP",
                  selectedRecord: {}
              }),
              options = {size:'large'};
          this.buildOverlay(view, options);
          view.init();
      };


  this.onImportDeviceChangeIntent = function(){  
      var extras = this.intent.getExtras(),
         model = extras.model,
         data =  extras.data,
         view = new DeviceImportView({
            activity : this,
            model : model,
            selectedRecord : {"id":data.sdDeviceIds[0]},
            type : "IMPORT_DEVICE_CHANGE",
          }),
         options = {size:'large'};
      this.buildOverlay(view, options);
      view.init();
    };

 this.onRollbackIntent = function(){  
      var extras = this.intent.getExtras(),
         model = extras.model,
         data =  extras.data,
         view = new DeviceImportView({
            activity : this,
            model : model,
            selectedRecord : data.selectedRecord,
            type : "rollback",
            service : data.service,
            fileName: data.fileName
          }),
         options = {size:'large'};
      this.buildOverlay(view, options);
      view.init();
  };
    
  };

 



  ImportConfigActivity.prototype = new Slipstream.SDK.Activity();
  return ImportConfigActivity;
});
