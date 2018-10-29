# Grid Widget


## Introduction
The Grid widget is a reusable graphical user interface that allows users to get a grid or table from a configuration object that includes the url where the data will be extracted.

## API
The Grid widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


## Configuration
The configuration object can include the following variables:

-  container: define the container where the widget will be rendered, required field,
-  elements: define the parameters required to build the widget required field,
-  actionEvents: define the custom events that will be triggered when one of the defined action is completed,
-  cellOverlayViews: define the views that will be attached to an overlay when a cell is edited,
-  cellTooltip: define the tooltip that will be rendered when an element (cell or item on a cell) includes a data-tooltip attribute,
-  onConfigUpdate: define the callback that the grid widget will invoke any time an update on the user preferences happen like a resize of a column, show or hide of a column, sort of a column, or adding a filter to the grid,
-  sid: A globally unique static id that identifies the instance of the grid widget being defined by this configuration object.
-  preferences: An object that contains grid configuration related to preferences

For example:

```
    var grid = new gridWidget({
        "container": this.el,
        "elements": configurationSample,
        "actionEvents": this.actionEvents,
        "cellOverlayViews": this.cellOverlayViews,
        "cellTooltip": this.cellTooltip,
        "onConfigUpdate": this.onConfigUpdate,
        "preferences" : {
            "override": ["search", "elements.sorting"]
        }
    });
```

### container
Represents the HTML node where the Grid widget will be appended.

### elements
Represents the group of parameters required to define the grid data, columns, validation, customSortCallback and context menu. It should be defined in a JSON object and might have the following parameters:

**title**
Adds a title to the grid.

**title-help**
Adds a tooltip text next to the title of the grid. It has two parameters: content and ua-help-identifier

- ***content***
Defines the content of the tooltip.

- ***ua-help***
Adds an alias for user assistance event binding.

**tableId**
Adds and id to the grid.

**height**
Defines the height of the grid. It could be a fixed, a percentage or an auto height:
- For fixed height, the number of pixels should be provided.
- For percentage, the value of the height should be defined as a percentage; for example: "50%". It allows to define the grid widget height as a percentage of the grid container; for example, for a grid height with a value of 50%, the grid widget will take only 50% of the available grid container height and it will be responsive to any browser resize. In this case, the grid container and its parent should have a height that is available in pixels before the grid is rendered. To achieve a grid container height in pixels, even before the content is available, the grid container should have a height that is inherit (height CSS property) or a 100% height and the body of the page should have been set to 100% height.
- For an auto height, the string "auto" should be used, and it will allow auto adjust the height of the grid to the available height in the page. It is recommended for grids on a page, while grids on a overlay should use a fixed height or provide the max-height CSS for the grid container.

In the case of percentage or auto height, if the grid container is resized, then the grid height will be automatically adjusted to fit the new area. For example, if a container like the following:

```
<div class="responsive-height">
    <div class="slipstream-content-title">Grid Sample Page</div>
    <div class="showHide"></div>
</div>
```

is used to build a grid (container parameter of the grid configuration will be the DOM with responsive-height class), then the grid is appended at the end of the container (after the container with showHide class). The grid configuration would look like:

```
 new GridWidget({
     container: this.el.find('.responsive-height')[0],
     elements: configurationSample.simpleGridAdvancedFilter,
     actionEvents:this.actionEvents
 });
```

 Therefore, if showHide container has a toggle state where the container height increases or decreases, then the grid height will be responsive to the new container height and will expand or decrease its height accordingly.

**footer**
Shows the footer on the grid.  It is a boolean value - true or false; Defaults to true.

The footer can also be specified as an object that defines a callback method named getTotalRows.  This would be the only case when the footer should be defined as an object rather than a boolean value - to define the getTotalRows callback function.

***getTotalRows***
An optional callback method that will be used to set the total number of rows in the grid footer.  This should be specified when the 'url' property is not specified to populate the grid.  Instead the client uses the addPageRows method on the grid to populate.  The getTotalRows should be specified within the footer object.

**hideRowCount**
Defines whether or not the total row count is displayed in the footer. Accepts boolean - true / false. When no configuration is provided, this defaults to false.

**hideSelectionAndRowCount**
Defines whether or not the selected and total row count is displayed in the footer. Accepts boolean - true / false. When no configuration is provided, this defaults to false.


```
"footer" : {
    "getTotalRows" : function() {
        if(self.policyCollection.models.length > 0) {
            var model = self.policyCollection.models[0];
            return model.get('policy').length;
        }
        return 0;
    },
    hideRowCount: false,
    hideSelectionAndRowCount: false
}
```

```
"footer" : {
    hideRowCount: true,
    hideSelectionAndRowCount: false
}
```

**showSelection**
Defines whether selection container is added to the grid header or not. This can either be an object or a boolean. This parameter is optional. If it is not set, the selection container will be added to the grid header by default. If the parameter is set to false, then the button won't be added.

If this parameter is assigned to an object which has 'setTooltipContent' callback, it will show tooltip on hovering over the 'selection' container. The content for the tooltip should be provided from the assigned callback function.

The callback expects either a string, HTML or a backbone view to render in tooltip widget. It provides the currentSelection and renderTooltip parameter. renderTooltip is a callback that should be invoked to provide the view to be showed in the tooltip. currentSelection is the current selected rows object with dom elements, selectedRowIds, selectedRows and other parameters. User of the grid widget can use this variable to know which rows are selected.
(currentSelection will have the same object as the result of executing the exposed method: getSelectedRows(true)).

```
var tooltipConfig = {
    setTooltipContent: function(currentSelection, renderTooltip){
        var tooltipView = new SampleTooltipView(currentSelection);
        renderTooltip(tooltipView);
    }
};

var gridConfig = {
    ...
    "showSelection": tooltipConfig
    ...
}
```

User of the grid widget can also provide other tooltip configuration supported by framework's tooltip widget with this object.

Example,

```
var tooltipConfig = {
    setTooltipContent: function(currentSelection, renderTooltip){
        renderTooltip(' sample tooltip string');
    },
    minWidth: 100,
    maxWidth: 300
};

var gridConfig = {
    ...
    "showSelection": tooltipConfig
    ...
}
```

Note: If footer parameter is set to false, then the 'selection' button won't be displayed in grid header.

**refresh**
Defines whether or not manual refresh capabilities are added to the grid.  This is either a boolean or an object.  If an object then the following optional attributes can be specified:

- ***onRefresh***
A no-argument callback function that is invoked whenever a manual refresh operation is performed.  If this is omitted, the grid's default refresh method will be invoked.

- ***tooltipText***
Customized tooltip text that will be associated with the manual refresh control.  A default tooltip will be provided if this is omitted.

If a boolean with the value *true*,  the grid's default refresh method will be invoked to refresh the grid.

**url**
Indicates where to get the data for the grid. It should provide the API that will be called to get the rows to be shown in the grid. If it is absent, the grid will attempt to get data from the data property (array of objects). If both of the parameters are absent, an empty grid will be rendered. In case of an empty grid, the rows can be added using the addPageRows method of the grid.

**getData**
*DEPRECATED* Please, use url or data options instead.
Represents a callback function that is used to retrieve data instead of providing a url (url parameter). For example, the following function could be added instead of the url parameter.

```
var getData = function (postdata){
        var self = this;
        $.ajax({
            url: '/api/get-data',
            data: postdata,
            dataType:"json",
            complete: function(data,status){
                $(self).addRowData('',data.responseJSON['policy-Level1']['policy-Level2']['policy-Level3']);
            }
        });
    };
```

In this case, the function is taking care of retrieving the data from an API instead of delegating that job to the grid. In this case, the grid configuration should be:

 ```
  configurationSample.simpleGrid = {
         "title": "Firewall Policies",
         "getData": getData,
         "height": 'auto',
         ...
  }
 ```

**data**
Provide an array that stores the local data. Only use when the data is local and it is NO infinite scrolling. Note: only simple grid supports this attribute.

**getPageData**
Define the callback for the collection data use case - when there is no url, getData, data in the configuration.

Note: only support for simpleGrid and treeGrid.

Callback gets invoked in the following scenario.
1. When the grid is ready to load data
2. When the grid is going to load the next page
3. When the grid is filtered

This callback passes following parameters:
1. renderGridPage: (Function) the method to render the grid page
2. page: (Array) the page number that needs to be loaded
3. searchTokens: (Array) current searchTokens 
4. pageSize: (String) the number of the rows on a page

```
"getPageData": function(renderGridPage, page, searchTokens, pageSize){
    var pageCollection = (searchTokens && searchTokens.length > 0) ? self.filteredPolicyCollection : self.policyCollection;
    page.forEach(function (pageRequest) {
        pageCollection["page" + pageRequest].fetch({
            success: function (collection) {
                var policies = collection.models[0].get("policy"),
                    totalRecords = policies && policies[0] && policies[0]['junos:total'] || policies.length;
                renderGridPage(policies, {
                    numberOfPage: pageRequest,
                    totalPages: 2,
                    totalRecords: totalRecords
                });
            },
            failure: function () {
                console.log("The grid data couldn't be loaded.");
            }
        });
    });
}
```

**urlMethod**
Defines the HTTP method to use for the request (for example: "POST", "GET", "PUT"). If the parameter is absent, then the default value is "GET".

**beforeSendRequest**
Callback that gets invoked before requesting any data. It provides the current URL string as a parameter. The expected output is the original URL or an updated URL. The new url will be used during all the grid operations like sorting or new page request (virtual scrolling). It is recommended to use this method instead the before the beforeSend method of ajaxOption since selection and sorting would not work properly due to conflicts with the grid library.

**reformatUrl**
Defines a callback that will be called to overwrite the final URL request sent to the server for GET method. The output should be an Object. The input parameter is the originalUrl object with all the parameters that will be sent in the URL request. If filter parameter is enabled, searchUrl provides a similar access to the original URL, but it only targets the tokens to be filtered before they are formatted in the grid URL standard. reformatUrl provides the parameters that will be sent to the server including the ones that have been formatter during the grid filtering. For example, the reformatUrl callback could be the following:

```
 var reformatUrl = function (originalUrl) {
        if (originalUrl.sord){
            var sord = originalUrl.sord;
            delete originalUrl.sord;
            originalUrl.sOrd = sord;
        }
        originalUrl.test = "123";
        return originalUrl;
    };
```

**postData**
Allows to add data in the body of the URL POST request. The data will be available together with the grid internal data like paging, sorting, searching, etc. For example, an extract of the grid configuration (elements parameter) could be:

```
    "urlMethod": "POST",
    "postData": {
        "value1": "valuePostData1",
        "value2": "valuePostData2"
    },
```

If postData is defined as a function, then postData will be used as a callback that will allow to overwrite the default post data provided by the grid in cases like loading, sorting or searching data.

**reformatData**
Reformat the response data after the grid invokes the URL provided in the configuration. This callback method will be useful when the response data is expected to have some attributes (like in the tree grid) but it is not available in the original response. In this case, the data could be updated and the callback should return the updated data . For example:

```
    var reformatData = function (data) {
        var originalData = data.ruleCollection.rules;
        originalData[0].name = "Zone";
       originalData[0].ruleLevel = 0;
        return data;
    };
```

**numberOfRows**
Defines the number of rows that will be requested from the API to show the next set of rows for virtual scrolling (pagination). The height needs to be set (in pixels or "auto") and the scroll has to be set to true. If the height is auto, then the grid needs to load a predefined number of rows to make sure the grid can use the available space for a page. The predefined number of rows is 50. Any number of rows equal or above 50 is kept, a value less than 50 is defaulted to 50 (unless autoPageSize is set to false).

 **autoPageSize**
It is a boolean that if it is set to false, the original numberOfRows is always kept and the number of rows loaded per page in a grid won't default to 50 for numberOfRows < 50. A small number of rows loaded in a grid should not be used with auto height because the grid won't be able to optimize its height.

**multiselect**
Defines a grid with multiple selection of the rows when it is set to true.

**singleselect**
Defines a grid with single selection of the rows when it is set to true.

**jsonRoot**
Defines where the data begins in the JSON response. For example:

```
var conf = {
 ...
 "jsonRoot": "jobs.job",
 ...
}
```

**jsonRecords**
Defines a function that returns the number of records that an API response could have.  For example:

```
var conf = {
 ...
 "jsonRecords": function(data) {
     return data.jobs['@total'];
 },
 ...
}
```

**jsonId**
Defines the unique id of the row.

**noResultMessage**
Defines a custom message that will be shown in the grid, if no records are available. This accepts a string value or a Slipstream view or html template or callback function that should either return string value or a Slipstream view or html template.
In the first type of no results grid, The NoResultMessage includes a title option indicating the title for the default message that shows up in the grid, description indicates the small font-sized text under the title and buttons indicate the actions which can be taken to populate the grid.


*Example 1*

```
var conf = {
                "title": "Grid Sample Page To Demonstrate Empty Grid State",
                "subTitle": "Example 1: SIMPLE Grid that displays default message when there exists no users",
                "url": "/api/get-no-data",
                "noResultMessage":
                    {
                        "title":"No users added yet.",
                        "description":"Users you add here will have access to the device via CLI. You can assign<br/>appropriate roles (and choose authentication method below) for users you add here<br/> <a href='#'>Learn more...</a>",
                        "buttons":[{
                            "key": "addRecord",
                            "id": "addRecord",
                            "value": "Add Record",
                            "isInactive": true
                        },{
                            "key": "addUser1",
                            "value": "Add User"
                        }]
                    }
            };

```

NoResultMessage in the above case can have following attributes:
-title : *Optional* To set a title in the no data message
-description : *Optional* To set a decription to the title in the no data message
-buttons : *Optional* To add action buttons to the no data message
    --key : *Required* To add a key to be used as id if id attribute is not defined and to be used for executing RBAC capabilities
    --id : *Optional* To define an id to the button. If not defined, then key will be used as id
    --value : *Required* To give a display name to the button
    --inactive : *Optiona* To activate/deactivate button. If true, then button will be deactivated. If false, then button will be activated. By default it is set to false.


*Example 2*

```
var conf = {
 ...
 //noResultMessage:"No data available",
 "noResultMessage": function() {
     return "No data available";
 },
 ...
}
```


*Example 3*

```
var conf = {
 ...
 //noResultMessage:"No data available",
 "noResultMessage": new NoResultsMessageView(),
 ...
}
```

*Example 4*

```
var conf = {
 ...
 //noResultMessage:"No data available",
 "noResultMessage": "<span> NO data available </span>",
 ...
}

```

**orderable**
Defines if the columns can be reordered by drag-and-drop column header. Default: true
Note: tree grid, group grid and nested grid can't use this feature

**enabledRowInteraction**
Defines a callback that will be invoked when a row is rendered. It allows to limit the user interaction of a row by removing the row selection, context menu, row menu on hover, row edition and drag and drop capabilities that are defined for other rows in the grid. If the callback returns true, then the row has limited user interaction; if the callback returns false, then the row has the default user interactions defined for other rows in the grid. The input parameters are rowId (id of the row) and rowData (data of the row). For example, a grid configuration that include the enabledRowInteraction property should be defined as:

```
var gridConfiguration = {
    ...
    "multiselect": true,
    "enabledRowInteraction": function (rowId, rowData) {
        if (rowId == "123") { //only a row with id "123" has limited user interaction
            console.log(rowData);
            return false;
        }
        return true;
    },
    "scroll": true,
    ...
}
```

When a grid uses enabledRowInteraction and the selectAll checkbox is enabled, then onSelectAll callback must be implemented. onSelectAll needs to be provide ONLY the id of the rows that have interaction enabled.

**onSelectAll**
Defines a callback that will be invoked when a user click on the select all checkbox of the grid. The parameters that are passed are setIdsSuccess and setIdsErrors, tokens, parameters. setIdsSuccess is a callback that needs to be invoked with an array of all the row ids available in the grid (row ids for all pages). setIdsError is the error message that should be passed in case the row ids request results on an error.tokens parameter is an array with all the tokens or filters applied to the grid. parameters is an object with all the parameters applied to the current API request. Once the user enables the selects all checkbox, all row ids will be returned in the selectedRows parameter of the event handler as an array. If the user deselects some rows, then the unselected rows will be removed from the original row id array. If the user deselect the select all checkbox, then the selected rows will be zero. For example:

 ```
     var getRowIds = function (setIdsSuccess, setIdsError, tokens, parameters) {
         $.ajax({
             type: 'GET',
             url: '/assets/js/widgets/grid/tests/dataSample/allSDServicesIds.json',
             success: function(data) {
                 setIdsSuccess(data);
             },
             error: function() {
                 setIdsError("Getting all row ids in the grid FAILED.");
             }
         });
     };

 ```

 Additionally, the gridOnSelectAll event is available. When the selectAll of the grid is selected, then the event status is set to true; when the select all checkbox is clicked again, so the deselect all rows happen, then the status is set to false. The user of the grid widget could listen for the gridOnSelectAll event and expect the status parameter in the handler updated properly:

 ```
 this.$el.bind("gridOnSelectAll", function(e, status){
    console.log("gridOnSelectAll status: " + status);
 });
 ```

**onSelectRowRange**
Defines a callback that will be invoked when a user clicks on a range of checkboxes through shift + click interaction. The callback returns rowIds in range and its critical that the returned row id range honor provided sort order. The parameters passed to the function are setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, start, limit. setIdsInRangeSuccess is a callback that needs to be invoked with an array of all the row ids available within the specified range (row ids between startRange and EndRange). setIdsInRangeError is the error message that should be passed in case the row ids request results on an error. tokens is an array with all the tokens or filters applied to the grid. parameters is an object with all the parameters applied to the current API request. The user of the widget needs to refresh the grid after filtering, expanding/collapsing children of a row in case of tree grid, adding or deleting a row for the start index and limit to be correct in case of virtual scrolling or pagination. Also, user of the widget needs to make sure that each row has a unique id.

Note1: This feature is NOT supported for Group Grid, Nested Grid, and Tree Grid with preselection.

Note2: Only Simple Grid with local data will enable shift + selection feature by default. This callback needs to be added in order to turn on the shift + selection feature in other grids, such as Simple Grid with infinite scroll and Tree Grid.

Note3: Tree Grid with pagination doesn't support shift + selection cross pages. In other words, shift + selection only works on the same page for the Tree Grid with pagination.

For example:

 ```
     var getRowIdsInRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, start, limit) {
         $.ajax({
             type: 'GET',
             url: '/api/juniper/sd/service-management/services',
             success: function(data) {
                 setIdsInRangeSuccess(data); //data - row ids within startRange and EndRange.
             },
             error: function() {
                 setIdsInRangeError("Getting range of row ids FAILED.");
             }
         });
     };

 ```

**sorting**
Defines the sorting of the grid. The sorting parameter (sortby) will be appended to the grid url and it will be requested to the server. If virual scrolling is enabled, each url request will include the sortby parameter.

Note: local grid does not support multiple sorting, so it can only take one sorting parameter. If there are multiple sorting parameters, grid widget only uses the first one.

The value of sorting parameter should be an array and each element is an object with two parameters:

- ***column***
Defines the id of the column that will be used to sort the table by default.

- ***order***
Defines the type of sort that the table will have for its column parameter. It can be: asc (ascendant) or desc (descendant). If the parameter is not defined, it will be set to asc.

For example:

```
"sorting": [{
        "column":"id",
        "order": "asc" //asc,desc
    },{
        "column":"percent-complete",
        "order":"desc"
}],
```

In case the sorting feature of the grid needs to be disabled for all the columns, then the sorting parameter should be set to false. For example:

```
"sorting" false
```

By default, sorting in all columns of the grid is enabled.

If only individual columns needs to have the sorting option disabled, then in the column configuration, for the columns parameter, add to the column configuration the parameter sortable and set it to false. The default value is true. For example:

```
{
    var configurationSample = {
          "title": "Recent Logs",
          ...
          "sorting": [{
                      "column":"name",
                      "order": "asc"
                  }],
          "columns": [
                       {
                            "name": "name",
                            ...
                        },{
                            "name": "invdate",
                            "label": "Date",
                            "sortable": false
                        }, {
                       ...
              }]
      };
}
```

**customSortCallback**
Defines the callback that will be called when a sortable column is clicked. The callback will provided with 3 parameters - index, name and sortorder. To be used with datatype = local ONLY.

  Raised immediately after sortable column is clicked and before sorting the data.
  index is the index from colModel,
  name is the name from colModel,
  sortOrder is the new sorting order - can be 'asc' or 'desc',
  tokens are the user provided search input parameters.

```
{
    var configurationSample = {
          "title": "Recent Logs",
          ...
          "sorting": [{
                      "column":"name",
                      "order": "asc"
                  }],
          customSortCallback: function(columnIndex, columnName, sortOrder, tokens){
                    console.log('Sorting grid in ' + sortOrder + ' order on ' + columnName);
                    //perform custom sort
                    ......
                    //call gridWidget.reloadGridData
                    ......
                  }
      };
}
```


**grouping**
Defines the parameters required to group data in the grid. The data can be grouped by one column or multiple columns. It has the following parameters:

- ***column***
Defines the id of the column that will be used to group the table.

- ***order***
Defines the type of sort that the table will have for the column parameter. It can be: asc (ascendant) or desc (descendant). If the parameter is not defined, it will be set to asc.

- ***show***
Allows to hide the column used to group the data. True will keep the column and false will hide it. If it's not available, it will default to true (show).

- ***text***
Defines text that will be showed for the row that has the data is grouped. If it's not available, it will default to the value of the column. For example for the parameter:

```
"grouping":{
            "columns":[{
                "column":"id",
                "order": "desc", //asc,desc
                "show": true
                "text": "Id: <b>{0}</b>"
            },{
                "column":"job-status",
                "order": "desc",
                "show": false,
                "text": "Status: <b>{0}</b>"
            }],
            "collapse":false
        },
```

the grouping of the job-status will be shown as:  "Status: SUCCESS".

- ***collapse***
Allows to collapse all grouping of the data if it is set to true or expand it all if it is set to false.

- ***order***
Defines the type of sort that the table will have for the column parameter. It can be: asc (ascendant) or desc (descendant).


**tree**
Defines the parameters required to show data as a tree. The data is arranged in a hierarchical grid view and can be composed by parent or groups and leafs. It uses the adjacency model in which each item in the table contains a pointer to its parent. Data in a tree grid can be provided using the url property from the elements configuration or it can be added later using the addPageRows method as explained later in this section.

tree property has the following parameters:

- ***column***
Represents the name of the attribute in the data that will be used to group the rows in the grid.

- ***level***
Represents the name of the attribute in the data that defines the depth of the row in the tree hierarchy. For example, a level with value 0 can represent the root of the tree, while a level with value 1 represents a children of the root. If the level parameter is not defined, the default column name for this parameter will be "level".

- ***parent***
Represents the name of the attribute in the data that defines the id of the parent of the row. The id of the row is defined by the jsonId parameter; if jsonId is absent, it will default to id. If the parent parameter is not defined, the default column name for this parameter will be "parent".

- ***leaf***
Represents the name of the attribute in the data that defines if the row is the final node (leaf) or if the row is a group (parent). The value of the data will be true for a leaf or false for a non leaf (a row with children). If the leaf parameter is not defined, the default column name for this parameter will be "leaf".

- ***initialLevelExpanded***
Defines how far the tree view will be expanded. The value is an integer, and if it is zero, then all the groups at level zero (or root) will be expanded. If the value is one, then the root and its children will be expanded but the children of the children will be collapsed and so on. If it the parameter is absent, all children will be collapsed.

When the grid is rendered for the first time, the grid sends a request to the url parameter with the expanded parameter appended. The API response is expected to contain the data related to the root row(s) and the data related to all the children that should be showed expanded.

Next, when a group is expanded, the grid sends a request to the original grid url and adds the following parameters:
- nodeid: id of the node
- parentid: id of the parent. Note: if it is the first level, the parent id should be null.
- n_level: level of depth of the node
The response is expected to have only the data related to the children of the requested node.

For example, the tree configuration could be:

```
    "tree": {
        "column": "name",
        "level": "ruleLevel",
        "parent": "parent",
        "leaf": "leaf"
    },
```

- ***parentSelect***
Defines if the parent will be selectable (true). If the parameter is absent or is set to false, then all rows (children and node) will be selectable.

- ***getChildren***
Defines a callback that allows adding children to a node. If the callback is defined, the data for tree grid is requested using the API provided in the URL parameter, and it only happens when the grid is rendered for the first time. After that, the original mechanism of requesting deeper level of children by automatically sending a request to the API defined in the url parameter (plus the additional tree parameters) is suspended. New children can only be added using the getChildren callback. It has the node and addChildren parameters. node provides the expanded, nodeId and parentId as described in previous sections. addChildren is a callback function that should be used to add the children. It accepts the parameter nodeId (node that will have the children added) and data (an array with all the children that will be added. For example, the getChildren callback could be defined like:

```
    var getChildren = function (node, addChildren) {
        var data = 'expanded=' + node.expanded + '&nodeid=' + node.nodeId + '&parentid=' + node.parentId + '&n_level=' + node.n_level;
        console.log(data);
        $.ajax({
            type: 'GET',
            url: "/api/get-tree",
            data: data,
            success: function(data) {
                addChildren(node.nodeId, data.ruleCollection.rules);
            }
        });
    };
```

- ***preselection***
Defines if the selection of a row in a tree grid will follow a preselection model when it is set to true. In this model, if a child is selected, the parent gets selected by default. If a child gets unselected and all its siblings are unselected, then the parent gets unselected. If a parent gets selected, then all its children get selected.


*ADD A PAGE PROGRAMMATICALLY IN A TREE GRID*
Grid data can be provided from a model or from some other local storage. In this case, url (elements Object) should NOT be defined. Instead, once the grid is built and the data is available (for example, using a collection), the addPageRows method should be called to add the rows. If the tree grid does not have pagination, then binding to "gridLoaded" event will allow to know if the grid is ready to add data. For pagination, when a new page is requested, then the "slipstreamGrid.pagination:pageLoaded" event will be triggered with the page number (page property) and page size (pageSize property). addPageRows method can be invoked to add the rows for a page in both cases. addPageRows takes two parameters: data (array of row data) and an Object with numberOfPage, totalPages and totalRecords. For example, to add rows to a page in the grid:

```
treeGridCollection.fetch({ //treeGridCollection represents a local storage
    success: function (collection) {
        gridWidgetInstance.addPageRows(collection, {
            numberOfPage: paginationData.page, //paginationData is provided when the "slipstreamGrid.pagination:pageLoaded" event is triggered
            totalPages: numberOfPages,
            totalRecords: totalRecords
        });
    },
    failure: function () {
        console.log("The grid data couldn't be loaded.");
    }
});
```

**createRow**
Defines how the creation of a row will be showed in the grid:  inline, using an overlay with a form or wizard, defined by the user of the widget, or a view rendered in a container that is also defined by the user of the widget. It has the attributes: showInline, addLast and onCreate.

- showInline will show the new row in an inline edition mode. If this attribute is not set to true, the grid widget will assume the new row will be added using a form showed in an overlay or other type of view.

- addLast will indicate that the row to be added (for inline editing) will be added at the end of the table. If the parameter is not set to true, the grid widget will assume the row needs to be added at the beginning of the row. For example:

```
    "createRow": {
        "addLast":true,
        "showInline": true
    },
```

- onCreate is a function callback that is invoked when the add button is clicked and allows the user of the widget to render the new row view in a container outside the grid. It has the parameters: layoutOptions, rowData and success. layoutOptions is an object that includes gridHeader (jQuery object with the header of the grid), columns (array of Objects with the label, name and width for each column) and columnOffset (number of pixels the first row in the grid header starts horizontally with respect to the grid container). rowData is an Object with the defaultRow property which provides the default values for each column and provided in the grid configuration. success id is a function that should be invoked with the value of new row so the row gets added to the grid.

**editRow**
Defines the edition of a row: either inline or using an overlay. It has the attributes: showInline, isRowEditable and onEdit. If showInline parameter (in the editRow parameter) is set to true, then the edition will happen inline to the row. If the editRow parameter is not set, then edition of the row will happen according to the user defined configuration: on an overlay or on a short wizard.
Additionally, in case of inline editing, the isRowEditable parameter could be added. It is a callback function that allows to define if a row should be editable or not. The input parameter are the id of the row as defined by the jsonId parameter, the original data (raw data) and the row data. The expected output is a boolean. True if the row is editable and false otherwise. For example:

```
    "editRow": {
        "showInline": true,
        "isRowEditable": isRowEditable
    },
```
Once the row is enabled for inline editing, some condition might need to be tested just before the row enters edit mode. In this case, onBeforeEdit callback is available. The input parameter is the id of the row as defined by the jsonId parameter, the original data (raw data), the row data and the isTreeParentRow (boolean only available for the tree grid that indicates the row is a parent -true- or leaf -false-). The expected output is a boolean. True if the row is editable and false otherwise. For example:

```
    "editRow": {
        "showInline": true,
        "isRowEditable": isRowEditable,
        "onBeforeEdit": onBeforeEdit
    },
```

Optionally, onBeforeEdit could return a hash with all the columns that will be (true) or will not be editable (false)for a specific row. By default, all columns that were defined as editable will stay editable (true) unless onBeforeEdit makes it only readable (false) for some row or all rows. For example, if the action column was defined as editable, but if the return value for onBefore callback has a hash with the action property set to false, then when a row is edited, action column will not be editable.

For example, onBeforeEdit callback implementation could be the following:

```javascript
    var onBeforeEdit: function (rowId, rawData, rowData, isTreeParentRow) {
        if (rowId == 0) {
            return false;
        } else if (isTreeParentRow) {
            return { //disable some cells for editing
                "sourceAddress.addresses": false,
                "application-services": false,
                "applications": false,
                "action": false
            };
        }
        return true;
    };
```

- onEdit is a function callback that is invoked when the edit button is clicked and allows the user of the widget to edit a row view in a container outside the grid. It has the parameters: layoutOptions, rowData and success. layoutOptions is an object that includes gridHeader (jQuery object with the header of the grid), columns (array of Objects with the label, name and width for each column) and columnOffset (number of pixels the first row in the grid header starts horizontally with respect to the grid container). rowData is an Object with the rowId (id of the selected row), originalRow (data of the row) and originalData (raw data of the row). success id is a function that should be invoked with the value of new row so the row gets added to the grid.

**deleteRow**
Defines the options available on row deletion like the message that will be showed when a row is deleted, if the grid should be automatically refreshed when the user confirms row deletion and the callback that should be invoked before the row is deleted from the grid. deleteRow property has three optional properties: message, onDelete and autoRefresh. message is a callback that should return a string with the message that will replace the default delete warning message provided by the grid widget. The input parameter is selectedRows object which represents an object with all selected rows and other parameters including the numberOfSelectedRows. onDelete represents the callback that should be invoked by the grid before the rows are deleted. onDelete property has the selectedRows, success and error parameters. selectedRows is an Object will all selected rows, success is the callback that should be invoked to confirm that the rows can be deleted on the grid (for example, on success for the delete row API) and error if the row deletion shouldn't be performed on the grid. Finally, the autoRefresh parameter is a boolean that when it is set to true indicates that the grid should be refreshed at the end of the delete operation. For example:

```
    var deleteRowMessage = function (selectedRows){
        return "Are you sure you want to delete " + selectedRows.numberOfSelectedRows + " rule(s) for the Firewall Policies grid?";
    };
    var gridConf = {
        elements: {
            ...
            "deleteRow": {
                    "autoRefresh": true,
                    "message": deleteRowMessage
                },
            ...
        }
        ...
    }
```

deleteRow can also be defined as a callback. In this case, the default warning overlay will be skipped and the implementation of the callback defines how the warning message will be presented (for example, on an overlay) and what the content of the message or view is (for example, using a form). Therefore, deleteRow should build an overlay and then render it with the content defined by the user of the widget if the warning view of row deletion needs to be showed on an overlay.
The callback includes the parameters:  selectedRows, deletedRow, and reloadGrid. selectedRows is an object with the current selected rows (like getSelectedRows(true) method), deleteRow is a reference to the grid method that delete the selected rows, reloadGrid is a reference to the grid method that reload the grid. For example:

```
    var deleteRowCallback = function (selectedRows, deleteRow, reloadGrid){
        new CustomRowDeleteView({
            "selectedRows": selectedRows,
            "deleteRow": deleteRow,
            "reloadGrid": reloadGrid
        }).render();
    };
    var gridConf = {
        elements: {
            ...
            "deleteRow": deleteRowCallback,
            ...
        }
        ...
    }
```


**rowMaxElement**
Defines the number of elements in a cell that will be seen for a cell that has a column with collapseContent property enabled or for grid that have inline editing and provide a text area with an editor on overlay. The rowMaxElement property is an object with the following properties:

1. collapse: Defines the number of entries in a cell that will be seen when a row is collapse (collapseContent property is enabled). Additional elements can been seen by using the more tooltip next to the cell with additional entries. Default value is 1.
2. expand: Defines the number of entries in a cell that will be seen when a row is expanded (collapseContent property is enabled). Additional elements can been seen by scrolling vertically on the cell. Default value is 5.
3. edit: Defines the number of entries that will be showed when a cell goes to edit mode for inline editing for cells that uses an editor on overlay and shows the value in a text area. Default value is 5.


For example:

```
    var gridConf = {
        elements: {
            ...
            "rowMaxElement": {
                "collapse": 2,
                "expand": 4,
                "edit": 3 //applies only for inline editing
            }
            ...
        }
        ...
    }
```

4. groupContentItems: Defines the number of entries or items that will be showed when a cell has the groupContent property enabled and the row is expanded. If the cell has more items than the ones allowed in groupContentItems, then the rest of the items will be showed in the more tooltip. Default value is 2. When the row is collapsed, only one item per column will be showed.
5. groupContentColumns: Defines the number of columns (with items) that will be showed when a cell has the groupContent property enabled. If the maximum number of columns defined in groupContentColumns can not accommodate the total number of items for a cell, then the rest of the items will be showed in the more tooltip. If it is absent, then the grid will try to be responsive and accommodate as many cards as possible for the available width of its column. It applies only if showOperator in groupContent property is false (default value).

For example:

```
    var gridConf = {
        elements: {
            ...
            "rowMaxElement": {
                "groupContentItems": 3, //applies only to items with groupContent property
                "groupContentColumns": 2 //applies only to columns with groupContent property
            }
            ...
        }
        ...
    }
```

**filter**
Enables the filtering section of the grid. It is showed on the right side of the action area, above the grid table. It is composed by the following sections:
 1. Search field, defined by the searchUrl parameter
 2. Filter menu, defined by the showFilter parameter
 3. Option menu, defined by the optionMenu parameter
Additionally, a toolbar search could be added below the title of the grid by using the columnFilter parameter.

For example:

```
    "filter": {
        searchUrl: function (value, url){
            return url + "?searchKey=" + value + "&searchAll=true";
        },
        columnFilter: true,
        showFilter: true,
        optionMenu: {
            "showHideColumnsItem":{
                "setColumnSelection": setShowHideColumnSelection,
                "updateColumnSelection": updateShowHideColumnSelection
            },
            "customItems": [{
                    "label":"Export Grid",
                    "key":"exportGrid",
                    "items": [{
                        "label":"Export to PDF",
                        "key":"subMenu1"
                    },{
                        "label":"Export to CSV",
                        "key":"subMenu2"
                    },{
                        "separator": "true"
                    },{
                        "label":"Export to XML",
                        "key":"subMenu3"
                    }]
                },{
                    "label":"Share Grid",
                    "key":"shareGrid"
                },{
                    "label":"Print Grid",
                    "key":"printGrid"
            }],
            "statusCallback": setCustomMenuStatusSplit
        }
    },
```

The following parameters could be include in the filter parameter of the grid configuration.

- ***searchUrl***
The search field allows searching data in the searchable columns of the grid by sending a request to the server with the value of the search value. By default, the _search parameter is appended to the url. If the grid requires a specific search API, the searchUrl parameter is available. searchUrl is a function callback that has the input parameters: value (all applied filters or tokens) and url (original url of the grid), the expected output is a url string.

For example, to enable the default filter in the grid:

```
gridConf = {
    ...
    "filter": true
    ...
}
```

For example, to provide a specific url for data search:

```
gridConf = {
    ...
    "filter": {
        searchUrl: function (value, url){
                       return url + "?searchKey=" + value + "&caseSensitive=true";
                   }
    },
    ...
}
```
- ***onClearAllTokens***
Represents a callback when all the tokens are cleared in the filter. This callback is called when the filter is enabled and when:
1. User clicks on the Clear All link
2. User successfully removes an individual token, and no more tokens are further available to be removed.

For example, to enable the onClearAllTokens callback in the grid:

```
gridConf = {
    ...
    "filter": {
        onClearAllTokens: function (){
                            console.log("All tokens in the filter are cleared");
                          }
    },
    ...
}
```
- ***onBeforeSearch***
It allows to reformat the tokens available in the grid search so that some of the tokens can be replaced with a string that would fit better the API search request. The replaced token should include one of the following operators:  and: " and ", " or ", " contains ", " eq ", " ne ", " lt ", " le ", " gt ", " ge ". If some of the updated tokens need to include the " or " operator, then it should be enclosed by parenthesis.

For example, to enable the onBeforeSearch callback in the grid:

```
gridConf = {
    ...
    "filter": {
        onBeforeSearch: function (tokens){
            var newTokens = [];
            quickFilterParam = "quickFilter = ",
            quickFilerParamLength = quickFilterParam.length;
            tokens.forEach(function(token){
               if (~token.indexOf(quickFilterParam)) {
                   var value = token.substring(quickFilerParamLength);
                   switch (value) {
                       case 'juniper':
                           token = "jun eq '2'";
                           break;
                       case "nonJuniper":
                           token = "(jun eq 3 or jun eq 5)";
                           break;
                       default:
                           token = "jun eq 'all'"
                   }
               }
               newTokens.push(token);
            });
            return newTokens;
    },
    ...
}
```

- ***searchResult***
In case the data is loaded directly in the grid (by using the addRow method); therefore, url or getData parameter is not available, then the searchResult function callback needs to defined. It has the input parameter: tokens and renderGridData. 

-tokens contains search values users has entered. Value is AST if queryBuilder is used as Advance search, else it is Array of string. 

-renderGridData is a callback that should be used to add the results of the search back into the grid.

For example, to provide a a function callback that will return the result of the data search:

```
gridConf = {
    ...
    "filter": {
        searchResult: function (tokens, renderGridData) {
            self.filteredPolicyCollection.fetch({
                success: function(collection) {
                    var policies = collection.models[0].get("policy");
                    renderGridData(policies);
                },
                failure: function(){
                    console.log("The grid data couldn't be loaded.");
                }
            });
        }
    },
    ...
}
```
where self.filteredPolicyCollection is an example of a Backbone collection that is fetched and the results are passed to the renderGridData callback.

- ***noSearchResultMessage***
Defines a custom message that will be shown in the grid, if no records are available with search. This accepts a string value and callback function that should return string value.

```
var conf = {
 ...
 "filter": {
    ...
    //noSearchResultMessage:"No data available",
    "noSearchResultMessage": function() {
         return "There are no search results found";
    },
  }
 ...
}
```

- ***columnFilter***
It adds a toolbar below the title of the grid. It allows to search data for each of the columns. It is used together with the searchCell defined for each column. The toolbar search is enabled when its value is set to true. Depending on the type of searchCell of a column, the search area for a column could be a dropdown, a date, an integer or a simple input. If dataInit callback is defined, then a user defined input control could be defined. When the columnFilter is enabled but searchCell is not defined for a cell, then the search control will be a simple input. The token is composed by the index of a column (if available) or the name of the column followed by the value to be filtered.
The search is triggered when user types a string and press enter. The original grid url gets updated to include the search string by adding the filter parameter. This parameter follows Space API. For example, the original url will get the following parameters appended:

```
... &filter=(name+contains+%22PSP%22+and+(source-address+contains+%22IP_SEC_204.17.79.60%22+or+source-address+contains+%22IP_TRE_204.17.79.60%22))
```

- ***showFilter***
Defines the menu that will be showed when the user clicks on the Filters button. It has two parameters: customItems and quickFilters. customItems is an array of key/label pairs that represents the menu options that the user of widget could define that are related to the search of a token (for example, view filter or load load filters). The quick filters parameter is an array of key/label pairs and represents the filters that could be applied to the grid. For example:

```
showFilter: {
    "customItems": [{
            "label":"View saved filters",
            "key":"viewFilters"
        },{
            "label":"Load saved filters",
            "key":"loadFilters"
        }],
    quickFilters: [{
            "label":"Only Juniper devices",
            "key":"juniper"
        },{
            "label":"Only non-Juniper devices",
            "key":"nonJuniper"
        }]
},
```

The input search, the column filtering and the show filter menu contributes on the filtering of the grid. When a value is entered or selected, the token area is showed, and each value is represented with a token. After the token is added, a new search in the grid is requested to apply the filters.
**Note** If column filter is used along with the Advance search filter, there needs a logical operator selection by user before selecting the next column filter value. Story SPOG-2345 is defined to automate the insertion of logical operator.

The quick filter has a reserved key: "quickFilter" that shouldn't be used as an index or name of a column.

The token area is by default read only; i.e. new tokens can be added only by the selections mentioned earlier. Nevertheless, adding the advancedSearch parameter transforms the read only token area into an input area with context menu that allows to create tokens by menu selection.

- ***advancedSearch***
Defines the token area as an editable input which allows to add tokens from the the filter menu and modified the default AND operator between tokens with one of the operators selected from the logic menu. It has the filterMenu and logicMenu parameters. Both of them defines a set of key/label pairs used to build the corresponding filter context menu and logic context menu. For example:

```
    advancedSearch: {
        "filterMenu": searchConfiguration.filterMenu,
        "logicMenu": searchConfiguration.logicMenu
    },
```

- filterMenu
Defines the items that will be listed in filter context menu and that will be used to validate the expression. For example:

```
var filterMenu = {
    'DeviceFamilyKey': {
        'label':'Device',
        'value':['SRX','MX','EX'],
        'operators': ['=','!=']
    },
    'sourceAddressKey': {
        'label':'sourceAddress',
        'value':['12.1','12.2','12.3','12.4','13.1','13.3','13.3','13.4']
    }
};
```
- ***key***- of the object is the element key e.g. - DeviceFamilyKey
- ***label***- is string that represents the label of the item that will be shown in the UI search filter e.g. - Device. Also this label will be used autocomplete to show as suggestions.

Note: This label should match the label of the column header, so the name can be consistent.

- ***value***- is an array that represents the list of values that will be showed in UI if the respective key is selected e.g. - ['SRX','MX','EX']
- ***operators*** - is an array of operators that user can use to override the global or all operators.


- logicMenu
It defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens. It is represented by an array. For example

```
var logicMenu = ['AND','OR','NOT']
```

To integrate the QueryBuilder widget as advance search, boolean parameter "queryBuilder" is used. Default integration is with Search Widget.

```
    advancedSearch: {
        "queryBuilder" : true,
        "filterMenu": searchConfiguration.filterMenu,
        "logicMenu": searchConfiguration.logicMenu
    },
```

The way in which tokens are created/auto-completed is controlled through an additional set of options:

```
    advancedSearch: {
        "implicitLogicOperator": searchConfiguration.implicitLogicOperator,
        "tokenizeOnEnter": searchConfiguration.tokenizeOnEnter,
        "autoComplete": searchConfiguration.autoComplete,
        "allowPartialTokens": searchConfiguration.allowPartialTokens,
        "afterPartialTokenUpdated": searchConfiguration.afterPartialTokenUpdated
    },
```


Additionally, the search string could be saved. In this case, the save property is available and allows to include the related menu items. The value is an array of key/label pairs. For example:

```
    advancedSearch: {
        "filterMenu": searchConfiguration.filterMenu,
        "logicMenu": searchConfiguration.logicMenu,
        "save": [{
                "label": "Save Filter",
                "key":"saveFilter"
            },{
                "label": "Create Monitor",
                "key":"createMonitor"
            },{
                "label": "Create Alert",
                "key":"createAlert"
            }]
    },
```

- ***optionMenu***
Defines the menu that will be showed when the user clicks on the option icon. For example:

```
optionMenu: {
    "showHideColumnsItem":{
        "setColumnSelection": setShowHideColumnSelection,
        "updateColumnSelection": updateShowHideColumnSelection
    },
    "customItems": [{
            "label":"Export Grid",
            "key":"exportGrid",
            "items": [{
                    "label":"Export to PDF",
                    "key":"subMenu1"
                },{
                    "label":"Export to CSV",
                    "key":"subMenu2"
                },{
                    "separator": "true"
                },{
                    "label":"Export to XML",
                    "key":"subMenu3"
                }]
            },{
                "label":"Share Grid",
                "key":"shareGrid"
            },{
                "label":"Print Grid",
                "key":"printGrid"
        }],
    "statusCallback": setCustomMenuStatusSplit
}
```

It has the following parameters:

- showHideColumnsItem
Allows to show or hide columns in the grid. When the "Show Hide Columns" menu item is selected, a sub menu with all the available columns is showed. By default all columns are enabled. If the setColumnSelection parameter has a function callback, then the initial selection is set according to the values defined in the callback. If the updateColumnSelection defines a function callback, then the selection in the menu could be saved by the usage of this callback.
- customItems
Defines the menu item that will be showed after the "Show Hide Columns" menu item. It could be a simple item or an item that opens a submenu. It follows the same format as per the context menu elements configuration. Refer to the documentation of the Context Menu widget configuration for more details.
An event is triggered when a user selects an option menu item and the name of the event should be defined in the management parameter of the grid. An event listener with the same should be added. The function handler will include the event and the selected rows as parameters
- statusCallback
Defines the status (active or inactive) for each item of the menu. The value should be a function callback that will be invoked before the menu is rendered. The input parameters are: key (the key of the item menu), isItemDisabled (default status provided by the grid depending on the row selection), and selectedRows (current selected rows). The output of the function should be the status of the item menu: true if the item should be disabled and false if the item should be enabled.

**dragNDrop**
Defines the drag and drop interaction.

Note:

1. Cell dragNDrop only works in the simple grid. Row dragNDrop works in both simple and tree grid.
2. Tree grid only supports pagination, so row dragNDrop is limited to current page.
3. During dragging an element, the tooltips are disabled in the grid table. After dropping an element, the tooltips in the grid table will be enabled again.

It has the following parameters:

- ***connectWith***
Define this object when the grid needs to interact with other grid table.
  a. (String) selector: Define the selector that this grid needs to interact with. For example, we can use the tableId of the other grid to define the selector.
  b. (String) groupId: A named drag-n-drop group to which this grid belongs. If a group is specified, then this grid only interact with other drag-n-drop objects in the same group.
  c. (Boolean) isDraggingRow: true or false. Define if this grid is row-to-cell drag-n-drop. Default: true.

Note: connectWith only works in the simple grid.

```
"dragNDrop":{
    connectWith: {
        selector: '#test1',
        groupId: 'zone'
    },
    moveRow: {
        beforeDrag: rowBeforeDrag,
        hoverDrop: rowHoverDropCallback,
        afterDrop: rowafterDropCallback
    }
}
```

- ***moveRow***
Defines if the row can be dragged. If the drag source is not defined, then the whole row can be draggable for reordering. If the drag source is defined, then user can only drag the collapse/expand column, which has row_draggable class, for reordering. The value can be: true, false or a callback object. Default: false
  - true: The row can be sorted by dragging the row.
  - false: The row can NOT be sorted by dragging the row.
  - an callback object: The row can be sorted by dragging the row and the callback will be triggered when event happens.

The object contains the following callback and property:

  a. ***beforeDrag***
  This callback is defined the beforeDrag callback for the draggable rows. The callback is triggered when the draggable row(s) start dragging. The callback needs to return either true, false or an object with the error message. Default: true

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false or want to bypass the default workflow in order to create a custom behavior when start dragging, then return false.
  - If the validation is false and also need to show default error message, then return an error object.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
  - ***(jQuery Object) helper***: The helper element


  b. ***hoverDrop***
  The callback is triggered when the draggable element hovers the droppable element. The callback needs to return either true or false. Default: true

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false, grid reverts to the original order.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging row(s)
  - ***(Object) hoveredRow***: The rowData and rawData of the hovered cell
  - ***(jQuery Object) helper***: The helper element


  c. ***afterChange***
  The callback is trggered when the DOM element changes. The callback needs to return either true, or false. Default: true

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false, grid reverts to the original order.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging row(s)
  - ***(jQuery Object) helper***: The helper element
  - ***(Object) siblingRows***: The rowData and rawData of the previous row and the next row


  d. ***afterDrop***
  The callback is triggered after dropped. The callback needs to return either true, false or an object with the error message. Default: true

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false, grid reverts to the original order.
  - If the validation is false and also need to show default error message, then return an error object.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging row(s)
  - ***(jQuery Object) helper***: The helper element
  - ***(Object) siblingRows***: This object contains nextRow, prevRow, parentOfNextRow, and parentOfPrevRow.
      - nextRow, prevRow: The rowData and rawData of the previous row and the next row.
      - parentOfNextRow, parentOfPrevRow: If it is a treeGrid, grid will pass the rowData and rawData of the parent of the previous and the next row.
  - ***(Function) updateRowVisualEffect(rowIds)***: rowIds should be an Array of the id of the dragging rows. This function updates the visual effects by highlighting the dragging rows for 3 seconds. If we return true in the afterDrop callback, grid widget will update this visual effect automatically. If we return false in the afterDrop callback, even grid widget won't implement this visual effect, developers still can use this function to provide the same visual effect that the grid widget has implemented.


  e. ***position***
  Defines the position propery in the JSON data so grid widget can know the current position of the row. Thie is a required attribute if row sorting is enabled.


- ***moveCell***
A set of default callbacks are defined for all columns.

Note: moveCell only works in the simple grid.

  a. ***beforeDrag***
  This callback is defined the default beforeDrag callback for all draggable columns. The callback is triggered when the draggable element start dragging. The callback needs to return either true, false or an object with the error message. Default: true

  Note: The column level beforeDrag callback will overwrite the beforeDrag callback in the grid level.

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false or want to bypass the default workflow in order to create a custom behavior when start dragging, then return false.
  - If the validation is false and also need to show default error message, then return an error object.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
  - ***(Array) draggableItems***: The dragging items. Note: ONLY pass during item-to-cell drag and drop.
  - ***(jQuery Object) $draggableCell***: The dragging cell
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
  - ***(jQuery Object) helper***: The helper element


  b. ***hoverDrop***
  This callback is defined the default hoverDrop callback for all droppable columns. The callback is triggered when the dragging element hovers the droppable element. The callback needs to return either true or false. Default: true

  Note: The column level hoverDrop callback will overwrite the hoverDrop callback in the grid level.

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false, grid will return to original position.

  The callback passes an object which contains some data.
  - ***(Array) data***: The data of the dragging element
  - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
  - ***(Object) hoveredCellColumn***: The index and name of the hovered cell column
  - ***(Array) draggableItems***: The dragging elements. Note: ONLY pass during item-to-cell drag and drop.
  - ***(jQuery Object) $draggableCell***: The dragging cell
  - ***(jQuery Object) $hoveredCell***: The droppable cell is hovered
  - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
  - ***(Object) hoveredRow***: The rowData and rawData of the droppable cell
  - ***(jQuery Object) helper***: The helper element


  c. ***afterDrop***
  This callback is defined the default afterDrop callback for all droppable columns. The callback is triggered after the draggable element drops in the droppable element. The callback needs to return either true, false or an object with the error message. Default: true

  Note: The column level afterDrop callback will overwrite the afterDrop callback in the grid level.

  - If the validation is passed and grid should show the default workflow, then return true.
  - If the validation is false or want to bypass the default workflow in order to create a custom behavior after drops, then return false.
  - If the validation is false and also need to show default error message, then return an error object.

   The callback passes an object which contains some data.
   - ***(Array) data***: The data of the dragging element
   - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
   - ***(Object) droppableCellColumn***: The index and name of the droppable cell column
   - ***(Array) draggableItems***: The dragging elements. Note: ONLY pass during item-to-cell drag and drop.
   - ***(jQuery Object) $draggableCell***: The dragging cell
   - ***(jQuery Object) $droppableCell***: The droppable cell that user drops the element
   - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
   - ***(Object) droppableRow***: The rowData and rawData of the droppable cell
   - ***(jQuery Object) helper***: The helper element
   - ***(Function) updateColumnVisualEffect($dropCell)***: this function updates the visual effects by highlighting the dropped cell for 3 seconds. If we return true in the afterDrop callback, grid widget will update this visual effect automatically. If we return false in the afterDrop callback, even grid widget won't implement this visual effect, developers still can use this function to provide the same visual effect that the grid widget has implemented.


```
"dragNDrop":{
    moveCell:{
        beforeDrag: defaultBeforeDrag,
        hoverDrop: defaultHoverDrop,
        afterDrop: defaultAfterDrop
    },
    moveRow: {
        beforeDrag: rowBeforeDrag,
        hoverDrop: rowHoverDropCallback,
        afterChange: rowAfterChangeCallback,
        afterDrop: rowafterDropCallback
    }
}
var rowafterDropCallback = function(data){
    console.log(data);
    return true;
    //return false;
    //return {isValid: false, errorMessage: 'The row can not be reordered.'};
};
var rowHoverDropCallback = function(data){
    console.log(data);
    return true;
    //return false;
};
var rowAfterChangeCallback = function(data){
    console.log(data);
    return true;
    //return false;
};
var rowBeforeDrag = function(data){
    console.log(data);
    return true;
    //return false;
    //return {isValid: false, errorMessage: 'The row can not be reordered.'};
};
var defaultBeforeDrag = function(data){
    console.log(data);
    data.helper.attr("data-grid-demo", "this is payload data.");
    // return false;
    // return true;
    return {isValid: false, errorMessage: 'The item is not draggable.'};
};
var defaultHoverDrop = function(data){
    console.log(data);
    // return false;
    return true;
};
var defaultAfterDrop = function(data){
    console.log(data);
    //return true with the default workflow if the validation is passed
    return true;
    //return false without showing any behavior if the validation is NOT passed or in order to create the custom behavior after drops.
    //return false;
    //return the following object if the validation is NOT passed in order to show the error message by default
    //return {isValid: false, errorMessage: 'This is testing error message.'};
};
```

**subGrid**:

Defines a nested grid for a table that is available when user clicks on the parent row. The parameters are:
- ***url***
    Defines the API that will be called to get the data for the table. When it is not defined, it takes the parent row as a base url. It could also be defined as a callback that should return a string with the the nested grid url. The input parameter of the callback is the data of the row, the search tokens applied to the grid and the id of the row with the subgrid.
- ***numberOfRows***
    Defines the number of rows that will be requested from the API to show the next set of rows for virtual scrolling (pagination). The height needs to be set in pixels and the scroll has to be set to true.
- ***height***
    Defines the height of the grid; i.e. the view port that is available to show the rows in a table. If it is set to auto, the height will be the same as the number of rows. For virtual scrolling, the height should be provided in number of pixels.
- ***jsonRoot***
    Defines where the data begins in the JSON response. It could also be defined as a callback that should return a string with the nested grid root. The input parameter of the callback is the data of the row, the search tokens applied to the grid and the id of the row with the subgrid.
- ***jsonId***
    Defines the unique id of the row. It could also be defined as a callback that should return an object with the nested grid id. The input parameter of the callback is the data of the row, the search tokens applied to the grid and the id of the row with the subgrid.
    **jsonRecords**
    Defines a function that returns the number of records that an API response could have. Input parameters are the data of the table and the id.
- ***ajaxOptions***
    Defines the object that will be appended with the request to get data for the subgrid. It could also be defined as a callback that should return an object with the nested grid ajax options. The input parameter of the callback is the data of the row, the search tokens applied to the grid and the id of the row with the subgrid.
- ***expandOnLoad***
    Allows to expand automatically the nested grids when the main grid is loaded. It is a boolean which value could be true to load and show the nested grids or false (by default) to load a nested grid by demand (when the parent row is expanded).
- ***scroll***
    Defines the grid capability to provide virtual scrolling when it is set to true. Virtual scrolling is available only when the grid can retrieve data for each page of the grid. This is available when the url parameter is added in the configuration of the grid. This url gets appended the required parameters to request from the server the next pages.

For example:

```
"subGrid": {
    "url": "/assets/js/widgets/grid/tests/dataSample/zonePoliciesOnePage.json",
    "numberOfRows":10,
    "height": "360",
    "jsonRoot": "policy",
    "jsonId": "name",
    "scroll":"true"
},
```

Virtual scrolling is also available when neither the url or data has been defined and the row data is added by page using the addPageRows method.

In the case of tree grid, pagination is available. To enable pagination, scroll can be defined as an Object with a value (pagination: true). The "slipstreamGrid.pagination:pageLoaded" event will be triggered when a new page is requested. It provides an Object with the page (page number), pageSize (number of rows per page) and the status of the request.

**showWidthAsPercentage**:

Defines how the width of a column will be calculated when it is rendered. If it is set to true (the default value), it means the width will be interpreted as a percentage of the total width of the grid (the sum of the with of all columns). If it is set to false then it takes the width provided as-is. The parameter will be deprecated when the grid provide additional support for minimum and maximum width of a column. If the width of a column should be adjusted automatically using percentages, then the preferred unit for the width should be percentage. In this case, this parameter is ignored.

**emptyCell**
Define the label and tooltip for the empty cell in the grid.

- ***label***
   Define the default label for all empty cell in the grid. The value can be a string or HTML string. Default: &mdash;

- ***tooltip***
   Define the default tooltip for all empty cell in the grid. Default: NO tooltip. If the tooltip: true (tooltip is enabled), the default tooltip content is "No data".

```
"emptyCell":{
    label: "<span class= 'newIcon'></span>",
    tooltip: "configuration is from the grid level"
}

or

"emptyCell": false //Turn off the default label for empty cells.
```

**columns**
Contains the data required to render the header of the table and column features like editing, validation, etc. It's a required parameter and should contain an array with objects that represent each of the columns of the grid. The parameters per column are:

- ***index***
   Represents the id of the row and it is used for sorting purposes. It's represented as a string and it shouldn't include spaces.

- ***name***
   Represents the name of the row and it should match the one in the JSON response. Name is a required field for a column.

- **label**
  Specify the value that will be used to render the column display name on the column title and on the show / hide menu (if applicable).  It accepts string, Object, or boolean. A string will represent the value to be shown in the column display name and in the show / hide menu. A Object needs to include the formatter and unformat properties. formatter is a callback that will be invoked to get the *html* string that will be added in the column display name, unformat is a callback that will be invoked to represent the column in the show hide menu; in this case, the unformat output should be a simple string. If unformat callback is absent, then the item in the show / hide name will be represented by the name of the column. Both callbacks are called with the name of the column as a parameter. In the case of boolean, it only takes false and the the show / hide menu will not render the item representing the column.

  For example, columns can have the following configuration:

```
...
columns: [{
	...
	}, {
	    "index": "description",
	    "name": "description",
	    "label": "Description",
	    ...
	}, {
	    "index": "application-services",
	    "name": "application-services",
	    "label": {
	      "formatter" : getColumnLabelFormatter,
	      "unformat" : getColumnLabelUnformat
	    },
	    ...
	}, {
	    "index": "Date",
	    "name": "date",
	    "label": false,
	    ...
	}, {

	...
}],
...
```

where the callbacks for label could be:

```javascript
    var getColumnLabelFormatter = function (columnName) {
        return "<span class='column-label-wrapper'><input type='checkbox' value='"+ columnName + "'/> <label>Custom: <b>"+ columnName +"<b/></label></span>";
    };

    var getColumnLabelUnformat = function (columnName) {
        return "Application Services";
    };
```

In the case of events like click on a checkbox, the user of the widget will need to listen for that event and stop the propagation so that the grid widget ignores it. For example, any click on the label of a column will call sorting in a column (unless it is disabled). So, stopPropagation() needs to be added on the event handler if the user of the widget does not want the event bubbles up. Once the grid is loaded, handlers can be added. For example, to take control on the checkbox added in the title or a column for a grid, the following code should be added:

```javascript
    $gridTable.bind("gridLoaded", function (e, status) {
          $gridContainer.find(".column-label-wrapper").on("click", "input", function (e) {
             console.log("is checked: " + this.checked);
              e.stopPropagation();
          });
    });
```

- **type**
Optional property that allows to define if a column will render a specific type of data, like a date. The supported value for this property is: "date". In the date case, the column data accepts dates as ISO8601 strings. For example, a column can be defined as follow:

```
...
columns: [{
	...
	}, {
	    "index": "Date",
	    "name": "date",
	    "type": "date",
	    "label": false,
	    ...
	}, {

	...
}],
...
```

Note: if type is used, then any formatter or unformat defined for the column will be ignored.

- **hidden**
  A boolean value used to determine if the column should be visible or not on the grid.  This can be set to false which will render the column not visible.

- **internal**
  A boolean value used to determine if the column should be available or not on the Hide-Show column list.  This can be either not defined or set to false which will make the column available in the Hide-Show column list. Setting it true will make the column unavailable in the Hide-Show column list.

- **frozen**
  A boolean value is used to disable column reordering when sorting is not false. If set to true, it determines that this column will be frozen. Default: false.

  Note: Only simple and tree grid support this feature.
  Note: Only the CONSECUTIVE frozen columns from the first/last column will be frozen.
  Note: If one of group column is frozen, it will freeze all group items.

- ***width***
   Assigns a width to the column. It can be defined as a number or as a percentage. Number represents the number of pixels that a column should have. The number of pixels on a column is a fixed number; therefore, the column of the grid will not be increased or decreased if the browser width changes. Percentage represents the percentage assigned to a column in relation to the grid width. When the browser is resized, then each columns width increases or descreases according to the new available with. The new width is calculated on percentage and with relation to the total grid width. In this case, the total width is 100% and all the individual columns should sum up  100%. Different units can not be combined; i.e. either the column is defined on pixels (number) or a percentage.

- ***emptyCell***
Define the label and tooltip for the empty cell for this column.

  - **label**
  Define the default label for all empty cell for this column. The value can be a string or HTML string. Default: &mdash;

  - **tooltip**
  Define the default tooltip for all empty cell for this column. Default: NO tooltip. If the tooltip: true (tooltip is enabled), the default tooltip content is "No data".

```
"emptyCell":{
    label: "N/A",
    tooltip: "configuration is from the column level"
}

or

"emptyCell": false //Turn off the default label for empty cells.
```

- ***editCell***
   Indicates if a column is editable. It has the following parameters:

  - **type**
 Enables a cell to be edited as an input field if the type is input and as dropwdown if the type is a dropdown.
 For the dropdown type, the values property consist of an array of Object with label/value pairs. values property will allow to define the content of the dropdown that will be shown on inline edition. Additionally, some properties from the dropdown widget can be added to this editCell object like enableSearch which allows to search a value in a dropdown. More details can be found at [Dropdown widget](public/assets/js/widgets/dropDown/dropDown.md)
 The user could define a custom control for editing a cell by using the type custom. The custom type edit cell requires the element and value properties. Element property represents a callback function that the grid will use to get the html element that should be inserted on the edit cell. The value property is a callback function that should return the value that should be saved when the inline edition of the row is completed.

 For example, to include a custom cell on edition, then a column for the columns property of the grid configuration (elements property) should include an editCell property like the following:

```
 ...
 "columns": [{
 ...
  }, {
        "index": "action",
        "name": "action",
        "label": "Action",
        "width": 200,
        "editCell":{
            "type": "custom",
            "element":getCustomDropdownElement,
            "value":getCustomDropdownValue
        }
     }, {
  ...
  }],
 ...
```

where:
 - element property is a callback function with the cellvalue (original value in the cell) and the options (id of the row) input parameters.
 - value property is a callback function with the element (html of the edit cell) and the operation (get or set) input parameters.

For example, the following callback functions allows the integration of the dropdown widget in the grid widget:

```
    var getCustomDropdownElement = function(cellvalue, options){
        var $span =  $('<div><select class="celldropdown"></select></div>');
        actionCustomDropdown = new DropDownWidget({
            "container": $span.find('.celldropdown'),
            "data": actionDropDownData,
            "placeholder": "Select an option",
            "enableSearch": true
        }).build();
        actionCustomDropdown.setValue(cellvalue);
        return $span[0];
    };
    var getCustomDropdownValue = function(element, operation){
        return actionCustomDropdown.getValue();
    };
```

  - **pattern**
  Defines the pattern that should be used to validate an input. Pattern can be regex string or predefined pattern. The list of predefined patterns are mentioned in the formValidator document.

  - **error**
  Defines the message that will be showed on the error area when the input validation fails on the client side.

  - **remote**
  Defines remote validation in addition to the client side validation defined in the pattern parameter. It should include the following parameters:

  - ***url***
  Represents the REST API that will be used to validate the input. A callback function can be used instead of a string to adjust the url according to the value of the input.

  - ***type***
Represents the type of URL request that will be performed: GET or POST

  - **response**
Represents a callback used to used to reformat the response obtained after the REST API has been called. Since the expected value of the response is true or false, the callback is required to read the response text and return true or false.

  - **error**
Defines the message that will be showed on the error area when the input validation fails on the remote side.

  - **post_validation**
   It represents the name of the custom event that will be triggered when an input validation has been completed.

    For example:

    ```
    "columns": [
       ...
            "name": "name",
            "label": "Name",
            "width": "400",
            "formatter":createLink,
            "unformat":undoLink,
            "copiedDefaultValue":getDefaultCopiedValue,
            "editCell":{
                "type": "input",
                "post_validation": "postValidation",
                "pattern": "^[a-zA-Z0-9_\-]+$",
                "error": "Enter alphanumeric characters, dashes or underscores"
            },
       ...
    ],
    ```

    Listeners of the custom event should implement a binding event handler. For example: this.$el.bind("postValidation",function(e, isValid){...});

    **editCell** can be used with **collapseContent** (column property). In this case, a cell in edit mode will use the editCell type (input or dropdown) instead of the default textarea input cell. Since collapseContent is intended for cells that holds multiple values, then an input field (without validation) or a dropdown will be rendered for each value (item) in the cell.

- ***hideHeader***
   Hides the column label from the header.

- ***hidden***
   Hides the column from the table.

- ***onHoverShowRowSelection***
  Allow this column to switch with the selection checkbox when hovers the row. When the value is true and column hidden is NOT true, grid widget would change the order of columns, so this column would move to the left and display the original column content. When a row is hovered, this column would display the row selection checkbox instead. Default: false

  Note: The minimum width of the row selection column is 40px, so make sure the column width is greater than 40px. If the column width is not defined, then the default width is 40.

- ***group*** It allows to group columns by assigning the same group id to multiple columns. Its data type is a string that represents the group id that can be shared among two or more columns. For example, two of the columns of the grid configuration (elements.columns) could be defined as:

    ```
    ...
        {
            "index": "descriptionShort",
            "name": "descriptionShort",
            "label": "Description Short",
            "group": "description-group"
        },
        {
            "index": "descriptionLong",
            "name": "descriptionLong",
            "label": "Description Long",
            "group": "description-group"
        }
    ...
    ```

    In this case, "Description Short" and "Description Long" are logically grouped by the group property (group id: description-group). If one of the columns is hidden, then all the columns in the same group will be automatically hidden.
    Some restrictions in the group feature are: a group should be composed by two or more columns, the columns that need to be grouped should be consecutive and one column can belong to only one group.

  Note: If one of group columns has frozen: true property, it will cause the whole group to be frozen, which means the group column reordering is disabled.

- ***collapseContent***
  Shows the content of the column with break lines when more than one value is available. The data for this type of column could be a string, an array of strings, an array of objects.  For strings or an array of strings, the collapseContent value could be a boolean: true, and for an array of objects, the collapseContent property provides additional parameters, so the value should be an object with at least the parameter: keyValueCell set to true. When the configuration of one of the columns in a grid has the collapseContent parameter, an icon is added at the beginning of each row that allows collapse all data and show a summary of the data or expand all the row and show all the data. The available parameters are:

  a. ****name**** Available for a column that has data like an array of object, but the value that is required is of its parameters. For example, for the data:

    ```
    "applications": [{
                            "domainId": 1,
                            "domainName": "SYSTEM",
                            "id": 131153,
                            "MOID": "net.juniper.jnap.sm.om.jpa.ApplicationEntity:131153",
                            "appName": "aol"
                        }, {
                            "domainId": 1,
                            "domainName": "SYSTEM",
                            "id": 131442,
                            "MOID": "net.juniper.jnap.sm.om.jpa.ApplicationEntity:131442",
                            "appName": "apple-ichat"
                        }, {
                            "domainId": 1,
                            "domainName": "SYSTEM",
                            "id": 131449,
                            "MOID": "net.juniper.jnap.sm.om.jpa.ApplicationEntity:131442",
                            "appName": "apple-ichat1"
                        }, {
                            "domainId": 1,
                            "domainName": "SYSTEM",
                            "id": 131386,
                            "MOID": "net.juniper.jnap.sm.om.jpa.ApplicationEntity:131386",
                            "appName": "apple-ichat-snatmap"
                        }],
    ```

    if the data that needs to be showed on the grid is: the name property inside the applications, then the configuration of the column should look like this:

    ```
        {
            "index": "services",
            "name": "applications",
            "label": "Services",
            "collapseContent":{
                "name": "appName"
            },
            "width": 150
        },
    ```

    where the name property in the column configuration refers to the name of the property in the data, in this case appName.

  b. ****key**** Available for a column that has data like an array of object. Provide this value in order to invoke cellTooltip callback for tooltip on an item.

```
    {
        "index": "services",
        "name": "applications",
        "label": "Services",
        "collapseContent":{
            "name": "appName",
            "key": "id"
        },
        "width": 150
    },
```

  c. ****keyValueCell**** It should be set to true for cases where the data in the cell should be presented as a key value pair instead of a sequence of strings. The data is expected to be a simple object with key value pairs.

  d. ****lookupKeyLabelTable**** It works with keyValueCell property and defines an object that works like a lookup table. It is intended to replace the original key provided in the data object for a more friendly user label.

  e. ****formatData**** It is a callback function that formats the data that would be used by the collapseContent property. In general the data could have one of the following formats: an array of strings (default expected data), an array of objects (with name property to choose the right property) or a simple object (with keyValueCell set to true). If the data for the column comes in a different format, then the data needs to be massaged before the grid can use it under the cellContent property. The function input parameters are cellvalue (value of the cell), options (object with column name and row id data) and rowObject (an object with the row data).

  f. ****formatCell**** It is a callback function that allows to reformat the content of a cell that has an input data of the Array type. The input parameters are $cell (jQuery object), cellvalue (value of the cell), options (object with column name and row id data) and rowObject (an object with the row data). The return value should be the updated $cell (jQuery object). $cell is composed by three nodes: the compact version of the cell ($cell[0]), the expanded version of the cell ($cell[1]), and the raw cell value ($cell[2]). Updates to the content of $cell, should be done by finding the cellContentValue for $cell[0] or the cellContentWrapper class for $cell[1]. cellContentWrapper groups the individual cell values. Each cell value is an inline block with the cellContentValue class. For example formatCell callback could be defined like:

```
    var formatCollapseCell = function ($cell, cellvalue, options, rowObject){
      $($cell[1]).find('.cellContentWrapper .cellContentValue').attr('title',rowObject.name).addClass('tooltip');
      return $cell;
    };
```

  Note: ONLY when the column supports cell-to-cell or multiple items of a cell drag-n-drop, grid widget requires one minimum requirement: MUST contain checkbox in the cellItem DOM and the element MUST contain the class, "dragabble-cell-checkbox". If user returns html object without checkbox or checkbox without the specified class, it will cause drag-n-drop in the grid to fail.

```
    Default html:
    <span class="cellContentValue cellItem  ui-draggable">
      <input type="checkbox" class="dragabble-cell-checkbox">Label 1
      <input type="checkbox" class="dragabble-cell-checkbox">Label 2
    </span>
    Return updated html (Example):
    <span class="cellContentValue cellItem  ui-draggable">
      <div><input type="checkbox" class="dragabble-cell-checkbox"><span class="icon"></span><span>Label 1</span></div>
      <div><input type="checkbox" class="dragabble-cell-checkbox"><span class="icon"></span><span>Label 2</span></div>
    </span>
```

  g. ****unformatCell**** It is a callback function that defines the value that will be available when the cell goes on edit mode, and later when the cell is saved, this callback is used to provide formatCell with the cell value that will be used to format the cell when it is rendered.

  h. ****formatObjectCell**** It is a callback function that allows to reformat the content of a cell that has an input data of the Object type. The input parameters are $cell (jQuery object), cellvalue (value of the cell), options (object with column name and row id data) and rowObject (an object with the row data). The return value should be the updated $cell (jQuery object). $cell is composed by three nodes: the compact version of the cell ($cell[0]), the expanded version of the cell ($cell[1]), and the raw cell value ($cell[2]). Updates to the content of $cell, should be done by finding the cellContentValue for $cell[0] or the cellContentWrapper class for $cell[1]. cellContentWrapper groups the individual cell values. Each cell value is an inline block with the cellContentBlock class that groups the label (cellContentValue class) and value (cellContentKeyValue class). For example formatObjectCell callback could be defined like:

  ```
    var formatObjectCell = function ($cell, cellvalue, options, rowObject){
        $($cell[1]).find('.cellContentWrapper .cellContentBlock').attr('title',rowObject.name).addClass('tooltip');
        return $cell;
    };
  ```

  i. ****unformatObjectCell**** It is a callback function that defines the value that will be available when the cell goes on edit mode, and later when the cell is saved, this callback is used to provide formatObjectCell with the cell value that will be used to format the cell when it is rendered.

  j. ****overlaySize**** It defines the size of the overlay for a cell view: medium, large, x-large. The default value is medium.

  k. ****moreTooltip**** It is a callback function that defines the content of the more tooltip, when it is not available, the content of the tooltip is the same as the cell value. The callback has the rowData, rawData and the setTooltipDataCallback parameters. rowData and rawData are object with the data available in the grid and the one available from API response respectively. setTooltipDataCallback is a callback that should be used when the data is ready for adding it in the more tooltip content. It should be invoked with the array of data that should be rendered in the tooltip and the object composed by the mapping of the key and label parameters to the original tooltip data, and the clickHandler handler that should be attached when the user clicks on an item in the more tooltip. The input parameter for the clickHandler is item which is composed by the key and label of the item selected.  The label parameter can be either a string or an object.

  For example (label as a string):

    ```
      var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
          $.ajax({
              type: 'GET',
                  });
              }
          });
      };
    ```
  The label parameter can also be an object that would contain attributes formatter as a string to search and unformat as the callback function that returns a valid HTML string.

  For example (label as an object):

    ```
      var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
          $.ajax({
              type: 'GET',
              url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
              success: function(data) {
                  setTooltipDataCallback(data.address, {
                      "key": "ip-prefix",
                      "label": {
                               "unformat": "name",
                                "formatter": function(currentData){
                                    return "<div>" + currentData.name + "</div>";
                                 }
                       },
                      "clickHandler": function(item){
                          console.log(item);
                      }
                  });
              }
          });
      };
      var gridConf = {
        ...
        "columns" :
            [{
                ...
            }, {
                "index": "DestinationAddress",
                "name": "destination-address",
                "label": "Destination Address",
                "collapseContent":{
                   "moreTooltip": setTooltipData
                },
                "width": 260,
                "createdDefaultValue":"any",
                "searchCell":{
                   "type": "number"
                }
            }, {
            ...
            ]
        };
    ```

  l. ****singleValue**** It is used to display the string containing line breaks as a single line along with a plus icon. It is false by default.

    ```
          var gridConf = {
            ...
            "columns" :
                [{
                    ...
                }, {
                    "index": "Description",
                    "name": "description",
                    "label": "Description",
                    "collapseContent":{
                       "singleValue": true
                    },
                    "width": 260,
                }, {
                ...
                }]
            };
    ```

  m. ****multiselect**** It defines if the items in this cell can be selected (true). By default this feature is not available (false). This option is useful when menu items for a context menu are defined and that are specific to a column. For example:

    ```
    {
            "index": "sourceAddress",
            "name": "source-address",
            "label": "Source Address",
            "width": "200",
            "collapseContent": {
                "formatCell": formatCollapseCell,
                "unformatCell": unformatCollapseCell,
                "multiselect": true
            },
            "contextMenu": {
                "copyCell": "Copy Cell",
                "pasteCell": "Paste Cell",
                "custom": [
                    {
                        "label": "Cell Menu 21",
                        "key": "cellMenu21"
                    },
                    {
                        "label": "Cell Menu 22",
                        "key": "cellMenu22"
                    },
                    {
                        "label": "Cell Sub Menu",
                        "key": "cellSubMenu2",
                        "items": [
                            {
                                "label": "Cell Sub Menu 21",
                                "key": "cellSubMenu21"
                            },
                            {
                                "label": "Cell Sub Menu 22",
                                "key": "cellSubMenu22"
                            }
                        ]
                    }
                ]
            }
        },
    ```

  **Inline Editing:** A cell with collapseContent option and inline editing is represented by a text area input element. In this case, all items in the collapseContent cell (array or Object type) are represented as an entry in the text area. If editCell property is used in combination with collapseContent, then the default text area can be updated to user either input or dropdown element type. Each item is rendered on an input element or on a dropdown element. For example, to edit a cell with multiple items using a dropdown for each item, then the colum configuration should be as the one that follows:

    ```
    ...
        {
            "index": "condition",
            "name": "condition",
            "label": "Condition",
            "collapseContent": true,
            "group": "condition-address",
            "editCell": {
                "type": "dropdown",
                "values": [
                    {
                        "label": "Condition_001",
                        "value": "condition_001"
                    },
                    {
                        "label": "Condition_002",
                        "value": "condition_002"
                    },
                    {
                        "label": "Condition_003",
                        "value": "condition_003"
                    },
                    {
                        "label": "Condition_004",
                        "value": "condition_004"
                    },
                    {
                        "label": "Condition_005",
                        "value": "condition_005"
                    },
                    {
                        "label": "Condition_006",
                        "value": "condition_006"
                    }
                ]
            }
        },
    ...
    ```

  Using editCell in combination with collapseContent is not applicable if collapseConent has either keyValueCell or singleValue enabled. Also, if a cell using collapseContent does not require to be editable, then editCell should be set to false.

- ***groupContent***
  Shows the content of a column in groups where each group has items composed by a key and value. Items are separated with break lines whenever more than one item is available. The data for this type of column should an array of arrays. Each array represents one group and it should contain an array of objects which represents the definition of each item. Each item has the group (key) and value properties. The groupContent value could be a boolean: true or it could be an Object with the following optional parameters:

  a. ***formatData*** It is a callback function that formats the data that would be used by the property in case the data needs to be massaged before the grid can use it under the groupContent property. The function should return an array of objects with the format expected for the groupContent property. The function input parameters are cellvalue (value of the cell), options (object with column name and row id data) and rowObject (an object with the row data).

  b. ***formatCell*** It is a callback function that allows to reformat the content of a cell that has an input data of the Array type. The input parameters are $cell (jQuery object), cellvalue (value of the cell), options (object with column name and row id data) and rowObject (an object with the row data). The return value should be the updated $cell (jQuery object). $cell is composed by three nodes: the compact version of the cell ($cell[0]), the expanded version of the cell ($cell[1]), and the raw cell value ($cell[2]). Updates to the content of $cell, should be done by finding the cellContentValue for $cell[0] or the cellContentWrapper class for $cell[1]. cellContentWrapper groups the individual cell values. Each cell value is an inline block with the cellContentValue class. For example formatCell callback could be defined like:

```
    var formatCollapseCell = function ($cell, cellvalue, options, rowObject){
      $($cell[1]).find('.cellContentWrapper .cellContentValue').attr('title',rowObject.name).addClass('tooltip');
      return $cell;
    };
```

  c. ***unformatCell*** It is a callback function that defines the value that will be available when the cell goes on edit mode, and later when the cell is saved, this callback is used to provide formatCell with the cell value that will be used to format the cell when it is rendered.

  d. ***showOperator*** It is a boolean that defines if the group content will show an operator to join two column items. Only one card will be included per column item; if there are two cards, then an operator will join them. The value will be the one provided in cell data, as a string and between two sets of data. If the operator is absent, it will default to "AND". If showOperator property is absent or it is set to false, then no operator will be showed. For example, the cell data that includes an operator "OR" should look like:

```
  {
    ...
    "source": [
                  [
                      {
                          "group": "USR",
                          "value": "HR_All"
                      },
                      {
                          "group": "USR",
                          "value": "HR_All1"
                      }
                  ],
                  "OR",
                  [
                      {
                          "group": "ADD",
                          "value": "IP_DPW_204.186.62.2"
                      },
                      {
                          "group": "ADD",
                          "value": "IP_PHEAA_216.37.216.250"
                      },
                      {
                          "group": "ADD",
                          "value": "IP_PSP_149.101.21.124"
                      }
                  ]
            ]
    ...
  }
```

  e. ***moreTooltip*** It is a callback function that defines the content of the more tooltip, when it is not available, the content of the tooltip is the same as the cell value. The callback has the rowData, rawData and the setTooltipDataCallback parameters. rowData and rawData are object with the data available in the grid and the one available from API response respectively. setTooltipDataCallback is a callback that should be used when the data is ready for adding it in the more tooltip content. It should be invoked with the array of data that should be rendered in the tooltip and the object composed by the mapping of the key and label parameters to the original tooltip data, and the clickHandler handler that should be attached when the user clicks on an item in the more tooltip. The input parameter for the clickHandler is item which is composed by the key and label of the item selected.  The label parameter can be either a string or an object.
  For example (label as a string):

    ```
    var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
      $.ajax({
          type: 'GET',
              });
          }
      });
    };
    ```

  The label parameter can also be an object that would contain attributes formatter as a string to search and unformat as the callback function that returns a valid HTML string.

  For example (label as an object):

    ```
      var setTooltipData = function (rowData, rawData, setTooltipDataCallback){
          $.ajax({
              type: 'GET',
              url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
              success: function(data) {
                  setTooltipDataCallback(data.address, {
                      "key": "ip-prefix",
                      "label": {
                               "unformat": "name",
                                "formatter": function(currentData){
                                    return "<div>" + currentData.name + "</div>";
                                 }
                       },
                      "clickHandler": function(item){
                          console.log(item);
                      }
                  });
              }
          });
      };
      var gridConf = {
        ...
        "columns" :
            [{
                ...
            }, {
                    "index": "source",
                    "name": "source",
                    "label": "Source",
                    "groupContent":{
                        "moreTooltip": setTooltipData,
                        "formatData": formatGroupData
                        "formatCell": formatCollapseCell,
                        "unformatCell": unformatCollapseCell
                    }
            }, {
            ...
            ]
        };
    ```

 f. ***key*** Items in a group could have its own tooltip. In this case, each item should define a key, so the cellTooltip attribute defined in the grid configuration is invoked when a hover happens on the item. The content of the tooltip is provided by the cellTooltip callback. Nevertheless, in some cases, the data available for an item might not included the key property. *key* attribute allows the user of the widget to map an existing property to the key attribute. For example, for the column data:

    ```javascript
    ...
    "source": [
                [
                    {
                        "group": "USR",
                        "value": "Developers_FE",
                        "identifier": "Developers_UniqueKey_1"
                    },{
                        "group": "USR",
                        "value": "Developers_BE",
                        "identifier": "Developers_UniqueKey_2"
                    }
                ],[
                    {
                       "group": "ADD",
                       "value": "IP_PSP_12.197.68.4",
                       "identifier": "IP_PSP_12.197.68.4"
                    },
                ]
              ],
    ...
    ```

 If the key that needs to be added for an item on a groupContent cell is the "identifier" attribute  then the configuration of the "source" column should look like this:

    ```
        {
            "index": "source",
            "name": "source",
            "label": "SOURCE",
            "collapseContent":{
                "key": "identifier"
            }
        },
    ```

 where the key attribute in the column configuration refers to the name of the attribute in the data, in this case identifier.

 f. ***value*** The data of each item (Object) in a group (array of Objects) is expected to have the *value* attribute so it is rendered in its group for a groupContent cell. If the data has a different value attribute, then the *value* attribute can be defined in the configuration of the *groupContent*. For example, for the column data:

    ```javascript
        ...
        "destination": [
                  [
                      {
                          "group": "USR",
                          "label": "Developers_FE",
                      },{
                          "group": "USR",
                          "label": "Developers_BE",
                      }
                  ],[
                      {
                         "group": "ADD",
                         "label": "IP_PSP_12.197.68.4",
                      },
                  ]
                ],
        ...
    ```

   If the value attribute that needs to be added for an item of the groupContent cell is "label", then the label attribute for the the destination column needs to be defined in the collapseContent Object and the configuration of the column should look like this:

    ```javascript
      {
          "index": "source",
          "name": "source",
          "label": "SOURCE",
          "collapseContent":{
              "value": "label"
          }
      },
    ```

   where the value attribute in the column configuration refers to the name of the attribute in the data, in this case "label".

- ***formatter***
   Defines the callback function to be used to define a custom format for the value of the cell. It should have a return value with a string data type that could represent a html string. For example:

    ```
     var formatCell = function ($cell, cellvalue, options, rowObject) {
        $cell.find('.slipstreamgrid_cell_item').addClass('newStyle');

        return $cell;
     };
     configurationSample =  {
         ...
         "columns": [
                       {
                           "name": "name",
                           "label": "Name",
                           "formatter": formatCell,
                           ...
                       },
                      ...
                     ]
         ...
     };
    ```

     This property could be used to have a cell with a link and then a event handler could be added to listen for a click on the cell. Clicking on the cell could open a new grid in the existing container. When the grid is used in the framework context, a new intent could be created to replace existing grid with a new one. For example:

  ```
    new Slipstream.SDK.Intent(action, data)
  ```

     where data could contain the data collected in the data-cell property of the cell defined in the formatter function of the column.

- ***unformat***
   It is used when formatter parameter has modified the original cell value. Formatter could introduce some html in the formatter cell; in this case, unformat parameter restore the cellvalue so it can be saved properly later.

- ***showInactive***
   Defines the column that should be used as an input for enabling or disabling a row.

- ***createdDefaultValue***
   Defines the default value for the column when a user creates a new row. The value can be a string or a callback function.

- ***copiedDefaultValue***
   Defines the default value for the column when a user copy and row and then paste it. The value can be a string or a callback function.

  For example:

    ```
    "columns": [
    {
        "index": "context",
        "name": "context",
        "label": "Name",
        "width": 200,
        "formatter":showSubtitle,
        "groupBy":"true"
    }, {
        "index": "inactive",
        "name": "inactive",
        "label": "Inactive",
        "hidden": true,
        "showInactive":"true"
    }, {
        "name": "name",
        "label": "Name",
        "width": 200,
        "hideHeader": "true",
        "copiedDefaultValue":getDefaultCopiedValue,
        "editCell":{
            "type": "input",
            "remote": {
                "url": buildUrl, //should return url string
                "type": "GET",
                "response": processResponse, //should return boolean: true: isValid
                "error":"Name already in use"
            },
            "pattern": "hasnotspace",
            "error":"Spaces are not allowed"
        }
    }, {
        "index": "sourceZone",
        "name": "from-zone-name",
        "label": "Source Zone",
        "createdDefaultValue":getDefaultAddedValue,
        "width": 20,
        "editCell":{
            "type": "input",
            "pattern": "^[a-zA-Z0-9_\-]+$",
            "error":"Enter alphanumeric characters, dashes or underscores"
        }
    }, {
        "index": "sourceAddress",
        "name": "source-address",
        "label": "Source Address",
        "width": 60,
        "collapseContent":"true",
        "createdDefaultValue":"any"
    }, {
        "index": "destinationZone",
        "name": "to-zone-name",
        "label": "Destination Zone",
        "createdDefaultValue":getDefaultAddedValue,
        "width": 20
    }, {
        "index": "DestinationAddress",
        "name": "destination-address",
        "label": "Destination Address",
        "width": 60,
        "collapseContent":"true",
        "createdDefaultValue":"any"
    }, {
        "index": "action",
        "name": "action",
        "label": "Action",
        "width": 20,
        "editCell":{
            "type": "dropdown",
            "values":[{
                "label": "Permit",
                "value": "permit"
            },{
                "label": "Deny",
                "value": "deny"
            }]
        }
    }]
    ```

- ***searchCell***
   Indicates the type of search control that will be added when the columnFilter parameter of the filter section is set to true. If the searchCell is set to true, then a input element will be added on the filter toolbar. If it is absent or set to fall, the search cell will not be available.
 The search cell can have a predefined search element (dropdown, number or date) or a custom search element. It has the following parameters:

  - **type**
  Defines the type of search control. If it is absent, the default search control will be a regular input. Slipstream provides three types of search control: "dropdown", "number" and "date".

    Dropdown represents a drodpdown element with the options defined from the values parameter using the label/value pairs or using remote data. When used with remote data, checkbox:false must be explicitly mentioned in the configuration. Configuration with checkbox:true (default option) implies a checkbox will be shown, and this option only applies to local data. checkbox: false will not display a checkbox, and data can be local or remote.
    For example:

    ```
    "columns": [
      ...
      {
         "index": "sourceAddress",
         "name": "source-address",
         "label": "Source Address",
         "width": 260,
         "collapseContent":true,
         "createdDefaultValue":"any",
         "searchCell": {
             "type": 'dropdown',
             "values":[{
                 "label": "IP_CONV_204.17.79.60",
                 "value": "IP_CONV_204.17.79.60"
             },{
                 "label": "IP_SEC_204.17.79.60",
                 "value": "IP_SEC_204.17.79.60"
             },{
                 "label": "IP_TRE_204.17.79.60",
                 "value": "IP_TRE_204.17.79.60"
             },{
                 "label": "IP_TRE_96.254.162.106",
                 "value": "IP_TRE_96.254.162.106"
             }]
         }
      }
      ...

      ...
    {
        "index": "application",
        "name": "application",
        "label": "Application",
        "width": 260,
        "collapseContent": true,
        "createdDefaultValue": "any",
        "header-help": {
            "content": configurationCallback.getApplicationHelp,
            "ua-help-text": "More..",
            "ua-help-identifier": "ID_UA_PAGE_ZONEPOLICIES_CFG"
        },
        "searchCell": {
            "type": 'dropdown',
            "checkbox": false, // REQUIRED CONFIGURATION FOR USING REMOTE DROPDOWN COLUMN FILTER
            "enableSearch": false,
            "remoteData": {
                "url": "/api/dropdown/getRemoteData",
                "numberOfRows": 10,
                "jsonRoot": "data",
                "jsonRecords": function (data) {
                    return data.data;
                },
                "success": function (data) { console.log("call succeeded" + JSON.stringify(data.data)) },
                "error": function () { console.log("error while fetching data") }
            }
        }
    }
    ...

    ],
    ```

    Date is a search cell that when it is clicked, it shows an overlay with the option to chose from a Specific Date, Range, Before or After toggle button. For example:

    ```
    "columns": [
       ...
       {
           "index": "date",
            "name": "date",
            "label": "Date",
            "width": 200,
            "searchCell":{
                "type": "date"
            }
       }
       ...
    ],
    ```

    Number is a search cell that when it is clicked, it shows an overlay with the option to exactly the same as a number, between two numbers, greater than or lesser than a number. For example:

    ```
    "columns": [
       ...
            "index": "DestinationAddress",
            "name": "destination-address",
            "label": "Destination Address",
            "collapseContent":{
                "formatData": formatData
            },
            "width": 260,
            "createdDefaultValue":"any",
            "searchCell":{
                "type": "number"
            }
       ...
    ],
    ```

    Additionally, user could define its custom controls defining the searchoptions parameter. It allows to customize the toolbar with another widget or a third party control. For example:

    ```
    "columns": [
       ...
       {
           "index": "application-services",
           "name": "application-services",
           "label": "Advanced Security",
           "width": 300,
           "searchCell": {
               "searchoptions": {
                   dataInit: function (element) {
                       new DropDownWidget({
                           "container": element,
                           "data": applicationDropDownData,
                           "enableSearch": true,
                           "multipleSelection": {
                               allowClearSelection: true
                           }
                       }).build();
                   }
               }
           }
       }
       ...
    ],
    ```

    The token created by using custom search cell needs to be added in the token area. To add a token, the search container should trigger an "slipstream-remove-token" custom event. To delete a token, the search container should trigger an "slipstream-remove-column-token" event. For example:

    ```
        $searchContainer.trigger("slipstream-remove-token",{
            "columnName": column.name,
            "searchValue": value
        });
        $searchContainer.trigger("slipstream-remove-column-token",{
            "columnName": column.name
        });
    ```

- ***dragNDrop***
  Defines the column that needs to add drag and drop feature.

  Note:
  1. Cell dragNDrop only works in the simple grid.
  2. During dragging an element, the tooltips are disabled in the grid table. After dropping an element, the tooltips in the grid table will be enabled again.
  3. Must have collapseContent property.

  It has the following parameters:

  Note: Cell dragNDrop only works in the simple grid.

  - **isDraggable**
  Defines the column is draggable. Default: false. Note: this parameter will be ignored while the source is row.

  Note: If user needs to use formatCell config to return the customized html object, grid widget requires one minimum requirement: MUST contain checkbox in the cellItem DOM and the element MUST contain the class, "dragabble-cell-checkbox". If user uses formatCell config to return html object without checkbox or checkbox without the specified class, it will cause drag-n-drop in the grid to fail.

```
    Default html:
    <span class="cellContentValue cellItem  ui-draggable">
      <input type="checkbox" class="dragabble-cell-checkbox">Label 1
      <input type="checkbox" class="dragabble-cell-checkbox">Label 2
    </span>
    Return updated html (Example):
    <span class="cellContentValue cellItem  ui-draggable">
      <div><input type="checkbox" class="dragabble-cell-checkbox"><span class="icon"></span><span>Label 1</span></div>
      <div><input type="checkbox" class="dragabble-cell-checkbox"><span class="icon"></span><span>Label 2</span></div>
    </span>
```

  - **isDroppable**
  Defines the column is droppable. Default: false.

  - **isDraggableHelperData**
  Defines the column to be the draggable helper if the dragNDrop source is row. Default: the column content defined for jsonId. Note: need this parameter only when the grid dragNDrop source is row.

  - **groupId**
  A named drag drop group to which this column belongs. If a group is specified, then this column only interact with other drag-n-drop objects in the same group. If a group is not specified, then this column can interact with all droppable columns, which isDroppable is true.

  - **callbacks**
  A set of callbacks are defined for the specific column.

  a. ***beforeDrag***
    This callback is defined for the specific column only. The callback is triggered when the draggable element start dragging. The callback needs to return either true, false or an object with the error message. Default: true

    Note: This column level beforeDrag callback will overwrite the beforeDrag in the grid level.

    - If the validation is passed and grid should update the cell content, then return true.
    - If the validation is false or want to bypass the default workflow in order to create a custom behavior when start dragging, then return false.
    - If the validation is false and also need to show default error message, then return an error object.

    The callback passes an object which contains some data.
    - ***(Array) data***: The data of the dragging element
    - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
    - ***(Array) draggableItems***: The dragging elements. Note: ONLY pass during item-to-cell drag and drop.
    - ***(jQuery Object) $draggableCell***: The dragging cell
    - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
    - ***(jQuery Object) helper***: The helper element

  b. ***hoverDrop***
    This callback is defined the default hoverDrop callback for all droppable columns. The callback is triggered when the draggable element hovers the droppable element. The callback needs to return either true or false. Default: true

    Note: The column level hoverDrop callback will overwrite the hoverDrop callback in the grid level.

    - If the validation is passed and grid should show the default workflow, then return true.
    - If the validation is false, grid will return to original position.

    The callback passes an object which contains some data.
    - ***(Array) data***: The data of the dragging element
    - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
    - ***(Object) hoveredCellColumn***: The index and name of the hovered cell column
    - ***(Array) draggableItems***: The dragging elements. Note: ONLY pass during item-to-cell drag and drop.
    - ***jQuery Object) $draggableCell***: The dragging cell
    - ***jQuery Object) $hoveredCell***: The droppable cell is hovered
    - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
    - ***(Object) hoveredRow***: The rowData and rawData of the hovered cell
    - ***(jQuery Object) helper***: The helper element

  c. ***afterDrop***
    This callback is defined for the specific column only. The callback is triggered after the draggable element drops in the droppable element. The callback needs to return either true, false or an object with the error message. Default: true

    Note: This column level afterDrop callback will overwrite the afterDrop in the grid level.

    - If the validation is passed and grid should update the cell content, then return true.
    - If the validation is false or want to bypass the default workflow in order to create a custom behavior after drops, then return false.
    - If the validation is false and also need to show default error message, then return an error object.

    The callback passes an object which contains some data.
    - ***(Array) data***: The data of the dragging element
    - ***(Object) draggableCellColumn***: The index and name of the dragging cell column
    - ***(Object) droppableCellColumn***: The index and name of the droppable cell column
    - ***(Array) draggableItems***: The dragging elements. Note: ONLY pass during item-to-cell drag and drop.
    - ***jQuery Object) $draggableCell***: The dragging cell
    - ***jQuery Object) $droppableCell***: The droppable cell
    - ***(Array of objects) draggableRows***: The rowData and rawData of the dragging cell or the dragging row(s). When selecting all, in the draggableRows objects, some might have rowData if the rows are in the DOM, but some will only have id if grid does not have rowData for them. Also, if rows are not in the DOM, the rawData is an empty object.
    - ***(Object) droppableRow***: The rowData and rawData of the droppable cell
    - ***(jQuery Object) helper***: The helper element
    - **(Function) updateColumnVisualEffect($dropCell)**: this function updates the visual effects by highlighting the dropped cell for 3 seconds. If we return true in the afterDrop callback, grid widget will update this visual effect automatically. If we return false in the afterDrop callback, even grid widget won't implement this visual effect, developers still can use this function to provide the same visual effect that the grid widget has implemented.

    ```
    "columns": [
      ...
      {
        "index": "sourceAddress",
        "name": "source-address",
        "label": "Source Address",
        "width": 260,
        "collapseContent":true, // we must make sure the column is collapseContent: true, while using drag and drop
        "createdDefaultValue":"any",
        "dragNDrop":{
          "isDraggable": true,
          "isDroppable": true,
          "groupId": "address",
          "callbacks": {
            beforeDrag: sourceAddressBeforeDrag,
            hoverDrop: sourceAddressHoverDrop,
            afterDrop: sourceAddressDropCallback
          }
        }
      }
      ...
    ]
    ```

    ```
    var sourceAddressBeforeDrag = function(data){
        console.log(data);
        data.helper.attr("data-grid-demo", "this is payload data again.");
        return true;
    };
    var sourceAddressHoverDrop = function(data){
        console.log(data);
        //return true;
        return false;
    };
    var sourceAddressDropCallback = function(data){
        console.log(data);
        //return true with the default workflow if the validation is passed
        //return true;
        //return false without showing any behavior if the validation is NOT passed or in order to create the custom behavior after drops.
        //return false;
        //return the following object if the validation is NOT passed in order to show the error message by default
        return {isValid: false, errorMessage: 'This is testing error message.'};
    };
    ```

- ***contextMenu***
Defines the context menu items that a column could have when a user right click on a cell. The items are added at the end of the current row context menu. It is defined in the same way as the context menu for a row. It is defined as an object with the reserved keys: copyCell (copies a cell value), pasteCell (pastes a cell value), and searchCell (adds the cell value on a token and triggers the search). Each key has a corresponding string that represents the text that will be showed for the context menu item. Additionally, it has the custom parameter which is an array with key/label pairs. It allows to define custom items for the cell context menu. The key parameter should be unique across the grid the configuration and the label parameter defines the text that will be showed in the context menu that represents the cell context menu item. For example, one of the columns across the grid configuration (columns parameter) might include:

    ```
      ...
      "columns": [
            {
                "name": "name",
                ...
                "contextMenu": {
                    "copyCell": "Copy Cell",
                    "pasteCell": "Paste Cell",
                    "searchCell": "Search Cell",
                    "custom":[{ //user should bind custom key events
                        "label":"Cell Menu 11",
                        "key":"cellMenu11"
                    },{
                        "label":"Cell Menu 12",
                        "key":"cellMenu12"
                    },{
                        "label":"Cell Sub Menu",
                        "key":"cellSubMenu1",
                        "items": [{
                            "label":"Cell Sub Menu 11",
                            "key":"cellSubMenu11"
                        },{
                            "label":"Cell Sub Menu 12",
                            "key":"cellSubMenu12"
                        }]
                    }]
                }
            },
            ...
       ]
       ...
    ```

    The key associated to the context menu item could be used to bind the event that is triggered by the grid when the item in the context menu is clicked. The key has to be available in the actionEvents parameter in the grid configuration. The bind provides the selectedRows, for example:

    ```
    var actionEvents = {
        cellMenu11: {
        	"name": "cellMenuAction",
        	"handler": [cellMenuHandler]
        }
    };
    new GridWidget({
        container: gridContainer,
        elements: gridConfiguration,
        actionEvents: actionEvents,
    }).build();
    ```

    Where cellMenuHandler is:

 ```javascript
    var cellMenuHandler = function (event, selectedRows) {
		        console.log(self.actionEvents.cellMenu11 + ": ");
		        console.log(selectedRows);
    };
```

    When the user select "Cell Menu 11" (key:cellMenu11) in the row context menu, then the event for cellMenu11 is triggered. The handler gets invoked with the event and the selectedRows parameter. selectedRows is an object with the selected row(s) and the column that was selected when the row context menu was opened. The selectedRows parameter includes the following properties:

    - $rowAndTable: Array of Objects with the $row (jQuery object of the row), $table (jQuery object of the table), rawRow (original row data retrieved from the API), rowData (row data as it is in the grid widget)
    - cellColumn: Object with the index and name of the column where the context menu was opened. If the column has cell item (collapseContent) with multi selection enabled (by column property with multiselect or drag and drop -cell to cell-) then the selectedCellItems object will be added. selectedCellItems includes the $itemDom (array with the DOM items -jQuery Object-), itemValue (array with the value of the selected items) and $cell (cell DOM -jQuery Object-). The content of the DOMs provided in this property can change at any moment so it's not recommended to rely on its internal. The user of the widget could add some style classes at the top of the wrapper for some basic styling.
    - isRowCopied: boolean that indicates if a row was copied
    - isRowDisabled: boolean that indicates if a row was disabled
    - isRowEnabled: boolean that indicates if a row was enabled
    - numberOfSelectedRows: number of selected rows
    - selectedRowIds: Array with the ids of each of the selected rows
    - selectedRows: Array with the data of each of the selected rows
    - selectedRowsDom: Array with the dom of each of the selected rows

    **validationTime**
    Defines the wait time before the input field validation is triggered. Used in conjunction with the editCell, input type parameter.

    **contextMenu**
    Defines a context menu available when user does a right click on a row. The available options are:

    - ***edit***
       Provides edit capabilities to a row. The value represents the label to be showed in the context menu.
    - ***enable***
       Allows to enable a row. It is showed with the default row style. The value represents the label to be showed in the context menu.
    - ***disable***
       Allows to disable a row. It is showed with the disabled row style. The value represents the label to be showed in the context menu.
    - ***createBefore***
       Allows the creation of a row before a selected row. The value represents the label to be showed in the context menu.
    - ***createAfter***
       Allows the creation of a row after a selected row. The value represents the label to be showed in the context menu.
    - ***copy***
       Allows the creation of a row before a selected row. The value represents the label to be showed in the context menu.
    - ***pasteBefore***
       Allows a row to be pasted  after a selected row. The value represents the label to be showed in the context menu.
    - ***pasteAfter***
       Allows a row to be pasted after a selected row. The value represents the label to be showed in the context menu.
    - ***delete***
      Allows to delete one or more rows. The value represents the label to be showed in the context menu.
    - ***quickView***
      Adds the quick view action for a row. It is available from the context menu or the action column. From the action column, the quick view icon is available on the left side of the grid (next to the selection column) and it is shown on hover of a row. The value of the quickView key of the contextMenu Object represents the item that will be shown in the context menu. Once the quick view is selected by clicking on the quick view icon or selecting the item in the menu, the quickViewEvent event is triggered. The data associated with the event is the quick view row data and the current selected rows details (nonQuickViewSelectedRows property). In fact, the current selected row could be the same as the quick view row or it could not include the quick view row. The user of the widget that listen for the quickViewEvent should open a view that shows the details of the row when the quickViewEvent event is triggered. Once the detail view is closed, the grid method: removeQuickView should be called, so the grid can remove the quick view indication from the row.
    - ***clearAll***
      Clears the current row selection.
    - ***custom***
       Allows to define a set of custom actions. It is defined as a label/key/isDisabled set where label - is the value that will be showed in the context menu, key - the custom event that will be triggered when the user select this option on the context menu and isDisabled - function to enable/disable a menu item. return true for disable.

    For example:

    ```
    "contextMenu": {
        "edit": "Edit Rule",
        "enable":"Enable Rule",
        "disable":"Disable Rule",
        "createBefore": "Create Rule Before",
        "createAfter": "Create Rule After",
        "copy": "Copy Rule",
        "pasteBefore": "Paste Rule Before",
        "pasteAfter": "Paste Rule After",
        "delete": "Delete Rule",
        "custom":[{ //user should bind custom key events
                "label":"Reset Hit Count",
                "key":"resetHit"
                "isDisabled": function(eventName, selectedItems) {
                  return true;
                }
            },{
                "label":"Disable Hit Count",
                "key":"disableHit"
            }]
    },
    ```

    For example:

    ```
    {
        var configurationSample = {
              "title": "Recent Logs",
              "url": "/assets/js/widgets/grid/conf/dataSample.json",
              "height": 192,
              "tooltip": "Tooltip text",
              "sortorder": "desc",
              "sortname": "id",
              "multiselect":true,
              "tableId":"test",
              "columns": [
                           {
                                "index": "id",
                                "name": "id",
                                "label": "Inv",
                                "width": 60
                            },{
                                "index": "invdate",
                                "name": "invdate",
                                "label": "Date",
                                "width": 120
                            }, {
                                "index": "name",
                                "name": "name",
                                "label": "Client",
                                "width": 100
                            }, {
                                "index": "note",
                                "name": "note",
                                "label": "Note",
                                "sortable": false,
                                "width": 150
                  }]
          };
    }
    ```

    **contextMenuItemStatus**
    Defines a callback function that allows to enable or disable an item menu from the more menu of the action area or the context menu of a row. The input parameters are: key (the key of the item menu), isItemDisabled (default status provided by the grid depending on the row selection), and selectedRows (current selected rows). The output of the function should be the status of the item menu: true if the item should be disabled and false if the item should be enabled. For example:

     ```
     "contextMenuItemStatus": function (key, isItemDisabled, selectedRows){
        if (key=='resetHitEvent')
            isItemDisabled = true;
        else if (key=='disableHitEvent' && selectedRows.length>0
            isItemDisabled = false;
        return isItemDisabled;
    },
     ```

    **contextMenuStatusCallback**
    Defines a callback function that allows to define an asynchronous call to an API that could provide the status of each item in a context menu. The input parameters are: selectedRows, updateStatus and  updateStatusError. selectedRows is and object with the current selected row. updateStatus is callback that should be invoked when an asynchronous request is completed on success. The callback should be called by passing as parameter the status of each item in the context menu. Each item in the object is a pair with the key of the context menu and the status: true for enabled and false for disabled. updateStatusError is a callback that should be invoked when the request was completed on error. It should be invoked by passing an error message. For example:

     ```
     var setContextMenuStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
            var isRowEditable = !(~selectedRows.selectedRowIds.indexOf('183002-PSP_to_Cogent_-_BP___Internet_-_11-30-2009_PSP_to_Cogent'));
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
                success: function(data) {
                        updateStatusSuccess({
                        "edit": selectedRows.numberOfSelectedRows == 1 && selectedRows.isRowEnabled && isRowEditable ? true : false,
                        "copy": selectedRows.numberOfSelectedRows > 2 ? true : false,
                        "disableHitEvent": selectedRows.numberOfSelectedRows > 1 ? true : false,
                        "subMenus": selectedRows.numberOfSelectedRows > 0 ? true : false,
                        "subMenu3": selectedRows.numberOfSelectedRows > 3 ? true : false
                    });
                },
                error: function() {
                    updateStatusError("Update in the status of the context menu items FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
                }
            });
        };
     ```

    **actionButtons**
    Defines the custom buttons, menus and icons that can be added to action area of the grid widget. It has the statusCallback property that allows to disable or enable an action icon or button depending on the row selected. For example:

    ```
          "actionButtons":{
                "actionStatusCallback": setCustomActionStatus,
                "defaultButtons":{ //overwrite default CRUD grid buttons
                    "create": {
                        "label": "Create Menu",
                        "key": "createMenu",
                        "items": [{
                            "label":"Create Menu1",
                            "key":"createMenu1"
                        },{
                            "label":"Create Menu2",
                            "key":"createMenu2"
                        }]
                    }
                },
               "customButtons":
                    [{
                        "button_type": true,
                        "label": "Publish",
                        "key": "publish"
                    },{
                        "button_type": true,
                        "label": "Save",
                        "key": "save",
                        "secondary": true
                    },{
                        "icon_type": true,
                        "label": "Close",
                        "icon": "icon_exit_filters_hover",
                        "key": "close"
                    },{
                        "icon_type": true,
                        "label": "Close",
                        "icon": {
                            default: "icon_exit_filters_hover",
                            hover: "icon_exit_filters",
                            disabled: "icon_exit_filters_disable"
                        },
                        "key": "close2"
                    },{
                        "menu_type": true,
                        "label":"Split Action",
                        "key":"subMenu",
                        "items": [{
                            "label":"SubMenu1 Menu1",
                            "key":"subMenu1"
                        },{
                            "label":"SubMenu1 Menu2",
                            "key":"subMenu2"
                        },{
                            "separator": "true"
                        },{
                            "label":"SubMenu1 Menu3",
                            "key":"subMenu3"
                        }]
                    }],
                "statusCallback": setItemStatus
            },
    ```

    It has the following parameters:

    - **actionStatusCallback**
    Defines a callback that will be invoked when a user selects on a row. Depending on the row value, the action icons or action menus could be enabled or disabled. The callback has the selectedRows, updateStatusSuccess and updateStatusError parameters. selectedRows is the object with data collected for the selected row or rows. updateStatusSuccess is a callback that should be invoked with one parameter: an object that contains a pair of key/value composed by the key of the icon/button and the status that the icon/button should have: true (enabled), disabled (false).  updateStatusError will allow to set an error message in case the API request to get the status of the icons and/or buttons fail. For example, the actionStatusCallback could be defined as:

    ```
        var setCustomActionStatus = function (selectedRows, updateStatusSuccess, updateStatusError) {
            $.ajax({
                type: 'GET',
                url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
                success: function(data) {
                    updateStatusSuccess({
                        "edit": selectedRows.isRowEnabled ? true : false,
                        "testCloseGrid": selectedRows.numberOfSelectedRows > 1 ? true : false,
                        "testPublishGrid": selectedRows.numberOfSelectedRows == 1 ? true : false,
                        "testSaveGrid": selectedRows.numberOfSelectedRows > 0 ? true : false
                    });
                },
                error: function() {
                    updateStatusError("Update in the action status FAILED. Selected rows: " + selectedRows.numberOfSelectedRows);
                }
            });
        };
    ```

    - **defaultButtons**
    Overwrites the default custom buttons for create, edit and delete. It is defined as an array of objects where the key of the object is the name of the action that should be overwritten (create, edit or delete), and the value is an object composed by: label, key and items (array with the items of the menu as per the context menu widget interface of the items). You can display a overridden default button as a menu, a button, or an icon. For example, the defaultButtons object would be defined as:

    ```
        "defaultButtons":{
            "create": {
                "menu_type": true,
                "label": "Create",
                "key": "createMenu",
                "items": [{
                    "label":"Open grid overlay",
                    "key":"createMenu1"
                },{
                    "label":"Create Menu2",
                    "key":"createMenu2"
                }],
                "disabledStatus": false,
                "statusCallback": setCustomMenuStatusAdd
            },
            "delete": {
                "button_type": true,
                "label": "Publish",
                "key": "deleteButton",
                "disabledStatus": false
            },
            "edit":{
                "icon_type": true,
                "label": "Close",
                "icon": {
                    default: "icon_archive_purge",
                    hover: "icon_archive_purge_hover-bg",
                    disabled: "icon_exit_filters_disable"
                },
                "disabledStatus": false,
                "key": "editIcon"
            }
        }
    ```

    - **customButtons**
    Defines new buttons, icons and menus to be showed in the action area. It is defined as an array of objects. Each object represents the new button. It has the following parameters:

    *button_type*: the action will be added as a button. Optionally,the secondary parameter can be added to state that the button should show as a secondary button.

    *icon_type*: the action will be added as an icon. Object/string, represents the icon that will be shown when the icon_type is enabled. It has the properties: default, hover and disabled. They represent the icon path and CSS class that contains the icon asset and properties.
    *default* It can be an Object or a string. If "default" is an Object (recommended option), then icon_url, icon_class and icon_color properties are available. "icon_url", required, is the path to the asset; the icon should be a SVG and not have a fill color so it is *themable*. icon_class, required, is the class that will be applied to the SVG and should include the dimensions of the SVG. icon_color, optional, represents the CSS class with the fill color of the icon. If it is absent, then the default Slipstream icon color will be used ($action-icon-color). If "default" is a String, then the class should include the icon that will be shown and it will be applied as a background of the icon container. This type of icon can not be themable.
  *hover*
  It is a string with the class name that will be used when an icon is hovered. If default.icon_url was used, then it should define the fill color of the icon on hover, if the "hover" property is absent, then the default Slipstream hover color will be applied. If default was a string, then hover should include the background icon that should be shown on hover.
  *disabled*
  It is a string with the class name that will be used when an icon is disabled. If default.icon_url was used, then it should define the fill color of the icon on disable, if the "disabled" property is absent, then the default Slipstream disabled color will be applied. If default was a string, then disabled should include the background icon that should be shown if the icon is disabled.

    *menu_type*: the action will be added as a menu. Requires the items parameter to indicate the items that will be showed in the
    menu. Each item is composed by label and key parameters.
    label: label of the action
    key: id of the action


    *dropdown_type*: the action will be added as a dropdown. Requires the items parameter to indicate the items that will be showed in the
        dropdown. Each item is composed by label and key parameters.
        label: label of the action
        key: id of the action

    *custom_type*: the action will be added as a custom html. Requires the key (id of the action) and formatter callback to indicate the html that will be inserted in the action and it should contain: default, hover and disabled which corresponds to the html that will be inserted by default, on hover, on when the action is disabled. Additionally, unformat should be provided if the action should be part of the more Menu when the grid width is smaller and there is no area to show the action (grid responsiveness). If it is omitted, the action will be shown even on smaller width.

    If button_type, icon_type or menu_type is not defined for a default button in the defaultButtons Object, then the button will default to a menu_type.

    For example, customButtons attribute in the gri configuration can be defined as follow:

```javascript
    ...
    "customButtons": [
            {
              "button_type": true,
              "label": "Publish",
              "key": "testPublishGrid",
              "disabledStatus": true //default status is false
            },{
                "icon_type": true,
                "label": "Close 1",
                "icon": {
                    default: "icon_archive_purge",
                    hover: "icon_archive_purge_hover-bg",
                    disabled: "icon_exit_filters_disable"
                },
                "disabledStatus": true,//default status is false
                "key": "testCloseGrid1"
            }, {
                "menu_type": true,
                "label": "Grids on Overlay",
                "key": "subMenu",
                "disabledStatus": true, //default status is false
                "items": [
                    {
                        "label": "Large grid",
                        "key": "subMenu1"
                    },{
                        "label": "Small grid",
                        "key": "subMenu2"
                    },{
                        "separator": "true"
                    },
                    {
                        "label": "Add row",
                        "key": "subMenu4"
                    }
                ],
                "statusCallback": setCustomMenuStatusSplit
            },{
                "dropdown_type": true,
                "label": "Group by",
                "key": "dropdownKey",
                "disabledStatus": true, //default status is false
                "items": [
                    {
                        "label": "None",
                        "key": "noneDropdown",
                        "selected": true
                    },
                    {
                        "label": "One",
                        "key": "oneDropdown"
                    },
                    {
                        "label": "Many",
                        "key": "manyDropdown"
                    }
                ]
            }, {
                "custom_type": true, //should be able to return label, selected value, items, width -might be from width()-
                "formatter": getCustomActionHtml, //callback that should return Object with html to be used in the action container, default property is a required field
                "unformat": unformatCustomActionHtml, //string to be used in the more menu
                "key": "customLinkAction",
                // "disabledStatus": true//default status is false
            }
        ]
    ...
```

- **statusCallback**
Defines the function callback that will be called to set the status of the items in the menu.

**rowHoverMenu**
Defines the icons, buttons and menu that can be added to the action bar that is showed when a row is hovered. The action bar is composed by the default buttons: edit and delete and the custom buttons defined in the customButtons property. The event for each action key should be available in conf.events to have the icon rendered. The default events for edit is editOnRowHover and for delete is deleteOnRowHover. For example:


```javascript
    "rowHoverMenu": {
            "defaultButtons": {
                "edit": false
            },
            "customButtons": [{
                "button_type": true,
                "label": "Clone",
                "key": "testCloneHover",
                "icon": "icon_clone_blue"
            },{
                "label": "Info",
                "key": "testInfoHover",
                "disabledStatus": true, //default status
                "icon": {
                    default: "icon_info_hover",
                    disabled: "icon_info_disabled"
                }
            }]
        },
```

All actions will be added to the more menu unless they define the type of action: icon_type, button_type or menu_type. For example, in the above configuration, if the corresponding action event was defined, then, Clone button and More menu will be rendered. More menu will have the items: Create and Info.

A menu action is built using the contextMenu widget; therefore, all options available in the configuration of its elements property can be included in action configuration. For example, an item menu could include a checkbox and add the callbacks required when the checkbox is clicked. More details of the elements options can be found at [ContextMenu widget](public/assets/js/widgets/contextMenu/contextMenu.md)

rowHoverMenu could be an Object or a function. If it's a function, then it should return an Object with the same properties as if the rowHoverMenu value was an object. The rowHoverMenu function will be invoked every time a user hovers on a row. The input value of the function callback will be rowId (id of the row), rowData (current data of the row) and originalData (original data of the row). For example:

```
    "rowHoverMenu": function (rowId, rowData, originalData) {
        console.log(rowId);
        return {
            "defaultButtons": {
                "edit": false
            },
            "customButtons": [{
                "label": "Clone",
                "key": "testCloneHover",
                "icon": "icon_clone_blue"
            },{
                "label": "Info",
                "key": "testInfoHover",
                "disabledStatus": true, //default status
                "icon": {
                    default: "icon_info_hover",
                    disabled: "icon_info_disabled"
                }
            }]
        }
    }
```

 The rowHoverMenu callback return value or the value of the rowHoverMenu Object should be composed by the defaultButtons and customButtons properties. defaultButtons should be used to turn off the default edit and delete icons. customButtons is an array of Objects. Each customButton Object could have the following properties:

- icon: defines the icons to be showed when a row is on hover. It is defined as a string or an array of objects. If it is a string, the same icon will be showed when the action is enable or not. If it is an object, then the icon Object could include the default and disabled properties for the default icon and disabled icon respectively.
- label: defines the label of the action that will be showed on a tooltip.
- key: the id of the action which should match the id defined in the conf.events object to have the icon rendered.

**viewType**
Optional property that allows to render the grid with a different visual style. It is a string that could have one of the two values: "card" or "list":
 - "card" is available ONLY for the regular grid and allows to presents the rows with a card style; for example, rows are clearly separated from each other.
 - "list" is available ONLY for the regular and nested grid and allows to presents the rows with a list style; for example, rows are listed in hierarchy instead of being elements of table.


### actionEvents
Defines the name, handler and the RBAC capabilities of the custom events and grid default events that Grid Widget will trigger when an action performed. If there is no capabilities defined, the default is to enable the event.

The custom events are defined by the user of the widget by using the conf.elements configuration (actionButtons, contextMenu, filter.showFilter, etc.) or enabling some of the row action events. The available row events are:

**createEvent**
Triggers when a user creates a row.

**updateEvent**
Triggers when a user updates a row.

**deleteEvent**
Triggers when a user deletes one or more rows. It provides an object with the rows that were deleted (only for the pages that were visited by the user). It also includes the selectedRows and isSelectAll properties. isSelectAll property will be false for all cases except if select all checkbox was selected. It will also be true even if after that select all was checked, some rows were unselected. Only when select all was clicked again to clear all the selections, then it will return false again. The selectedRows property is an object that contains the id of all selected rows (if it was provided by the onSelectAll callback); otherwise, it will include the id of the rows for the pages the user has visited.

**copyEvent**
Triggers when a user copies a row.

**pasteEvent**
Triggers when a user paste a row that was copied from the event above.

**clearAllEvent**
Triggers when the clearAll item from the context menu or the more button is clicked. It returns the previous selected rows since the final current selection is set to zero.

**statusEvent**
Trigger when a user enable or disable a row.

Adding any of the events above in the actionEvents configuration will enable the corresponding row action; for example, createEvent will enable the create row icon.

***actionEvents property***

actionEvents is an Object (hash) with each key representing the event that needs to be binded. The value of a key should be an Object that contains the name, handler and capabilities property.

1. **name**: It represents the name of the event. It is a required field for all custom events (either defined by the user of the widget or enabled from the default row events listed above).
2. **handler**: It defines the handlers that will be invoked when an action is clicked (for example, the edit button is clicked - key: updateEvent) or an event is triggered (for example, the grid is loaded - key: gridLoaded). It is represented by an array, and it allows to have multiple handlers for the same action/event.
3. **capabilities**: It defines the capability name.

For example:

```
	var actionEvents = {
		"updateEvent": {
			"name": "UpdateFirewallPolicies",
			"handler": [updateCallback1, updateCallback2],
			"capabilities" : ["ModifyPolicy"]
		},
		"gridLoaded": {
			"handler": [gridLoadedCallback]
		},
    };
```

where for the updateEvent event, name is a required field and the updateCallback1 and updateCallback2 handlers are callback that will be invoked when the updateEvent action is triggered. The callback/function will be invoked with two parameters: events and updateEventData. All callbacks will have the same input parameters. For the gridLoaded event, this event is available even if it is not defined in actionEvents; therefore, it is not required to define the "name" property.

### cellOverlayView
Defines the view that the grid widget will show when a cell is edited. The key of the object represents the name assigned to the column (elements section, column/name parameter) and the value is the instance of the view to be rendered when that column is selected.
For example:

```
var cellViews = {
        'source-address' : sourceAddressView,
        'destination-address' : destinationAddressView,
        'application' : applicationView
    }
```

The view should comply with Slipstream definition of a view. For example:

```
var sourceAddressView = new SourceAddressView({
        'model': new ZonePoliciesModel.address.collection(),
        'save': _.bind(self.save, self),
        'close': _.bind(self.close, self),
        'columnName': 'source-address'
    });
```

Finally, the view is rendered on an overlay and grid widget custom events should be triggered to allow the grid widget to update data accordingly.

1. Save
To save the data, the "updateCellOverlayView" event should be triggered and should include an array with the updated values for the cell. For example:

```
this.$el.trigger('updateCellOverlayView',{'columnName':columnName,'data':data});
```

2. Cancel
To close the overlay, the "closeCellOverlayView" event should be triggered. For example:

```
 this.$el.trigger('closeCellOverlayView', columnName);
```

### cellTooltip
Defines a callback that will be executed for those HTML elements that have the data-tooltip attribute. It results on a tooltip with a view provided in this callback. It provides the cellData and renderTooltip parameters. cellData is an object that includes: columnName (name of the column where cell is located), rowId (id of the row), cellId (value of the data-tooltip attribute), $cell (jQuery object for the cell or item with the data-tooltip attribute), rowData (data of the row). renderTooltip is a callback that should be invoked to provide the view to be showed in the cell tooltip. It expects the view (content of the tooltip) and position (location of the tooltip, by default it's bottom). For example for the following grid configuration:

```
    new GridWidget({
        container: this.el,
        elements: simpleGrid,
        actionEvents:this.actionEvents,
        cellTooltip:this.cellTooltip
    });
```

The cellTooltip callback could be the following:

```
    cellTooltip: function (cellData, renderTooltip){
        $.ajax({
            type: 'GET',
            url: '/assets/js/widgets/grid/tests/dataSample/addressBookGlobal.json',
            success: function(data) {
                renderTooltip(cellData.cellId + "<br/>"
                              + cellData.columnName + "<br/>"
                              + data.address[0].name);
            }
        });
    },
```

### search
Defines the tokens/filters that will be applied before the grid is rendered for the first time. It is an array of string where each element represents the token to be applied. 
For example: if queryBuilder ("queryBuilder" : true) is used for Advance search, then the value will be as a search string. 

```
    this.gridWidget = new GridWidget({
        container: this.el,
        elements: configurationSample.simpleGrid,
        search: this.search,
        actionEvents:this.actionEvents,
        cellTooltip:this.cellTooltip
    });
```

where:

```
    this.search = [
        "sourceAddress = IP_CONV_204.17.79.60, IP_SEC_204.17.79.60",
        "Destination Address >= 3",
        "PSP",
        "name = test"
    ];
```

If queryBuilder is true in config, then the above search string will be as follows:

```
    this.search = "sourceAddress = IP_CONV_204.17.79.60, IP_SEC_204.17.79.60 AND DestinationAddress >= 3 AND PSP AND name = test"
```

### onConfigUpdate
Represents a callback that is invoked by the grid when a user has modified the current grid configuration. The callback is called when:
1. The width of a column has been expanded or collapsed (event: slipstreamGrid.updateConf:columns is triggered)
2. The order of the columns has been modified (event: slipstreamGrid.updateConf:columns is triggered)
3. A column has been hidden or showed (event: slipstreamGrid.updateConf:columns is triggered)
4. A column has been sort (event: slipstreamGrid.updateConf:sort is triggered)
5. A token that filters the grid has been added or deleted (event: slipstreamGrid.updateConf:search is triggered)
The implementation of the onConfigUpdate callback could save the user preferences or new configuration passed as a parameter of the callback.

For example, if the grid configuration is the following:

```javascript
    new GridWidget({
        container: this.el,
        elements: configurationSample.simpleGrid,
        onConfigUpdate: onConfigUpdate
    });
```

Then, the onConfigUpdate callback could be the following:

```javascript
    var onConfigUpdate = function(updatedConf) {
        Slipstream.SDK.Preferences.save(preferencesPath, updatedConf); //API that saves user preferences
    };
```
### sid

An optional, globally unique static id used for identifying an instance of the widget. The sid takes the form

```
s_1:s_2:...:s_n
```

Where *s_n* is the n-th component of the static id.

For example, *juniper.net:security-management:firewall-policy-grid* could be used as the static id that uniquely identifies a grid containing firewall policies created by a Juniper-supplied plugin named security-management.

Once the *sid* for a widget instance is assigned, the same *sid* must be provided every time the widget is instantiated.

The *sid* is optional but must be provided if the plugin wishes the widget instance’s configuration to be auto-saved/restored across instantiations.

**Notes**:

If an *onConfigUpdate* callback is provided it will be called whenever the grid configuration is modified and the configuration will *not* be automatically persisted.  The configuration will only be automatically persisted if the *sid* is provided and no *onConfigUpdate* callback is provided.

Any column configuration that has been persisted automatically will be reconciled with the column configuration that is provided in the grid's configuration object when the grid is instantiated.  If a column exists in the provided configuration and not in the persisted configuration it will be included in the grid's configuration and persisted.  If a column exists in the persisted configuration but not in the provided configuration it will not be included in the grid's configuration and will be removed from the persisted configuration.

### preferences

A part of the grid configuration that contains configurations related to preferences

#### override

An optional configuration object which contains an array of paths to configuration items that need to override their corresponding saved preferences.

For example, if sorting and search for a grid need to use the values provided in the grid config as opposed to the saved preferences, the following config option would achieve that.
```
var gridConfig = {
    "elements": {
        "columns": {...},
        "sorting": [...]
    },
    "preferences": {
       "override": ["search", "elements.sorting"]
   }

}
```

## Build
Adds the dom elements and events of the Grid widget in the specified container. For example:

```
{
    gridBuilder.build();
}
```

## Destroy
Clean up the specified container from the resources created by the Grid widget.

```
{
    gridBuilder.destroy();
}
```

## Usage

To add a Grid widget in a container, follow these steps:
1. Instantiate the Grid widget widget and provide the configuration object the list of elements to show (list) and the container where the Grid widget will be rendered
2. Call the build method of the Grid widget widget

Optionally, the destroy method can be called to clean up resources created by the Grid widget widget.

```
{
    var gridBuilder = new gridWidget({
            "container": this.$el,
            "elements": configurationSample,
            "actionEvents":this.actionEvents,
            "cellOverlayViews":this.cellOverlayViews
        });
    gridBuilder.build();
}
```

The Grid widget can be used in the context of Slipstream or outside of it. If the Grid widget is used without Slipstream, the container (html markup) that will include the Grid page needs to include a div with id="overlay_content" under a location that spans 100% of height and width of the container. This is required by the Overlay widget to render itself with the proper size and at the proper location.


## Utility Methods
The Grid widget provides some utility methods like addRow, getSelectedRows, getFilterContainer, filterGrid, reloadGrid and others.

### addRow
Adds a row or rows to the grid. It requires the data parameter (data of the new row). The location of the row in the grid might be provided by using the location parameter; if it's not available, it will take the configuration parameter (saveRow.addLast). If it's absent, it will assume that the location of the new row is the first one. The location parameter and addLast attribute will be ignored when the data is reload from the API and a sorting mechanism is provided. For example:

```
this.grid.addRow(data);
```

### deleteRow
Delete a row(s) to the grid. This method takes two parameters. One is row id(s) and the other is boolean value to define if the grid widget should reset all selections or not. Default is that grid widget always resets selection after deletes.

Note: this method only supports within simple grid, group grid and tree grid. Nested grid can not use this method.

For example:

```
this.grid.deleteRow('id'); //Reset selections

or

this.grid.deleteRow(['id1', 'id2', 'id3'], false); //Keep the current selections
```

### addEditModeOnRow
Get a row from view mode to edit mode so the values can be updated. The method requires the rowId parameter which is the row id assigned to the row. For example:

```
this.grid.addEditModeOnRow(rowId);
```

### removeQuickView
Removes the quick view mode of a row by removing a quick view icon associated to the row. The method is required when the quickViewEvent is triggered, and then a quick view is opened by the user of the grid widget. When the final user closes the quick view, the user of the widget needs to inform to the grid widget that the quick view has been closed. For example:

```
this.grid.removeQuickView();
```

### getNumberOfRows
Provides the number of records available in the grid. For example:

```
this.grid.getNumberOfRows();
```

### getSelectedRows
Provides all the selected rows. For example:

```
this.grid.getSelectedRows();
```

Additionally, the grid triggers a "gridOnRowSelection" event. An event handler could be added to listen for this event. For example:

```
gridContainer.bind("gridOnRowSelection", function(e, selectedRows){
    console.log(selectedRows);
});
```

The selectedRows object has the parameters: currentRow, selectedRowIds and selectedRows. The currentRow represents the row that trigger the events with rowId and selected parameter. Selected parameter is set to true if the row was selected and false if it was unselected.

### setSearch
Allows the modification of the search configuration to the one that is passed in this method. This will render the grid with pre-defined search criteria passed here and not with the updated or default search configuration. The search is performed when the grid is built.

```
var preDefinedConf= [
                        "Destination Address >= 3",
                        "PSP"
                    ];
this.newGrid.setSearch(preDefinedConf);
```

### search
Allows search of data in the grid. It requires the value(s) to be searched (value parameter). The search is performed on server side, by a request to the API provided in the filter section of the grid configuration. The results are showed in the grid. For example:

```
this.grid.search('policy123');
this.grid.search(['policy123', 'policy456']);
```

### clearSearch
Remove all search tokens currently applied to the grid.

```
this.grid.clearSearch();
```

### getSearchTokens
Gets the search tokens currently applied to the grid. It returns an array with the tokens. For example:

```
this.grid.getSearchTokens();
```

### addPageRows
Allows to add data to a grid that has been originally rendered empty because either the URL or the data properties were not provided. Depending on the number of rows, the rows can be grouped in pages and addPageRows can be used to add one page at a time. addPageRows is available only for SIMPLE grid with/without virtual scrolling or TREE grid with pagination. The method can be invoked in only the following scenarios:
1. In a simple or tree (with pagination) empty grid, when the gridLoaded event is triggered. In this case, addPageRows should be invoked with the data for the first page of the grid.
2. In a simple grid with virtual scrolling, when the gridOnPageRequest event is triggered. In this case, the event will indicate which page needs to be provided (pages property of the pageResquest Object in the gridOnPageRequest event). addPageRows should be invoked to provide the data for each requested page.

For example:

```
    this.$el.bind("gridOnPageRequest", function (e, pageRequest) { //listens for the gridOnPageRequest event
        var pages = pageRequest.pages,
            numberOfRows = gridConfiguration.numberOfRows; //page size defined in the grid configuration
        this.servicesCollection.fetch({ //fetches user of the grid widget collection
            pages: pages, //request some set of pages
            pageSize: numberOfRows,
            success: function (collection) {
                var services = collection.models[0].get("services");//gets grid data from the collection
                if (services) {
                    var records = services.service,
                        totalRecords = services.total,
                        totalPages = Math.ceil(totalRecords / numberOfRows),
                        pageRecords = spliceCollection(records, numberOfRows);//splice the collection per requested pages
                    for (var i = 0; i < pageRecords.length; i++) {
                         self.gridWidget.addPageRows(pageRecords[i], {
                             numberOfPage: pages[i],
                             totalPages: totalPages,
                             totalRecords: totalRecords
                         });
                    }
                }
            },
            failure: function () {
                console.log("The grid data couldn't be loaded.");
            }
        });
    });
```

addPageRows should be invoked with the following parameters:
- Array of Objects with the data of the page
- Object with the properties: numberOfPage (the number of the page for the current page data), totalPages (the number of pages that the grid has), and totalRecords (the number of rows that the grid has).


### getScrollPosition
Returns The grid's vertical scroll position.  This is the number of pixels that are hidden from view above the grid's scrollable area.

```
this.grid.getScrollPosition();
```

### setScrollPosition
Set the grid's vertical scroll position.  This is the number of pixels that are hidden from view above the grid's scrollable area.

```
var scrollPosition = 150;
this.grid.setScrollPosition(scrollPosition);
```

### reloadGrid
Reloads the content of the grid using the url or the getData method defined in the grid configuration. It removes the reference to any selected elements if the resetSelection parameter is set to true. It takes an optional object parameter that defines a set of options controlling the reload operation.  The supported options are as follows:

- *resetSelection* - A boolean indicating if the row selection needs to removed. By default the row selection is kept after reloadGrid method is called, unless this property is set to true.

- *rowIndex* - The index of the row to which the grid should be positioned after reload.  Valid row indexes are > 0.  If no rowIndex is provided the grid will be reloaded at its current viewport position.

- *highlightRow* - A boolean indicating if the row given by rowIndex should be highlighted when it is displayed after reload.

- *afterReload* -  A callback function that is invoked after the reload operation is complete.  The function will be passed the following arguments:

   - rowIndex - the rowIndex provided in the call to reloadGrid.  If no rowIndex was provided this will be undefined.
   - row - The DOM object for the row at index rowIndex. If no row index was provided, this will be undefined.

If no options object is provided the grid will be reloaded at its current viewport position.

For example:

```
this.grid.reloadGrid();
```

```
this.grid.reloadGrid({
    rowIndex: 10,
    highlightRow: true,
    afterReload: function(rowIndex, row) {
       ...
    }
});
```

### reloadGridData
Reloads the content of the grid using the data provided in the data parameter. Any row already existing in the grid and any reference to selected elements is kept unless the resetSelection parameter is set to true. The data will be removed unless keepData is set to true. An optional parameter page could be set to include the parameters of the page which is an object with the numberOfPage, totalPages, and totalRecords. For example:

```
this.grid.reloadGridData(data, page, resetSelection, keepData);
```

### updateGridConfiguration
Updates the grid configuration on properties related to the grid **data**; for example: the url, jsonId, jsonRecords and jsonRoot can be updated so the grid will be reloaded with the new url data. It is available for simple grid, nested grid (top level since callbacks are already available for the nested grids), group grid and tree grid. Updates are allowed only for the same type of grid; therefore a group grid can not be switched to tree grid or simple grid or any other combination.

It accepts the option parameter which is an Object that can include one or many of the following properties:
1. jsonRoot (overwrites conf.elements.jsonRoot)
2. jsonId (overwrites conf.elements.jsonId)
3. jsonRecords (overwrites conf.elements.jsonRecords)
4. url (overwrites conf.elements.url)
5. grouping (only for group grid and overwrites conf.elements.grouping)

For example:

```
    this.grid.updateGridConfiguration({
      "grouping": {
          "columns": [
              {
                  "column": "percent-complete",
                  "order": "asc",
                  "show": false,
                  "text": "Percent Complete: <b>{0}</b>"
              }
          ],
          "collapse": true
      }
    });
```
where this.grid is the instance of the grid widget. Once the grid configuration is updated, the grid is reloaded with the new configuration.

Additionally, in a nested grid,  updateGridConfiguration provides support for the parent grid but not for the children or sub grid. In this case, the subgrid can be updated using the existing callbacks for: jsonRoot, jsonId, jsonRecords and url defined on suGrid attribute in the grid configuration.

### updateActionStatus
Updates programmatically the status of the action buttons of the grid widget. It also resets the current row selection. The input parameter is an object with a combination of key/status for each  action icon, button and split buttons. If the status of an icon is not provided as an input parameter, then it will default to false. For example:

```
    this.gridWidget.updateActionStatus({
        "testCloseGrid": true
    });
```

### toggleRowSelection
Toggles the status of rows; if the rows are selected, then they will be unselected and vice versa. The input parameter is the an array with the ids of the rows that need to be selected or unselected. For example:

```
this.grid.toggleRowSelection(rowIds);
```

### expandAllParentRows
Expands all parents in a grid. Available for tree grid, group grid and nested grid. For example:

```
this.grid.expandAllParentRows();
```

### collapseAllParentRows
Collapses all parents in a grid. Available for tree grid, group grid and nested grid. For example:

```
this.grid.collapseAllParentRows();
```

### toggleGridHeader
Toggles the grid header from show to hide and vice versa. The grid header is composed by the subHeader (the subtitle of the grid and the action bar), the header (title of the table) and the search (search token). It has two optional parameters: isHidden and keepContainer. isHidden is a boolean that indicates if the grid header should be shown or hide. keepContainer is a string/array indicates if one of the containers (subHeader, header or search) should not be hidden during the method execution. The three possible values for keepContainer are: "subHeader", "header" or "search". For example:

```
    this.gridWidget.toggleGridHeader();
```

### getGridHeaderLayout
Provides the current grid header layout represented in an Object with the gridHeader, columns and columnOffset properties. gridHeader represents the jQuery Object of the grid header (title of the table), columns is an array composed by the column , label and width of each grid column  and columnOffset indicates how many pixels from the left the first column of the grid starts. For example:

```
    this.gridWidget.getGridHeaderLayout();
```

The content of the title of the table (gridHeader property) should not be modified by the user of the widget since its internals (DOM elements and classes) can change at any moment. It is only available for insertion (as it is) in a view or other container.

### bindEvents
Register handlers for the events generated from both user defined grid actions (for example, createEvent) and grid widget default events (for example, gridLoaded). It allows one input paramater with is represented by an Object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be invoked when an action is clicked or an event is triggered. handler should be represented as an array, so multiple callbacks to the same event can be added. For example:

```javascript
	this.gridWidget.bindEvents({
                "createEvent": {
                    "name": "createNonJQueryEvent",
                    "handler": [function () {
                        //handler implementation
                    }]
                },
                "gridLoaded": {
                    "handler": [function () {
                        //handler implementation
                    }]
                }
            });
```

If some event needs to have restricted capabilities, then, it should be registered instead in the conf.elements.actionEvents configuration.

### unbindEvents
Unregister handlers for the events generated from both user defined grid actions (for example, createEvent) and grid widget default events (for example, gridLoaded). It allows one input paramater with is represented by an Object with a key/value pair. key represents the event key and the value is an Object with the handler property. handler is a required property and it represents the callback that will be unregistered. handler should be represented as an array, so multiple callbacks to the same event can be unregistered. For example:

```javascript
	this.gridWidget.unbindEvents({
                "gridLoaded": {
                    "handler": [function () {
                        //handler implementation
                    }]
                }
            });
```

## Grid Events
The Grid widget provides some events that are not specific to an action event like when a grid widget resizes (slipstreamGrid.resized:gridWidth), when a row is selected (gridOnRowSelection), when the grid is loaded (gridLoaded). In this case, the user of the widget should register the handler that will be invoked when the event is triggered using the conf.elements.actionEvents or using the bindEvents method. For example:

```javascript
this.gridWidget = new GridWidget({
	"container" gridContainer,
	"elements": gridElement,
	"actionEvents": {
		"gridOnRowSelection": {
		    "handler": [function (e, rowSelection) {
				//handler implementation
            }]
		}
	}
});
```
Note that the event name should be a key in the actionEvents Object, while the value should be an object with the handler property. handler is an array that allows to define one or multiple callbacks for the same event.

### slipstreamGrid.resized:gridWidth
It is triggered every time the width of the grid is resized. It provides an object with the gridHeaderLayout property. The property is an object with the same values as the one describe in the getGridHeaderLayout utility method (previous section). For example:

```javascript
this.gridWidget.bindEvents({
    "slipstreamGrid.resized:gridWidth": {
        "handler": [function () {
            //handler implementation
        }]
    }
});
```

### gridRowOnEditMode
It is triggered when a row goes to edit mode. It is available only for a grid that has inline editing enabled (createRow or editRow properties in the grid configuration with showInline: true). In this case, the cells with editCell defined in its column configuration will show an input field or a dropdown field, etc. To listen to the event:

```javascript
this.gridWidget.bindEvents({
    "gridRowOnEditMode": {
        "handler": [function (e, rowOnEdition) {
            //handler implementation
        }]
    }
});
```
rowOnEdition Object is available as a parameter of the gridRowOnEditMode handler, it has the properties: currentRowData (original data of the row), currentRowFields (cells on edit mode), currentRow (data of the row in the grid), row (DOM Object of the row on edit mode), integratedWidgets (hash with the column name as a key and the instance of its integrated widgets as a value) and operation (type: "update").

In some use cases, it can be required to modify the value of one dropdown based on the value of another cell. To do that, integrated widgets like the drodpdown widget has the "slipstreamGrid.edit:dropdownChange" event. It is triggered after a row is on edit mode and the dropdown value changes. For example the handler of the gridRowOnEditMode could be the following:

```
var lastRowIdOnEdition;
this.grid.bindEvents({
    "gridRowOnEditMode": {
        "handler": [function (e, rowOnEdition) {
            var dropdownChangeEventName = "slipstreamGrid.edit:dropdownChange",
                rowIdOnEdition = row.id;
            if (rowIdOnEdition != lastRowIdOnEdition) {
                var actionDropdown = rowOnEdition.integratedWidgets["action"][1],
                    otherActionDropdown = rowOnEdition.integratedWidgets["other-action"][1];
                //listen for change event on actionDropdown and update value on otherActionDropdown
                actionDropdown.$container.unbind(dropdownChangeEventName).bind(dropdownChangeEventName, function (e, data) {
                    var actionValue = actionDropdown.instance.getValue();
                    switch (actionValue) {
                        case "permit":
                            otherActionDropdown.instance.setValue("permit1");
                            break;
                        case "deny":
                            otherActionDropdown.instance.setValue("deny1");
                            break;
                    }
                });
                lastRowIdOnEdition = rowIdOnEdition;
            }
        }]
    }
});
```

where other-action dropdown value gets updated depending on the value that is selected for the action dropdown.


## Class

The Grid widget provides the class to use.

### slipstreamgrid_row
This class is used for the grid rows. Users of the widget can use this class to bind events with rows.

### slipstreamgrid_cell_item
The class is available ONLY if column collapseContent is enabled. This class is used for the grid cell items. Users of the widget can use this class to search cell items and add content but NOT modify/remove existing content. The slipstreamgrid_cell_item element can also be found in the column formatter.

```
In the column formatter example, we can use slipstreamgrid_cell_item to find the element and add new class to the elements.

    var formatCell = function ($cell, cellvalue, options, rowObject) {
        $cell.find('.slipstreamgrid_cell_item').addClass('newStyle');

        return $cell;
    };

    configurationSample =  {
         ...
         "columns": [
                       {
                           "name": "name",
                           "label": "Name",
                           "formatter":formatCell,
                           ...
                       },
                      ...
                     ]
         ...
     };
```

### slipstreamgrid_cell_item_label
The class is available ONLY if column collapseContent is enabled. The class can be used to access the container of a cell item label. User can add more content or style of this container, for example, adding an icon container. DO NOT modify/remove the content of other containers in a cell. The slipstreamgrid_cell_item_label element can also be found in the column formatter.

```
In the column formatter example, we can use slipstreamgrid_cell_item_label to find the element and add new class to the elements.

    var formatCell = function ($cell, cellvalue, options, rowObject) {
        $cell.find('.slipstreamgrid_cell_item_label').addClass('newStyle');

        return $cell;
    };

    configurationSample =  {
         ...
         "columns": [
                       {
                           "name": "name",
                           "label": "Name",
                           "formatter":formatCell,
                           ...
                       },
                      ...
                     ]
         ...
     };
```

## Errors

The Grid widget provides an error handling mechanism and it is used when the grid is built, or one of its exposed methods is invoked.
Once the required configuration parameters are provided, the Grid widget relies on the jqGrid library for more specific errors.


## Recommendations
When a large number of rows needs to be fetched, virtual scrolling is a preferred method. It will allow to load the row  in smaller batches without impacting user interaction. In fact, trying to insert a large number of rows in the grid in one load can take a significant time and it could cause that the browser show warnings that the operation is taking too long.
