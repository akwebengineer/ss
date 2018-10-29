define(function() {
    var SampleViewToolbarActivity = function() {
        Slipstream.SDK.Activity.call(this);
        this.onCreate = function() {
            var AppView = Backbone.View.extend({
             
              el: this.el,
              render: function(){
                var str = "<div class='utility_sample_view'> </div>";
                this.$el.html(str);
              }
            });

            var options = {el: "<div></div>"};
            var app_view = new AppView(options);
            this.context.toolbarElement.setView(app_view);
        },

        this.onStart = function() {
            console.log("on start");
        }
    };

    SampleViewToolbarActivity.prototype = Object.create(Slipstream.SDK.Activity.prototype);
    SampleViewToolbarActivity.prototype.constructor = SampleViewToolbarActivity;

    return SampleViewToolbarActivity;
});