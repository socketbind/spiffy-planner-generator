import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

export class FontChooser extends React.Component {

    render() {
        return (
            <Select id={this.props.id}
                    activeItem={this.props.font}
                    items={this.props.fonts}
                    itemPredicate={(query, item) => item.toLowerCase().includes(query.toLowerCase()) }
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
                        this.props.onFontSelected && this.props.onFontSelected(item);
                    }}>
                <Button text={<div style={{fontFamily: this.props.font}}>{this.props.font}</div>}
                        rightIcon="double-caret-vertical"/>
            </Select>
        )
    }

}