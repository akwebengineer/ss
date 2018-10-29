#  Theming Slipstream
The appearance of a Slipstream-based UI can be customized by creating a *theme*.  A Slipstream theme consists of a set of SASS variables and their values, each variable controlling the appearance of a particular Slipstream UI element.

Supported variables are as follows:

| Variable | Description |
|------------|-----------------|
| $body-font-family | The font family for the UI |
| $primary-nav-background-color | The background color for the primary navigation panel|
| $primary-nav-active-background-color | The background color for the active element in the primary navigation panel|
| $primary-nav-icon-color | The color of the icons in the primary navigation panel |
| $prmary-nav-hover-background-color | The background color displayed when hovering over an element in the primary navigation panel |
| $secondary-nav-background-color | The background color of the secondary navigation panel |
| $secondary-nav-node-selected-color | The color of the selected element in the secondary navigation panel |
| $secondary-nav-node-color | The color of unselected elements in the secondary navigation panel |
| $logo-image | The image descriptor for the primary logo displayed in the utility toolbar |
| $logo-image-width | The width of the primary logo image |
| $logo-image-height | The height of the primary logo image |
| $small-logo-image | The image descriptor for the small logo at the top left of the utility toolbar |
| $login-background | The descriptor for the background image. Login background can be an image or a color gradient; therefore this variable can't be used in combination with $login-background-from-color and $login-background-to-color variables. |
| $login-background-from-color | The starting color for the login background gradient. Login background can be an image or a color gradient; therefore this variable can't be used in combination with $login-background variable. |
| $login-background-to-color | The ending color for the login background gradient. Login background can be an image or a color gradient; therefore this variable can't be used in combination with $login-background variable. |
| $login-logo-image | The image descriptor for the logo displayed on the login page |
| $login-logo-image-width | The width of the logo on the login page |
| $login-logo-image-height | The height of the logo on the login page |
| $tab-navigation-active-color | The color of the label used for the active tab in a navigation-style tab container |
| $tab-navigation-marker-color | The color of the border for the active tab in a navigation-style tab container |
| $tab-active-border-top-color | The color of the border for the active tab in a tab container |
| $action-icon-color | The color of the action icons |
| $action-icon-hover | The hover color of the action icons |
| $top-bar-bg-color | The background color of the utility navigation bar |
| $top-bar-icon-color | The color of the icons in the utilitly navigation bar |
| $primary-button-color | The background color of the primary button in its default state |
| $primary-button-hover-color | The second background color of the primary button that shows up in the gradient along with the default one on hover |
| $secondary-button-color | The background color of the secondary button in its default state |
| $secondary-button-hover-color | The background color of the secondary button in hover state |
| $secondary-button-font-color | The font color of the secondary button |
| $secondary-button-border-color | The default border color of the secondary button |
| $secondary-button-hover-border-color | The hover border color of the secondary button |

**Example**

*theme.scss*

```
// DOCUMENT
$body-font-family: "Arial", "Helvetica Neue", "Helvetica", "sans-serif";

// NAVIGATION
$primary-nav-background-color: red;
$primary-nav-active-background-color: red;
$primary-nav-hover-background-color: blue;
$secondary-nav-background-color: green;
$secondary-nav-node-selected-color: $primary-nav-background-color;

// LOGO
$logo-image: url(/assets/images/icon_logoSD.svg);
$logo-image-width: 144px;
$logo-image-height: 24px;
$small-logo-image: url(/assets/images/vodafone.png);

// LOGIN
$login-background: url(/assets/images/login_bckgrnd_image.png);
$login-logo-image: url(/assets/images/icon_juniper_logo_white.svg);
$login-logo-image-width: 144px;
$login-logo-image-height: 63px;
$login-background-from-color: #445566;
$login-background-to-color: #112233;

//TABS
$tab-navigation-active-color: red;
$tab-active-border-top-color: red;
$tab-navigation-marker-color: red;

//ICONS
$action-icon-color: red;
$action-icon-hover: green;

//TOP BAR
$top-bar-bg-color: yellow;
$top-bar-icon-color: green;

//PRIMARY BUTTONS
$primary-button-color: #e60000;
$primary-button-hover-color: green;

//SECONDARY BUTTON
$secondary-button-color: grey;
$secondary-button-hover-color: black;
$secondary-button-font-color: yellow;
$secondary-button-border-color: blue;
$secondary-button-hover-border-color: green;

```

Themes are defined in the *public/assets/themes* directory in a Slipstream installation.  Subdirectories of this directory define individual themes.  Each theme directory contains a *css* directory and an *images* directory.  The *css* directory contains a file named *theme.scss*  that defines the customized SASS variables for the theme.   The *images* directory contains any customized images required by the theme.  The *css* directory should also contain a file named *app.scss* that imports the theme file and the base *app.scss* file (located in *public/assets/css*) defined by the framework.

```
public
   |
   +-- assets
             |
             +-- css
                     |
                     +-- app.scss     <-- Base framework SASS file
                     +-- app.css      <-- Compiled base framework CSS file
             +-- themes
                       |
                       +-- custom_theme_name
                                       |
                                       +-- css
                                               |
                                               +-- app.scss      <-- Theme's SASS file
                                               +-  theme.scss    <-- Theme's custom SASS variables
                                       +-- images

```

**app.scss**:

```
/* import the custom SASS variables defining the theme */
@import "theme";

/* import the base framework SASS file */
@import "../../../css/app";
```

Compiling a theme's *app.scss* file in the theme's directory will create the CSS definitions for the theme.  The output of the compilation step must be stored in a file called *app.css* in the theme's *css* directory.

## Choosing a Theme
If a custom theme is not provided, Slipstream renders the UI using the default theme.  A custom theme can be selected by setting the *theme* configuration option in the *public/assets/js/conf/global_config.js* file:

```json
{
   ...
    theme: "custom_theme_name"
   ...
}
```

The theme can be changed dynamically by specifying the *theme* query parameter in the URL used to load the UI:

*https://localhost?theme=custom_theme*

The theme specified via the query parameter takes precedence over the theme specified in the *global_config.js* file.