<!-- Top nav bar-->
<!--<div class="top-bar-region">-->
<div>
    <nav class="top-bar" data-topbar>
        <div class="row">
            <div class="left">
                <section class="top-bar-section slipstream-logo-section">
                    <a href="{{logo_link}}">
                        <span class="burst slipstream-small-logo-image"></span>
                    </a>
                    <a class="slipstream-product-logo" href="#">
                        
                            <span style="{{#logo_width}}width: {{logo_width}};{{/logo_width}} {{#logo_height}}height: {{logo_height}};{{/logo_height}} {{#logo_src}}background: url({{logo_src}}) no-repeat;{{/logo_src}}" class="slipstream-product-logo-image"></span>
                        
                    </a>
                    <span class="slipstream-title-bar-title">
                    </span>
                </section>
            </div>

            <!--
            <div class="left small-2 medium-2 large-3 columns">
                <section class="top-bar-section advanced-section">
                    <ul class="left">
                        <li><a href="#" id="top_adv_search_icon" class="top_adv_search_icon">{{advanced}}</a></li>
                    </ul>
                </section>
            </div>
            -->

            <div>
                <section class="top-bar-section">
                        <ul id="view_elements_left" class="left">
                        </ul>
                        <ul id="toolbar_elements_left" class="left">
                        </ul>                        
                        <ul class="right">             
                            <li class="utility_toolbar">
                                {{#globalSearch}}
                                    {{>globalSearchContainer}}
                                {{/globalSearch}}
                                <ul id="view_elements">
                                </ul>
                                <ul id="toolbar_elements">
                                </ul>
                                <ul>
                                    <li class="utility_toolbar_element">
                                        <svg class="toolbar_icon top_help slipstream-top-help" data-ua-id="{{global_help_id}}" >
                                            <use href="#icon_help_utility"/>
                                        </svg>
                                    </li>
                                </ul>
                            </li>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </nav>
</div>

<div id="ss_navigation">
    <!-- Primary nav bar-->

    <div class="primary-nav-wrapper">
        <div id="primary-nav-icon-bar">
            
        </div>
        <div>
            <nav id="primary-nav-region"></nav>
        </div>
    </div>

    <!-- Left nav & main Content -->
    <div id="secondary-nav-region-wrapper">
        <div>
            <a class="menu-control-anchor" href="#secondary-nav-region">
                <span class="menu-control">
                    <svg class="pinned_icon">
                        <use href="#icon_pinned"/>
                    </svg>
                    <svg class="unpinned_icon">
                        <use href="#icon_unpinned"/>
                    </svg>
                </span>
            </a>
        </div>
       <div id="secondary-nav-region">
        </div>
        <!-- quicklinks -->
        <div id="quicklinks-region">
        </div>
    </div>
</div>

<div id="leftnav-maincontent-wrapper">
    <div class="right-pane"> 
        <div class="page-header"> 
            <div class="menu-control-anchor-container">
                <a class="menu-control-anchor" href="#secondary-nav-region"><div class="menu-control"></div></a>
            </div> 
            <div id="breadcrumb-region">
            </div>
            <div id="slipstream-content-header">
                <div id="slipstream-content-title-region"></div>
                <div id="slipstream-content-right-header-region"></div>
            </div>
        </div>
        <div>
            <div id="main_content"></div>
        </div>
    </div>
</div>

<!-- Overlay content-->
<div id="overlay_content"></div>