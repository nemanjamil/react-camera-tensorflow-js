import React, { useState, useEffect, useRef } from 'react'
//import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

//import '@tensorflow/tfjs-node-gpu';
import * as faceapi from 'face-api.js';

const Camera =  (props) => {

    const [mediaStream, setMediaStream] = useState(null);
    const [seconds] = useState(0);

    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
     
    
        // function setStartInterval(stream,model){
        //       setInterval(() => {
        //         setSeconds(seconds => seconds + 1);
        //         handleCapture()
        //       }, 3000);
        // }

        let m = 0;
        async function getInfoFromMedia(model) {
            
            m++
           
            const imageDetection = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            console.log("imageDetection",  imageDetection);
            console.log(videoRef.current);
            console.dir(videoRef.current);

            // // resize the detected boxes in case your displayed image has a different size then the original
            const detectionsForSize = faceapi.resizeResults(imageDetection, { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight })

            console.log("detectionsForSize", detectionsForSize);
            // const canvas = document.getElementById('overlay')
            // canvas.width = videoRef.current.videoWidth
            // canvas.height = videoRef.current.videoHeight
            faceapi.draw.drawDetections(videoRef.current, detectionsForSize)


            const predictions = await model.detect(videoRef.current);
            handleCapture(predictions)
            requestAnimationFrame(() => {
                console.log(m);
                 
                getInfoFromMedia(model);
              });

            //console.log(predictions);
        }
        
     
        let stream = null;
        let constraints = { video: { width: 300, height: 300 }}
        //let interval = '';

        async function enableStream() {
            try {
              await faceapi.loadTinyFaceDetectorModel('/models')
              stream = await navigator.mediaDevices.getUserMedia(constraints);
              setMediaStream(stream);
              const model = await cocoSsd.load();
              await getInfoFromMedia(model)

            } catch(err) {
              
            }
          }

          if (!mediaStream) {
            enableStream();
          } else {
            return function cleanup() {
              mediaStream.getTracks().forEach(track => {
                track.stop();
              });
            }
          }

          //return () => clearInterval(interval);

    },[mediaStream])


    

    function handleCapture(predictions) {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(videoRef.current, 0, 0);
        const font = "24px helvetica";
        context.font = font;
        context.textBaseline = "top";

        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const width = prediction.bbox[2];
            const height = prediction.bbox[3];
            // Draw the bounding box.
            context.strokeStyle = "#2fff00";
            context.lineWidth = 1;
            context.strokeRect(x, y, width, height);
            // Draw the label background.
            context.fillStyle = "#2fff00";
            const textWidth = context.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10);
            // draw top left rectangle
            context.fillRect(x, y, textWidth + 10, textHeight + 10);
            // draw bottom left rectangle
            context.fillRect(x, y + height - textHeight, textWidth + 15, textHeight + 10);
      
            // Draw the text last to ensure it's on top.
            context.fillStyle = "#000000";
            context.fillText(prediction.class, x, y);
            context.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
          });

    
        
      } 
   
   
    if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
        console.log("VIDEORED",videoRef.current.srcObject);
      }

    
    
    function handleCanPlay() {
        videoRef.current.play();
    }

    return (
        <div>
            <h1>CAMERA</h1>
            Count: {seconds}
           
            <div>
                 <video ref={videoRef} onCanPlay={handleCanPlay} />
            </div>
            <div>
                <canvas
                    
                    ref={canvasRef}
                    width="400"
                    height="400"
                />
            </div>
   

        </div>
    )
};

export default Camera
