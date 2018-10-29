/**
 * A stateless React component that creates a Button
 *
 * @module Button
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react'
], function (React) {

    const Button = (props) => {
        return (
            <input
                type={props.type}
                className={props.isSecondary ? "slipstream-secondary-button" : "slipstream-primary-button"}
                id={props.id}
                name={props.name}
                value={props.value}
            />
        )
    };
    Button.defaultProps = {
        type: "submit"
    };
    Button.displayName = "Button";

    return Button;

});