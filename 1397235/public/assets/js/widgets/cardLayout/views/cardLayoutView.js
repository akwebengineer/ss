/** 
 * The main card layout widget layout.  The layout defines regions into which individual card layout views are rendered.
 *
 * @module CardLayout
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'marionette',
    'text!widgets/cardLayout/templates/cardLayout.html'
],  /** @lends CardLayout*/
    function(Marionette, cardLayoutTemplate) {
    
    var CardLayout = Marionette.Layout.extend({
        "template": cardLayoutTemplate,
        "regions": {
            "subTitleRegion": ".subtitle",
            "actionRegion": ".action",
            "cardsRegion": ".cards"
        }
    });

    return CardLayout;
});