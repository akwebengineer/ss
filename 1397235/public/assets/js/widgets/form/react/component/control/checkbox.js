/**
 * A stateless React component that creates a Checkbox
 *
 * @module Checkbox
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/form/react/component/common/group'
], function (React, Group) {

    const Checkbox = (props) => {
        const {children, ...compProps} = props;
        return (
            <Group
                {...compProps}
                type="checkbox"
            >
                {children}
            </Group>
        )

    };
    Checkbox.displayName = "Checkbox";

    return Checkbox;

});