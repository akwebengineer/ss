# Progress Bar React Component


## Introduction
The progress bar widget is a reusable graphical interface that allows users to show the progress bar while loading a page or file. 
The current document describes how to add a progress bar as a React component. To add a progress bar programmatically, refer to [Progress Bar Widget](public/assets/js/widgets/progressBar/progressBarWidget.md)


## API
The progress bar React component gets its configuration from the ProgressBar properties. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The progress bar React component has the following properties:

```javascript
 <ProgressBar
    hasPercentRate = <(optional) boolean, if the progress bar has to show the percentage progress, then the value is true. Default: false.>
    statusText = <(optional) string, defines the status text.>
    progress = <(optional) number, defines the beginning progress state. Range from 0.0-1.0>
    timeStamp = <(optional) millionseconds, defines the beginning millionseconds state.>
    timeStampVisible = <(optional) boolean, defines if timeStamp should be visible.>
/>
```

For example, a progress bar component could be rendered with the following element:

```javascript
   <ProgressBar
       statusText="Loading"
   />
```

### hasPercentRate
It defines if the progress bar has to show the percentage progress. If not defined, the default will be indeterminate progress bar.

### statusText
It defines the status text.

### progress
It defines the beginning progress state.
Note: Only applies while using the percentage progress bar.

### timeStamp
It defines the beginning millionseconds state.
Note: Only applies while using the percentage progress bar.

### timeStampVisible
It defines if timeStamp should be visible.
Note: Only applies while using the percentage progress bar.


## Usage
There are indeterminate and determinate progress bars. 

### Indeterminate Progress Bar

To include a progress bar component, render it using React standard methods. For example:

```javascript
    <ProgressBar
        statusText="Loading"
    />
```

The following example shows how the progress bar component can be used in the context of a React application:

```javascript
    class ProgressBarApp extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                "statusText": 'Current stage of operation...'
            };
        }
        render() {
            return (
                <ProgressBar
                    statusText={this.state.statusText}
                />
            );
        }
    };

    //render React components
    ReactDOM.render(<ProgressBarApp />, pageContainer); //where pageContainer represents where the Progress Bar will be rendered
```

### Determinate Progress Bar

To include a progress bar component, define it with at least hasPercentRate and then render it using React standard methods. For example:

```javascript
    <ProgressBar
        hasPercentRate={true}
        statusText={this.state.statusText}
        progress={this.state.progress}
        timeStamp={this.state.timeStamp}
        timeStampVisible={this.state.timeStampVisible}
    />
```

The following example shows how the progress bar component can be used in the context of a React application:

```javascript
    class ProgressBarApp extends React.Component {
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
                <ProgressBar
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
    ReactDOM.render(<ProgressBarApp />, pageContainer); //where pageContainer represents where the Spinner will be rendered

    return this;
```
