"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgToPng = exports.Text2Sign = void 0;
var Text2Sign_1 = require("./Text2Sign");
Object.defineProperty(exports, "Text2Sign", { enumerable: true, get: function () { return Text2Sign_1.Text2Sign; } });
var svgToPng = function (svg, callback) {
    var url = getSvgUrl(svg);
    svgUrlToPng(url, function (imgData) {
        callback(imgData);
        URL.revokeObjectURL(url);
    });
};
exports.svgToPng = svgToPng;
var getSvgUrl = function (svg) {
    return URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
};
var svgUrlToPng = function (svgUrl, callback) {
    var svgImage = document.createElement('img');
    document.body.appendChild(svgImage);
    svgImage.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        var canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        var imgData = canvas.toDataURL('image/png');
        callback(imgData);
        document.body.removeChild(svgImage);
    };
    svgImage.src = svgUrl;
};
//# sourceMappingURL=index.js.map