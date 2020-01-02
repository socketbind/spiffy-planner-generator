import "regenerator-runtime/runtime";

import { SVG, Element, extend, Text } from '@svgdotjs/svg.js'
import FileSaver from 'file-saver';

import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {
    Card,
    Navbar,
    Alignment,
    H1,
    H2,
    Label,
    FormGroup,
    NumericInput,
    Button,
    Menu,
    MenuItem,
    Popover
} from "@blueprintjs/core";
import {Select} from "@blueprintjs/select";
import {SketchPicker} from 'react-color';

const AVAILABLE_FONTS = ['Archivo Black',
    'Bangers',
    'Calistoga',
    'Caveat',
    'Cinzel',
    'Concert One',
    'Cookie',
    'Courgette',
    'Dancing Script',
    'Fredoka One',
    'Gelasio',
    'Girassol',
    'Indie Flower',
    'Josefin Sans',
    'Kalam',
    'Kaushan Script',
    'Lobster Two',
    'Lobster',
    'Ma Shan Zheng',
    'Oswald',
    'Pacifico',
    'Permanent Marker',
    'Righteous',
    'Roboto',
    'Sacramento',
    'Satisfy',
    'Shadows Into Light',
    'Solway',
    'Special Elite',
    'Stoke'
];

extend(Element, {
    do: function (fn, ...args) {
        fn.call(this, ...args);
        return this;
    },
    absx: function(x) {
        this.attr({ x });
        return this;
    },
    absmove: function(x, y) {
        this.attr({ x, y });
        return this;
    }
});

class FontChooser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {font: props.initialFont || props.fonts[0]};
    }

    render() {
        return (
            <Select id={this.props.id}
                    activeItem={this.state.font}
                    items={this.props.fonts}
                    itemRenderer={(value, {handleClick, modifiers}) => {
                        if (!modifiers.matchesPredicate) {
                            return null;
                        }
                        return (<MenuItem
                            active={modifiers.active}
                            key={value}
                            label={value}
                            onClick={handleClick}
                            text={<div style={{fontFamily: value}}>{value}</div>}
                        />)
                    }}
                    onItemSelect={(item) => {
                        this.setState({font: item});
                        this.props.onFontSelected && this.props.onFontSelected(item);
                    }}>
                <Button text={<div style={{fontFamily: this.state.font}}>{this.state.font}</div>}
                        rightIcon="double-caret-vertical"/>
            </Select>
        )
    }

}

class ColorChooser extends React.Component {

    constructor(props) {
        super(props)

        this.state = {color: props.initialColor || '#333'}
    }

    render() {
        return (
            <Popover id={this.props.id}>
                <Button text={<Fragment><span>{this.state.color}</span><span className="color-square" style={{backgroundColor: this.state.color}}></span></Fragment>}/>
                <SketchPicker color={this.state.color} onChange={(color) => {
                    this.setState({color: color.hex});
                    this.props.onColorChanged && this.props.onColorChanged(color.hex);
                }}/>
            </Popover>
        )
    }

}

class MonthChooser extends React.Component {

    constructor(props) {
        super(props)

        this.months = [];

        const date = new Date();
        for (let i = 0; i < 12; i++) {
            date.setMonth(i);
            this.months.push(
                {
                    ordinal: i + 1,
                    name: date.toLocaleDateString(window.navigator.language, { month: 'long' })
                }
            );
        }

        this.state = { month: (props.initialMonth && this.months.find(item => item.ordinal === props.initialMonth)) || this.months[0] };
    }

    render() {
        return (
            <Select id={this.props.id}
                    activeItem={this.state.month}
                    items={this.months}
                    itemRenderer={(month, {handleClick, modifiers}) => {
                        if (!modifiers.matchesPredicate) {
                            return null;
                        }
                        return (<MenuItem
                            active={modifiers.active}
                            key={month.ordinal}
                            onClick={handleClick}
                            text={month.name}
                        />)
                    }}
                    onItemSelect={(item) => {
                        this.setState({month: item});
                        this.props.onMonthChanged && this.props.onMonthChanged(item.ordinal);
                    }}>
                <Button text={this.state.month.name}
                        rightIcon="double-caret-vertical"/>
            </Select>
        )
    }

}

class CalendarOptions extends React.Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({}, props.params || {});
    }

    handleValueChange(propName, value) {
        const newState = { ...this.state };
        newState[propName] = value;
        this.setState(newState);
        this.props.onParametersChanged && this.props.onParametersChanged(newState);
    }

    handleValueChanges(values) {
        const newState = { ...this.state, ...values };
        this.setState(newState);
        this.props.onParametersChanged && this.props.onParametersChanged(newState);
    }

    render() {
        return (
            <Card interactive={false}>
                <section className="options-form">
                    <Label>General</Label>

                    <FormGroup
                        label="Year"
                        labelFor="general-year"
                        inline={true}
                    >
                        <NumericInput
                            id="general-year"
                            value={this.state.year}
                            onValueChange={ (year, _) => this.handleValueChange('year', year) }
                            placeholder="Enter a year..."/>
                    </FormGroup>

                    <FormGroup
                        label="Month"
                        labelFor="general-month"
                        inline={true}
                    >
                        <MonthChooser
                            id="general-month"
                            initialMonth={this.state.month}
                            onMonthChanged={(month) => this.handleValueChange('month', month)}
                        />
                    </FormGroup>

                    <H2>Page setup</H2>

                    <FormGroup
                        label="Preset"
                        labelFor="page-setup-presets"
                        inline={true}
                    >
                        <Select id="page-setup-presets"
                                items={[
                                    {name: 'A5', width: 148, height: 210},
                                    {name: 'A4', width: 210, height: 297},
                                    {name: 'A3', width: 297, height: 420},
                                    {name: 'A2', width: 420, height: 594}
                                ]}
                                itemRenderer={(value, {handleClick, modifiers}) => {
                                    if (!modifiers.matchesPredicate) {
                                        return null;
                                    }
                                    return (<MenuItem
                                        active={modifiers.active}
                                        key={value.name}
                                        text={value.name}
                                        onClick={handleClick}
                                        label={`${value.width}x${value.height}mm`}
                                    />)
                                }}
                                onItemSelect={item => this.handleValueChanges({ pageWidth: item.width, pageHeight: item.height })}>
                            <Button text="Use preset..."
                                    rightIcon="double-caret-vertical"/>
                        </Select>
                    </FormGroup>

                    <FormGroup
                        label="Width"
                        labelFor="page-setup-width"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="page-setup-width"
                            value={this.state.pageWidth}
                            onValueChange={ (pageWidth, _) => this.handleValueChange('pageWidth', pageWidth) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Height"
                        labelFor="page-setup-height"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="page-setup-height"
                            value={this.state.pageHeight}
                            onValueChange={ (pageHeight, _) => this.handleValueChange('pageHeight', pageHeight) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H2>Typography</H2>

                    <FormGroup
                        label="Month font"
                        labelFor="typography-month-font"
                        inline={true}
                    >
                        <FontChooser
                            id="typography-month-font"
                            fonts={AVAILABLE_FONTS}
                            onFontSelected={ (monthFontFamily) => this.handleValueChange('monthFontFamily', monthFontFamily) }
                            initialFont={this.state.monthFontFamily}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Month font size"
                        labelFor="typography-month-font-size"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="typography-month-font-size"
                            value={this.state.monthFontSize}
                            onValueChange={ (monthFontSize, _) => this.handleValueChange('monthFontSize', monthFontSize) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Month font color"
                        labelFor="typography-month-font-color"
                        inline={true}
                    >
                        <ColorChooser
                            id="typography-month-font-color"
                            initialColor={this.state.monthFontColor}
                            onColorChanged={(monthFontColor) => this.handleValueChange('monthFontColor', monthFontColor)}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Header font size"
                        labelFor="typography-header-font-size"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="typography-header-font-size"
                            value={this.state.headerFontSize}
                            onValueChange={ (headerFontSize, _) => this.handleValueChange('headerFontSize', headerFontSize) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Header font color"
                        labelFor="typography-header-font-color"
                        inline={true}
                    >
                        <ColorChooser
                            id="typography-header-font-color"
                            initialColor={this.state.headerFontColor}
                            onColorChanged={(headerFontColor) => this.handleValueChange('headerFontColor', headerFontColor)}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Content font"
                        labelFor="typography-content-font"
                        inline={true}
                    >
                        <FontChooser
                            id="typography-content-font"
                            fonts={AVAILABLE_FONTS}
                            onFontSelected={ (contentFontFamily) => this.handleValueChange('contentFontFamily', contentFontFamily) }
                            initialFont={this.state.contentFontFamily}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Content font size"
                        labelFor="typography-content-font-size"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="typography-content-font-size"
                            value={this.state.contentFontSize}
                            onValueChange={ (contentFontSize, _) => this.handleValueChange('contentFontSize', contentFontSize) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Content font color"
                        labelFor="typography-content-font-color"
                        inline={true}
                    >
                        <ColorChooser
                            id="typography-content-font-color"
                            initialColor={this.state.contentFontColor}
                            onColorChanged={(contentFontColor) => this.handleValueChange('contentFontColor', contentFontColor)}
                        />
                    </FormGroup>

                    <H2>Dimensions</H2>
                    <FormGroup
                        label="Content start"
                        labelFor="dimensions-content-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-content-start"
                            value={this.state.contentStart}
                            onValueChange={ (contentStart, _) => this.handleValueChange('contentStart', contentStart) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Content horizontal margin"
                        labelFor="dimensions-content-horizontal-margin"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-content-horizontal-margin"
                            value={this.state.contentHorizontalMargin}
                            onValueChange={ (contentHorizontalMargin, _) => this.handleValueChange('contentHorizontalMargin', contentHorizontalMargin) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Day Number Start"
                        labelFor="dimensions-day-number-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-day-number-start"
                            value={this.state.dayNumberStart}
                            onValueChange={ (dayNumberStart, _) => this.handleValueChange('dayNumberStart', dayNumberStart) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Day Name Start"
                        labelFor="dimensions-day-name-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-day-name-start"
                            value={this.state.dayNameStart}
                            onValueChange={ (dayNameStart, _) => this.handleValueChange('dayNameStart', dayNameStart) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Day Lines Start"
                        labelFor="dimensions-day-lines-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-day-lines-start"
                            value={this.state.dayLinesStart}
                            onValueChange={ (dayLinesStart, _) => this.handleValueChange('dayLinesStart', dayLinesStart) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Days Vertical Padding"
                        labelFor="dimensions-day-vertical-padding"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-day-vertical-padding"
                            value={this.state.dayVerticalPadding}
                            onValueChange={ (dayVerticalPadding, _) => this.handleValueChange('dayVerticalPadding', dayVerticalPadding) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Month bottom margin"
                        labelFor="dimensions-month-bottom-margin"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-month-bottom-margin"
                            value={this.state.monthBottomMargin}
                            onValueChange={ (monthBottomMargin, _) => this.handleValueChange('monthBottomMargin', monthBottomMargin) }
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H2>Color</H2>

                    <FormGroup
                        label="Header background color"
                        labelFor="color-header-background"
                        inline={true}
                    >
                        <ColorChooser
                            id="color-header-background"
                            initialColor={this.state.headerBackground}
                            onColorChanged={(headerBackground) => this.handleValueChange('headerBackground', headerBackground)}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Line color"
                        labelFor="color-line"
                        inline={true}
                    >
                        <ColorChooser
                            id="color-line"
                            initialColor={this.state.lineColor}
                            onColorChanged={(lineColor) => this.handleValueChange('lineColor', lineColor)}
                        />
                    </FormGroup>

                </section>
            </Card>
        )
    }
}

class CalendarRenderer extends React.Component {

    render() {
        return (
            <div className="calendar-render">
                <svg width="210mm" height="297mm" viewBox="0 0 210 297" id="page-svg" ref={el => this.svg = SVG(el)}>
                </svg>
            </div>
        );
    }

    componentDidMount() {
        this.redraw(this.props.params)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.params !== prevProps.params) {
            this.redraw(this.props.params)
        }
    }

    * generateDays(year, month) {
        const daysInMonth = new Date(year, month - 1, 0, 0, 0, 0, 0).getDate();
        let date = new Date(year, month - 1, 1, 0, 0, 0, 0);

        for (let ordinal = 1; ordinal <= daysInMonth; ordinal++) {
            date.setDate(ordinal);
            const localizedName = date.toLocaleString(window.navigator.language, {
                weekday: 'long'
            });
            yield {ordinal, localizedName, weekend: date.getDay() in [0, 6]};
        }
    }

    redraw(opts) {
        const headerFontStyle = function () {
            this.font({
                family: opts.contentFontFamily,
                size: opts.headerFontSize,
                anchor: 'middle'
            }).fill({
                color: opts.headerFontColor
            }).attr({
                'dominant-baseline': 'hanging'
            })
        }

        this.svg.clear();

        this.svg.size(opts.pageWidth + "mm", opts.pageHeight + "mm");
        this.svg.viewbox(0, 0, opts.pageWidth, opts.pageHeight);

        const localizedMonthName = new Date(opts.year, opts.month - 1, 1, 0, 0, 0, 0).toLocaleString(window.navigator.language, {
            month: 'long'
        });

        const contentGroup = this.svg.group().attr({
            transform: `translate(0 ${opts.contentStart})`
        });

        let rowY = 0;

        contentGroup.plain(localizedMonthName).font({
            family: opts.monthFontFamily,
            size: opts.monthFontSize,
            weight: 'bold'
        }).fill({
            color: opts.monthFontColor
        }).cx(opts.pageWidth / 2);

        rowY += opts.monthBottomMargin;

        const headerSize = opts.headerPadding * 2 + opts.headerFontSize;

        const header = contentGroup.rect(opts.pageWidth, headerSize).move(0, rowY).attr({
            "fill": opts.headerBackground
        });

        const columnSize = ((opts.pageWidth - opts.contentHorizontalMargin) - opts.dayLinesStart) / 3;
        const secondLinesStart = opts.dayLinesStart + columnSize;
        const thirdLinesStart = opts.dayLinesStart + columnSize * 2;
        const contentLeftMargin = opts.contentHorizontalMargin / 2;

        const headerGroup = contentGroup.group();

        headerGroup.plain("HERS").absx(opts.dayLinesStart + columnSize / 2).do(headerFontStyle);
        headerGroup.plain("OURS").absx(secondLinesStart + columnSize / 2).do(headerFontStyle);
        headerGroup.plain("HIS").absx(thirdLinesStart + columnSize / 2).do(headerFontStyle);

        headerGroup.attr({
            transform: `translate(${contentLeftMargin} ${rowY + opts.headerPadding })`
        });

        rowY += headerSize + opts.dayVerticalPadding;

        const daysGroup = contentGroup.group().attr({
            transform: `translate(${opts.contentHorizontalMargin / 2} 0)`
        });

        for (const {ordinal, localizedName, weekend} of this.generateDays(opts.year, opts.month)) {
            const contentFontStyle = function () {
                this.font({
                    family: opts.contentFontFamily,
                    size: opts.contentFontSize,
                    weight: weekend ? 'bold' : 'normal'
                }).fill({
                    color: opts.contentFontColor
                })
            }

            const lineStyle = function () {
                this.stroke({color: opts.lineColor, width: weekend ? 0.3 : 0.1});
            };

            rowY += opts.dayVerticalPadding + opts.contentFontSize

            daysGroup.plain(String(ordinal)).absmove(opts.dayNumberStart, rowY).do(contentFontStyle);
            daysGroup.plain(localizedName).absmove(opts.dayNameStart, rowY).do(contentFontStyle);

            daysGroup.line(opts.dayLinesStart + opts.planLineMargin, rowY, opts.dayLinesStart + columnSize - opts.planLineMargin, rowY).do(lineStyle);
            daysGroup.line(secondLinesStart + opts.planLineMargin, rowY, secondLinesStart + columnSize - opts.planLineMargin, rowY).do(lineStyle);
            daysGroup.line(thirdLinesStart + opts.planLineMargin, rowY, thirdLinesStart + columnSize - opts.planLineMargin, rowY).do(lineStyle);

            rowY += opts.dayVerticalPadding
        }
    }

    getSvgSource() {
        return this.svg.svg();
    }

}

class App extends React.Component {

    defaults = {
        "year": new Date().getFullYear(),
        "month": new Date().getMonth() + 1,

        "pageWidth": 210,
        "pageHeight": 297,

        "monthFontFamily": "Kaushan Script",
        "monthFontSize": 11,
        "monthFontColor": "#333",

        "headerFontSize": 4,
        "headerFontColor": "#333",

        "contentFontFamily": "Solway",
        "contentFontSize": 4,
        "contentFontColor": "#333",

        "contentStart": 80,
        "contentHorizontalMargin": 26,
        "dayNumberStart": 0.1,
        "dayNameStart": 10,
        "dayLinesStart": 30,

        "dayVerticalPadding": 1,
        "planLineMargin": 8, // ignored for now

        "monthBottomMargin": 12,

        "headerPadding": 1.2, // not on ui for now
        "headerBackground": "#d2e4f2",

        "lineColor": "#888"
    }

    constructor(props) {
        super(props);

        this.state = { params: this.defaults };
    }

    saveSvg() {
        const year = this.state.params.year || 'unknown';
        const month = this.state.params.month || 'unknown';

        const svgBlob = new Blob([this.renderer.getSvgSource()], {type: "image/svg+xml"});
        FileSaver.saveAs(svgBlob, `planner-${year}-${month}.svg`);
    }

    render() {
        return (
            <main>
                <section className="page-container">
                    <CalendarRenderer params={this.state.params} ref={(component) => this.renderer = component} />
                </section>
                <aside>
                    <Navbar>
                        <Navbar.Group align={Alignment.LEFT}>
                            <Navbar.Heading>Spiffy Calendar Generator</Navbar.Heading>
                            <Navbar.Divider />
                            <Button className="bp3-minimal" icon="reset" text="Reset" onClick={(_) => this.setState({ params: this.defaults })} />
                            <Button className="bp3-minimal" icon="print" text="Print" onClick={(_) => window.print()} />
                            <Button className="bp3-minimal" icon="floppy-disk" text="Save SVG" onClick={(_) => this.saveSvg()} />
                        </Navbar.Group>
                    </Navbar>

                    <CalendarOptions
                        params={this.state.params}
                        onParametersChanged={(params) => this.setState({ ...this.state, params })}
                    />
                </aside>
            </main>
        )
    }

}

ReactDOM.render(
    <App/>, document.getElementById('app')
)