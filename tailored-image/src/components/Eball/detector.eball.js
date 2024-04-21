import { useRef, useEffect } from "react";

import * as tf from "@tensorflow/tfjs";
import drawMesh from "./utilities";
import Webcam from "react-webcam";

const Detector = () => {

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const blazeface = require('@tensorflow-models/blazeface')
  
    //  Load face landmarks detection
    const runFaceDetectorModel = async () => {
  
      const model = await blazeface.load()
      console.log("FaceDetection Model is Loaded..") 
      setInterval(() => {
        detect(model);
      }, 100);
   
    }
  
    const detect = async (net) => {
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;
  
        // Set video width
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
  
        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        // Make Detections
        const face = await net.estimateFaces(video);
        //console.log(face);
  
        // Websocket
        var socket = new WebSocket('ws://localhost:8000')
        var imageSrc = webcamRef.current.getScreenshot()
        var apiCall = {
          event: "localhost:subscribe",
          data: { 
            image: imageSrc
          },
        };
        socket.onopen = () => socket.send(JSON.stringify(apiCall))
        socket.onmessage = function(event) {
          var pred_log = JSON.parse(event.data)
          document.getElementById("Angry").value = Math.round(pred_log['predictions']['angry']*100)
          document.getElementById("Neutral").value = Math.round(pred_log['predictions']['neutral']*100)
          document.getElementById("Happy").value = Math.round(pred_log['predictions']['happy']*100)
          document.getElementById("Fear").value = Math.round(pred_log['predictions']['fear']*100)
          document.getElementById("Surprise").value = Math.round(pred_log['predictions']['surprise']*100)
          document.getElementById("Sad").value = Math.round(pred_log['predictions']['sad']*100)
          document.getElementById("Disgust").value = Math.round(pred_log['predictions']['disgust']*100)
  
          document.getElementById("emotion_text").value = pred_log['emotion']
  
          // Get canvas context
          const ctx = canvasRef.current.getContext("2d");
          requestAnimationFrame(()=>{drawMesh(face, pred_log, ctx)});
        }
      }
    };
  
    useEffect(()=>{runFaceDetectorModel()}, []);

    return (
        <>
            <div className="min-h-screen flex flex-col justify-start">
                <div>
                <div className="flex p-5 rounded-lg mb-5 bg-[#B5D5C5] border-2 border-black relative" style={{ boxShadow: "0.4rem 0.4rem 0 #222" }}>
    <div style={{ display: "flex", alignItems: "flex-start" }}>
        <Webcam ref={webcamRef}/>
        <div className="ml-5 flex flex-col">
            <label htmlFor="Angry" style={{ color: 'red' }}>Angry </label>
            <progress id="Angry" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Neutral" style={{ color: 'lightgreen' }}>Neutral </label>
            <progress id="Neutral" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Happy" style={{ color: 'orange' }}>Happy </label>
            <progress id="Happy" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Fear" style={{ color: 'lightblue' }}>Fear </label>
            <progress id="Fear" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Surprise" style={{ color: 'yellow' }}>Surprised </label>
            <progress id="Surprise" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Sad" style={{ color: 'gray' }}>Sad </label>
            <progress id="Sad" value="0" max="100">10%</progress>
            <br></br>
            <label htmlFor="Disgust" style={{ color: 'pink' }}>Disgusted </label>
            <progress id="Disgust" value="0" max="100">10%</progress>
        </div>
    </div>
    <canvas 
        ref={canvasRef} 
        style={{
            position: "absolute",
            left: "30%",
            transform: "translateX(-50%)",
            // bottom: "-20px",
            zIndex: "9",
            width: "640px",
            height: "480px",
        }}
    />
</div>

                    <div
                        className="flex p-5 bg-[#a970ca] rounded-lg mt-5 mb-5 border-2 border-black"
                        style={{ boxShadow: "0.4rem 0.4rem 0 #222" }}>
                            <h3>Emotion Prediction Results: </h3>
                        <input 
                            id="emotion_text" 
                            name="emotion_text" 
                            value="Neutral"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Detector;
