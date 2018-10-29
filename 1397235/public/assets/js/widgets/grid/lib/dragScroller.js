/**
 * This module implements a class that can be used to manage the scrolling
 * of a droppable container when a draggable is dragged over it.
 *
 * @module DragScroller
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define(function() {
    /**
     * Create an object that will scroll a droppable while a draggable is being dragged.
     *
     * @param {Object} draggable - The draggable that will cause the scroller to scroll a droppable.
     * @param {Object} options - Options for the scroller
     * @param {Integer} options.positionTolerance - The number of pixels between the mouse position
     * and a boundary of the droppable within which scrolling will be activated.
     * @param {Integer} options.scrollIncrement - The number of pixels that the scroller will move the 
     * scroll position on each scroll operation.
     */
    function DragScroller(draggable, options) {
        var workerInterval = 50;  // ms
        var scrollLeftWorker, scrollRightWorker, scrollTopWorker, scrollBottomWorker;

        var defaultOptions = {
            positionTolerance: 20,
            scrollIncrement: 10
        };

        var scrollOptions = _.extend(defaultOptions, options);

        // private

        /**
         * Determine if the droppable should be scrolled left
         *
         * @param {Object} mouseOffset - The offset object representing the current mouse position.
         * @param {Object} droppableOffset - The offset object representing the droppable position.
         *
         * @return true if the droppable should be scrolled left, false otherwise.
         */
        function shouldScrollLeft(mouseOffset, droppableOffset) {
            return ((mouseOffset.mouseX - droppableOffset.left) <= scrollOptions.positionTolerance) &&
                   (mouseOffset.mouseX > droppableOffset.left);
        }

        /**
         * Determine if the droppable should be scrolled right
         *
         * @param {Object} mouseOffset - The offset object representing the current mouse position.
         * @param {Object} droppableOffset - The offset object representing the droppable position.
         *
         * @return true if the droppable should be scrolled right, false otherwise.
         */
        function shouldScrollRight(mouseOffset, droppableOffset) {
            return (mouseOffset.mouseX >= (droppableOffset.right - scrollOptions.positionTolerance)) &&
                   (mouseOffset.mouseX < droppableOffset.right);
        }

        /**
         * Determine if the droppable should be scrolled towards the top
         *
         * @param {Object} mouseOffset - The offset object representing the current mouse position.
         * @param {Object} droppableOffset - The offset object representing the droppable position.
         *
         * @return true if the droppable should be scrolled towards the top, false otherwise.
         */
        function shouldScrollTop(mouseOffset, droppableOffset) {
            return ((mouseOffset.mouseY - droppableOffset.top) <= scrollOptions.positionTolerance) &&
                   (mouseOffset.mouseY > droppableOffset.top);
        }

        /**
         * Determine if the droppable should be scrolled towards the bottom
         *
         * @param {Object} mouseOffset - The offset object representing the current mouse position.
         * @param {Object} droppableOffset - The offset object representing the droppable position.
         *
         * @return true if the droppable should be scrolled towards the bottom, false otherwise.
         */
        function shouldScrollBottom(mouseOffset, droppableOffset) {
            return (mouseOffset.mouseY >= (droppableOffset.bottom - scrollOptions.positionTolerance)) &&
                   (mouseOffset.mouseY < droppableOffset.bottom);
        }

        /**
         * Stop the workers handling the scrolling operations
         */
        function stopScrollWorkers() {
            clearInterval(scrollLeftWorker);
            clearInterval(scrollRightWorker);
            clearInterval(scrollTopWorker);
            clearInterval(scrollBottomWorker);
        }

        // public

        /**
         * Handle a potential scroll operation
         *
         * @param {Object} mouseOffset - The offset object representing the current mouse position.
         */
        this.scroll = function(mouseOffset) {
            // Extract the current droppable from the draggable
            var droppable = draggable.data("__slipstream_dnd_droppable"); 

            if (droppable) {
                droppableOffset = droppable.offset();
                droppableOffset.right = droppableOffset.left + droppable.width();
                droppableOffset.bottom = droppableOffset.top + droppable.height();

                stopScrollWorkers();

                if (shouldScrollLeft(mouseOffset, droppableOffset)) {
                    scrollLeftWorker = setInterval(function() {
                        droppable.scrollLeft(droppable.scrollLeft() - scrollOptions.scrollIncrement);
                    }, workerInterval);
                }

                if (shouldScrollRight(mouseOffset, droppableOffset)) { 
                    scrollRightWorker = setInterval(function() { 
                        droppable.scrollLeft(droppable.scrollLeft() + scrollOptions.scrollIncrement)
                    }, workerInterval);
                }
                
                if (shouldScrollTop(mouseOffset, droppableOffset)) {
                    scrollTopWorker = setInterval(function() {
                        droppable.scrollTop(droppable.scrollTop() - scrollOptions.scrollIncrement)
                    }, workerInterval);                   
                }                          
                
                if (shouldScrollBottom(mouseOffset, droppableOffset)) {
                    scrollBottomWorker = setInterval(function(){
                        droppable.scrollTop(droppable.scrollTop() + scrollOptions.scrollIncrement)
                    }, workerInterval);
                } 
            }
        }

        /**
         * Stop any active scrolling operation being performed by this scroller.
         */
        this.stop = function() {
            stopScrollWorkers();
        }
    }

    return DragScroller;
});

