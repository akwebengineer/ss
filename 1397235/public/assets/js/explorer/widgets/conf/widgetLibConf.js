define([], function () {

    var widgetConfiguration = {};

    widgetConfiguration.lib = {
        "Widgetlist" : [
            {
                "id":"bar",
                "name":"Bar Chart",
                "desc":"A bar chart is a graph containing rectangular bars with lengths proportional to the values that they represent.",
            },
            {
                "id":"carousel",
                "name":"Carousel",
                "desc":"The Carousel widget is a reusable graphical user interface that allows users to show multiple views in a carousel format.",
            },
            {
                "id":"confirmation",
                "name":"Confirmation Dialog",
                "desc":"A confirmation dialog widget is an overlay thatprovides a uniform way to present Yes/No kind of confirmation dialogs.",
            },
            {
                "id":"contextMenu",
                "name":"Context Menu",
                "desc":"The ContextMenu widget is a reusable UI that allows users to add a custom right click menu or a click menu to any HTML element or selected container.",
            },
            {
                "id":"dashboard",
                "name":"Dashboard",
                "desc":"The Slipstream framework provides a programming construct for plugin developers to display their individual dashboard widgets.",
            },
            {
                "id":"date",
                "name":"Date Picker",
                "desc":"A date picker provides interactive interface to pick date in an input field",
            },
            {
                "id":"donut",
                "name":"Donut Chart",
                "desc":"A donut chart is a graph that displays data as percentages of the whole, with categories represented by individual slices.",
            },
            {
                "id":"drop",
                "name":"Drop Down",
                "desc":"The DropDown widget is a reusable graphical user interface that allows users to show a searchable dropdown with simple or multiple selection in a container.",
            },
            {
                "id":"form",
                "name":"Form",
                "desc":"A form is a collection of UI elements used to collect information from a user in order to complete some action, such as creating or editing an object.",
            },
            {
                "id":"grid",
                "name":"Grid",
                "desc":"The Grid widget is a reusable UI element that allows users to get a grid or table from a configuration object that includes the url where the data will be extracted. ",
            },
            {
                "id":"ip",
                "name":"IP CIDR",
                "desc":"The IP CIDR widget is a reusable graphical user interface that allows users to get a set of IP address (version 4 or version 6), CIDR and subnet mask.",
            },
            {
                "id":"layout",
                "name":"Layout",
                "desc":"The Layout widget is a reusable graphical user interface that allows users to render a complex layout with multiple panels.",
            },
            {
                "id":"line",
                "name":"Line Chart",
                "desc":"The line chart is represented by a series of datapoints connected with a straight line and used to visualize data that changes over time.",
            },
            {
                "id":"list",
                "name":"List Builder",
                "desc":"The list builder widget is a reusable graphical user interface that allows users to select one or many items from a set of values.",
            },
            {
                "id":"login",
                "name":"Login",
                "desc":"The login widget is a reusable graphical user interface that allows a plugin to include a login view with a username/password pair.",
            },
            {
                "id":"map",
                "name":"Map",
                "desc":"The Map widget is a UI control that provides map-like behavior.",
            },
            {
                "id":"overlay",
                "name":"Overlay",
                "desc":"An overlay is a mini page in a layer on top of a page. It provides a way for the user to access additional information without leaving the current page .",
            },
            {
                "id":"progress",
                "name":"Progress Bar",
                "desc":"The progress bar widget is a reusable graphical interface that allows users to show the progress bar while loading a page or file.",
            },
            {
                "id":"scheduleRecurrence",
                "name":"Schedule Recurrence",
                "desc":"The schedule recurrence widget is a reusable graphical user interface that allows users to schedule a job optionally with recurrence.",
            },
            {
                "id":"search",
                "name":"Search",
                "desc":"The Search widget is a reusable graphical user interface that allows users to add a search container with tokens that represent the search criteria.",
            },
            {
                "id":"shortWizard",
                "name":"Short Wizard",
                "desc":"The Short Wizard is composed of a set of pages each of which represents a step in the wizard workflow.",
            },
            {
                "id":"spinner",
                "name":"Spinner",
                "desc":"The spinner widget is a reusable graphical interface that allows users to show the spinner while loading a page or file.",
            },
            {
                "id":"tabContainer",
                "name":"Tab Container",
                "desc":"The TabContainer widget is a reusable graphical user interface that allows users to break content into multiple sections that can be swapped to save space.",
            },
            {
                "id":"time",
                "name":"Time",
                "desc":"Slipstream's Time widget provides an input UI widget for any workflow which needs to show and interact time values.",
            },
            {
                "id":"timeRange",
                "name":"Time Range",
                "desc":"A time range widget is a graph to allow selection of time range for viewing a certain subset of the available data.",
            },
            {
                "id":"timesc",
                "name":"TimeSeries Chart",
                "desc":"A time-series chart has multiple time lines  and  allows selection of time range for viewing a certain subset of the available data.",
            },
            {
                "id":"timez",
                "name":"Time Zone",
                "desc":"Slipstream's TimeZone widget provides an input UI widget for any workflow which want to show and interact various timezones.",
            },
            {
                "id":"tooltip",
                "name":"Tooltip",
                "desc":"The Tooltip widget is a reusable graphical user interface that allows users to show a tooltip in the selected container.",
            },
            {
                "id":"tree",
                "name":"Tree",
                "desc":"The tree widget is a reusable graphical interface that allows users to show data in a tree format.",
            }
        ]
    };
    widgetConfiguration.nav ={
        "navWidgetList" : [
                    {
                        "id":"side-bar",
                        "name":"Bar Chart"
                    },
                    {
                        "id":"side-carousel",
                        "name":"Carousel"
                    },
                    {
                        "id":"side-confirmation",
                        "name":"Confirmation Dialog"
                    },
                    {
                        "id":"side-contextMenu",
                        "name":"Context Menu"
                    },
                    {
                        "id":"side-dashboard",
                        "name":"Dashboard"
                    },
                    {
                        "id":"side-date",
                        "name":"Date Picker"
                    },
                    {
                        "id":"side-donut",
                        "name":"Donut Chart"
                    },
                    {
                        "id":"side-drop",
                        "name":"Drop Down"
                    },
                    {
                        "id":"side-form",
                        "name":"Form"
                    },
                    {
                        "id":"side-grid",
                        "name":"Grid"
                    },
                    {
                        "id":"side-ip",
                        "name":"IP CIDR"
                    },
                    {
                        "id":"side-layout",
                        "name":"Layout"
                    },
                    {
                        "id":"side-line",
                        "name":"Line Chart"
                    },
                    {
                        "id":"side-list",
                        "name":"List Builder"
                    },
                    {
                        "id":"side-login",
                        "name":"Login"
                    },
                    {
                        "id":"side-map",
                        "name":"Map"
                    },
                    {
                        "id":"side-overlay",
                        "name":"Overlay"
                    },
                    {
                        "id":"side-progress",
                        "name":"Progress Bar"
                    },
                    {
                        "id":"side-scheduleRecurrence",
                        "name":"Schedule Recurrence"
                    },
                    {
                        "id":"side-search",
                        "name":"Search"
                    },
                    {
                        "id":"side-shortWizard",
                        "name":"Short Wizard"
                    },
                    {
                        "id":"side-spinner",
                        "name":"Spinner"
                    },
                    {
                        "id":"side-tabContainer",
                        "name":"Tab Container"
                    },
                    {
                        "id":"side-time",
                        "name":"Time"
                    },
                    {
                        "id":"side-timeRange",
                        "name":"Time Range"
                    },
                    {
                        "id":"side-timesc",
                        "name":"Time Series Chart"
                    },
                    {
                        "id":"side-timez",
                        "name":"Time Zone"
                    },
                    {
                        "id":"side-tooltip",
                        "name":"Tooltip"
                    },
                    {
                        "id":"side-tree",
                        "name":"Tree"
                    }
                ]
    };

    return widgetConfiguration;

});