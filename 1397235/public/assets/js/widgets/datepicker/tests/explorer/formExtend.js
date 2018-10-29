define([
    'explorer/widgets/js/form',
], function(FormView,TooltipWidget){
    var formExt = FormView.extend({

        events: function(){
          return _.extend({},FormView.prototype.events,{
          	"click #getDate": "getDateClick"
          });
        },
        getDateClick :function(){
            alert(this.widget.datepickerWidgetObj.getDate());
        }
    
    });


    return formExt;
});