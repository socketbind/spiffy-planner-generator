import React from "react";
import {Button, Card, FormGroup, H2, Label, MenuItem, NumericInput} from "@blueprintjs/core";
import {MonthChooser} from "./monthChooser";
import {Select} from "@blueprintjs/select";
import {FontChooser} from "./fontChooser";
import {ColorChooser} from "./colorChooser";

export class CalendarOptions extends React.Component {

    constructor(props) {
        super(props);

        this.availableFonts = props.availableFonts || ['Arial'];
        this.state = Object.assign({}, props.params || {});
    }

    handleValueChange(propName, value) {
        const newState = {...this.state};
        newState[propName] = value;
        this.setState(newState);
        this.props.onParametersChanged && this.props.onParametersChanged(newState);
    }

    handleValueChanges(values) {
        const newState = {...this.state, ...values};
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
                            onValueChange={(year, _) => this.handleValueChange('year', year)}
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
                                onItemSelect={item => this.handleValueChanges({
                                    pageWidth: item.width,
                                    pageHeight: item.height
                                })}>
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
                            onValueChange={(pageWidth, _) => this.handleValueChange('pageWidth', pageWidth)}
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
                            onValueChange={(pageHeight, _) => this.handleValueChange('pageHeight', pageHeight)}
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
                            fonts={this.availableFonts}
                            onFontSelected={(monthFontFamily) => this.handleValueChange('monthFontFamily', monthFontFamily)}
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
                            onValueChange={(monthFontSize, _) => this.handleValueChange('monthFontSize', monthFontSize)}
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
                            onValueChange={(headerFontSize, _) => this.handleValueChange('headerFontSize', headerFontSize)}
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
                            fonts={this.availableFonts}
                            onFontSelected={(contentFontFamily) => this.handleValueChange('contentFontFamily', contentFontFamily)}
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
                            onValueChange={(contentFontSize, _) => this.handleValueChange('contentFontSize', contentFontSize)}
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
                            onValueChange={(contentStart, _) => this.handleValueChange('contentStart', contentStart)}
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
                            onValueChange={(contentHorizontalMargin, _) => this.handleValueChange('contentHorizontalMargin', contentHorizontalMargin)}
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
                            onValueChange={(dayNumberStart, _) => this.handleValueChange('dayNumberStart', dayNumberStart)}
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
                            onValueChange={(dayNameStart, _) => this.handleValueChange('dayNameStart', dayNameStart)}
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
                            onValueChange={(dayLinesStart, _) => this.handleValueChange('dayLinesStart', dayLinesStart)}
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
                            onValueChange={(dayVerticalPadding, _) => this.handleValueChange('dayVerticalPadding', dayVerticalPadding)}
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
                            onValueChange={(monthBottomMargin, _) => this.handleValueChange('monthBottomMargin', monthBottomMargin)}
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