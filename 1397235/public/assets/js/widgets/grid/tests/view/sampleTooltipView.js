/**
 * Sample view for selection tooltip
 */

define([
    'backbone'
], function(Backbone){
    
    var SimpleTooltipView = Backbone.View.extend({
        
        render: function() {
            var actions = {};
            var selectedRows = this.options.selectedRows;
            for(var i=0; i<selectedRows.length; i++) {
                if(selectedRows[i].action){
                    if(!actions[selectedRows[i].action]){
                        actions[selectedRows[i].action] = '1';
                    }
                    else{
                        actions[selectedRows[i].action]++;
                    }
                }
            }

            var output = '';
            for (var property in actions) {
              output += actions[property] + ' ' + property + "</br>";
            }
            
            this.$el.html(output);
        }
    });

    return SimpleTooltipView;
});