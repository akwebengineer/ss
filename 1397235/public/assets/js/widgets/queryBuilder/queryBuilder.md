# QueryBuilder Widget

## Introduction
The QueryBuilder widget is a reusable graphical user interface that allows users to add a search container with queries that represent the search criteria.

## API
The QueryBuilder widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Any data required by the widget is passed by its constructor.
Additionally several other methods are supported for the interface.

## Configuration
The configuration object requires only a container parameter.

```
{
    container:  <DOM object that defines where the widget will be rendered.>
    filterMenu: <Object that defines the valid set of keys that will be used in the query expression.>
    logicMenu: <Array that defines the logical operators that will be used in the query expression between two terms.>
    autoComplete: <Object that defines configuration for autoComplete feature.>
    events: <Object that is used to register the events. >
    dragNDrop: <Object that is used to define the callbacks to provide the dragged data. >
}
```

For example, a QueryBuilder widget would be instantiated with:

```
var filterContainer = this.$el.find('.filterContainer')[0];

var queryBuilderWidget = new QueryBuilderWidget({
    "container": filterContainer
});
```

### container
It represents the DOM element that will contain the query builder.

### filterMenu
Defines the items that will be listed in filter context menu and that will be used to validate the expression.For example:

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
    },
    'PlatformKey': {
        'label':'Platform',
        'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
    },
    'ManagedStatusKey': {
        'label':'ManagedStatus',
        'value':['InSync','OutSync','Connecting']
    },
    'ConnectionStatusKey': {
        'label':'ConnectionStatus',
        'value':['Down', 'Up']
    },
    'IPAddressKey': {
        'label':'IPAddress',
        'value':['']
    }
};
```

-'key'- of the object is the element key e.g. - DeviceFamilyKey
-'label'- is string that represents the label of the item that will be shown in the UI search filter e.g. - Device. Also this label will be used autocomplete to show as suggestions.
-'value'- is an array that represents the list of values that will be showed in UI if the respective key is selected e.g. - ['SRX','MX','EX']
-'operators'- is an array of operators that user can use to override the global or all operators.

### logicMenu
It defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens. It is represented by an array. For example

```
var logicMenu = ['AND','OR','NOT']
```

### autoComplete
To show suggestions for autocomplete. 
Value of this parameter can either be boolean or an object. 
If boolean, it will use default configuration to show suggestions.To override the deault configuration, an object with the set of configurations has to be provided. 
the suggestions will be shown in a dropdown on each keyup for autoComplete.

#### Configuration parameters for autoComplete:

> width: number
  
  Suggestions container width in pixels, e.g.: 300. Default: auto, takes input field width.

> onSearchStart: function (query)

  Callback function called before each ajax request

#### 'remoteValue' callback for autoComplete

This property in filterMenu configuration defines callback function which will be executed to load the fieldValues.
The callback function can also be used for making an Ajax call and loading the data. 

NOTE:
  -> This function will be only called to autocomplete fieldValues. 
  -> If 'remoteValue' property is defined then it will always take precedence over the local values defined for that key.-> If the callback returns no suggestions, then local values defined for the key won't be used for showing the suggestions.
   
  FOR EXAMPLE,

   'DeviceFamilyKey': {
        'label':'Device',
        'operators': ['=','!='],
        'remoteValue': function(key, showSuggestion){
            var data = [
              {'value': 'suggestion1'},
              {'value': 'suggestion2'},
              {'value': 'suggestion3'}
            ]

            var suggestion = {
                'suggestion': data
            };

            showSuggestion(suggestion);
        }
    }

  In the above configuration, the callback function will be invoked to load fieldValues as suggestions for 'DeviceFamily' key. 

    'PlatformKey': {
        'label':'Platform',
        'value':['srx650', 'srx5800', 'mx2020', 'ex2200']
    }

  For above configuration, the callback function won't be invoked. The value property will be used to show suggestions for 'Platform'
  
  Requirements:

  -> The function will have two parameters. 

  -> First parameter represents the current token of the query written in filterBar. For example, 

  For all these combinations:

  IP AND OSVersion
  IP AND OSVersion=
  IP AND OSVersion=1
  IP AND OSVersion=12.1,
  IP AND OSVersion=12.1,1

  The first parameter will be the corresponding key. In this case, it will be 'OSVersion'

  -> Second parameter is a callback named showSuggestion. The lookup function should call this callback function by passing the suggestions as parameter.
  -> The suggestion values passed to the callback function should be wrapped in an object with key set to 'suggestions'
  -> Each suggestion should be an object with key as 'value'.

  Example of the suggestions object that will be passed to the callback function: 

  var data = [
        { "value": "12.1" },
        { "value": "12.2" },
        { "value": "12.3" },
        { "value": "14.1" },
        { "value": "14.2" },
        { "value": "13.1" },
        { "value": "16.1" },
        { "value": "13.4" }
    ];

    var suggestions = {
      suggestions: data
    };

  Example:

  ```
  'OSVersionKeyKey': {
        'label':'Device',
        'operators': ['=','!='],
        'remoteValue': function(key, showSuggestion){
            $.ajax({
              url: '/api/queryBuilder/getRemoteData',
              type: "GET",
              data: {query: currentToken},
              success: function (response) {
                var suggestion = {
                  'suggestion': response
                };
                 showSuggestion(suggestion); 
              }
            });
        }
    }

  ```

### events
It uses the base widget mechanism for registering the exposed events at the time of instantiation.
The events that needs to be registered are specified with the event name as key and associated handler.
Handler will be invoked with event key trigger.

```
    var conf = {
          container: $queryContainer,
          autoComplete: true,
          events: {
              "query.executeQuery": {
                  "handler": [function (e, queryObj) {
                      console.log("--- Query Executed ---");
                  }]
              }
          }
      };
      var queryBuilderWidget = new QueryBuilderWidget(conf);
      queryBuilderWidget.build();
```
### dragNDrop
Following config parameter is used to define the drag and drop feature for the filter.
The value that will be dropped on the filter bar is available by executing the callbacks which app can define.
Provided data will then be added in the filterbar based on the dropped location.
When data is dropped the there will be validations triggered to check the new query as valid or invlalid.

e.g as follows
```
    var conf = {
          "container": $queryContainer,
          "dragNDrop":{
              "drop":this.dropOnFilter,
              "over":this.dragOverFilter
          }
      };
      var queryBuilderWidget = new QueryBuilderWidget(conf);
      queryBuilderWidget.build();
      
      
      ......
      // Sample to show the callback implementation
      // The data has to be provided in the given format
      this.dropOnFilter = function(){
        // create the data that will needs to be passed for the drop
        var dropData = {
            data: [
                {"label": "OSVersion", "values": ["19.1", "19.2"]}
            ]
        };
        return dropData;
       };
                  
       .......
       // Sample to show the callback implementation
       this.dragOverFilter =function(){
          //Some validations, styling changes can follow in the following
       }         
      
```

The dragNDrop has following parameters defined
- drop: Following is used to get the data from the app. The app needs to always return data in a particular format as:
````
        // This will form a query as "OSVersion=19.1,19.2"
        var dropData = {
            data: [
                {"label": "OSVersion", "values": ["19.1", "19.2"]}
            ]
        };
        
        // This will form a query as "OSVersion=19.1,19.2" and it will be connected to the existing string using "NOT"
        var dropData = {
            data: [
                {"label": "OSVersion", "values": ["19.1", "19.2"], "logicalOperator":"NOT"}
            ]
        };
        
        // This will form a query as "OSVersion<19.1,19.2" and it will be connected to the existing string using "AND"
        var dropData = {
            data: [
                {"label": "OSVersion", "values": ["19.1", "19.2"], "relationalOperator":"<"}
            ]
        };
                
        // This will form a query as "OSVersion=19.1,19.2 NOT DeviceFamily=SRX,EX" and it will be connected to the existing string using "OR"
        var dropData = {
            data: [
                {"label": "OSVersion", "values": ["19.1", "19.2"], "logicalOperator":"OR"}
                {"label": "DeviceFamily", "values": ["SRX", "EX"], "logicalOperator":"NOT"}
            ]
        };
        
        // This will form a query as "JuniperProducts" and it will be connected to the existing string using "AND"
        var dropData = {
            data: [
                {"values": ["JuniperProducts"], "logicalOperator":"AND"}
            ]
        };
        
````
where

  --data: is array of objects containing following parameters

  1. label: is of type String and needs to pass the label name with which the query has to be updated with. For example in case of 
         grid, it should be column label if the data is dragged from grid column. It's optional if search string is not of key value pair.
         
  2. values: is an array of string consisting of several values that needs to be part of the formulated query. This will be used to create 
             the search string using the provided 'label' and the multiple values will be concatenated as comma separated. Note: of the label is 
             not provided, then the provided values will be treated as stand along search string.
             
  3. logicalOperator: Optional: default value is 'AND'. This is used to create and join the query to existing query.
  
  4. relationalOperator: Optional: default value is '='. This is used to create the key value pair with the relational operator in between.

- over: Following callback initiated when the item is dragged over the filter bar. This can be helpful for styling changes, validations etc. 


## API Methods
### build
Adds the DOM elements and events for the QueryBuilder widget in the specified container. For example:

```
    queryBuilderWidget.build();
```

### bindEvents
Binds a handler to the events triggered by widget. Handler is a required property and it represents the callback that will be invoked when the event triggered.

```
    queryBuilderWidget.bindEvents({
        "query.executeQuery": {
            "handler": [function (e, queryObj) {
                console.log("--- Query Executed ---");
            }]
        }
      });
```
The bindEvents method allows to register additional callbacks even if the event was already registered with the events property at the time that the queryBuilder widget was instantiated and built. Subsequent calls to bindEvents can add more callbacks to the same event.

Defined event keys triggered by QueryBuilder Widget
- "query.executeQuery": Invoked when enter is pressed on the filterbar
- "query.emptyQuery": Invoked when filterbar is empty because of user action or clear API call.
- "query.valid": Invoked when the query is validated as valid on data input in filterbar
- "query.invalid": Invoked when the query is validated as invalid on data input in filterbar
- "query.message": Invoked when the query is validated as valid/invalid, indicating the message shown in UI

### unbindEvents
Unbinds a handler to the several events. Handler is a required property, it's an Array, and it represents the callback(s) that should be unregistered. For example:

```
    queryBuilderWidget.unbindEvents({
         "query.executeQuery": {
             "handler": [function (e, queryObj) {
                 console.log("--- handler executed in unbind ---");
             }]
         }
    });
```

### validate
Validates the query respective to the configuration. Accepts expression string that needs to be validated against the defined rules and configuration.
Method returns an object containing several attributes according to validated data. Returned object structure contains state, query, model.
Empty string will validate as invalid query.

- Note - The method will update the model internally, if the parameter is provided for validation. If no parameter is provided, the details respective to current query
         in filter bar is returned.

```
    {
     "state" : valid | invalid. Based on the query validation the states are returned
     "query" : "" | someValue. If the query is invalid, an empty string is returned, else the formatted query that is bieng returned.
     "model: : {} | someAST. If the query is invalid, an empty object is returned, else the AST structure as model is returned.
    }
```


```
    queryBuilderWidget.validate();
```

### clear
Clears or empty the query container. Also updates the model. Styles the view to show case the empty container.

```
    queryBuilderWidget.clear();
```

### getQuery
Get latest query from the model. This will always be in sync with the valid expression as shown on query container.
If there is an error in expression, method will return empty string.

```
    queryBuilderWidget.getQuery();
```


### getAST
Get the latest AST from the model. This will represent the data model. If no id is provided entire AST is returned.
If id is incorrect the error is thrown otherwise the tree, subtree respective to ID will be returned.

```
    queryBuilderWidget.getAST();
```


### getTerm
Get the matching nodes array respective to provided term. Error is thrown if term does not exist.
In case of multiple terms in same expression, an array containing all the matching terms is returned.

```
    queryBuilderWidget.getTerm();
```

### getTermsType
Method to provide back the object containing the type of terms that constitute the query. Mainly there are two types as part of return object.

- 'literal' - boolean | Indicates that there are terms in query without associated keys. e:g: 'test1 or test2'
- 'fieldExpression' - boolean | Indicates that there are terms in query with associated keys. e:g: 'osversion=1 or osversion=2'

```
    queryBuilderWidget.getTermsType();
```

### add
Adds the query at the end of the existing expression. Also will validate the new string and accordingly update the model.
The query can include any combination of terms. eg. '((test1 and version=1,2)) and test2'. This method will add the query
at the end of the existing expression & validate the expression & update the model accordingly.

```
    queryBuilderWidget.add(addObject);
```

- addObject is of following structure
```
    var addObject = {
                    "logicalOperator": "not",  //Operator that will be used as connector | default is AND
                    "query": "anyValidQuery and query1 or query2 and osversion=srx"  // following can be any term as singleTerm | FieldTerm


                };
  ```

- 'logicalOperator' - Can be any valid type of logical operator. This operator will be used to connect the query in the filter bar.
If the chosen operator in not valid as per config, then the full query will turn invalid. In case there is no value in filter bar then the logical operator will be ignored as connector.
Default is always AND irrespective of configured logical operators.
- 'query' - string containing terms and logical operators. This will append at end of the existing filter bar query.


### update
Updates the provided object.

```
    queryBuilderWidget.update(updateObject);
```

- updateObject is of following structure
```
    var updateObject = {
                    "fieldGroupID":"groupID", // id of the field expression group for which the term belongs to.
                    "term": {
                        "id" : "someID", // id of the term that needs to be updated
                        "key": "name", // field name
                        "operator": "=", // field operator
                        "value": "test" // new value
                    }
                };
  ```

#### AST Model Structure
AST model is created using the query passed as input. User can input different kind of expressions like
- Binary Expression - consisting logical operator in between the terms OR
- Parentheses Expression - parentheses surrounding the terms
- field Expression - That consists of key value pair including keys, relational operator & values.

Based on the successful query validation, the model is generated consisting the details of expression.
Any expression is converted in a node which consists the children nodes.

Node consist of following attributes:

- 'id' - Uniquely identifies the tree / subtree. Note - the ID is generated on UI layer with every input value & assigned to the tree nodes.
- 'expression' - consists the query expression for tree or sub tree at each level.
- 'value' - In the binary expression the operator that is in middle of LHS term and RHS term will be value of attribute 'operator'
- 'nodes' - It is an array. In the binary expression the term on LHS will be first element and term on RHS will be second element.
- 'type' - defines the type of expression, Following are the valid types
    - 'Literal' - Any single term is a literal term.
                format: <someTerm>
                eg: <test1 or test2>,
                'test1', 'test2' are 'Literal' terms.
    - 'FieldExpressionGroup' - A field expression surrounded by FieldExpressionGroup to support the comma separated structure of field values.
                           format: <fieldKey relationalOperator fieldValue>
                           eg: <osversion = 1,2,3> will be modeled as
                           'osversion = 1 OR osversion = 2 OR osversion = 3' where each of these are of type 'FieldExpression'.
    - 'FieldExpression' - Any expression that has relational operator as part of expression.
                       format: <fieldKey relationalOperator fieldValue>
                       eg: <osversion = 1.1 or test1>
                       'osversion = 1.1' is a 'FieldExpression'
    - 'BinaryExpression' - Two terms connected in expression using a Logical operator
                         format: <someTerm LogicalOperator someTerm>
                         eg: <test1 NOT test2>
                         'test1 NOT test2' is of type 'BinaryExpression' containing a LHS 'Literal' type of value as 'test1' and RHS 'Literal' type of value as 'test2'
    - 'ParenExpression' - Any expression surrounded by parentheses.
                        format: <(someExpression)>
                        eg: <test1 or (test2)>
                        '(test2)' is of type 'ParenExpression' containing a 'Literal' type of value as 'test2'

##### Model Example
Generated Model for different expressions

```
test1

{
    id : "_k555unuhz"
    type : "Literal",
    value : "test1",
    nodes : []
}
```

```
osversion=1

{
    type : "FieldExpressionGroup",
    expression : "osversion=1"
    "id": "_3k9hvzqs4",
    nodes : [
    {
       type: "FieldExpression",
       id: "_669hvzqs4",
       expression : "osversion=1",
       fieldName: "osversion",
       fieldOperator: "=",
       fieldValue: "1"
       value: "name=1"
    },
}
```

```
osversion=1,2

{
    type : "FieldExpressionGroup",
    expression : "osversion=1,2"
    "id": "_7dfhvzqs4",
    nodes : [
        type : "BinaryExpression",
        expression : "osversion=1,2"
        value : "OR"
        id: "_47dhvzqs4",
        nodes: [
            {
               type: "FieldExpression",
               id: "_9k9hjjqs4",
               expression : "osversion=1",
               fieldName: "osversion",
               fieldOperator: "=",
               fieldValue: "1"
               value: "osversion=1"
            },
            {
               type: "FieldExpression",
               id: "_1kuf7zqs4",
               expression : "osversion=2",
               fieldName: "osversion",
               fieldOperator: "=",
               fieldValue: "2"
               value: "osversion=2"
             }
        ]
   ]
}
```

```
test1 or test2

{
    type : "BinaryExpression",
    value : "or",
    id: "_1a2o7c1cp",
    expression : "test1 or test2",
    nodes : [
        {
            id : "_9h3unuhz"
            type : "Literal",
            value : "test1",
            nodes : [],
            expression : "test1",
        },
        {
            id : "_2cc5unuhz"
            type : "Literal",
            value : "test2",
            nodes : [],
            expression : "test2"
        }
    ]
}
```

```
(test1 or test2)

{
    type : "ParenExpression",
    value : (),
    expression: "(test1 or test2)",
    id: "_epi1xruxj",
    nodes: [{
        type : "BinaryExpression",
        value : "or",
        expression: "test1 or test2",
        id: "_1a2o7c1cp",
        nodes: [
           {
               id : "_9h3unuhz"
               type : "Literal",
               value : "test1",
               nodes : [],
               expression : "test1",
           },
           {
               id : "_2cc5unuhz"
               type : "Literal",
               value : "test2",
               nodes : [],
               expression : "test2",
           }
        ]
    }]
}
```

```
test1 NOT osversion=1

{
    type : "BinaryExpression",
    expression: "test1 NOT osversion=1",
    value: "NOT",
    id: "_yg5cksi8t",
    nodes : [
       {
            type: "Literal",
            value: "test1",
            nodes: [],
            expression: "test1",
            id: "_g2ofj2vhm"
        },
        {
            type: "FieldExpressionGroup",
            expression: "osversion=1",
            id: "_ztv6qg5s3",
            nodes: [
                {
                    id: "_kowyyh2er",
                    type: "FieldExpression",
                    value: "osversion=1",
                    fieldName: "osversion",
                    fieldOperator: "=",
                    fieldValue: "1",
                    expression: "osversion=1"
                }
            ]
        }
    ]
}
```

## Usage

To add a Query widget in a container, follow these steps:
1. Instantiate the Query widget widget and provide the configuration object.
2. Call the build method of the Grid widget widget

### Step 1
Add the HTML markup to where queryBuilder widget will be rendered. For example:

```
<div class="queryContainer"></div>
```

### Step 2
Instantiate the QueryBuilder widget using the container created in step 1 and provide the configuration, then build the widget. For example:

```
new QueryBuilderWidget({
    "container": queryContainer,
    "logicMenu":  ['AND', 'OR', 'NOT'],
    "filterMenu": {
                    'OSVersionKey': {
                        'label': 'OSVersion',
                        'value': ['12.1', '12.2', '12.3', '12.4', '13.1', '13.2'],
                        'operators': ['=', '!=', '<', '>', '<=', '>=']
                    },
                    'DeviceFamilyKey': {
                        'label': 'DeviceFamily',
                        'value': ['SRX', 'MX', 'EX'],
                        'operators': ['=', '!=']
                    }
                }
}).build();
```
