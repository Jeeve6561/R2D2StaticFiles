const Constants = {
  Ipaddress: "",
  Origin: "",
  ThisProgram: "R2D2",

  Database: {
    Name: "RadarData",
    Version: 1,
    Store: { name: "Bubbles", keyPath: "id", autoIncrement: false },
  },
  Db: 0,

  Id: 3,
  ZoneSymbol: "TSLA",
  Quadrant: "all",
  ZoneData: { h: []},

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
    // persistence: true,
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
        title: "T Sts",
        field: "sts",
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
        title: "Srt Time",
        field: "st",
      },
      {
        title: "End Time",
        field: "et",
      },
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
        title: "Srt Prc",
        field: "sp",
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
        title: "End Prc",
        field: "ep",
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
        title: "Cpl",
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
        title: "Dol Mul",
        field: "dm",
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

  const childWorker = new Worker("/static/js/websocket.js");
  childWorker.postMessage({ ip: Constants.Ipaddress, id: Constants.Id });
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
    // Tables.Zones.setData(d);
    Tables.Zones.clearData();
    return;
  }

  // let elem = [];
  data.forEach((e) => {
    if (e.sym === Constants.ZoneSymbol) {
      d = e.h;
    }
    // e.h.forEach((el) => {
    //   d.push(el);
    // });
  });

  // if (Constants.Quadrant == "1") {
  //   elem.forEach((e) => {
  //     if (e.q === 1) {
  //       d.push(e);
  //     }
  //   });
  // } else if (Constants.Quadrant == "2") {
  //   elem.forEach((e) => {
  //     if (e.q === 2) {
  //       d.push(e);
  //     }
  //   });
  // } else if (Constants.Quadrant == "3") {
  //   elem.forEach((e) => {
  //     if (e.q === 3) {
  //       d.push(e);
  //     }
  //   });
  // } else if (Constants.Quadrant == "4") {
  //   elem.forEach((e) => {
  //     if (e.q === 4) {
  //       d.push(e);
  //     }
  //   });
  // } else {
  //   d = [...elem];
  // }

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
