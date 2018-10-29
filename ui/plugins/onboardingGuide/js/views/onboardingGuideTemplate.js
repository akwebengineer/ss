/**
 * * A library that groups templates used by the Grid widget
 *
 * @module onboardingGuideTemplate
 * @author Fengbin Sun <fengbin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */
define([
    "text!../../templates/onboardingGuide.html",
    "text!../../templates/generalSlide.html",
    "text!../../templates/coverSlide.html",
    "text!../../templates/endSlide.html",
    "text!../../templates/videoSlide.html",
    "text!../../templates/videoPreview.html",
    "text!../../templates/videoPlayOverlay.html"
], function(guideTemplate, slideTemplate, coverSlideTemplate, endSlideTemplate, 
            videoSlideTemplate, videoPreviewTemplate, videoPlayTemplate) {
    var onboardingGuideTemplates = function() {
        this.getTemplates = function() {
            return {
                "guideTemplate" : guideTemplate,
                "slideTemplate" : slideTemplate,
                "coverSlideTemplate" : coverSlideTemplate,
                "endSlideTemplate" : endSlideTemplate,
                "videoSlideTemplate" : videoSlideTemplate,
                "videoPreviewTemplate" : videoPreviewTemplate,
                "videoPlayTemplate" : videoPlayTemplate
            };
        };
    };
    return onboardingGuideTemplates;
});