# List Builder Widget


## Introduction
The list builder widget is a reusable graphical user interface that allows users to select one or many items from a set of values. It shows a large list of options (panel 1: Available) and a large list of selections (panel 2: Selected).

## API
The list builder widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods and any data required by the widget is passed by its constructor.


###Configuration
The configuration object has two variables:

```
{
	container: <define the container where the widget will be rendered>,
	elements: <define the parameters required to build the widget>,
    rowTooltip: <define the callback to dynamically display tooltips>
}
```

For example:

```
{
    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample,
        "rowTooltip": rowTooltip
    });
}
```

### container
Represents the HTML node where the List Builder widget will be appended.

### rowTooltip
Defines a callback that will return an array of tooltip objects. It provides the rowData and renderTooltip parameters. renderTooltip is a callback that should be invoked to provide the view to be showed in the cell tooltip. It expects an array of tooltip labels, title or link, which will dynamically render in the tooltip widget. If it is "title", it will be rendered as bold text. If it is "link", <a> tag will be added to the text with the specified id.

For example:

```
{
    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample,
        "rowTooltip": rowTooltip
    });
}

rowTooltip: function (rowData, renderTooltip){
    $.ajax({
        type: 'GET',
        url: '/assets/js/widgets/listBuilderNew/tests/dataSample/tooltipsSample.json',
        success: function(response) {
            console.log(rowData);
            var data = response.address,
                moreData=[];
            moreData.push({
                title: "Address Group"
            });
            data.forEach(function(item){
                moreData.push({
                    label: "Address: " + item['name']
                });
            });
            moreData.push({
                link: "(10 more)",
                id: "address-tooltip-more-link"
            });
            renderTooltip(moreData);
        }
    });
}
```

### elements
Represents the group of parameters required to define the list builder data, and columns. It should be defined in a JSON object and can have the following parameters:

**id**
Adds an id to the list builder.

**height**
Defines the height of the list builder.

**pageSize**
Sets how many records we want to view in the list builder. If the data is local, the page size should be the max number of rows. Default: 20 

**showWidthAsPercentage** 
Defines how the width of a column will be calculated when it is rendered. Both panels will be applied the same calculation. If it is set to true, it means the width of each panel will be interpreted as a percentage of the total width (the sum of the with of all columns). If it is set to false (the default value) then it takes the width provided as-is.

**jsonId**
Defines the unique id that represents the element.

**loadonce**
If this flag is set to true, the list builder loads the data from the server only once (using the appropriate datatype). After the first request, the datatype parameter is automatically changed to local and all further manipulations are done on the client side. The functions of the pager (if present) are disabled.

**ajaxOptions**
This option allows to set global ajax settings for the list builder when requesting data.

**search**
Defines the search of the list builder. The search parameter has two options. One is for the remote interaction and the other is for the local interaction:

- ***url***
Defines the parameters in the search url.
1. currentParameters: all the parameters are currently used, such as page, sorting, and etc.
2. searchValue: the value is entered by users. If the search value is an array, it means the data is from the search option panel that developers have defined. If the search value is a string, it means the data is entered by the user through the search input box.

- ***columns***
Defines what columns which need to be searched locally. List builder widget can search one or multiple columns locally. If the interaction is locally and no searchColumns is defined, the widget will search all non-hidden columns by default.

```
//Search remotely
"search": {
    "url": function (currentParameters, searchValue){
        return _.extend(currentParameters, {searchKey:value, searchAll:true});
    }
}

//Search only one column locally
"search": {
    "columns": "name"
}

//Search multiple columns locally
"search": {
    "columns": ["name", "domain-name"]
} 
```

**sorting**
Defines the sorting of the list builder. The sorting parameter (sortby) will be appended to the list builder url and it will be requested to the server. If virtual scrolling is enabled, each url request will include the sortby parameter. The value of sorting parameter should be an array and each element is an object with two parameters:

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
}]
```

**availableElements/selectedElements**
Defines the common parameters for the available/selected panel.

- ***url***
Adds data to the available/selected panel. This parameter represents the API that will be called to get the data to be shown in the available/selected panel. 

- ***urlParameters***
This parameter is appended directly to the url of the available/selected panel. 

- ***jsonRoot***
Defines where the data begins in the JSON response.

- ***totalRecords***
Defines where the number of records that an API response could have.

- ***getData***
Represents a callback function that is used to retrieve data instead of providing a url (url parameter).

- ***data***
Provide an array that stores the local data. Only use when the data is locally.

- ***getPageData***
Provide a callback function that is used to render data instead of providing a url (url parameter), getData or data. 

Callback gets invoked in the following scenario.
1. When the list builder panel is ready to load data
2. When the list builder panel is going to load the next page
3. When the list builder panel is filtered

This callback passes following parameters:
1. renderData: (Function) the method to render the data in the list builder panel
2. pageData: (Array) the page number that needs to be loaded
3. searchToken: (String) current searchToken 
4. pageSize: (String) the number of the rows on a page

For example:

 ```
 var loadAvailableCollection = function(renderData, pageData, searchToken, pageSize){
    var hasSearch = searchToken && searchToken.length > 0,
        zoneCollection = (hasSearch) ? filteredZoneCollection.page1 : availableZoneCollection;
    zoneCollection.fetch({    
        success: function (collection) {
            var options = {
                numberOfPage: 1,
                totalPages: 1,
                totalRecords: 10
            };
            if (hasSearch){
                options.totalRecords = 3;
            }
            renderData(collection.models[0].get("zone"), options);
        },
        failure: function () {
            console.log("The selected data couldn't be loaded.");
        }
    });
};
 ```

- ***title***
Title of the available/selected panel. Default: Available/Selected

- ***onSelectRowRange***
Defines a callback that will be invoked when a user clicks on a range of checkboxes through shift + click interaction. The callback returns rowIds in range and its critical that the returned row id range honor provided sort order. The parameters passed to the function are setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, startRange, EndRange. setIdsInRangeSuccess is a callback that needs to be invoked with an array of all the row ids available within the specified range (row ids between startRange and EndRange). setIdsInRangeError is the error message that should be passed in case the row ids request results on an error. tokens is an array with all the tokens or filters applied to the list builder. parameters is an object with all the parameters applied to the current API request. 

Note: This config is only needed for remote interaction. 

For example:

 ```
     var getRowIdsInRange = function (setIdsInRangeSuccess, setIdsInRangeError, tokens, parameters, startRange, EndRange) {
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

- ***onSelectAll***
Event will be trigger while the user checks the select-all checkbox. 
Note: only will be triggered under the remote interaction.

Parameter:
- ****done****: this MUST be called once the ajax call is finished and developers need to return an array of selected ids. Then the framework will remove the spinner and track all selected item internally.


For example:

```
var onSelectAllAvailable = function(done){
    done({ids: [
        132597, 132633, 133065, 132667, 132631, 
        132665, 133067, 133066, 132666, 132636, 
        132637, 133093, 133094, 133095, 133096, 
        133097, 133098, 131891, 131892, 131893
    ]});
};

"availableElements": {
    "url": "/assets/js/widgets/listBuilderNew/tests/dataSample/testData.json",
    "jsonRoot": "addresses.address",
    "totalRecords": "addresses.@total",
    "title": "Test Title1",
    "urlParameters": {filter: "filterParameter"},
    "onSelectRowRange": getRowIdsInRange,
    "onSelectAll": onSelectAllAvailable
}

"selectedElements": {
    "url": "/assets/js/widgets/listBuilderNew/tests/dataSample/testData.json",
    "jsonRoot": "addresses.address",
    "totalRecords": "addresses.@total",
    "title": "Test Title2",
    "urlParameters": {filter: "filterParameter"},
    "hideSearchOptionMenu": true,
    "onSelectRowRange": getRowIdsInRange,
    "onSelectAll": onSelectAllSelected
}

or 

var getData = function (postdata){
    var self = this;
    $.ajax({
        url: '/api/get-data',
        data: postdata,
        dataType:"json",
        complete: function(data,status){
            var data = data.responseJSON['addresses']['address'];
            $(self).addRowData('id',data); //Must give an unique identifer for each element.
        }
    });
};

"availableElements": {
    "getData": getData
}

"selectedElements": {
    "getData": getData
}
```

**selectedElements**
Defines additional parameter for the selected panel ONLY.

- ***hideSearchOptionMenu***
Hide the search option menu of the selected panel. Default: false

```
"selectedElements": {
    "url": "/assets/js/widgets/listBuilderNew/tests/dataSample/testData.json",
    "jsonRoot": "addresses.address",
    "totalRecords": "addresses.@total",
    "title": "Test Title2",
    "urlParameters": {filter: "filterParameter"},
    "hideSearchOptionMenu": true,
    "onSelectRowRange": getRowIdsInRange,
    "onSelectAll": onSelectAllSelected
}
```

**columns**
Contains the data required to render the header of the table and column features. It's a required parameter and should contain an array with objects that represent each of the columns of the list builder. The parameters per column are:

- ***index***
   Represents the id of the row and it is used for sorting purposes.

- ***name***
   Represents the name of the row and it should match the one in the JSON response.

- ***width***
   Assigns a width to the column

- ***hidden***
   Hide the column

- ***formatter***
   Defines the callback function to be used to define a custom format for the value of the cell. It should have a return value with a string data type that could represent a html string.

```
var createLink = function (cellvalue, options, rowObject){
    return '<a class="cellLink" data-cell="'+cellvalue+'">'+cellvalue+'</a>';
};

"columns": [{
    "id": "id",
    "name": "id",
    "hidden": true
}, {
    "index": "name",
    "name": "name",
    "label": "Name",
    "width": 150,
    "formatter":createLink
}]
```

### Build
Build the list builder in the specified container. For example:

```
{
    listBuilder.build();
}
```

### Destroy
Clean up the specified container from the resources created by the list builder widget.

```
{
    listBuilder.destroy();
}
```

## Usage
To add a list builder in a container, follow these steps:
1. Instantiate the list builder widget and provide the configuration object the list of elements to show (list) and the container where the list builder will be rendered
2. Call the build method of the list builder widget

Optionally, the destroy method can be called to clean up resources created by the list builder widget.

```
{
    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample
    });
}
```

## Methods
All of methods should be used while loading locally. If the list builder has virtual scrolling (pagination), please use remote interaction ([read more](#interaction)). Because some of data probably haven't loaded, the returned data by these methods probably are not accurate. If data is completely loaded in both columns, then these methods might be useful.

### getAvailableItems
Get available items which are currently displaying in the panel 1. 

Note: If you have virtual scrolling in the panel 1, it will only return the displaying items. 

For example:

```
   var list = listBuilder.getAvailableItems();
```

### addAvailableItems
Add new items to the available column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/132362",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/132362",
        "name":"new-added-item3",
        "hash-key":5000000,
        "address-type":"IPADDRESS",
        "ip-address":"5.0.0.0",
        "description":"",
        "definition-type":"CUSTOM",
        "id":132362,
        "domain-id":2,
        "domain-name":"Global"
    },
    {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/138393",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/138393",
        "name":"new-added-item4",
        "hash-key":"a000000affffff",
        "address-type":"NETWORK",
        "ip-address":"10.0.0.0\/8",
        "description":"",
        "definition-type":"CUSTOM",
        "id":138393,
        "domain-id":2,
        "domain-name":"Global"
    }];

    listBuilder.addAvailableItems(list);
```

### renderAvailableItems
Allows to add data to the available panel that has been originally rendered empty because either the URL or the data properties were not provided. 

Parameters:
- Array of Objects with the data of the page

For example:

```
    var list = [
        {"name":"address200","id":200,"domain-name":"Global"},
        {"name":"address199","id":199,"domain-name":"Global"},
        {"name":"address198","id":198,"domain-name":"Global"}];

    listBuilder.renderAvailableItems(list);
```

### removeAvailableItems
Remove existing items from the available column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "name":"Kyle_Automation_test_wildcard",
        "address-type":"WILDCARD",
        "ip-address":"10.10.0.1\/0.0.255.255",
        "description":"",
        "host-name":"",
        "definition-type":"CUSTOM",
        "id":295634,
        "domain-id":2,
        "domain-name":"Global"
     },
     {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "name":"test_automation_for_1",
        "address-type":"DNS",
        "ip-address":"",
        "description":"",
        "host-name":"Test_DNS",
        "definition-type":"CUSTOM",
        "id":294982,
        "domain-id":2,
        "domain-name":"Global"
     }];

    listBuilder.removeAvailableItems(list);
```

### searchAvailableItems
- **keyword**: Search keyword for the available column (panel1). If it is the local interaction, the keyword can be string or array. If it is the remote interaction, the keyword can be string or object.

For example:
```
    listBuilder.searchAvailableItems("test");
```

### getAvailableUrlParameter
Return the current url parameters for the available column (panel1). 
```
    listBuilder.getAvailableUrlParameter();
```

### getSelectedItems
Get selected items which are currently displaying in the panel 2. 

Note: If you have virtual scrolling in the panel 2, it will only return the displaying items. 

For example:

```
   var list = listBuilder.getSelectedItems();
```

### addSelectedItems
Add new items to the selected column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/132215",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/132215",
        "name":"new-added-item1",
        "hash-key":5000000,
        "address-type":"IPADDRESS",
        "ip-address":"5.0.0.0",
        "description":"",
        "definition-type":"CUSTOM",
        "id":132215,
        "domain-id":2,
        "domain-name":"Global"
    },
    {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/132947",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/132947",
        "name":"new-added-item2",
        "hash-key":"a000000affffff",
        "address-type":"NETWORK",
        "ip-address":"10.0.0.0\/8",
        "description":"",
        "definition-type":"CUSTOM",
        "id":132947,
        "domain-id":2,
        "domain-name":"Global"
    }];
    listBuilder.addSelectedItems(list);
```

### renderSelectedItems
Allows to add data to the selected panel that has been originally rendered empty because either the URL or the data properties were not provided.  

Parameters:
- Array of Objects with the data of the page

For example:

```
    var list = [
        {"name":"address200","id":200,"domain-name":"Global"},
        {"name":"address199","id":199,"domain-name":"Global"},
        {"name":"address198","id":198,"domain-name":"Global"}];

    listBuilder.renderSelectedItems(list);
```

### removeSelectedItems
Remove existing items from the selected column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "name":"Kyle_Automation_test_wildcard",
        "address-type":"WILDCARD",
        "ip-address":"10.10.0.1\/0.0.255.255",
        "description":"",
        "host-name":"",
        "definition-type":"CUSTOM",
        "id":295634,
        "domain-id":2,
        "domain-name":"Global"
     },
     {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "name":"test_automation_for_1",
        "address-type":"DNS",
        "ip-address":"",
        "description":"",
        "host-name":"Test_DNS",
        "definition-type":"CUSTOM",
        "id":294982,
        "domain-id":2,
        "domain-name":"Global"
     }];
    listBuilder.removeSelectedItems(list);
```

### searchSelectedItems
- **keyword**: Search keyword for the selected column (panel2). If it is the local interaction, the keyword can be string or array. If it is the remote interaction, the keyword can be string or object.

For example:
```
    listBuilder.searchSelectedItems("test");
```

### getSelectedUrlParameter
Return the current url parameters for the selected column (panel2). 
```
    listBuilder.getSelectedUrlParameter();
```

### unselectItems
Remove existing items from the selected column to the available column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "name":"Kyle_Automation_test_wildcard",
        "address-type":"WILDCARD",
        "ip-address":"10.10.0.1\/0.0.255.255",
        "description":"",
        "host-name":"",
        "definition-type":"CUSTOM",
        "id":295634,
        "domain-id":2,
        "domain-name":"Global"
     },
     {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "name":"test_automation_for_1",
        "address-type":"DNS",
        "ip-address":"",
        "description":"",
        "host-name":"Test_DNS",
        "definition-type":"CUSTOM",
        "id":294982,
        "domain-id":2,
        "domain-name":"Global"
     }];
    listBuilder.unselectItems(list);
```

### selectItems
Move existing items from the available column to the selected column. For example:

```
    var list = [{  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/295634",
        "name":"Kyle_Automation_test_wildcard",
        "address-type":"WILDCARD",
        "ip-address":"10.10.0.1\/0.0.255.255",
        "description":"",
        "host-name":"",
        "definition-type":"CUSTOM",
        "id":295634,
        "domain-id":2,
        "domain-name":"Global"
     },
     {  
        "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "@href":"\/api\/juniper\/sd\/address-management\/addresses\/294982",
        "name":"test_automation_for_1",
        "address-type":"DNS",
        "ip-address":"",
        "description":"",
        "host-name":"Test_DNS",
        "definition-type":"CUSTOM",
        "id":294982,
        "domain-id":2,
        "domain-name":"Global"
     }];
    listBuilder.selectItems(list);
```

### reload
Reload both panel 1 and panel 2 of the list builder by url requests. For example:

```
    listBuilder.reload();
```

## Event

### onChangeSelected
After selecting/unselecting the list builder, this event will get trigger
- define the callback function in the configuration
- returned data: 
    - **row data**: the selected rows. Note: if the event is selectAll/unselectAll, the data will be an array of selected ids instead of data object.
    - **event**: select/unselect/selectAll/unselectAll

For example:

```
    var onChangeSelected = function (e, data){
            self.protocolsListBuilder.reload();
        };

    _.extend(listBuilderConf, {
        onChangeSelected: onChangeSelected
    });
```

### onSelectAll
After checking the select all checkbox on the list builder, this event will get trigger. Note: only will be triggered under the remote interaction.
- define the callback function in the availableElements and selectedElements configuration
- returned data: 
    - **done function**: this MUST be called once the ajax call is finished and developers need to return an array of selected ids. Then the framework will remove the spinner and track all selected item internally.

For example:

```
var onSelectAllSelected = function(done){
    done({ids: [
        132597, 132633, 133065, 132667, 132631, 
        132665, 133067, 133066, 132666, 132636, 
        132637, 133093, 133094, 133095, 133096, 
        133097, 133098, 131891, 131892, 131893
    ]});
};


"selectedElements": {
    "url": "/assets/js/widgets/listBuilderNew/tests/dataSample/testData.json",
    "jsonRoot": "addresses.address",
    "totalRecords": "addresses.@total",
    "title": "Test Title2",
    "urlParameters": {filter: "filterParameter"},
    "hideSearchOptionMenu": true,
    "onSelectAll": onSelectAllSelected
}
```

### onBuildListBuilder
After building the list builder, this event will get trigger
- define the callback function in the configuration

For example:

```
    var onBuildListBuilder = function (e, listBuilder){
            console.log('the list builder is built completely');
        };

    _.extend(listBuilderConf, {
        onBuildListBuilder: onBuildListBuilder
    });
```

### onDestroyListBuilder
Before destroying the list builder, this event will get trigger
- define the callback function in the configuration

For example:

```
    var onDestroyListBuilder = function (e, listBuilder){
            console.log('the list builder is going to be destroyed');
        };

    _.extend(listBuilderConf, {
        onDestroyListBuilder: onDestroyListBuilder
    });
```

## Interaction<a name="interaction"></a> 

### Load Remotely (Update both available and selected columns by url)

Workflow: 
1. List Builder Widget will fetch first set of data and populate in the both columns. Both columns need to provide url parameter.
2. After selecting some items in the available or selected columns and clicking the select/unselect button in the list builder, App developers can use onChangeSelected callback to submit the backend call in order to update the list in both columns.
3. Once the database is updated, App developer can reload the list builder.
4. List builder widget will re-fetch data from the server with updated data.
5. List builder widget will sort and search data remotely.

 ```
    var self = this,
        configurationSample = {
            "availableElements": {
                "url": "/api/get-data",
                "jsonRoot": "addresses.address",
                "totalRecords": "addresses.@total",
                "title": "Test Title1",
                "urlParameters": {filter: "filterParameter"}
            },
            "selectedElements": {
                "url": '/api/get-data2',
                "jsonRoot": "addresses.address",
                "totalRecords": "addresses.@total",
                "title": "Test Title2",
                "urlParameters": {filter: "filterParameter"}
            },
            "pageSize": 10,
            "sorting": [
                {
                "column": "name",
                "order": "asc"
                }
            ],
            "jsonId": "id",
            "height": '115',
            "id": "test",  
            "search": {
                "url": function (currentPara, value){
                    return _.extend(currentPara, {searchKey:value, searchAll:true});
                }
            },
            "ajaxOptions": {
                "headers": {
                     "Accept": 'application/vnd.juniper.sd.address-management.address-refs+json;version=1;q=0.01'
                }
            },
            "columns": [
            {
                "id": "id",
                "name": "id",
                "hidden": true
            }, {
                "index": "name",
                "name": "name",
                "label": "Name",
                "width": 150
            }, {
                "index": "domain-name",
                "name": "domain-name",
                "label": "Domain",
                "width": 80
            }]
        },
        onChangeSelected = function (e, data){
            $.ajax({
              url: url
            }).done(function() {
              self.protocolsListBuilder.reload();
            });
        };

    _.extend(listBuilderConf, {
        onChangeSelected: onChangeSelected
    });

    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample
    });
    this.listBuilder.build();
```

### Load Remotely Once

Workflow: 
1. List Builder Widget will fetch data and populate in the both columns. The column needs to provide url parameter if it needs to load the data when building the list builder.
2. After loading data, the list builder will change datatype to local internally. Thus, developers have to make sure the completed data will be loaded at the first time.
3. List builder widget will handle all interaction locally, so elements will be able to select/unselect through the buttons. Also, developers can use all of methods if they need to add/remove/select/unselect/get elements manually.
4. List builder widget will sort and search data locally.

 ```
    //In this case, only the available panel loads data remotely once. If the selectedElements is not defined, then the datatype of the selected panel is local and it doesn't have any data.

    var configurationSample = {
        "availableElements": {
            "url": "/api/get-data",
            "urlParameters": {filter: "filterParameter"},
            "jsonRoot": "addresses.address",
            "totalRecords": function(data) {
                return data.addresses['@total'];
            }
        },
        "pageSize": 10,
        "id": "test2",
        "jsonId": "id",
        "search": {
            "columns": "name"
        },
        "loadonce": true, //only load remotely once
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 150
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    };

    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample
    });

    this.listBuilder.build();
```

### Load Locally

Workflow: 
1. List builder widget will NOT load any data by url. Developers can use "data" parameters to pass all the local data to the list builder.
2. List builder widget will handle all interaction locally, so elements will be able to select/unselect through the buttons. Also, developers can use all of methods if they need to add/remove/select/unselect/get elements manually.
3. List builder widget will sort and search data locally.

 ```

    var localData = [  
        {  
            "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/132597",
            "@href":"\/api\/juniper\/sd\/address-management\/addresses\/132597",
            "name":"0dummy",
            "hash-key":5000000,
            "address-type":"IPADDRESS",
            "ip-address":"5.0.0.0",
            "description":"",
            "definition-type":"CUSTOM",
            "id":132597,
            "domain-id":2,
            "domain-name":"Global2"
        },
        {  
            "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/132633",
            "@href":"\/api\/juniper\/sd\/address-management\/addresses\/132633",
            "name":"10-net",
            "hash-key":"a000000affffff",
            "address-type":"NETWORK",
            "ip-address":"10.0.0.0\/8",
            "description":"",
            "definition-type":"CUSTOM",
            "id":132633,
            "domain-id":2,
            "domain-name":"Global2"
        },
        {  
            "@uri":"\/api\/juniper\/sd\/address-management\/addresses\/133065",
            "@href":"\/api\/juniper\/sd\/address-management\/addresses\/133065",
            "name":"10.4.195_vl195-vmware-mgt-old",
            "hash-key":"a04c300a04c37f",
            "address-type":"NETWORK",
            "ip-address":"10.4.195.0\/25",
            "description":"",
            "definition-type":"CUSTOM",
            "id":133065,
            "domain-id":2,
            "domain-name":"Global2"
        }];

    var configurationSample = {
        "availableElements": {
            "data": localData
        },
        "selectedElements": {
            "data": localData
        },
        "id": "test3",
        "jsonId": "id",
        "search": {
            "columns": ["name", "domain-name"]
        },
        "columns": [
        {
            "id": "id",
            "name": "id",
            "hidden": true
        }, {
            "index": "name",
            "name": "name",
            "label": "Name",
            "width": 150
        }, {
            "index": "domain-name",
            "name": "domain-name",
            "label": "Domain",
            "width": 80
        }]
    };

    var listBuilder = new ListBuilderWidget({
        "container": this.el,
        "elements": configurationSample
    });

    this.listBuilder.build();
```