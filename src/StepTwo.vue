<template>
    <div style="padding: 2rem 3rem; text-align: left;">
        <div class="card" style="margin: 3rem">
            <input type="file" accept="application/pdf" class="fileinput" @change="onChange">
        </div>




        <div class="card" style="margin: 0">
            <div class="card" v-if="pdf" id="buttons">
                <button @click="previousPage"> {{ "<<" }} </button>
                        <input v-model="currentPage" disabled style="width: 20px; height: 25px; text-align: center;">
                        <button @click="nextPage">{{ ">>" }}</button>
                        <!-- <button @click="addSignature">Sign</button> -->
            </div>
            <br>
            <div> <canvas ref="pdfcanvas" id="myCanvas"></canvas>
            </div>
            <br>


        </div>
        <div class="card" style="margin: 3rem" v-if="pdf">
            <p class="card-header-title">
                Type your signature
            </p>
            <button ref="del">Delete</button>

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
                size: 5,
                thinning: 0.75,
                smoothing: 0.5,
                streamline: 0.5,
            },
            loaded: false,
            pdf: null,
            pdfDoc: null,
            pdfData: null,
            pages: [],

            currentPage: 1,
            totalPages: 0,
            canvas: null,
            fabricCanvas: null,
            hide: true,
            page: null,
            Base64Prefix : "data:application/pdf;base64,"
        }
    },
    computed: {
        ...mapState("globalStore", ["pdfDocument"]),

    },
    mounted() {
        this.canvas = new fabric.Canvas('myCanvas', {
            preserveObjectStacking: true,
            isDrawingMode:  true,
        })
        console.log(this.$refs);
        window.addEventListener('resize', this.onWindowResize)
        this.canvas.on({
            'selection:created': () => {
                this.$refs.del.style.display = 'inline-block'
            }

        })
        this.canvas.on({
            'selection:cleared': () => {
                this.$refs.del.style.display = 'none'
            }
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onWindowResize)
    },
    methods: {

        ...mapMutations("globalStore", ['setPDFDoc']),

        render(pdf, pageNumber) {
            return pdf.getPage(pageNumber).then((page) => {
                            //  retina scaling
                            const viewport = page.getViewport({ scale: window.devicePixelRatio });
                            // Prepare canvas using PDF page dimensions
                            const canvas = document.createElement('canvas');
                            const context = canvas.getContext('2d');
                            
                            canvas.height = viewport.height
                            canvas.width = viewport.width;
                            // Render PDF page into canvas context
                            const renderContext = {
                                canvasContext: context,
                                viewport: viewport
                            };
                            const renderTask = page.render(renderContext);
                            return renderTask.promise.then(() => canvas);
                
            })
        },
         getPdfHandler() {
            return window['pdfjs-dist/build/pdf'];
        },
        readBlob(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.addEventListener('load', () => resolve(reader.result));
                reader.addEventListener('error', reject)
                reader.readAsDataURL(blob);
            })
        },
        async onChange(e) {
            let  pdfData = e.target.files[0];

            
            pdfData = pdfData instanceof Blob ? await this.readBlob(pdfData) : pdfData;
            const data = atob(pdfData.startsWith(this.Base64Prefix) ? pdfData.substring(this.Base64Prefix.length) : pdfData);

            // const pdfjsLib = await this.getPdfHandler();
            let loadingTask = pdfjsLib.getDocument({ data })
                loadingTask.promise.then(async (pdf) => {
                    this.pdf = pdf
                    this.totalPages = pdf.numPages
                    this.currentPage = 1;
                    const renderedPage = await this.render(pdf, this.currentPage);
                    const scale = 1 / window.devicePixelRatio;
                    this.canvas.add(new fabric.Image(await renderedPage, {
                        scaleX: scale,
                        scaleY: scale,
                    }));
                    // pdf.getPage(1).then(function(page) {
                        
                    // });
            })

            // if (!e.target.files.length) return;
            // let file = e.target.files[0];
            // let reader = new FileReader();
            // reader.readAsArrayBuffer(file);
            // reader.onload = async (e) => {
            //     // pdfjsLib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.min.js'
            //     // let src = e.target.result;
            //     // this.pdfDoc = src
                

            // }



        },
        clear() {
            this.$refs.signaturePad?.clear()
        },
        attachSignature() {
            const dataURL = this.$refs.signaturePad.toDataURL()
            console.log(dataURL);
            fabric.Image.fromURL(dataURL,(img)=>{
            this.canvas.add(img)
        })}
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