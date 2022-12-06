type LoggerProps = {
  logs: string[];
}

function Logger({ logs }: LoggerProps) {
  return <div className="logger" >
    <h4>Logged messages</h4>
    <ul>
      {logs.map((item, index) => (
        <li key={`v-${index}`}>{item}</li>
      ))}
    </ul>
  </div>
}

export default Logger;