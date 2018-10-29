define([
    'widgets/login/loginWidget'
], function (LoginWidget) {

    describe('LoginWidget - Unit tests:', function () {

        var $el = $('#test_widget'),
            containerId = 0;

        var createContainer = function () {
                var $container = $("<div id = login-container-id" + containerId++ + "></div>");
                $el.append($container);
                return $container;
            },
            destroyAll = function (context) {
                context.loginWidgetObj.destroy();
                context.$loginContainer.remove();
            };

        describe('Widget Interface', function () {
            before(function () {
                this.$loginContainer = createContainer();
                this.loginWidgetObj = new LoginWidget({
                    "container": this.$loginContainer[0]
                }).build();
            });
            after(function () {
                destroyAll(this);
            });
            it('should exist', function () {
                this.loginWidgetObj.should.exist;
            });
            it('build() should exist', function () {
                assert.isFunction(this.loginWidgetObj.build, 'The login widget must have a function named build.');
            });
            it('destroy() should exist', function () {
                assert.isFunction(this.loginWidgetObj.destroy, 'The login widget must have a function named destroy.');
            });
        });

        describe('Template', function () {
            before(function () {
                this.$loginContainer = createContainer();
                this.loginConfiguration = {
                    "container": this.$loginContainer[0],
                    "content": {
                        "title": "Juniper Web Device Manager",
                        "version": "Version 123.ABC",
                        "copyrightYear": "2017",
                        "note": "Best viewed in 1280x1024 resolution. Supported browsers are IE 11, Firefox 56 and Chrome 61."
                    }
                };
                this.loginWidgetObj = new LoginWidget(this.loginConfiguration).build();
            });
            after(function () {
                destroyAll(this);
            });
            it('should contain the login-widget class for login container', function () {
                this.$loginContainer.find('>div').hasClass('login_widget').should.be.true;
            });
            it('should contain the title', function () {
                var title = this.$loginContainer.find(".slipstream-content-title").text();
                assert.isTrue(title.indexOf(this.loginConfiguration.content.title) != -1, "the title has been added");
            });
            it('should contain the version', function () {
                var version = this.$loginContainer.find(".section_description > h6").text();
                assert.isTrue(version.indexOf(this.loginConfiguration.content.version) != -1, "the version has been added");
            });
            it('should contain the note', function () {
                var note = this.$loginContainer.find(".footer > h6").text();
                assert.isTrue(note.indexOf(this.loginConfiguration.content.note) != -1, "the note has been added");
            });
            it('should contain the copyrightYear', function () {
                var copyright = this.$loginContainer.find(".login_footer").text();
                assert.isTrue(copyright.indexOf(this.loginConfiguration.content.copyrightYear) != -1, "the copyright year has been added");
            });
        });

        describe('Container', function () {

            describe('renders on full view', function () {
                before(function () {
                    this.$loginContainer = createContainer();
                    this.loginWidgetObj = new LoginWidget({
                        "container": this.$loginContainer[0]
                    }).build();
                });
                after(function () {
                    destroyAll(this);
                });
                it('form should exist', function () {
                    assert.isTrue(_.isElement(this.$loginContainer.find(".login_form_block")[0]), 'The wrapper for the form widget should be rendered');
                    assert.isTrue(_.isElement(this.$loginContainer.find(".form-pattern")[0]), 'The form widget should be rendered');
                });
                it('footer should exist', function () {
                    assert.isTrue(_.isElement(this.$loginContainer.find(".login_footer")[0]), 'The login footer should be rendered');
                });
            });
            describe('renders on a container', function () {
                before(function () {
                    this.$loginContainer = createContainer();
                    this.loginWidgetObj = new LoginWidget({
                        "container": this.$loginContainer[0],
                        "fullPage": false
                    }).build();
                });
                after(function () {
                    destroyAll(this);
                });
                it('form should exist', function () {
                    assert.isFalse(_.isElement(this.$loginContainer.find(".login_form_block")[0]), 'The wrapper for the form widget should not be rendered');
                    assert.isTrue(_.isElement(this.$loginContainer.find(".form-pattern")[0]), 'The form widget should be rendered');
                });
                it('footer should not exist', function () {
                    assert.isFalse(_.isElement(this.$loginContainer.find(".login_footer")[0]), 'The login footer should be rendered');
                });
            });
            describe('renders on an overlay', function () {
                before(function () {
                    this.loginWidgetObj = new LoginWidget();
                    this.loginWidgetObj.build();
                });
                after(function () {
                    this.loginWidgetObj.destroy();
                });
                it('form should exist', function () {
                    var $overlay = $("#overlay_content");
                    assert.isTrue(_.isElement($overlay.find(".login_form")[0]), 'The wrapper for the login on overlay should be rendered');
                    assert.isTrue(_.isElement($overlay.find(".form-pattern")[0]), 'The form widget should be rendered');
                });
                it('footer should not exist', function () {
                    assert.isFalse(_.isElement($("#overlay_content").find(".login_footer")[0]), 'The login footer should not be rendered');
                });
            });
        });

        describe('getFormWidgetInstance method', function () {
            before(function () {
                this.$loginContainer = createContainer();
                this.loginWidgetObj = new LoginWidget({
                    "container": this.$loginContainer[0]
                }).build();
            });
            after(function () {
                destroyAll(this);
            });
            it('getFormWidgetInstance() should exist', function () {
                assert.isFunction(this.loginWidgetObj.getFormWidgetInstance, 'The login widget must have a function named getFormWidgetInstance.');
            });
            it('should allow to show the login form info', function () {
                var $info = this.$loginContainer.find(".info-message"),
                    newInfo = "updated";
                assert.equal($info.css("display"), 'none', 'the info container is hidden by default');

                this.loginWidgetObj.getFormWidgetInstance().showFormInfo(newInfo);
                assert.equal($info.css("display"), 'block', 'the info container is shown');
                assert.equal($info.find(".content").text(), newInfo, 'the info message is updated using the showFormInfo method');

            });
        });

    });

});
