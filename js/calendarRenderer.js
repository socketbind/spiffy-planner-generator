import React from "react";
import {SVG} from "@svgdotjs/svg.js";

export class CalendarRenderer extends React.Component {

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

        if (opts.background) {
            const backgroundImage = this.svg.image(opts.background)
                .attr({width: opts.pageWidth, height: null, cursor: 'move'});

            const pt = this.svg.node.createSVGPoint();
            const ctm = this.svg.node.getScreenCTM().inverse();

            function cursorPoint(evt){
                pt.x = evt.clientX; pt.y = evt.clientY;
                return pt.matrixTransform(ctm);
            }

            let draggingBackground = false, startDragY, startImageY = 0;
            backgroundImage.on('mousedown', (e) => {
                e.preventDefault();
                draggingBackground = true;
                startDragY = cursorPoint(e);
                startImageY = backgroundImage.attr('y') || 0;
            });
            backgroundImage.on('mousemove', (e) => {
                if (draggingBackground) {
                    e.preventDefault();
                    const offset = cursorPoint(e).y - startDragY.y;
                    backgroundImage.attr({ y: startImageY + offset })
                }
            });
            backgroundImage.on('mouseup', (e) => {
                e.preventDefault();
                draggingBackground = false;
            });

            const gradient = this.svg.gradient('linear', add => {
                add.attr({'gradientTransform': 'rotate(90)'})
                add.stop(0, '#fff', 1.0);
                add.stop(0.4, '#fff', 0.0);
            });

            const maskRect = this.svg.rect(opts.pageWidth, opts.pageHeight)
                .attr({ fill: gradient });

            backgroundImage.maskWith(maskRect)
        }

        const contentGroup = this.svg.group().attr({
            transform: `translate(0 ${opts.contentStart})`
        });

        let rowY = 0;

        const localizedMonthName = new Date(opts.year, opts.month - 1, 1, 0, 0, 0, 0).toLocaleString(window.navigator.language, {
            month: 'long'
        });

        contentGroup.plain(localizedMonthName).font({
            family: opts.monthFontFamily,
            size: opts.monthFontSize,
            weight: 'bold'
        }).fill({
            color: opts.monthFontColor
        }).cx(opts.pageWidth / 2);

        rowY += opts.monthBottomMargin;

        const headerSize = opts.headerPadding * 2 + opts.headerFontSize;

        contentGroup.rect(opts.pageWidth, headerSize).move(0, rowY).attr({
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
            transform: `translate(${contentLeftMargin} ${rowY + opts.headerPadding})`
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