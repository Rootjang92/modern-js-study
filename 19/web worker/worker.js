importScripts("prime.js");
onmessage = function(e) {
  console.log("worker: message received");
  var message = e.data;
  var n = parseInt(message);
  postMessage(prime(n));
}
