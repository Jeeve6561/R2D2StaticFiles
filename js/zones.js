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

const Tables = {
  Zones: new Tabulator("#zonetable", {
    data: [],
    layout: "fitDataFill",
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

  const parentWorker = new Worker("/static/js/websocket.js");
  parentWorker.postMessage({ ip: Constants.Ipaddress, id: 2 });

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

  if (data.length === 0) {
    // Tables.Zones.setData(d);
    Tables.Zones.clearData();
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
