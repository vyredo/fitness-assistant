
import './App.css';
import { useCallback,  useRef } from 'react';

function App() {

  const inputRef = useRef();



  const handleRunTraining= useCallback((e) => {

    console.log('Run training');
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        Fitness Assistant
      </header>
      <input  type={"file"} style={{visibility: 'hidden'}} ref={inputRef}/>
      <button onClick={handleRunTraining}>Run training</button>
    </div>
  );
}

export default App;
