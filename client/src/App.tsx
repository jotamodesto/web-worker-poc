import { useState } from 'react'
import Homepage from './pages/homepage';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Homepage />
    </div>
  )
}

export default App
