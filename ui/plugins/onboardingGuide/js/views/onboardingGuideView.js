/**
 * SD user onboarding guide view
 * 
 * @module GuideView
 * @author Fengbin Sun <fengbin@juniper.net>
 * @copyright Juniper Networks, Inc. 2015
 **/
define([
    "backbone",
    "./onboardingGuideTemplate.js",
    "text!../conf/slidesConfiguration.json",
    "text!../conf/videosConfiguration.json"
], function(Backbone, GuideTemplate, SlidesConf, VideosConf) {
    var KEYCODE_ESC = 27,
        KEYCODE_LEFT = 37,
        KEYCODE_UP = 38,
        KEYCODE_RIGHT = 39,
        KEYCODE_DOWN = 40;

    var SLIDE_DURATION = 400,
        SLIDE_DURATION_LONG = 2000;

    var PLUGIN_CLASS = "onboardingGuide",
        PLUGIN_ID = "user-onboarding-guide",
        GUIDE_BODY_ID = "onboarding-guide-body";
        END_SLIDE = "onboarding-guide-end-slide";

    var CLASS_SELECTED = "selected",
        CLASS_SCROLL_DOWN = "scroll-down-button",
        CLASS_SCROLL_UP = "scroll-up-button";

    var NAV_BUTTON = "onboarding-guide-nav-button",
        NAV_BUTTON_WHAT = "nav-button-what-img",
        NAV_BUTTON_WHAT_TEXT = "nav-button-what-text",
        NAV_BUTTON_WHERE = "nav-button-where-img",
        NAV_BUTTON_WHERE_TEXT = "nav-button-where-text",
        NAV_BUTTON_HOW = "nav-button-how-img",
        NAV_BUTTON_HOW_TEXT = "nav-button-how-text";

    /**
     * match message keys in slides config to message value in msgs.properties
     */
    var localizeSlides = function(config, context) {
        config.slides.forEach(function(item) { // localize text
            item.title = context.getMessage(item.title);
            item.subTitle = context.getMessage(item.subTitle);
            item.text = context.getMessage(item.text);
        })
        return config;
    };

    var isFireFox = function() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    };

    var GuideView = Backbone.View.extend({
        clientHeight: undefined,
        localStorageItemKey: "onboarding_guide:doNotShowAgain",
        localStorageItemValue: "TRUE",

        initialize : function(options) {
            this.activity = options.activity;
            this.context = options.context;
            this.clientHeight = $(window).height();
        },

        /**
         * Close guide (remove from dom)
         */
        destroy : function() {
            console.log("destroy");
            this.unbindEvent();
            $("."+PLUGIN_CLASS).fadeOut(SLIDE_DURATION/2, function(){
                $("."+PLUGIN_CLASS).remove();
            });
        },

        /**
         * Should invoke this method to show the guide view after intialize
         */
        show: function() {
            this.render();
        },

        /**
         * show the end-slide which introduce some more info
         * @retired - not used for now
         */
        close: function(e) {
            var destroyDirectly = true;
            if (destroyDirectly) {
                this.destroy();
                return false;
            }
            this.activity.finish();
            this.unbindEvent();

            $("."+PLUGIN_CLASS).append(Slipstream.SDK.Renderer.render(this.templates.endSlideTemplate));
            $(".end-slide-instruction").html(this.context.getMessage("close_infotips"));
            $("."+END_SLIDE).fadeIn(SLIDE_DURATION/2);
            $("#"+PLUGIN_ID).fadeOut(SLIDE_DURATION/2); //slideUp

            $("#close-guide").click(function() {
                $("."+END_SLIDE).fadeOut(SLIDE_DURATION/2, function(){
                    $("."+PLUGIN_CLASS).remove();
                });
            });
        },

        /**
         * Generate guide container element and append to DOM
         */
        render: function() {
            this.slidesConf = JSON.parse(SlidesConf);
            this.videoListConf = JSON.parse(VideosConf);
            this.templates = new GuideTemplate().getTemplates();

            this.fieldLabels = {
                "whatsnew": this.context.getMessage("what_is_new"),
                "wheretogo": this.context.getMessage("where_to_go"),
                "howto": this.context.getMessage("how_to"),
                "doNotShowAgainLabel": this.context.getMessage("do_not_show_again"),
                "coverTitle": this.context.getMessage("cover_title"),
                "coverSubtitle": this.context.getMessage("cover_subtitle")
            };

            var config = {
                "id": PLUGIN_ID,
                "class": PLUGIN_CLASS,
                "labels": this.fieldLabels
            };

            $("body").append(Slipstream.SDK.Renderer.render(this.templates.guideTemplate, config));
            this.renderSlides();
            this.adjustSlidesWidth();
            $("#"+PLUGIN_ID).fadeIn(SLIDE_DURATION/2);
            this.firstSlide = this.currentSlide = 0;

            this.bindEvents();
        },

        /**
         * Generate every slides and append them to guide container
         */
        renderSlides: function() {
            var self = this,
                slidesCount = 0,
                bodyHTML = $("#"+GUIDE_BODY_ID);

            // cover
            var config = _.extend(this.fieldLabels, {
                "slideHeight": this.clientHeight
            });
            bodyHTML.append(Slipstream.SDK.Renderer.render(this.templates.coverSlideTemplate, config));
            slidesCount += 1;

            // whatsnew section
            config = {
                "slides": this.slidesConf["slidesWhat"],
                "slideHeight": this.clientHeight
            };
            config = localizeSlides(config, this.context);
            this.whatSlides = slidesCount;
            bodyHTML.append(Slipstream.SDK.Renderer.render(this.templates.slideTemplate, config));
            slidesCount += this.slidesConf["slidesWhat"].length;

            // where section
            config = {
                "slides": this.slidesConf["slidesWhere"],
                "slideHeight": this.clientHeight
            };
            config = localizeSlides(config, this.context);
            this.whereSlides = slidesCount;
            bodyHTML.append(Slipstream.SDK.Renderer.render(this.templates.slideTemplate, config));
            // the last slide of this part has some styles which cannot be recogonized during template render
            // we have to set value after render
            var targetDivText = this.context.getMessage("monitor_description"),
                descriptionText = this.context.getMessage("monitor_description_monitor_tab") + 
                            this.context.getMessage("monitor_description_device_tab") + 
                            this.context.getMessage("monitor_description_config_tab");
            $(".slide-content-text:contains("+targetDivText+")").html(descriptionText);
            slidesCount += this.slidesConf["slidesWhere"].length;

            // last section - How workflow
            config = {
                "slides": this.slidesConf["slidesHow"],
                "slideHeight": this.clientHeight
            };
            config = localizeSlides(config, this.context);
            this.howSlides = slidesCount;
            bodyHTML.append(Slipstream.SDK.Renderer.render(this.templates.videoSlideTemplate, config));
            slidesCount += this.slidesConf["slidesHow"].length;
            //remember the end slide position
            this.endSlide = slidesCount - 1;

            // render video list. The last one in videoListConf is for bottom, so don't render it first.
            for (var j = 0, len = this.videoListConf.length; j < len; j++) {
                var temp = Slipstream.SDK.Renderer.render(this.templates.videoPreviewTemplate, this.videoListConf[j]);
                if (j % 2 == 0) {
                    $(".video-list-column-left").append(temp);
                } else {
                    $(".video-list-column-right").append(temp);
                }
            }
        },

        bindEvents: function() {
            var self = this;
            this.bindCommonEvent();

            $("."+CLASS_SCROLL_UP).on("click", function(e){
                self.previous(e);
            });

            $("."+CLASS_SCROLL_DOWN).on("click", function(e){
                self.next(e);
            });

            $("#onboarding-close-button").click(function(e){
                self.close(e);
            });

            // click event on big icons on cover slide and small icons in Nav bar
            $("#guide-whatsnew, ."+NAV_BUTTON_WHAT).click(function(e){
                self.slideTo(self.whatSlides, e);
            });
            $("#guide-where, ."+NAV_BUTTON_WHERE).click(function(e){
                self.slideTo(self.whereSlides, e);
            });
            $("#guide-how, ."+NAV_BUTTON_HOW).click(function(e){
                self.slideTo(self.howSlides, e);
            });

            // don't show again change
            $('#donot-show-again').change(function(){
                self.doNotShowAgain($('#donot-show-again').is(":checked"));
            });

            // clicking on video description to play the video
            $(".video-preview-image, .video-description-title").click(function(e) {
                self.playVideo(e);
            });
        },

        /**
         * debounce is used to delay the event trigger for 400ms.
         * This cause the failure of unbinding those two events. Maybe event name has change
         */
        bindCommonEvent: function() {
            $("body").on("keydown", $.proxy(this.onKeydown, this));
            this._onMousewheel = _.debounce(this.onMousewheel, SLIDE_DURATION);
            this._onResize = _.debounce(this.onResize, SLIDE_DURATION);
            if (isFireFox()) {
                $("body").on("DOMMouseScroll", $.proxy(this._onMousewheel, this));
            } else {
                $("body").on("mousewheel", $.proxy(this._onMousewheel, this));
            }

            $(window).on("resize", $.proxy(this._onResize, this));
        },

        unbindEvent: function() {
            $("body").off("keydown", this.onKeydown);
            if (isFireFox()) {
                $("body").off("DOMMouseScroll", this._onMousewheel);
            } else {
                $("body").off("mousewheel", this._onMousewheel);
            }
            $(window).off("resize", this._onResize);
        },

        /**
         * keyboard event handler
         */
        onKeydown: function(e) {
            if (e.keyCode == KEYCODE_ESC) {
                this.close(e);
            }
            if (e.keyCode == KEYCODE_DOWN || e.keyCode == KEYCODE_RIGHT) {
                this.next(e);
            }
            if (e.keyCode == KEYCODE_UP || e.keyCode == KEYCODE_LEFT) {
                this.previous(e);
            }
        },

        /**
         * mouse scroll event.
         * Just move one slide whatever how long mouse scroll
         */
        onMousewheel: function(e, delta) {
            /**
             * sometime, param delta is undefined. We have to get the value from originalEvent.
             * Still, on FF, it does not work. This is a bug need to be fixed.
             */
            if (delta == void(0)) {
                if (e.type == "mousewheel") {
                    delta = e.originalEvent.wheelDelta;
                } else if (e.type == "DOMMouseScroll") {
                    delta = -e.originalEvent.detail;
                }
            }
            if (delta < 0) {
                this.next(e);
            } else {
                this.previous(e);
            }
        },

        next: function(e) {
            this.slideTo(this.currentSlide + 1, e);
        },

        previous: function(e) {
            this.slideTo(this.currentSlide - 1, e);
        },

        slideTo: function(target, e) {
            if (target > this.endSlide) {
                console.log("invalid target: after end");
                return false;
            } else if (target < this.firstSlide) {
                console.log("invalid target: before first");
                return false;
            }

            // if shiftKey is pressed when move up/down, do a slow animation (2000ms).
            var duration = e.shiftKey ? SLIDE_DURATION_LONG : undefined;
            var delta = target - this.currentSlide;
            this.currentSlide = target;
            this.doSlide(delta, duration);
        },

        /**
         * Change the value of "top" attribute of guide container to simulate slide action
         * 
         */
        doSlide: function(delta, duration) {
            var operator = "-=";
            if (delta < 0) {
                operator = "+=";
                delta = -delta;
            }
            delta = delta * this.clientHeight;
            var style = {top : operator + delta};

            duration = duration || SLIDE_DURATION;
            $("#"+GUIDE_BODY_ID).animate(style, duration, "linear");

            if (this.currentSlide == this.firstSlide) { // hide navigation bar
                $("."+NAV_BUTTON).fadeOut(duration);
                $("."+CLASS_SCROLL_UP).fadeOut(duration);
            } else {
                // show navi bar
                if ($("."+NAV_BUTTON).css('display') == 'none') {
                    $("."+NAV_BUTTON).fadeIn(duration);
                    $("."+CLASS_SCROLL_UP).fadeIn(duration);
                }

                if (this.currentSlide < this.whereSlides) {
                    $("."+NAV_BUTTON_WHAT).addClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHAT_TEXT).addClass(CLASS_SELECTED);

                    $("."+NAV_BUTTON_WHERE).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_HOW).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHERE_TEXT).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_HOW_TEXT).removeClass(CLASS_SELECTED);
                } else if (this.currentSlide < this.howSlides) {
                    $("."+NAV_BUTTON_WHERE).addClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHERE_TEXT).addClass(CLASS_SELECTED);

                    $("."+NAV_BUTTON_WHAT).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_HOW).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHAT_TEXT).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_HOW_TEXT).removeClass(CLASS_SELECTED);
                } else {
                    $("."+NAV_BUTTON_HOW).addClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_HOW_TEXT).addClass(CLASS_SELECTED);

                    $("."+NAV_BUTTON_WHAT).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHERE).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHAT_TEXT).removeClass(CLASS_SELECTED);
                    $("."+NAV_BUTTON_WHERE_TEXT).removeClass(CLASS_SELECTED);
                }
            }

            if (this.currentSlide == this.endSlide) {
                $("."+CLASS_SCROLL_DOWN).fadeOut(SLIDE_DURATION);
            } else {
                $("."+CLASS_SCROLL_DOWN).fadeIn(SLIDE_DURATION);
            }
        },

        /**
         * show the video playing overlay.
         * Video is displayed in a embed frame from YouTube Juniper Channel
         */
        playVideo: function(event) {
            var self = this;
            var element = $(event.currentTarget);

            var config = {
                "id": element.data("video-id"),
                "title": element.data("title"),
                "src": element.data("src")
            };

            // stop listening body events when playing video
            this.unbindEvent();
            $("#"+PLUGIN_ID).append(Slipstream.SDK.Renderer.render(this.templates.videoPlayTemplate, config));

            $(".video-play-overlay").on("mouseenter", function(){
                $(".video-play-close-button").show();
            });
            $(".video-play-overlay").on("mouseleave", function(){
                $(".video-play-close-button").hide();
            });
            $(".video-play-close-button").click(function() {
                $(".video-play-mask").remove();
                self.bindCommonEvent(); // resume event listening
            });
        },

        /**
         * adjust the slide height and position
         * if slide height becomes bigger, the container's top need to be moved up(-=), else move down (+=)
         * @returns
         */
        onResize : function(e) {
            this.adjustSlidesHeight();
            this.adjustSlidesWidth();
            console.log("resize:"+this.clientHeight);
        },

        /**
         * As slides become higher or lower during page resize, Adjust the top position of guide view 
         * to make sure the slides position does not changed
         * if slide height become bigger, the top need to be moved up(-=), otherwise move down (+=)
         */
        adjustSlidesHeight: function() {
            var MIN_CLIENT_HEIGHT = 615; // the screenshot will overlap if height is smaller than 615
            var clientHeight = Math.max($(window).height(), MIN_CLIENT_HEIGHT);
            // remember delta height change first
            var deltaHeight = (this.clientHeight - clientHeight);

            this.clientHeight = clientHeight;
            $(".onboarding-guide-slide").css({height : this.clientHeight});
            this.adjustGuideViewPosition(deltaHeight);
        },

        /**
         * If clientWidth is bigger than 1440, adjust margin-left and margin-right to make slide center
         */
        adjustSlidesWidth: function() {
            var MAX_CLIENT_WIDTH = 1440;
            var clientWidth = $(window).width();
            var marginLeft = "5%";
            if (clientWidth > MAX_CLIENT_WIDTH) {
                marginLeft = (clientWidth - MAX_CLIENT_WIDTH)/2 + MAX_CLIENT_WIDTH * 0.05;
            }
            $(".onboarding-guide-slide").css({marginLeft: marginLeft, marginRight: marginLeft});
        },

        /**
         * Adjust the slide height and total top position
         * if slide height become bigger, the top need to be moved up(-=), else move down (+=)
         */
        adjustGuideViewPosition: function(deltaHeight) {
            var operator = "+=";
            if (deltaHeight < 0) {
                operator = "-=";
                deltaHeight = -deltaHeight;
            }
            $("#"+GUIDE_BODY_ID).css({top : operator + deltaHeight * this.currentSlide});
        },

        /**
         * Add localStorage item to remember user preference
         */
        doNotShowAgain : function(checked) {
            var username = localStorage.getItem("slipstream:auth_user"),
                itemKey = this.localStorageItemKey + ":" + username;
            if (checked) {
                localStorage.setItem(itemKey, "TRUE");
            } else {
                localStorage.removeItem(itemKey);
            }
            console.log("doNotShowAgain:"+checked);
        }
    });
    return GuideView;
});