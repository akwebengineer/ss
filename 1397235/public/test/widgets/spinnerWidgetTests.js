define([
    'widgets/spinner/spinnerWidget'
],function(SpinnerWidget) {
    var $el = $('#test_widget');

    var createContainer = function () {
        var $container = $("<div id = spinner_test></div>");
        $el.append($container);
        return $container;
    };

    var cleanUp = function (thisObj) {
        thisObj.spinnerWidget.destroy();
        thisObj.$container.remove();
    };

    describe('SpinnerWidget - Unit tests:', function() {
        describe('Methods Exist', function() {
            before(function(){
                this.$container = createContainer();
                this.spinnerWidget = new SpinnerWidget({
                    "container": this.$container,
                    "hasPercentRate": true
                }).build();
            });
            after(function(){
                cleanUp(this);
            });

            it('should exist', function() {
                this.spinnerWidget.should.exist;
            });

            it('build() should exist', function() {
                assert.isFunction(this.spinnerWidget.build, 'The SpinnerWidget must have a function named build.');
            });
            
            it('destroy() should exist', function() {
                assert.isFunction(this.spinnerWidget.destroy, 'The SpinnerWidget must have a function named destroy.');
            });

            it('setStatusText() should exist', function() {
                assert.isFunction(this.spinnerWidget.setStatusText, 'The SpinnerWidget must have a function named setStatusText.');
            });

            it('setSpinnerProgress() should exist', function() {
                assert.isFunction(this.spinnerWidget.setSpinnerProgress, 'The SpinnerWidget must have a function named setSpinnerProgress.');
            });

            it('setTimeRemaining() should exist', function() {
                assert.isFunction(this.spinnerWidget.setTimeRemaining, 'The SpinnerWidget must have a function named setTimeRemaining.');
            });

            it('hideTimeRemaining() should exist', function() {
                assert.isFunction(this.spinnerWidget.hideTimeRemaining, 'The SpinnerWidget must have a function named hideTimeRemaining.');
            });
        });

        describe('Indeterminate Spinner', function() {
            before(function(){
                this.$container = createContainer();
                this.spinnerWidget = new SpinnerWidget({
                    "container": this.$container
                }).build();
            });

            it('build', function() {
                assert.isTrue(this.$container.find('.indeterminateSpinnerContainer').length > 0, 'The SpinnerWidget must have a indeterminated spinner container');
            });

            it('setStatusText', function() {
                this.spinnerWidget.setStatusText('Complete');
                assert.equal('Complete', this.$container.find('.spinnerText').text(), "the text should get updated");
            });

            it('destroy', function() {
                cleanUp(this);
                assert.isTrue(this.$container.find('.indeterminateSpinnerContainer').length == 0, 'The SpinnerWidget removed the indeterminated spinner container.');
            });
        });
        
        describe('Determinate Spinner', function() {
            before(function(){
                this.$container = createContainer();
                this.spinnerWidget = new SpinnerWidget({
                    "container": this.$container,
                    "hasPercentRate": true
                }).build();
            });
            it('build', function() {
                assert.isTrue(this.$container.find('.determinateSpinnerContainer').length > 0, 'The SpinnerWidget must have a determinated spinner container');
            });

            it('setStatusText', function() {
                this.spinnerWidget.setStatusText('Complete');
                assert.equal('Complete', this.$container.find('.spinnerText').text(), "the text should get updated");
            });

            it('setSpinnerProgress', function() {
                this.spinnerWidget.setSpinnerProgress(0.5);
                assert.equal('50%', this.$container.find('.spinner_label').text(), "the percentage should get updated");
            });

            it('setTimeRemaining', function() {
                this.spinnerWidget.setTimeRemaining(15000);
                assert.notEqual('none', this.$container.find('.spinnerTimeStamp').css("display"), "the timestamp should be visible");
            });

            it('hideTimeRemaining', function() {
                this.spinnerWidget.hideTimeRemaining();
                assert.equal('none', this.$container.find('.spinnerTimeStamp').css("display"), "the timestamp should not be visible");   
            });

            it('destroy', function() {
                cleanUp(this);
                assert.isTrue(this.$container.find('.determinateSpinnerContainer').length == 0, 'The SpinnerWidget removed the determinated spinner container.');
            });
        });

        
        describe('Error', function() {
            describe('noSpinner Error', function() {
                describe('Indeterminate Spinner', function() {
                    before(function(){
                        this.spinnerWidget = new SpinnerWidget({});
                    });
                    
                    it('build error', function() {
                        assert.throws(this.spinnerWidget.build, Error, 'the spinner object has not created');
                    });

                    it('destroy error', function() {
                        assert.throws(this.spinnerWidget.destroy, Error, 'the spinner object has not created');
                    });

                    it('setStatusText error', function() {
                        assert.throws(this.spinnerWidget.setStatusText, Error, 'the spinner object has not created');
                    });
                });
                describe('Determinate Spinner', function() {
                    before(function(){
                        this.spinnerWidget = new SpinnerWidget({
                            "hasPercentRate": true
                        });
                    });

                    it('build error', function() {
                        assert.throws(this.spinnerWidget.build, Error, 'the spinner object has not created');
                    });

                    it('destroy error', function() {
                        assert.throws(this.spinnerWidget.destroy, Error, 'the spinner object has not created');
                    });

                    it('setStatusText error', function() {
                        assert.throws(this.spinnerWidget.setStatusText, Error, 'the spinner object has not created');
                    });

                    it('setTimeRemaining error', function() {
                        assert.throws(this.spinnerWidget.setTimeRemaining, Error, 'the spinner object has not created');
                    });

                    it('hideTimeRemaining error', function() {
                        assert.throws(this.spinnerWidget.hideTimeRemaining, Error, 'the spinner object has not created');
                    });

                    it('setSpinnerProgress error', function() {
                        assert.throws(this.spinnerWidget.setSpinnerProgress, Error, 'the spinner object has not created');
                    });
                });
            });

            describe('noElements Error', function() {
                describe('Indeterminate Spinner', function() {
                    before(function(){
                        this.$container = createContainer();
                        this.spinnerWidget = new SpinnerWidget({
                            "container": this.$container.find('.noElements')
                        });
                    });
                    
                    after(function(){
                        this.$container.remove();
                    });

                    it('build error', function() {
                        assert.throws(this.spinnerWidget.build, Error, 'The elements object required to build the Spinner widget is missing');
                    });

                    it('setStatusText error', function() {
                        assert.throws(this.spinnerWidget.setStatusText, Error, 'The elements object required to build the Spinner widget is missing');
                    });
                });
                describe('Determinate Spinner', function() {
                    before(function(){
                        this.$container = createContainer();
                        this.spinnerWidget = new SpinnerWidget({
                            "container": this.$container.find('.noElements'),
                            "hasPercentRate": true
                        });
                    });
                    
                    after(function(){
                        this.$container.remove();
                    });

                    it('build error', function() {
                        assert.throws(this.spinnerWidget.build, Error, 'The elements object required to build the Spinner widget is missing');
                    });

                    it('hideTimeRemaining error', function() {
                        assert.throws(this.spinnerWidget.hideTimeRemaining, Error, 'The elements object required to build the Spinner widget is missing');
                    });
                    
                    it('setTimeRemaining error', function() {
                        assert.throws(this.spinnerWidget.setTimeRemaining, Error, 'The elements object required to build the Spinner widget is missing');
                    });

                    it('setStatusText error', function() {
                        assert.throws(this.spinnerWidget.setStatusText, Error, 'The elements object required to build the Spinner widget is missing');
                    });
                });
            });
        });
    });
});