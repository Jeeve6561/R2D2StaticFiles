const Constants = {
  PerformanceTest: 0,
  Ipaddress: "",
  LiveFeedWSUrl: "",
  LiveFeedWSExt: ":33333/wslivestream",
  ConnectMsg: "connected",
  EV_WSInit: "wsinit",
  Sympayload: "sympayload", // FIX THIS PLEASEEEEEEEEEEEEEEEE
  TradePayload: "tradePayload",
  InmktTradePayload: "inmktTradePayload",
  HypothesesPayload: "hypothesisPayload",
  EV_WSSymPayloadUpdate: "sympayloadupdate",

  MarketStatus_ClosedAM: "ClosedAM",
  MarketStatus_PreMarket: "PreMarket",
  MarketStatus_Open: "Open",
  MarketStatus_PostMarket: "PostMarket",
  MarketStatus_ClosedPM: "ClosedPM",

  StartWritingToDatabase: false,
  Database: {
    Name: "",
    Version: 1,
    Store: { name: "AllData", keyPath: "id", autoIncrement: false },
  },
  Db: 0,

  EV_SocketReceivedData: "ReceivedData",

  Error_InvalidCaller: "Invalid Caller Type ",

  IdToWrite: 0,
  OpenDataBase: "openDB",
  DataUpdate: "updateddata",
};

const LiveFeedWS = {
  init: false,
  connected: false,
  connectTime: 0,
  disconnectTime: 0,
  ws: null,

  connect() {
    LiveFeedWS.connected = true;
    LiveFeedWS.url = Constants.LiveFeedWSUrl;
    LiveFeedWS.ws = new WebSocket(LiveFeedWS.url);
    LiveFeedWS.ws.onopen = LiveFeedWS.openSocket;
    LiveFeedWS.ws.onclose = LiveFeedWS.closeSocket;
    LiveFeedWS.ws.onerror = LiveFeedWS.errorSocket;
    LiveFeedWS.ws.onmessage = LiveFeedWS.messageReceived;
  },

  openSocket() {
    LiveFeedWS.connected = true;
    LiveFeedWS.connectTime = new Date();
    console.log(
      "Connecting to " +
        String(LiveFeedWS.url) +
        " at " +
        String(LiveFeedWS.connectTime)
    );
  },

  closeSocket() {
    LiveFeedWS.connected = false;
    LiveFeedWS.disconnectTime = new Date();
    console.log(
      "Disconnecting from " + String(LiveFeedWS.url) + " at ",
      String(LiveFeedWS.disconnectTime)
    );
    LiveFeedWS.ws = null;
  },

  errorSocket(event) {
    console.error(
      "Error occurred in " +
        String(LiveFeedWS.url) +
        " at " +
        String(new Date()) +
        " | " +
        event.data
    );
  },

  messageReceived(event) {
    let msg = JSON.parse(event.data);
    // console.log(msg);
    switch (msg.ev) {
      case Constants.ConnectMsg:
        console.log("Name of socket manager:", msg.n);
        break;
      case Constants.Sympayload:
        HandleDataFromSocket(msg.d, 1);
        break;
      case Constants.HypothesesPayload:
        HandleDataFromSocket(msg.d, 2);
        break;
      case Constants.TradePayload:
        HandleDataFromSocket(msg.d, 3);
        break;
      case Constants.InmktTradePayload:
        HandleDataFromSocket(msg.d, 4);
        break;
    }
  },

  sendMessage(msg) {
    if (LiveFeedWS.ws.readyState === WebSocket.OPEN && LiveFeedWS.connected) {
      let data = JSON.stringify(msg);
      LiveFeedWS.ws.send(data);
    } else {
      console.error("Failed to send and retrying");
      setTimeout(() => {
        LiveFeedWS.sendMessage(msg);
      }, 1000);
    }
  },
};

function main() {
  onmessage = (event) => {
    Constants.Database.Name = event.data.dbname;
    Constants.IdToWrite = event.data.id;
    Constants.Ipaddress = event.data.ip;
    CreateAndInitAllDatabases();
    Constants.LiveFeedWSUrl =
      "ws://" + Constants.Ipaddress + Constants.LiveFeedWSExt;
    LiveFeedWS.connect();
  };
}

function HandleDataFromSocket(data, id) {
  if (Constants.StartWritingToDatabase && Constants.IdToWrite === id) {
    data.id = id;
    WriteToDB(Constants.Database.Name, Constants.Database.Store.name, data);
    self.postMessage({ ev: Constants.DataUpdate, id: id });
  }
}

function WriteToDB(dbname, storename, data) {
  const transaction = Constants.Db.transaction(storename, "readwrite");
  const store = transaction.objectStore(storename);

  const putRequest = store.put(data);

  putRequest.onsuccess = function (event) {
    console.log("Successfully added to the database");
  };

  putRequest.onblocked = function (event) {
    // WriteToDB(dbname, storename, data);
    console.error("Database " + dbname + " is blocked");
  };

  putRequest.onerror = function (event) {
    console.error("Error opening Database " + event.target.error);
  };
}

function CreateAndInitAllDatabases() {
  const deleteRequest = indexedDB.deleteDatabase(Constants.Database.Name);
  console.log("Creating Databases");

  deleteRequest.onerror = function (event) {
    console.error(
      "Cannot delete database " +
        Constants.Database.Name +
        " with error: " +
        event.target.error
    );
  };

  deleteRequest.onsuccess = function (event) {
    console.log(
      "Successfully deleted database " +
        Constants.Database.Name +
        " at " +
        String(new Date())
    );
  };

  const openRequest = indexedDB.open(
    Constants.Database.Name,
    Constants.Database.Version
  );

  openRequest.onupgradeneeded = function (event) {
    console.log(
      "Successfully opened " +
        Constants.Database.Name +
        " at " +
        String(new Date())
    );
    Constants.Db = event.target.result;

    const store = Constants.Db.createObjectStore(
      Constants.Database.Store.name,
      {
        keyPath: Constants.Database.Store.keyPath,
        autoIncrement: Constants.Database.Store.autoIncrement,
      }
    );
    store.createIndex(
      Constants.Database.Store.keyPath,
      Constants.Database.Store.keyPath
    );
    console.log("Created all the stores");
    Constants.StartWritingToDatabase = true;
    self.postMessage({ ev: Constants.OpenDataBase });
  };

  openRequest.onerror = function (event) {
    console.error(
      "Cannot open database " +
        Constants.Database.Name +
        " with error: " +
        event.target.error
    );
  };

  openRequest.onclose = function (event) {
    console.log("Database " + Constants.Database.Name + " closed");
  };
}

main();
