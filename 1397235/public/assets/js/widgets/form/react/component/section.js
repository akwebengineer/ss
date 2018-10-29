/**
 * A stateful React component that creates a field in a form. It is composed by Title and Description components.
 *
 * @module Section
 * @author Miriam Hadfield <mhadfield@juniper.net>
 * @copyright Juniper Networks, Inc. 2018
 */
define([
    'react',
    'es6!widgets/form/react/lib/util'
], function (React, Util) {

    class Section extends React.Component {
        render() {
            const {children, disclosure} = this.props;
            return (
                <div className={`form_section ${this.props.className}`}>
                    {Util.getComponentsByName(children, "SectionTitle", {disclosure})}
                    <div
                        className={this.props.disclosure ? `progressive_disclosure_content ${this.props.disclosure}` : ""}
                    >
                        {Util.getComponentsByName(children, "SectionDescription", {disclosure})}
                        <div className="section_content">
                            {Util.getComponentsByName(children, "Field", {disclosure})}
                        </div>
                    </div>
                </div>
            )
        }
    }

    Section.displayName = "Section";

    Section.Title = (props) => {
        return (
            <div className="section_title">
                {
                    props.disclosure &&
                    <svg className={`progressive_disclosure ${props.disclosure}`}>
                        <use href="#icon_nav_big_arrow_down"></use>
                    </svg>
                }
                <h5>{props.children}</h5>
            </div>
        );
    };
    Section.Title.displayName = "SectionTitle";

    Section.Description = (props) => {
        return (
            <div className="section_description">
                <h6>{props.children}</h6>
            </div>
        );
    };
    Section.Description.displayName = "SectionDescription";

    return Section;

});