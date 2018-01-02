import SVG from 'svg.js';
import FileSaver from 'file-saver';

SVG.Element.prototype.do = function(fn, ...args) {
  fn.call(this, ...args);
};

const calendarDefaults = {
  "year": 2018,
  "month": 1,

  "pageWidth": 210,
  "pageHeight": 297,

  "monthFontSize": 6,
  "monthFontColor": "#333",

  "headerFontSize": 4,
  "headerFontColor": "#333",

  "fontFamily": "Helvetica",
  "fontSize": 4,
  "fontColor": "#333",

  "contentStart": 80,
  "contentHorizontalMargin": 26,
  "dayX": 0.1,
  "dayNameX": 10,
  "dayDividerX": 30,

  "dayVerticalPadding": 1,
  "planLineMargin": 8,

  "monthVerticalMargin": 8,

  "headerPadding": 1.2,
  "headerBackground": "#d2e4f2",

  "lineColor": "#888"
};

class BoundFormParameters {
  constructor(targetFormSelector) {
    this.targetForm = document.querySelector(targetFormSelector);
    this.inputs = this.targetForm.querySelectorAll("input");
    this.values = {};

    this.inputHandler = e => {
      const eventTarget = e.target;

      this.values[eventTarget.name] = this.coerceInputValue(eventTarget);

      this.onValuesChange && this.onValuesChange(this.values);
    };
  }

  coerceInputValue(input) {
    let finalValue;

    const inputType = input.type || 'text';

    if (inputType === "number") {
      finalValue = parseFloat(input.value);

      if (input.min) {
        let minValue = parseFloat(input.min);
        if (finalValue < minValue) {
          finalValue = minValue;
        }
      }

      if (input.max) {
        let maxValue = parseFloat(input.max);
        if (finalValue > maxValue) {
          finalValue = maxValue;
        }
      }
    } else {
      finalValue = input.value;
    }

    return finalValue;
  }

  bind() {
    this.values = {};

    this.inputs.forEach(input => {
      this.values[input.name] = this.coerceInputValue(input);
    }, this);

    this.targetForm.addEventListener("input", this.inputHandler, false);

    return this;
  }

  setValues(values) {
    this.inputs.forEach(input => {
      if (values.hasOwnProperty(input.name)) {
        input.value = values[input.name];
      }
    });

    return this;
  }

  unbind() {
    this.targetForm.removeEventListener("input", this.inputHandler, false);

    this.values = {};

    return this;
  }
}

class CalendarPainter {
  constructor(targetId) {
    this.svg = SVG(targetId);
    this.opts = {};
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
    this.opts = opts;

    this.svg.clear();

    const localizedMonthName = new Date(opts.year, opts.month - 1, 1, 0, 0, 0, 0).toLocaleString(window.navigator.language, {
      month: 'long'
    });

    const mainGroup = this.svg.group().attr({
      transform: `translate(0 ${opts.contentStart})`
    });

    let rowY = 0;
    rowY += opts.monthFontSize;

    mainGroup.text(localizedMonthName).font({
      family: opts.fontFamily,
      size: opts.monthFontSize,
      anchor: 'middle',
      weight: 'bold'
    }).fill({
      color: opts.monthFontColor
    }).x(opts.pageWidth / 2);

    rowY += opts.monthVerticalMargin;

    const headerSize = opts.headerPadding * 2 + opts.headerFontSize;

    const columnSize = ((opts.pageWidth - opts.contentHorizontalMargin) - opts.dayDividerX) / 3;
    const secondDividerX = opts.dayDividerX + columnSize;
    const thirdDividerX = opts.dayDividerX + columnSize * 2;

    const headerBackground = mainGroup.rect(opts.pageWidth, headerSize).move(0, rowY).attr({
      "fill": opts.headerBackground
    });
    const contentGroup = mainGroup.group().attr({
      transform: `translate(${opts.contentHorizontalMargin / 2} 0)`
    });

    const headerFontStyle = function() {
      this.font({
        family: opts.fontFamily,
        size: opts.headerFontSize,
        anchor: 'middle'
      }).fill({
        color: opts.headerFontColor
      })
    }

    rowY += opts.headerPadding + opts.headerFontSize;

    contentGroup.text("HERS").move(opts.dayDividerX + columnSize / 2, rowY).do(headerFontStyle);
    contentGroup.text("OURS").move(secondDividerX + columnSize / 2, rowY).do(headerFontStyle);
    contentGroup.text("HIS").move(thirdDividerX + columnSize / 2, rowY).do(headerFontStyle);

    rowY += opts.headerPadding * 2;

    for (const {ordinal, localizedName, weekend} of this.generateDays(opts.year, opts.month)) {
      const contentFontStyle = function() {
        this.font({
          family: opts.fontFamily,
          size: opts.fontSize,
          weight: weekend ? 'bold' : 'normal'
        }).fill({
          color: opts.fontColor
        })
      }

      const lineStyle = function() {
        this.stroke({color: opts.lineColor, width: weekend ? 0.3 : 0.1});
      };

      rowY += opts.dayVerticalPadding + opts.fontSize

      contentGroup.text(String(ordinal)).move(opts.dayX, rowY).do(contentFontStyle);
      contentGroup.text(localizedName).move(opts.dayNameX, rowY).do(contentFontStyle);

      contentGroup.line();
      contentGroup.line(opts.dayDividerX + opts.planLineMargin, rowY, opts.dayDividerX + columnSize - opts.planLineMargin, rowY).do(lineStyle);
	    contentGroup.line(secondDividerX + opts.planLineMargin, rowY, secondDividerX + columnSize - opts.planLineMargin, rowY).do(lineStyle);
		  contentGroup.line(thirdDividerX + opts.planLineMargin, rowY, thirdDividerX + columnSize - opts.planLineMargin, rowY).do(lineStyle);

      rowY += opts.dayVerticalPadding
    }
  }

  getSvgSource() {
    return this.svg.svg();
  }

}

const parameters = new BoundFormParameters("aside form");
const painter = new CalendarPainter('page-svg');

parameters.onValuesChange = (values) => {
    painter.redraw(Object.assign({}, calendarDefaults, values));
};

parameters
  .setValues(calendarDefaults)
  .bind();

painter.redraw(calendarDefaults);

const saveButton = document.querySelector("#save-svg-button");
saveButton.addEventListener("click", e => {
  e.preventDefault();

  const year = (painter.opts && painter.opts.year) || 'unknown';
  const month = (painter.opts && painter.opts.month) || 'unknown';

  const svgBlob = new Blob([painter.getSvgSource()], {type: "image/svg+xml"});
  FileSaver.saveAs(svgBlob, `planner-${year}-${month}.svg`);
}, false);
