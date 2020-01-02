import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

export class FontChooser extends React.Component {

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