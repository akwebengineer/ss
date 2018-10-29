/**
 * A view that uses the form component to generate a form
 *
 * @module FormApp
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/form/react/form',
    'es6!widgets/datepicker/react/datepicker',
    'es6!widgets/numberStepper/react/numberStepper',
    'es6!widgets/slider/react/slider',
    'es6!widgets/toggleButton/react/toggleButton',
    'es6!widgets/timeZone/react/timeZone',
], function (React, FormComponent, Datepicker, NumberStepper, SliderComponent, ToggleButton, TimeZone) {

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
                    <Form {...this.state}>
                        <Header>
                            <Header.Title>
                                Sample Form <b>Component</b>
                                {/*<Help></Help>*/}
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
                                Integration with other form elements like the IpCidr, DatePicker, Date, DateTime and
                                DropDown widgets.<br/> It also allows to show/hide the inline error for a form element
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
                            <Field
                                id="togglebutton_1"
                                name="togglebutton_1"
                            >
                                <Field.Label>
                                    Toggle button
                                </Field.Label>
                                <Field.Control>
                                    <ToggleButton
                                        on={true}
                                        inlineLabel={{
                                            "on": "Active",
                                            "off": "Inactive"
                                        }}
                                    />
                                </Field.Control>
                            </Field>
                            <Field
                                id="datepicker_1"
                                name="datepicker_1"
                            >
                                <Field.Label>
                                    Date picker
                                </Field.Label>
                                <Field.Control>
                                    <Datepicker
                                        value={new Date()}
                                        dateFormat="mm/dd/yyyy"
                                    />
                                    <Field.InlineHelp>Inline help for Datepicker</Field.InlineHelp>
                                </Field.Control>
                            </Field>
                            <Field
                                id="numberStepper_1"
                                name="numberStepper_1"
                            >
                                <Field.Label>
                                    Number stepper
                                </Field.Label>
                                <Field.Control>
                                    <NumberStepper
                                        min_value={-10}
                                        max_value={10}
                                        placeholder="Number Stepper with min-max"
                                    />
                                    <Field.InlineHelp>Inline help for NumberStepper</Field.InlineHelp>
                                </Field.Control>
                            </Field>
                            <Field
                                id="timezone_1"
                                name="timezone_1"
                            >
                                <Field.Label>
                                    Timezone
                                </Field.Label>
                                <Field.Control>
                                    <TimeZone/>
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
                            <Field
                                required={true}>
                                <Field.Label>
                                    Checkbox
                                </Field.Label>
                                <Field.Control
                                    name="test_checkbox"
                                >
                                    <Checkbox
                                        id="test_checkbox_option1"
                                        value="option1"
                                    >
                                        Option <b>1</b>
                                    </Checkbox>
                                    <Checkbox
                                        id="test_checkbox_option2"
                                        value="option2"
                                        checked={true}
                                    >
                                        Option <b>2</b>
                                    </Checkbox>
                                    <Checkbox
                                        value="option3"
                                        disabled={true}
                                    >
                                        Option <b>3</b>
                                    </Checkbox>
                                    <Field.Validation pattern="url">Please make a <b>selection</b></Field.Validation>
                                    <Field.InlineHelp>Inline help for checkboxes</Field.InlineHelp>
                                </Field.Control>
                            </Field>
                            <Field>
                                <Field.Label>
                                    Radio
                                </Field.Label>
                                <Field.Control
                                    name="test_radio"
                                >
                                    <Radio
                                        id="test_radio_option1"
                                        value="option1"
                                        disabled={true}
                                    >
                                        Option <b>1</b>
                                    </Radio>
                                    <Radio
                                        id="test_radio_option2"
                                        value="option2"
                                        checked={true}
                                    >
                                        Option <b>2</b>
                                    </Radio>
                                    <Radio
                                        value="option3"
                                    >
                                        Option <b>3</b>
                                    </Radio>
                                    <Field.Validation pattern="url">Please make a selection</Field.Validation>
                                    <Field.InlineHelp>Inline help for radio buttons</Field.InlineHelp>
                                </Field.Control>
                            </Field>
                            <Field
                                id="password_pattern"
                                name="password_pattern"
                                required={true}>
                                <Field.Label>
                                    Input Multiple Validation
                                </Field.Label>
                                <Field.Control>
                                    <Input
                                        placeholder="Sp0g-Sp0g"
                                    />
                                    <Field.Validation pattern="hasnumbersymbol">At least one number and one symbol is
                                        required</Field.Validation>
                                    <Field.Validation pattern="hasmixedcasenumber">A combination of mixed case letters
                                        and one number is required</Field.Validation>
                                    <Field.InlineHelp>Inline help for multiple validation</Field.InlineHelp>
                                </Field.Control>
                                <span>after field</span>
                                <Button
                                    className="inline_button_1"
                                    value="Inline Button"
                                    type="button"
                                    isSecondary={true}
                                />
                                <Button
                                    className="inline_button_2"
                                    value="Inline Button"
                                    type="button"
                                />
                                <Link
                                    className="inline_link_1"
                                >
                                    Inline Cancel 1
                                </Link>
                                <Link
                                    className="inline_link_2"
                                >
                                    Inline Cancel 2
                                </Link>
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
                                    id="add_section"
                                    name="add_section"
                                    value="Add Section on Id"
                                    type="button"
                                    isSecondary={true}
                                />
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
                                <Link
                                    className="row_copy"
                                    href="/assets/js/widgets/form/tests/testForm.html#declarative"
                                    target="_blank"
                                >
                                    Declarative form
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