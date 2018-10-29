/**
 * A view that uses a configuration object to render a form widget on a overlay for the Zone Policies add view
 *
 * @module ZonePoliciesAddView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    'widgets/shortWizard/tests/conf/formConfiguration',
    'widgets/listBuilderNew/listBuilderWidget',
    'widgets/listBuilderNew/conf/configurationSample',
    'widgets/shortWizard/tests/view/shortWizardView'
], function(Backbone, Overlay, FormWidget, formConfiguration, ListBuilderWidget, listBuilderConf, ShortWizardView){
    var overlayView = Backbone.View.extend({
        initialize: function () {
            !this.options.pluginView && this.render();
        },
        render: function () {
            this.shortWizardView = new ShortWizardView({
                "overlayObj": this
            });
            this.overlay = new Overlay({
                view: this.shortWizardView,
                xIconEl: false,
                cancelButton: false,
                okButton: false,
                showScrollbar: false,
                type: this.options.type
            });
            this.overlay.build();
            return this;
        }
    });
    return overlayView;
});