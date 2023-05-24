const Constants = {
  LogWSUrl: "ws://192.168.0.5:44444/logstream",
  Ev_Connected: "connected",
  Ev_Log: "log",

  ErrorColor: "#E10600",
  WarnColor: "#ed8311",
};

const DocElems = {
  Logtable: document.getElementById("logtable"),
};

const LogWS = {
  connected: false,
  connectTime: 0,
  disconnectTime: 0,
  ws: null,

  connect() {
    LogWS.connected = true;
    LogWS.url = Constants.LogWSUrl;
    LogWS.ws = new WebSocket(LogWS.url);
    LogWS.ws.onopen = LogWS.openSocket;
    LogWS.ws.onclose = LogWS.closeSocket;
    LogWS.ws.onerror = LogWS.errorSocket;
    LogWS.ws.onmessage = LogWS.messageReceived;
  },

  openSocket() {
    LogWS.connected = true;
    LogWS.connectTime = new Date();
    console.log(
      "Connecting to " + String(LogWS.url) + " at " + String(LogWS.connectTime)
    );
  },

  closeSocket() {
    LogWS.connected = false;
    LogWS.disconnectTime = new Date();
    console.log(
      "Disconnecting from " + String(LogWS.url) + " at ",
      String(LogWS.disconnectTime)
    );
    LogWS.ws = null;
  },

  errorSocket(event) {
    console.error(
      "Error occurred in " +
        String(LogWS.url) +
        " at " +
        String(new Date()) +
        " | " +
        event.data
    );
  },

  messageReceived(event) {
    let data = JSON.parse(event.data);
    switch (data.ev) {
      case Constants.Ev_Connected:
        console.log("Connected message received.", data.n, "said:", data.d);
        break;
      case Constants.Ev_Log:
        data.d.name = data.n;
        AddToTable(data.d);
        break;
      default:
        console.log("Unknown Message type received:", data);
        break;
    }
  },

  sendMessage(msg) {
    if (LogWS.ws.readyState === WebSocket.OPEN && LogWS.connected) {
      let data = JSON.stringify(msg);
      LogWS.ws.send(data);
    } else {
      console.error("Failed to send and retrying");
      setTimeout(() => {
        LogWS.sendMessage(msg);
      }, 1000);
    }
  },
};

const Tables = {
  Logtable: new Tabulator("#logtable", {
    data: [],
    layout: "fitDataStretch",
    layoutColumnsOnNewData: true,
    height: DocElems.Logtable.clientHeight,
    pagination: true,
    movableColumns: true,
    initialSort: [{ column: "time", dir: "desc" }],
    columns: [
      { title: "Connection", field: "name" },
      {
        title: "Level",
        field: "level",
        headerFilter: "list",
        headerFilterParams: {
          values: ["error", "info", "warn", "panic", "fatal", "debug", "trace"],
        },
        formatter: function (cell, formatterParams) {
          var cellValue = cell.getValue();
          if (cellValue === "error") {
            cell.getRow().getElement().style.color = Constants.ErrorColor;
          } else if (cellValue === "warn") {
            cell.getRow().getElement().style.color = Constants.WarnColor;
          }
          return cellValue;
        },
        headerFilterEmptyCheck: function (value) {
          return !value;
        },
      },
      { title: "Time", field: "time" },
      { title: "Caller", field: "caller" },
      { title: "Message", field: "message" },
      { title: "Error Message", field: "error" },
    ],
  }),
};

const TableData = {
  Logtable: [],
};

function main() {
  LogWS.connect();
}

function AddToTable(data) {
  TableData.Logtable.push(data);
  Tables.Logtable.setData(TableData.Logtable, true);
}

main();
