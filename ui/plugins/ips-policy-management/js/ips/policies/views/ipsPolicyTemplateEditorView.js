/**
 * Ips Policy Template Editor view for Create IPS Policy
 *
 * @author Ashish V avyaw@juniper.net
 * @copyright Juniper Networks, Inc. 2015
 */
 define(
    [
    'backbone',
    'backbone.syphon',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    '../conf/ipsPolicyTemplateEditorConfiguration.js'
],
function(Backbone, Syphon, OverlayWidget,FormWidget, IpsPolicyTemplateEditorConf) {

    var IpsPolicyTemplateView = Backbone.View.extend({

        events: {
            'click #save': "submit",
            'click #cancel': "cancel"
        },
       
        initialize: function(options) {
            this.parentView = options.parentView;
            this.context = options.context;
        },
        
        render: function() {
            var config =  new IpsPolicyTemplateEditorConf(this.context);
            this.formWidget = new FormWidget({
                "elements": config.getConfig(),
                "container": this.el
            });
            this.formWidget.build();
            return this;
        },
      
        submit: function(event) {
          event.preventDefault();
          var selectedTemplates = this.parentView.ipsPolicyTemplateListBuilder.getSelectedItems();
          var listStr = "";
          if(!_.isEmpty(selectedTemplates)){
           selectedTemplates.forEach(function (object) {
                listStr += object.name+ "\n";
            });
          }
          var sourceText = this.parentView.$el.find("#ips-policy-temp-editor-txt");
          sourceText.add( "span" ).css( "font-size", "12px" );
          $(sourceText).text(listStr);
          this.parentView.selectedTemplates = selectedTemplates;
          this.parentView.ipsPolicyTemplateOverlay.destroy();
        },
        
        cancel: function(event) {
            event.preventDefault();
            this.parentView.ipsPolicyTemplateOverlay.destroy()
        }
    });

    return IpsPolicyTemplateView;

});