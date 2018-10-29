
define(['backbone','../../../space-device-management/js/device/configuration/util/configurationUtility.js'],
         function(Backbone,ConfigurationUtility) {

    var deviceConfigValidateFormName = Backbone.View.extend({
      validateDuplicateName : function(name,xpath,rowId,self) {
           var self = self,duplicateExist,
            input = {};
           input['self'] = self;
           input['name'] = name;
           input['xpath'] = xpath;
           input['selected-id'] = rowId;

           duplicateExist = ConfigurationUtility.doesDataAlreadyExist(input);

           if (duplicateExist == true) {
               return self.context.getMessage('duplicate_entry_of_name', [name]);
           } else {
               return "";
           }
       },
       customFormValidation : function(name,xpath,rowId,self) {
           var self = self,
           errorText = "";

             errorText = self.validateDuplicateName(name,xpath,rowId,self);

           return errorText;

       },
       formatIdMetaData : function(cellvalue, options, rowObject) {
               if (cellvalue != undefined && cellvalue.inactive) {
                   return cellvalue.inactive;
               } else {
                   return false;
               }

      },
      formatStatus : function(cellvalue, options, rowObject) {
       if (rowObject != undefined) {
           var status = rowObject['id-meta-data'];
           if (status === undefined || status.inactive === false) {
               return "Activate";
               // return cellvalue.inactive;
           } else {
               return "Deactivate";
           }
       } else {
           return "Activate";
       }
     },
    toggleMetaDataOnSuccess : function(self, request, response) {
        self = request.self;
        var selectedRecords = request['selected-record'];
        if (selectedRecords && selectedRecords.length > 0) {
            var deviceScreenGridWidget = self.deviceScreenGridWidget;
            for (record in selectedRecords) {
                var recordData = selectedRecords[record];
                var recordString = JSON.stringify(recordData);
                var modifiedRecord = JSON.parse(recordString);

                if (recordData["id-meta-data"] === "true" || recordData["id-meta-data"] === true) {
                    modifiedRecord['id-meta-data'] = {};
                    modifiedRecord['id-meta-data']['inactive'] = false;
                } else {
                    modifiedRecord['id-meta-data'] = {};
                    modifiedRecord['id-meta-data']['inactive'] = true;
                }
                deviceScreenGridWidget.editRow(recordData, modifiedRecord);
            }
        }
        self.deviceScreenGridWidget.reloadGrid();
    },
    deActivateMetaDataOnSuccess : function(self, request, response) {
        self = request.self;
        var selectedRecords = request['selected-record'];
        if (selectedRecords && selectedRecords.length > 0) {
            var deviceScreenGridWidget = self.deviceScreenGridWidget;
            for (record in selectedRecords) {
                var recordData = selectedRecords[record];
                var recordString = JSON.stringify(recordData);
                var modifiedRecord = JSON.parse(recordString);

                modifiedRecord['id-meta-data'] = {};
                modifiedRecord['id-meta-data']['inactive'] = true;

                deviceScreenGridWidget.editRow(recordData, modifiedRecord);
            }
        }
    },
      activateMetaDataOnSuccess : function(self, request, response) {
        self = request.self;
        var selectedRecords = request['selected-record'];
        if (selectedRecords && selectedRecords.length > 0) {
            var deviceScreenGridWidget = self.deviceScreenGridWidget;
            for (record in selectedRecords) {
                var recordData = selectedRecords[record];
                var recordString = JSON.stringify(recordData);
                var modifiedRecord = JSON.parse(recordString);

                modifiedRecord['id-meta-data'] = {};
                modifiedRecord['id-meta-data']['inactive'] = false;

                deviceScreenGridWidget.editRow(recordData, modifiedRecord);
            }
        }
    }
    });

    return deviceConfigValidateFormName;
});
