# Form React Component


## Introduction
The form widget is a reusable graphical user interface that renders a form with one or multiple form controls that allows to to collect information from a user in order to complete some action, such as creating or editing an object, or setting configuration parameters.
The form can be added to a container programmatically or as a component. The current document describes how to add a form as a React component. To add a form programmatically, refer to [Form Widget](public/assets/js/widgets/form/formWidget.md)


## API
The form React component gets its configuration from the Form properties. It has three mains components: Header, Section, and Footer. Each of these components can include other components or html markup. Once the component is rendered, it could be modified by updates on its state and properties.


## Properties
The Form React component has the following properties:

```javascript
<Form
    validation = <(optional) Object, defines the milliseconds that the form will wait until a field validation is triggered. If it is not defined, a field will be validated after 500 milliseconds if it is client side validation and 1000 millisecond if it is remote validation>
>
```


## Form Components
The Form is a composable React component that could include the following components: Header, Section and Footer

For example:

```
<Form>
    <Header>
        {/*  Include Header component content */}
    </Header>
    <Section>
        {/*  Include Section component content */}
    </Section>
    <Footer>
        {/*  Include Footer component content */}
    </Footer>
</Form>
```


### Header
Defines the title and error or info messages related all the form and it will be shown at the beginning of the form. Header component include 3 components: Header.Title, Header.Info and Header.Error.

For example:

```
<Form>
    <Header>
         <Header.Title>
            Sample Form <b>Component</b>
        </Header.Title>
        <Header.Info>
            Info message: This device is being used by <i>root</i>. Please, refrain from using it.
        </Header.Info>
        <Header.Error>
            Error <i>message</i>. Please, update fields on red.
        </Header.Error>
    </Header>
    <Section>
        {/*  Include Section component content */}
    </Section>
    <Footer>
        {/*  Include Footer component content */}
    </Footer>
</Form>
```

#### Header.Title
Defines the title of the form.

#### Header.Info
Defines an info box that can inform user of relevant information related to the whole form.

#### Header.Error
Defines an error box that can inform user of relevant errors related to the whole form; for example, when the form is submitted and backend returns an error.


### Section
Defines a group of form fields that will be shown between the header and the footer of the form. Section component include 2 components: Section.Title and Section.Description which will be rendered at the top of the section. The section content should be defined using the Field component which will define a form label, fields, validation, inline help, etc for each field.

For example:

```
<Form>
    <Header>
         {/*  Include header component content */}
    </Header>
    <Section>
        <Section.Title>
            Section Title Sample
        </Section.Title>
        <Section.Description>
            Description sample of the section
        </Section.Description>
        <Field>
            {/*  Include Field component content */}
        </Field>
    </Section>
    <Footer>
        {/*  Include footer component children */}
    </Footer>
</Form>
```

#### Section.Title
Defines the title of the section. It is rendered at the top of the section.

#### Section.Description
Defines the description of the section. It is rendered at the top of the section but below the Section.Title if available.


### Field
Defines the form fields that a form will include. Field includes two components: Field.Label and Field.Control. Other components can be added after Field.Control and will be rendered next to it.

For Example:

```
<Form>
    <Header>
         {/*  Include header component content */}
    </Header>
    <Section>
       {/*  Optionally, include title and description of the section */}
        <Field
            required={true}>
            <Field.Label>
                Input Simple Validation
            </Field.Label>
            <Field.Control>
                <Input
                    id="text_url"
                    name="text_url"
                    placeholder="321"
                />
                <Field.Validation pattern="url">Please enter a valid URL</Field.Validation>
                <Field.InlineHelp>Inline help for simple validation</Field.InlineHelp>
            </Field.Control>
        </Field>
    </Section>
    <Footer>
        {/*  Include footer component children */}
    </Footer>
</Form>
```

#### Field.Label
Defines the label for the form field. It is rendered before the form field by default.

#### Field.Control
Defines the control of the field; for example, it could include the Input, Checkbox, Radio components of the Form or some other Slipstream component like the Slider, DatePicker, Time, Timezone, etc.

#### Field.Validation
Defines the validation pattern that a form field should include; for example: url.

#### Field.InlineHelp
Defines the inline help for a form field. It is shown below the field.


### Footer
Defines the footer that will be shown at the end of the form. It include two components: Footer.Action and Footer.Info.

For example:

```
<Form>
    <Header>
        {/*  Include Header component content */}
    </Header>
    <Section>
        {/*  Include Section component content */}
    </Section>
    <Footer>
        <Footer.Action>
            <Button
                id="get_value"
                name="get_value"
                value="Get Value"
            />
        </Footer.Action>
        <Footer.Info>
            <Link
                className="row_copy"
                href="/assets/js/widgets/form/tests/testForm.html#copy"
                target="_blank"
            >
                Form with rows that can be copied
            </Link>
        </Footer.Info>
    </Footer>
</Form>
```

#### Footer.Action
Defines the area at the bottom of the form where the submit buttons will be added.

#### Footer.Info
Defines the information (or links) that will be shown after the submit bar area, below Footer.Action and at the end of the form.


### Button
Defines a button using Slipstream style and that can be used in the context of a form. It will show the primary button style by default unless isSecondary property is added with the true value.

For example:

```
<Form>
    <Header>
        {/*  Include Header component content */}
    </Header>
    <Section>
        {/*  Include Section component content */}
    </Section>
    <Footer>
        <Footer.Action>
            <Button
                id="get_value"
                name="get_value"
                value="Get Value"
            />
        </Footer.Action>
    </Footer>
</Form>
```


### Link
Defines a link using Slipstream style and that can be used in the context of a form.

For example:

```
<Form>
    <Header>
        {/*  Include Header component content */}
    </Header>
    <Section>
        {/*  Include Section component content */}
    </Section>
    <Footer>
        <Footer.Info>
            <Link
                className="row_copy"
                href="/assets/js/widgets/form/tests/testForm.html#copy"
                target="_blank"
            >
                Form with rows that can be copied
            </Link>
        </Footer.Info>
    </Footer>
</Form>
```


## Form Component Properties

### validation
Object that defines the time in milliseconds required before validation triggers. It could include the err-timeout, valid-timeout and remote-timeout properties.
 - *err-timeout*: time in milliseconds before a validation triggers for all fields except remote fields and in the case of incorrect values in fields.
 - *valid-timeout*: time in milliseconds before a validation triggers for all fields except remote fields and in the case of correct values in fields.
 - *remote-timeout*: time in milliseconds before a remote validation triggers for all fields except local fields and in the case of incorrect values in fields.


## Usage
To include a Form component, include Header, one or many Section and/or Footer then render it using React standard methods. For example:

```javascript
    <Form
        validation={{
            "err-timeout": 1000,
            "valid-timeout": 5000,
            "remote-timeout": 1500
        }}
    >
        <FormHandle value={25}/>
    </Form>
```

The following example shows how the form component can be used in the context of a React application:

```javascript
   define([
       'react',
       'es6!widgets/form/react/form',
       'es6!widgets/slider/react/slider'
   ], function (React, FormComponent, SliderComponent) {

       const {Form, Header, Section, Field, Input, Checkbox, Radio, Footer, Button, Link} = FormComponent,
           {Slider, SliderHandle} = SliderComponent;

       class FormApp extends React.Component {

           constructor(props) {
               super(props);
               this.state = {
                   validation: {
                        "err-timeout": 1000,
                        "valid-timeout": 5000,
                        "remote-timeout": 1500
                   }
               };
           }

           render() {
               return (
                   <div className="form-widget-test">
                       <Form {...this.state.timeout}>
                           <Header>
                               <Header.Title>
                                   Sample Form <b>Component</b>
                               </Header.Title>
                               <Header.Info className="test_title_info">
                                   Updated: This device is being used by <i>root</i>. Please, refrain from using it.
                               </Header.Info>
                               <Header.Error className="test_title_error">
                                   Error <i>message</i>. Please, update fields on red.
                               </Header.Error>
                           </Header>
                           <Section className="section_class1" disclosure="expanded">
                               <Section.Title>
                                   Widget Integration
                               </Section.Title>
                               <Section.Description>
                                   Integration with other form elements.
                               </Section.Description>
                               <Field
                                   id="slider_1"
                                   name="slider_1"
                               >
                                   <Field.Label>
                                       Slider
                                   </Field.Label>
                                   <Field.Control>
                                       <Slider
                                           scale={{range: {min: 0, max: 10}}}
                                       >
                                           <SliderHandle value={5}/>
                                           <SliderHandle value={8}/>
                                       </Slider>
                                   </Field.Control>
                               </Field>
                           </Section>
                           <Section>
                               <Section.Title>
                                   Default Fields
                               </Section.Title>
                               <Section.Description>
                                   Default form fields like input, checkbox and radio button
                               </Section.Description>
                               <Field
                                   id="text_url"
                                   name="text_url"
                                   required={true}>
                                   <Field.Label>
                                       Input Simple Validation
                                   </Field.Label>
                                   <Field.Control>
                                       <Input
                                           placeholder="321"
                                       />
                                       <Field.Validation pattern="url">Please enter a valid URL</Field.Validation>
                                       <Field.InlineHelp>Inline help for simple validation</Field.InlineHelp>
                                   </Field.Control>
                                    <Button
                                          className="inline_button_1"
                                          value="Inline Button"
                                          type="button"
                                          isSecondary={true}
                                    />
                               </Field>
                           </Section>
                           <Footer>
                               <Footer.Action>
                                   <Button
                                       id="get_isvalid"
                                       name="get_isvalid"
                                       value="Is Valid"
                                       type="submit"
                                       isSecondary={false}
                                   />
                                   <Button
                                       id="get_value"
                                       name="get_value"
                                       value="Get Value"
                                   />
                               </Footer.Action>
                               <Footer.Info>
                                   <Link
                                       className="row_copy"
                                       href="/assets/js/widgets/form/tests/testForm.html#copy"
                                       target="_blank"
                                   >
                                       Form with rows that can be copied
                                   </Link>
                               </Footer.Info>
                           </Footer>
                       </Form>
                   </div>
               )
           }
       }

       return FormApp;

   });
```

To render the Form, use the standard React methods:

```
    ReactDOM.render(<FormApp/>, pageContainer); //where pageContainer represents where the Form will be rendered
```