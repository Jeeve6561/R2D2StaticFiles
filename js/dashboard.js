const Constants = {
  st: 0,
  et: 0,

  stime: 0,
  etime: 0,

  testTime: 0,

  bgColor: "#000000",
  fontColor: "#a6a6a6",
  volColor: "#26678b",
  lineColor: "#EE4B2B",
  quadColor: "#FFFFFF",
  VolHeightPercent: 0.2,

  Origin: "",

  RequestWSUrl: "",
  RequestWSExt: ":55555/wstacstream",
  TacDataRequest: "tacdatarequest",
  RadarDataRequest: "radardatarequest",
  Ev_Payload: "sympayload",
  ConnectMsg: "connected",
  ThisProgram: "R2D2",

  Database: {
    Name: "RadarData",
    Version: 1,
    Store: { name: "Bubbles", keyPath: "id", autoIncrement: false },
  },
  Db: 0,

  OnlineInfoUrl: "https://finance.yahoo.com/quote/",

  CurrentTime: "",
  CurrentMin: 0,
  CurrentSec: 0,

  XAxisShift: 0,
  YAxisShift: 0,

  RadarZoomSensitivity: 2500,

  //   Rank: {
  //     tbs: 0.6,
  //     pv: 0.3,
  //     lps: 0.05,
  //     dt: 0.03,
  //     tcnt: 0.02,
  //     stars: 5,
  //     maxDollar: 0,
  //   },

  Rank: {
    tbs: 0.2,
    pv: 0.2,
    lps: 0.2,
    dt: 0.2,
    tcnt: 0.2,
    stars: 5,
    maxDollar: 0,
  },

  Kpi: 0.06,
  MinInTradeDay: 390,

  LogScale: true,

  Drawing: false,
};

const DocElems = {
  resetScalingBtn: document.getElementById("stockChartResetZoom"),
  radarchart: document.getElementById("radarchart"),
  radaraddfilterbutton: document.getElementById("radarchartaddfilterbutton"),
  radarclearfilterbutton: document.getElementById(
    "radarchartclearfilterbutton"
  ),
  fullscreenradarbutton: document.getElementById("fullscreenradarchart"),
  radarfilterquan: document.getElementById("radarchartfilterquan"),
  radarfiltertype: document.getElementById("radarchartfiltertype"),
  radarfiltervalue: document.getElementById("radarchartfiltervalue"),
  radarsolosfilterbutton: document.getElementById("solosfilterbutton"),
  radardicksfilterbutton: document.getElementById("dicksfilterbutton"),
  radartogglelogscalebutton: document.getElementById("togglelogscalebutton"),
  radartogglecolorbutton: document.getElementById("togglecolorbutton"),
  radarpausebutton: document.getElementById("toggleradarbutton"),
  stockchart: document.getElementById("stockchart"),
  fullscreenstockbutton: document.getElementById("fullscreenstockchart"),
  stockdrawingbutton: document.getElementById("stockChartDrawing"),
  filtersdiv: document.getElementById("currentfilters"),
  timediv: document.getElementById("currenttime"),
  statchartOpts: document.getElementById("statchartsOptions"),
};

const RequestWS = {
  init: false,
  connected: false,
  connectTime: 0,
  disconnectTime: 0,
  ws: null,

  connect() {
    RequestWS.connected = true;
    RequestWS.url = Constants.RequestWSUrl;
    RequestWS.ws = new WebSocket(RequestWS.url);
    RequestWS.ws.onopen = RequestWS.openSocket;
    RequestWS.ws.onclose = RequestWS.closeSocket;
    RequestWS.ws.onerror = RequestWS.errorSocket;
    RequestWS.ws.onmessage = RequestWS.messageReceived;
  },

  openSocket() {
    RequestWS.connected = true;
    RequestWS.connectTime = new Date();
    console.log(
      "Connecting to " +
        String(RequestWS.url) +
        " at " +
        String(RequestWS.connectTime)
    );
  },

  closeSocket() {
    RequestWS.connected = false;
    RequestWS.disconnectTime = new Date();
    console.log(
      "Disconnecting from " + String(RequestWS.url) + " at ",
      String(RequestWS.disconnectTime)
    );
    RequestWS.ws = null;
  },

  errorSocket(event) {
    console.error(
      "Error occurred in " +
        String(RequestWS.url) +
        " at " +
        String(new Date()) +
        " | " +
        event.data
    );
  },

  messageReceived(event) {
    // Constants.stime = performance.now();
    let msg = JSON.parse(event.data);
    switch (msg.ev) {
      case Constants.ConnectMsg:
        console.log("Name of socket manager:", msg.n);
        break;
      case Constants.TacDataRequest:
        if (!Constants.Drawing) {
          UpdateStockChart(msg.d);
        } else if (!Constants.Drawing) {
          console.warn("Received a warning message:", data);
        }
        //Constants.etime = performance.now()
        // console.log("--------------------------------------" + GraphData.request.sym +" loading performance:", Constants.etime - Constants.stime, "--------------------------------------");
        break;
      case Constants.RadarDataRequest:
        UpdateStockChart(msg.d.d, msg.d.sym);
        // Constants.etime = performance.now()
        // console.log("-------------------------------------- loading performance:", Constants.etime - Constants.stime, "--------------------------------------");
        break;
      default:
        console.log(data);
        break;
    }
    // console.log("Message received:", data);
  },

  sendMessage(d) {
    if (RequestWS.ws.readyState === WebSocket.OPEN && RequestWS.connected) {
      let msg = {
        d: d,
        n: Constants.ThisProgram,
        ev: d.ev,
      };
      let data = JSON.stringify(msg);
      RequestWS.ws.send(data);
    } else {
      console.error("Failed to send and retrying");
      setTimeout(() => {
        RequestWS.sendMessage(d);
      }, 1000);
    }
  },
};

const GraphData = {
  LiveUpdate: false,
  LiveUpdateInit: false,
  RadarUpdate: true,
  ChangeStockTitle: true,
  ChangeRadarTitle:true,
  PrevMaxVal: 0,
  PrevMinVal: 0,
  // request1: {
  //   sym: "TSLA",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request2: {
  //   sym: "AMD",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request3: {
  //   sym: "GOOG",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request4: {
  //   sym: "GOOGL",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request5: {
  //   sym: "DE",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request6: {
  //   sym: "BABA",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request7: {
  //   sym: "GRPN",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request8: {
  //   sym: "NVDA",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request9: {
  //   sym: "FL",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  // request10: {
  //   sym: "FTCH",
  //   tid: 0,
  //   ev: Constants.TacDataRequest,
  // },
  TopTen: new Map(),
  RadarData: [],
  FilterId: 1,
  radarFilters: new Map([[0, { quan: "tcnt", comp: ">", val: "0" }]]),
  radarFiltersNameMap: new Map([
    ["tcnt", "Tick Count"],
    ["pv", "Price Volatility"],
    ["lps", "Lots/Sec"],
    ["tbs", "Time to Beat Spread"],
    ["dm", "Dollars Traded"],
  ]),
  lineCoords: {},
  xMinimum: Infinity,
  xMaximum: 0,
  yMinimum: Infinity,
  yMaximum: 0,
  radarXthreshold: 0,
  radarYthreshold: 0,
  PrevXMaxVal: 0,
  PrevXMinVal: 0,
  PrevYMaxVal: 0,
  PrevYMinVal: 0,
};

const CanvasCharts = {
  Stock: new CanvasJS.StockChart("stockchartContainer", {
    // zoomEnabled: true,
    title: {
      text: "Loading",
      fontColor: Constants.fontColor,
    },
    exportEnabled: false,
    backgroundColor: Constants.bgColor,
    fontColor: Constants.fontColor,
    animationEnabled: true,
    rangeChanging: function (e) {
      GraphData.LiveUpdate = false;
      DocElems.resetScalingBtn.innerHTML = "Reset Scaling";
    },
    charts: [
      {
        toolTip: {
          shared: true,
          contentFormatter: contentFormatterEminRA,
        },
        legend: {
          cursor: "pointer",
          verticalAlign: "top",
          horizontalAlign: "center",
        },
        axisX: [
          {
            crosshair: {
              enabled: true,
              snapToDataPoint: true,
              color: Constants.fontColor,
            },
            labelFontColor: Constants.fontColor,
            titleFontColor: Constants.fontColor,
            lineColor: Constants.fontColor,
            minimum: null,
            maximum: null,
            labelFormatter: labelFormatterX,
          },
          {
            crosshair: {
              enabled: false,
              snapToDataPoint: false,
              color: Constants.fontColor,
            },
            labelFontColor: Constants.fontColor,
            titleFontColor: Constants.fontColor,
            lineColor: Constants.fontColor,
            minimum: null,
            maximum: null,
          },
        ],
        axisY2: {
          crosshair: {
            enabled: false,
            color: Constants.fontColor,
            includeZero: true,
          },
          labelFontColor: Constants.fontColor,
          titleFontColor: Constants.fontColor,
          lineColor: Constants.fontColor,
          logarithmic: true,
          labelFormatter: labelFormatterY1,
        },
        data: [
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
          {
            name: "EMinRAcc",
            showInLegend: true,
            type: "line",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },
            dataPoints: [],
          },
        ],
      },
      // {
      //   toolTip: {
      //     shared: true,
      //     reversed: true,
      //     contentFormatter: contentFormatterBottom,
      //   },
      //   height:
      //     Constants.VolHeightPercent *
      //     document.getElementById("stockchartContainer").clientHeight,
      //   axisX: {
      //     minimum: null,
      //     maximum: null,
      //   },
      //   axisY2: {
      //     includeZero: true,
      //     labelFontColor: Constants.fontColor,
      //     titleFontColor: Constants.fontColor,
      //     lineColor: Constants.fontColor,
      //     labelFormatter: labelFormatterY2,
      //   },
      //   data: [
      //     {
      //       name: "Volume",
      //       axisYType: "secondary",
      //       axisX: {
      //         title: "Time",
      //       },
      //       axisY2: {
      //         title: "Volume",
      //       },
      //       color: Constants.volColor,

      //       dataPoints: [],
      //     },
      //   ],
      // },
    ],
    navigator: {
      enabled: true,
      slider: {
        minimum: null,
        maximum: null,
      },
    },
    rangeSelector: {
      enabled: false,
      buttons: [
        {
          label: "1 Hour",
          range: 1,
          rangeType: "hour",
        },
        {
          label: "2 Hours",
          range: 2,
          rangeType: "hour",
        },
        {
          label: "3 Hours",
          range: 3,
          rangeType: "hour",
        },
        {
          label: "Show All",
          rangeType: "all",
        },
      ],
      buttonStyle: {
        backgroundColor: Constants.bgColor,
        labelFontColor: Constants.fontColor,
      },
      inputFields: {
        style: {
          backgroundColor: Constants.bgColor,
          fontColor: Constants.fontColor,
        },
      },
    },
  }),

  Radar: new CanvasJS.Chart("radarcontainer", {
    animationEnabled: true,
    backgroundColor: Constants.bgColor,
    fontColor: Constants.fontColor,
    title: {
      text: "Loading",
      fontColor: Constants.fontColor,
    },
    axisX: {
      title: "Tick Count",
      labelFontColor: Constants.fontColor,
      titleFontColor: Constants.fontColor,
      lineColor: Constants.fontColor,
      logarithmic: Constants.LogScale,
      crosshair: {
        enabled: true,
        color: Constants.quadColor,
        lineDashType: "solid",
      },
    },
    axisY: {
      title: "Price Volatility",
      //includeZero: true,
      labelFontColor: Constants.fontColor,
      titleFontColor: Constants.fontColor,
      lineColor: Constants.fontColor,
      logarithmic: Constants.LogScale,
      crosshair: {
        enabled: true,
        color: Constants.quadColor,
        lineDashType: "solid",
      },
    },
    toolTip: {
      contentFormatter: contentFormatterTooltip,
    },
    legend: {
      horizontalAlign: "left",
    },
    data: [
      {
        type: "bubble",
        // color: Constants.volColor,
        showInLegend: true,
        legendText: "Size of Bubble Represents Dollars Traded for the day",
        legendMarkerType: "circle",
        legendMarkerColor: "grey",
        click: clickBubble,
        dataPoints: [],
      },
    ],
  }),
};

const Tables = {
  radardata: new Tabulator("#tableofradar", {
    data: [],
    layout: "fitDataFill",
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    pagination: true,
    movableColumns: true,
    initialSort: [{ column: "eminracc", dir: "desc" }],
    columns: [
      {
        title: "Sym",
        field: "name",
        topCalc: "count",
        cellClick: ClickRadarTableCell,
        frozen: true,
      },
      { title: "Rank", field: "rank", topCalc: "count" },
      {
        title: "Rating",
        field: "score",
        topCalc: "count",
        cellClick: ClickRadarTableCell,
        formatter: "star",
        formatterParams: {
          star: Constants.Rank.stars,
        },
      },
      {
        title: "Q",
        field: "quad",
        topCalc: (vals) => {
          let q1 = 0,
            q2 = 0,
            q3 = 0,
            q4 = 0;
          vals.forEach((v) => {
            if (v === 1) {
              q1++;
            } else if (v === 2) {
              q2++;
            } else if (v === 3) {
              q3++;
            } else if (v === 4) {
              q4++;
            } else {
              console.warn("Got an invalid quadrant");
            }

            DocElems.statchartOpts.innerHTML =
              " | Q1:" +
              String(q1) +
              " Q2:" +
              String(q2) +
              " Q3:" +
              String(q3) +
              " Q4:" +
              String(q4);
          });
        },
        cellClick: ClickRadarTableCell,
      },
      {
        title: "Emin",
        field: "emin",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 2,
        },
      },
      {
        title: "EminAcc",
        field: "eminacc",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 2,
        },
      },
      {
        title: "EminR",
        field: "eminr",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 2,
        },
      },
      {
        title: "EminRAcc",
        field: "eminracc",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 2,
        },
      },
      {
        title: "TtBS",
        field: "tbs",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 3,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 3,
        },
      },
      {
        title: "Volatility",
        field: "y",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
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
        title: "Lots/Sec",
        field: "lps",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          precision: 2,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          precision: 2,
        },
      },
      {
        title: "Dollars Traded",
        field: "z",
        topCalc: "sum",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 0,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 0,
        },
      },
      {
        title: "Progress",
        field: "dp",
        topCalc: "max",
        cellClick: ClickRadarTableCell,
        formatter: "progress",
        formatterParams: {
          min: 0,
          max: Constants.Rank.maxDollar,
          // legendAlign: "center",
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          symbol: "$",
          precision: 0,
        },
      },
      {
        title: "Tick Count",
        field: "x",
        topCalc: "avg",
        cellClick: ClickRadarTableCell,
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
        },
      },
      {
        title: "Volume",
        field: "v",
        topCalc: "sum",
        cellClick: ClickRadarTableCell,
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 0,
        },
      },
    ],
  }),
};

function main() {
  // const st = performance.now();
  // window.open('/','_blank', 'toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,left=10000, top=10000, width=10, height=10, visible=none', '');

  Constants.Ipaddress = DocElems.statchartOpts.innerHTML;
  DocElems.statchartOpts.innerHTML = "";
  Constants.Origin = "http://" + Constants.Ipaddress + ":50000/";
  Constants.RequestWSUrl =
    "ws://" + Constants.Ipaddress + Constants.RequestWSExt;

  const parentWorker = new Worker("/static/js/websocket.js");
  parentWorker.postMessage(Constants.Ipaddress);

  let onloadfilters = new Map(JSON.parse(localStorage.getItem("radarfilters")));
  if (onloadfilters.size > 0) {
    GraphData.radarFilters = onloadfilters;
  }

  RequestWS.connect();

  CanvasCharts.Stock.render();
  CanvasCharts.Stock.charts[0].container
    .getElementsByClassName("canvasjs-chart-canvas")[1]
    .addEventListener("mousedown", StartLine);
  CanvasCharts.Stock.charts[0].container
    .getElementsByClassName("canvasjs-chart-canvas")[1]
    .addEventListener("mouseup", EndLine);
  CanvasCharts.Stock.charts[0].container.addEventListener(
    "wheel",
    AddWheelScroll
  );
  DocElems.resetScalingBtn.addEventListener("click", ResetGraphScaling);
  DocElems.fullscreenstockbutton.addEventListener("click", () =>
    Fullscreen(DocElems.stockchart)
  );
  DocElems.stockdrawingbutton.addEventListener("click", ToggleDrawing);

  CanvasCharts.Radar.render();

  DocElems.radaraddfilterbutton.addEventListener("click", AddRadarFilter);
  DocElems.radarclearfilterbutton.addEventListener("click", ClearRadarFilters);
  DocElems.radarsolosfilterbutton.addEventListener("click", SolosRadarFilters);
  DocElems.radardicksfilterbutton.addEventListener("click", DicksRadarFilters);
  DocElems.radartogglelogscalebutton.addEventListener(
    "click",
    ToggleRadarScale
  );
  DocElems.radartogglecolorbutton.addEventListener(
    "click",
    ToggleBubbleColorFlash
  );
  DocElems.radarpausebutton.addEventListener("click", ToggleRadar);
  DocElems.fullscreenradarbutton.addEventListener("click", () =>
    Fullscreen(DocElems.radarchart)
  );
  CanvasCharts.Radar.container.addEventListener("wheel", AddWheelScrollRadar);

  LoadFiltersOnScreen();

  setTimeout(() => {
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

    setInterval(() => {
      UpdateRadarChart();
      // console.log("Reading time takes:", performance.now() - Constants.testTime);
      // Constants.testTime = performance.now();
    }, 400);

    setInterval(() => {
      GraphData.TopTen.forEach((val, key) => {
        RequestWS.sendMessage({
          sym: key,
          rank: val,
          ev: Constants.RadarDataRequest,
        });
      });
    }, 1000);

    setInterval(() => {
      CanvasCharts.Stock.render();
    }, 2000);
  }, 1000);
}

function AddWheelScroll(e) {
  e.preventDefault();

  var slider = CanvasCharts.Stock.navigator.slider;
  var sliderMinimum = slider.get("minimum"),
    sliderMaximum = slider.get("maximum");

  var interval = (slider.get("maximum") - slider.get("minimum")) / 10; // change interval based on the range of chart
  var newMin, newMax;

  if (e.deltaY < 0) {
    newMin = sliderMinimum + interval;
    newMax = sliderMaximum - interval;
  } else if (e.deltaY > 0) {
    newMin = sliderMinimum - interval;
    newMax = sliderMaximum + interval;
  }

  if (
    newMax < CanvasCharts.Stock.navigator.axisX[0].get("maximum") ||
    newMin > CanvasCharts.Stock.navigator.axisX[0].get("minimum")
  ) {
    CanvasCharts.Stock.navigator.slider.set("minimum", newMin, false);
    CanvasCharts.Stock.navigator.slider.set("maximum", newMax);
  }
  GraphData.PrevMaxVal = slider.maximum;
  GraphData.PrevMinVal = slider.minimum;
  GraphData.LiveUpdate = false;
  DocElems.resetScalingBtn.innerHTML = "Reset Scaling";
}

function AddWheelScrollRadar(e) {
  e.preventDefault();

  if (e.deltaY < 0) {
    var xMinimum = CanvasCharts.Radar.axisX[0].get("minimum"),
      xMaximum = CanvasCharts.Radar.axisX[0].get("maximum"),
      yMinimum = CanvasCharts.Radar.axisY[0].get("minimum"),
      yMaximum = CanvasCharts.Radar.axisY[0].get("maximum");

    var xinterval = (xMaximum - xMinimum) / Constants.RadarZoomSensitivity,
      yinterval = (yMaximum - yMinimum) / Constants.RadarZoomSensitivity; // change interval based on the range of chart
    var newxMin, newxMax, newyMin, newyMax;

    newxMin = xMinimum + xinterval;
    newxMax = xMaximum - xinterval;
    newyMin = yMinimum + yinterval;
    newyMax = yMaximum - yinterval;

    CanvasCharts.Radar.axisX[0].set("minimum", newxMin, false);
    CanvasCharts.Radar.axisX[0].set("maximum", newxMax, false);
    CanvasCharts.Radar.axisY[0].set("minimum", newyMin, false);
    CanvasCharts.Radar.axisY[0].set("maximum", newyMax);
    GraphData.PrevXMaxVal = xMaximum;
    GraphData.PrevXMinVal = xMinimum;
    GraphData.PrevYMaxVal = yMaximum;
    GraphData.PrevYMinVal = yMinimum;
    GraphData.RadarUpdate = false;
    DocElems.radarpausebutton.innerHTML = "Reset Scaling";
  } else {
    CanvasCharts.Radar.axisX[0].set("minimum", GraphData.PrevXMinVal, false);
    CanvasCharts.Radar.axisX[0].set("maximum", GraphData.PrevXMaxVal, false);
    CanvasCharts.Radar.axisY[0].set("minimum", GraphData.PrevYMinVal, false);
    CanvasCharts.Radar.axisY[0].set("maximum", GraphData.PrevYMaxVal);
    GraphData.PrevXMaxVal = GraphData.PrevXMinVal;
    GraphData.PrevXMinVal = GraphData.PrevXMaxVal;
    GraphData.PrevYMaxVal = GraphData.PrevYMinVal;
    GraphData.PrevYMinVal = GraphData.PrevYMaxVal;
    GraphData.RadarUpdate = true;
    DocElems.radarpausebutton.innerHTML = "Updating Live";
  }
}

function ResetGraphScaling() {
  if (GraphData.LiveUpdate) {
    GraphData.LiveUpdate = false;
    DocElems.resetScalingBtn.innerHTML = "Reset Scaling";
  } else {
    GraphData.LiveUpdate = true;
    DocElems.resetScalingBtn.innerHTML = "Updating Live";
  }
}

function contentFormatterEminRA(e) {
  let toReturn = "Time: " + e.entries[0].dataPoint.l;
  e.entries.forEach((val) => {
    toReturn =
      toReturn +
      "<hr/>Sym: " +
      val.dataPoint.sym +
      " | Rank: " +
      val.dataPoint.rank +
      " | EminRA: " +
      val.dataPoint.y.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
  });
  return toReturn;
}

function contentFormatterTop(e) {
  return (
    e.entries[0].dataPoint.sym +
    "<hr/>Time: " +
    e.entries[0].dataPoint.l +
    "<hr/>Trade Price: " +
    e.entries[0].dataPoint.y +
    "<hr/>Ask: " +
    e.entries[1].dataPoint.y[1] +
    " Bid: " +
    e.entries[1].dataPoint.y[0]
  );
}

function contentFormatterBottom(e) {
  return "Volume: " + e.entries[0].dataPoint.y;
}

function contentFormatterTooltip(e) {
  return (
    e.entries[0].dataPoint.name +
    "<hr/>Earned Min: " +
    e.entries[0].dataPoint.emin.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) +
    "<hr/>Tick Count: " +
    String(e.entries[0].dataPoint.x) +
    "<hr/>Price Volatility: " +
    e.entries[0].dataPoint.y.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) +
    "<hr/>Dollars Traded: " +
    e.entries[0].dataPoint.z.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    }) +
    "<hr/>Time to Beat Spread: " +
    e.entries[0].dataPoint.tbs.toLocaleString() +
    "<hr/>Lots per Second: " +
    e.entries[0].dataPoint.lps.toLocaleString() +
    "<hr/>Volume: " +
    e.entries[0].dataPoint.v.toLocaleString() +
    "<hr/>Rank: " +
    e.entries[0].dataPoint.rank.toLocaleString()
  );
}

function labelFormatterX(e) {
  return e.value.toLocaleTimeString();
}

function labelFormatterY1(e) {
  if (Number.isInteger(e.value)) {
    return String(e.value) + ".00";
  } else if (Number.isInteger(e.value * 10)) {
    return String(Math.round(e.value * 10) / 10) + "0";
  } else {
    return String(Math.round(e.value * 100) / 100);
  }
}

function labelFormatterY2(e) {
  if (e.value < 1000) {
    return String(e.value);
  } else if (e.value < 1000000) {
    return String(e.value / 1000) + "K";
  } else if (e.value < 1000000000) {
    return String(e.value / 1000000) + "M";
  } else {
    return String(e.value / 1000000000) + "B";
  }
}

function UpdateStockChart(data, sym) {
  if (GraphData.ChangeRadarTitle) {
    CanvasCharts.Radar.options.title.text = "Profiling Radar";
    CanvasCharts.Radar.render();
    GraphData.ChangeRadarTitle = false;
  }
  let i = GraphData.TopTen.get(sym);

  let tp = [];
  let xval;

  data.forEach((elem) => {
    if (elem.eminracc > 0) {
      xval = new Date(elem.ht.u);
      tp.push({
        x: xval,
        y: elem.eminracc,
        l: elem.ht.h,
        sym: sym,
        rank: i + 1,
      });
    }
  });

  CanvasCharts.Stock.options.charts[0].data[i].dataPoints = tp;
  CanvasCharts.Stock.options.charts[0].data[i].name = String(i + 1) + " " + sym;

  // console.log("Unix: ", data[0].t, " Hal string: ", data[0].th);

  if (GraphData.LiveUpdate) {
    if (!GraphData.LiveUpdateInit) {
      CanvasCharts.Stock.options.navigator.slider.maximum = tp[0].x;
      CanvasCharts.Stock.options.navigator.slider.minimum = xval;
      GraphData.LiveUpdateInit = true;
    } else if (
      GraphData.PrevMaxVal ===
        CanvasCharts.Stock.options.navigator.slider.maximum &&
      GraphData.PrevMinVal ===
        CanvasCharts.Stock.options.navigator.slider.minimum
    ) {
      CanvasCharts.Stock.options.navigator.slider.maximum = tp[0].x;
      CanvasCharts.Stock.options.navigator.slider.minimum = xval;
      // console.log("Same update values");
    } else {
      GraphData.LiveUpdate = false;
      GraphData.LiveUpdateInit = false;
      // console.log("Not same update values");
    }
    GraphData.PrevMaxVal = CanvasCharts.Stock.options.navigator.slider.maximum;
    GraphData.PrevMinVal = CanvasCharts.Stock.options.navigator.slider.minimum;
  }

  // CanvasCharts.Stock.render();
}

function UpdateRadarChart() {
  GetRadarDataFromDB();
  if (GraphData.RadarData === undefined || GraphData.RadarData.length === 0) {
    return;
  }
  if (GraphData.ChangeStockTitle) {
    CanvasCharts.Stock.options.title.text = "Top Ten Ranked";
    CanvasCharts.Stock.render();
    GraphData.ChangeStockTitle = false;
  }
  let data = GraphData.RadarData.r;
  Constants.CurrentSec = GraphData.RadarData.sec;
  Constants.CurrentMin = Math.floor(GraphData.RadarData.sec / 60);
  Constants.CurrentTime = GraphData.RadarData.thm;
  if (
    CanvasCharts.Radar.axisX[0].maximum === null ||
    isNaN(CanvasCharts.Radar.axisX[0].maximum) ||
    !isFinite(CanvasCharts.Radar.axisX[0].maximum) ||
    CanvasCharts.Radar.axisX[0].maximum === undefined ||
    CanvasCharts.Radar.axisX[0].minimum === null ||
    isNaN(CanvasCharts.Radar.axisX[0].minimum) ||
    !isFinite(CanvasCharts.Radar.axisX[0].minimum) ||
    CanvasCharts.Radar.axisX[0].minimum === undefined ||
    CanvasCharts.Radar.axisY[0].maximum === null ||
    isNaN(CanvasCharts.Radar.axisY[0].maximum) ||
    !isFinite(CanvasCharts.Radar.axisY[0].maximum) ||
    CanvasCharts.Radar.axisY[0].maximum === undefined ||
    CanvasCharts.Radar.axisY[0].minimum === null ||
    isNaN(CanvasCharts.Radar.axisY[0].minimum) ||
    !isFinite(CanvasCharts.Radar.axisY[0].minimum) ||
    CanvasCharts.Radar.axisY[0].minimum === undefined
  ) {
    GraphData.RadarUpdate = true;
    DocElems.radarpausebutton.innerHTML = "Updating Live";
    CanvasCharts.Radar.axisX[0].set("minimum", GraphData.xMinimum, false);
    CanvasCharts.Radar.axisX[0].set("maximum", GraphData.xMaximum, false);
    CanvasCharts.Radar.axisY[0].set("minimum", GraphData.yMinimum, false);
    CanvasCharts.Radar.axisY[0].set("maximum", GraphData.yMaximum);
    GraphData.PrevXMaxVal = GraphData.xMaximum;
    GraphData.PrevXMinVal = GraphData.xMinimum;
    GraphData.PrevYMaxVal = GraphData.yMaximum;
    GraphData.PrevYMinVal = GraphData.yMinimum;
  } else if (
    GraphData.PrevXMaxVal === CanvasCharts.Radar.axisX[0].maximum &&
    GraphData.PrevXMinVal === CanvasCharts.Radar.axisX[0].minimum &&
    GraphData.PrevYMaxVal === CanvasCharts.Radar.axisY[0].maximum &&
    GraphData.PrevYMinVal === CanvasCharts.Radar.axisY[0].minimum
  ) {
    GraphData.RadarUpdate = true;
    DocElems.radarpausebutton.innerHTML = "Updating Live";
    CanvasCharts.Radar.axisX[0].set("minimum", GraphData.xMinimum, false);
    CanvasCharts.Radar.axisX[0].set("maximum", GraphData.xMaximum, false);
    CanvasCharts.Radar.axisY[0].set("minimum", GraphData.yMinimum, false);
    CanvasCharts.Radar.axisY[0].set("maximum", GraphData.yMaximum);
    GraphData.PrevXMaxVal = GraphData.xMaximum;
    GraphData.PrevXMinVal = GraphData.xMinimum;
    GraphData.PrevYMaxVal = GraphData.yMaximum;
    GraphData.PrevYMinVal = GraphData.yMinimum;
  } else {
    GraphData.RadarUpdate = false;
    DocElems.radarpausebutton.innerHTML = "Reset Scaling";
  }

  let d = ApplyFilters(data);
  d.sort((a, b) => a.name.localeCompare(b.name));
  const dollarMovement = CalculateTotalDollars(d);
  SetRank(d);
  UpdateRadarQuadrants();
  CanvasCharts.Radar.options.data[0].dataPoints = d;
  CanvasCharts.Radar.render();
  DocElems.timediv.innerHTML =
    Constants.CurrentTime +
    " | Min: " +
    Constants.CurrentMin.toLocaleString() +
    " | Sec: " +
    Constants.CurrentSec.toLocaleString() +
    " | Total Count " +
    String(d.length) +
    " | Total Dollars: $" +
    Math.round(dollarMovement).toLocaleString() +
    " | Hal Mkt Oprt: $" +
    Math.round(0.01 * dollarMovement).toLocaleString() +
    " | Potential Profits: $" +
    Math.round(0.0006 * dollarMovement).toLocaleString() +
    " | Dollars/Min: $" +
    Math.round(dollarMovement / Constants.CurrentMin).toLocaleString();

  Tables.radardata.options.columns[12].formatterParams.max =
    Constants.Rank.maxDollar;
  Tables.radardata.setData(d);
}

function GetRadarDataFromDB() {
  const request = Constants.Db.transaction(
    Constants.Database.Store.name,
    "readonly"
  )
    .objectStore(Constants.Database.Store.name)
    .get(1);
  request.onsuccess = (event) => {
    GraphData.RadarData = request.result;
  };
  request.onerror = (event) => {
    console.error("Couldn't retrieve data from db");
  };
}

function UpdateRadarQuadrants() {
  CanvasCharts.Radar.axisX[0].crosshair.showAt(GraphData.radarXthreshold);
  CanvasCharts.Radar.axisY[0].crosshair.showAt(GraphData.radarYthreshold);
}

function clickBubble(e) {
  // GraphData.TopTen.set(e.dataPoint.sym, e.dataPoint.rank);
  const oldColor = Tables.radardata
    .getRows()
    .filter((row) => row.getData().name == e.dataPoint.name)[0]
    .getElement().style.backgroundColor;
  Tables.radardata
    .getRows()
    .filter((row) => row.getData().name == e.dataPoint.name)[0]
    .getElement().style.backgroundColor = Constants.volColor;
  GraphData.RadarUpdate = false;
  DocElems.radarpausebutton.innerHTML = "Reset Scaling";
  setTimeout(() => {
    Tables.radardata.redraw();
    Tables.radardata
      .getRows()
      .filter((row) => row.getData().name == e.dataPoint.name)[0]
      .getElement().style.backgroundColor = oldColor;
  }, 1000);
}

function AddRadarFilter() {
  if (String(DocElems.radarfiltervalue.value) === "") {
    alert("Cannot input blank filter");
  } else {
    let filter = {
      quan: DocElems.radarfilterquan.value,
      comp: DocElems.radarfiltertype.value,
      val: DocElems.radarfiltervalue.value,
    };
    //GraphData.radarFilters.push(filter);
    GraphData.radarFilters.set(GraphData.FilterId, filter);
    GraphData.FilterId++;

    LoadFiltersOnScreen();
  }
}

function ClearRadarFilters() {
  GraphData.radarFilters = new Map([
    [0, { quan: "tcnt", comp: ">", val: "0" }],
  ]);
  LoadFiltersOnScreen();
}

function SolosRadarFilters() {
  GraphData.radarFilters = new Map([
    [0, { quan: "tcnt", comp: ">", val: "0" }],
    [1, { quan: "tbs", comp: "<=", val: "3" }],
    [2, { quan: "lps", comp: ">=", val: "1" }],
    [3, { quan: "pv", comp: ">=", val: "0.30" }],
  ]);
  LoadFiltersOnScreen();
}

function DicksRadarFilters() {
  GraphData.radarFilters = new Map([
    [0, { quan: "tcnt", comp: ">", val: "0" }],
    [1, { quan: "tbs", comp: "<=", val: "5" }],
    [2, { quan: "lps", comp: ">=", val: "1" }],
    [3, { quan: "pv", comp: ">=", val: "0.50" }],
  ]);
  LoadFiltersOnScreen();
}

function LoadFiltersOnScreen() {
  DocElems.filtersdiv.innerHTML = "| ";
  GraphData.radarFilters.forEach((filter, key) => {
    if (key !== 0) {
      DocElems.filtersdiv.innerHTML +=
        GraphData.radarFiltersNameMap.get(filter.quan) +
        " " +
        filter.comp +
        " " +
        filter.val.toLocaleString() +
        " <button id='filterId" +
        String(key) +
        "' class='xbutton'>X</button> | ";
    } else {
      DocElems.filtersdiv.innerHTML +=
        GraphData.radarFiltersNameMap.get(filter.quan) +
        " " +
        filter.comp +
        " " +
        filter.val.toLocaleString() +
        " | ";
    }
  });
  GraphData.radarFilters.forEach((filter, key) => {
    if (key !== 0) {
      document
        .getElementById("filterId" + String(key))
        .addEventListener("click", () => DeleteFilter(key));
    }
  });
  localStorage.setItem(
    "radarfilters",
    JSON.stringify(Array.from(GraphData.radarFilters))
  );
  GraphData.RadarUpdate = true;
  DocElems.radarpausebutton.innerHTML = "Updating Live";
  CanvasCharts.Radar.axisX[0].set("minimum", GraphData.xMinimum, false);
  CanvasCharts.Radar.axisX[0].set("maximum", GraphData.xMaximum, false);
  CanvasCharts.Radar.axisY[0].set("minimum", GraphData.yMinimum, false);
  CanvasCharts.Radar.axisY[0].set("maximum", GraphData.yMaximum);
  GraphData.PrevXMaxVal = GraphData.xMaximum;
  GraphData.PrevXMinVal = GraphData.xMinimum;
  GraphData.PrevYMaxVal = GraphData.yMaximum;
  GraphData.PrevYMinVal = GraphData.yMinimum;
}

function ApplyFilters(data) {
  let toReturn = [...data];

  GraphData.radarFilters.forEach((filter, key) => {
    let temp = [];
    const val = parseFloat(filter.val);
    toReturn.forEach((d) => {
      switch (filter.comp) {
        case ">=":
          switch (filter.quan) {
            case "tcnt":
              if (d.x >= val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y >= val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z >= val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps >= val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v >= val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs >= val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        case ">":
          switch (filter.quan) {
            case "tcnt":
              if (d.x > val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y > val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z > val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps > val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v > val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs > val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        case "=":
          switch (filter.quan) {
            case "tcnt":
              if (d.x === val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y === val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z === val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps === val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v === val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs === val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        case "<":
          switch (filter.quan) {
            case "tcnt":
              if (d.x < val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y < val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z < val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps < val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v < val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs < val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        case "<=":
          switch (filter.quan) {
            case "tcnt":
              if (d.x <= val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y <= val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z <= val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps <= val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v <= val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs <= val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        case "!=":
          switch (filter.quan) {
            case "tcnt":
              if (d.x !== val) {
                temp.push(d);
              }
              break;
            case "pv":
              if (d.y !== val) {
                temp.push(d);
              }
              break;
            case "dm":
              if (d.z !== val) {
                temp.push(d);
              }
              break;
            case "lps":
              if (d.lps !== val) {
                temp.push(d);
              }
              break;
            case "vol":
              if (d.v !== val) {
                temp.push(d);
              }
              break;
            case "tbs":
              if (d.tbs !== val) {
                temp.push(d);
              }
              break;
            default:
              console.error("Invalid Radar Filter Quantity");
              break;
          }
          break;
        default:
          console.error("Invalid Radar Filter Comparison");
          break;
      }
    });
    toReturn = [...temp];
  });
  return toReturn;
}

function DeleteFilter(key) {
  console.log("Deleting filter of id:", key);
  GraphData.radarFilters.delete(key);
  LoadFiltersOnScreen();
}

function CalculateTotalDollars(data) {
  let toReturn = 0;
  data.forEach((d) => {
    toReturn += d.z;
  });
  return toReturn;
}

function SetRankOld(data) {
  let tottbs = 0,
    totpv = 0,
    totlps = 0,
    totdt = 0,
    tottcnt = 0,
    mintbs = 0,
    minpv = 0,
    minlps = 0,
    mindt = 0,
    mintcnt = 0,
    maxtbs = 0,
    maxpv = 0,
    maxlps = 0,
    maxdt = 0,
    maxtcnt = 0,
    cnt = data.length;

  GraphData.xMinimum = Infinity;
  GraphData.xMaximum = 0;
  GraphData.yMinimum = Infinity;
  GraphData.yMaximum = 0;

  data.forEach((d) => {
    // d.emin = d.y / d.tbs;
    d.emin = d.y / ((d.tp * Constants.Kpi) / Constants.MinInTradeDay);
    tottbs += d.tbs;
    totpv += d.y;
    totlps += d.lps;
    totdt += d.dz;
    tottcnt += d.x;
    if (d.tbs < mintbs) {
      mintbs = d.tbs;
    }
    if (d.y < minpv) {
      minpv = d.y;
    }
    if (d.lps < minlps) {
      maxlps = d.lps;
    }
    if (d.z < mindt) {
      mindt = d.z;
    }
    if (d.x < mintcnt) {
      mintcnt = d.x;
    }
    if (d.tbs > maxtbs) {
      maxtbs = d.tbs;
    }
    if (d.y > maxpv) {
      maxpv = d.y;
    }
    if (d.lps > maxlps) {
      maxlps = d.lps;
    }
    if (d.z > maxdt) {
      maxdt = d.z;
    }
    if (d.x > maxtcnt) {
      maxtcnt = d.x;
    }

    if (d.x < GraphData.xMinimum) {
      GraphData.xMinimum = d.x;
    }
    if (d.x > GraphData.xMaximum) {
      GraphData.xMaximum = d.x;
    }
    if (d.y < GraphData.yMinimum) {
      GraphData.yMinimum = d.y;
    }
    if (d.y > GraphData.yMaximum) {
      GraphData.yMaximum = d.y;
    }
  });

  GraphData.radarXthreshold = Math.pow(
    10,
    (Math.log10(GraphData.xMaximum) + Math.log10(GraphData.xMinimum)) / 2
  );
  GraphData.radarYthreshold = Math.pow(
    10,
    (Math.log10(GraphData.yMinimum) + Math.log10(GraphData.yMaximum)) / 2
  );

  data.forEach((d) => {
    let ranktbs = (Constants.Rank.tbs * (maxtbs - d.tbs)) / (maxtbs - mintbs);
    let rankpv = (Constants.Rank.pv * (d.y - minpv)) / (maxpv - minpv);
    let ranklps = (Constants.Rank.lps * (d.lps - minlps)) / (maxlps - minlps);
    let rankdt = (Constants.Rank.dt * (d.z - mindt)) / (maxdt - mindt);
    let ranktcnt =
      (Constants.Rank.tcnt * (d.x - mintcnt)) / (maxtcnt - mintcnt);

    d.score = ranktbs + rankpv + ranklps + rankdt + ranktcnt;

    if (d.y >= GraphData.radarYthreshold) {
      if (d.x >= GraphData.radarXthreshold) {
        d.quad = 1;
      } else {
        d.quad = 2;
      }
    } else {
      if (d.x >= GraphData.radarXthreshold) {
        d.quad = 3;
      } else {
        d.quad = 4;
      }
    }
  });

  data.sort((a, b) => b.score - a.score);
  let count = 1,
    totscore = 0;
  data.forEach((d) => {
    totscore += d.score;
    d.rank = count;
    count++;
  });
  data.forEach((d) => {
    d.score = ((d.score / totscore) * Constants.Rank.stars * cnt) / 2;
    d.dp = d.z;
  });
}

function SetRank(data) {
  GraphData.xMinimum = Infinity;
  GraphData.xMaximum = 0;
  GraphData.yMinimum = Infinity;
  GraphData.yMaximum = 0;

  let totscore = 0;
  let totcount = 0;
  Constants.Rank.maxDollar = 0;
  data.forEach((d) => {
    // d.emin = d.y / d.tbs;
    // d.emin = d.y * d.x / ((d.tp * d.tbs * Constants.Kpi) / Constants.MinInTradeDay);
    // d.eminacc = (d.emin / d.ht.m) * Constants.Kpi * 100;
    d.score = d.eminracc;
    totscore += d.score;
    totcount++;

    if (d.x < GraphData.xMinimum) {
      GraphData.xMinimum = d.x;
    }
    if (d.x > GraphData.xMaximum) {
      GraphData.xMaximum = d.x;
    }
    if (d.y < GraphData.yMinimum) {
      GraphData.yMinimum = d.y;
    }
    if (d.y > GraphData.yMaximum) {
      GraphData.yMaximum = d.y;
    }
    if (d.z > Constants.Rank.maxDollar) {
      Constants.Rank.maxDollar = d.z;
    }
  });

  GraphData.radarXthreshold = Math.pow(
    10,
    (Math.log10(GraphData.xMaximum) + Math.log10(GraphData.xMinimum)) / 2
  );
  GraphData.radarYthreshold = Math.pow(
    10,
    (Math.log10(GraphData.yMinimum) + Math.log10(GraphData.yMaximum)) / 2
  );

  GraphData.TopTen = new Map();
  data.sort((a, b) => b.score - a.score);
  let count = 1;
  data.forEach((d) => {
    d.rank = count;
    if (count < 11) {
      GraphData.TopTen.set(d.name, d.rank - 1);
    }
    count++;
    d.dp = d.z;
    d.score = ((d.score / totscore) * Constants.Rank.stars * totcount) / 2;

    if (d.y >= GraphData.radarYthreshold) {
      if (d.x >= GraphData.radarXthreshold) {
        d.quad = 1;
      } else {
        d.quad = 2;
      }
    } else {
      if (d.x >= GraphData.radarXthreshold) {
        d.quad = 3;
      } else {
        d.quad = 4;
      }
    }
  });
}

function ClickRadarTableCell(e, cell) {
  window.open(
    Constants.Origin + "trading/" + cell.getRow().getData().name,
    "popUpWindow",
    "hresizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=yes,directories=yes, status=yes"
  );
}

function ToggleRadar() {
  if (GraphData.RadarUpdate) {
    GraphData.RadarUpdate = false;
    DocElems.radarpausebutton.innerHTML = "Reset Scaling";
    CanvasCharts.Radar.axisX[0].set("minimum", GraphData.xMinimum, false);
    CanvasCharts.Radar.axisX[0].set("maximum", GraphData.xMaximum, false);
    CanvasCharts.Radar.axisY[0].set("minimum", GraphData.yMinimum, false);
    CanvasCharts.Radar.axisY[0].set("maximum", GraphData.yMaximum);
  } else {
    GraphData.RadarUpdate = true;
    DocElems.radarpausebutton.innerHTML = "Updating Live";
    CanvasCharts.Radar.axisX[0].set("minimum", GraphData.xMinimum, false);
    CanvasCharts.Radar.axisX[0].set("maximum", GraphData.xMaximum, false);
    CanvasCharts.Radar.axisY[0].set("minimum", GraphData.yMinimum, false);
    CanvasCharts.Radar.axisY[0].set("maximum", GraphData.yMaximum);
    GraphData.PrevXMaxVal = GraphData.xMaximum;
    GraphData.PrevXMinVal = GraphData.xMinimum;
    GraphData.PrevYMaxVal = GraphData.yMaximum;
    GraphData.PrevYMinVal = GraphData.yMinimum;
  }
}

function ToggleRadarScale() {
  if (Constants.LogScale) {
    Constants.LogScale = false;
    DocElems.radartogglelogscalebutton.innerHTML = "Log Scale";
    CanvasCharts.Radar.options.axisX.logarithmic = Constants.LogScale;
    CanvasCharts.Radar.options.axisY.logarithmic = Constants.LogScale;
  } else {
    Constants.LogScale = true;
    DocElems.radartogglelogscalebutton.innerHTML = "Linear Scale";
    CanvasCharts.Radar.options.axisX.logarithmic = Constants.LogScale;
    CanvasCharts.Radar.options.axisY.logarithmic = Constants.LogScale;
  }
}

function ToggleBubbleColorFlash() {
  if (CanvasCharts.Radar.options.data[0].color) {
    delete CanvasCharts.Radar.options.data[0].color;
    DocElems.radartogglecolorbutton.innerHTML = "Fix Colors";
  } else {
    CanvasCharts.Radar.options.data[0].color = Constants.volColor;
    DocElems.radartogglecolorbutton.innerHTML = "Flash Colors";
  }
}

function ToggleDrawing() {
  if (Constants.Drawing) {
    Constants.Drawing = false;
    DocElems.stockdrawingbutton.innerHTML = "Enable Line Drawing";
    DocElems.resetScalingBtn.disabled = false;
    CanvasCharts.Stock.options.navigator.enabled = true;
  } else {
    Constants.Drawing = true;
    DocElems.stockdrawingbutton.innerHTML = "Disable Line Drawing";
    DocElems.resetScalingBtn.disabled = true;
    CanvasCharts.Stock.options.navigator.enabled = false;

    var slider = CanvasCharts.Stock.navigator.slider;
    var sliderMinimum = slider.get("minimum"),
      sliderMaximum = slider.get("maximum");

    var interval = (slider.get("maximum") - slider.get("minimum")) / 10; // change interval based on the range of chart
    var newMin, newMax;

    if (e.deltaY < 0) {
      newMin = sliderMinimum + interval;
      newMax = sliderMaximum - interval;
    } else if (e.deltaY > 0) {
      newMin = sliderMinimum - interval;
      newMax = sliderMaximum + interval;
    }

    if (
      newMax < CanvasCharts.Stock.navigator.axisX[0].get("maximum") ||
      newMin > CanvasCharts.Stock.navigator.axisX[0].get("minimum")
    ) {
      CanvasCharts.Stock.navigator.slider.set("minimum", newMin, false);
      CanvasCharts.Stock.navigator.slider.set("maximum", newMax);
    }
    GraphData.PrevMaxVal = slider.maximum;
    GraphData.PrevMinVal = slider.minimum;
    GraphData.LiveUpdate = false;
    ResetGraphScaling();

    CanvasCharts.Stock.render();
  }
}

function DrawLine(chart, coords) {
  let ctx = chart.getContext("2d");

  ctx.beginPath();
  ctx.strokeStyle = Constants.lineColor;
  ctx.lineWidth = 2;
  ctx.moveTo(coords.x1, coords.y1);
  ctx.lineTo(coords.x2, coords.y2);
  ctx.stroke();
}

function StartLine(e) {
  if (e.detail === 2 && Constants.Drawing) {
    e.preventDefault();
    GraphData.lineCoords.x1 =
      e.clientX -
      CanvasCharts.Stock.charts[0].container
        .getElementsByClassName("canvasjs-chart-canvas")[1]
        .getBoundingClientRect().left;
    GraphData.lineCoords.y1 =
      e.clientY -
      CanvasCharts.Stock.charts[0].container
        .getElementsByClassName("canvasjs-chart-canvas")[1]
        .getBoundingClientRect().top;
  }
}

function EndLine(e) {
  if (e.detail === 2 && Constants.Drawing) {
    e.preventDefault();
    GraphData.lineCoords.x2 =
      e.clientX -
      CanvasCharts.Stock.charts[0].container
        .getElementsByClassName("canvasjs-chart-canvas")[1]
        .getBoundingClientRect().left;
    GraphData.lineCoords.y2 =
      e.clientY -
      CanvasCharts.Stock.charts[0].container
        .getElementsByClassName("canvasjs-chart-canvas")[1]
        .getBoundingClientRect().top;
    DrawLine(
      CanvasCharts.Stock.charts[0].container.getElementsByClassName(
        "canvasjs-chart-canvas"
      )[0],
      GraphData.lineCoords
    );
    GraphData.lineCoords = {};
  }
}

function Fullscreen(elem) {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    elem.requestFullscreen();
  }
}

main();
