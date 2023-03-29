"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Text2Sign = void 0;
var Text2Sign = /** @class */ (function () {
    function Text2Sign() {
        this.svgString = '';
        this.font = 'Arial';
        this.fontSize = 30;
        this.x = '50%';
        this.y = '50%';
        this.text = 'RandomText';
        this.width = (this.fontSize * this.text.length) - 100;
        this.hight = this.fontSize + 20;
        this.fill = 'black';
        this.svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\"  width=\"".concat(this.width, "\" height=\"").concat(this.hight, "\">\n\n        <text x=\"").concat(this.x, "\" y=\"").concat(this.y, "\" text-anchor=\"middle\" font-family=\"").concat(this.font, "\" font-size=\"").concat(this.fontSize, "\" fill=\"").concat(this.fill, "\">").concat(this.text, "</text>\n        </svg>");
    }
    Text2Sign.prototype.generateSignature = function (text, fontSize, font, color) {
        this.text = text;
        this.fontSize = fontSize ? fontSize : this.fontSize;
        this.font = font ? font.name : this.font;
        var style = null;
        if (font === null || font === void 0 ? void 0 : font.url) {
            style = "<style>\n            @font-face { \n            font-family: \"".concat(font.name, "\"; \n            src: url(\"").concat(font.url, "\") format(\"opentype\");\n        }\n        text{\n            font-family:\"").concat(font.name, "\"\n        }\n        </style>");
        }
        this.fill = color ? color : this.fill;
        this.x = '50%';
        this.y = '65%';
        this.width = ((this.fontSize) * (this.text.length / 2));
        this.hight = this.fontSize * 2;
        this.svgString = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"sign\" width=\"".concat(this.width, "\" height=\"").concat(this.hight, "\">    ").concat(style !== null ? style : '', "        <text x=\"").concat(this.x, "\" y=\"").concat(this.y, "\" text-anchor=\"middle\" font-family=\"").concat(this.font, "\" font-size=\"").concat(this.fontSize, "\" fill=\"").concat(this.fill, "\">").concat(this.text, "</text>    </svg>");
    };
    Text2Sign.prototype.getImageData = function () {
        var serializer = new XMLSerializer();
        var svgData = serializer.serializeToString(new DOMParser().parseFromString(this.svgString, 'image/svg+xml'));
        var img = new Image();
        img.onload = function () {
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        return img;
    };
    Text2Sign.prototype.getSVGdata = function () {
        return this.svgString;
    };
    return Text2Sign;
}());
exports.Text2Sign = Text2Sign;
//# sourceMappingURL=Text2Sign.js.map