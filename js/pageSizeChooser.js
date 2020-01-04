import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

export class PageSizeChooser extends React.Component {

    render() {
        return (<Select {...this.props}
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
                        onItemSelect={item => this.props.onSizeChosen && this.props.onSizeChosen(item)}>
            <Button text="Use preset..."
                    rightIcon="double-caret-vertical"/>
        </Select>)
    }

}