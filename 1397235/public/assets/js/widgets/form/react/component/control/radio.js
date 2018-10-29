/**
 * A stateless React component that creates a Radio
 *
 * @module Radio
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'react-dom',
    'es6!widgets/form/react/component/common/group'
], function (React, ReactDOM, Group) {

    const Radio = (props) => {
        const {children, ...compProps} = props;
        return (
            <Group
                {...compProps}
                type="radio"
            >
                {children}
            </Group>
        )
    };
    Radio.displayName = "Radio";

    return Radio;

});