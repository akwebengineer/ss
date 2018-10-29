/**
 * Tree configuration objects with the parameters required to build a tree
 *
 * @module configurationSample
 * @author Swena Gupta <gswena@juniper.net>
 * @copyright Juniper Networks, Inc. 2014
 */

define([], function () {
    function onSelect(selections) {
        console.log('App provided callback, a node was selected: ');
        console.log(JSON.stringify(selections));
    }

    function onDeselect(selections) {
        console.log('App provided callback, a node was deselected: ');
        console.log(JSON.stringify(selections));
    }

    function onExpand(node) {
        console.log('App provided expand callback');
        console.log(JSON.stringify(node));
    }

    function onCollapse(node) {
        console.log('App provided collapse callback');
        console.log(JSON.stringify(node));
    }
    var configurationSample = {};
    configurationSample.local = {
        data: {
            id: 1,
            text: "Global",
            children: [
                {
                    id: 2,
                    text: "orpheus",
                    children: [
                        {
                            id: 3,
                            text: "orpheus-dev"
                        },
                        {
                            id: 4,
                            text: "orpheus-qa"
                        }
                    ]
                },
                {
                    id: 5,
                    text: "argon",
                    children: [
                        {
                            id: 6,
                            text: "argon-dev",
                            children: [
                                {
                                    id: 8,
                                    text: "new-argon-dev"
                                },
                                {
                                    id: 9,
                                    text: "new-argon-qa"
                                }
                            ]
                        },
                        {
                            id: 7,
                            text: "argon-qa"
                        }
                    ]
                }
            ]
        },
        onSelect: onSelect,
        onDeselect: onDeselect,
        onExpand: onExpand,
        onCollapse: onCollapse

    };
    configurationSample.remote = {
        search: true,
        url: function(node) {
            if (node.id == '#') {
                return '/api/space/domain-management/domains';
            }

            return node.data['@href'];
        },
        dataFilter: function(data) {
            data = JSON.parse(data);

            var hasChildren;
            var nodes = {
                data: data.domain,
                id: data.domain.id,
                text: data.domain.name
            };

            if (data.domain.children && data.domain.children.domain && Array.isArray(data.domain.children.domain)) {
                nodes.children = [];
                for (var i = 0, j = data.domain.children.domain.length; i < j; i++) {
                    hasChildren = (data.domain.children.domain[i]['child-count'] > 0) ? true : false;
                    nodes.children[i] = {
                        data: _.clone(data.domain.children.domain[i]), // Hold server data in separate property
                        id: data.domain.children.domain[i].id,         // Will be generated if not provided
                        text: data.domain.children.domain[i].name,     // The value to display in the tree
                        children: hasChildren                          // Set to true if there are children that need to be fetched on expand
                    }
                }
            }

            return JSON.stringify(nodes);
        },
        ajaxOptions: {
            headers: {
                'Accept': 'application/vnd.net.juniper.space.domain-management.domain+json;version=1;q=0.01'
            }
        },
        onSelect: onSelect,
        onDeselect: onDeselect,
        onExpand: onExpand,
        onCollapse: onCollapse,
        onFilter: function(q, cb) {
            // Here you may perform an ajax request or other operation to perform the search
            // Process the data as needed, creating an array of nodes that have children matching
            // the search string.  You are telling the tree which nodes have not been loaded yet,
            // but are known to have matching children.

            // Call callback, passing array of nodes that have matches (NOT a list of matched nodes)
            cb(["1016310"]);
        }
    };

    return configurationSample;

});
