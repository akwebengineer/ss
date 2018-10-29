#  Login 

Slipstream provides a way to generate a custom login view.


## Configruation

Configure the login setting in the global_config.js

```javascript
{
	...
	login :{
        view: "widgets/login/tests/view/customLoginView" //Path of the custom login view
    },
    ...
}
```

## View

The view should be a [Slipstream view](docs/Views.md)

### Parameters

- **context**
The activity's [runtime context](ActivityContext.md).

- **submitCredentials**
A function that can be trigged once the form is valid to submit.

submitCredential has the parameters:
- username: user provided in the login form
- password: password provided in the login form
- onSubmitCredentials: function callback that gives a feedback with the response of the user authentication. It's execution is **required** and it has the parameter success. If the success parameter is set to false, it will show an error message at the top of the login box; otherwise, the application homepage will be showed.

### Method

- **render**
A view requires a render method to generate.

- **close**
A view requires a close method to destroy the custom login view after authentication is succeeded.
