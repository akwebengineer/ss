/**
 * A sample date to render a tree grid for the grid widget
 *
 * @module dataSample
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([
    'text!widgets/grid/tests/dataSample/tree/page1.json',
    'text!widgets/grid/tests/dataSample/tree/page2.json',
    'text!widgets/grid/tests/dataSample/tree/page3.json',
    'text!widgets/grid/tests/dataSample/tree/node1.json',
    'text!widgets/grid/tests/dataSample/tree/node2.json',
    'text!widgets/grid/tests/dataSample/tree/node4.json',
    'text!widgets/grid/tests/dataSample/tree/node11.json',
    'text!widgets/grid/tests/dataSample/tree/node15.json',
    'text!widgets/grid/tests/dataSample/tree/node25.json',
    'text!widgets/grid/tests/dataSample/tree/node55.json'
], function (
    page1,
    page2,
    page3,
    node1,
    node2,
    node4,
    node11,
    node15,
    node25,
    node55
) {

    var dataSample = {};
    dataSample.firewallPoliciesAll = JSON.parse(page1);
    dataSample.firewallPoliciesPage2 = JSON.parse(page2);
    dataSample.firewallPoliciesPage3 = JSON.parse(page3);
    dataSample.firewallPoliciesLevel1 = JSON.parse(node1);
    dataSample.firewallPoliciesLevel2 = JSON.parse(node2);
    dataSample.firewallPoliciesLevel4 = JSON.parse(node4);
    dataSample.firewallPoliciesLevel11 = JSON.parse(node11);
    dataSample.firewallPoliciesLevel15 = JSON.parse(node15);
    dataSample.firewallPoliciesLevel25 = JSON.parse(node25);
    dataSample.firewallPoliciesLevel55 = JSON.parse(node55);

    return dataSample;

});