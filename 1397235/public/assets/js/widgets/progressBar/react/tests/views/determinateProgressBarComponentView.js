/**
 * A view that uses the progressBar component (created from the progressBar widget) to render a determinate progressBar using React
 *
 * @module ProgressBar Component View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/progressBar/react/progressBar'
], function (React, ReactDOM, ProgressBar) {
    var ProgressBarComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            //creates a React component from the progressBar component so states can be handled by the user of the determinate progressBar component
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
            ReactDOM.render(<ProgressBarApp />, this.el);

            return this;
        };
    };

    return ProgressBarComponentView;
});