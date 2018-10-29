/**
 *  Rule Name Template Builder Activity
 * @copyright Juniper Networks, Inc. 2015
 **/
define(
    [
      'backbone',
      'widgets/overlay/overlayWidget',
      './views/ruleNameTemplateBuilderFormView.js'
    ],

    function (Backbone, OverlayWidget, RuleNameTemplateFormView) {
      var RuleNameTemplateBuilderActivity = {
        launchOverlay: function(policyOptions){
          var view= new RuleNameTemplateFormView({
            activity: policyOptions.activity,
            params: policyOptions.params
          });
          policyOptions.activity.overlay = new OverlayWidget({
            view: view,
            type: 'medium',
            height: '700px'
          });
          policyOptions.activity.overlay.build();

        }
      };
      return RuleNameTemplateBuilderActivity;
    });