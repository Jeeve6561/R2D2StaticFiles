const Constants = {
  Ipaddress: "",
  Origin: "",
  ThisProgram: "R2D2",

  bgColor: "#000000",
  fontColor: "#a6a6a6",
  volColor: "#26678b",
  lineColor: "#EE4B2B",
  quadColor: "#FFFFFF",
  VolHeightPercent: 0.2,

  Database: {
    Name: "TradeData",
    Version: 1,
    Store: { name: "AllData", keyPath: "id", autoIncrement: false },
  },
  Db: 0,

  Id: 3,
  ZoneSymbol: "NVDA",
  Quadrant: "all",
  ZoneData: { h: [] },
  Thm: "",
  Min: 0,
  Sec: 0,
  Price: 0,
  DMult: 0,
  Size: 0,
  Lots: 0,
  Dmvd: 0,

  OpenDataBase: "openDB",
  DataUpdate: "updateddata",

  QualifierKpi: 6,
  QualifierTCnt: 30,

  xLogScale: false,
  yLogScale: false,
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  symbolinput: document.getElementById("symbolinput"),
  symbolinputbutton: document.getElementById("symbolinputbutton"),
  quadrantinput: document.getElementById("quadrantinput"),
  quadrantinputbutton: document.getElementById("quadrantinputbutton"),
  radartogglexlogscalebutton: document.getElementById("togglexlogscalebutton"),
  radartoggleylogscalebutton: document.getElementById("toggleylogscalebutton"),
  zoneOptions: document.getElementById("zoneOptions"),
};

const CanvasCharts = {
  Radar: new CanvasJS.Chart("radar", {
    animationEnabled: true,
    backgroundColor: Constants.bgColor,
    fontColor: Constants.fontColor,
    title: {
      text: "Loading",
      fontColor: Constants.fontColor,
    },
    axisX: {
      title: "Number of Trades",
      labelFontColor: Constants.fontColor,
      titleFontColor: Constants.fontColor,
      lineColor: Constants.fontColor,
      logarithmic: Constants.xLogScale,
      crosshair: {
        enabled: true,
        color: Constants.quadColor,
        lineDashType: "solid",
      },
    },
    axisY: {
      title: "Emin Acc",
      //includeZero: true,
      labelFontColor: Constants.fontColor,
      titleFontColor: Constants.fontColor,
      lineColor: Constants.fontColor,
      logarithmic: Constants.yLogScale,
      crosshair: {
        enabled: true,
        color: Constants.quadColor,
        lineDashType: "solid",
      },
    },
    // toolTip: {
    //   contentFormatter: contentFormatterTooltip,
    // },
    legend: {
      horizontalAlign: "left",
    },
    data: [
      {
        type: "bubble",
        // color: Constants.volColor,
        showInLegend: true,
        legendText: "Size of Bubble Represents Loading...",
        legendMarkerType: "circle",
        legendMarkerColor: "grey",
        // click: clickBubble,
        dataPoints: [],
      },
    ],
  }),
};

const Tables = {
  Zones: new Tabulator("#zonetable", {
    data: [],
    layout: "fitDataFill",
    // persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [{ column: "zone", dir: "asc" }],
    columns: [
      {
        title: "Zone",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Trade Status",
        field: "sts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Tail",
        field: "ts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Entry",
        field: "ent",
        topCalc: "count",
        hozAlign: "right",
      },
      // {
      //   title: "Exit",
      //   field: "ext",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      {
        title: "Dur",
        field: "dur",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "T Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Closed Shares",
        field: "cs",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Cl Dollars Traded",
        field: "cdmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Cpl/Sh",
        field: "cpls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Closed P&L",
        field: "cpl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open Shares",
        field: "os",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Op Dollars Traded",
        field: "odmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Opl/Sh",
        field: "opls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open P&L",
        field: "opl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Emin",
        field: "em",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Emin A",
        field: "ema",
        topCalc: "sum",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "Reds",
        field: "rex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Yells",
        field: "yex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Greens",
        field: "gex",
        topCalc: "sum",
        hozAlign: "right",
      },
      // {
      //   title: "Dur Mean",
      //   field: "dm",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Tot Dur",
      //   field: "dsum",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Dur % in Mkt",
      //   field: "dpc",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
    ],
  }),
  Quadrant1: new Tabulator("#quadrant1table", {
    data: [],
    layout: "fitDataFill",
    // persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [{ column: "zone", dir: "asc" }],
    columns: [
      {
        title: "Q1 Zones",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Trade Status",
        field: "sts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "T Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Tail",
        field: "ts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Entry",
        field: "ent",
        topCalc: "count",
        hozAlign: "right",
      },
      // {
      //   title: "Exit",
      //   field: "ext",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      {
        title: "Dur",
        field: "dur",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Opl/Sh",
        field: "oplps",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open P&L",
        field: "opl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Cpl/Sh",
        field: "cpls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Close P&L",
        field: "cpl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Emin",
        field: "em",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Emin A",
        field: "ema",
        topCalc: "sum",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "Shares",
        field: "s",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Reds",
        field: "rex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Yells",
        field: "yex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Greens",
        field: "gex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Dollars Traded",
        field: "dmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      // {
      //   title: "Dur Mean",
      //   field: "dm",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Tot Dur",
      //   field: "dsum",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Dur % in Mkt",
      //   field: "dpc",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
    ],
  }),
  Quadrant2: new Tabulator("#quadrant2table", {
    data: [],
    layout: "fitDataFill",
    // persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [{ column: "zone", dir: "asc" }],
    columns: [
      {
        title: "Q2 Zones",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Trade Status",
        field: "sts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "T Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Tail",
        field: "ts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Entry",
        field: "ent",
        topCalc: "count",
        hozAlign: "right",
      },
      // {
      //   title: "Exit",
      //   field: "ext",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      {
        title: "Dur",
        field: "dur",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Opl/Sh",
        field: "oplps",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open P&L",
        field: "opl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Cpl/Sh",
        field: "cpls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Close P&L",
        field: "cpl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Emin",
        field: "em",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Emin A",
        field: "ema",
        topCalc: "sum",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "Shares",
        field: "s",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Reds",
        field: "rex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Yells",
        field: "yex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Greens",
        field: "gex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Dollars Traded",
        field: "dmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      // {
      //   title: "Dur Mean",
      //   field: "dm",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Tot Dur",
      //   field: "dsum",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Dur % in Mkt",
      //   field: "dpc",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
    ],
  }),
  Quadrant3: new Tabulator("#quadrant3table", {
    data: [],
    layout: "fitDataFill",
    // persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [{ column: "zone", dir: "asc" }],
    columns: [
      {
        title: "Q3 Zones",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Trade Status",
        field: "sts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "T Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Tail",
        field: "ts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Entry",
        field: "ent",
        topCalc: "count",
        hozAlign: "right",
      },
      // {
      //   title: "Exit",
      //   field: "ext",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      {
        title: "Dur",
        field: "dur",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Opl/Sh",
        field: "oplps",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open P&L",
        field: "opl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Cpl/Sh",
        field: "cpls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Close P&L",
        field: "cpl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Emin",
        field: "em",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Emin A",
        field: "ema",
        topCalc: "sum",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "Shares",
        field: "s",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Reds",
        field: "rex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Yells",
        field: "yex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Greens",
        field: "gex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Dollars Traded",
        field: "dmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      // {
      //   title: "Dur Mean",
      //   field: "dm",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Tot Dur",
      //   field: "dsum",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Dur % in Mkt",
      //   field: "dpc",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
    ],
  }),
  Quadrant4: new Tabulator("#quadrant4table", {
    data: [],
    layout: "fitDataFill",
    // persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [{ column: "zone", dir: "asc" }],
    columns: [
      {
        title: "Q4 Zones",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Trade Status",
        field: "sts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "T Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Tail",
        field: "ts",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Entry",
        field: "ent",
        topCalc: "count",
        hozAlign: "right",
      },
      // {
      //   title: "Exit",
      //   field: "ext",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      {
        title: "Dur",
        field: "dur",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Opl/Sh",
        field: "oplps",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Open P&L",
        field: "opl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Cpl/Sh",
        field: "cpls",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Close P&L",
        field: "cpl",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      {
        title: "Emin",
        field: "em",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 2,
        },
      },
      {
        title: "Emin A",
        field: "ema",
        topCalc: "sum",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "Shares",
        field: "s",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
      {
        title: "Reds",
        field: "rex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Yells",
        field: "yex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Greens",
        field: "gex",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Dollars Traded",
        field: "dmvd",
        topCalc: "sum",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 2,
        },
      },
      // {
      //   title: "Dur Mean",
      //   field: "dm",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Tot Dur",
      //   field: "dsum",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
      // {
      //   title: "Dur % in Mkt",
      //   field: "dpc",
      //   topCalc: "avg",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 3,
      //   },
      // },
    ],
  }),
};

function main() {
  Constants.Ipaddress = DocElems.Ipaddress.innerHTML;
  DocElems.Ipaddress.innerHTML = "";
  Constants.Origin = "http://" + Constants.Ipaddress + ":50000/";

  DocElems.symbolinputbutton.addEventListener("click", clickSymbolInput);
  DocElems.symbolinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clickSymbolInput();
    }
  });
  DocElems.quadrantinputbutton.addEventListener("click", clickQuadrantInput);
  DocElems.quadrantinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      clickQuadrantInput();
    }
  });
  DocElems.radartogglexlogscalebutton.addEventListener(
    "click",
    ToggleXRadarScale
  );
  DocElems.radartoggleylogscalebutton.addEventListener(
    "click",
    ToggleYRadarScale
  );

  CanvasCharts.Radar.render();

  const childWorker = new Worker("/static/js/websocket.js");
  childWorker.postMessage({
    dbname: Constants.Database.Name,
    ip: Constants.Ipaddress,
    id: Constants.Id,
  });
  childWorker.onmessage = (event) => {
    let msg = event.data;
    switch (msg.ev) {
      case Constants.OpenDataBase:
        console.log("Opening database");
        const request = indexedDB.open(
          Constants.Database.Name,
          Constants.Database.Version
        );
        request.onsuccess = (event) => {
          Constants.Db = request.result;
        };
        request.onerror = (event) => {
          console.error("Couldn't open database");
        };
        break;
      case Constants.DataUpdate:
        HandleZoneData(msg.id);
        break;
    }
  };
}

function HandleZoneData(id) {
  GetRadarDataFromDB(id);
  let d = [];
  let d1 = [];
  let d2 = [];
  let d3 = [];
  let d4 = [];

  let data = Constants.ZoneData.h;

  if (data.length === 0) {
    // Tables.Zones.setData(d);
    Tables.Zones.clearData();
    Tables.Quadrant1.clearData();
    Tables.Quadrant2.clearData();
    Tables.Quadrant3.clearData();
    Tables.Quadrant4.clearData();
    return;
  }

  // let elem = [];
  data.forEach((e) => {
    if (e.sym === Constants.ZoneSymbol) {
      Constants.Thm = e.ht.h;
      Constants.Min = e.ht.m;
      Constants.Sec = e.ht.s;
      Constants.Price = e.p;
      Constants.DMult = e.dm;
      Constants.Size = e.s;
      Constants.Lots = e.lts;
      Constants.Dmvd = e.dmvd;

      DocElems.zoneOptions.innerHTML =
        Constants.Thm +
        "  |  Min: " +
        Constants.Min +
        "  |  Sec: " +
        Constants.Sec +
        "  |  " +
        Constants.ZoneSymbol +
        "  |  Price: " +
        Constants.Price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }) +
        "  |  Dollar Multiplier: " +
        Constants.DMult.toFixed(5) +
        "  |  Shares: " +
        Constants.Size.toFixed(0) +
        "  |  Lots: " +
        Constants.Lots.toFixed(0) +
        "  |  Dollars Traded: " +
        Constants.Dmvd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      d = e.h;
    }
  });

  d.forEach((e) => {
    if (e.q === 1) {
      d1.push(e);
    }
    if (e.q === 2) {
      d2.push(e);
    }
    if (e.q === 3) {
      d3.push(e);
    }
    if (e.q === 4) {
      d4.push(e);
    }
  });

  Tables.Zones.setData(d);
  Tables.Quadrant1.setData(d1);
  Tables.Quadrant2.setData(d2);
  Tables.Quadrant3.setData(d3);
  Tables.Quadrant4.setData(d4);

  d.forEach((elem) => {
    elem.x = elem.cnt;
    elem.y = elem.ema;
    elem.z = elem.dur;
  });

  let dx = [];
  let dy = [];

  d.forEach((elem) => {
    if (elem.x > 0 || !Constants.xLogScale) {
      dx.push(elem);
    }
  });

  dx.forEach((elem) => {
    if (elem.y > 0 || !Constants.yLogScale) {
      dy.push(elem);
    }
  });

  CanvasCharts.Radar.options.title.text = Constants.ZoneSymbol;
  CanvasCharts.Radar.options.data[0].dataPoints = dy;
  CanvasCharts.Radar.axisX[0].crosshair.showAt(Constants.QualifierTCnt);
  CanvasCharts.Radar.axisY[0].crosshair.showAt(Constants.QualifierKpi);
  CanvasCharts.Radar.render();
}

function GetRadarDataFromDB(id) {
  const request = Constants.Db.transaction(
    Constants.Database.Store.name,
    "readonly"
  )
    .objectStore(Constants.Database.Store.name)
    .get(id);
  request.onsuccess = (event) => {
    Constants.ZoneData = request.result;
  };
  request.onerror = (event) => {
    console.error("Couldn't retrieve data from db");
  };
}

function clickSymbolInput() {
  let temp = DocElems.symbolinput.value;
  Constants.ZoneSymbol = temp.toUpperCase();
  DocElems.symbolinput.value = "";
}

function clickQuadrantInput() {
  Constants.Quadrant = DocElems.quadrantinput.value;
}

function ToggleXRadarScale() {
  if (Constants.xLogScale) {
    Constants.xLogScale = false;
    DocElems.radartogglexlogscalebutton.innerHTML = "X Log Scale";
    CanvasCharts.Radar.options.axisX.logarithmic = Constants.xLogScale;
  } else {
    Constants.xLogScale = true;
    DocElems.radartogglexlogscalebutton.innerHTML = "X Linear Scale";
    CanvasCharts.Radar.options.axisX.logarithmic = Constants.xLogScale;
  }
}

function ToggleYRadarScale() {
  if (Constants.yLogScale) {
    Constants.yLogScale = false;
    DocElems.radartoggleylogscalebutton.innerHTML = "Y Log Scale";
    CanvasCharts.Radar.options.axisY.logarithmic = Constants.yLogScale;
  } else {
    Constants.yLogScale = true;
    DocElems.radartoggleylogscalebutton.innerHTML = "Y Linear Scale";
    CanvasCharts.Radar.options.axisY.logarithmic = Constants.yLogScale;
  }
}

main();
