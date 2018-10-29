# Search

The Search widget is a reusable graphical user interface that allows users to add a search container with tokens that represent the search criteria.
There are two flavours of the widget as "Read only" and "Advance filter".
The Search can be added to a container programmatically (widget) or as a component (React).

## Widget
The search is added to a container by creating an *instance* of the search widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the search will be built. For example, to add the search in the testContainer element:

```javascript
    new SearchWidget({
        "container": "readOnlySearchContainer",
        "readOnly": true
    }).build();
```

Any update required after the search is built can be done using the methods exposed by the widget.

More details can be found at [Search Widget](public/assets/js/widgets/search/searchWidget.md)


## React
The search can be rendered using the Search *component* and configured using a set of properties. For example, to include the search, add the component:

```javascript
    <Search
        logicMenu={['OR']}
    />
```
and then render and update its state using standard React methods. 

More details can be found at [Search React Component](public/assets/js/widgets/search/react/search.md)