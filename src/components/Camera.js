import React, { useState, useEffect, useRef } from 'react'
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';


const Camera =  (props) => {

    const container = {
        position: "relative"
    };
    const canvasRelative = {
        position: "absolute",
        left: 0,
        top: 0
    }
    
    
    const [mediaStream, setMediaStream] = useState(null);
    const [loaded, setLoaded] = useState(null);

    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
     
        let m = 0;
        async function getInfoFromMedia(model) {
            
            m++
            const imageDetection = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
            const detectionsForSize = faceapi.resizeResults(imageDetection, { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight })
            const predictions = await model.detect(videoRef.current);
            handleCapture(predictions)

            faceapi.draw.drawDetections(canvasRef.current, detectionsForSize)

            setTimeout(function(){ 
                console.log(m);
                getInfoFromMedia(model); 
            }, 500);

            // requestAnimationFrame(() => {
            //     console.log(m);
            //     getInfoFromMedia(model);
            //   });

        }
        
     
        let stream = null;
        let constraints = { video: { width: 640, height: 480 }}

        async function enableStream() {
            try {
                setLoaded("Loading FaceApiModels")
                await faceapi.loadTinyFaceDetectorModel('/models')
                stream = await navigator.mediaDevices.getUserMedia(constraints);
                // await timeout(3000);
                setMediaStream(stream);
                setLoaded("Loading cocoSsd Models... it takes time")
                const model = await cocoSsd.load();
                await getInfoFromMedia(model)
                setLoaded(null)

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

    },[mediaStream, setLoaded])


    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function handleCapture(predictions) {
        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        //context.drawImage(videoRef.current, 0, 0);
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
    }

    
    
    function handleCanPlay() {
        videoRef.current.play();
    }



    return (
        <div>
            <h1>Object and Face Recognition</h1>
            {
              loaded ? (
                <div>{loaded}</div>
              ) : (
                ""
              )
            }
           
            
            <div style={container} >
                <video ref={videoRef} onCanPlay={handleCanPlay} />
                <canvas style={canvasRelative} ref={canvasRef} width="640"  height="480"  />
            </div>

            
            
           
        </div>
    )
};

export default Camera
