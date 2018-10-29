/*extending the base form to add events and tooltips for list builder*/
define([
    'explorer/widgets/js/form',
    'widgets/tooltip/tooltipWidget',
    'widgets/listBuilderNew/tests/dataSample/testingSample'
], function(FormView,TooltipWidget,testingSample){
    var formExt = FormView.extend({
        events: function(){
          return _.extend({},FormView.prototype.events,{
            'click #get_available': 'getAvailableItems',
            'click #get_selected': 'getSelectedItems',
            'click #add_available': 'addAvailableItems',
            'click #add_selected': 'addSelectedItems',
            'click #remove_available': 'removeAvailableItems',
            'click #remove_selected': 'removeSelectedItems',
            'click #search_available': 'searchAvailableItems',
            'click #search_selected': 'searchSelectedItems'
          });
        },
        
        addMoreCode: function(){
            // onChangeSelected tooltip
            var changeConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var changeFunc  = '<pre>function (e, data){\n\
                    console.log("onChangeSelected triggered");\n\
                    console.log(data);\n\
                }</pre>';
            this.tooltipWidgetChange = new TooltipWidget({
                "elements": changeConfig,
                "container": this.$el.find('#onChangeSelected_Checkbox'),
                "view": changeFunc
            });
            this.tooltipWidgetChange.build();

            //addformatter
            var formatterConfig = {
                "position": 'right',
                "style": 'topNavigation'
            };
            var formatterFunc  = "<pre>function (cellvalue, options, rowObject){\nreturn '&#60;a class=\"cellLink\" data-cell=\"'+cellvalue+'\"&#62;'+cellvalue+'&#60;/a&#62;';\n\
                }</pre>";
            var allFormatterIds=["#name_option_addFormatter_Checkbox","#uri_option_addFormatter_Checkbox","#href_option_addFormatter_Checkbox","#name_option_addFormatter_Checkbox","#hash-key_option_addFormatter_Checkbox","#address-type_option_addFormatter_Checkbox","#ip-address_option_addFormatter_Checkbox","#description_option_addFormatter_Checkbox","#definition-type_option_addFormatter_Checkbox","#id_option_addFormatter_Checkbox","#domain-id_option_addFormatter_Checkbox","#domain-name_option_addFormatter_Checkbox"];
            for(var ii=0;ii<allFormatterIds.length;ii++){
                new TooltipWidget({
                    "elements": formatterConfig,
                    "container": this.$el.find(allFormatterIds[ii]),
                    "view": formatterFunc
                }).build();
            }
        },

        getAvailableItems: function () {
            console.log(this);
            var availableItems = this.widget.listBuilder.getAvailableItems();
            var all ="";
            for(var ii = 0; ii<availableItems.length;ii++){
                for(p in availableItems[ii]){
                    all += availableItems[ii][p];
                    all += " ";
                }
                all += "\n";
            }
            alert(all);
        },
        getSelectedItems: function(){
            var selectedItems = this.widget.listBuilder.getSelectedItems();
            var all ="";
            for(var ii = 0; ii<selectedItems.length;ii++){
                for(p in selectedItems[ii]){
                    all += selectedItems[ii][p];
                    all += " ";
                }
                all += "\n";
            }
            alert(all);
        },
        addAvailableItems: function(){
            this.widget.listBuilder.addAvailableItems(testingSample.sample1);
            alert("Items added to available list");
        },
        addSelectedItems: function(){
            this.widget.listBuilder.addSelectedItems(testingSample.sample1);
            alert("Items added to selected list");
        },
        removeAvailableItems: function(){
            this.widget.listBuilder.removeAvailableItems(testingSample.sample1);
            alert("Items removed from available list");
        },
        removeSelectedItems: function(){
            this.widget.listBuilder.removeSelectedItems(testingSample.sample1);
            alert("Items removed from selected list");
        },
        searchAvailableItems: function(){
            this.widget.listBuilder.searchAvailableItems("0dummy");
        },
        searchSelectedItems: function(){
            this.widget.listBuilder.searchSelectedItems("0dummy");
        }
        
       

    });


    return formExt;
});