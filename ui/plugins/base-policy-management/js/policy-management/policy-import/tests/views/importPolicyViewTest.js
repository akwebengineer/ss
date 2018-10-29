define([
    '../../views/importPolicyView.js',
     '../../../../../../fw-policy-management/js/firewall/policies/constants/fwPolicyManagementConstants.js'
], function (View, Constants) {

    describe('Import Policy View UT', function () {

         before(function () {
              
            policyOptions = {
            activity : new Slipstream.SDK.Activity()
            };
            policyOptions.activity.context = new Slipstream.SDK.ActivityContext();
            importPolicyView = new View({activity: policyOptions.activity,
            params : {
              policyManagementConstants:Constants
            }
            });
            importPolicyView.policyId = 23434;
            importPolicyView.fileName = "Test.zip";
            context.getMessage = function (key) {
                return key;
            };

            context.getHelpKey = function () {
            }

            context.startActivity= function () {
            }

        });


        it('render', function () {            
            importPolicyView.render();
            expect(importPolicyView.$el).to.not.be.null;         
        });

        it('validateFileType', function () {            
            var file = {files: [ { name : importPolicyView.fileName }, ""]};
            var state ;
            state = importPolicyView.isValidZipFile();  
            assert(typeof state === "boolean");
            assert(state === false) 

            state = importPolicyView.isValidZipFile(file); 
            assert(typeof state === "boolean");  
            assert(state === true);

            file = {files: [ { name : "Test.txt" }, ""]};
            state = importPolicyView.isValidZipFile(file);  
            assert(typeof state === "boolean");
            assert(state === false)

            file = {files: [ { name : ".test.zip" }, ""]};
            state = importPolicyView.isValidZipFile(file);
            assert(typeof state === "boolean");
            assert(state === false)
        });
        
        describe("Reports Service unit tests", function() {
        it('verify submit action with invalid form input', function(){
            var event = {
                 type: 'click',
                 preventDefault: function () {}
            };
            var isValidInput = sinon.stub(importPolicyView.form, "isValidInput", function() { return false;});
            importPolicyView.submit(event);
            isValidInput.called.should.be.equal(true);
            isValidInput.restore();

        });

        it('verify submit action with valid form input', function(){
            var event = {
                 type: 'click',
                 preventDefault: function () {}
            }, isValidInput = sinon.stub(importPolicyView.form, "isValidInput", function() { return true;});
            var stubProgressBar = sinon.stub(View.prototype, "showProgressBar"),
                importPolicyCallStub = sinon.stub(View.prototype, "onImportZipIntent"),
                response = {'files-upload-response' :{
                  'fileName' : importPolicyView.fileName
                }};
            $.mockjax.clear();
            $.mockjax({
                "url": '/api/juniper/sd/policy-management/firewall/policy-upload-file',
                "type": 'post',
                 status: 200,
                responseText: response,
                response: function (settings, done2) {
                    done2();
                    importPolicyCallStub.called.should.be.equal(true);
                    importPolicyCallStub.restore();
                }
            });
            importPolicyView.submit(event);
            isValidInput.called.should.be.equal(true);
            stubProgressBar.called.should.be.equal(true);
            isValidInput.restore();
            stubProgressBar.restore();

        });

        });
        
        it('verify onImportZipIntent call', function(){
            var versionId = 4;
            policyOptions.activity.overlay = {destroy: function(){console.log('destroyed');}}
            var  overlayStub = sinon.stub(policyOptions.activity.overlay, "destroy");
            importPolicyView.progressBarOverlay = {
                destroy: function() {}
            }
            importPolicyView.onImportZipIntent();
            overlayStub.called.should.be.equal(true);
            overlayStub.restore();
        });


        it('verify cancel event', function(){
            var event = {
                 type: 'click',
                 preventDefault: function () {}
            };
            policyOptions.activity.overlay = {destroy: function(){console.log('destroyed');}}
            var  overlayStub = sinon.stub(policyOptions.activity.overlay, "destroy");  
            importPolicyView.cancel(event);
            overlayStub.called.should.be.equal(true);
            overlayStub.restore();
        });

        it('verify progressbar call', function(){
            importPolicyView.showProgressBar();

        });

        describe("Reports Service unit tests", function() {
        it('verify invalid zip file 1', function(){
            div = $('<div id = "zipFile"/>');
            importPolicyView.$el.append(div);
            var  errorMessage = sinon.stub(importPolicyView, "showFileNameErrorMessage");  
            importPolicyView.validateFileName("zipFile");
            errorMessage.called.should.be.equal(true);
            errorMessage.restore();

        });

        it('verify invalid zip file 2', function(){
            div = $('<div id = "zipFile1" data-invalid = "true"/>');
            importPolicyView.$el.append(div);
            var  errorMessage = sinon.stub(importPolicyView, "showFileNameErrorMessage");  
            importPolicyView.validateFileName("zipFile1");
            errorMessage.called.should.be.equal(true);
            errorMessage.restore();

        });

          it('verify valid zip file input', function(){
            div = $('<div id = "zipFile2"/>');
            importPolicyView.$el.append(div);
            var isValidInput = sinon.stub(importPolicyView, "isValidZipFile", function() { return true;});
            importPolicyView.validateFileName("zipFile2");
            isValidInput.called.should.be.equal(true);
            isValidInput.restore();

        });

        });

    });

});
