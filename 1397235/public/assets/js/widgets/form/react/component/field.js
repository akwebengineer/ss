/**
 * A stateful React component that creates a field in a form. It is composed by Label, Control, Validation and InlineHelp components.
 * The value of the properties are passed to children using React context.
 *
 * @module Field
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/form/react/lib/util'
], function (React, Util) {

    const FieldContext = React.createContext();

    class Field extends React.Component {
        render() {
            let {children, ...fieldProps} = this.props;
            return (
                <div className="row">
                    <FieldContext.Provider value={fieldProps}>
                        {Util.getComponentsByName(children, "FieldLabel")}
                        {Util.getComponentsByName(children, "FieldControl")}
                        <span className="field-end left">
                            {Util.getComponentsNotInName(children, ["FieldLabel", "FieldControl"])}
                        </span>
                    </FieldContext.Provider>
                </div>
            )
        }
    }

    Field.displayName = "Field";

    Field.Label = (props) => {
        const {children} = props;
        return (
            <div className="elementlabel left">
                <FieldContext.Consumer>
                    {fieldContext => (
                        <React.Fragment>
                            <label
                                htmlFor={fieldContext.id}
                                className={`left inline${fieldContext.required ? " required" : ""}`}
                            >
                                {Util.getComponentsNotInName(children, "Help")}
                            </label>
                            {fieldContext.required && <span className="requiredsign">*</span>}
                        </React.Fragment>
                    )}
                </FieldContext.Consumer>
                {Util.getComponentsByName(children, "Help")}
            </div>
        )
    };
    Field.Label.displayName = "FieldLabel";

    Field.Control = (props) => {
        const {children, ...fieldProps} = props,
            pattern = Util.getPropertyComponentsByName(children, "FieldValidation", "pattern"),
            patternmessages = Util.getPropertyComponentsAndChildrenByName(children, "FieldValidation", "pattern");
        return (
            <div className="elementinput left">
                <FieldContext.Consumer>
                    {fieldContext => (
                        <React.Fragment>
                            {Util.getComponentsNotInName(children, ["FieldValidation", "FieldInlineHelp"], {pattern, patternmessages, ...fieldContext, ...fieldProps})}
                            {Util.getComponentsByName(children, "FieldValidation")}
                            {Util.getComponentsByName(children, "FieldInlineHelp")}
                        </React.Fragment>
                    )}
                </FieldContext.Consumer>
            </div>
        )
    };
    Field.Control.displayName = "FieldControl";

    Field.Validation = (props) => {
        return (
            <small className="error errorimage">
                <svg>
                    <use href="#icon_error"></use>
                </svg>
                <span>{props.children}</span>
            </small>
        )
    };
    Field.Validation.displayName = "FieldValidation";

    Field.InlineHelp = (props) => {
        return (
            <span className="inline-help help-style">
                {props.children}
            </span>
        )
    };
    Field.InlineHelp.displayName = "FieldInlineHelp";

    return Field;

});