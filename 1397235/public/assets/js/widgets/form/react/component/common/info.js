/**
 * A stateless React component that creates a Info box with error or info types
 *
 * @module Info
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom'
], function (React, ReactDOM) {

    const Info = (props) => {
        const {errorType, className, children} = props;
        //Todo: remove inline style once validation is inplace
        return (
            <div data-alert
                 className={`alert-box ${errorType ? 'error-message' : 'info-message'} ${props.className}`}
                 style={{display: 'block'}}>
                <svg>
                    <use href={errorType ? '#icon_error' : '#icon_info_search'}></use>
                </svg>
                <span className="content">{props.children}</span>
            </div>
        )
    };
    Info.displayName = "Info";

    return Info;

});