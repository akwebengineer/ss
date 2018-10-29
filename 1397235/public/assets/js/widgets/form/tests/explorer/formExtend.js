/*extending base form to add extra events to form's form*/
define([
    'explorer/widgets/js/form'
], function(FormView){
    var formExt = FormView.extend({
        events: function(){
          return _.extend({},FormView.prototype.events,{
            "click #add_section": "addSection",
            "click #add_element": "addElement"
          });
        },
        
        addSection: function(){
            console.log(this);
            this.form.copyRow("sectionCopy", true);
        },
        addElement: function(){
            this.form.copyRow("elementCopy", true);
            var ele = this.$el.find(".elementCopy");
            if (ele[0].style.display !="none"){
                for(var ii = 1;ii<ele.length; ii++){
                    ele[ii].style.display = "block"
                }
            }   
        }
        
       

    });


    return formExt;
});