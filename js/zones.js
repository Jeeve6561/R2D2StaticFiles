const Constants = {
  Ipaddress: "",
  Origin: "",
  RequestWSUrl: "",
  RequestWSExt: ":55555/wstacstream",
  ThisProgram: "R2D2",

  SymZoneDataRequest: "symbolzonedatarequest",

  Database: {
    Name: "ZoneData",
    Version: 1,
    Store: { name: "AllData", keyPath: "id", autoIncrement: false },
  },
  Db: 0,

  Id: 2,
  ZoneSymbol: "TSLA",
  Quadrant: "all",
  ZoneData: { h: [], id: 2 },

  OpenDataBase: "openDB",
  DataUpdate: "updateddata",
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  symbolinput: document.getElementById("symbolinput"),
  symbolinputbutton: document.getElementById("symbolinputbutton"),
  quadrantinput: document.getElementById("quadrantinput"),
  quadrantinputbutton: document.getElementById("quadrantinputbutton"),
};

const Tables = {
  Zones: new Tabulator("#zonetable", {
    data: [],
    layout: "fitDataFill",
    persistence: true,
    // layout: "fitDataStretch",
    // rowClick: ClickRadarTableRow,
    // pagination: true,
    movableColumns: true,
    initialSort: [
      { column: "sec", dir: "desc" },
      { column: "rank", dir: "asc" },
      { column: "id", dir: "desc" },
    ],
    columns: [
      {
        title: "Thm",
        field: "thm",
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
      // {
      //   title: "Quad",
      //   field: "q",
      //   topCalc: "count",
      //   hozAlign: "right",
      // },
      // {
      //   title: "Rank",
      //   field: "r",
      //   hozAlign: "right",
      // },
      {
        title: "Zone",
        field: "zone",
        topCalc: "count",
        hozAlign: "right",
      },
      {
        title: "Cycle Cnt",
        field: "cnt",
        topCalc: "sum",
        hozAlign: "right",
      },
      {
        title: "Dur Qual",
        field: "dq",
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
        title: "Cpl Mean",
        field: "cm",
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
        title: "Cpl Sdv",
        field: "cs",
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
        title: "Cpl High",
        field: "ch",
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
        title: "Cpl Low",
        field: "cl",
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
        title: "Emin Mean",
        field: "emm",
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
        title: "Emin Sdv",
        field: "ems",
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
        title: "Emin High",
        field: "emh",
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
        title: "Emin Low",
        field: "eml",
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
        title: "Emin A Mean",
        field: "emam",
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
        title: "Emin A Sdv",
        field: "emas",
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
        title: "Emin A Qual",
        field: "emaq",
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
        title: "Emin A High",
        field: "emah",
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
        title: "Emin A Low",
        field: "emal",
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
        title: "Dur Mean",
        field: "dm",
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
        field: "dsum",
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
        field: "dpc",
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
        title: "Dur Sdv",
        field: "ds",
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
        title: "Dur High",
        field: "dh",
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
        title: "Dur Low",
        field: "dl",
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
      // {
      //   title: "Shares",
      //   field: "s",
      //   topCalc: "sum",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 0,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     precision: 0,
      //   },
      // },
      // {
      //   title: "Dollars",
      //   field: "d",
      //   topCalc: "sum",
      //   hozAlign: "right",
      //   formatter: "money",
      //   formatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     symbol: "$",
      //     precision: 2,
      //   },
      //   topCalcFormatter: "money",
      //   topCalcFormatterParams: {
      //     decimal: ".",
      //     thousand: ",",
      //     symbol: "$",
      //     precision: 2,
      //   },
      // },
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

  const childWorker = new Worker("/static/js/websocket.js");
  childWorker.postMessage({ dbname:Constants.Database.Name, ip: Constants.Ipaddress, id: Constants.Id });
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

  let data = Constants.ZoneData.h;

  if (data.length === 0) {
    Tables.Zones.clearData();
    return;
  }

  // let elem = [];
  data.forEach((e) => {
    if (e.sym === Constants.ZoneSymbol) {
      d = e.h;
    }
      // e.h.forEach((el) =>{
      //   d.push(el)
      // });
  });

  Tables.Zones.setData(d);
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

main();
