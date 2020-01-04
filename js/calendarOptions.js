import React from "react";
import {Button, Card, Classes, FormGroup, H5, InputGroup, NumericInput} from "@blueprintjs/core";
import {MonthChooser} from "./monthChooser";
import {FontChooser} from "./fontChooser";
import {ColorChooser} from "./colorChooser";
import {BackgroundChooser} from "./backgroundChooser";
import {LangaugeChooser} from "./langaugeChooser";
import {PageSizeChooser} from "./pageSizeChooser";

export class CalendarOptions extends React.Component {

    constructor(props) {
        super(props);

        this.state = { backgroundChooserOpen: false };
    }

    handleValueChange(propName, value) {
        const params = { ...this.props.params, [propName]: value };
        this.props.onParametersChanged && this.props.onParametersChanged(params);
    }

    handleValueChanges(values) {
        const params = { ...this.props.params, ...values };
        this.props.onParametersChanged && this.props.onParametersChanged(params);
    }

    render() {
        return (
            <Card interactive={false}>
                <section className="options-form">
                    <H5 className={Classes.TEXT_MUTED}>General</H5>

                    <FormGroup
                        label="Language"
                        labelFor="general-lang"
                        inline={true}
                    >
                        <LangaugeChooser
                            id="general-lang"
                            language={this.props.params.lang}
                            onLanguageChosen={(lang) => this.handleValueChange('lang', lang)}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Year"
                        labelFor="general-year"
                        inline={true}
                    >
                        <NumericInput
                            id="general-year"
                            value={this.props.params.year}
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
                            lang={this.props.params.lang}
                            month={this.props.params.month}
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

                    <FormGroup
                        label="Background gradient end"
                        labelFor="general-background-gradient-end"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="general-background-gradient-end"
                            value={this.props.params.backgroundGradientStopEnd}
                            onValueChange={(stopEnd, _) => this.handleValueChange('backgroundGradientStopEnd', stopEnd)}
                        />
                        <abbr>px</abbr>
                    </FormGroup>

                    <FormGroup
                        label="Sections"
                        labelFor="general-sections"
                        inline={true}
                        helperText={<>Leave empty for single column.<br/>Separate with commas.</>}
                    >
                        <InputGroup
                            id="general-sections"
                            value={this.props.params.sections}
                            placeholder="Section names"
                            fill={true}
                            onChange={(ev) => this.handleValueChange('sections', ev.target.value)}
                        />
                    </FormGroup>

                    <H5 className={Classes.TEXT_MUTED}>Page setup</H5>

                    <FormGroup
                        label="Preset"
                        labelFor="page-setup-presets"
                        inline={true}
                    >
                        <PageSizeChooser
                            id="page-setup-presets"
                            onSizeChosen={item => this.handleValueChanges({
                                pageWidth: item.width,
                                pageHeight: item.height
                            })}
                        />
                    </FormGroup>

                    <FormGroup
                        label="Width"
                        labelFor="page-setup-width"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="page-setup-width"
                            value={this.props.params.pageWidth}
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
                            value={this.props.params.pageHeight}
                            onValueChange={(pageHeight, _) => this.handleValueChange('pageHeight', pageHeight)}
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H5 className={Classes.TEXT_MUTED}>Typography</H5>

                    <FormGroup
                        label="Month font"
                        labelFor="typography-month-font"
                        inline={true}
                    >
                        <FontChooser
                            id="typography-month-font"
                            fonts={this.props.availableFonts}
                            onFontSelected={(monthFontFamily) => this.handleValueChange('monthFontFamily', monthFontFamily)}
                            font={this.props.params.monthFontFamily}
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
                            value={this.props.params.monthFontSize}
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
                            color={this.props.params.monthFontColor}
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
                            value={this.props.params.headerFontSize}
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
                            color={this.props.params.headerFontColor}
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
                            fonts={this.props.availableFonts}
                            onFontSelected={(contentFontFamily) => this.handleValueChange('contentFontFamily', contentFontFamily)}
                            font={this.props.params.contentFontFamily}
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
                            value={this.props.params.contentFontSize}
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
                            color={this.props.params.contentFontColor}
                            onColorChanged={(contentFontColor) => this.handleValueChange('contentFontColor', contentFontColor)}
                        />
                    </FormGroup>

                    <H5 className={Classes.TEXT_MUTED}>Dimensions</H5>
                    <FormGroup
                        label="Content start"
                        labelFor="dimensions-content-start"
                        inline={true}
                        contentClassName="with-unit"
                    >
                        <NumericInput
                            id="dimensions-content-start"
                            value={this.props.params.contentStart}
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
                            value={this.props.params.contentHorizontalMargin}
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
                            value={this.props.params.dayNumberStart}
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
                            value={this.props.params.dayNameStart}
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
                            value={this.props.params.dayLinesStart}
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
                            value={this.props.params.dayVerticalPadding}
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
                            value={this.props.params.monthBottomMargin}
                            onValueChange={(monthBottomMargin, _) => this.handleValueChange('monthBottomMargin', monthBottomMargin)}
                        />
                        <abbr>mm</abbr>
                    </FormGroup>

                    <H5 className={Classes.TEXT_MUTED}>Color</H5>

                    <FormGroup
                        label="Header background color"
                        labelFor="color-header-background"
                        inline={true}
                    >
                        <ColorChooser
                            id="color-header-background"
                            color={this.props.params.headerBackground}
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
                            color={this.props.params.lineColor}
                            onColorChanged={(lineColor) => this.handleValueChange('lineColor', lineColor)}
                        />
                    </FormGroup>

                </section>
            </Card>
        )
    }
}