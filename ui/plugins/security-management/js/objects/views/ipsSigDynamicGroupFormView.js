/**
 *  A View object for Ips Dynamic Group form
 *
 *  @module ips static group form
 *  @author dkumara<dkumara@juniper.net>
 *  @copyright Juniper Networks, Inc. 2015
 * */
define(
    [
        'backbone',
        'backbone.syphon',
        'widgets/form/formWidget',
        'widgets/overlay/overlayWidget',
        'widgets/tabContainer/tabContainerWidget',
        '../../../../ui-common/js/views/apiResourceView.js',
        './ipsSigDynBasicTabView.js',
        './ipsSigDynAdvanceTabView.js',
        '../conf/ipsSig.js',
        '../conf/ipsSigDynamicFormConfiguration.js',
        'widgets/dropDown/dropDownWidget',
        './ipsSigOverlayView.js',
        '../../objects/widgets/ipsSigCategoryListBuilder.js',
        '../../objects/widgets/ipsSigServiceListBuilder.js',
    ],

    function(Backbone, Syphon, FormWidget, OverlayWidget, TabContainerWidget, ResourceView,
        IPSSigDynBasicTabView, IPSSigDynAdvanceTabView, IPSSigJSON, IPSSigDynamicConf, DropDownWidget, IPSSigOverlayView, CategoryListBuilder, ServListBuilder) {

        var IpsSigDynamicGroupFormView = ResourceView.extend({

            events: {
                'click #ips-sig-dynamic-group-save': "submit",
                'click #ips-sig-dynamic-group-cancel': "cancel",
                'click #preview-ips-sig': "previewSignatures"

            },

            /**
             * The constructor for the ips signature form view using overlay.
             *
             * @param {Object} options - The options containing the Slipstream's context
             */
            initialize: function(options) {
                this.activity = options.activity;
                this.context = options.activity.getContext();
                this.formMode = this.model.formMode;

                this.successMessageKey = 'ips_sig_create_success';
                this.editMessageKey = 'ips_sig_edit_success';
                this.fetchErrorKey = 'ips_sig_fetch_error';
                this.fetchCloneErrorKey = 'ips_sig_fetch_clone_error';
            },

            render: function() {
                var me = this,
                    formConfiguration = new IPSSigDynamicConf(this.context,this),
                    formElements = formConfiguration.getValues();
                this.ipsSigDataModel = new IPSSigJSON();

                me.addDynamicFormConfig(formElements);

                me.ipsSigflatValues = this.ipsSigDataModel.toFlatValues(me.model.attributes);

                me.form = new FormWidget({
                    "container": this.el,
                    "elements": formElements,
                    "values": this.model.toJSON()[this.model.jsonRoot]
                });

                me.form.build();
                me.fetchVendorPackageTypeDropDown();               

                var yesNoDropdownArray =  [{
                    "text": "None",
                    "id": "NONE"
                }, {
                    "text": "Yes",
                    "id": "Yes"
                }, {
                    "text": "No",
                    "id": "No" 
                }] ;               
              
                var trueFalseDropdownArray =  [{
                    "text": "None",
                    "id": "NONE"
                }, {
                    "text": "Yes",
                    "id": "true"
                }, {
                    "text": "No",
                    "id": "false"
                }] ;

                var expDropdownArray =  [{
                    "text": "",
                    "id": "NONE"
                },
                {
                    "text": "OR",
                    "id": "or"
                }, {
                    "text": "AND",
                    "id": "and"
                }] ;
                me.vendor1 = me.form.getInstantiatedWidgets()['dropDown_vendorDropdown1'].instance; 
                me.vendor2 = me.form.getInstantiatedWidgets()['dropDown_vendorDropdown2'].instance;
                me.vendor3 = me.form.getInstantiatedWidgets()['dropDown_vendorDropdown3'].instance;
                me.recommendedDropDown = me.createDropDown(me.$el.find('.recommended-container'),trueFalseDropdownArray);
                me.directionAnyDropDown = me.createDropDown(me.$el.find('.directionContainer-any'),yesNoDropdownArray);
                
                me.directionCtsDropDown = me.createDropDown(me.$el.find('.directionContainer-cts'),yesNoDropdownArray);
                me.directionStcDropDown = me.createDropDown(me.$el.find('.directionContainer-stc'),yesNoDropdownArray);
                me.directionExpressionDropDown = me.createDropDown(me.$el.find('.directionContainer-exp'),expDropdownArray);
               
                if (me.formMode === me.MODE_EDIT || me.formMode === me.MODE_CLONE) {
                    me.handleDynamicModify();
                   
                }                
                me.populateipsSigDynCategoryListBuilder(); 
                return me;
            },

            fetchVendorPackageTypeDropDown: function(){
              var self = this, packageType;              
              self.packageTypeData = [];
              $.ajax({
                url: "/api/juniper/sd/ips-management/vulnerability-package-types",
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': "application/vnd.juniper.sd.ips-management.vulnerability-package-types+json;version=1;q=0.01"
                },
                success: function(response, status){
                  packageType = response['vulnerability-package-types']['vulnerability-package-type'];

                 self.createVendorPackageTypeDropDown(self.populateDropdownData(packageType));                  
                }
              });
            },
            populateDropdownData : function(jsonResponse){
                var packageTypeData = [];
                packageTypeData.push({id:"None",text:"None"});
                              $(jsonResponse).each(function (i) {
                                packageTypeData.push({id:jsonResponse[i],text:jsonResponse[i],label:jsonResponse[i],value:jsonResponse[i]});
                              });
                    return packageTypeData;
            },         


          createVendorPackageTypeDropDown: function(packageTypeData){
             var me = this,vendorDesc,vend1;               
             me.vendor1.addData(packageTypeData,true);  
             if (me.formMode === me.MODE_EDIT || me.formMode === me.MODE_CLONE) {
                me.vendor1.conf.data=me.packageTypeData;
                 if (me.ipsSigflatValues['dynVendor'] !== undefined && me.ipsSigflatValues['dynVendor'] !== null){
                    vendorDesc=me.ipsSigflatValues['dynVendor'].trim();
                    vend1 = vendorDesc.split(":");               
                me.vendor1.setValue({'id':vend1[0],'text':vend1[0],'label':vend1[0],'value':vend1[0]})
                 }                
                
             }           
            },            

            fetchVendorNameDropDown: function(){

              var self = this, vendorName,packageType = self.vendor1.getValue(); 
              self.vendor3.addData([], true);            
              self.vendorNameData = [];            
              $.ajax({
                url: "/api/juniper/sd/ips-management/vulnerability-vendors?package-type=" + packageType,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': "application/vnd.juniper.sd.ips-management.vulnerability-vendors+json;version=1;q=0.01"
                },
                success: function(response, status){
                  vendorName = response['vulnerability-vendors']['vulnerability-vendor'];                  
                  self.createVendorNameDropDown(self.populateDropdownData(vendorName));
                  
                  
                }
              });
            },

          createVendorNameDropDown: function(vendorNameData){
             var me = this,vendorDesc,vend1;   
             
                me.vendor2.addData(vendorNameData,true); 

                if (me.formMode === me.MODE_EDIT || me.formMode === me.MODE_CLONE) {
                me.vendor2.conf.data=me.vendorNameData;
                 if (me.ipsSigflatValues['dynVendor'] !== undefined && me.ipsSigflatValues['dynVendor'] !== null){
                    vendorDesc=me.ipsSigflatValues['dynVendor'].trim();
                    vend1 = vendorDesc.split(":");               
                    me.vendor2.setValue({'id':vend1[1],'text':vend1[1],'label':vend1[1],'value':vend1[1]})
                 } 
                
             }             
            },

            fetchVendorTitleDropDown: function(){
              var self = this, vendorTitle,packageType = self.vendor1.getValue(),vendorName = self.vendor2.getValue();              
            // self.vendorTitleData =[];
              $.ajax({
                url: "/api/juniper/sd/ips-management/vulnerability-titles?package-type=" +packageType+"&vendor="+vendorName,
                type: 'GET',
                dataType:"json",
                headers:{
                    'accept': "application/vnd.juniper.sd.ips-management.vulnerability-titles+json;version=1;q=0.01"
                },
                success: function(response, status){
                  vendorTitle = response['vulnerability-titles']['vulnerability-title'];                
                  self.createVendorTitleDropDown(self.populateDropdownData(vendorTitle));
                  
                }
              });
            },

          createVendorTitleDropDown: function(vendorTitleData){
             var me = this,vendorDesc,vend1;       
             
                me.vendor3.addData(vendorTitleData,true); 
                if (me.formMode === me.MODE_EDIT || me.formMode === me.MODE_CLONE) {
                me.vendor3.conf.data=me.vendorTitleData;
                 if (me.ipsSigflatValues['dynVendor'] !== undefined && me.ipsSigflatValues['dynVendor'] !== null){
                   vendorDesc=me.ipsSigflatValues['dynVendor'].trim();
                   vend1 = vendorDesc.split(":");               
                   me.vendor3.setValue({'id':vend1[2],'text':vend1[2],'label':vend1[2],'value':vend1[2]})
                 } 
                
             }             
            },
           
            populateipsSigDynCategoryListBuilder: function() {

                var self = this;
                var ipsSigsCategoryContainer = this.$el.find('#ips-sig-dyn-category-set');
                ipsSigsCategoryContainer.attr("readonly", "");              


                var selectedListValues = self.ipsSigflatValues['categories'];
                self.ipsSigsCategoryListBuilder = new CategoryListBuilder({
                    container: ipsSigsCategoryContainer,
                    selectedItems: selectedListValues,
                    id: "ips-sig-category-list"
                });

                self.ipsSigsCategoryListBuilderObj = self.ipsSigsCategoryListBuilder.build();
                ipsSigsCategoryContainer.find('.new-list-builder-widget').unwrap();

                self.populateipsSigDynServiceListBuilder();

            },
            populateipsSigDynServiceListBuilder: function() {
                var self = this;
                var ipsSigsservContainer = this.$el.find('#ips-sig-dyn-service-set');
                ipsSigsservContainer.attr("readonly", "");

                var selectedListValues = self.ipsSigflatValues['services'];;
                this.servListBuilder = new ServListBuilder({

                    container: ipsSigsservContainer,
                    selectedItems: selectedListValues,
                    id: "ips-sig-service-list"

                });
                self.servListBuilderObj = self.servListBuilder.build();
                ipsSigsservContainer.find('.new-list-builder-widget').unwrap();
            },
            createDropDown: function(container, data, onchange) {
                var self = this;
                return new DropDownWidget({
                    "container": container,
                    "data": JSON.stringify(data),
                    "placeholder": this.context.getMessage('select_option'),
                    "enableSearch": true,
                    "onChange": function(event) {
                        if (onchange) {
                            onchange($(this).val(), self);
                        }
                    }
                }).build();
            },

           


            addDynamicFormConfig: function(formConfiguration) {
                var dynamicProperties = {};
                ResourceView.prototype.addDynamicFormConfig.call(this, formConfiguration);
                switch (this.formMode) {
                    case this.MODE_CREATE:
                        dynamicProperties.title = this.context.getMessage('ips_sig_dynamic_group_create_title');
                        break;
                    case this.MODE_EDIT:
                        dynamicProperties.title = this.context.getMessage('ips_sig_dynamic_group_modify_title');
                        break;
                    case this.MODE_CLONE:
                        dynamicProperties.title = this.context.getMessage('ips_sig_dynamic_group_clone_title');
                        break;
                }
                _.extend(formConfiguration, dynamicProperties);
            },

            previewSignatures: function(event) {
                var me =this;
                var data = Syphon.serialize(this);      
                var filtersTokenArr =[]; 
                me.completeFilterToken ='';       
                var completeFilterUrl = me.constructFilterUrl(data, filtersTokenArr );        
                me.showPreview(completeFilterUrl);      
                me.serachinstance =this.overlayView.gridWidget.getSearchWidgetInstance().build(); 
                // me.serachinstance.addTokens("COUNT = " + this.overlayView.gridWidget.getNumberOfRows());      
                me.serachinstance.addTokens(me.completeFilterToken);       
            },      
            
            formSearchUrlString: function(key, value) {     
                var stringUrl ='';      
                if(value.length!=0){        
                    stringUrl ='(';     
                    var EQ ='+eq+';     
                    var OR ='+or+';     
                    var QUOTES ="'";     
                    for (var i = value.length - 1; i >= 0; i--) {       
                        if(stringUrl!='('){     
                            stringUrl=stringUrl.concat(OR);     
                        }       
                        stringUrl=stringUrl.concat(key,EQ,QUOTES,value[i],QUOTES);      
                      }     
                      stringUrl =stringUrl.concat(')')      
                }       
                return stringUrl;
            },

            formDirectionSearchUrlString: function(key, value) {     
                var stringUrl ='';
                var value=value;      
                if(value.length!=0){        
                    stringUrl ='';     
                    var CONTAINS ='+contains+';
                    var EQ = '+eq+';
                    var NE ='+ne+';     
                    var AND ='+and+';
                    var OR ='+or+';      
                    var QUOTES ="'";
                    var OPENINGBRACE = '(';
                    var CLOSINGBRACE = ')';     
                    for (var i = value.length - 1; i >= 0; i--) {       
                        if(stringUrl!=''){     
                            stringUrl=stringUrl.concat(AND);     
                        }   
                        if(value[i] === '!any'){
                           stringUrl=stringUrl.concat(OPENINGBRACE,key,EQ,QUOTES,"stc",QUOTES,OR,key,EQ,QUOTES,"cts",QUOTES,OR,key,EQ,QUOTES,"cts,stc",QUOTES,CLOSINGBRACE); 
                        }else if(value[i] === '!cts'){
                           stringUrl=stringUrl.concat(OPENINGBRACE,key,EQ,QUOTES,"stc",QUOTES,OR,key,EQ,QUOTES,"any",QUOTES,OR,key,EQ,QUOTES,"any,stc",QUOTES,CLOSINGBRACE);
                        }else if(value[i] === '!stc'){
                            stringUrl=stringUrl.concat(OPENINGBRACE,key,EQ,QUOTES,"cts",QUOTES,OR,key,EQ,QUOTES,"any",QUOTES,OR,key,EQ,QUOTES,"any,cts",QUOTES,CLOSINGBRACE); 
                        }else{
                           stringUrl=stringUrl.concat(OPENINGBRACE,key,CONTAINS,QUOTES,value[i],QUOTES,CLOSINGBRACE);  
                        }                             
                      }      
                }       
                return stringUrl;
            },

            showPreview: function(filter) {
                var self = this;
                var OVERLAY_TYPE_IPS_SIGNATURES = 'ips_signatures';
                var view = new IPSSigOverlayView({
                    parentView: this,
                    params: {
                        'type': OVERLAY_TYPE_IPS_SIGNATURES,
                        'filterUrl' : filter
                    }
                });
                self.overlayView = view;
                self.overlay = new OverlayWidget({
                    view: view,
                    showScrollbar: true,
                    type: 'xlarge'
                });
                self.overlay.build();
            },


            /**
             * @private
             *
             * This is a helper to set th values for basic and advance tab items in edit flow.
             *
             * @return none
             * */
            handleDynamicModify: function() {
                var me = this;
                if (this.ipsSigflatValues['dynDirection'] !== undefined && this.ipsSigflatValues['dynDirection'] !== null) {

                    $.each(this.ipsSigflatValues['dynDirection'].split(','), function(index, value) {
                        if (value) {
                            if (value.trim()==='any') {
                                me.directionAnyDropDown.setValue("Yes");
                            } else if (value.trim()==='!any') {
                                me.directionAnyDropDown.setValue("No");
                            } else if (value.trim()==='stc') {
                                me.directionStcDropDown.setValue("Yes");
                            } else if (value.trim()==='!stc') {
                                me.directionStcDropDown.setValue("No");
                            } else if (value.trim()==='cts') {
                                me.directionCtsDropDown.setValue("Yes");
                            }else if (value.trim()==='!cts') {
                                me.directionCtsDropDown.setValue("No");
                            }
                        }
                    });
                }

                if(this.ipsSigflatValues['dynDirectionExpression'] !== undefined && this.ipsSigflatValues['dynDirectionExpression'] !== null) {
                    var expVal = this.ipsSigflatValues['dynDirectionExpression'].trim();
                    if (expVal!==""){
                        me.directionExpressionDropDown.setValue(expVal);
                    }
                }  
                var severityTemp = [];
                if (this.ipsSigflatValues['dynSeverity'] !== undefined && this.ipsSigflatValues['dynSeverity'] !== null) {
                    $.each(this.ipsSigflatValues['dynSeverity'].split(','), function(index, value) {
                        if (value) {
                            if (value.trim().indexOf('Info') > -1) {
                                me.$el.find('#sev-info').prop('checked', true);
                            } else if (value.trim().indexOf('Major') > -1) {
                                me.$el.find('#sev-major').prop('checked', true);
                            } else if (value.trim().indexOf('Critical') > -1) {
                                me.$el.find('#sev-critical').prop('checked', true);
                            } else if (value.trim().indexOf('Minor') > -1) {
                                me.$el.find('#sev-minor').prop('checked', true);
                            } else if (value.trim().indexOf('Warning') > -1) {
                                me.$el.find('#sev-warning').prop('checked', true);
                            }
                        }

                    });
                }

                var perfImpacTemp = [];
                if (this.ipsSigflatValues['dynPerformanceImpact'] !== undefined && this.ipsSigflatValues['dynPerformanceImpact'] !== null) {
                    $.each(this.ipsSigflatValues['dynPerformanceImpact'].split(','), function(index, value) {
                        if (value) {
                            if (value.trim().indexOf('High') > -1) {
                                me.$el.find('#perf-impact-high').prop('checked', true);
                            } else if (value.trim().indexOf('Medium') > -1) {
                                me.$el.find('#perf-impact-medium').prop('checked', true);
                            } else if (value.trim().indexOf('Low') > -1) {
                                me.$el.find('#perf-impact-low').prop('checked', true);
                            } else if (value.trim().indexOf('Unknown') > -1) {
                                me.$el.find('#perf-impact-unknown').prop('checked', true);
                            }
                        }
                    });
                }
                var mathAsstemp = [];
                if (this.ipsSigflatValues['dynMatchAssurance'] !== undefined && this.ipsSigflatValues['dynMatchAssurance'] !== null) {
                    $.each(this.ipsSigflatValues['dynMatchAssurance'].split(','), function(index, value) {
                        if (value) {
                            if (value.trim().indexOf('High') > -1) {
                                me.$el.find('#false-positive-high').prop('checked', true);
                            } else if (value.trim().indexOf('Medium') > -1) {
                                me.$el.find('#false-positive-medium').prop('checked', true);
                            } else if (value.trim().indexOf('Low') > -1) {
                                me.$el.find('#false-positive-low').prop('checked', true);
                            } else if (value.trim().indexOf('Unknown') > -1) {
                                me.$el.find('#false-positive-unknown').prop('checked', true);
                            }
                        }
                    });
                }
                var objTypeTemp = [];
                if (this.ipsSigflatValues['dynObjectType'] !== undefined && this.ipsSigflatValues['dynObjectType'] !== null) {
                    $.each(this.ipsSigflatValues['dynObjectType'].split(','), function(index, value) {
                        if (value) {
                            if (value.trim().indexOf('signature') > -1) {
                                me.$el.find('#obj-type-signature').prop('checked', true);
                            } else if (value.trim().indexOf('anomaly') > -1) {
                                me.$el.find('#obj-type-anomaly').prop('checked', true);
                            }
                        }
                    });
                }
           
                if (this.ipsSigflatValues['dynRecommended'] !== undefined && this.ipsSigflatValues['dynRecommended'] !== null) {
                    if (this.ipsSigflatValues['dynRecommended'].trim() == "false") {
                        me.recommendedDropDown.setValue("false");
                    } else if (this.ipsSigflatValues['dynRecommended'].trim() === "true") {
                        me.recommendedDropDown.setValue("true");
                    }
                }
            },
            /**
             * For constucting the Filter token and Filter URL.
             *
             * 
             */
            constructFilterUrl: function(data, filtersTokenArr) {     
                    var urlArray =[];       
                    var me = this;      
                    var StringFormedURL='';     
                    var me = this;      
                    //Severity  
                    var tempSeverity = [];      
            
                    if (data["sev-info"] === true) {        
                        tempSeverity.push("Info");      
                    }       
                    if (data["sev-warning"] === true) {     
                        tempSeverity.push("Warning");       
                    }       
                    if (data["sev-minor"] === true) {       
                        tempSeverity.push("Minor");     
                    }       
                    if (data["sev-major"] === true) {       
                        tempSeverity.push("Major");     
                    }       
                    if (data["sev-critical"] === true) {        
                        tempSeverity.push("Critical");      
                    }       
                    if(me.formSearchUrlString('severity',tempSeverity)!=""){        
                        urlArray.push(me.formSearchUrlString('severity',tempSeverity));     
                        filtersTokenArr.push("Severity = " + tempSeverity.toString());      
                    }     
                    
                    //Service
                    var service = this.getSelectedServiceList();      
                    if(service.length!=0){     
                        urlArray.push(me.formSearchUrlString('service',service));     
                        filtersTokenArr.push("Service = " + service.toString());      
                    }   
                    
                    //Category
                    var category = this.getSelectedCategoryList();      
                    if(category.length!=0){     
                        urlArray.push(me.formSearchUrlString('category',category));     
                        filtersTokenArr.push("Category = " + category.toString());      
                    } 

                    //Recommended
                    var recommendedValue = [];
                    var recommendedDisplay = [];  
                    if (me.recommendedDropDown.getValue() == "true") {
                        recommendedValue.push("true");
                        recommendedDisplay.push("Yes");
                    } else if (me.recommendedDropDown.getValue() == "false") {
                        recommendedValue.push("false");
                        recommendedDisplay.push("No");
                    }
                    if(recommendedValue.length!=0){     
                        urlArray.push(me.formSearchUrlString('recommended',recommendedValue));     
                        filtersTokenArr.push("Recommended = " + recommendedDisplay.toString());      
                    } 

                    //Direction
                    var tempDirection = [];
                    var tempDirectionDisplay = [];
                    
                    if (me.directionAnyDropDown.getValue() === "Yes") {
                        tempDirection.push("any");
                        tempDirectionDisplay.push("(Any = Yes)");
                    } else if (me.directionAnyDropDown.getValue() === "No") {
                        tempDirection.push("!any");
                        tempDirectionDisplay.push("(Any = No)");
                    }
                    if (me.directionStcDropDown.getValue() === "Yes") {
                        tempDirection.push("stc");
                        tempDirectionDisplay.push("(Stc = Yes)");
                    } else if (me.directionStcDropDown.getValue() === "No") {
                        tempDirection.push("!stc");
                        tempDirectionDisplay.push("(Stc = No)");
                    }
                    if (me.directionCtsDropDown.getValue() === "Yes") {
                        tempDirection.push("cts");
                        tempDirectionDisplay.push("(Cts = Yes)");
                    } else if (me.directionCtsDropDown.getValue() === "No") {
                        tempDirection.push("!cts");
                        tempDirectionDisplay.push("(Cts = No)");
                    }
                    
                    if(me.formDirectionSearchUrlString('direction',tempDirection)!=""){        
                        urlArray.push(me.formDirectionSearchUrlString('direction',tempDirection));     
                        filtersTokenArr.push("Direction = " + tempDirectionDisplay.toString());      
                    } 

                     //Vendor
                    var tempVendor = [];
                    var tempVendorDisplay = [];
                     if (me.vendor1.getValue() !== "None" && me.vendor2.getValue() !== "None" && me.vendor3.getValue() !== "None") {
                        me.vendorVal=me.vendor1.getValue() +":" + me.vendor2.getValue() + ":" + me.vendor3.getValue();
                        tempVendor.push(me.vendorVal);
                        tempVendorDisplay.push(me.vendorVal);
                    } 

                    if(me.formSearchUrlString('vendor',tempVendor)!=""){        
                        urlArray.push(me.formSearchUrlString('vendor',tempVendor));     
                        filtersTokenArr.push("Vendor = " + tempVendorDisplay.toString());     
                    } 

                    //Performance Impact

                    var tempPerImpact = [];
                    var tempPerImpactDisplay = [];

                    if (data["perf-impact-unknown"] === true) {
                        tempPerImpact.push("0");
                        tempPerImpactDisplay.push("Unknown");
                    }
                    if (data["perf-impact-low"] === true) {
                        tempPerImpact.push("1");
                        tempPerImpactDisplay.push("Low");
                    }
                    if (data["perf-impact-medium"] === true) {
                        tempPerImpact.push("5");
                        tempPerImpactDisplay.push("Medium");
                    }
                    if (data["perf-impact-high"] === true) {
                        tempPerImpact.push("9");
                        tempPerImpactDisplay.push("High");
                    }
                    if(me.formSearchUrlString('performance',tempPerImpact)!=""){        
                        urlArray.push(me.formSearchUrlString('performance',tempPerImpact));     
                        filtersTokenArr.push("Performance Impact = " + tempPerImpactDisplay.toString());      
                    }  
                    //False Positive
                    var tempFalsePositives = [];
                    var tempFalsePositivesDisplay = [];

                    if (data["false-positive-unknown"] === true) {
                        tempFalsePositives.push("none");
                        tempFalsePositivesDisplay.push("Unknown");
                    }

                    if (data["false-positive-low"] === true) {
                        tempFalsePositives.push("frequently");
                        tempFalsePositivesDisplay.push("Low");
                    }

                    if (data["false-positive-medium"] === true) {
                        tempFalsePositives.push("occasionally");
                        tempFalsePositivesDisplay.push("Medium");
                    }

                    if (data["false-positive-high"] === true) {
                        tempFalsePositives.push("rarely");
                        tempFalsePositivesDisplay.push("High");
                    }

                    if(me.formSearchUrlString('confidence',tempFalsePositives)!=""){        
                        urlArray.push(me.formSearchUrlString('confidence',tempFalsePositives));     
                        filtersTokenArr.push("False Positive = " + tempFalsePositivesDisplay.toString());      
                    }  

                    //Object Type

                    var tempObjType = [];
                    var tempObjTypeDisplay = [];
                    if (data["obj-type-signature"] === true) {
                        tempObjType.push("signature");
                        tempObjTypeDisplay.push("Signature");
                    }
                    if (data["obj-type-anomaly"] === true) {
                        tempObjType.push("anomaly");
                        tempObjTypeDisplay.push("Protocol Anomaly");
                    }
                    if(me.formSearchUrlString('sig-type',tempObjType)!=""){        
                        urlArray.push(me.formSearchUrlString('sig-type',tempObjType));     
                        filtersTokenArr.push("Object Type = " + tempObjTypeDisplay.toString());      
                    }

                    //complete filter url is built to be send as part of url.
                    //eg., &filter=((severity+contains+'Major'+or+severity+contains+'Minor'+or+severity+contains+'Warning')+and+(category+contains+'CHARGEN'+or+category+contains+'CHAT')+and+(service+contains+'ARP'+or+service+contains+'BGP'))
                    var completeFilterString ='';       
                    if(urlArray.length!=0){     
                            completeFilterString = '&filter=(';     
                            var AND = '+and+';      
                            for (var i = 0; i < urlArray.length; i++) {     
                                if(completeFilterString!= '&filter=('){     
                                    completeFilterString=completeFilterString.concat(AND);      
            
                                }       
                                completeFilterString=completeFilterString.concat(urlArray[i]);      
                            };      
                            completeFilterString=completeFilterString.concat(')');      
                    }       

                    //complete filter token is built to be dispalyed in the search criteria.
                    //eg., "Severity = Warning,Minor,Major AND Category = CHAT,CHARGEN AND Service = BGP,ARP"
                    if(filtersTokenArr.length!=0){      
                        var AND = ' AND ';      
                        for (var i = 0; i < filtersTokenArr.length; i++) {      
                            if(me.completeFilterToken!= ''){       
                                me.completeFilterToken=me.completeFilterToken.concat(AND);        
        
                            }       
                            me.completeFilterToken=me.completeFilterToken.concat(filtersTokenArr[i]);     
                        };      
                    }
                    return completeFilterString;        
            },
            submit: function(event) {
                var self = this;
                event.preventDefault();
                this.bindModelEvents();
                var properties = {},
                    finalProp ={},
                    data = Syphon.serialize(this);
                 // Check is form valid
                if (! this.form.isValidInput() ) {
                    console.log('form is invalid');
                    return;
                }    
                properties['name'] = this.$el.find('#ips-sig-name').val();
                properties['sig-type'] = 'dynamic';
                finalProp['name'] = this.$el.find('#ips-sig-name').val();
                finalProp['sig-type'] = 'dynamic';
                finalProp['definition-type'] = 'CUSTOM';

                this.handleDynamicSubmit(data, properties);
                var filters = this.ipsSigDataModel.toNestedObject(properties);
                finalProp['filters'] = {};
                finalProp['filters']['ips-sig-filter'] = filters;
                if($.isEmptyObject(filters)){
                    console.log('filters has no selections');
                    self.form.showFormError(self.context.getMessage("ips_sig_dynamic_form_filter_empty_error"));
                    return;
                }               

                if (self.vendor1.getValue()!="None" && (self.vendor2.getValue()==null || self.vendor3.getValue()==null || self.vendor3.getValue()=="None") ){
                     console.log('filters has no selections');
                    self.form.showFormError(self.context.getMessage("ips_sig_dynamic_form_filter_vendor_error"));
                    return;
                }
                this.model.set(finalProp);
                this.model.save();
            },

            handleDynamicSubmit: function(data, properties) {
                var me = this;
                // var tempDirection = [];

                // if (data["direction-any"] === true) {
                //     tempDirection.push("any");
                // }
                // if (data["direction-stc"] === true) {
                //     tempDirection.push("stc");
                // }
                // if (data["direction-cts"] === true) {
                //     tempDirection.push("cts");
                // }
                // properties['dynDirection'] = tempDirection.toString();
                var tempDirection = [];
                var tempDirectionExpression = ""; 
                            
                if (me.directionAnyDropDown.getValue() === "Yes") {
                    tempDirection.push("any");
                } else if (me.directionAnyDropDown.getValue() === "No") {
                    tempDirection.push("!any");
                }
                if (me.directionStcDropDown.getValue() === "Yes") {
                    tempDirection.push("stc");
                } else if (me.directionStcDropDown.getValue() === "No") {
                    tempDirection.push("!stc");
                }
                if (me.directionCtsDropDown.getValue() === "Yes") {
                    tempDirection.push("cts");
                } else if (me.directionCtsDropDown.getValue() === "No") {
                    tempDirection.push("!cts");
                }
                if (me.directionExpressionDropDown.getValue() === "or") {
                    tempDirectionExpression ="or";
                } else if (me.directionExpressionDropDown.getValue() === "and") {
                    tempDirectionExpression ="and";
                }

                properties['dynDirection'] = tempDirection.toString();
                properties['dynDirectionExpression'] = tempDirectionExpression;

                var tempFalsePositives = [];

                if (data["false-positive-unknown"] === true) {
                    tempFalsePositives.push("none");
                }

                if (data["false-positive-low"] === true) {
                    tempFalsePositives.push("frequently");
                }

                if (data["false-positive-medium"] === true) {
                    tempFalsePositives.push("occasionally");
                }

                if (data["false-positive-high"] === true) {
                    tempFalsePositives.push("rarely");
                }
                properties['dynMatchAssurance'] = tempFalsePositives.toString();

                var tempPerImpact = [];

                if (data["perf-impact-unknown"] === true) {
                    tempPerImpact.push("0");
                }

                if (data["perf-impact-low"] === true) {
                    tempPerImpact.push("1");
                }

                if (data["perf-impact-medium"] === true) {
                    tempPerImpact.push("5");
                }

                if (data["perf-impact-high"] === true) {
                    tempPerImpact.push("9");
                }
                properties['dynPerformanceImpact'] = tempPerImpact.toString();

                var tempSeverity = [];

                if (data["sev-info"] === true) {
                    tempSeverity.push("Info");
                }

                if (data["sev-warning"] === true) {
                    tempSeverity.push("Warning");
                }

                if (data["sev-minor"] === true) {
                    tempSeverity.push("Minor");
                }

                if (data["sev-major"] === true) {
                    tempSeverity.push("Major");
                }

                if (data["sev-critical"] === true) {
                    tempSeverity.push("Critical");
                }
                properties['dynSeverity'] = tempSeverity.toString();

                var tempObjType = [];

                if (data["obj-type-signature"] === true) {
                    tempObjType.push("signature");
                }

                if (data["obj-type-anomaly"] === true) {
                    tempObjType.push("anomaly");
                }

                properties['dynObjectType'] = tempObjType.toString();

                if (me.recommendedDropDown.getValue() == "true") {
                    properties['dynRecommended'] = true;
                } else if (me.recommendedDropDown.getValue() == "false") {
                    properties['dynRecommended'] = false;

                }
                properties['definition-type'] = 'CUSTOM';
                properties['dynServices'] = this.getSelectedServiceList().toString();
                properties['dynCategories'] = this.getSelectedCategoryList().toString();
              
                me.vendorVal=me.vendor1.getValue() +":" + me.vendor2.getValue() + ":" + me.vendor3.getValue();

                if(me.vendor2.getValue()==null || me.vendor3.getValue()==null || me.vendorVal ==="None::"){
                   //do not set any vendor value if all three values are not selected properly
                }
                else{
                    properties['dynVendor'] = me.vendorVal;                      
                } 
                

                
            },
            getSelectedServiceList: function() {
                var me = this;
                var selectedServiceItems = me.servListBuilder.getSelectedItems();
                var members = [];
                selectedServiceItems.forEach(function(object) {
                    members.push(object.name);
                });
                return members;
            },
            getSelectedCategoryList: function() {
                var me = this;
                var selectedCategoryItems = me.ipsSigsCategoryListBuilder.getSelectedItems();
                var members = [];
                selectedCategoryItems.forEach(function(object) {
                    members.push(object.name);
                });
                return members;
            },
            /**
             * Called when Cancel button is clicked on the overlay based form view.
             *
             * @param {Object} event - The event object
             * returns none
             */
            cancel: function(event) {
                event.preventDefault();
                this.activity.overlay.destroy();
            }
        });

        return IpsSigDynamicGroupFormView;
    });