# Notification

Notifications are non-persistent messages that can be used to notify a user of an event.  They are displayed prominently in the user interface and will either dismiss themselves or can be explicitly dismissed by a user.  

Notifications are useful for making users aware of an asynchronous event or the status of a long-running background operation.

## Methods

- #### SDK.Notification()
Construct a notification.

- #### SDK.Notification.prototype.setText(text)
Set the text to be rendered in the notification.

   #### Parameters

   - **text**
      
      The text to be included in the notification.  This can be plain text, HTML or a [view](Views.md).

        
        
- #### SDK.Notification.prototype.setType(type)
Set the type of the notification.

   #### Parameters
  
   - **type**
      
      The desired type of the notification.  Allowed values are:
        - "error"
        - "info"
        - "success"
        - "warning"


- #### SDK.Notification.prototype.notify(timeout)
Send the notification.  

  Calling this method will cause the notification to be displayed in the Slipstream notification area.

   #### Parameters
  
   - **timeout**

   The length of time (in milliseconds) that the notification should be displayed.  Setting this to 0 will cause the notifaction to be displayed until a user interacts with it (eg. by clicking a link within it).

Note: All of the above methods return an instance of the notification object so that the methods can be chained.
        
## Example

```javascript
new Slipstream.SDK.Notification()
    .setText("User fred_flintstone has logged in.")
    .setType("info")
    .notify();
```
