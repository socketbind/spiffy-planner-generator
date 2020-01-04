import React from "react";
import EventEmitter from 'events';

const surrogateMouseEvents = new EventEmitter();

document.body.addEventListener('mousemove', e =>
    surrogateMouseEvents.emit('mousemove', e), false
);
document.body.addEventListener('mouseup', e =>
    surrogateMouseEvents.emit('mouseup', e), false
);

export function draggableElement(tagName, yQuery = (props) => props.y) {
    return class extends React.Component {
        componentDidMount() {
            this.updateHelperObjects();
        }

        componentDidUpdate() {
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
                const self = this;
                let dragging = true;
                let startDragY = this.mouseEventToSvgCoordinates(e).y;
                let startElemY = yQuery(this.props, this.el) || 0;

                this.el.setAttribute('cursor', 'move');

                function onMouseMove(e) {
                    if (dragging) {
                        e.preventDefault();
                        const offset = self.mouseEventToSvgCoordinates(e).y - startDragY;
                        const finalY = (startElemY + offset) | 0;
                        self.props.onVerticalDrag && self.props.onVerticalDrag(finalY);
                    }
                }

                function onMouseUp(e) {
                    e.preventDefault();

                    dragging = false;
                    self.el.removeAttribute('cursor');

                    surrogateMouseEvents.off('mousemove', onMouseMove);
                    surrogateMouseEvents.off('mouseup', onMouseUp);
                }

                surrogateMouseEvents.on('mousemove', onMouseMove);
                surrogateMouseEvents.on('mouseup', onMouseUp);
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
                    onMouseDown: e => this.handleMouseDown(e)
                }
            )
        }
    }
}
