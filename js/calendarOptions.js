import React from "react";
import {Button, Card, FormGroup, H3, MenuItem, NumericInput, Classes} from "@blueprintjs/core";
import {MonthChooser} from "./monthChooser";
import {Select} from "@blueprintjs/select";
import {FontChooser} from "./fontChooser";
import {ColorChooser} from "./colorChooser";
import {BackgroundChooser} from "./backgroundChooser";

export class CalendarOptions extends React.Component {

    constructor(props) {
        super(props);

        this.availableFonts = props.availableFonts || ['Arial'];
        this.state = { params: props.params || {}, backgroundChooserOpen: false };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.params !== prevProps.params) {
            this.setState({ params: this.props.params });
        }
    }

    handleValueChange(propName, value) {
        const newState = {params: { ...this.state.params, [propName]: value }};
        this.setState(newState);
        this.props.onParametersChanged && this.props.onParametersChanged(newState.params);
    }

    handleValueChanges(values) {
        const newState = {params: { ...this.state.params, ...values }};
        this.setState(values);
        this.props.onParametersChanged && this.props.onParametersChanged(newState.params);
    }

    render() {
        return (
            <Card interactive={false}>
                <section className="options-form">
                    <H3 className={Classes.TEXT_MUTED}>General</H3>

                    <FormGroup
                        label="Year"
                        labelFor="general-year"
                        inline={true}
                    >
                        <NumericInput
                            id="general-year"
                            value={this.state.params.year}
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
                            month={this.state.params.month}
                            onMonthChanged={(month) => this.handleValueChange('month', month)}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Background"
                        labelFor="general-background"
                        inline={true}
                    >
                        <Button
                            id="general-background"
                            text="Pick custom background"
                            onClick={_ => this.setState({ backgroundChooserOpen: true })}
                        />

                        <BackgroundChooser
                            isOpen={this.state.backgroundChooserOpen}
                            onImageReady={imageUrl => this.handleValueChange('background', imageUrl)}
                            onClose={() => this.setState({ backgroundChooserOpen: false })}
                        />
                    </FormGroup>

                    <H3 className={Classes.TEXT_MUTED}>Page setup</H3>

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
                            value={this.state.params.pageWidth}
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
                            value={this.state.params.pageHeight}
                            onValueChange={(pageHeight, _) => this.handleValueChange('pageHeight', pageHeight)}
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H3 className={Classes.TEXT_MUTED}>Typography</H3>

                    <FormGroup
                        label="Month font"
                        labelFor="typography-month-font"
                        inline={true}
                    >
                        <FontChooser
                            id="typography-month-font"
                            fonts={this.availableFonts}
                            onFontSelected={(monthFontFamily) => this.handleValueChange('monthFontFamily', monthFontFamily)}
                            font={this.state.params.monthFontFamily}
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
                            value={this.state.params.monthFontSize}
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
                            color={this.state.params.monthFontColor}
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
                            value={this.state.params.headerFontSize}
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
                            color={this.state.params.headerFontColor}
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
                            font={this.state.params.contentFontFamily}
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
                            value={this.state.params.contentFontSize}
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
                            color={this.state.params.contentFontColor}
                            onColorChanged={(contentFontColor) => this.handleValueChange('contentFontColor', contentFontColor)}
                        />
                    </FormGroup>

                    <H3 className={Classes.TEXT_MUTED}>Dimensions</H3>
                    <FormGroup
                        label="Content start"
                        labelFor="dimensions-content-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-content-start"
                            value={this.state.params.contentStart}
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
                            value={this.state.params.contentHorizontalMargin}
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
                            value={this.state.params.dayNumberStart}
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
                            value={this.state.params.dayNameStart}
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
                            value={this.state.params.dayLinesStart}
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
                            value={this.state.params.dayVerticalPadding}
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
                            value={this.state.params.monthBottomMargin}
                            onValueChange={(monthBottomMargin, _) => this.handleValueChange('monthBottomMargin', monthBottomMargin)}
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H3 className={Classes.TEXT_MUTED}>Color</H3>

                    <FormGroup
                        label="Header background color"
                        labelFor="color-header-background"
                        inline={true}
                    >
                        <ColorChooser
                            id="color-header-background"
                            color={this.state.params.headerBackground}
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
                            color={this.state.params.lineColor}
                            onColorChanged={(lineColor) => this.handleValueChange('lineColor', lineColor)}
                        />
                    </FormGroup>

                </section>
            </Card>
        )
    }
}