/**
 * A module that builds a accordion widget from a configuration object.
 * The configuration object includes the container which should be used to render the widget and the sections of the accordion
 *
 * @module AccordionWidget
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2016
 */
define([
    'widgets/accordion/lib/accordionTemplates',
    'lib/template_renderer/template_renderer',
    'widgets/tooltip/tooltipWidget'
], /** @lends AccordionWidget*/
function (AccordionTemplates, render_template, TooltipWidget) {

    var AccordionWidget = function (conf) {
        /**
         * AccordionWidget constructor
         *
         * @constructor
         * @class AccordionWidget- Builds a accordion widget from a configuration object.
         * @param {Object} conf - It requires the container and the sections parameters.
         * container: defines the container where the widget will be rendered
         * sections: defines the sections that are part of the accordion. It should be an array with objects with the following parameters:
         * - title: <required> title of the section and represented by a Slipstream view object data type or a string.
         * - description <optional>: description of the section and represented by a Slipstream view object data type or a string. It is available only when the section is collapsed.
         * - content: <required> content of the section and represented by a Slipstream view, a string or an array. It is available only when the section is expanded.
         * In the case of a Slipstream view, the view is expected to implement updateState and updateDescription methods. The methods will be invoked by the accordion widget to automatically update the content of the title state icon and the description of the section any time the user expands or collapse a section. If the methods are not available, the title status and description will stay unchanged.
         * - state <optional>: defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the icon svg. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It overwrites the state parameter defined for all the sections in the accordion.
         * - id <optional>: id of the section and represented by a string primitive data type. The id should be unique in the accordion configuration. It should be added if the content is a view and the state of the tooltip icon needs to be updated programmatically (updateState method).
         * state <optional>: defines the state icon to be showed on the right side of the title of the accordion. It has the icon and the tooltip properties. The icon defines the class that has the icon svg. The tooltip defines the content of the tooltip that will be showed when the icon is hovered. It applies to all the sections of the accordion.
         * collapsible: <(optional) defines if the current expanded section should be automatically collapsed when a new section is expanded (true, default value) or it should be kept opened (false)>.
         * @returns {Object} Current AccordionWidget's object: this
         */

        var accordionConfiguration = $.extend(true, {}, conf),
            templates = new AccordionTemplates().getTemplates(),
            $accordionContainer = $(conf.container),
            accordionSectionsById = {},
            defaults = {
                leftPaddingOffset: 22
            },
            hasRequiredConfiguration = conf && typeof(conf.container) != 'undefined' && !_.isEmpty(conf.sections),
            isMultiCollapsible = _.isBoolean(conf.collapsible) && !conf.collapsible,
            accordionBuilt = false,
            errorMessages = {
                'noConf': 'The configuration object for the accordion widget is missing',
                'noContainer': 'The configuration for the accordion widget must include the container parameter',
                'noSections': 'The configuration for the accordion widget must include the sections parameter',
                'noBuilt': 'The accordion widget was not built'
            },
            accordionLibConfiguration;

        /**
         * Sets the the configurations assigned to a default state icon
         * @param {string/Object} state - state property that could include a default state
         * @inner
         */
        var setStateIcon = function (state) {
            //Gets the configuration assigned to a default state
            var getIconConfiguration = function (iconState) {
                var iconId;
                switch (iconState) {
                    case "unconfigured":
                        iconId = "icon_unconfigured";
                        break;
                    case "configured":
                        iconId = "icon_configured";
                        break;
                    case "unsaved":
                        iconId = "icon_undeployed";
                        break;
                    case "partially_configured":
                        iconId = "icon_partially_configured";
                        break;
                    case "undeployed":
                        iconId = "icon_undeployed";
                        break;
                    case "critical_alert":
                        iconId = "icon_critical_alert";
                        break;
                }
                if (iconId) {
                    return {
                        "icon_url": "#" + iconId,
                        "icon_class": iconId + "-dims " + iconState
                    }
                }
            };
            if (_.isObject(state) && _.isString(state.icon)) {
                var iconConfiguration = getIconConfiguration(state.icon);
                if (iconConfiguration) {
                    state.icon = iconConfiguration
                }
            }
            return state;
        };

        /**
         * Defines the carat to be used in the title of an accordion based on its nested level
         * @inner
         */
        var getCaratIcon = function (level) {
            switch (level) {
                case 1:
                    return "9x15";
                case 2:
                    return "sm_7x12";
                default:
                    return "sm_6x10";
            }
        };

        /**
         * Defines the configuration of the accordion sections including state (for title of the section) and tree (for nested sections)
         * @inner
         */
        var setSectionsConfiguration = function () {

            /**
             * Sets recursively the section configuration of the accordion
             * @param {array} sections - array of the sections as defined in the content of the accordion configuration
             * @param {string} level - level of a section respect to its hierarchy on a nested section
             * @param {string} sectionParentId - id of the parent of the sections parameter
             * @inner
             */
            var setSection = function (sections, level, sectionParentId) {
                var section, sectionId, group, nestedSection;
                for (var i = 0; i < sections.length; i++) {
                    section = sections[i];
                    section.tree = {};//used in nested sections

                    //sets icon state
                    if (section.state && accordionConfiguration.state) {
                        section.state = _.extend(_.extend({}, accordionConfiguration.state), setStateIcon(section.state));
                    }

                    //sets section id since it is an optional property but it's required for nested sections
                    if (_.isUndefined(section.id)) {
                        section.id = _.uniqueId("slipstream_accordion_widget");
                    }
                    sectionId = section.id;
                    accordionSectionsById[sectionId] = section;

                    section.level = {
                        id: level,
                        icon: getCaratIcon(level)
                    };
                    if (level != 1) {
                        group = (level - 1) % 3; //used to define the style (like border and carats) of the section based on 3 style groups
                        section.level.group = "group-" + group;
                    }

                    //sets relations between parent and children for nested sections
                    if (sectionParentId) {
                        section.tree.parent = sectionParentId;
                        accordionSectionsById[sectionParentId].tree.children.push(sectionId);
                    }
                    if (_.isArray(section.content)) {
                        if (_.isUndefined(section.title)) {//title of a section is required if the section has children
                            console.log("The configuration of a nested section must include the title");
                        }
                        section.tree.children = [];
                        section.isNested = true;
                        setSection(section.content, level + 1, sectionId);
                    }
                }
            };

            if (accordionConfiguration.state) {
                accordionConfiguration.state = setStateIcon(accordionConfiguration.state);
            }
            setSection(accordionConfiguration.sections, 1);//accordion section starts at level 1
        };

        /**
         * Adds content to a container
         * @param {Object} $sectionContainer - jQuery Object with the container of the section
         * @param {Object} section - configuration of the section
         * @param {string} type - type of element: title, description or content
         * @inner
         */
        var appendContent = function ($sectionContainer, sectionConf, type) {

            /**
             * Gets the content of a section based on if it is a nested section, a string, or a Slipstream view
             * @param {Object/string} content - content of a section
             * @param {boolean} isNestedSection - if the content belongs to a nested section
             * @inner
             */
            var getContent = function (content, isNestedSection) {
                if (!_.isEmpty(content)) {
                    if (isNestedSection) {
                        return render_template(templates.sectionContainer, {
                            'accordionSections': content
                        });
                    } else if (_.isString(content))
                        return content;
                    return content.render().el;
                }
            };

            var section = sectionConf[type],
                isNestedSection = _.isArray(section),
                content = getContent(section, isNestedSection);
            $sectionContainer.find(".accordion-" + type).append(content);
            //a nested section requires that the first level of children content is appended upfront so it can be subsequently expanded it carat is clicked
            if (isNestedSection) {
                appendAccordionSection(section);
            }
        };

        /**
         * Adds the title and the description content to each of the sections of the accordion
         * @param {array} sections - array of the sections as defined in the content of the accordion configuration
         * @inner
         */
        var appendAccordionSection = function (sections) {

            /**
             * Adds content to a specific container based on its content
             * @param {Object} sectionContainer - jQuery Object with container of a section
             * @param {Object} section - configuration of the section
             * @param {boolean} type - type of the section: title or description
             * @inner
             */
            var appendBasedOnContent = function (sectionContainer, section, type) {
                if (section[type]) {
                    appendContent(sectionContainer, section, type);
                } else {
                    sectionContainer.attr("data-section-no-" + type, true);
                }
            };

            sections.forEach(function (section) {
                var sectionContainer = $accordionContainer.find("[data-accordion-id=" + section.id + "]");
                appendBasedOnContent(sectionContainer, section, "title");
                appendBasedOnContent(sectionContainer, section, "description");
            });
        };

        /**
         * Adds a tooltip to a container that defines the state of the content of the section
         * @param {Object} section - configuration of the section
         * @param {Object} $tooltipContainer - jQuery Object with the container of the tooltip
         * @param {string} tooltipContent - content of the tooltip
         * @inner
         */
        var addStateTooltip = function (section, $tooltipContainer, tooltipContent) {
            section.tooltipInstance = new TooltipWidget({
                container: $tooltipContainer,
                sections: {
                    position: "top",
                    interactive: true
                },
                view: tooltipContent
            }).build();
        };

        /**
         * Adds a state tooltip to the title of each of the sections of the accordion
         * @inner
         */
        var addTitleTooltip = function () {
            if (conf.state && conf.state.icon) {
                accordionConfiguration.sections.forEach(function (section) {
                    var tooltipContent = (section.state && section.state.tooltip) ? section.state.tooltip : conf.state.tooltip;
                    if (tooltipContent) {
                        var $tooltipContainer = $accordionContainer.find("[data-accordion-id=" + section.id + "] .accordion-status").eq(0); //nested content could have more than one title, but only the first occurrence is the one that is needed
                        addStateTooltip(section, $tooltipContainer, tooltipContent);
                    }
                });
            }
        };

        /**
         * Sets a section content with its children's properties and grouped by section id
         * @param {Object} sectionContent - Object that will be updated with the children's properties
         * @param {array} children - children of a section
         * @param {array} properties - optional, properties of a child to be extracted to set the sectionContent
         * @inner
         */
        var setSectionContent = function (sectionContent, children, properties) {
            var child;
            children.forEach(function (childId) {
                child = accordionSectionsById[childId];
                if (_.isUndefined(child.tree.children)) {
                    if (_.isUndefined(properties)) {
                        sectionContent[childId] = accordionSectionsById[childId];
                    } else {
                        sectionContent[childId] = {};
                        properties.forEach(function (property) {
                            sectionContent[childId][property] = accordionSectionsById[childId][property];
                        });
                    }
                } else {
                    sectionContent[childId] = {};
                    setSectionContent(sectionContent[childId], child.tree.children, properties);
                }
            });
        };

        /**
         * Update accordion content after a section carat is clicked. The content is updated by adding children title, content and/or description
         * Updates content depending on the state of the section: expanded or collapsed
         * @param {Object} beforeActivateState - state of the section: collapse same section, expand same section or expand a new section
         * @param {Object} sectionUi - jQuery DOM of the sections (previous and current header and content)
         * @inner
         */
        var updateAccordionContent = function (beforeActivateState, sectionUi) {
            var $sectionTitle = beforeActivateState.willCollapseSame ? sectionUi.oldHeader : sectionUi.newHeader,
                $accordionSection = $sectionTitle.closest('.accordion-section'),
                accordionId = $accordionSection.data("accordion-id"),
                accordionSection = accordionSectionsById[accordionId],
                isContentRendered = accordionSection.isContentRendered,
                $previousSection;

            /**
             * Updates accordion state and description of a section
             * @param {Object} $section - jQuery Object with the section container
             * @inner
             */
            var updateAccordionStateTitle = function ($section) {
                var sectionId = $section.data("accordion-id"),
                    sectionConfiguration = accordionSectionsById[sectionId],
                    updatedIconState;
                if (!$section.attr("data-section-no-title") && !_.isString(sectionConfiguration.content)) {
                    if (_.isFunction(sectionConfiguration.content.updateDescription)) {
                        var updatedDescription = sectionConfiguration.content.updateDescription();
                        if (updatedDescription) {
                            $section.find('.accordion-description').empty().append(updatedDescription);
                        }
                    }
                    if (_.isFunction(sectionConfiguration.content.updateState)) {
                        updatedIconState = sectionConfiguration.content.updateState();
                        updateStateElements($section, updatedIconState, sectionConfiguration);
                    } else if (_.isFunction(sectionConfiguration.onStateContentUpdate)) {
                        var sectionHierarchy = sectionConfiguration.tree,
                            sectionContent = {};
                        if (_.isEmpty(sectionHierarchy)) {
                            sectionContent[sectionId] = sectionConfiguration.content;
                        } else {
                            setSectionContent(sectionContent, sectionHierarchy.children, ["content", "isContentRendered"]);
                        }
                        updatedIconState = sectionConfiguration.onStateContentUpdate(sectionContent);
                        updateStateElements($section, updatedIconState, sectionConfiguration);
                    }
                }
            };

            /**
             * Updates the style of a section
             * @param {Object} currentSection - jQuery Object with the current section container
             * @param {Object} previousSection - jQuery Object with the section container that was previously clicked
             * @inner
             */
            var updateSectionsStyle = function (currentSection, previousSection) {

                /**
                 * Updates the state of a section. It is required because the state of accordion sections are kept by the library some container deeper than the wrapper container. Therefore, the state needs to be tracked at the top of all hierarchy.
                 * @param {Object} $section - jQuery Object with the current section container
                 * @param {Object} operation - "remove" to remove the active class, otherwise, it will make the $section active.
                 * @inner
                 */
                var updateSectionState = function ($section, operation) {
                    if (operation == "remove") {
                        $section.removeClass("active");
                    } else {//add
                        $section.addClass("active");
                    }
                };

                /**
                 * Updates the state of the accordion section from parent to its nested sections.
                 * @param {Object} sectionObj - Object with section information like sectionId, section container
                 * @param {Object} operation - "remove" to remove the active class, otherwise, it will make the $section active.
                 * @inner
                 */
                var updateNestedSectionState = function (sectionObj, operation) {
                    var sectionId = sectionObj.sectionId,
                        $section = sectionObj.$section,
                        isRootSection;
                    do {
                        accordionSection = accordionSectionsById[sectionId];
                        updateSectionState($section, operation);
                        sectionId = accordionSection.tree.parent;
                        isRootSection = _.isUndefined(sectionId);
                        if (!isRootSection) {
                            $section = $accordionContainer.find("[data-accordion-section=" + sectionId + "]");
                        }
                    } while (!isRootSection);
                };

                /**
                 * Adjusts the style of a section based on title and content location and section level
                 * @param {Object} sectionObj - Object with section information like sectionId, section container
                 * @inner
                 */
                var adjustSectionStyle = function (sectionObj) {
                    var sectionConfiguration = accordionSectionsById[sectionObj.sectionId];
                    if (sectionConfiguration.level.id) {
                        var leftMarginCarat = sectionObj.$section.find(".arrow").eq(0).outerWidth(true);
                        var caratCss = {
                                "margin-left": leftMarginCarat
                            },
                            contentCss = {
                                "margin-left": leftMarginCarat + defaults.leftPaddingOffset,
                                "padding-left": 0
                            },
                            $section = sectionObj.$section.find(".accordion-section");
                        if (sectionConfiguration.level.id == 1) {
                            $section.find(".accordion-content:not(.accordion-wrapper)").css(caratCss);
                        } else {
                            $section.find(".arrow").css(caratCss);
                            $section.find(".accordion-description").css(contentCss);
                            $section.find(".accordion-content:not(.accordion-wrapper)").css(contentCss);
                        }
                    }
                };

                if (previousSection) {
                    updateNestedSectionState(previousSection, "remove");//removes active state to previous section
                    setCollapsedSectionStyle($previousSection, true);//sets collapsed style of previous section by removing active state
                }
                updateNestedSectionState(currentSection);//adds active state to current section
                setCollapsedSectionStyle($accordionSection, false);//restores active border on expanded state
                adjustSectionStyle(currentSection);//adjusts style on the current section
            };

            /**
             * Sets the collapsed style for sections with title/header
             * @param {Object} $collapsedSection - jQuery Object with the collapsed section that needs the style update
             * @param {boolean} sectionState - true if section is collapsed or false otherwise
             * @inner
             */
            var setCollapsedSectionStyle = function ($collapsedSection, sectionState) {
                if (_.isUndefined($collapsedSection.attr("data-section-no-title"))) {
                    $collapsedSection.attr("data-section-collapsed", sectionState);
                }
            };

            if (beforeActivateState.willExpandSame) {//expands section, in this way, title and summary of the section are already available but the content of the section needs to be appended
                if (!isContentRendered) {
                    appendContent($accordionSection, accordionSection, "content");
                    accordionSection.isContentRendered = true;
                }
                updateSectionsStyle({
                    $section: $accordionSection,
                    sectionId: accordionId
                });
            } else if (beforeActivateState.willCollapseSame) {//collapse its own section and state and description/content should be updated
                updateAccordionStateTitle($accordionSection);
                setCollapsedSectionStyle($accordionSection, true);
            } else if (beforeActivateState.willExpandNew) {//switches from current section to another one
                if (!isContentRendered) {
                    appendContent($accordionSection, accordionSection, "content");
                    accordionSection.isContentRendered = true;
                }
                $previousSection = sectionUi.oldHeader.closest('.accordion-section');
                sectionUi.oldHeader.hasClass("ui-state-active") && updateAccordionStateTitle($previousSection); //only if previous section is expanded
                var previousSectionId = $previousSection.data("accordion-id"),
                    currentParentId = accordionSectionsById[accordionId].tree.parent,
                    isValidUpdate = currentParentId ? !isParentSection(previousSectionId, currentParentId) : true;//checks that if there is a hierarchy relation between previous and current section so style can be updated accordingly

                if (isValidUpdate) {
                    updateSectionsStyle({
                        $section: $accordionSection,
                        sectionId: accordionId
                    }, {
                        $section: $previousSection,
                        sectionId: previousSectionId
                    });
                } else {
                    updateSectionsStyle({
                        $section: $previousSection,
                        sectionId: previousSectionId
                    });
                }
            }

            //extends initial accordion scope to new added content
            $accordionContainer.find(".accordion-wrapper").each(function () {
                var $accordion = $(this);
                if ($accordion.children().length) {
                    if ($accordion.hasClass("ui-widget")) {
                        $accordion.accordion("refresh");
                    } else {//accordion library has a limited scope until 3 levels deep, after that level, the accordion needs to be rebuilt on the subsequent levels
                        $accordion.accordion(accordionLibConfiguration)
                    }
                }
            });
        };

        /**
         * Updates the icon that represents the state of a section
         * @param {Object} $sectionContainer - jQuery Object with the container of the section
         * @param {Object} updatedIconState - updated state property
         * @inner
         */
        var addStateIcon = function ($sectionContainer, updatedIconState) {
            if (updatedIconState.icon) {
                $sectionContainer.find('> .title-status .accordion-status').empty().append(
                    render_template(templates.stateIconContainer, {
                        state: setStateIcon(updatedIconState)
                    })
                );
            }
        };

        /**
         * Updates the icon and the tooltip that indicates the state of a section
         * @param {Object} $sectionContainer - jQuery Object with the container of the section
         * @param {Object} updatedIconState - updated state property
         * @param {Object} section - configuration of the section
         * @inner
         */
        var updateStateElements = function ($sectionContainer, updatedIconState, section) {
            if (updatedIconState) {
                addStateIcon($sectionContainer, updatedIconState);
                if (section.tooltipInstance) {
                    section.tooltipInstance.updateContent(updatedIconState.tooltip);
                } else if (updatedIconState.tooltip) {
                    var $tooltipContainer = $sectionContainer.find('.accordion-status');
                    addStateTooltip(section, $tooltipContainer, updatedIconState.tooltip);
                }
            }
        };

        /**
         * Checks if a section is a parent of another section in a nested hierarchy.
         * The check can be used to establish if a state or style should be updated because of the relation between the sections
         * @param {Object} sectionId1 - id of the section that could represent a child
         * @param {Object} sectionId2 - id of the section that could represent a parent
         * @inner
         */
        var isParentSection = function (sectionId1, sectionId2) {
            var isInHierarchy = function (parentId, sectionId) {
                var isParent = false,
                    sectionParentId, isRootSection;
                do {
                    sectionParentId = accordionSectionsById[sectionId].tree.parent;
                    isRootSection = _.isUndefined(sectionParentId);
                    if (!isRootSection && sectionParentId == parentId) {
                        isParent = true;
                        isRootSection = true; //break loop
                    }
                    sectionId = sectionParentId;
                } while (!isRootSection);
                return isParent;
            };

            return sectionId1 == sectionId2 || isInHierarchy(sectionId1, sectionId2);
        };

        /**
         * Sets the configuration required by the accordion library
         * @inner
         */
        var setAccordionLibConfiguration = function () {

            /**
             * Adds the content for the sections with no title
             * @param {Object} $panel - jQuery Object with the section that needs to have the no-title sections added
             * @inner
             */
            var addNoTitleSection = function ($panel) {
                var $noTitleSection;
                $panel.find("[data-section-no-title]").each(function () {
                    $noTitleSection = $(this);
                    //sections without title needs to be rendered upfront
                    if (!$noTitleSection.find("> .accordion-content").children().length) {
                        $noTitleSection.find("> a").trigger("click");
                    }
                });
            };

            var $oldHeader; //cache last selected header of a section
            accordionLibConfiguration = {
                collapsible: true,
                active: false,
                animate: false,
                heightStyle: "content",
                beforeActivate: function (event, ui) {

                    //adjustments to containers provided by the Accordion library
                    if (isMultiCollapsible) {
                        //library doesn't provide the right ui for multi collapse case: default ui content is always willExpandSame, so updates need to happen to recreate the willCollapseSame state
                        //checks are only required on expand (willExpandSame) and collapse (willCollapseSame) and not against willExpandNew since sections expand/collapse independently
                        $oldHeader = ui.newHeader;
                        if (!_.isUndefined($oldHeader)) {
                            if (ui.newHeader.hasClass("ui-state-active")) {//willCollapseSame case
                                var temp = ui.oldHeader;
                                ui.oldHeader = ui.newHeader;
                                ui.newHeader = temp;
                            }
                        }
                    } else {
                        //fixes accordion library issue when section is collapsed and a new one is opened. in this case, ui.oldHeader comes empty which shouldn't be the case because a section was opened previously
                        if (ui.oldHeader.length != 0) {
                            if (ui.oldHeader.attr("aria-selected") == "true") {
                                $oldHeader = ui.oldHeader;
                            }
                        } else if (!_.isUndefined($oldHeader) && $oldHeader.attr("id") != ui.newHeader.attr("id")) {
                            ui.oldHeader = $oldHeader;
                        }
                    }

                    var hasNewHeader = ui.newHeader.length != 0,
                        hasOldHeader = ui.oldHeader.length != 0,
                        beforeActivateState = {
                            willExpandSame: hasNewHeader && !hasOldHeader,
                            willCollapseSame: !hasNewHeader && hasOldHeader,
                            willExpandNew: hasNewHeader && hasOldHeader
                        },
                        currentHeader = hasNewHeader ? ui.newHeader : ui.oldHeader,
                        isPanelSelected = currentHeader.attr("aria-selected") == "true";//current section status

                    updateAccordionContent(beforeActivateState, ui);

                    // Accordion library only supports auto collapsible i.e. only one accordion will be opened at a time.
                    // Support for having more than one accordion open at a time needs to be added; additionally,
                    // beforeActivate callback should return false to stop default auto collapsible interaction
                    if (isMultiCollapsible) {
                        // toggles the accordion's header
                        currentHeader.toggleClass("ui-state-active", !isPanelSelected);
                        $accordionContainer.find('.ui-state-active').attr("aria-selected", true);

                        // toggles the panel's content
                        var currentContent = currentHeader.next(".ui-accordion-content");
                        currentContent.toggleClass("ui-accordion-content-active", !isPanelSelected);
                        if (isPanelSelected) {
                            currentContent.hide();
                        } else {
                            currentContent.show();
                        }
                        addNoTitleSection(currentContent);
                        return false;
                    }
                },
                activate: function (event, ui) {
                    addNoTitleSection(ui.newPanel);
                }
            };
        };

        /**
         * Throws error messages if some required properties of the configuration are not available
         * @inner
         */
        var showError = function () {
            if (!_.isObject(conf))
                throw new Error(errorMessages.noConf);
            else if (_.isUndefined(conf.container))
                throw new Error(errorMessages.noContainer);
            else if (!_.isArray(conf.sections))
                throw new Error(errorMessages.noSections);
            else //generic error
                throw new Error(errorMessages.noBuilt);
        };

        /**
         * Builds the accordion widget in the specified container
         * @returns {Object} returns the instance of the accordion widget that was built
         */
        this.build = function () {
            if (hasRequiredConfiguration) {
                setSectionsConfiguration();
                $accordionContainer = $accordionContainer.append(render_template(templates.accordionContainer, {
                    'state': accordionConfiguration.state,
                    'accordionSections': accordionConfiguration.sections
                }, {
                    'accordionSection': templates.sectionContainer,
                    'stateIcon': templates.stateIconContainer
                })).find('.accordion-widget');
                appendAccordionSection(accordionConfiguration.sections);

                setAccordionLibConfiguration();
                $accordionContainer.find(".accordion-wrapper").accordion(accordionLibConfiguration);

                addTitleTooltip();

                accordionBuilt = true;
            } else {
                showError();
            }
            return this;
        };

        /**
         * Updates the icon state for a section in the accordion widget
         * @param {string} sectionId - id of the section to be updated
         * @param {Object} sectionState - updated state property
         * @returns {Object} returns the instance of the accordion widget that was built
         */
        this.updateState = function (sectionId, sectionState) {
            if (accordionBuilt) {
                var $accordionSection = $accordionContainer.find('#' + sectionId).closest('.accordion-section'),
                    accordionSection = accordionSectionsById[sectionId];
                updateStateElements($accordionSection, $.extend(true, {}, sectionState), accordionSection);
            } else {
                showError();
            }
            return this;
        };

        /**
         * Expands all sections in the accordion widget
         * @returns {Object} returns the instance of the accordion widget that was built
         */
        this.expandAll = function () {
            if (accordionBuilt) {
                if (isMultiCollapsible) {
                    $accordionContainer.find('.accordion- > .title-status').each(function (i) {
                        if ($(this).attr('aria-selected') == 'false') {
                            $accordionContainer.find(".accordion-wrapper").eq(0).accordion("option", "active", i);
                        }
                    });
                } else {
                    console.log("expandAll method is only applicable to an accordion with a configuration set to: collapsible = false")
                }
            } else {
                showError();
            }
            return this;
        };

        /**
         * Collapses all sections in the accordion widget
         * @returns {Object} returns the instance of the accordion widget that was built
         */
        this.collapseAll = function () {
            if (accordionBuilt) {
                if (isMultiCollapsible) {
                    $accordionContainer.find('.accordion- > .title-status').each(function (i) {
                        if ($(this).attr('aria-selected') == 'true') {
                            $accordionContainer.find(".accordion-wrapper").eq(0).accordion("option", "active", i);
                        }
                    });
                } else {
                    console.log("collapseAll method is only applicable to an accordion with a configuration set to collapsible: false")
                }
            } else {
                showError();
            }
            return this;
        };

        /**
         * Clean up the specified container from the resources created by the accordion widget
         * @returns {Object} returns the instance of the accordion widget
         */
        this.destroy = function () {
            if (accordionBuilt) {
                $accordionContainer.find(".accordion-wrapper").eq(0).accordion("destroy");
                $accordionContainer.remove();
            } else {
                throw new Error(errorMessages.noBuilt);
            }
            return this;
        };

    };

    return AccordionWidget;
});