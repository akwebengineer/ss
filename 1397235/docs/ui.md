#  Slipstream.SDK.UI

Defines a set of methods for manipulating Slipstream-provided UI elements.

### Methods

#### Slipstream.SDK.UI.setSecondaryNavigationVisibility
Set the visibility of the secondary navigation pane.

#### Parameters
- **makeVisible** - A boolean indicating the desired state of the secondary navigation pane.  If *true* the pane will be made visible.  If *false* the pane will be hidden.

#### Slipstream.SDK.UI.getSecondaryNavigationVisibility
Get the visibility of the secondary navigation pane.

#### Parameters
None

#### Returns
*true* if the navigation pane is visible, *false* otherwise.

#### Slipstream.SDK.UI.getContentPane
Get the DOM element of the content pane.

#### Parameters
None

#### Slipstream.SDK.UI.getPrimaryActivity
Get the [activity](Activity.md) that has most recently rendered it's view to the UI main content pane.

#### Parameters
None

#### Returns
The activity that last rendered it's view to the UI main content pane.