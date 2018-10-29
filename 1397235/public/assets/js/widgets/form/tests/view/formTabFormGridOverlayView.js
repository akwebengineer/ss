/**
 * A view that uses a configuration object to render a form widget on a overlay
 *
 * @module FormTabFormGridOverlayView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'widgets/overlay/overlayWidget',
    'widgets/form/formWidget',
    'widgets/form/tests/conf/formConfiguration',
    'widgets/tabContainer/tests/view/gridTabView',
    'widgets/tabContainer/tests/view/zonePolicyView',
    'widgets/tabContainer/tests/view/utmPolicyView'
], function(Backbone, OverlayWidget, FormWidget, formConfiguration, GridTabView, ZonePolicy, UTMPolicy){
    var FormTabFormGridOverlayView = Backbone.View.extend({

        events: {
            'click #add_policy_cancel': 'closePolicy'
        },

        initialize: function (options){
            this.overlay = new OverlayWidget({
                view: this,
                type: options.type
            });
            this.overlay.build();
        },

        render: function () {
            var formConfig = $.extend(true, {}, formConfiguration.formTabFormGridOverlay);
            formConfig.sections[0].elements[0].tabs = [{
                id:"create",
                name: "Create",
                content: new GridTabView()
            },{
                id:"zone",
                name:"Zone Policy",
                content: new ZonePolicy()
            },{
                id:"utm",
                name:"UTM Policy",
                content: new UTMPolicy()
            }];

            this.form = new FormWidget({
                "elements": formConfig,
                "container": this.el
            });
            this.form.build();
            return this;
        },

        closePolicy: function (e){
            this.overlay.destroy();
            e.preventDefault();
            e.stopPropagation();
        }

    });

    return FormTabFormGridOverlayView;
});