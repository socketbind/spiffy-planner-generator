import React, {Fragment} from "react";
import {Button, Popover} from "@blueprintjs/core";
import {SketchPicker} from "react-color";

export class ColorChooser extends React.Component {

    render() {
        return (
            <Popover id={this.props.id}>
                <Button text={<Fragment><span>{this.props.color}</span><span className="color-square"
                                                                             style={{backgroundColor: this.props.color}}/></Fragment>}/>
                <SketchPicker color={this.props.color} onChange={(color) => {
                    this.props.onColorChanged && this.props.onColorChanged(color.hex);
                }}/>
            </Popover>
        )
    }

}