/**
 * A Backbone Collection to be used by the policy grids for policy model.
 *
 * @module basePolicyCollection
 * @author sandhyab
 * @copyright Juniper Networks, Inc. 2015
 */

define([
  '../../../../../ui-common/js/models/spaceCollection.js'
], function (BaseCollection) {
  var FILTER = "FILTER",
    SEARCH = "SEARCH",
    SORT = "SORT";

  var BasePolicyCollection = BaseCollection.extend({

    model: undefined,
    policyManagementConstants: undefined,

    /*Method to get the URL to fetch data*/
    url: function (filter) {
      var me = this;
      var baseUrl = me.policyManagementConstants.POLICY_URL;

      if (Array.isArray(filter)) {
        // Multiple filters support
        var tmpUrl = baseUrl + "?filter=(";

        for (var i = 0; i < filter.length; i++) {
          tmpUrl += filter[i].property + " " + filter[i].modifier + " '" + filter[i].value + "'";
          if (i !== filter.length - 1) {
            tmpUrl += " and ";
          }
        }
        tmpUrl += ")";

        return tmpUrl;
      } else if (filter) {
        // single filter
        return baseUrl += "?filter=(" + filter.property + " " + filter.modifier + " '" + filter.value + "')";
      }

      return baseUrl;
    },

    initialize: function () {
      var me = this;
      BaseCollection.prototype.initialize.call(this, {
        jsonRoot: 'policies.policy',
        accept: me.policyManagementConstants.POLICIES_ACCEPT_HEADER,
        contentType: me.policyManagementConstants.POLICY_CONTENT_HEADER
      });
    },

    /*Method to add the policy count to the group name*/
    getFormattedGroupName: function (group, count) {
      var policyString = (count === 0 || count === 1) ? " policy" : " policies";
      return group.get('name') + ' (' + count + policyString + ')';
    },

    /*Method to get all the policy ids from the grid excluding the group rows */
    getAllPolicyIds: function () {
      var me = this, ids = me.pluck("id"), policyIds = [];
      $.each(ids, function (index, id) {
        var record = me.get(id);
        if (!record.isPredefinedGroupSelected()) {
          policyIds.push(id);
        }
      });
      return policyIds;
    },

    /*Method to return the policy sequence number of the global policy if present*/
    getGlobalPolicySeqNo: function () {
      var me = this;
      var seq = -1;
      $.each(me.models, function (i, policy) {
        if (policy.isGlobalPolicy()) {
          seq = policy.get('sequence-number');
          return false;
        }
      });
      return seq;
    },

    /*Method to fetch the data
    Create the group policies and groups the policies under pre,device or post group accordingly*/
    fetch: function (options) {
      options = options || {};
      var me = this;
      var filterSearchSortOptions = options.filterSearchSortOptions ? options.filterSearchSortOptions :
      {
        FILTER : undefined,
        SEARCH : undefined,
        SORT : undefined
      };

      if (!options.success) {
        options.success = function (collection, response, callOptions) {
          var preGroup = new me.model(me.policyManagementConstants.POLICY_GROUP.PRE_GROUP),
            deviceGroup = new me.model(me.policyManagementConstants.POLICY_GROUP.DEVICE_GROUP),
            postGroup = new me.model(me.policyManagementConstants.POLICY_GROUP.POST_GROUP),
            preGroupPolicies = me.filter(function (policy) {
              return policy.isPreGroupPolicy();
            }), devicePolicies = me.filter(function (policy) {
              return policy.isDevicePolicy();
            }), postGroupPolicies = me.filter(function (policy) {
              return policy.isPostGroupPolicy();
            });
          //Removing all the data from the collection using reset and re-adding the data based on pre,device and post groups
          me.reset();
          me.addPoliciesToCollection(preGroup, preGroupPolicies);
          me.addPoliciesToCollection(deviceGroup, devicePolicies);
          me.addPoliciesToCollection(postGroup, postGroupPolicies);
            // Pre-processing of data before adding to the grid
          me.trigger('beforeFetchComplete', collection, response, callOptions);
          me.trigger('fetchComplete', collection, response, callOptions);
        };
      }

      options.url = me.addFilterOptionsToURL(options.url,filterSearchSortOptions[FILTER]);
      options.url = me.addSearchOptionsToURL(options.url,filterSearchSortOptions[SEARCH]);
      options.url = me.addSortOptionsToURL(options.url,filterSearchSortOptions[SORT]);
      //need to Reset collection before fetching the new collection
      me.reset();
      return Backbone.Collection.prototype.fetch.call(this, options);
    },

    /*Method to add filters to url*/
    addFilterOptionsToURL : function(url,filter){
      var me=this;
      if (!_.isEmpty(filter)) {
        url = url.concat("?paging=(start eq 1, limit eq 1000)&filter=(" + filter + ")");
      } else if (url.indexOf("filter") == -1) {
        url = url.concat("?paging=(start eq 1, limit eq 1000)");
      }
      return url;
    },

    /*Method to add search to url*/
    addSearchOptionsToURL : function(url,search){
      var me=this;
      if (!_.isEmpty(search)) {
        url = url.concat("&_search=" + search);
      }
      return url;
    },

    /*Method to add sort to url*/
    addSortOptionsToURL : function(url,sortingOptions){
      var me=this;
      var columnName = sortingOptions && sortingOptions.columnName === "name" ? "name" : "policy-order";
      var sortingOrder = sortingOptions && sortingOptions.sortOrder === "desc" ? "descending" : "ascending";
      url = url.concat("&sortby=(" + columnName + "(" + sortingOrder + "))");
      return url;
    },

    /*Method to set group name and add respective policies in the group*/
    addPoliciesToCollection: function (group, policies) {
      var me = this;
      group.set("name", me.getFormattedGroupName(group, policies.length));
      if (policies.length === 0) {
        group.set("expanded", false);
      }
      policies.unshift(group);
      me.add(policies);
    },

    /*Method to format the search string
    * Can be overridden by sub-class based on need*/
    formatSearchString: function (token) {
      var me = this, column = token[0].column, filterVal = "";
      if (column === "quickFilter") {
        if (token[0].value === me.policyManagementConstants.HIDE_POLICIES_WITH_NO_DEVICES) {
          token = "(device-count eq 'not-empty')";
          return token;
        }
        else if (token[0].value === me.policyManagementConstants.HIDE_POLICIES_WITH_NO_RULES) {
          token = "(rule-count eq 'not-empty')";
          return token;
        }
      }
      var filterString = "";
      for (var i = 0; i < token.length; i++) {
        //If Odd index, append operator
        if (i % 2 !== 0) {
          filterString += " " + token[i].toLowerCase() + " ";
          continue;
        }
        var searchToken = token[i];
        var searchValue = searchToken.value;
        if (column === "lastModifiedTime") {
          var dateTimestamp = Date.parse(searchValue);
          searchValue = dateTimestamp ? dateTimestamp : 0;
        }
        else {
          searchValue = "'" + searchValue + "'";
        }
        filterString += me.getFilterColumnName(column) + me.getConnector(column, searchToken.operator) + searchValue;
      }
      token = "(" + filterString + ")";
      return token;
    },

    /*Method to get the column name*/
    getFilterColumnName: function (column) {
      var filterColumn;
      switch (column) {
        case "devices" :
          filterColumn = "device-list";
          break;
        default :
          filterColumn = column;
      }
      return filterColumn;
    },

    /*Method to get connector based on operator input
    * When operator is "=" name column uses "contains", other columns use "eq"*/
    getConnector: function (columnName, operator) {
      var self = this;
      var connector;
      if (operator === "=") {
        connector = " contains ";
        var eqColumns = ["publishState", "id", "devices", "lastModifiedTime"];
        if (_.indexOf(eqColumns, columnName) > -1) {
          connector = this.policyManagementConstants.OPERATOR_CONNECTOR_MAP[operator];
        }
      } else {
        connector = this.policyManagementConstants.OPERATOR_CONNECTOR_MAP[operator];
      }
      return connector;
    }
  });

  return BasePolicyCollection;
});

