/**
 * A stateless React component that creates a Group control to be used for radio button or checkboxes
 *
 * @module Group
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
], function (React) {

    const Group = (props) => {
        const {children, pattern, checked, name, ...compProps} = props;
        return (
            <div className="optionselection">
                <input
                    data-validation="validtext"
                    defaultChecked={checked}
                    name={name}
                    {...compProps}
                />
                <label
                    htmlFor={props.id}
                    className={props.disabled ? "disabled" : ""}
                >
                    {children}
                </label>
            </div>
        )
    };
    Group.displayName = "Group";

    return Group;

});