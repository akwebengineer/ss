
define([
    'backbone',
    'text!widgets/grid/tests/templates/noResultsContentForView.html'
], function(Backbone, nrTemplate){
    var NoSearchResultView = Backbone.View.extend({

        render: function () {
            this.$el.append(nrTemplate);
            return this;
        }
    });

    return NoSearchResultView;
});