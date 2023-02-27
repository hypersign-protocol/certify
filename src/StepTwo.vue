<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <input type="file" accept="application/pdf" class="fileinput" @change="onChange">

        </div>




        <div class="card" style="margin: 0">
            <div class="card" v-if="pdf && !hide" id="buttons">
                <button @click="previousPage"> {{ "<<" }} </button>
                        <input v-model="currentPage" disabled style="width: 20px; height: 25px; text-align: center;">
                        <button @click="nextPage">{{ ">>" }}</button>
                        <!-- <button @click="addSignature">Sign</button> -->
            </div>
            <br>
            <div> <canvas ref="pdfcanvas" id="myCanvas"></canvas>
            </div>
            <br>
            <button v-if="savebtn" @click="save">Save</button>


        </div>
        <div class="card" style="margin: 3rem" v-if="pdf && !hideSignPad">
            <p class="card-header-title">
                Type your signature
            </p>


            <div style="border: 5px solid #8080804f; margin: 20px; border-radius: 10px;">
                <VPerfectSignature :stroke-options="strokeOptions" ref="signaturePad" width="100%" />
            </div>
            <div class="card-footer">
                <a class="card-footer-item" @click="attachSignature">Attach</a>
                <a class="card-footer-item" @click="clear">Clear</a>

            </div>
        </div>



    </div>
</template>

<script>

// import { PDFDocument } from 'pdf-lib'
import VPerfectSignature from 'v-perfect-signature'

import { mapState, mapMutations } from 'vuex';
// import { PDFViewer } from "pdfjs-dist/web/pdf_viewer";
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { fabric } from "fabric";


export default {
    props: ['currentStep'],
    components: { VPerfectSignature },


    data() {
        return {
            strokeOptions: {
                size: 10,
                thinning: 0.75,
                smoothing: 0.5,
                streamline: 0.5,
            },
            savebtn: false,
            hideSignPad: false,
            hide: false,
            loaded: false,
            pdf: null,
            pdfDoc: null,
            pdfData: null,
            pages: [],
            sig: {},
            viewPort: {},

            currentPage: 1,
            totalPages: 0,
            canvas: null,
            fabricCanvas: null,
            page: null

        }
    },
    computed: {
        ...mapState("globalStore", ["pdfDocObject"]),

    },
    created() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Delete') {
                this.canvas.remove(this.canvas.getActiveObject())
            }
        })
    },
    mounted() {
        // this.canvas = document.getElementById('myCanvas')
        console.log(this.$refs);
        // window.addEventListener('resize', this.onWindowResize)
        // this.canvas.on({
        //     'selection:created': () => {
        //         this.$refs.del.style.display = 'inline-block'
        //     }

        // })
        // this.canvas.on({
        //     'selection:cleared': () => {
        //         this.$refs.del.style.display = 'none'
        //     }
        // })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {


        ...mapMutations("globalStore", ['setPDFDoc']),
        save() {
            this.savebtn = false
            this.canvas.discardActiveObject().renderAll();
            this.canvas.forEachObject(function (object) {
                object.selectable = false;
            });

            const signaturePage = this.canvas.toDataURL({
                format: 'png',
                quality: 1
            })
            console.log(signaturePage);
            this.setPDFDoc({ pdfDoc: this.pdfDoc, signature: signaturePage, pageNum: this.currentPage })

            this.$emit('can-continue', { value: true });



        },
        drawSignatureOnCanvas(sig) {
            this.hide = true

            // always when there is a need to  interact then init fabric its nothing but a wrapper

            const canvas = document.getElementById("myCanvas")
            const background = canvas.toDataURL("image/png");
            const fabricCanvas = new fabric.Canvas("myCanvas", {
                selection: false,
            })
            const ctx=fabricCanvas.getContext('2d')
            ctx.imageSmoothingEnabled=false
            fabricCanvas.setDimensions({
                width: this.viewPort.width,
                height: this.viewPort.height
            });
            fabricCanvas.setBackgroundImage(background, fabricCanvas.renderAll.bind(fabricCanvas))

            sig.on({
                'moving': () => {
                    sig.set({
                        top: sig.top,
                        left: sig.left,
                        width: sig.width,
                        height: sig.height

                    })
                    this.sig = sig

                }
            })

            fabricCanvas.on({
                'selection:created': () => {
                    this.savebtn = true
                }
            })

            fabricCanvas.on({
                'selection:cleared': () => {
                    this.savebtn = false
                }
            })

            fabricCanvas.add(sig)
            fabricCanvas.renderAll()
            this.canvas = fabricCanvas
            this.hideSignPad = true



        },
        render() {

            let loadingTask = pdfjsLib.getDocument({ data: this.pdfDoc })
            loadingTask.promise.then((pdf) => {
                if (this.pdf) {
                    this.pdf.destroy()
                }
                this.pdf = pdf
                this.totalPages = pdf.numPages

                this.pdf.getPage(this.currentPage).then((page) => {
                    this.page = page
                    const canvas = document.getElementById('myCanvas')
                    const ctx=canvas.getContext('2d')
                    ctx.imageSmoothingEnabled=false
                    console.log({ width: page.view[2], height: page.view[3] });
                    // canvas.setDimensions({ width: page.view[2], height: page.view[3] });

                    canvas.width = 50 * window.innerWidth / 100
                    canvas.height = 100 * window.innerHeight / 100
                    const viewport = page.getViewport({ scale: 1 })
                    const scale = Math.min(canvas.width / viewport.width, canvas.height / viewport.height)
                    const scaledViewport = page.getViewport({ scale: scale })

                    canvas.width = scaledViewport.width;
                    canvas.height = scaledViewport.height;
                    this.viewPort = scaledViewport


                    // canvas.setDimensions({
                    //     width: scaledViewport.width,
                    //     height: scaledViewport.height
                    // });

                    const renderContext = {
                        canvasContext: canvas.getContext('2d'),
                        viewport: page.getViewport({ scale: scale })
                    };
                    page.render(renderContext).promise.then(() => {
                        // let bg = canvas.toDataURL("image/png");
                        // console.log(bg);
                        // let fcanvas = new fabric.Canvas("myCanvas", { selection: false,
                        //     preserveObjectStacking:true })
                        // fcanvas.setBackgroundImage(bg, fcanvas.renderAll.bind(fcanvas));
                        // let rect = new fabric.Rect({
                        //     left: 100,
                        //     top: 100,
                        //     width: 50,
                        //     height: 50,
                        //     fill: '#FF454F',
                        //     opacity: 0.5,
                        //     transparentCorners: true,
                        //     borderColor: "gray",
                        //     cornerColor: "gray",
                        //     cornerSize: 5
                        // });
                        // fcanvas.add(rect);

                        // fcanvas.renderAll()
                    })

                })

                this.$emit('can-continue', { value: false });

            })

        }
        ,
        onChange(e) {

            if (!e.target.files.length) return;
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async e => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js'
                let src = e.target.result;
                this.currentPage = 1
                this.pdfDoc = src
                this.render()


            }



        },
        clear() {
            this.$refs.signaturePad?.clear()
        },
        attachSignature() {
            const dataURL = this.$refs.signaturePad.toDataURL()
            fabric.Image.fromURL(dataURL, (img) => {
                img.set({
                    top: 50,
                    left: 10,
                })

                this.drawSignatureOnCanvas(img)
            })
            this.clear()
        }
        ,

        nextPage() {
            this.currentPage += 1
            this.currentPage = this.currentPage > this.totalPages ? 1 : this.currentPage
            this.render()

        },
        previousPage() {
            this.currentPage -= 1
            this.currentPage = this.currentPage < 1 ? this.totalPages : this.currentPage
            this.render()
        },
        onWindowResize() {
            this.render()
        }


        ,

    }
}


</script>
<style>
#myCanvas {
    width: 100%;
    height: 100%;
}

#buttons {
    border: none !important;
    color: aliceblue !important;
}
</style>