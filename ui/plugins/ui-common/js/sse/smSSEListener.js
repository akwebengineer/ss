/**
 * SM Module that listens to SSE event for SM
 * For browsers not supporting EventSource we are using event-source-polyfill
 * to provide EventSource
 * 
 * @author skesarwani
 */
define(
  ['../common/utils/SmUtil.js','../event-source-polyfill/eventsource.js'],
  function(SMUtil) {
    var SmSSEListener = function() {
      var self = this,smUtil = new SMUtil(),
      //this is the filter in URL which tells space server what events we are interested in receiving
      filter = "/api&exclude=/api/space/audit-log-management",
      // SSE event stream URL in space server
      url = "/mainui/ctrl/sm/SSE",
      eventSource , 
      sources = [], 
      publisher =  null/*, eventThrottleMap = {}*/;
      
        this.doEventPublish = function(uri, data) {
          publisher.publish(uri, data);
          /*var throttledFunc = eventThrottleMap[uri];
          if (throttledFunc) {
            throttledFunc(uri,data);
          } else {
            throttledFunc = _.throttle(function(uriParam,dataParam) {
              publisher.publish(uriParam, dataParam);
            }, 2000);
            eventThrottleMap[uri] = throttledFunc;
            throttledFunc(uri,data);
          }*/
        };
        /**
         * Get all possible URIs for this event on which publish event should
         * be called
         */
        this.createAllUriList = function(uri) {
          // Logic is to search for integer in the URI path and make alternate
          // uri paths like :
          //
          // api/space/1234/devices/managed/3345/results breaks to
          // 
          // api/space -- The super set api/space/1234 -- The exact MO match;
          // and the original path i.e.
          // api/space/1234/devices/managed/3345/results Rest of the paths we
          // are not considering as practically they are not used (possible)
          // in Space/SD like api/space/1234/devices etc etc

          var i, l, splitArr = uri.split('/'), reconstructUri = [], validUris = [];

          for (i = 0, l = splitArr.length; i < l; ++i) {
            if ($.isNumeric(splitArr[i]) === false) {
              if (splitArr[i].length > 0) { // for case like /12api/
                reconstructUri[i] = splitArr[i];
              }
            } else {
              validUris[validUris.length] = reconstructUri.join('/');
              reconstructUri[i] = splitArr[i];
              validUris[validUris.length] = reconstructUri.join('/');
              break;
            }
          }
          if (validUris.length === 0) {
            validUris[0] = uri;
          } else if (validUris[validUris.length - 1].length !== uri.length) {
            validUris[validUris.length] = uri;
          }
          return validUris;
        };
        // This life cycle on create of activity
        this.onCreate = function() {
          if (typeof EventSource === "undefined") {
            console.log('EventSource is not supported for this agent. Notifications wont work.');
            return;
          }
          eventSource = new EventSource(location.origin + url + "?filter=" + filter);
          if(smUtil.isDebugMode()) {
            console.log('Subscribed to url', url + "?filter=" + filter);
          }
          
          // Trigger the call back when a sse event is recieved from server
          eventSource.onmessage = function(eventObject) {
            if(smUtil.isDebugMode()) {
              console.log(eventObject);
            }
            var data = JSON.parse(eventObject.data), allUrisOfInterest = [], i, l;

            allUrisOfInterest = self.createAllUriList(data.uri);
            if(smUtil.isDebugMode()) {
              console.log(allUrisOfInterest);
            }
            for (i = 0, l = allUrisOfInterest.length; i < l; ++i) {
              // publisher.publish(allUrisOfInterest[i], data);
              self.doEventPublish(allUrisOfInterest[i], data);
            }

          };
          eventSource.onerror = function() {
            console.log("Error during initiailise of event source");
            Backbone.isSMEventSourceConnectionFailure = true;
            console.log(Backbone.isSMEventSourceConnectionFailure);
            console.log(arguments);
            sources = [];
          };
          sources.push(eventSource);
          
          publisher = this.getContext().getPublisher();
        };
        // This life cycle on start of activity
        this.onStart = function() {
          console.log('Sm Buddy Started');
        };
        this.onDestroy = function() {

        };
        this.onNewSubscription = function(eventUri) {
          // TODO
          // On new subscription update the event source filter so that we
          // start listening to this newly requested events
          console.log("smSSEListener.js", "this.onNewSubscription(", eventUri, ")");
        };
        this.onRemoveSubscription = function(eventUri) {
          //TODO
          //On remove subscription update the event source filter so that we
          //stop listening to this requested events
          console.log("smSSEListener.js", "this.onRemoveSubscription(", eventUri, ")");
        };
    };
    //extend from Slipstream SDK
    SmSSEListener.prototype = new Slipstream.SDK.MessageProvider();
    return SmSSEListener;
  }
);
