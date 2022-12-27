
import './App.css';
import React, { useCallback,   useEffect,   useRef, useState } from 'react';
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
  const [isPoseEstimation, setIsPoseEstimation] = useState(false)

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

    // result.estimatePoses
  },[])
  useEffect(() => {
    if(!model){
      loadPosenet()
    }
    
    console.log('Posenet Model Loaded..')
    console.log(model)
  },[loadPosenet, model] )
  
  
  
  const poseEstimationLoop = useRef(0)
  const startPoseEstimation = useCallback(() => {
    if(!webcamRef.current) return

    poseEstimationLoop.current = window.setInterval(async () => {
      const video = webcamRef.current?.video
      const { videoWidth, videoHeight } = video;

      const pose = await model?.estimatePoses(video, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
      })
      console.log(pose)
    },100)
  }, [model])
  const stopPoseEstimation = useCallback(() => window.clearInterval(poseEstimationLoop.current),[])
  const handlePoseEstimation = useCallback(() =>{
    if(isPoseEstimation){
      stopPoseEstimation()
      setIsPoseEstimation(false)
    }  else {
      startPoseEstimation()
      setIsPoseEstimation(true)
    }
  }, [isPoseEstimation, startPoseEstimation, stopPoseEstimation])

  return (
    <div className="App">
      <header className="App-header">
        Fitness Assistant
      </header>
      <button onClick={handlePoseEstimation}>
        {isPoseEstimation ? 'Stop': 'Start'}
      </button>
      <Webcam
      ref={webcamRef}
      style={{
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 30,
        left: 0,
        right: 0,
        textAlign: "center",
      }}
        audio={false}
        height={600}
        screenshotFormat="image/jpeg"
        width={800}
        videoConstraints={videoConstraints}
      />
    </div>
  );
}

export default App;
