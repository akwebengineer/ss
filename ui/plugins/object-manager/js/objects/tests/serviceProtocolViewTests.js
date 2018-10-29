/**
 *
 */
define([
        '../models/serviceModel.js',
        '../views/serviceProtocolView.js',
        '../views/serviceView.js',
        'MutationObserver'
],function( ServiceModel,ServiceProtocolView, ServiceView ){
    describe("ServiceProtocolView Unit Test", function(){
        var context, activity;
        var view = null;
        var intent, model = null;
        var parentView;
        before(function(){
            activity = new Slipstream.SDK.Activity();
            contextStub = sinon.stub(activity, 'getContext', function(){
                return new Slipstream.SDK.ActivityContext();
            });
            model = new ServiceModel();
            intentStub = sinon.stub(activity, 'getIntent', function(){
                return new Slipstream.SDK.Intent(Slipstream.SDK.Intent.action.ACTION_CREATE);
            });
            parentView = new ServiceView({
                model: model,
                context: activity.getContext(),
                activity:activity
            });
        });

        after(function(){
            contextStub.restore();
            intentStub.restore();
        });

        describe("View Create", function(){
            beforeEach(function(){
                view = new ServiceProtocolView({
                    activity : activity,
                    model : new Backbone.Model(),
                    parentView : parentView,
                    context : parentView.context,
                    formMode : "create"
                });
            });

            it("View should exist", function(){
                view.should.exist;
            });

            it("View.form should exist", function(){
                view.render();
                view.form.should.exist;
            });

            it("Test submit function with valid input", function(){
                parentView.overlay = {
                    destroy: function() {}
                };
                parentView.render();
                view.render();
                var isValidInputStub = sinon.stub(view.form,"isValidInput", function(){
                    return true;
                });
                var checkFieldStatusStub = sinon.stub(view,"checkFieldStatus", function(){
                    return false;
                });
                var destroySpy = sinon.spy(parentView.overlay,"destroy");
                view.submit(new $.Event());
                destroySpy.calledOnce.should.be.true;
                destroySpy.restore();
            });

            it("Test submit function with invalid input", function(){
                view.render();
                var isValidInputStub = sinon.stub(view.form,"isValidInput", function(){
                    return false;
                });
                view.$el.find("#application-protocol-destination-port").val("22-").trigger('change');
                var logSpy = sinon.spy(console,"log");
                view.submit(new $.Event());
                assert(logSpy.calledWith("form is invalid"));
                isValidInputStub.restore();
                logSpy.restore();
            });

            it("Test submit function when checkFieldStatus is true", function(){
                view.render();
                var isValidInputStub = sinon.stub(view.form,"isValidInput", function(){
                    return true;
                });
                var checkFieldStatusStub = sinon.stub(view,"checkFieldStatus", function(){
                    return true;
                });
                var logSpy = sinon.spy(console,"log");
                view.submit(new $.Event());
                assert(logSpy.calledWith("form is invalid"));
                checkFieldStatusStub.restore();
                isValidInputStub.restore();
                logSpy.restore();
            });

            it("Test checkFieldStatus function with invalid ds_port", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find("#application-protocol-destination-port").val("22-").trigger('change');
                var isStub = sinon.stub(jQuery().__proto__,"is",function(){
                    return true;
                });
                var ret = view.checkFieldStatus();
                ret.should.be.true;
                isStub.restore();
            });

            it("Test checkFieldStatus function with invalid inactivity_timeout", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-timeout").val("aa").trigger('change');
                var isStub = sinon.stub(jQuery().__proto__,"is",function(){
                    return true;
                });
                var ret = view.checkFieldStatus();
                ret.should.be.true;
                isStub.restore();
            });

            it("Test checkFieldStatus function with invalid src_port", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find("#application-protocol-source-port").val("22-").trigger('change');
                var isStub = sinon.stub(jQuery().__proto__,"is",function(){
                    return true;
                });
                var ret = view.checkFieldStatus();
                ret.should.be.true;
                isStub.restore();
            });

            it("Test cancel function", function(){
                view.render();
                parentView.overlay = {
                    destroy: function() {}
                };
                var destroySpy = sinon.spy(parentView.overlay, 'destroy');
                view.cancel(new $.Event());
                destroySpy.calledOnce.should.be.true;
                destroySpy.restore();
            });

            it("Test afterBuild function", function(){
                var initComponentSpy = sinon.spy(view, "initComponent");
                var bindValidationSpy = sinon.spy(view, "bindValidation");
                view.afterBuild();
                initComponentSpy.calledOnce.should.be.true;
                bindValidationSpy.calledOnce.should.be.true;
                initComponentSpy.restore();
                bindValidationSpy.restore();
            });

            it("Test initComponent function with PROTOCOL_MS_RPC UDP type disable-timeout and enable-alg", function(){
                var jsonObj = {
                    "enable-alg":true,
                    "alg":"ms-rpc",
                    "dst-port":"2",
                    "protocol-number":17,
                    "name":"test",
                    "enable-timeout":false,
                    "disable-timeout":true,
                    "protocol-type":"PROTOCOL_MS_RPC",
                    "msrpc-protocol-type":"UDP",
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "msrpc-protocol-tcp":"UDP"
                };
                view.model.set(jsonObj);
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                var showAdvancedInputSpy = sinon.spy(view,"showAdvancedInput");
                view.initComponent();
                view.$el.find("#check-rpc-alg").attr("checked").should.be.equal("checked");
                view.$el.find("#sunrpc-protocol-tcp").attr("checked").should.be.equal("checked");
                view.$el.find("#msrpc-protocol-udp").attr("checked").should.be.equal("checked");
                showAdvancedInputSpy.calledOnce.should.be.true;
                showAdvancedInputSpy.restore();
            });

            it("Test initComponent function with PROTOCOL_SUN_RPC UDP type enable-timeout and disable-alg", function(){
                var jsonObj = {
                    "enable-alg":false,
                    "dst-port":"2",
                    "protocol-number":17,
                    "name":"test",
                    "enable-timeout":true,
                    "disable-timeout":false,
                    "protocol-type":"PROTOCOL_SUN_RPC",
                    "sunrpc-protocol-type":"UDP",
                    "inactivity-time-type" : "Seconds",
                    "inactivity-timeout" : '',
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "sunrpc-protocol-tcp":"UDP"
                };
                view.model.set(jsonObj);
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                var showAdvancedInputSpy = sinon.spy(view,"showAdvancedInput");
                view.initComponent();
                view.$el.find("#check-inactivity-timeout").attr("checked").should.be.equal("checked");
                view.$el.find("#sunrpc-protocol-udp").attr("checked").should.be.equal("checked");
                view.$el.find("#msrpc-protocol-tcp").attr("checked").should.be.equal("checked");
                showAdvancedInputSpy.calledOnce.should.be.true;
                showAdvancedInputSpy.restore();
            });

            it("Test validateProtocolName function with duplicate name", function(){
                parentView.protocolData = new Backbone.Collection([
                    {"name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                    {"name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                ]);
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("protocol1").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validateProtocolName();
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });

            it("Test validateProtocolInactivityTimeout function with invalid input[1]", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-time-type").children('option:nth-child(2)').prop("selected",true).trigger('change');
                view.$el.find("#inactivity-timeout").val("2260").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validateProtocolInactivityTimeout();
                view.$el.find('#inactivity-timeout').parent().find("small[class*='error']").attr("class").should.include("elementinput");
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });

            it("Test validateProtocolInactivityTimeout function with invalid input[2]", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-time-type").children('option:first-child').prop("selected",true).trigger('change');
                view.$el.find("#inactivity-timeout").val("aa").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validateProtocolInactivityTimeout();
                view.$el.find('#inactivity-timeout').parent().find("small[class*='error']").attr("class").should.include("elementinput");
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });

            it("Test isValidPortRange function with null", function(){
                var ret = view.isValidPortRange("");
                ret.should.be.equal(true);
            });

            it("Test isValidPortRange function with a number", function(){
                var ret = view.isValidPortRange("12");
                ret.should.be.equal(true);
            });

            it("Test isValidPortRange function with a number over max number", function(){
                var ret = view.isValidPortRange("65536");
                ret.should.be.equal(false);
            });

            it("Test isValidPortRange function with a range", function(){
                var ret = view.isValidPortRange("10-20");
                ret.should.be.equal(true);
            });

            it("Test isValidPortRange function with a invalid range[1]", function(){
                var ret = view.isValidPortRange("10-20-30");
                ret.should.be.equal(false);
            });
 
            it("Test isValidPortRange function with a invalid range[2]", function(){
                var ret = view.isValidPortRange("30-10");
                ret.should.be.equal(false);
            });

            it("Test isValidPortRange function with a invalid range[3]", function(){
                var ret = view.isValidPortRange("10"+"-"+"");
                ret.should.be.equal(false);
            });

            it("Test validatePortRange function with valid input", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                var id = "application-protocol-source-port";
                view.$el.find("#application-protocol-source-port").val("22").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validatePortRange(id);
                showErrorMessageSpy.calledOnce.should.be.false;
                showErrorMessageSpy.restore();
            });

            it("Test validatePortRange function with invalid input[1]", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                var id = "application-protocol-source-port";
                view.$el.find("#application-protocol-source-port").val("22-").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validatePortRange(id);
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });

            it("Test validatePortRange function with invalid input[2]", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                var id = "application-protocol-source-port";
                view.$el.find("#application-protocol-source-port").val("aa").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validatePortRange(id);
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });

            it("Test showErrorMessage function", function(){
                view.render();
                var id = "application-protocol-name";
                var message = "test the function";
                view.showErrorMessage(id,message);
                view.$el.find('#application-protocol-name').parent().find("small[class*='error']").html().should.be.equal("test the function");
            });

            it("Test convertInactivityTimeout function from second to minute", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-time-type").children('option:nth-child(2)').prop("selected",true).trigger('change');
                view.$el.find("#inactivity-timeout").val("600").trigger('change');
                var validateProtocolInactivityTimeoutSpy = sinon.spy(view, "validateProtocolInactivityTimeout");
                view.convertInactivityTimeout();
                view.$el.find("#inactivity-timeout").val().should.be.equal('10');
                validateProtocolInactivityTimeoutSpy.calledOnce.should.be.true;
                validateProtocolInactivityTimeoutSpy.restore();
            });

            it("Test convertInactivityTimeout function from minute to second", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-time-type").children('option:first-child').prop("selected",true).trigger('change');
                view.$el.find("#inactivity-timeout").val("10").trigger('change');
                var validateProtocolInactivityTimeoutSpy = sinon.spy(view, "validateProtocolInactivityTimeout");
                view.convertInactivityTimeout();
                view.$el.find("#inactivity-timeout").val().should.be.equal('600');
                validateProtocolInactivityTimeoutSpy.calledOnce.should.be.true;
                validateProtocolInactivityTimeoutSpy.restore();
            });

            it("Test showTimeoutInput function with enable-inactivity-timeout", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-timeout").parent().attr("class").should.include("elementinput-in-one-row");
                view.$el.find("#inactivity-time-type").parent().attr("class").should.include("dropdown-widget elementinput-in-one-row unit-element-without-lable");
            });

            it("Test showTimeoutInput function with disable-inactivity-timeout", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",false).trigger('change');
                view.showTimeoutInput();
                view.$el.find(".inactivity-timeout-settings").attr("style").should.contain("display: none;");
            });

            it("Test showDestinationPortInput function with enable-alg", function(){
                var jsonObj = {
                    "enable-alg":true,
                    "alg":"ms-rpc",
                    "dst-port":"2",
                    "protocol-number":17,
                    "name":"test",
                    "enable-timeout":false,
                    "disable-timeout":true,
                    "protocol-type":"PROTOCOL_MS_RPC",
                    "msrpc-protocol-type":"UDP",
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "msrpc-protocol-tcp":"UDP"
                };
                view.model.set(jsonObj);
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.initComponent();
                var resetRequiredFieldSpy = sinon.spy(view, "resetRequiredField");
                view.showDestinationPortInput();
                view.$el.find(".destination-port-settings").attr("style").should.contain("display: block;");
                resetRequiredFieldSpy.calledOnce.should.be.true;
                resetRequiredFieldSpy.restore();
            });

            it("Test showDestinationPortInput function with disable-alg", function(){
                var jsonObj = {
                    "enable-alg":false,
                    "dst-port":"2",
                    "protocol-number":17,
                    "name":"test",
                    "enable-timeout":false,
                    "disable-timeout":true,
                    "protocol-type":"PROTOCOL_MS_RPC",
                    "msrpc-protocol-type":"UDP",
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "msrpc-protocol-tcp":"UDP"
                };
                view.model.set(jsonObj);
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.initComponent();
                var resetRequiredFieldSpy = sinon.spy(view, "resetRequiredField");
                view.showDestinationPortInput();
                view.$el.find(".destination-port-settings").attr("style").should.contain("display: none;");
                resetRequiredFieldSpy.calledOnce.should.be.true;
                resetRequiredFieldSpy.restore();
            });

            it("Test showAdvancedInput function with TCP/UDP type", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#application-protocol-type').children('option:first-child').prop("selected",true).trigger('change');
                view.showAdvancedInput();
                view.$el.find("#advanced-settings").find("h5").html().should.be.equal("[application_protocol_form_advanced_settings]");
                view.$el.find(".tcp-protocol-settings").attr("style").should.contain("display: block;");
            });

            it("Test showAdvancedInput function with ICMP/ICMPV6 type", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#application-protocol-type').children('option:nth-child(3)').prop("selected",true).trigger('change');
                view.showAdvancedInput();
                view.$el.find("#advanced-settings").find("h5").html().should.be.equal("ICMP");
                view.$el.find(".other-protocol-settings").attr("style").should.contain("display: none;");
            });

            it("Test showAdvancedInput function with SUN_RPC type", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#application-protocol-type').children('option:nth-child(4)').prop("selected",true).trigger('change');
                var showDestinationPortInputSpy = sinon.spy(view,"showDestinationPortInput");
                view.showAdvancedInput();
                view.$el.find(".other-protocol-settings").attr("style").should.contain("display: none;");
                view.$el.find(".sun-rpc-protocol-settings").attr("style").should.contain("display: block;");
                showDestinationPortInputSpy.calledOnce.should.be.true;
                showDestinationPortInputSpy.restore();
            });

            it("Test showAdvancedInput function with MS_RPC type", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#application-protocol-type').children('option:nth-child(5)').prop("selected",true).trigger('change');
                var showDestinationPortInputSpy = sinon.spy(view,"showDestinationPortInput");
                view.showAdvancedInput();
                view.$el.find(".other-protocol-settings").attr("style").should.contain("display: none;");
                view.$el.find(".ms-rpc-protocol-settings").attr("style").should.contain("display: block;");
                showDestinationPortInputSpy.calledOnce.should.be.true;
                showDestinationPortInputSpy.restore();
            });

            it("Test showAdvancedInput function with OTHER type", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#application-protocol-type').children('option:nth-child(7)').prop("selected",true).trigger('change');
                view.showAdvancedInput();
                view.$el.find("#advanced-settings").find("h5").html().should.be.equal("[application_protocol_form_advanced_settings]");
                view.$el.find(".ms-rpc-protocol-settings").attr("style").should.contain("display: none;");
                view.$el.find(".other-protocol-settings").attr("style").should.contain("display: block;");
            });

            it("Test findProtcol function", function(){
                var type = "PROTOCOL_ICMP";
                var ret = view.findProtcol(type);
                ret.should.be.equal("ICMP");
            });

            it("Test findProtcol function with null type", function(){
                var type = "";
                var ret = view.findProtcol(type);
                ret.should.be.equal("");
            });

            it("Test resetRequiredField function with false", function(){
                view.render();
                var requiredFields = view.$el.find("#application-protocol-create-form").find("div[style='display: none;'][class*='row']").find("input[required]");
                view.resetRequiredField(requiredFields,false);
                view.$el.find("#icmp-code").should.not.have.property("required");
                view.$el.find("#protocol-number").should.not.have.property("required");
            });

            it("Test resetRequiredField function with true", function(){
                view.render();
                var requiredFields = view.$el.find("#application-protocol-create-form").find("div[style='display: none;'][class*='row']").find("input[required]");
                view.resetRequiredField(requiredFields,true);
                view.$el.find("#icmp-code").attr("required").should.be.equal("required");
                view.$el.find("#protocol-number").attr("required").should.be.equal("required");
            });

            it("Test processRawData function", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test").trigger('change');
                view.$el.find('#check-inactivity-timeout').prop("checked",true).trigger('change');
                view.showTimeoutInput();
                view.$el.find("#inactivity-time-type").children('option:nth-child(2)').prop("selected",true).trigger('change');
                view.$el.find("#inactivity-timeout").val("10").trigger('change');
                view.processRawData();
                view.$el.find("#inactivity-timeout").val().should.be.equal('600');
                view.$el.find("#inactivity-time-type").val().should.be.equal("Seconds");
            });

            it("Test beforeSave function with TCP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:first-child').prop("selected",true).trigger('change');
                var properties = {
                    "name" : "test",
                    "enable-timeout" : true,
                    "protocol-type" : "PROTOCOL_TCP",
                    "inactivity-time-type" : "Seconds",
                    "inactivity-timeout" : ''
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(6);
                ret['disable-timeout'].should.be.equal(false);
            });

            it("Test beforeSave function with UDP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(2)').prop("selected",true).trigger('change');
                var properties = {
                    "name" : "test",
                    "enable-timeout" : false,
                    "protocol-type" : "PROTOCOL_UDP"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(17);
                ret['disable-timeout'].should.be.equal(true);
            });

            it("Test beforeSave function with ICMP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(3)').prop("selected",true).trigger('change');
                var properties = {
                    "name" : "test",
                    "enable-timeout" : false,
                    "protocol-type" : "PROTOCOL_ICMP",
                    "icmp-code": "10",
                    "icmp-type": "10"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(1);
                ret['disable-timeout'].should.be.equal(true);
            });

            it("Test beforeSave function with ICMPV6 type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(6)').prop("selected",true).trigger('change');
                var properties = {
                    "name" : "test",
                    "enable-timeout" : false,
                    "protocol-type" : "PROTOCOL_ICMPV6",
                    "icmp-code": "1",
                    "icmp-type": "1"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(58);
                ret['disable-timeout'].should.be.equal(true);
            });

            it("Test beforeSave function with SUN_RPC TCP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(4)').prop("selected",true).trigger('change');
                view.$el.find("#sunrpc-protocol-tcp").prop("checked", true).trigger('change');
                var properties = {
                    "enable-alg":false,
                    "name" : "test",
                    "enable-timeout" : true,
                    "protocol-type" : "PROTOCOL_SUN_RPC",
                    "inactivity-time-type" : "Seconds",
                    "inactivity-timeout" : '',
                    "rpc-program-number":"1",
                    "sunrpc-protocol-tcp":"TCP"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(6);
                ret["sunrpc-protocol-type"].should.be.equal("TCP");
                ret['disable-timeout'].should.be.equal(false);
            });

            it("Test beforeSave function with SUN_RPC UDP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(4)').prop("selected",true).trigger('change');
                view.$el.find("#sunrpc-protocol-tcp").prop("checked", false).trigger('change');
                view.$el.find("#sunrpc-protocol-udp").prop("checked", true).trigger('change');
                var properties = {
                    "enable-alg":true,
                    "dst-port": "2",
                    "name" : "test",
                    "enable-timeout" : false,
                    "protocol-type" : "PROTOCOL_SUN_RPC",
                    "rpc-program-number":"2",
                    "sunrpc-protocol-tcp":"UDP"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(17);
                ret["sunrpc-protocol-type"].should.be.equal("UDP");
                ret['disable-timeout'].should.be.equal(true);
                ret.alg.should.be.equal("sun-rpc");
            });

            it("Test beforeSave function with MS_RPC TCP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(5)').prop("selected",true).trigger('change');
                view.$el.find("#msrpc-protocol-tcp").prop("checked", true).trigger('change');
                var properties = {
                    "enable-alg":true,
                    "dst-port":"2",
                    "name":"test",
                    "enable-timeout":false,
                    "protocol-type":"PROTOCOL_MS_RPC",
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "msrpc-protocol-tcp":"TCP"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(6);
                ret['disable-timeout'].should.be.equal(true);
                ret.alg.should.be.equal("ms-rpc");
                ret["msrpc-protocol-type"].should.be.equal("TCP");
            });

            it("Test beforeSave function with MS_RPC UDP type ", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-type').children('option:nth-child(5)').prop("selected",true).trigger('change');
                view.$el.find("#msrpc-protocol-tcp").prop("checked", false).trigger('change');
                view.$el.find("#msrpc-protocol-udp").prop("checked", true).trigger('change');
                var properties = {
                    "enable-alg":true,
                    "dst-port":"2",
                    "name":"test",
                    "enable-timeout":false,
                    "protocol-type":"PROTOCOL_MS_RPC",
                    "uuid":"11111111-2222-3333-4444-555555555555",
                    "msrpc-protocol-tcp":"UDP"
                };
                var ret = view.beforeSave(properties);
                ret["protocol-number"].should.be.equal(17);
                ret['disable-timeout'].should.be.equal(true);
                ret.alg.should.be.equal("ms-rpc");
                ret["msrpc-protocol-type"].should.be.equal("UDP");
            });
        });

        describe("View Edit", function(){
            beforeEach(function(){
                var jsonObj1 = {
                        "@uri" : "/api/juniper/sd/service-management/services/196910",
                        "name" : "test1",
                        "description": "This is a test",
                        "id": 196910,
                        "edit-version": 1,
                        "domain-name" : "Global", 
                        "domain-id": 2,
                        "protocols": {
                            "protocol":[
                                {"id":393477, "name" : "protocol1", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"},
                                {"id":393480, "name" : "protocol2", "description" : "protocol", "dst-port" : "100", "protocol-type" : "PROTOCOL_TCP"}
                            ]
                        },
                        "is-group": false
                    };
                parentView.model.set(jsonObj1);
                parentView.render();
                var getSelectedRowsStub = sinon.stub(parentView.gridWidget, "getSelectedRows", function(){
                    return [{"id":393477, "name":"protocol1", "domain-name":'Global'}];
                });
                view = new ServiceProtocolView({
                    activity: activity,
                    parentView: parentView,
                    context:parentView.context,
                    formMode:"edit"
                });
                getSelectedRowsStub.restore();
            });

            it("Test submit function with Edit formMode", function(){
                view.rowId = parentView.$el.find('#service-protocols').children().children("tr:nth-child(3)").attr("id");
                parentView.overlay = {
                    destroy: function() {}
                };
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("test1").trigger('change');
                var isValidInputStub = sinon.stub(view.form,"isValidInput", function(){
                    return true;
                });
                var destroySpy = sinon.spy(parentView.overlay,"destroy");
                view.submit(new $.Event());
                destroySpy.calledOnce.should.be.true;
                destroySpy.restore();
            });

            it("Test validateProtocolName function with duplicate name when in edit_mode", function(){
                view.render();
                $('#main-content').empty();
                $('#main-content').append(view.$el);
                view.$el.find('#application-protocol-name').val("protocol2").trigger('change');
                var showErrorMessageSpy = sinon.spy(view,"showErrorMessage");
                view.validateProtocolName();
                showErrorMessageSpy.calledOnce.should.be.true;
                showErrorMessageSpy.restore();
            });
        });
    });
})