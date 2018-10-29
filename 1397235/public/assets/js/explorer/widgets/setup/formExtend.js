define([
    'explorer/widgets/js/form',
], function(FormView,TooltipWidget){
    var formExt = FormView.extend({

        events: function(){
          return _.extend({},FormView.prototype.events,{
            //add event callback pairs here
          });
        },
        addMoreCode:function(){

        }
        //add event functions here
    });


    return formExt;
});