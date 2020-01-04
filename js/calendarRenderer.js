import React, {Fragment} from "react";
import {draggableElement} from "./draggableElement";
import {capitalize} from "./utils";

const DraggableImage = draggableElement('image');
const DraggableRect = draggableElement('rect');

export class CalendarRenderer extends React.Component {

    render() {
        const params = this.props.params;

        const localizedMonthName = capitalize(new Date(
            params.year, params.month - 1, 1, 0, 0, 0, 0
        ).toLocaleString(params.lang, {
            month: 'long'
        }));

        /* general content */
        const contentLeftMargin = params.contentHorizontalMargin / 2;
        const headerSize = params.headerPadding * 2 + params.headerFontSize;

        let rowY = 0;
        const days = this.generateDays(params.year, params.month, params.lang);

        /* sections */
        const sections = params.sections.split(',').map(item => item.trim()).filter(item => item !== '');
        const numberOfColumns = sections.length || 1;

        const columnSize = (
            (params.pageWidth - params.contentHorizontalMargin) - params.dayLinesStart - (numberOfColumns - 1) * params.planLineMargin
        ) / numberOfColumns;

        const lineCoordinates = [];
        let currentLineX = params.dayLinesStart;

        for (let i = 0; i < numberOfColumns; i++) {
            lineCoordinates.push({
                x1: currentLineX,
                x2: currentLineX + columnSize,
                name: sections[i]
            });

            currentLineX += params.planLineMargin + columnSize;
        }

        return (
            <div className="calendar-render">
                <svg width={`${params.pageWidth}mm`} height={`${params.pageHeight}mm`}
                     viewBox={`0 0 ${params.pageWidth} ${params.pageHeight}`} id="page-svg" ref={el => this.svg = el}>
                    <defs>
                        <linearGradient gradientTransform="rotate(90)" id="SvgjsLinearGradient1000">
                            <stop stopOpacity="1" stopColor="#ffffff" offset="0"/>
                            <stop stopOpacity="0" stopColor="#ffffff" offset="0.4"/>
                        </linearGradient>
                        <mask id="SvgjsMask1001">
                            <rect
                                width={params.pageWidth}
                                height={params.pageHeight}
                                fill="url(#SvgjsLinearGradient1000)">
                            </rect>
                        </mask>
                    </defs>
                    {params.background &&
                    <>
                        <DraggableImage
                            y={params.backgroundY}
                            onVerticalDrag={(value) => this.props.onBackgroundVerticalDrag && this.props.onBackgroundVerticalDrag(value)}
                            width={params.pageWidth}
                            xlinkHref={params.background}
                            cursor="move"
                            mask="url(#SvgjsMask1001)"
                        />
                        <text
                            x={params.pageWidth - 4}
                            y={4}
                            fontWeight="bold"
                            stroke="#aaa"
                            strokeWidth=".1"
                            strokeOpacity=".5"
                            fillOpacity=".5"
                            fontSize="6"
                            className="dont-print"
                            pointerEvents="none"
                            textAnchor="end"
                            dominantBaseline="hanging">
                            Drag background to adjust
                        </text>
                    </>
                    }

                    <DraggableRect
                        y={params.contentStart}
                        width={params.pageWidth}
                        height={params.pageHeight - params.contentStart}
                        fill="#fff"
                        opacity="0"
                        cursor="move"
                        onVerticalDrag={value => this.props.onContentVerticalDrag && this.props.onContentVerticalDrag(value)}
                    />
                    <g transform={`translate(0 ${params.contentStart})`}>
                        <text fontFamily={params.monthFontFamily}
                              fontSize={params.monthFontSize}
                              fontWeight="bold"
                              fill={params.monthFontColor}
                              textAnchor="middle"
                              dominantBaseline="hanging"
                              x={params.pageWidth / 2}>
                            {localizedMonthName}
                        </text>

                        <text
                            x={params.pageWidth - 4}
                            y={4}
                            fontWeight="bold"
                            stroke="#aaa"
                            strokeWidth=".1"
                            strokeOpacity=".3"
                            fillOpacity=".3"
                            fontSize="6"
                            className="dont-print"
                            pointerEvents="none"
                            textAnchor="end"
                            dominantBaseline="hanging">
                            Drag content to adjust
                        </text>

                        <rect
                            width={params.pageWidth}
                            height={headerSize}
                            x="0"
                            y={rowY += params.monthBottomMargin + params.monthFontSize}
                            fill={params.headerBackground}/>

                        <g transform={`translate(${contentLeftMargin} ${rowY + params.headerPadding})`}>
                            {sections.length && lineCoordinates.map((item, index) =>
                                <text
                                    key={index}
                                    x={item.x1 + columnSize / 2}
                                    fontFamily={params.contentFontFamily}
                                    fontSize={params.contentFontSize}
                                    textAnchor="middle"
                                    dominantBaseline="hanging"
                                    fill={params.contentFontColor}>
                                    {item.name}
                                </text>
                            )}
                        </g>

                        <g transform={`translate(${contentLeftMargin} ${rowY += headerSize + params.dayVerticalPadding})`}>
                            {days.map(day => {
                                const baseline = day.ordinal * (params.dayVerticalPadding + params.contentFontSize);

                                return (<Fragment key={day.ordinal}>
                                    <text x={params.dayNumberStart}
                                          y={baseline}
                                          fontFamily={params.contentFontFamily}
                                          fontSize={params.contentFontSize}
                                          fontWeight={day.weekend ? 'bold' : 'normal'}
                                          fill={params.contentFontColor}>
                                        {String(day.ordinal)}
                                    </text>
                                    <text x={params.dayNameStart}
                                          y={baseline}
                                          fontFamily={params.contentFontFamily}
                                          fontSize={params.contentFontSize}
                                          fontWeight={day.weekend ? 'bold' : 'normal'}
                                          fill={params.contentFontColor}>
                                        {day.localizedName}
                                    </text>

                                    {lineCoordinates.map((item, index) =>
                                        <line
                                            key={index}
                                            {...item}
                                            y1={baseline}
                                            y2={baseline}
                                            strokeWidth={day.weekend ? 0.3 : 0.1}
                                            stroke={params.lineColor}/>
                                    )}
                                </Fragment>);
                            })}

                        </g>

                    </g>
                </svg>
            </div>
        );
    }

    generateDays(year, month, lang) {
        const result = [];

        const daysInMonth = new Date(year, month - 1, 0, 0, 0, 0, 0).getDate();
        let date = new Date(year, month - 1, 1, 0, 0, 0, 0);

        for (let ordinal = 1; ordinal <= daysInMonth; ordinal++) {
            date.setDate(ordinal);
            const localizedName = date.toLocaleString(lang, {
                weekday: 'long'
            });
            result.push({ordinal, localizedName, weekend: date.getDay() in [0, 6]});
        }

        return result;
    }

    getSvgSource() {
        const cloned = this.svg.cloneNode(true);
        for (const element of cloned.querySelectorAll('.dont-print')) {
            element.remove();
        }
        return new XMLSerializer().serializeToString(cloned);
    }

}