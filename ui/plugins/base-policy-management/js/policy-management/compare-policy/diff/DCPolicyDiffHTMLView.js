
/***
 * This is the main class which holds all the functions needed for the working of the policy diff iframe html.
 * This is included in the policy diff iframe html generated from the xsl.
 * This doesnt require any namespace because this is rendered in a seperate iframe and this iframe html is a completely different from the main html.
 * */
function PolicyDiff()
{
  var changedRulesId = [], //Changed rows (added, deleted, modified) id.
   length = 0, //Number of changed rows (added, deleted, modified).
   nextIndex = -1,
   currentRuleInfo = {},
   currentSize;

  /***
   * @private
   * This will navigate the iframe html to a location of the element with id equal to the parameter ruleId passed to it.
   * This is useful when there are thousands of rules and when we need to navigate to a rule which is not seen in the current view.
   * The navigateToRule() will take you to that element, i.e., it will bring the element into current view.
   *
   * */
  function navigateToId(rowId) {
    //Commeting window.location.hash because it creates issues with Backbone navigation in case of event viewer
    //jump to policy. Issue happens when the window url is changed but current window URL has some extra query string params 
    // This causes unexpected behaviour of reloading the page.
    window.location.hash = rowId;

    //$("#"+rowId).closest('.content.row.onOverlay').animate({scrollTop: $("#"+rowId).offset().top - $("#"+rowId).offsetParent().offset().top},'slow');
    /*var diffIFrame = document.getElementById('policy-diff-iframe');
    if(diffIFrame) {
      diffIFrame.src = "#"+rowId;
    }*/
  }  

  /**
   * @private
   * When the user clicks on the next or previous diff buttons then the window will navigate to the next or previous diff rule.
   * Navigation cannot just be enough we need some visual indication of the rule and hence after navigating we will apply styles like color to the row
   * for visually indicating it. We store the previous row element, so that we can remove the style from the previous row and apply the color to the 
   * current row.
   * */
  function highlightRow(rowId) {

    var ruleElement, previousRule = currentRuleInfo.ruleElement;

    if(previousRule) {
     /* previousRule.style.backgroundColor = "";*/
       previousRule.style.border = "";
    }

    ruleElement = document.getElementById(rowId);

    if(ruleElement) {
      /*ruleElement.style.backgroundColor = 'yellow';*/
      ruleElement.style.border = "thick double #3399FF";
      currentRuleInfo.ruleElement = ruleElement;
    }
  }

  /***
   * @private
   * This will return the next or previous rule id from the current rule id, based on the button clicked.
   * If the button clicked is Next Diff then it will calculate the next id relative to the current id.
   * If the button clicked is Previous Diff then it will calculate the previous id relative to the current id.
   * */
  function getNextRuleId(clickType) {
    var ruleId;
    if(clickType === 'Next') {
      nextIndex = nextIndex + 1;
      if(nextIndex === length) {
        nextIndex = length-1;
      }
      //nextIndex = (nextIndex + 1)% (length);
      ruleId = changedRulesId[nextIndex];
    }
    else if(clickType === 'Previous') {
      nextIndex = (nextIndex - 1);
      if(nextIndex < 0) {
        nextIndex = 0;
      }
      ruleId = changedRulesId[nextIndex];
    }
    return ruleId;
  }

  /**
   * While generating the html, we identify all the rows which are changed (modified, deleted, added).
   * If the row is changed then we will store the id of that row in changedRUlesId array and used in next and previous diff button handlers.
   * */
  this.pushChangedRuleId = function(ruleId) {
    changedRulesId[length] = ruleId;
    length = length+1;
  };
  
  /***
   * This is called when the user clicks on next diff. This is the handler for next diff button.
   * This does the following
   * 1) Takes the user to the row which has the next diff.
   * 2) Highlights the row to visually indicate that we reached to the next diff from the current diff.
   * */
  this.next = function() {

    if(length === 0) {
      return;
    }

    var ruleId = getNextRuleId('Next');
    navigateToId(ruleId);
    //window.location.hash = ruleId;

    highlightRow(ruleId);
  };


  /***
   * This is called when the user clicks on previous diff. This is the handler for previous diff button.
   * This does the following
   * 1) Takes the user to the row which has the previous diff.
   * 2) Highlights the row to visually indicate that we reached to the previous diff from the current diff.
   * */
  this.previous = function() {

    if(length === 0) {
      return;
    }

    var ruleId = getNextRuleId('Previous');
    navigateToId(ruleId);
    highlightRow(ruleId);

  };

  /**
   * Returns Exr4 Object.
   * */
  function getExt4() {
    return window.parent.Ext4;
  }

  /***
   * Handling the hide unchanged rules checkbox toggle event.
   * */
  this.handleHideUnchangedRuleEvent = function() {
    /*if(this.policyDiffGrid === undefined) {
      var ext4Obj = getExt4(),
       nativeElement = document.getElementById('PolicyDiffGrid_ID');
      this.policyDiffGrid = ext4Obj.get(nativeElement);
    }
    this.policyDiffGrid.toggleCls('hideUnchanged'); */
   $('#PolicyDiffGrid_ID').toggleClass("hideUnchanged");
  };


  /**
   * Navigate to a row and highlight it.
   * */
  this.navigateToAndHighlightRow = function(rowId) {
    var i, changedRuleId;
    if(rowId !== undefined && rowId !== '') {
      navigateToId(rowId);
      highlightRow(rowId);

      /**
       * Remembering the state.
       * If the user navigates to the different rows, the next and previous button should be relative to the new row in which the user is currently at.
       * This state maintanance is needed only when user navigates by clicking on the changed column and goes to column diff table and from column diff table,
       * he comes back to the policy diff table.
       * */
      for(i=0; i<changedRulesId.length; i++) {
        changedRuleId = changedRulesId[i];
        if(changedRuleId === rowId) {
          nextIndex = i;
          break;
        }
      }
      //event.stopPropagation(); // no need of event Propagation. click on object element event is Propagated to column too.
    }
  };

  /**
   * Api to move back the screen to the top.
   * If the user navigates to the bottom of the screen this will help him move back to the top of the screen.
   * */
  this.moveTop = function() {
    navigateToId('topOfPolicyDiff_ID');
  };

  /**
   * Load mask will be hidden soon after the iframe html is loaded and rendered.
   * Not used, can remove later.
   * */
  this.hideLoadMask = function() {
    /**
     * All IFrame has parent attribute which holds the parent window.
     * This parent window is space window which has Ext4 loaded.
     * Use Ext4 to query the diff component and get hold of the load mask and hide it.
     * */
    var dcPolicyDiffIFramePanel = window.parent.Ext4.ComponentQuery.query('#dcpolicydiffiframepanel_id')[0];
    if(dcPolicyDiffIFramePanel) {
      dcPolicyDiffIFramePanel.policyDiffLMask.hide();
    }
  };

  /**
   * Initialize the current size of the window.
   * This is called when the html is loaded.
   * */
  this.initialize = function() {
    var ext4Obj = getExt4(),
      extElement = ext4Obj.get(document.body);
    if(extElement) {
      currentSize = extElement.getSize();
    }
  };

  /**
   * This is slightly complex piece.
   * Here I am trying to resize the policy diff table when the user resizes the window (Basically try to decrease the horizontal scroll).
   *
   * Let me explain using an example.
   * Suppose currentSize of the table is 130% relative to the window (window size is 100%), so it has a horizontal scroll.
   * Now if the user resizes the window by increasing the size of the window by 20%.
   * Now the window size has increased from 100% to 120% and so the table size now should reduce by 20% to 110%.
   * With this change, the current window size is 100% and the current table size is 110% (all relative)
   * Now again if the window size increases by 8% the new table size will be 110 - 8 = 102% (relative to new window size).
   * Any increase after this keeps the table size to 100% always. It will not reduce lesser than 100%
   *
   * I have not handled the case when the user decreases the window size.
   * Since the table has a auto size, if the user decreases the window size below a certain size then automatically a horizontal scroll comes.
   *
   *  @TODO: is there any better approach?
   * */
  this.resizePolicyDiffTable = function() {
    var ext4Obj = getExt4(),
      extElement, newSize, newWidth, policyDiffTable;
    if(ext4Obj) {
      extElement = ext4Obj.get(document.body);
      if(extElement) {
        newSize = extElement.getSize();
        if(newSize && currentSize) {
          if(newSize.width > currentSize.width) {
            newWidth = (newSize.width * 100)/currentSize.width;

            if(this.tableWidth && newWidth < this.tableWidth) {
              newWidth = this.tableWidth - (newWidth - 100);
            }
            else {
              newWidth = 100;
            }
            policyDiffTable = document.getElementById('PolicyDiffGrid_ID');
            if(policyDiffTable) {
              policyDiffTable.style.width = newWidth+'%';
              this.tableWidth = newWidth;
              currentSize = newSize;
            }
          }
          //else {
            //I have not handled this case because I feel there is no need to handle the size calculation when the window size is decreased.
            //If the user decreases the window size lesser than the tables auto calculated size then automatically a horizontal scroll comes.
          //}
        }
      }
    }

  };
 
///////////////////////////////////////////// More // Less Link 
$(document).ready(function() {
    var showChar = 32;
    var ellipsestext = "...";
    var moretext = "more";
    var lesstext = "less";
    $('.more').each(function() {
        var content = $(this).html();
        var htmlTagRegex = /\s*(<[^>]*>)/g;
        var startStr = "";
        content = content.replace(/(\r\n|\n|\r)/gm," ");
        content = content.replace(/^(((<|&lt;)br\s*\/*(>|&gt;))(\s)*)+/i,"");
        content = content.replace(/(((<|&lt;)br\s*\/*(>|&gt;))(\s)*)+$/i,"");
        content = content.replace(/(((<|&lt;)br\s*\/*(>|&gt;))(\s*)((<|&lt;)br\s*\/*(>|&gt;)))/gi,'<br>');

        var newContent="";
        var strParts = content.split(htmlTagRegex);
        for (i = 0; i < strParts.length; i++) {
          newContent += (strParts[i].trim());
        }
                
        content = newContent;
        if (content.length > showChar) {
            var myArray = content.split(htmlTagRegex);
            var arrayLen = myArray.length;
            if(myArray.length<2){
                content = myArray[0];
                startStr = content.substr(0,showChar);
            } else {   
              var tempStr = "";
              var pattern = new RegExp(htmlTagRegex);
              var prefixScanDone = 1;
                for (i = 0; i < myArray.length; i++) {
                    if(prefixScanDone < 2) {
                      if(pattern.test(myArray[i])){
                           startStr += myArray[i];    
                      } else if (tempStr.length < showChar) { 
                         // startStr += myArray[i];
                        startStr += myArray[i];
                        tempStr += myArray[i];
                      } else {
                        prefixScanDone = 3;
                        startStr += myArray[i];
                      }
                    } else{
                        if(pattern.test(myArray[i])){
                            startStr += myArray[i];    
                        } else {
                            break;
                        }
                    }
                }
            }
            var endStr = content.substr(startStr.length, content.length - startStr.length);
            var html = "";            
            if(endStr.length > 1){            
                html = startStr + '<span class="moreelipses">' + ellipsestext + '<br></span><span class="morecontent"><span>' + endStr + '</span><a href="" class="morelink">' + moretext + '</a></span>';              
            } else {              
              html = startStr + endStr;
            }            
            $(this).html(html);
        }
    });
    $(".morelink").click(function() {
        if ($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html('<br>' + lesstext);
        }
        $(this).parent().prev().toggle();
        $(this).prev().toggle();
        return false;
    });
});
//////////////////////// More // Less  Link Ends here

 
}

//Instantiating PolicyDiff in the global scope.
var policyDiff = new PolicyDiff();

