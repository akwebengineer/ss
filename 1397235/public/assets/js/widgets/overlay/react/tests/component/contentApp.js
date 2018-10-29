/**
 * A component that generates the content for an overlay from a set of configuration properties
 *
 * @module ContentApp
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
], function (React, ReactDOM) {

    class ContentApp extends React.Component {

        constructor(props) {
            super(props);
        }

        render() {
            let contentBody = this.props.minimalBody || this.props.overflowingBody;
            return (
                <div>
                    {this.props.contentTitle && <h4>{this.props.contentTitle}</h4>}
                    {contentBody && <div>{contentBody}</div>}
                    {this.props.contentFields &&
                        <div>
                            {this.props.contentFields.map(function (field, index) {
                                return (
                                    <div key={index}>
                                        {field.label}
                                        <input type="text" id={field.id} name={field.name}
                                               placeholder={field.placeholder}/>
                                    </div>
                                )
                            })}
                        </div>
                    }
                    {this.props.contentButtons &&
                        <div className="right">
                            {this.props.contentButtons.map(function (button, index) {
                                return (
                                    <input type="submit" className="slipstream-secondary-button" key={index} id={button.id}
                                           name={button.name} value={button.value}/>
                                )
                            })}
                            <br/><br/>
                        </div>
                    }
                    <br/>
                </div>
            );
        }

    }

    ContentApp.defaultProps = {
        contentFields: [],
        contentButtons: []
    };

    return ContentApp;

});