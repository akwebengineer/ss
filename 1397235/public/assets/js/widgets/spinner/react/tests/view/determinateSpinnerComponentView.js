/**
 * A view that uses the spinner component (created from the spinner widget) to render a determinate spinner using React
 *
 * @module Spinner Component View
 * @author Eva Wang <iwang@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/spinner/react/spinner'
], function (React, ReactDOM, Spinner) {
    var SpinnerComponentView = function (options) {
        this.el = options.$el[0];

        this.render = function () {
            //creates a React component from the spinner component so states can be handled by the user of the determinate spinner component
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
            ReactDOM.render(<SpinnerApp />, this.el);

            return this;
        };
    };

    return SpinnerComponentView;
});