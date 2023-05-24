const Constants = {
  Ipaddress: "",
  TerminalWSExt: ":50001/terminalstream",
  TerminalWSUrl: "",
  TerminalOutput: "terminaloutput",
  TerminalInvalid: "invalidevent",
  TerminalCommand: "executecommand",
  ConnectMsg: "connected",
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  TerminalOutput: document.getElementById("terminaloutput"),
  TerminalInput: document.getElementById("terminalinput"),
  TerminalSubmitButton: document.getElementById("terminalsubmit"),
  TerminalClearButton: document.getElementById("terminalclear"),
};

const TerminalWS = {
  init: false,
  connected: false,
  connectTime: 0,
  disconnectTime: 0,
  ws: null,

  connect() {
    TerminalWS.connected = true;
    TerminalWS.url = Constants.TerminalWSUrl;
    TerminalWS.ws = new WebSocket(TerminalWS.url);
    TerminalWS.ws.onopen = TerminalWS.openSocket;
    TerminalWS.ws.onclose = TerminalWS.closeSocket;
    TerminalWS.ws.onerror = TerminalWS.errorSocket;
    TerminalWS.ws.onmessage = TerminalWS.messageReceived;
  },

  openSocket() {
    TerminalWS.connected = true;
    TerminalWS.connectTime = new Date();
    console.log(
      "Connecting to " +
        String(TerminalWS.url) +
        " at " +
        String(TerminalWS.connectTime)
    );
  },

  closeSocket() {
    TerminalWS.connected = false;
    TerminalWS.disconnectTime = new Date();
    console.log(
      "Disconnecting from " + String(TerminalWS.url) + " at ",
      String(TerminalWS.disconnectTime)
    );
    TerminalWS.ws = null;
  },

  errorSocket(event) {
    console.error(
      "Error occurred in " +
        String(TerminalWS.url) +
        " at " +
        String(new Date()) +
        " | " +
        event.data
    );
  },

  messageReceived(event) {
    let msg = JSON.parse(event.data);
    switch (msg.ev) {
      case Constants.ConnectMsg:
        console.log("Name of socket manager:", msg.n);
        break;
      case Constants.TerminalOutput:
        HandleTerminalOutput(msg.d);
        break;
      case Constants.TerminalInvalid:
        HandleTerminalOutput(msg.d);
        break;
      default:
        console.warn("Received invalid message event of:", msg.ev);
        break;
    }
  },

  sendMessage(msg) {
    if (TerminalWS.ws.readyState === WebSocket.OPEN && TerminalWS.connected) {
      let data = JSON.stringify(msg);
      TerminalWS.ws.send(data);
    } else {
      console.error("Failed to send and retrying");
      setTimeout(() => {
        TerminalWS.sendMessage(msg);
      }, 1000);
    }
  },
};

function main() {
  Constants.Ipaddress = DocElems.Ipaddress.innerHTML;
  DocElems.Ipaddress.innerHTML = "";
  Constants.TerminalWSUrl =
    "ws://" + Constants.Ipaddress + Constants.TerminalWSExt;

  TerminalWS.connect();

  DocElems.TerminalSubmitButton.addEventListener("click", HandleTerminalInput);
  DocElems.TerminalInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      HandleTerminalInput();
    }
  });
  DocElems.TerminalClearButton.addEventListener("click", ClearTerminalOutput);
}

function HandleTerminalOutput(data) {
  if (data.err === "") {
    let lines = data.out.split("\n");
    lines.forEach((elem) => {
      DocElems.TerminalOutput.innerHTML =
        DocElems.TerminalOutput.innerHTML + elem + "<br>";
    });
  } else {
    DocElems.TerminalOutput.innerHTML =
      DocElems.TerminalOutput.innerHTML +
      "Received Error: " +
      data.err +
      "<br>";
  }
  DocElems.TerminalOutput.scrollTo(0, DocElems.TerminalOutput.scrollHeight);
}

function HandleTerminalInput() {
  let cmd = DocElems.TerminalInput.value;
  DocElems.TerminalInput.value = "";
  if (cmd === "") {
    return;
  }
  let d = cmd.split(" ");
  let data = [];
  d.forEach((elem) => {
    if (elem !== "" && elem !== " ") {
      data.push(elem);
    }
  });
  let cmds = {};
  if (data.length === 0) {
    return;
  } else if (data.length === 1) {
    cmds.name = data[0];
  } else {
    cmds.name = data[0];
    cmds.args = data.slice(1);
  }
  let msg = {
    ev: Constants.TerminalCommand,
    n: "R2D2 Terminal Client",
    d: cmds,
  };
  TerminalWS.sendMessage(msg);
}

function ClearTerminalOutput() {
  DocElems.TerminalOutput.innerHTML = "Terminal Output:<br>";
}

main();
