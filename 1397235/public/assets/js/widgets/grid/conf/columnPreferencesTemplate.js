/**
 * @module columnPreferencesTemplate
 *
 * This module defines a template that describes the set of grid column attributes
 * to be persisted to the preferences database.  The template consists of an array of 
 * Strings, each of which defines the name of an attribute to be persisted.
 *
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */
define(function() {
    return ["name", "width", "hidden"];	
});