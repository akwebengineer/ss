#  Feedback 

Slipstream provides feedback plugin that will render email content template.


## Configruation

Configure the feedback setting in the global_config.js

```javascript
{
	...
	product_name: "product_name",
    product_version: "product_version",
    device_model: 'device_model',
    ...
    feedback: {
        email: 'supports@juniper.net', //receiver's email 
        custom_content: 'Custom Content: custom message' //add custom content in the email
    }
}
```

## Template

Email template is located under conf/templates. This template can be overwritten in order to create an customized email content. The template includes a common set of replacement variables that could be used in the template.

**product_name** 
The product name that is defined in the global configuration

**product_version**
The product version that is defined in the global configuration

**device_model**
The device model that is defined in the global configuration

**browser_version**
The broswer version that the user is currently using

**platform**
The platform that the user is currently using

**screen_resolution**
The screen size of the broswer 

**custom_content**
Any custom content can be added here

**timestamp**
The timestamp when the email is generated

