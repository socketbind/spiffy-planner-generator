import React from "react";

export function draggableElement(tagName, yQuery = (props) => props.y) {
    return class extends React.Component {
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
            if (e.button === 0) {
                this.dragging = true;
                this.startDragY = this.mouseEventToSvgCoordinates(e);
                this.startElemY = yQuery(this.props, this.el) || 0;
            }
        }

        handleMouseMove(e) {
            if (this.dragging) {
                e.preventDefault();
                const offset = this.mouseEventToSvgCoordinates(e).y - this.startDragY.y;
                const finalY = this.startElemY + offset;
                this.props.onVerticalDrag && this.props.onVerticalDrag(finalY);
            }
        }

        handleMouseUp(e) {
            e.preventDefault();
            if (e.button === 0) {
                this.dragging = false;
            }
        }

        mouseEventToSvgCoordinates(evt) {
            this.pt.x = evt.clientX;
            this.pt.y = evt.clientY;
            return this.pt.matrixTransform(this.ctm);
        }

        render() {
            const {onVerticalDrag, ...passThroughProps} = this.props;

            return React.createElement(
                tagName,
                {
                    ...passThroughProps,
                    ref: el => this.el = el,
                    onMouseDown: e => this.handleMouseDown(e),
                    onMouseMove: e => this.handleMouseMove(e),
                    onMouseUp: e => this.handleMouseUp(e)
                }
            )
        }
    }
}
