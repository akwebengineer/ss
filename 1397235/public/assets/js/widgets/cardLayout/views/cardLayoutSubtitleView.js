/** 
 * A module that implements a view for displaying the subtitle for a card layout
 *
 * @module CardLayoutSubtitleView
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    "marionette",
    "text!widgets/cardLayout/templates/cardsSubtitle.html"
],  /** @lends CardLayoutSubtitleView*/
function(Marionette, cardSubtitle) {

    var CardLayoutSubtitleView = Marionette.ItemView.extend({
        template: cardSubtitle
    });

    return CardLayoutSubtitleView;
});