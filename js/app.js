import "regenerator-runtime/runtime";

import {Element, extend} from '@svgdotjs/svg.js'
import FileSaver from 'file-saver';

import React from 'react';
import ReactDOM from 'react-dom';
import {Alignment, Button, Classes, Navbar} from "@blueprintjs/core";
import {CalendarOptions} from "./calendarOptions";
import {CalendarRenderer} from "./calendarRenderer";

const AVAILABLE_FONTS = ['Archivo Black',
    'Bangers',
    'Calistoga',
    'Caveat',
    'Cinzel',
    'Concert One',
    'Cookie',
    'Courgette',
    'Dancing Script',
    'Fredoka One',
    'Gelasio',
    'Girassol',
    'Indie Flower',
    'Josefin Sans',
    'Kalam',
    'Kaushan Script',
    'Lobster Two',
    'Lobster',
    'Ma Shan Zheng',
    'Oswald',
    'Pacifico',
    'Permanent Marker',
    'Righteous',
    'Roboto',
    'Sacramento',
    'Satisfy',
    'Shadows Into Light',
    'Solway',
    'Special Elite',
    'Stoke'
];

extend(Element, {
    do: function (fn, ...args) {
        fn.call(this, ...args);
        return this;
    },
    absx: function(x) {
        this.attr({ x });
        return this;
    },
    absmove: function(x, y) {
        this.attr({ x, y });
        return this;
    }
});

class App extends React.Component {

    defaults = {
        "year": new Date().getFullYear(),
        "month": new Date().getMonth() + 1,

        "pageWidth": 210,
        "pageHeight": 297,

        "background": "https://images.unsplash.com/photo-1422207134147-65fb81f59e38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9",

        "monthFontFamily": "Kaushan Script",
        "monthFontSize": 11,
        "monthFontColor": "#333",

        "headerFontSize": 4,
        "headerFontColor": "#333",

        "contentFontFamily": "Solway",
        "contentFontSize": 4,
        "contentFontColor": "#333",

        "contentStart": 80,
        "contentHorizontalMargin": 26,
        "dayNumberStart": 0.1,
        "dayNameStart": 10,
        "dayLinesStart": 30,

        "dayVerticalPadding": 1,
        "planLineMargin": 8, // ignored for now

        "monthBottomMargin": 12,

        "headerPadding": 1.2, // not on ui for now
        "headerBackground": "#d2e4f2",

        "lineColor": "#888"
    }

    constructor(props) {
        super(props);

        const savedState = (window.localStorage && window.localStorage.getItem('params'));

        this.state = { params: (savedState && JSON.parse(savedState)) || this.defaults };
    }

    saveSvg() {
        const year = this.state.params.year || 'unknown';
        const month = this.state.params.month || 'unknown';

        const svgBlob = new Blob([this.renderer.getSvgSource()], {type: "image/svg+xml"});
        FileSaver.saveAs(svgBlob, `planner-${year}-${month}.svg`);
    }

    saveNewParams(params) {
        this.setState({ params })
        if (window.localStorage) {
            window.localStorage.setItem('params', JSON.stringify(params));
        }
    }

    render() {
        return (
            <main>
                <section className="page-container">
                    <CalendarRenderer params={this.state.params} ref={(component) => this.renderer = component} />
                </section>
                <aside>
                    <Navbar>
                        <Navbar.Group align={Alignment.LEFT}>
                            <Navbar.Heading>Spiffy Calendar Generator</Navbar.Heading>
                            <Navbar.Divider />
                            <Button className={Classes.MINIMAL} icon="reset" text="Reset" onClick={(_) => this.saveNewParams(this.defaults)} />
                            <Button className={Classes.MINIMAL} icon="print" text="Print" onClick={(_) => window.print()} />
                            <Button className={Classes.MINIMAL} icon="floppy-disk" text="Save SVG" onClick={(_) => this.saveSvg()} />
                        </Navbar.Group>
                    </Navbar>

                    <CalendarOptions
                        availableFonts={AVAILABLE_FONTS}
                        params={this.state.params}
                        onParametersChanged={params => this.saveNewParams(params)}
                    />
                </aside>
            </main>
        )
    }

}

ReactDOM.render(
    <App/>, document.getElementById('app')
)