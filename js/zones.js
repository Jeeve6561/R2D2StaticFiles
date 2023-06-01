const Constants = {
  Ipaddress: "",
  Origin: "",
  RequestWSUrl: "",
  RequestWSExt: ":55555/wstacstream",
  ThisProgram: "R2D2",

  SymZoneDataRequest: "symbolzonedatarequest",
  ZoneSymbol: "TSLA",
  Quadrant: "all",
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  symbolinput: document.getElementById("symbolinput"),
  symbolinputbutton: document.getElementById("symbolinputbutton"),
  quadrantinput: document.getElementById("quadrantinput"),
  quadrantinputbutton: document.getElementById("quadrantinputbutton"),
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
        HandleZoneData(msg.d.d);
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
    initialSort: [
      { column: "sec", dir: "desc" },
      { column: "rank", dir: "asc" },
      { column: "id", dir: "desc" },
    ],
    columns: [
      {
        title: "Sym",
        field: "sym",
        topCalc: "count",
        frozen: true,
      },
      {
        title: "Id",
        field: "id",
        topCalc: "sum",
      },
      {
        title: "Quad",
        field: "q",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Rank",
        field: "r",
        hozAlign: "right",
      },
      {
        title: "Zone",
        field: "zone",
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
      {
        title: "Exit",
        field: "ext",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Cpl",
        field: "cplsum",
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
        title: "Sec",
        field: "sec",
        topCalc: "max",
        hozAlign: "right",
      },
      {
        title: "Min",
        field: "min",
        topCalc: "max",
        hozAlign: "right",
      },
      {
        title: "Emin",
        field: "eminsum",
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
        title: "EminA",
        field: "eminaval",
        topCalc: "avg",
        hozAlign: "right",
        formatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
        topCalcFormatter: (e, params, onRendered) => {
          return Math.round(e.getValue() * 100) / 100 + "%";
        },
      },
      {
        title: "EminA Risk",
        field: "eminasdv",
        topCalc: "avg",
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
        title: "Dur Mean",
        field: "durmean",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
        },
      },
      {
        title: "Tot Dur",
        field: "dursum",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
        },
      },
      {
        title: "Dur % in Mkt",
        field: "durpc",
        topCalc: "avg",
        hozAlign: "right",
        formatter: "money",
        formatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
        },
        topCalcFormatter: "money",
        topCalcFormatterParams: {
          decimal: ".",
          thousand: ",",
          precision: 3,
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
        title: "Dollars",
        field: "d",
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
    ],
  }),
};

function main() {
  Constants.Ipaddress = DocElems.Ipaddress.innerHTML;
  DocElems.Ipaddress.innerHTML = "";
  Constants.Origin = "http://" + Constants.Ipaddress + ":50000/";
  Constants.RequestWSUrl =
    "ws://" + Constants.Ipaddress + Constants.RequestWSExt;

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

  RequestWS.connect();

  setInterval(() => {
    RequestWS.sendMessage({
      sym: Constants.ZoneSymbol,
      ev: Constants.SymZoneDataRequest,
    });
  }, 1000);
}

function HandleZoneData(data) {
  let d = [];

  console.log(data);
  if (data.length === 0) {
    Tables.Zones.setData(d);
    return;
  }

  let elem = data[data.length - 1];

  if (Constants.Quadrant == "1") {
    elem.forEach((e) => {
      if (e.q === 1) {
        d.push(e);
      }
    });
  } else if (Constants.Quadrant == "2") {
    elem.forEach((e) => {
      if (e.q === 2) {
        d.push(e);
      }
    });
  } else if (Constants.Quadrant == "3") {
    elem.forEach((e) => {
      if (e.q === 3) {
        d.push(e);
      }
    });
  } else if (Constants.Quadrant == "4") {
    elem.forEach((e) => {
      if (e.q === 4) {
        d.push(e);
      }
    });
  } else {
    d = [...elem];
  }

  Tables.Zones.setData(d);
}

function clickSymbolInput() {
  let temp = DocElems.symbolinput.value;
  Constants.ZoneSymbol = temp.toUpperCase();
  DocElems.symbolinput.value = "";
}

function clickQuadrantInput() {
  Constants.Quadrant = DocElems.quadrantinput.value;
}

main();
