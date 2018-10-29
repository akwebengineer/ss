/**
 * SubClass for BandWidth Report.
 * Extends from BaseReportDefCreateView.
 * SubClass must override createContentSection and getContentJsonOjbect and modifyContentSection
 * @module BandWidthReportView
 * @author Aslam <aslama@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

 define([
  'backbone', 
  'backbone.syphon',
  '../conf/bandWidthCreateFormConfig.js',
  './baseReportDefCreateView.js'
  ], function (Backbone,
   Syphon, 
   BandWidthCreateFormConfig,
   BaseReportDefCreateView) {

    var  BandWidthReportView = BaseReportDefCreateView.extend({

      render: function(){
        BaseReportDefCreateView.prototype.render.call(this);
        var self=this,
            formConfig = new BandWidthCreateFormConfig(self.context),
            dynamicSection = formConfig.getValues();
        self.form.addSection(dynamicSection, "#report-create-content-section", true);
        //
        if(self.model.get("bandwidth-template-content")){
          self.$el.find("#bandwidth_count").val(this.model.get("bandwidth-template-content")["count"]);             
          self.$el.find("#bandwidth_last").val(((this.model.get("bandwidth-template-content")["time-duration"])/(60*60*1000)) );
        }
        //
        return this;            
      },

      getJsonReportObj : function(successCallBack){ 
        var bandWidthContent = {},
            properties  = Syphon.serialize(this),
            success;
        //
        success = function(jsonDataObj){
          bandWidthContent = {
           "count": properties['bandwidth_count'],
           "time-duration": (properties['bandwidth_last'])*60*60*1000       
          };
          jsonDataObj["bandwidth-template-content"] = bandWidthContent;
          successCallBack(jsonDataObj);
        };
        //
        BaseReportDefCreateView.prototype.getJsonReportObj.call(this, success);
      }
      
   });
  return BandWidthReportView;

  });

