define([], function() {

  var stubs =  {
      '/installed_plugins/base-policy-management/js/policy-management/custom-column/views/customColumnBuilderFormView.js' : function (options) {
          console.log('Yahoo');
        },
        'widgets/overlay/overlayWidget' : function () {
        console.log('Over lay widget mock class');
        this.state = 'not built';
        this.build = function() {
          this.state = 'built';
        };
        this.getState = function () {
          return this.state;
        };  
      } 
    };
  var context = createContext(stubs);
  context(['/installed_plugins/base-policy-management/js/policy-management/custom-column/customColumnBuilderActivity.js'], function(CustomColumnBuilderActivity){
    describe("Custom Column View unit tests", function() {
      
      it("Launch Overlay ", function() {
        var policyOptions = {
            activity : {
              
            }
        };
        CustomColumnBuilderActivity.launchOverlay({
          activity : policyOptions.activity,
          params : {
            url : ""
          }
        });
        
        assert.isDefined(policyOptions.activity.overlay);
        assert.equal(policyOptions.activity.overlay.getState(), 'built');
      });
      
    });
    //mocha.run();
  });

});