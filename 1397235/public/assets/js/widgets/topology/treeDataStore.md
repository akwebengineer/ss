# TreeDataStore

## Introduction
The TreeDataStore is a reusable data management wrapper. Updates to the dataStore using its methods automatically updates visualization.

## API
The TreeDataStore exposes: get, put, add, remove methods.

## Configuration
A JSON object.
```
var data = {
           "name": "File 1-1-1-1",
           "id": "3242342",
           "icon": "file_default",
           "children": [],
           "type": "fs-topo-node",
           "link": {
               "id": "32342",
               "type": "fs-topo-link"
           }
       };
var dataStoreInstance = new TreeDataStore(data);       
```

## Methods
Methods to access or update data available in the dataStore.

### get
By passing an id as a parameter, the specific node identified by the id is returned. If no id is passed, the entire data is returned.
```
var node = dataStoreInstance.get("Node100");
var data = dataStoreInstance.get();
```

### put
The put method accepts a node as a parameter. The node which matches the passed node id gets updated.
```
var node = {
            "name": "File 1-1-1-1",
            "id": "3242342",
            "icon": "file_default",
            "children": [],
            "type": "fs-topo-node",
            "link": {
                "id": "32342",
                "type": "fs-topo-link"
            }
        };
dataStoreInstance.put(node);
```

### add
The add method accepts an id and either a single node / nodes array as parameters. The nodes gets added as children to the node which matches the passed id.
```
var nodes = [{
            "name": "File 1-1-1-1",
            "id": "6788",
            "icon": "file_default",
            "children": [],
            "type": "fs-topo-node",
            "link": {
                "id": "88",
                "type": "fs-topo-link"
            }
        }];
dataStoreInstance.add("3242342", nodes);
var node = {
            "name": "File 1-1-1-2",
            "icon": "file_default",
            "id": "6789",
            "children": [],
            "type": "fs-topo-node",
            "link": {
                "id": "89",
                "type": "fs-topo-link"
            }
        };
dataStoreInstance.add("3242342", node);
```

### remove
The specific node identified by the id is removed from the dataStore.
```
dataStoreInstance.remove("6788");
```
