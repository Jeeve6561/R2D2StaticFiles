function main() {
  let ipaddress = document.getElementById("ipaddress").innerHTML;
  document.getElementById("ipaddress").innerHTML = "";
  let url = "ws://" + ipaddress + ":50001/socket.io/?EIO=3&transport=websocket";
  var terminal = new WebTTY({
    target: document.getElementById("terminal"),
    socketUrl: ipaddress,
  });
}

main();
