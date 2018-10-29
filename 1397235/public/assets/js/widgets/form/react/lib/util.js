/**
 * A module that packs utility methods needed to map the components that will be render based on their displayName
 *
 * @module Util
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react'
], function (React) {

    const Util = {};

    /**
     * Iterates over the children of React virtual DOM to get only the matching children based on their display name
     * @param {Object} children - React children to be iterated
     * @param {string} componentName - Display name of a component
     * @param {Object} props - props that will be passed to the matching component
     */
    Util.getComponentsByName = (children, componentName, props) => {
        return React.Children.map(children, child => {
            if (child.type && child.type.displayName == componentName) {
                return React.cloneElement(child, props)
            }
        })
    };

    /**
     * Iterates over the children of React virtual DOM to remove only the matching children based on their display name
     * @param {Object} children - React children to be iterated
     * @param {string/Array} componentName - Display name of a component(s)
     * @param {Object} props - props that will be passed to the matching component
     */
    Util.getComponentsNotInName = (children, componentName, props) => {
        const hasComponentName = (displayName, componentNames) => {
            if (_.isArray(componentNames)) {
                return componentNames.indexOf(displayName) != -1;
            } else if (componentNames == displayName) {
                return true;
            }
            return false;
        };
        return React.Children.map(children, child => {
            if (child.type) {
                if (!hasComponentName(child.type.displayName, componentName)) {
                    return React.cloneElement(child, props)
                }
            } else {
                return child
            }
        })
    };

    /**
     * Iterates over the children of React virtual DOM to get a property of the matching children based on their display name
     * @param {Object} children - React children to be iterated
     * @param {string/Array} componentName - Display name of a component(s)
     * @param {string} propertyName - Property to be found
     */
    Util.getPropertyComponentsByName = (children, componentName, propertyName) => {
        return React.Children.map(children, child => {
            if (child.type && child.type.displayName == componentName && child.props[propertyName]) {
                return child.props[propertyName]
            }
        })
    };

    /**
     * Iterates over the children of React virtual DOM to get a property of the matching children and children value based on their display name
     * @param {Object} children - React children to be iterated
     * @param {string/Array} componentName - Display name of a component(s)
     * @param {string} propertyName - Property to be found
     */
    Util.getPropertyComponentsAndChildrenByName = (children, componentName, propertyName) => {
        return React.Children.map(children, child => {
            if (child.type && child.type.displayName == componentName && child.props[propertyName]) {
                return {
                    property: child.props[propertyName],
                    value: _.isArray( child.props.children) ? child.props.children[0] : child.props.children
                }
            }
        })
    };

    return Util;

});