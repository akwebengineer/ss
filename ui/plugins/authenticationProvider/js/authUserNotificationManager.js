define( [
  '../../ui-common/js/sse/smSSEEventSubscriber.js'
],
    function(SmSSEEventSubscriber) {

      var AuthUserNotificationSubscriber = {
        getNotificationConfig: function( isUserAuthenticate ) {
          var notificationSubscriptionConfig = {
            'uri': [
              '/api/space/user-management/active-user-sessions'
            ],
            'autoRefresh': true,
            'callback': function( response ) {
              
              var options = {};
              options.fail = function(message){
                var intent = new Slipstream.SDK.Intent( "slipstream.intent.action.ACTION_UNAUTHENTICATE",
                    {
                      uri: new Slipstream.SDK.URI( "auth://" )
                    } );
                intent.putExtras({
                  message: (message)?message:undefined
                 });
                Slipstream.vent.trigger( "activity:start",
                    intent );
              }
              isUserAuthenticate(options);
            }
          };
          return notificationSubscriptionConfig;
        },

        subscribeNotifications: function( isUserAuthenticate ) {
          // Subscribe to the SSE event
          var self = this;
          self.sseEventSubscriptions;
          var configFunc = AuthUserNotificationSubscriber.getNotificationConfig;
          if ( undefined !== configFunc ){
            self.smSSEEventSubscriber =  new SmSSEEventSubscriber();
            var notificationSubscriptionConfig = configFunc( isUserAuthenticate ),
            sseEventHandler = notificationSubscriptionConfig.callback;
            self.sseEventSubscriptions = self.smSSEEventSubscriber.startSubscription( notificationSubscriptionConfig.uri,
                sseEventHandler );
          }
          return self.sseEventSubscriptions;
        },
        
        unSubscribeNotifications: function(){
          if(AuthUserNotificationSubscriber.smSSEEventSubscriber && AuthUserNotificationSubscriber.smSSEEventSubscriber.stopSubscription )
          {
        	  AuthUserNotificationSubscriber.smSSEEventSubscriber.stopSubscription(AuthUserNotificationSubscriber.sseEventSubscriptions);
          }
          AuthUserNotificationSubscriber.smSSEEventSubscriber = null;
          AuthUserNotificationSubscriber.sseEventSubscriptions = null;
      }

      };

      return AuthUserNotificationSubscriber;
    } );