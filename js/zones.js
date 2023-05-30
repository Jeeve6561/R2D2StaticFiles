const Constants = {
  Ipaddress: "",
  Origin: "",
  RequestWSUrl: "",
  RequestWSExt: ":55555/wstacstream",
  ThisProgram: "R2D2",

  SymZoneDataRequest: "symbolzonedatarequest",
  ZoneSymbol: "TSLA",
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  symbolinput: document.getElementById("symbolinput"),
  symbolinputbutton: document.getElementById("symbolinputbutton"),
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
      case Constants.SymZoneDataRequest:
        console.log(msg.d);
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

const Tables = {
  Zones: new Tabulator("#zonetable", {
    data: [],
    layout: "fitDataFill",
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    pagination: true,
    movableColumns: true,
    initialSort: [{ column: "score", dir: "desc" }],
    columns: [
      {
        title: "Sym",
        field: "name",
        topCalc: "count",
        // cellClick: ClickRadarTableCell,
        frozen: true,
      },
      { title: "Rank", field: "rank", topCalc: "count" },
      {
        title: "Q",
        field: "quad",
        // cellClick: ClickRadarTableCell,
      },
      {
        title: "Emin",
        field: "emin",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "EminAcc",
        field: "eminacc",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "EminR",
        field: "eminr",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "EminRAcc",
        field: "eminracc",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "Price Volatility",
        field: "pv",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "Avg Lots",
        field: "lps",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
        hozAlign: "right",
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
        title: "TtBS",
        field: "tbs",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
        hozAlign: "right",
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
        title: "InvTtBS",
        field: "invtbs",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
        hozAlign: "right",
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
        title: "Dollars Traded",
        field: "dm",
        topCalc: "sum",
        // cellClick: ClickRadarTableCell,
        hozAlign: "right",
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
        title: "Num of Lots",
        field: "lc",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "Volume of Shares",
        field: "v",
        topCalc: "sum",
        // cellClick: ClickRadarTableCell,
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
        title: "Avg Trade Price",
        field: "tp",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "Avg Ask Price",
        field: "ap",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
        title: "Avg Bid Price",
        field: "bp",
        topCalc: "avg",
        // cellClick: ClickRadarTableCell,
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
    ],
  }),
};

function main() {
  Constants.Ipaddress = DocElems.Ipaddress.innerHTML;
  DocElems.Ipaddress.innerHTML = "";
  Constants.Origin = "http://" + Constants.Ipaddress + ":50000/";
  Constants.RequestWSUrl =
    "ws://" + Constants.Ipaddress + Constants.RequestWSExt;
  RequestWS.connect();

  RequestWS.sendMessage({
    sym: Constants.ZoneSymbol,
    ev: Constants.SymZoneDataRequest,
  })
}

main();
