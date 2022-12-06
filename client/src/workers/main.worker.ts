// @ts-ignore isolatedModules
"use strict"
let socketInstance: WebSocket | null = null;

function createSocketInstance() {
  let socket = new WebSocket("ws://localhost:8080");

  return socket;
}

function socketManagement() {
  if (socketInstance) {
    socketInstance.addEventListener('open', e => {
      console.info('[open] Connection established');
      postMessage('[SOCKET] Connection established');
      socketInstance?.send(JSON.stringify({ socketStatus: true }));
      postMessage({ disableStartButton: true });
    });

    socketInstance.addEventListener('message', e => {
      console.info(`[message] Data received from server: ${e.data}`);
      postMessage(e.data);
    });

    socketInstance.addEventListener('close', e => {
      if (e.wasClean) {
        console.info(`[close] Connection closed cleanly, code=${e.code}`);
        postMessage(`[SOCKET] Connection closed cleanly, code=${e.code}`);
      } else {
        console.info('[close] Connection died');
        postMessage('[SOCKET] Connection died');
      }

      postMessage({ disableStartButton: false });
    });

    socketInstance.addEventListener('error', (error: any) => {
      console.info(`[error] ${'message' in error ? error.message : ''}`);
      postMessage(`[SOCKET] ${'message' in error ? error.message : ''}`);
      socketInstance?.close();
    });
  }

}

self.addEventListener('message', e => {
  const workerData = e.data;
  postMessage('[WORKER] Web worker on message established')
  switch (workerData.connectionStatus) {
    case 'init':
      socketInstance = createSocketInstance();
      socketManagement();
      break;

    case 'stop':
      socketInstance?.close();
      break;

    default:
      socketManagement();
      break;
  }
});