/**
 * Created by mbetala on 1/6/16.
 */
define(['../../ui-common/js/common/utils/SmUtil.js'], function(SMUtil) {
  var DOMAIN_ID_NAME_MAP;
  var CURRENT_DOMAIN;
  var CURRENT_DOMAIN_ID;
  var initializeDomainMap = function(map) {
            $.ajax({
              headers: {
                accept: 'application/vnd.net.juniper.space.domain-management.domains+json;q="0.02";version="2"',
                "Content-Type": 'application/vnd.net.juniper.space.domain-management.domains+xml;q="0.02";version="2"'
              },
              type: 'GET',
              url: '/api/space/domain-management/domains/',



              dataType: "json",
              success: function(response, status) {
                console.log("get all domains information");
                if(response && response.domains && response.domains.domain) {
                  var domains = $.isArray(response.domains.domain) ? response.domains.domain
                      : [response.domains.domain];
                  $.each(domains, function(i, object) {
              map[object.id]=object.name;
                    if (object.children && object.children.domain) {
                      var childDomains = $.isArray(object.children.domain) ? object.children.domain
                          : [object.children.domain];
                      $.each(childDomains, function(j, object2) {
                  map[object2.id]= object.name+"/"+object2.name;
                      });
                    }
                  });
                }
              },
              error: function() {
                console.log("failed to get all domains information");
              }
            });
          }, fetchCurrentUserDomain = function() {
            $.ajax({
              headers: {
                accept: 'application/vnd.net.juniper.space.user-management.user-domain+json;version=3;q=0.03',
                "Content-Type": 'application/vnd.net.juniper.space.user-management.user-domain+json;version=3;charset=UTF-8'
              },
              type: 'GET',
              url: '/api/space/user-management/user-domain',
              dataType: "json",
              success: function(response, status) {
                console.log("get current domain information");
          CURRENT_DOMAIN =  response["user-domain"];
          CURRENT_DOMAIN_ID = response["user-domain"].id;
              },
              error: function() {
                console.log("failed to get current domain information");

              }
            });
    };

  function DomainProvider() {
    new SMUtil().declareNameSpace("Juniper.sm")
    Juniper.sm.DomainProvider = this;
  }
  
  DomainProvider.prototype.initiateDomainCache = function() {
    var map = DOMAIN_ID_NAME_MAP = DOMAIN_ID_NAME_MAP || {};
    initializeDomainMap(map);
              fetchCurrentUserDomain();
            };

  DomainProvider.prototype.getCurrentDomain = function() { return CURRENT_DOMAIN_ID }
  DomainProvider.prototype.getDomainName = function(domainId) { return DOMAIN_ID_NAME_MAP[domainId]; }
  DomainProvider.prototype.isCurrentDomain = function(domainId) { return domainId === CURRENT_DOMAIN_ID; }
  DomainProvider.prototype.isNotCurrentDomain = function(domainId) { return domainId !== CURRENT_DOMAIN_ID; }
  DomainProvider.prototype.isInGlobalDomain = function() { return CURRENT_DOMAIN["domain-type"] === "GLOBAL"; }

      return DomainProvider;
});
