/**
* SM Module that helps all sm modules to subscribe for SSE event
* start and stop subscription should be called to register to recieving events and stopping them
* @author skesarwani
*/
define([], function() {
  var SmSSEEventSubscriber = function () {
    var messageResolver = new Slipstream.SDK.MessageResolver(), totalCount = 0;/*, subscribers = []*/
    
    this._start = function(sseEventUriList, handler, throttleTimeFactor){
      var i , l = sseEventUriList.length, sseEventUri, subscriptions = [], subscription, throttledFunc;
      throttleTimeFactor = throttleTimeFactor || 5;
      throttledFunc = _.throttle(handler, throttleTimeFactor*1000);
      totalCount++;
      for(i = 0; i < l; ++i ){
        sseEventUri = sseEventUriList[i];
        console.log('Sm Subscription called for ' + sseEventUri);
        //topic is defined in sm plugins.json
        subscription = messageResolver.subscribe('topics://vnd.juniper.sm.sse/', sseEventUri, throttledFunc);
        subscriptions.push(subscription);
      }
      console.log('In Start Subscription Total Subscriptions ' +totalCount);
      return subscriptions;
    };
   
    this._stop = function(subscriptions){
      var i , l = subscriptions.length, subscription;
      totalCount--;
      for(i = 0; i < l; ++i ){
        subscription = subscriptions[i];
        console.log('Sm SSE event Un Subscription called for');
        console.log(subscription);
        messageResolver.unsubscribe(subscription);
      }
      //Empty the array
      subscriptions = [];
      console.log('In Stop Subscription Total Subscriptions ' +totalCount);
    };
  };

    SmSSEEventSubscriber.prototype.startSubscription = function(sseEventUriList, handler, throttleTimeFactor){
        return this._start(sseEventUriList, handler, throttleTimeFactor);
    };


    SmSSEEventSubscriber.prototype.stopSubscription = function(subscriptions){
        return this._stop(subscriptions);
    };


  return SmSSEEventSubscriber;

});