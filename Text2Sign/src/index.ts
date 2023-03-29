import { Text2Sign } from "./Text2Sign";

import * as fs from 'fs'
const svgToPng=(svg:string, callback:Function) =>{
        const url = getSvgUrl(svg);
        svgUrlToPng(url, (imgData:any) => {
            callback(imgData);
            URL.revokeObjectURL(url);
        });
    }
    
    const getSvgUrl=(svg:string) =>{
        return  URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    }
    const svgUrlToPng=(svgUrl:string, callback:Function)=> {
        const svgImage = document.createElement('img');
      
        document.body.appendChild(svgImage);
        svgImage.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = svgImage.clientWidth;
            canvas.height = svgImage.clientHeight;
            const canvasCtx = canvas.getContext('2d');
            canvasCtx.drawImage(svgImage, 0, 0);
            const imgData = canvas.toDataURL('image/png');
            callback(imgData);
            document.body.removeChild(svgImage)
        };
        svgImage.src = svgUrl;
     }





export {Text2Sign,svgToPng}