import { useEffect, useRef, useState } from "react";
import LineChartSocket from "../components/line-chart-socket";
import Logger from "../components/logger";

function Homepage() {
  const [worker, setWorker] = useState<Worker>();
  const [res, setRes] = useState<unknown[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [buttonState, setButtonState] = useState(false);

  function handleStartConnection() {
    worker?.postMessage({ connectionStatus: 'init' });
  }

  function handleStopConnection() {
    worker?.postMessage({ connectionStatus: "stop" });
  };

  useEffect(() => {
    const thisWorker = new Worker(new URL('../workers/main.worker.ts', import.meta.url));
    setWorker(thisWorker);

    return () => {
      thisWorker.terminate();
    }
  }, []);

  useEffect(() => {
    if (worker) {
      worker.addEventListener('message', e => {
        if (typeof e.data === 'string') {
          if (e.data.includes('[')) {
            setLog(prevLogs => [...prevLogs, e.data]);
          } else {
            setRes(prevRes => [...prevRes, { stockPrice: e.data }]);
          }
        }

        if (typeof e.data === 'object') {
          setButtonState(e.data.disableStartButton);
        }
      });
    }
  }, [worker]);

  return (
    <>
      <div className="stats">
        <div className="control-panel">
          <h3>WebWorker WebSocket example</h3>
          <button
            id="start-connection"
            disabled={!worker || buttonState}
            onClick={handleStartConnection}
          >
            Start connection
          </button>
          &nbsp;
          <button 
          id="stop-connection"
          disabled={!buttonState}
          onClick={handleStopConnection}
          >
            Stop connection
          </button>
        </div>
        <LineChartSocket data={res} />
      </div>
      <Logger logs={log} />
    </>
  )
}

export default Homepage;