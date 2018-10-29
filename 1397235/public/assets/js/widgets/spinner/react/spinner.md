# Spinner React Component


## Introduction
The spinner widget is a reusable graphical interface that allows users to show the spinner while loading a page or file. 
The current document describes how to add a spinner as a React component. To add a spinner programmatically, refer to [Spinner Widget](public/assets/js/widgets/spinner/spinnerWidget.md)


## API
The spinner React component gets its configuration from the Spinner properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The spinner React component has the following properties:

```javascript
 <Spinner
    hasPercentRate = <(optional) boolean, if the spinner has to show the percentage progress, then the value is true. Default: false.>
    statusText = <(optional) string, define the status text.>
    progress = <(optional) number, define the beginning progress state. Range from 0.0-1.0>
    timeStamp = <(optional) millionseconds, defines the beginning millionseconds state.>
    timeStampVisible = <(optional) boolean, defines if timeStamp should be visible.>
/>
```

For example, a spinner component could be rendered with the following element:

```javascript
   <Spinner
       statusText="Loading"
   />
```

### hasPercentRate
It defines if the spinner has to show the percentage progress. If not defined, the default will be indeterminate spinner.

### statusText
It define the status text.

### progress
It defines the beginning progress state.
Note: Only applies while using the percentage spinner.

### timeStamp
It defines the beginning millionseconds state.
Note: Only applies while using the percentage spinner.

### timeStampVisible
It defines if timeStamp should be visible.
Note: Only applies while using the percentage spinner.


## Usage
There are indeterminate and determinate spinners. 

### Indeterminate Spinner

To include a spinner component, render it using React standard methods. For example:

```javascript
    <Spinner
        statusText="Loading"
    />
```

The following example shows how the spinner component can be used in the context of a React application:

```javascript
    class SpinnerApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                "statusText": 'Current stage of operation...'
            };
        }
        render() {
            return (
                <Spinner
                    statusText={this.state.statusText}
                />
            );
        }
    };

    //render React components
    ReactDOM.render(<SpinnerApp />, pageContainer); //where pageContainer represents where the Spinner will be rendered
```

### Determinate Spinner

To include a spinner component, define it with at least hasPercentRate and then render it using React standard methods. For example:

```javascript
    <Spinner
        hasPercentRate={true}
        statusText={this.state.statusText}
        progress={this.state.progress}
        timeStamp={this.state.timeStamp}
        timeStampVisible={this.state.timeStampVisible}
    />
```

The following example shows how the spinner component can be used in the context of a React application:

```javascript
    class SpinnerApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                statusText: 'Current stage of operation...',
                progress: 0.0,
                timeStamp: 15000,
                timeStampVisible: true
            };
        }

        componentDidMount() {
            //Using methods dynamically. This simulates time updates when getting updates from backend.
            this.setTime = setInterval(
              () => this.updateProgress(),
              300
            ); 
        }

        updateProgress() {
            if (this.state.progress.toPrecision(2) >= 1.0){
                this.setState({
                  statusText: 'Complete', 
                  timeStampVisible: false
                });
                clearInterval(this.setTime);
            }else{
                this.setState({
                    progress: this.state.progress+0.02,
                    timeStamp: this.state.timeStamp -= 300
                });
            }
        }

        render() {
            return (
                <Spinner
                    hasPercentRate={true}
                    statusText={this.state.statusText}
                    progress={this.state.progress}
                    timeStamp={this.state.timeStamp}
                    timeStampVisible={this.state.timeStampVisible}
                />
            );
        }
    };

    //render React components
    ReactDOM.render(<SpinnerApp />, pageContainer); //where pageContainer represents where the Spinner will be rendered

    return this;
```
