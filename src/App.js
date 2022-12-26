
import './App.css';
import { useCallback,   useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

function App() {

  const inputRef = useRef();
  const modelRef = useRef( tf.sequential({
    // Define a one-layer sequential model in the handleRunTraining function.
    // Use inputShape = 1 and 1 unit for the result.
    layers: [tf.layers.dense({units: 1, inputShape: [1]})]
  }));

  const doTraining = useCallback(async (input, target) => {
    const m = modelRef.current
    const h = await m?.fit(input, target, {
      epochs: 200
    })
    // statistic onEpochEnd
    h.onEpochEnd(epoch => {
      console.log(`Epoch ${epoch}: loss = ${h.history.loss[epoch]}`);
    })
  },[])

  const handleRunTraining= useCallback(async (e) => {
    // Compile the model with the SGD optimizer and meanSquaredError loss.
    // Output the model summary. (what does it mean to outpout the model summary?)
    modelRef.current.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

    
    const input = tf.tensor2d([2, 3, 4, 5, 6, 7], [6, 1]);
    const target = tf.tensor2d([3, 5, 7, 9, 11, 13], [6, 1]);
    doTraining(input, target)


    // pass value 10, and print the result of close to 19 
    // the result is usually > 18.8xx
    modelRef.current.predict(tf.tensor2d([10], [1,1])).print()
  }, [doTraining])


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
