import React, { useRef } from 'react';
import './sass/App.scss';
import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import {drawMesh} from './actions/utilities';
//Plano xyz con ScaledMesh

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runFaceMesh = async() => {
    const net = await facemesh.load({
      inputResolution: {width:640, height:480}, scale:0.8
    });
    setInterval(() => {detect(net)}, 100);
  };

  const detect = async(net) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4 ){
      //Propiedades del video
      const video = webcamRef.current.video;
      const videoWidth= webcamRef.current.video.videoWidth;
      const videoHeight= webcamRef.current.video.videoHeight;
      //Video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;
      //canvas width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
      //hacer detecciones
      const face = await net.estimateFaces(video);
      console.log(face);
      //Obtener el contexto del canvas para dibujar
      const ctx = canvasRef.current.getContext('2d');
      drawMesh(face,ctx);

    }
  }

  //runFaceMesh();

  return (
    <div className="App">
      <div className="App-header">
        <Webcam className="webcam" ref={webcamRef}/>
        <canvas className="canvas" ref={canvasRef}/>
      </div>
    </div>
  );
}

export default App;
