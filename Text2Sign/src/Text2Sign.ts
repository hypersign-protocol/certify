
interface font {
    url?: string,
    name: string
}

class Text2Sign {
    svgString = ''


    font = 'Arial'
    fontSize = 30
    x = '50%'
    y = '50%'
    text = 'RandomText';

    width = (this.fontSize * this.text.length) - 100
    hight = this.fontSize + 20

    fill = 'black'
    constructor() {

        this.svgString = `<svg xmlns="http://www.w3.org/2000/svg"  width="${this.width}" height="${this.hight}">

        <text x="${this.x}" y="${this.y}" text-anchor="middle" font-family="${this.font}" font-size="${this.fontSize}" fill="${this.fill}">${this.text}</text>
        </svg>`
    }
    public generateSignature(text: string, fontSize?: number, font?: font, color?: string) {
        this.text = text
        this.fontSize = fontSize ? fontSize : this.fontSize
        this.font = font ? font.name : this.font
        let style = null
        if (font?.url) {
            style = `<style>
            @font-face { 
            font-family: "${font.name}"; 
            src: url("${font.url}") format("opentype");
        }
        text{
            font-family:"${font.name}"
        }
        </style>`

        }


        this.fill = color ? color : this.fill

        this.x = '50%'
        this.y = '65%'

        this.width = ((this.fontSize) * (this.text.length / 2))
        this.hight = this.fontSize * 2
        this.svgString = `<svg xmlns="http://www.w3.org/2000/svg" id="sign" width="${this.width}" height="${this.hight}">    ${style !== null ? style : ''}        <text x="${this.x}" y="${this.y}" text-anchor="middle" font-family="${this.font}" font-size="${this.fontSize}" fill="${this.fill}">${this.text}</text>    </svg>`


    }
    public getImageData() {


        const serializer = new XMLSerializer();
        const svgData = serializer.serializeToString(new DOMParser().parseFromString(this.svgString, 'image/svg+xml'));
        const img = new Image();
        img.onload = function () {
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        return img
    }
    public getSVGdata() {
        return this.svgString
    }



}


export { Text2Sign }