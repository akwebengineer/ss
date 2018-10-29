/**
 * A module that enables drag and drop interaction
 *
 * @module GraphEditorBuilderDnD
 * @author Viswesh Subramanian <vissubra@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['widgets/topology/lib/constants',], function (topologyConstants) {

    /**
     * Enables drag and drop interaction on the provided container
     * @param {Object} $container
     * @constructor
     */
    var GraphDnD = function ($container) {
        $container.droppable({
            over: function (evt, el) {
                var dragEl = el.helper && el.helper[0]; //dragged element
                $(this).trigger(topologyConstants.events.internalEventOver, [dragEl]); //triggering an internal 'over' event manually as droppable plugin does not trigger 'over' event.
            }
            //including drop as droppable conf attr will trigger event twice, hence ignored. over attr required to trigger 'over' event.
        }).off(topologyConstants.events.internalEventOver).on(topologyConstants.events.internalEventOver, function (evt, dragEl) {
            $(this).trigger(topologyConstants.events.over, [dragEl]);
        }).off('drop dropout').on('drop dropout', function (evt, el) {
            var dropEl = el.helper && el.helper[0], //dropped element
                $dropContainer = $(this),
                dropElOffset = el.offset ?  el.offset : {left: 0, top: 0},
                position =  {
                    left: dropElOffset.left - $dropContainer.offset().left,
                    top: dropElOffset.top - $dropContainer.offset().top
                };

            $(this).trigger(topologyConstants.events.drop, [dropEl, position]);
        });
    };

    return GraphDnD;
});