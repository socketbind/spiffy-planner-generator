import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";

export class MonthChooser extends React.Component {

    constructor(props) {
        super(props);

        this.state = { months: this.generateLocalizedMonths(props.lang) };
    }

    generateLocalizedMonths(lang = window.navigator.language) {
        const months = [];
        const date = new Date();

        for (let i = 0; i < 12; i++) {
            date.setMonth(i);
            months.push({
                ordinal: i + 1,
                name: date.toLocaleDateString(lang, {month: 'long'})
            });
        }

        return months;
    }

    monthForOrdinal(ordinal) {
        return this.state.months.find(item => item.ordinal === ordinal);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.lang !== prevProps.lang) {
            this.setState({ months: this.generateLocalizedMonths(this.props.lang) })
        }
    }

    render() {
        const month = this.monthForOrdinal(this.props.month);

        return (
            <Select id={this.props.id}
                    filterable={false}
                    activeItem={month}
                    items={this.state.months}
                    itemPredicate={(query, item) => item.name.toLowerCase().includes(query.toLowerCase())}
                    itemRenderer={(month, {handleClick, modifiers}) => {
                        if (!modifiers.matchesPredicate) {
                            return null;
                        }
                        return (<MenuItem
                            active={modifiers.active}
                            key={month.ordinal}
                            onClick={handleClick}
                            text={month.name}
                        />)
                    }}
                    onItemSelect={(item) => {
                        this.props.onMonthChanged && this.props.onMonthChanged(item.ordinal);
                    }}>
                <Button text={month.name} rightIcon="double-caret-vertical"/>
            </Select>
        )
    }

}