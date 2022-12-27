
import './App.css';
import { useCallback,   useEffect,   useRef, useState } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';
// posenet is deprecated, import pose-detection instead
import * as posedetection from '@tensorflow-models/pose-detection';
import Webcam from "react-webcam";

const videoConstraints = {
  width: 800,
  height: 600,
  facingMode: "user"
};


function App() {


  const [model, setModel] = useState();
  const webcamRef = useRef(null);
  const loadPosenet = useCallback(async () => {
    const posenet = posedetection.SupportedModels.PoseNet;
    const result = await posedetection.createDetector(posenet, {
      quantBytes: 4,
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: {width: 800, height: 600},
      multiplier: 0.75
    });
    setModel(result)
  },[])
  
  useEffect(() => {
    if(!model){
      loadPosenet()
    }

    console.log('Posenet Model Loaded..')
    console.log(model)
  },[loadPosenet, model] )


  return (
    <div className="App">
      <header className="App-header">
        Fitness Assistant
      </header>
      <Webcam
      ref={webcamRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: 0,
        right: 0,
        textAlign: "center",
        zindex: 9
      }}
        audio={false}
        height={600}
        screenshotFormat="image/jpeg"
        width={800}
        videoConstraints={videoConstraints}
      >
        {({ getScreenshot }) => (
          <button
            onClick={() => {
              const imageSrc = getScreenshot()
              console.log(imageSrc)
            }}
          >
            Capture photo
          </button>
        )}
      </Webcam>
    </div>
  );
}

export default App;
