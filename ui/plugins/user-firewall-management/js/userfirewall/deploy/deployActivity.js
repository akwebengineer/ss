/**
 * Deploy Activity page
 *
 * @module DeployActivity
 * @author svaibhav
 * @copyright Juniper Networks, Inc. 2015
 **/
define(
    [
        'backbone',
        './views/updateView.js',
        'widgets/confirmationDialog/confirmationDialogWidget',
         '../../../../security-management/js/sdBaseActivity.js'
    ],

    function (Backbone, UpdateView, ConfirmationDialog, BaseActivity) {

        var DeployActivity = function() {
            var self = this;
            BaseActivity.call(self);
            self.onStart = function() {
              var data = this.getExtras(), mainIntent = this.getIntent();
              switch(this.getIntent().data['mime_type']) {

                case "vnd.juniper.net.userfirewall.activedirectory.deploy":
                data.objType ="ACTIVE_DIRECTORY";
                    this.deploy(data);
                    break;

                case "vnd.juniper.net.userfirewall.accessprofile.deploy":
                data.objType ="ACCESS_PROFILE";
                     this.deploy(data);
                    break;
            }
            };

            this.deploy= function(deployOptions){
                 var self = this;
                       extras = this.intent.getExtras();
                        var view = new UpdateView({
                          activity : self,
                          selectedDevices : deployOptions,

                        });
                        this.buildOverlay(view, {size: 'xlarge'});
            };
    };
    DeployActivity.prototype = new Slipstream.SDK.Activity();
    return DeployActivity;
});