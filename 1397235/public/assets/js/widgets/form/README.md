# Form

The form is a reusable graphical user interface that renders a form which can be used to collect information from a user in order to complete some action, such as creating or editing an object, or setting configuration parameters. It is configurable; for example, it could define the title, sections with input fields or other integrated widgets and footer. The form can be added to a container programmatically (widget) or as a component (React).


## Widget
The form is added to a container by creating an *instance* of the form widget and then building it. During the instantiation, all the options required to configure the widget should be passed, including the container where the form will be built. For example, to add the form in the testContainer container:

```javascript
    new FormWidget({
       "elements": formConfElements,
        "values": formConfValues,
        "container": formContainer
    }).build();
```

Any update required after the form is built can be done using the methods exposed by the widget.

More details can be found at [Form Widget](public/assets/js/widgets/form/formWidget.md)


## React
The form can be rendered using the Form *component* and the FormHandle component (its children) and configured using a set of properties. For example, to include the form, add the components:

```javascript
   <Form {...timeout}>
       <Header>
           <Header.Title>
               Sample Form Component
           </Header.Title>
           <Header.Error className="test_title_error">
               Error <i>message</i>. Please, update fields on red.
           </Header.Error>
       </Header>
       <Section className="section_class1" disclosure="expanded">
           <Section.Title>
               Widget Integration
           </Section.Title>
           <Section.Description>
               Integration with other form elements or components.
           </Section.Description>
           <Field
               id="numberStepper_1"
               name="numberStepper_1"
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
                   {/*/<Help></Help>*!/*/}
               </Field.Label>
               <Field.Control>
                   <Input
                       placeholder="321"
                   />
                   <Field.Validation pattern="url">Please enter a valid URL</Field.Validation>
                   <Field.InlineHelp>Inline help for simple validation</Field.InlineHelp>
               </Field.Control>
           </Field>
       </Section>
       <Footer>
           <Footer.Action
               alignedRight={true}
               unlabeled={true}
               className="buttons_row"
           >
               <Link
                   id="cancel_form"
               >
                   Cancel
               </Link>
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

and then render and update its state using standard React methods.

More details can be found at [Form React Component](public/assets/js/widgets/form/react/form.md)