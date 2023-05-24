const Constants = {
  Ipaddress: "",
  TerminalWSExt: ":44444/terminalstream",
  TerminalWSUrl: "",
  TerminalOutput: "terminaloutput",
  ConnectMsg: "connected",
};

const DocElems = {
  Ipaddress: document.getElementById("ipaddress"),
  TerminalOutput: document.getElementById("terminaloutput"),
  TerminalInput: document.getElementById("terminalinput"),
  TerminalSubmitButton: document.getElementById("terminalsubmit"),
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
}

function HandleTerminalOutput(data) {
  console.log(data);
  DocElems.TerminalOutput.innerHTML = DocElems.TerminalOutput.innerHTML + data + "\n";
}

main();
