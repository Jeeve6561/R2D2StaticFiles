const Constants = {
  st: 0,
  et: 0,

  stime: 0,
  etime: 0,

  bgColor: "#000000",
  fontColor: "#a6a6a6",
  volColor: "#26678b",
  lineColor: "#EE4B2B",
  quadColor: "#FFFFFF",
  VolHeightPercent: 0.2,

  LiveFeedWSUrl: "",
  RequestWSUrl: "",
  LiveFeedWSExt: ":33333/wslivestream",
  RequestWSExt: ":55555/wstacstream",
  TacDataRequest: "tacdatarequest",
  RadarDataRequest: "radardatarequest",
  Ev_Payload: "sympayload",
  ConnectMsg: "connected",
  ThisProgram: "R2D2",

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

  symbol: document.getElementById("symbol"),
  symbolinput: document.getElementById("symbolinput"),
  symbolinputbutton: document.getElementById("symbolinputbutton"),
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
        console.log(msg.n, "says:", msg.d);
        break;
      case Constants.TacDataRequest:
        if (!Constants.Drawing) {
          UpdateStockChart(msg.d);
        }
        //Constants.etime = performance.now()
        // console.log("--------------------------------------" + GraphData.request.sym +" loading performance:", Constants.etime - Constants.stime, "--------------------------------------");
        break;
      case Constants.RadarDataRequest:
        // UpdateStockChart(msg.d.d, msg.d.sym);
        // Constants.etime = performance.now()
        // console.log("-------------------------------------- loading performance:", Constants.etime - Constants.stime, "--------------------------------------");
        break;
      case Constants.BubbleRequest:
        // console.log(data);
        console.log("Data is coming through ", Constants.RequestWSUrl);
        console.log("Data is: ", data);
        UpdateRadarChart(data);
        break;
      default:
        console.log(msg);
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
  PrevMaxVal: 0,
  PrevMinVal: 0,
  request: {
    sym: "TSLA",
    tid: 0,
    ev: Constants.TacDataRequest,
  },
  TopTen: new Map(),
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
          contentFormatter: contentFormatterTop,
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
            name: "Tp",
            type: "scatter",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisX2: {
              title: "Time",
            },

            explodeOnClick: true,
            dataPoints: [],
          },
          {
            name: "Ap & Bp",
            type: "rangeArea",
            axisYType: "secondary",
            explodeOnClick: true,
            axisX: [
              {
                title: "Time",
              },
              {
                title: "Time",
              },
            ],
            dataPoints: [],
            fillOpacity: 0.01,
          },
        ],
      },
      {
        toolTip: {
          shared: true,
          reversed: true,
          contentFormatter: contentFormatterBottom,
        },
        height:
          Constants.VolHeightPercent *
          document.getElementById("stockchartContainer").clientHeight,
        axisX: {
          minimum: null,
          maximum: null,
        },
        axisY2: {
          includeZero: true,
          labelFontColor: Constants.fontColor,
          titleFontColor: Constants.fontColor,
          lineColor: Constants.fontColor,
          labelFormatter: labelFormatterY2,
        },
        data: [
          {
            name: "Volume",
            axisYType: "secondary",
            axisX: {
              title: "Time",
            },
            axisY2: {
              title: "Volume",
            },
            color: Constants.volColor,

            dataPoints: [],
          },
        ],
      },
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
        frozen: true,
      },
      { title: "Rank", field: "rank", topCalc: "count" },
      {
        title: "Rating",
        field: "score",
        topCalc: "count",
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
      },
      {
        title: "Emin",
        field: "emin",
        topCalc: "avg",
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

  Constants.Ipaddress = DocElems.statchartOpts.innerHTML;
  Constants.RequestWSUrl =
    "ws://" + Constants.Ipaddress + Constants.RequestWSExt;
  DocElems.statchartOpts.innerHTML = "";

  GraphData.request.sym = DocElems.symbol.innerHTML;
  DocElems.symbol.innerHTML = "";

  let onloadfilters = new Map(JSON.parse(localStorage.getItem("radarfilters")));
  if (onloadfilters.size > 0) {
    GraphData.radarFilters = onloadfilters;
  }

  // LiveFeedWS.connect();
  RequestWS.connect();

  CanvasCharts.Stock.render();
  console.log(
    CanvasCharts.Stock.charts[0].container.getElementsByClassName(
      "canvasjs-chart-canvas"
    )
  );
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
  DocElems.symbolinputbutton.addEventListener("click", clickSymbolInput);

  setInterval(() => {
    RequestWS.sendMessage(GraphData.request);
  }, 1000);

  // const et = performance.now();
  // console.log("Performance:", et - st);
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
    GraphData.request.sym +
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

function UpdateStockChart(data) {
  CanvasCharts.Stock.options.title.text = GraphData.request.sym;

  let tp = [];
  let abp = [];
  let v = [];
  let xval;

  data.forEach((elem) => {
    // console.log(elem.tid);
    if (elem.tp > 0) {
      xval = new Date(elem.t);
      tp.push({ x: xval, y: elem.tp, l: elem.th });
      abp.push({ x: xval, y: [elem.bp, elem.ap], l: elem.th });
      v.push({ x: xval, y: elem.vi, l: elem.th });
    }
  });

  CanvasCharts.Stock.options.charts[0].data[0].dataPoints = tp;
  CanvasCharts.Stock.options.charts[0].data[1].dataPoints = abp;
  CanvasCharts.Stock.options.charts[1].data[0].dataPoints = v;

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

  CanvasCharts.Stock.render();
}

function clickSymbolInput() {
  GraphData.request.sym = DocElems.symbolinput.value;
  DocElems.symbolinput.value = "";
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
