define([
    'explorer/widgets/js/form',
], function(FormView,TooltipWidget){
    var formExt = FormView.extend({

        events: function(){
          return _.extend({},FormView.prototype.events,{
            "click #addItem" : "addDropdown",
            "click #addBreakpoint" : "addBreakOptions"
          });
        },
        addDropdown: function(e){
            //console.log(e.target.id);
            this.form.copyRow("itemCopy", true);
        },
        addBreakOptions: function(e){
            this.form.copyRow("breakpoint", true);
        }
    
    });


    return formExt;
});