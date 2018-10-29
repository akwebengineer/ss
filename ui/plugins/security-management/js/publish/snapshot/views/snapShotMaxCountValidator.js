/**
 * The launch Update device ILP page
 *
 * @module DeviceUpdate View
 * @author vinayms <vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/

define([
    'widgets/confirmationDialog/confirmationDialogWidget'
],  function (ConfirmationDialog) {

    var snapshotMaxCountConfirmationView = function(configuration){
      var self = this;
        /**
         *  Initialize all the view require params in configuration if triggered form publish work flow..
         *  @param {[type]} [context] [description]
         *  @param  {[type]}  policyOptions [policy object]
         * @param  {Boolean} isUpdate      []
         * @param  {[type]}  serviceType   [policy service type]
         */
        
        // or
        
         /**
         *  Initialize all the view require params in configuration if triggered form create snapshot work flow..
         *  @param {[type]} [context] [description]
         *  @param  {[type]}  policyOptions [policy object]
         */
        
        /**
         * [checkForSnapShotMaxCount check if any policy exceeded the max snapshot count]
         
         */
        this.checkForSnapShotMaxCount= function(){
          var policyIds =[],i ,jsonData, policyOptions = configuration.policyOptions;
          for(i in policyOptions.selectedPolicies){
            policyIds[policyIds.length] = policyOptions.selectedPolicies[i].id;
          } 
          jsonData = {
               "policy-refs-with-max-snapshot-versions-request" : {
                 "policy-ids" : {
                   "policy-id" : policyIds
                 }
               }
            };
           $.ajax({
                url: '/api/juniper/sd/policy-management/'+configuration.serviceType+'/policy-refs-with-max-snapshot-versions',
                type: 'POST',
                dataType:"json",
                data: JSON.stringify(jsonData),
                headers:{
                    'accept': 'application/vnd.juniper.sd.policy-management.policy-refs-with-max-snapshot-versions+json;version=1;q=0.01',
                    'content-type': 'application/vnd.juniper.sd.policy-management.policy-refs-with-max-snapshot-versions-request+json;version=1;charset=UTF-8'
                },
                success: function(data) {
                    onMaxSnapShotCallBack(data);
                },
                // handing the server failure.
                error: function(model) {
                    console.log(model.error().statusText);
                }
            });
        };
        /**
         * [onMaxSnapShotCallBack display a confirmation pop up to notifiy the user if snapshot limit exceeded..]
         * @param  {[type]}  data          [responce data with affected policies]
         * @param  {[type]}  policyOptions [policy object]
         * @param  {Boolean} isUpdate      []
         * @param  {[type]}  serviceType   [publish service type]
         */
        var onMaxSnapShotCallBack= function (data) {
            var i, MaxSnapShotconfirmationDialogWidget, affectedPolicies = "", reference = data['policy-refs-with-max-snapshot-versions'].reference;
            if(reference.length>0){
                for(i in reference){
                    affectedPolicies += '<br>' + reference[i].name;
                }
                MaxSnapShotconfirmationDialogWidget = new ConfirmationDialog({
                    title: configuration.context.getMessage('snapshot_max_reached_title'),
                    question: configuration.context.getMessage('snapshot_max_reached_message')+ affectedPolicies,
                    yesButtonLabel: configuration.context.getMessage('delete_oldest_and_proceed'),
                    noButtonLabel: configuration.context.getMessage('cancel'),
                    yesButtonCallback: function() {
                        MaxSnapShotconfirmationDialogWidget.destroy();
                        if(configuration.snapshotCallback){
                          configuration.snapshotCallback(true);
                        }
                    },
                    noButtonCallback: function() {
                      MaxSnapShotconfirmationDialogWidget.destroy();
                       self.cancelCallBack();
                    },
                    xIcon: true
                });
                MaxSnapShotconfirmationDialogWidget.build();
            } else {
                if(configuration.snapshotCallback){
                  configuration.snapshotCallback(false);
                }
            }
          
        };
        /**
         * [cancelCallBack override this method if required by the sub class]
         */
        this.cancelCallBack = function(){
          console.log('cancel triggered..')
        };
      }
    return snapshotMaxCountConfirmationView;
});
