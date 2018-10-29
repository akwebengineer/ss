/**
 * A model representing a card in a result card collection.
 *
 * @module CardModel
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */

define([
    'backbone',
    'lib/dateFormatter/dateFormatter'
], /** @lends CardModel*/
function (Backbone, dateFormatter) {
    var CardModel = Backbone.Model.extend({
        initialize: function () {
            var selectable = new Backbone.Picky.Selectable(this);
            _.extend(this, selectable);
        },
        defaults: {
            "content": "Card Title",
            "disabled": false,
            "card-date": "Last updated " + dateFormatter.format(new Date(), {format: "long"})
        }
    });

    return CardModel;
});