import React, {Fragment} from "react";

class DraggableImage extends React.Component {
    constructor(props) {
        super(props);

        this.dragging = false;
        this.startDragY = 0;
        this.startElemY = 0;
    }

    componentDidMount() {
        this.updateHelperObjects();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateHelperObjects();
    }

    updateHelperObjects() {
        const viewport = this.el.viewportElement;
        this.pt = viewport.createSVGPoint();
        this.ctm = viewport.getScreenCTM().inverse();
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.dragging = true;
        this.startDragY = this.mouseEventToSvgCoordinates(e);
        //this.startElemY = parseInt(this.el.getAttribute('y')) || 0;
        this.startElemY = this.props.y || 0;
    }

    handleMouseMove(e) {
        if (this.dragging) {
            e.preventDefault();
            const offset = this.mouseEventToSvgCoordinates(e).y - this.startDragY.y;
            const finalY = this.startElemY + offset;
            //this.el.setAttribute('y', String(this.startElemY + offset));
            this.props.onVerticalDrag && this.props.onVerticalDrag(finalY);
        }
    }

    handleMouseUp(e) {
        e.preventDefault();
        this.dragging = false;
    }

    mouseEventToSvgCoordinates(evt) {
        this.pt.x = evt.clientX;
        this.pt.y = evt.clientY;
        return this.pt.matrixTransform(this.ctm);
    }

    render() {
        const { onVerticalDrag, ...passThroughProps } = this.props;

        return (<image
            {...passThroughProps}
            ref={el => this.el = el}
            onMouseDown={e => this.handleMouseDown(e)}
            onMouseMove={e => this.handleMouseMove(e)}
            onMouseUp={e => this.handleMouseUp(e)}
        />)
    }
}


export class CalendarRenderer extends React.Component {

    render() {
        const params = this.props.params;

        const localizedMonthName = new Date(params.year, params.month - 1, 1, 0, 0, 0, 0).toLocaleString(window.navigator.language, {
            month: 'long'
        });

        const headerSize = params.headerPadding * 2 + params.headerFontSize;

        /* layout */
        const columnSize = ((params.pageWidth - params.contentHorizontalMargin) - params.dayLinesStart) / 3;
        const secondLinesStart = params.dayLinesStart + columnSize;
        const thirdLinesStart = params.dayLinesStart + columnSize * 2;
        const contentLeftMargin = params.contentHorizontalMargin / 2;

        let rowY = 0;
        const days = this.generateDays(params.year, params.month);

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
                    <DraggableImage
                        y={params.backgroundY}
                        onVerticalDrag={(value) => this.props.onBackgroundVerticalDrag && this.props.onBackgroundVerticalDrag(value)}
                        width={params.pageWidth}
                        xlinkHref={params.background}
                        cursor="move"
                        mask="url(#SvgjsMask1001)"
                    />
                    }

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

                        <rect
                            width={params.pageWidth}
                            height={headerSize}
                            x="0"
                            y={rowY += params.monthBottomMargin + params.monthFontSize}
                            fill={params.headerBackground}/>

                        <g transform={`translate(${contentLeftMargin} ${rowY + params.headerPadding})`}>
                            <text x={params.dayLinesStart + columnSize / 2}
                                  fontFamily={params.contentFontFamily}
                                  fontSize={params.contentFontSize}
                                  textAnchor="middle"
                                  dominantBaseline="hanging"
                                  fill={params.contentFontColor}>
                                HERS
                            </text>
                            <text x={secondLinesStart + columnSize / 2}
                                  fontFamily={params.contentFontFamily}
                                  fontSize={params.contentFontSize}
                                  textAnchor="middle"
                                  dominantBaseline="hanging"
                                  fill={params.contentFontColor}>
                                OURS
                            </text>
                            <text x={thirdLinesStart + columnSize / 2}
                                  fontFamily={params.contentFontFamily}
                                  fontSize={params.contentFontSize}
                                  textAnchor="middle"
                                  dominantBaseline="hanging"
                                  fill={params.contentFontColor}>
                                HIS
                            </text>
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

                                    <line
                                        x1={params.dayLinesStart + params.planLineMargin}
                                        y1={baseline}
                                        x2={params.dayLinesStart + columnSize - params.planLineMargin}
                                        y2={baseline}
                                        strokeWidth={day.weekend ? 0.3 : 0.1}
                                        stroke={params.lineColor}/>
                                    <line
                                        x1={secondLinesStart + params.planLineMargin}
                                        y1={baseline}
                                        x2={secondLinesStart + columnSize - params.planLineMargin}
                                        y2={baseline}
                                        strokeWidth={day.weekend ? 0.3 : 0.1}
                                        stroke={params.lineColor}/>
                                    <line
                                        x1={thirdLinesStart + params.planLineMargin}
                                        y1={baseline}
                                        x2={thirdLinesStart + columnSize - params.planLineMargin}
                                        y2={baseline}
                                        strokeWidth={day.weekend ? 0.3 : 0.1}
                                        stroke={params.lineColor}/>
                                </Fragment>);
                            })}

                        </g>

                    </g>
                </svg>
            </div>
        );
    }

    generateDays(year, month) {
        const result = [];

        const daysInMonth = new Date(year, month - 1, 0, 0, 0, 0, 0).getDate();
        let date = new Date(year, month - 1, 1, 0, 0, 0, 0);

        for (let ordinal = 1; ordinal <= daysInMonth; ordinal++) {
            date.setDate(ordinal);
            const localizedName = date.toLocaleString(window.navigator.language, {
                weekday: 'long'
            });
            result.push({ordinal, localizedName, weekend: date.getDay() in [0, 6]});
        }

        return result;
    }

    getSvgSource() {
        return new XMLSerializer().serializeToString(this.svg);
    }

}