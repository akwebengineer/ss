define(["../../../../../../ui-common/js/common/utils/filterUtil.js", "../json/eventNames.js", "../json/countryNames.js", "../json/eventCategories.js"],
function (FilterUtil, EventNames, CountryNames, EventCategories) {

  var FilterConfig = function(context){
    //
    var getValuesForLabel = function(lcKey, eventNameResp, countryResp, categoriesResp){
      var filterUtil = new FilterUtil(),
          values=[];
      switch (lcKey){
        case filterUtil.LC_KEY.THREAT_SEVERITY:
          values = [context.getMessage("threat_sev_critical"), context.getMessage("threat_sev_high"), context.getMessage("threat_sev_medium"), context.getMessage("threat_sev_info"), context.getMessage("threat_sev_low")]
          break;
        case filterUtil.LC_KEY.EVENT_TYPE:
          values = eventNameResp["results"].sort();
          break;
        case filterUtil.LC_KEY.EVENT_CATEGORY:
          values = categoriesResp["results"].sort();
          break;
        case filterUtil.LC_KEY.SOURCE_COUNTRY_NAME:
          values = countryResp["results"].sort();
          break;
        case filterUtil.LC_KEY.DESTINATION_COUNTRY_NAME:
          values = countryResp["results"].sort();
          break;
        default:
          values = null;
          break;
      };
      return values;
    };
    //
    this.getOperatorsList = function(){
      return [context.getMessage('operator_and'), context.getMessage('operator_or')];
    };
    //returns the filter menu
    this.getFilterList = function(){
      var def  = $.Deferred(),
          filterMenu = {},
          requests = [],
          eventNamesVal = new EventNames().getValues(),
          countryNamesVal = new CountryNames().getValues(),
          eventCategoriesVal = new EventCategories().getValues(),
          dataList = [eventNamesVal, countryNamesVal, eventCategoriesVal];
      //
      $.when.apply($, dataList).done(function(eventNameResp, countryResp, categoriesResp){
        var filterUtil = new FilterUtil(),
            lcKeysArray = filterUtil.getLCKeys();
        for(var i=0; i<lcKeysArray.length; i++){
          filterMenu[lcKeysArray[i]["lcKey"]] = {
            "label": context.getMessage(filterUtil.getUIKey(lcKeysArray[i]["lcKey"])),
            "value":getValuesForLabel(lcKeysArray[i]["lcKey"], eventNameResp, countryResp, categoriesResp),
            "operators": ["=", "!="]
          };//filterMenu
        };//for(var i=0; i<lcKeysArray.length; i++)
        def.resolve(filterMenu);
      });
      return def.promise();
    };
    //
    this.getGroupByDropDown = function(isIncludeEventCategory){
      var filterUtil = new FilterUtil(),
          lcKeysArray = filterUtil.getLCKeys(),
          aggregationList=[];
      //
      for(var i=0; i<lcKeysArray.length; i++){
        if(isIncludeEventCategory) {
          aggregationList.push({
            "id": lcKeysArray[i]["lcKey"],
            "text": context.getMessage(filterUtil.getUIKey(lcKeysArray[i]["lcKey"]))
          });
        } else if(lcKeysArray[i]["lcKey"] !== filterUtil.LC_KEY.EVENT_CATEGORY){
          aggregationList.push({
            "id": lcKeysArray[i]["lcKey"],
            "text": context.getMessage(filterUtil.getUIKey(lcKeysArray[i]["lcKey"]))
          });
        }
      };
      aggregationList.sort(function(a, b){
        return ((a.text > b.text) - (b.text > a.text));
      });
      //
      aggregationList.unshift({
        "id": "none",
        "text": context.getMessage("none")
      });
      //
      return aggregationList;
    };
  };
  return FilterConfig;
});
