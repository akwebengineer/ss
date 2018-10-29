/**
 * A library that groups templates used by the Action Bar widget
 *
 * @module ActionBarTemplates
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define([
    'text!widgets/actionBar/templates/actionBarContainer.html',
    'text!widgets/actionBar/templates/partialButtonAction.html',
    'text!widgets/actionBar/templates/partialDropdownAction.html',
    'text!widgets/actionBar/templates/partialIconAction.html',
    'text!widgets/actionBar/templates/partialGridMenuAction.html',
    'text!widgets/actionBar/templates/partialMenuAction.html',
    'text!widgets/actionBar/templates/partialIcon.html',
    'text!widgets/actionBar/templates/subTitle.html'
], /** @lends ActionBarTemplates */
function (actionBarContainer,
          partialButtonAction,
          partialDropdownAction,
          partialIconAction,
          partialGridMenuAction,
          partialMenuAction,
          partialIcon,
          subTitle) {

    /*
     * ActionBarTemplates constructor
     *
     * @constructor
     * @class ActionBarTemplates
     */
    var ActionBarTemplates = function () {

        /**
         * Provides main template used by the action bar widget to create elements of the action bar.
         */
        this.getMainTemplate = function () {
            return actionBarContainer;
        };

        /**
         * Provides partial templates used by the action bar widget to create elements of the action bar.
         */
        this.getPartialTemplates = function () {
            return {
                "partialButtonAction": partialButtonAction,
                "partialDropdownAction": partialDropdownAction, //to be implemented
                "partialIconAction": partialIconAction,
                "partialGridMenuAction": partialGridMenuAction,
                "partialMenuAction": partialMenuAction,
                "partialIcon": partialIcon,
                "subTitle": subTitle
            }
        };

    };

    return ActionBarTemplates;
});
