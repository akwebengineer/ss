

define([
    'backbone',
    'backbone.syphon',    
    'widgets/form/formWidget',
    '../../../../../ui-common/js/views/apiResourceView.js',
    '../conf/comparePolicyResultConfiguration.js',
    'lib/template_renderer/template_renderer',
    'text!../templates/compareResultTemplate.html',
], function (Backbone, Syphon, FormWidget, ResourceView,ResultConfig,Renderer,CompareResultTemplate) {

    var ComparePolicyResultView = ResourceView.extend({

        events: {
            'click #compare-result-save': "save",
            'click #compare-next-diff': "next",
            'click #compare-prev-diff': "previous",
            'click #compare-top': "moveTop",
            'click #download-diff': "downloadDiff"
        },

        save: function(event) {
            event.preventDefault();
            this.parentView.htmlOverlay.destroy();
        },

        initialize: function(options) {
            var self = this;
            this.parentView = options.parentView;
            this.context = options.parentView.context;
            this.params = options.params;
        },

        render: function() {
            this.getHTMLResponse();
            return this;
        },
      
        next : function() {
          if(this.policyDiff)
            this.policyDiff.next();
        },
      
        previous : function() {
          if(this.policyDiff)
            this.policyDiff.previous();
        },

        moveTop :function() {
          if(this.policyDiff)
            this.policyDiff.moveTop();
        },

        getHTMLResponse : function(){
          var self = this;
          $.ajax({
                "url": self.params.compareResultURL + self.params.compareId,
                "type": 'get',  
                "contentType": 'text/html',                    
                "processData": false,
                "success": function( data, textStatus, jQxhr ) {
                    self.renderHTML(data);
                },
                "error": function( jqXhr, textStatus, errorThrown ) {
                    console.log( errorThrown );
                }
            });
        },

        renderHTML : function(data){
          var self = this; 
          var html = Renderer(data, null);
          this.$el.append(Renderer(CompareResultTemplate,null));
          this.$el.find("#compare_result").html(html).promise().done(function(){
            self.policyDiff = policyDiff;
          });
        },

        downloadDiff: function(event) {
            this.parentView.downloadDiff(false);
        }
    }); 

    return ComparePolicyResultView;
});
