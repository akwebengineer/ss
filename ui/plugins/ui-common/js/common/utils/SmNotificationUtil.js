/**
 * Utility Class for Notification usage
 * This class will be used across SM
 * @module SmUtil
 * @author Vinay<vinayms@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define(['../../sse/smSSEEventSubscriber.js'], function (SmSSEEventSubscriber) {

  var SmNotificationUtil = function() {
      var smSSEEventSubscriber = new SmSSEEventSubscriber(), sseEventSubscriptions;
      /**
       * [subscribeNotifications description]
       * @param  {[array]} registerUris         [description]
       * @param  {[function]} notificationCallBack [description]
       * @return {[object]}   [sseEventSubscriptions]
       */
      this.subscribeNotifications = function (registerUris, notificationCallBack ) {
        //Subscribe to the SSE event
        var sseEventHandler = $.proxy(notificationCallBack, this);
        sseEventSubscriptions = smSSEEventSubscriber.startSubscription(registerUris, sseEventHandler);
        return sseEventSubscriptions;
      };
      /**
       * [unSubscribeNotifications description]
       * @return {[type]} [description]
       */
      this.unSubscribeNotifications= function(){
          smSSEEventSubscriber.stopSubscription(sseEventSubscriptions);
          //smSSEEventSubscriber = null;
          //sseEventSubscriptions = null;
      };
      /**
       * [getTaskProgressUpdate description]
       * @param  {[string]} screenID  [description]
       * @param  {[function]} onSuccess [description]
       * @param  {[function]} onError   [description]
       */
      this.getTaskProgressUpdate = function(screenID, onSuccess, onError){
          $.ajax({
            url: '/api/juniper/sd/task-progress/'+screenID,
            type: 'GET',
            dataType:"json",
            headers:{
                'accept': 'application/vnd.juniper.sd.task-progress.task-progress-response+json;version=2;q=0.02'
            },               
            success: onSuccess,
            error: onError
          });
      };
   
  };
  return SmNotificationUtil;
});