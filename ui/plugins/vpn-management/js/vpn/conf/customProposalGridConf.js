define([
], function(){
	
	var CustomProposalGridConf = {
		"numberOfRows": 4,
		"multiselect": "true",
		"contextMenu": {
		    "edit": "Edit",
		    "delete": "Delete",
		    "create": "Create"
		},

		"columns" : [
			{
				"index": "name",
                "name": "name",
                "label": "Name"
                // "width": 50
			},
			{
				"index": "dhgroup",
                "name": "dhgroup",
                "label": "DH Group"
                // "width": 50
			},
			{
				"index": "authentication",
                "name": "authentication",
                "label": "Authentication"
                // "width": 50
			},
			{
				"index": "encryption",
                "name": "encryption",
                "label": "Encryption"
                // "width": 50
			},
			{
				"index": "life-time",
                "name": "life-time",
                "label": "Life Time (in secs)"
                // "width": 50
			}
		]

	};
	return CustomProposalGridConf;
});