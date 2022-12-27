
import './App.css';
import React, { useCallback,   useEffect,   useRef, useState } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-webgpu';
// posenet is deprecated, import pose-detection instead
import * as posedetection from '@tensorflow-models/pose-detection';
import Webcam from "react-webcam";
import {drawKeypoints, drawSkeleton} from './utilities'


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

  const canvasRef = useRef()

  const toCamelCase = useCallback((snakeCase) => {
    return snakeCase.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  },[])
  const drawCanvas = useCallback((pose, width, height) => {
    const ctx = canvasRef.current?.getContext('2d')
    canvasRef.current.width = width ?? 0
    canvasRef.current.height = height ?? 0

    console.log('what is pose', pose)
    drawKeypoints(pose[0].keypoints, 0.6, ctx)
 
   
    // drawSkeletion still use depreacted schema of posenet, we will convert current keypoints to that schema
    const keyPointsOld = pose[0].keypoints.map((keypoint) => ({
      position: {
        x: keypoint.x,
        y: keypoint.y
      }, 
      score: keypoint.score,
      part: toCamelCase(keypoint.name)
    }))

    drawSkeleton(keyPointsOld, 0.7, ctx)
  },[toCamelCase])
  
  
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

      drawCanvas(pose, videoWidth, videoHeight)
    },100)
  }, [drawCanvas, model])
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
        margin: "30px auto 0",
        left: 0,
        textAlign: "center",
      }}
        audio={false}
        height={600}
        screenshotFormat="image/jpeg"
        width={800}
        videoConstraints={videoConstraints}
      />
      <canvas 
        style={{
          position: "absolute",
          margin: "30px auto 0",
          left: 0,
          textAlign: "center"
        }}
      ref={canvasRef} width="800" height="600" />
    </div>
  );
}

export default App;
