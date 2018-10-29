/**
 * A view that uses the Overlay component (created from the Overlay widget) to render an overlays using React
 *
 * @module Overlay View
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define(['backbone',
    'text!widgets/overlay/react/tests/templates/testPage.html',
    'widgets/overlay/react/tests/conf/overlayDefaults',
    'es6!widgets/overlay/react/tests/view/basicOverlayView',
    'es6!widgets/overlay/react/tests/view/configurableOverlayView'
], function (Backbone, testPageTemplate, overlayDefaults, BasicOverlayView, ConfigurableOverlayView) {
    var OverlayView = Backbone.View.extend({

        events: {
            'click .basicOverlay': 'renderBasicOverlay',
            "click .configurableOverlay": "renderConfigurableOverlay",
        },

        initialize: function () {
            this.$el.append(testPageTemplate);
        },

        renderBasicOverlay: function () {
            new BasicOverlayView().render();
        },

        renderConfigurableOverlay: function () {
            var overlayComponentConfiguration = this.getOverlayComponentConfiguration();
            new ConfigurableOverlayView(overlayComponentConfiguration).render();
        },

        getOverlayComponentConfiguration: function () {
            var overlayConfiguration = this.getOverlayInitialConfiguration(),
                contentConfiguration = {},
                inputContainers = this.getInputConfigurationContainers();

            var addInputSelections = function (configObj, $group) {
                var groupItemVal;
                $.each($group, function () {
                    groupItemVal = $(this).val();
                    configObj[groupItemVal] = overlayDefaults[groupItemVal];
                });
            };

            //adds overlay size
            overlayConfiguration.type = inputContainers.$sizeInput.val();

            //adds title and title tooltip
            overlayConfiguration.title = overlayDefaults[inputContainers.$titleInput.val()];
            var tooltipVal = inputContainers.$tooltipTitleInput.val();
            tooltipVal && (overlayConfiguration.titleHelp = overlayDefaults[tooltipVal]);

            //add overlay buttons
            addInputSelections(overlayConfiguration, inputContainers.$buttonInput);

            //add custom border and button styles
            var styleConf = {};
            addInputSelections(styleConf, inputContainers.$styleInput);
            for (var valueStyle in styleConf) {
                overlayConfiguration.class += " " + valueStyle;
            }

            //add content size and other options
            addInputSelections(contentConfiguration, inputContainers.$contentSizeInput);
            addInputSelections(contentConfiguration, inputContainers.$optionsInput);

            return {
                "contentConfiguration": contentConfiguration,
                "overlayConfiguration": overlayConfiguration
            }
        },

        getOverlayInitialConfiguration: function () {
            return {
                class: "test_overlay_widget",
                beforeSubmit: function () {
                    console.log("-- beforeSubmit is executed");
                },
                submit: function () {
                    console.log("-- submit is executed");
                },
                beforeCancel: function () {
                    console.log("-- beforeCancel is executed");
                },
                cancel: function () {
                    console.log("-- cancel is executed");
                }
            }
        },

        getInputConfigurationContainers: function () {
            return {
                $sizeInput: this.$el.find("input[name=component_size]:checked"),//radio
                $titleInput: this.$el.find("input[name=component_title]:checked"),//radio
                $tooltipTitleInput: this.$el.find("input[name=component_title-tooltip]:checked"),//checkbbox
                $buttonInput: this.$el.find("input[name=component_buttons]:checked"),//checkbox
                $styleInput: this.$el.find("input[name=component_style]:checked"),//checkbox
                $contentSizeInput: this.$el.find("input[name=component_content-size]:checked"),//radio
                $optionsInput: this.$el.find("input[name=component_options]:checked")//checkbox
            }
        }

    });

    return OverlayView;
});
