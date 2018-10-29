define([
    'explorer/widgets/js/form',
], function(FormView,TooltipWidget){
    var formExt = FormView.extend({
    	events: function(){
          return _.extend({},FormView.prototype.events,{
          	"click #selected": "selected"
          });
        },
        selected: function(){
            alert(this.widget.time.getTime());
        }
    
    });


    return formExt;
});