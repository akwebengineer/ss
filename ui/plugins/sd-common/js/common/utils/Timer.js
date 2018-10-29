define([
],function(){

      var Timer = function(options) {
        this.initialize(options);
      }

      _.extend(Timer.prototype, {

        active : false,
        method:null,
        interval:5000,
        initialize: function(options){
            var me = this;
            me.active = options.active;
            me.interval = options.interval;
            me.method = options.method;
        },
        start: function(interval) {
            this.interval = interval?interval:this.interval;
            if(!this.active) {
                this.active = true;
                this.timerObject = setInterval(this.method, this.interval);
            }
        },
        stop : function() {
            this.active = false;
            clearInterval(this.timerObject);
        },
        reset : function(interval) {
            this.interval = interval?interval:this.interval;
            clearInterval(this.timerObject); 
            this.timerObject = setInterval(this.method, this.interval); 
        }
    });
    return Timer;
});


//Usage

// var test = function() { 
// console.log("timer invoked the method");
// timer.stop();
// };
// var timer = new Timer({interval: 10000, method:test});
// timer.start();