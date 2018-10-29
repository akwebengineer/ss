/**
 * A module that works with user onboarding guide.
 *
 * @module OnboardingActivity
 * @author Fengbin Sun <fengbin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    './views/onboardingGuideView.js'
], function(GuideView) {
    var OnboardingGuideActivity = function() {
        /**
         * only one intent available in this activity: showguideview
         * Action: Slipstream.SDK.Intent.action.ACTION_VIEW
         * mime_type: vnd.juniper.net.onboarding-guide
         */
        this.onStart = function() {
            var guide = new GuideView({
                activity : this,
                context: this.getContext()
            });

            // not used for now
            var extras = this.getIntent().getExtras(),
                loadedFromHelpMenu = extras["loadedFromHelpMenu"];

            var username = localStorage.getItem("slipstream:auth_user"),
                itemKey = guide.localStorageItemKey + ":" + username;

            var dontShowAgain = localStorage.getItem(itemKey);
            if (loadedFromHelpMenu || dontShowAgain !== guide.localStorageItemValue) {
                guide.show();
            } else {
                console.log("User chose to not show this onboarding guide again last time.");
            }
        }
    };

    OnboardingGuideActivity.prototype = new Slipstream.SDK.Activity();
    OnboardingGuideActivity.prototype.constructor = OnboardingGuideActivity;
    return OnboardingGuideActivity;
});
