import { useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import drawMesh from "./utilities";
import Webcam from "react-webcam";

const Detector = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const blazeface = require('@tensorflow-models/blazeface');
    let intervalId;

    // function resetPredictions to set all emotion values to 0
    const resetPredictions = () => {
      document.getElementById("Angry").value = 0;
      document.getElementById("Neutral").value = 0;
      document.getElementById("Happy").value = 0;
      document.getElementById("Fear").value = 0;
      document.getElementById("Surprise").value = 0;
      document.getElementById("Sad").value = 0;
      document.getElementById("Disgust").value = 0;
      document.getElementById("emotion_text").value = "Neutral";
    };

    const detectFaces = async (net) => {
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

            // Websocket
            var socket = new WebSocket('ws://localhost:8000');
            var imageSrc = webcamRef.current.getScreenshot();
            var apiCall = {
                event: "localhost:subscribe",
                data: {
                    image: imageSrc
                },
            };
            socket.onopen = () => socket.send(JSON.stringify(apiCall));
            socket.onmessage = function (event) {
              console.log("Received message:", event.data);
              var pred_log = JSON.parse(event.data);
              resetPredictions(); // Reset predictions
              console.log("Parsed data:", pred_log);
              document.getElementById("Angry").value = Math.round(pred_log['predictions']['angry'] * 100);
              document.getElementById("Neutral").value = Math.round(pred_log['predictions']['neutral'] * 100);
              document.getElementById("Happy").value = Math.round(pred_log['predictions']['happy'] * 100);
              document.getElementById("Fear").value = Math.round(pred_log['predictions']['fear'] * 100);
              document.getElementById("Surprise").value = Math.round(pred_log['predictions']['surprise'] * 100);
              document.getElementById("Sad").value = Math.round(pred_log['predictions']['sad'] * 100);
              document.getElementById("Disgust").value = Math.round(pred_log['predictions']['disgust'] * 100);
              document.getElementById("emotion_text").value = pred_log['emotion'];
              // Get canvas context
              const ctx = canvasRef.current.getContext("2d");
              requestAnimationFrame(() => { drawMesh(face, pred_log, ctx) });
            };
         }
      };

    // function startWebcam to start predictions
    const startWebcam = async () => {
        setIsWebcamActive(true);
        const model = await blazeface.load();
        console.log("FaceDetection Model is Loaded..");

        intervalId = setInterval(() => {
            if (isWebcamActive) {
                detectFaces(model);
            }
        }, 100);
    };

    // function stopWebcam to stop predictions
    const stopWebcam = () => {
        clearInterval(intervalId);
        setIsWebcamActive(false);
        resetPredictions();

        // Clear canvas content
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col justify-start">
                <div>
                    <div className="flex p-5 rounded-lg mb-5 bg-[#B5D5C5] border-2 border-black relative" style={{ boxShadow: "0.4rem 0.4rem 0 #222" }}>
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                            <Webcam ref={webcamRef} />
                            <div className="ml-5 flex flex-col">
                                <label htmlFor="Angry" style={{ color: 'red' }}>Angry </label>
                                <progress id="Angry" defaultValue="0" max="100">10%</progress>
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
                                zIndex: "9",
                                width: "640px",
                                height: "480px",
                            }}
                        />
                    </div>

                    <div className="flex p-5 bg-[#a970ca] rounded-lg mt-5 mb-5 border-2 border-black" style={{ boxShadow: "0.4rem 0.4rem 0 #222" }}>
                        <h3>Emotion Prediction Results: </h3>
                        <input
                            id="emotion_text"
                            name="emotion_text"
                            defaultValue="Neutral"
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button className="mr-2 p-2 bg-green-500 text-white rounded" onClick={startWebcam}>Start</button>
                    <button className="p-2 bg-red-500 text-white rounded" onClick={stopWebcam}>Stop</button>
                </div>
            </div>
        </>
    );
};

export default Detector;
