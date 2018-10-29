/**
 * A stateless React component that creates a Link
 *
 * @module Link
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react'
], function (React) {

    const Link = (props) => {
        const {children, ...linkProps} = props;
        return (
            <span className="elementLink">
                <a {...linkProps}>
                    {children}
                </a>
            </span>
        );
    };
    Link.displayName = "Link";

    return Link;

});