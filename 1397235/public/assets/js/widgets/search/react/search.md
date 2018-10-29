# Search React Component

## Introduction
The Search widget is a reusable graphical user interface that allows users to add a search container with tokens that represent the search criteria.

Search can be added to a container programmatically or as a component.
The current document describes how to add a Search as a React component [Search React Component](public/assets/js/widgets/search/react/search.md).
To add a Search programmatically, refer to [Search Widget](public/assets/js/widgets/search/searchWidget.md).

There are two flavours of the widget - "Read Only Filter" and "Advanced Filter"
React component is available for "Read Only Filter". For advance search capabilities and features, queryBuilder react component should be used.

## API
The Search React component gets its configuration from the Search properties. Once the component is rendered, it could be modified by updates on its state and properties.
Any UI changes will trigger the onChange event.


## Properties
The Search React component has the following properties:

```javascript
 <Search
    logicMenu = <(optional) array, to have the value for logical operator in between the tokens. By default 'OR' is the value>
    tokens = <(optional) array, if the tokens are provided, the same will be added to the search bar.>
    onChange = <(optional) function, callback that is invoked when the updates to the tokens are made on UI>
/>
```

For example, a Search component could be rendered with the following elements:
```javascript
   <Search
      logicMenu={['OR']}
      tokens={this.state.tokens}
      onChange={(tokens) => this.setState({"tokens": tokens})}
  />
```

### logicMenu
It defines the logical operator value in between the tokens. Data type is array and the valid set of values are 'OR, 'AND', NOT'.
By default 'OR' is the value

```javascript
   <Search
      logicMenu={['OR']}
  />
```

### tokens
It defines the tokens that are meant to be shown in the search bar. The data type accepted is an array of strings. e.g

```javascript
    <Search
        tokens={['123.43.5.3', 'OSVersion = 12.2']}
    />
```

### onChange
It defines the callback that will be invoked when the value of the search component is updated; i.e. when the token is added, removed, replaced etc.

```javascript
   <Search
      onChange={(tokens) => this.setState({"tokens": tokens})}
  />
```

## Usage
To include a search component, define it with the tokens property and then render it using React standard methods.
If tokens are not passed as properties, the search bar will be shown as empty. For example:

```javascript
    <Search
        tokens={['123.43.5.3', 'OSVersion = 12.2']}
    />
```

The following example shows how the search component can be used in the context of a React application:

```javascript
    class SearchApp extends React.Component {
       constructor(props) {
           super(props);
           this.state = {
               tokens: ["123.43.5.3", "ManagedStatus = InSync, OutSync"]
            };
       }
       render() {
           return (
               <Search
                    tokens={this.state.tokens}
                    onChange={(tokens) => this.setState({"tokens": tokens})}
                />
           );
       }
    };
    ReactDOM.render(<SearchApp/>, pageContainer); //where pageContainer represents where the Search bar will be rendered
```