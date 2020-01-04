import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

import LANGUAGES from "./languages.json";

export class LangaugeChooser extends React.Component {

    constructor(props) {
        super(props);

        this.langauges = this.props.languages || LANGUAGES;
    }

    render() {
        const langCode = this.props.language;
        const lang = this.langauges.find(lang => lang.code === langCode) || this.langauges[0];

        return (<Select {...this.props}
                    activeItem={lang}
                    items={this.langauges}
                    itemPredicate={(query, item) => item.name.toLowerCase().includes(query.toLowerCase()) }
                    itemRenderer={(value, {handleClick, modifiers}) => {
                        if (!modifiers.matchesPredicate) {
                            return null;
                        }
                        return (<MenuItem
                            active={modifiers.active}
                            key={value.name}
                            text={value.name}
                            onClick={handleClick}
                            label={value.code}
                        />)
                    }}
                    onItemSelect={item => this.props.onLanguageChosen && this.props.onLanguageChosen(item.code)}>
            <Button text={lang.name} rightIcon="double-caret-vertical"/>
        </Select>)
    }


}