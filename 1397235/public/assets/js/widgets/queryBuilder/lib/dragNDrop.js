/**
 * A module that uses jQuery draggable and Droppable API's to implement search drag drop feature
 *
 * @module DragNDrop
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */

define(['widgets/queryBuilder/util/cursorPosition',
    'widgets/queryBuilder/util/queryBuilderUtil'
], function (CursorPosition, QueryBuilderUtil) {

    var DragNDrop = function (conf) {

        var $filterBar = conf.container,
            dragNDrop = conf.dragNDrop,
            model = conf.model,
            reqres = conf.reqres;
        var cursorPosition, queryBuilderUtil;

        /**
         * Method to attach jquery droppable to the filter bar
         * @inner
         */
        var instantiateDroppable = function () {
            $filterBar.droppable({
                over: function (event, ui) {
                    if (_.isFunction(dragNDrop.over)) {
                        dragNDrop.over(event, ui); // callback to get the dragged data
                    }
                },
                drop: function (event, ui) {
                    var droppedObj;
                    if (_.isFunction(dragNDrop.drop)) {
                        droppedObj = dragNDrop.drop(event, ui); // callback to get the dragged data
                    }
                    insertDroppedSearch({"data": droppedObj.data});

                    console.log("dragged search input: " + JSON.stringify(droppedObj));
                },
                tolerance: 'pointer'
            });
        };

        /**
         * method to add the dropped data in the existing query of filter bar
         * @inner
         */
        var insertDroppedSearch = function (dropObj) {
            if (!_.isEmpty(dropObj.data)) {
                // code to add the search data in the filter bar
                model.add({"data": dropObj.data});
                setCursorPosition();
            }
        };

        /**
         * Adjust cursor position based on new formulated query
         * @inner
         */
        var setCursorPosition = function () {
            //Calculate the new cursor position
            var calculateNewCursorPosition = function () {
                var parserObject = reqres.request("parser.parsedObj").parsedObj; // Get the latest parsed object to get the model
                var formattedQuery = queryBuilderUtil.constructQuery(parserObject.model); // this will return formatted query along with all the space serialization
                return formattedQuery.length;
            };

            cursorPosition.setCursorPosition(calculateNewCursorPosition()); // adjust the cursor position in filter bar
        };

        /**
         * Initialize the methods and classes
         * @inner
         */
        var initialize = function () {
            cursorPosition = new CursorPosition($filterBar);
            queryBuilderUtil = new QueryBuilderUtil();
            instantiateDroppable();
        };

        initialize();

    };
    return DragNDrop;
});
