/**
 * A tooltip view to show translated packet source and destination editors for NAT Rule
 *
 * @module TranslatedTooltipView
 * @author Swathi Nagaraj <swathin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  'backbone',
  '../../nat-pools/models/natPoolsModel.js'
    ],function(Backbone, NatPoolModel){

    var TranslatedTooltipView = Backbone.View.extend({

        persistentNatTypeEnum : {
          "ANY_REMOTE_HOST" : "Permit any remote host",
          "TARGET_HOST" : "Permit target host",
          "TARGET_HOST_PORT" : "Permit target host port"
        },
        initialize: function(options){
            this.ruleModel = options.ruleModel;
            this.renderTooltip = options.callback;
            this.transCellData = options.transCellData;
            this.poolModel = new NatPoolModel();
        },

        render: function(){
            var me = this;

            this.$el.addClass("security-management");
            var formattedValue = "<span>";

             var translatedPkt = this.ruleModel.get('translated-packet'),
                 translatedType = translatedPkt['translated-traffic-match-type'];

             if(translatedPkt) {
              if(translatedType === "NO_TRANSLATION") {
                formattedValue += this.getNoTranslationTooltipContent();      
              }  
              else if(translatedType === "INTERFACE") {
                formattedValue += this.getInterfaceTooltipContent(translatedPkt);
              }
              else if(translatedType === "POOL") {
                this.showPoolTooltipContent(translatedPkt);
                return this;
              }
              else if(translatedType === "PREFIX") {
                formattedValue += this.getPrefixTooltipContent(translatedPkt);
              }
              else if(translatedType === "INET") {
                formattedValue += this.getInetTooltipContent(translatedPkt);       
              }
              formattedValue += "</span>";
              this.renderTooltip(formattedValue);
            }          
            return this;
        },

        getNoTranslationTooltipContent : function(){
           return "<b>No Translation</b>  " + "</br>"; 
        },

        getInterfaceTooltipContent : function(translatedPkt) {
          var formattedValue = "<b>Translation Type: </b>Interface</br>";
              formattedValue += this.showPersistentSetting(translatedPkt,"INTERFACE");
          return formattedValue;    
        },

        showPoolTooltipContent : function(translatedPkt) {
          var formattedValue = "<span>";
          formattedValue += "<b>Translation Type: </b>Pool</br>";
          formattedValue += "<b>Name</b>:  " + this.transCellData[0] + "</br>";
          this.showPoolSetting(translatedPkt, formattedValue);
        },

        getPrefixTooltipContent : function(translatedPkt) {
          var formattedValue = "<b>Translation Type: </b>Address</br>";
              formattedValue += "<b>Translated Address</b>:  " + this.transCellData[0] + "</br>";
              formattedValue += this.showRoutingInstance(translatedPkt);
          var mappedPort = translatedPkt['mapped-port'];
              mappedPort = (mappedPort && mappedPort != "") ? mappedPort : "Any";
              formattedValue += "<b>Mapped Port</b>:  " + mappedPort + "</br>";
          return formattedValue;    
        },

        getInetTooltipContent : function(translatedPkt) {
          var formattedValue = "<b>Translation Type: </b>Corresponding IPv4</br>";
              formattedValue += this.showRoutingInstance(translatedPkt);
          return formattedValue;    
        },

        showRoutingInstance : function(translatedPkt) {
          var rIName = translatedPkt['routing-instance-name'];
          var rIDisplayName = rIName==""?"None":rIName;
          return "<b>Routing Instance</b>:  " + rIDisplayName + "</br>";
        },

        showPersistentSetting : function(translatedPkt,pktType) {
            var persistentSetting = translatedPkt['persistent-nat-setting'],
                formattedValue = "";
            if(persistentSetting && persistentSetting['persistent-nat-type'] != "NONE") {
              formattedValue += "<b>Persistent</b>:  " + "Enabled" + "</br>";
              formattedValue += "<b>Persistent NAT Type</b>:  " + this.persistentNatTypeEnum[persistentSetting['persistent-nat-type']] + "</br>";
              formattedValue += "<b>Inactivity Timeout</b>:  " + persistentSetting['inactivity-timeout'] + "</br>";
              formattedValue += "<b>Max Session No.</b>:  " + persistentSetting['max_session_number'] + "</br>";
              if(pktType === "POOL") {
                formattedValue += "<b>Address Mapping</b>:  " + persistentSetting['address-mapping'] + "</br>";
              }
            }
            else {
              formattedValue += "<b>Persistent</b>:  " + "Disabled" + "</br>";
            }
            return formattedValue;
        },

        //Fetch Pool Details to be shown in Source and Destination Translated Editors
        showPoolSetting : function(translatedPkt, formattedValue) {
             var self = this;
             var poolId = translatedPkt['pool-addresses']['id'];
             this.poolModel.set('id',poolId);
             this.poolModel.fetch({
                    success: function (record, response, options) {
                        self.poolSelectedObj = record;
                        var poolType = record.get('pool-type') == 0 ? "Source" : "Destination";
                        var portTranslation = record.get('disable-port-translation') ? "Disabled" : "Enabled";
                        formattedValue += "<b>Pool Address</b>:  " + record.get('pool-address').name + "</br>";
                        if(poolType == "Source") {
                          formattedValue += "<b>Port Translation</b>:  " + portTranslation + "</br>";
                          formattedValue += "<b>Overflow Pool Type</b>:  " + record.get('over-flow-pool-type').toLowerCase() + "</br>";
                          formattedValue += "<b>Address Sharing</b>:  " + record.get('address-shared') + "</br>";
                          formattedValue += "<b>Address Pooling</b>:  " + record.get('address-pooling').toLowerCase() + "</br>";
                          if(record.get('over-flow-pool-type') == "POOL")
                            formattedValue += "<b>Overflow Address</b>:  " + record.get('overflow-pool-address').name + "</br>";
                        }
                        if(record.get('port-range') && record.get('port-range') != "") {
                          formattedValue += "<b>Port Range</b>:  " + record.get('port-range') + "</br>";
                        }

                        if(poolType == "Source" && translatedPkt['persistent-nat-setting'] && 
                             translatedPkt['persistent-nat-setting']['persistent-nat-type'] != "NONE") {
                          formattedValue += "</br>";
                          formattedValue += self.showPersistentSetting(translatedPkt,"POOL");
                        }  
                        formattedValue += "</span>";
                        self.renderTooltip(formattedValue);                      
                    },
                    error: function (collection, response, options) {
                        console.log('NAT Pool Model not fetched');
                    }
                });
        }


    });
    return TranslatedTooltipView;
});