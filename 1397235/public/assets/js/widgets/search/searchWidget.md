# Search Widget


## Introduction
The Search widget is a reusable graphical user interface that allows users to add a search container with tokens that represent the search criteria.
There are two flavours of the widget
#### Read Only Filter
This is non-editable on UI for the values. This does not include the logical operators as part of the filter values.
#### Advanced Filter
This is editable on UI for the filter values. This also have the capability of having the logical operators as part of the filter string.


## API
The Search widget follows the widget programming interface standards, therefore it exposes: a build and destroy methods. Additional supported methods are addTokens, removeToken, removeAllTokens, getAllTokens.
Any data required by the widget is passed by its constructor.


## Configuration
The configuration object has multiple parameters. Only the container parameter is a required one.

```
{
    container:  <DOM object that defines where the widget will be rendered.>
    readOnly: <boolean that defines if the token area will be shown as a read only container. In this case, the filter and logic menus won't be available.>
    filterMenu: <Object that defines the filter context menu that will be shown on the token area. It is used to select the key and value of a token.>
    logicMenu: <Array that defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens.>
    implicitLogicOperator: <boolean defining whether the logic operator between tokens will be added implicitly>
    tokenizeOnEnter: <boolean that defines if tokenization is performed on the current token when the user hits the Enter key>.
    autoComplete: <Object that defines the autocomplete behavior of the widget>
    operators: <Array that defines the operators that will be shown on the token area between key value. it can be overridden in individual config parameter.>
    allowPartialTokens: <boolean that defines if token completion events will be generated as a user types tokens, even if the token has not been completed.  The default is false.>
    keyTokens: <Object that defines the behaviour of key tokens.>
    afterTagAdded: <callback function invoked after a tag is added.>
    afterTagRemoved: <callback function invoked after a tag is removed.>
    afterAllTagRemoved: <callback function invoked after all tags are removed.>
    afterPartialTagUpdated: <callback function invoked after the partial token is updated.  This callback function will be called if allowPartialTokens=true and a partial token has been updated.
    The partial token will be passed as an argument to the callback.  Calling getAllTokens() will return all of the created tokens, including the partial token being created.
    The partial token will be the last token in the array returned from getAllTokens()>.
}
```

For example, a Search widget would be instantiated with:

```
var readOnlySearchContainer = this.$el.find('.readOnlySearchContainer')[0];

var searchWidget = new SearchWidget({
    "container": readOnlySearchContainer,
    "readOnly": true
});
```

### container
It represents the DOM element that will have a Search.


### readOnly
By default it is false. If it is set to true, the search container will turn into a read only mode and the filter, logic menu and operators won't be available.

### filterMenu
Defines the items that will be listed in filter context menu and that will be available on the token area. It is used to select the key and value of a token. If the readOnly parameter is set to true, this parameter will be ignored. For example:

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

'key' of the object is the element key e.g. - DeviceFamilyKey
'label' is string that represents the label of the item that will be shown in the UI search filter e.g. - Device
'value' is an array that represents the list of values that will be showed in UI if the respective key is selected e.g. - ['SRX','MX','EX']
'operators' is an array of operators that user can use to override the global or all operators.

### logicMenu
It defines the logic menu that will be shown on the token area between two tokens. It is used to replace the default AND logic operator added by default between two tokens. It is represented by an array. For example

```
var logicMenu = ['AND','OR','OR NOT','AND NOT']
```
### implicitLogicOperator
Defines whether the logic operator between simple tokens will be added implicitly.   If true then the first operator defined in the *logicMenu* will be considered the implicit operator and all others will be ignored.  The default is false.  The implicit logic operator will not be shown on the UI but will be returned by *getAllTokens*.  

**Note:** This option is not supported for generalized boolean expressions.  It can only be used when search expressions consist of *simple tokens* that do not contain relational operators or are grouped via parentheses.  This option is also not applicable in *readOnly* mode.

### autoComplete
An object that defines the widget's autocomplete behavior. This object has the following attributes:

  - **inline**: true | false

  If true, auto-completion of keys will occur inline rather than via a drop-down menu.  The default is false.  
  
If user input has generated an auto-complete suggestion the suggestion can be accepted by hitting the TAB key.  If *tokenizeOnEnter* is true and the Enter key is pressed before the suggestion has been accepted, the auto-completed text will be ignored and a token will be created from the user-entered input only.

### tokenizeOnEnter
Defines whether tokenization is performed on the current token when the user hits the Enter key.  The default is *true*.  

When this option is *true* pressing the Enter key will create a token from the user-entered input only and will not include any auto-completed suggestions as part of the token.

### allowPartialTokens
Defines if token completion events will be generated as a user types tokens, even if the token has not been completed.  The default is false.

### keyTokens
Defines the behaviour of key tokens respective the defined configuration.

    - **maxNumber**: positive integer

        If maxNumber has a positive integer, accordingly number of keys will be restricted to the defined maximum count. Also the autocomplete will only show for the defined number of maximum keys in search container.
        If nothing is defined, the default state is no maximum limit on the number of specified keys.

    - **position**: "start" | "any"

        If 'start' specified, then the first token has to be of key type, which is defined in configuration.
        If 'any' is specified, then there is no restriction on the position of key tokens.

### afterTagAdded
It defines a callback function that is invoked after a tag is added.

### afterTagRemoved
It defines a callback function that is invoked after a tag is removed.

### afterAllTagRemoved
It defines a callback function that is invoked after all tags are removed.

### afterPartialTagUpdated
It defines a callback function that is invoked after the partial token is updated.  This callback function is called if *allowPartialTokens* is enabled and a partial token has been updated.

Calling *getAllTokens* will return all of the created tokens, including the partial token if it exists.
    The partial token will always be the last token in the array returned from *getAllTokens*.


## API Methods
### build
Adds the DOM elements and events for the Search widget in the specified container. For example:

```
{
    searchWidget.build();
}
```


### destroy
Cleans up the specified container from the resources created by the Search widget.

```
{
    searchWidget.destroy();
}
```

### addTokens
Adds new token to the token area. It accepts the Array of strings that may include single token OR label-value token. The labels should match the config labels.
For key value token, the format accepts <label operator values> || <configKey operator values>

Read only tokens are implicitly connected with logical operator 'AND' which not shown in UI and also is not required in addTokens method.

Logical operators are required between each valid token in Advanced filters. Advanced filter also supports nested precedence, for which each open and close parenthesis
has to be included as a separate string for their respective positions.
For example:

Read Only Filter Example:-
```
{
   readOnlyWidget.addTokens(['123.43.5.3', 'ManagedStatus < InSync, OutSync', 'ConnectionStatus = Down, Up']);
}
```
This will add and show '123.43.5.3' as single token and 'ManagedStatus < InSync,OutSync', 'ConnectionStatus = Down,Up' as Key value token in the filter

Advanced Filter Example:-
```
{
    searchWidget.addTokens(['Managed Status = InSync, OutSync', 'AND', 'Name = SRX, MX', 'OR', '10.10.10.10']);
}
```
This will add 'Managed Status = InSync, OutSync' and 'Name = SRX, MX' as Key-value token and '10.10.10.10' as single token.


```
{
    searchWidget.addTokens(['Managed Status = InSync, OutSync', 'AND', 'NameKey = SRX, MX', 'OR', '10.10.10.10']);
}
```
This will add 'Managed Status = InSync, OutSync' and 'Name = SRX, MX' as Key-value token and '10.10.10.10' as single token.

```
{
    searchWidget.addTokens(['(','(','(','Managed Status = InSync, OutSync', 'AND', 'NameKey = test1, test2, test3','NOT','10.10.10.10',')','OR','(','DeviceFamily != SRX,MX','AND','ConnectionStatusKey = up',')',')','OR','10.10.10.10',')']);

}
```
This will add ( ( ( ManagedStatusKey = InSync,OutSync AND NameKey = test1,test2,test3 NOT 10.10.10.10 ) OR ( DeviceFamilyKey != SRX,MX AND ConnectionStatusKey = up ) ) OR 10.10.10.10 ) in the Advanced search filter.

Note: In any case whether a label or ConfigKey provided, label will appear in filter bar.

### replaceToken
Replaces an existing token in the string with the provided token. It accepts the single token key OR key-value token, based on which the token is removed & provided token is added in the end of the search string.

### removeToken
Removes the specified token from the search container. Based on the parameters value, this method will delete either the entire token Or the partial values from the token.
It accepts the string value as token value. Also if the 'appendValue' parameter is set to true, this method will remove the token from it's current position in the filter and append back the modified token in the last position of filter.
For example:

If the filter bar have token 'DeviceFamilyKey = SRX,MX,EX'
Following are the remove scenarios

```
{
    searchWidget.removeToken('DeviceFamilyKey'); // remove only the key | Result:- Entire token should be deleted from list.
}
```

```
{
    searchWidget.removeToken('DeviceFamilyKey = MX'); // remove only the key with only one value | Result:- DeviceFamilyKey = SRX,EX
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey = SRX,EX'); // remove only the key with more than one value but not all the values | Result:- DeviceFamilyKey = MX
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey = SRX,MX,EX'); // remove only the key with along with all matching values but not all the values | Result:- DeviceFamilyKey = SRX,MX,EX
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey', true); // remove only the key | Result:- Entire token should be deleted from list
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey = MX', true); // delete token and append back already existing value | Result:- DeviceFamilyKey = SRX,EX,MX
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey = SRX,EX', true); // delete token and append back already existing values | Result:- DeviceFamilyKey = MX,SRX,EX
}
```

```
{
    searchWidgetObj.removeToken('DeviceFamilyKey = NotAlreadyExists', true); // delete token and append back NotAlreadyExists in the token | Result:- DeviceFamilyKey = SRX,MX,EX,NotAlreadyExists
}
```

### removeAllTokens
Removes all the tokens from filter bar.

### getAllTokens
Gets all available tokens from the token container.

### getTokensExpression
Gets a search expression string as entered in UI. For read only tokens, search string is formulated with 'AND' operator in between the tokens.
Tokens are space separated.

### focusInput
Sets the focus to the widget's input field.

## Usage
To include the Search widget, a container should be identified, and then passed in to the constructor of the Search widget, and finally call the build method on this instance. The steps to follow are:

### Read Only Example
Add the HTML markup that needs to show a context menu when the container is click (or right click depending on configuration). For example:
In this mode on UI only the remove action is available.

```
<div class="searchContainer"></div>

```

### Step 2
Instantiate the Search widget using the container created in step 1 and then build the widget. For example:

```
new SearchWidget({
    "container": readOnlySearchContainer,
    "readOnly": true,
    "afterTagRemoved": this.afterTagRemoved
});.build();
```

In the above example,  readOnly is set as true and also afterTagRemoved call back is configured that will trigger when tag is removed.


### Advanced Search Example
In advanced search logical operators and tokens are editable using the suggestion card and keyboard inputs. Also the action allowed on UI serach filter is removing the token.

### Step 1
Add the HTML markup that needs to show a context menu when the container is click (or right click depending on configuration). For example:

```
<div class="searchContainer"></div>

```

### Step 2
Create a configuration object with the filter and logic menus and operators if the search is editable (readOnly set to false). For example:

```
var searchConf = {};

searchConf.operators = ['=','!='];

searchConf.filterMenu = {
    'nameKey': {
        'label':'name',
        'value':['SRX','MX','EX'],
        'operators': ['=','!=']
    },
    'sourceAddressKey': {
        'label':'sourceAddress',
        'value':['12.1','12.2','12.3','12.4','13.1','13.3','13.3','13.4'],
        'operators': ['=','!=','<','>','<=']
    },
    'PlatformKey': {
        'label':'Platform',
        'value':['srx650', 'srx5800', 'mx2020', 'ex2200'],
        'operators': ['=','!=']
    },
    'ManagedStatusKey': {
        'label':'ManagedStatus',
        'value':['InSync','OutSync','Connecting'],
        'operators': ['=','!=']
    },
    'ConnectionStatusKey': {
        'label':'ConnectionStatus',
        'value':[], // if value property is empty or missing, there will be no suggestion card on the UI
        'operators': ['=','!=']
    },
    'IPAddressKey': {
        'label':'IPAddress'
    }
};

searchConf.logicMenu = ['AND','OR','NOT'];
```

In the above config,
- if operators can be configured for each specific key, for example:- sourceAddress will have following ['=','!=','<','>','<='] as valid operators
- if operators are missing for specific config element than global operators config is picked, for example:- IPAddress will have following [['=','!='] as valid operators
- if operators are missing for specific config element and global operators config is missing, then all operators are valid list of operators, for example:- ['=','!=','<','>','<=','>='] as all valid operators

### Step 3
Instantiate the Search widget using the container created in step 1 and the configuration created in step 2 and then build the widget. For example:

```
new SearchWidget({
    "filterMenu": configurationSample.filterMenu,
    "logicMenu": configurationSample.logicMenu,
    "operators": configurationSample.operators,
    "container": searchContainer
});.build();
```