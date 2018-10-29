/**
 * A module that builds a Form React component
 * The configuration is included as a part of the Form element properties and the container is the same where the element is added
 *
 * @module Form
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'prop-types',
    'es6!widgets/form/react/component/header',
    'es6!widgets/form/react/component/section',
    'es6!widgets/form/react/component/field',
    'es6!widgets/form/react/component/control/input',
    'es6!widgets/form/react/component/control/checkbox',
    'es6!widgets/form/react/component/control/radio',
    'es6!widgets/form/react/component/footer',
    'es6!widgets/form/react/component/common/button',
    'es6!widgets/form/react/component/common/link',
    'es6!widgets/form/react/lib/util',
    'widgets/form/formValidator',
    'widgets/form/formWidget'
], function (React, PropTypes, Header, Section, Field, Input, Checkbox, Radio, Footer, Button, Link, Util, FormValidator) {

    class Form extends React.Component {

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            new FormValidator().validateForm($(this.el));
        }

        componentDidUpdate(prevProps) {
            //todo: update based on form changes
        }

        componentWillUnmount() {
            //todo: clean-up Form component
        }

        render() {
            const {children, validation, ...formProps} = this.props;
            return (
                <form className="form-component form-pattern validate" {...this.getValidationTimeout(validation)}
                      ref={el => this.el = el}>
                    {Util.getComponentsByName(children, "Header")}
                    {Util.getComponentsByName(children, "Section")}
                    {Util.getComponentsByName(children, "Footer")}
                </form>
            );
        }

        getValidationTimeout(validation) {
            var validationTimeout = {};
            for (var key in validation) {
                validationTimeout["data-" + key] = validation[key];
            }
            return validationTimeout;
        }

    }

    Form.propTypes = {
        error: PropTypes.number,
        valid: PropTypes.number,
        remote_error: PropTypes.number
    };

    return {Form, Header, Section, Field, Input, Checkbox, Radio, Footer, Button, Link}

});