define(function() {
  describe("RBACResolver Unit Tests", function() {
    before(function () {
      var allowAccess = function(capabilities) {
        for (var i = 0; i < capabilities.length; i++) {
            if (capabilities[i] == 'space_cap1') {
                return true;
            }
        } 
        return false;
      };

      var RBACProvider = new Slipstream.SDK.RBACProvider();

      RBACProvider.verifyAccess = function(capabilities) {
        if (allowAccess(capabilities)) {
          return true;
        }
        
        return false;
      };

      Slipstream.vent.trigger("rbac_provider:discovered", RBACProvider);   
      this.rbacResolver = new Slipstream.SDK.RBACResolver();
    });
    it('Single set of capabilities', function() {
      assert.isTrue(this.rbacResolver.verifyAccess(['space_cap0', 'space_cap1']), "allow access");
      assert.isFalse(this.rbacResolver.verifyAccess(['space_cap0', 'space_cap2']), "deny access");
    });
    it('Multiple sets of capabilities', function() {
      assert.isTrue(this.rbacResolver.verifyAccess([['space_cap0', 'space_cap2'], ['space_cap0', 'space_cap1']]), "allow access");
      assert.isFalse(this.rbacResolver.verifyAccess([['space_cap0', 'space_cap2'], ['space_cap3', 'space_cap4']]), "deny access");
    });
  });
});